const crypto = require('crypto');

const REQUEST_LOG_ENABLED = process.env.REQUEST_LOG_ENABLED !== 'false';
const LOG_SHIP_ENDPOINT = process.env.LOG_SHIP_ENDPOINT || '';
const LOG_SHIP_TOKEN = process.env.LOG_SHIP_TOKEN || '';
const OPS_SIGNAL_WEBHOOK_URL = process.env.OPS_SIGNAL_WEBHOOK_URL || '';
const OPS_SIGNAL_WINDOW_MS = Number(process.env.OPS_SIGNAL_ERROR_RATE_WINDOW_MS || 60000);
const OPS_SIGNAL_MIN_REQUESTS = Number(process.env.OPS_SIGNAL_MIN_REQUESTS || 50);
const OPS_SIGNAL_ERROR_RATE = Number(process.env.OPS_SIGNAL_ERROR_RATE_THRESHOLD || 0.15);
const OPS_SIGNAL_COOLDOWN_MS = Number(process.env.OPS_SIGNAL_COOLDOWN_MS || 120000);

const windows = new Map();
let lastSignalAt = 0;

function maskIp(ip) {
  if (!ip) return 'unknown';
  if (ip.indexOf(':') !== -1) {
    const parts = ip.split(':');
    return parts.slice(0, 4).join(':') + '::';
  }
  const parts = ip.split('.');
  if (parts.length !== 4) return ip;
  return parts[0] + '.' + parts[1] + '.x.x';
}

function routeTierForPath(path) {
  const p = path || '';
  if (p.startsWith('/api/admin')) return 'admin';
  if (p.startsWith('/api/digital-arts')) return 'digital-arts';
  if (p.startsWith('/api/physical-items')) return 'physical-items';
  if (p.startsWith('/api/freelancers')) return 'freelancing';
  if (p.startsWith('/api/courses')) return 'courses';
  if (p.startsWith('/api/seva')) return 'seva';
  return 'default';
}

function trackWindow(path, status) {
  const now = Date.now();
  const tier = routeTierForPath(path);
  const current = windows.get(tier);
  if (!current || now > current.windowStart + OPS_SIGNAL_WINDOW_MS) {
    const reset = { tier: tier, windowStart: now, total: 1, errors: status >= 500 ? 1 : 0 };
    windows.set(tier, reset);
    return reset;
  }
  current.total += 1;
  if (status >= 500) current.errors += 1;
  return current;
}

async function postJson(url, body, token) {
  if (!url) return;
  const controller = new AbortController();
  const timeout = setTimeout(function () { controller.abort(); }, 1000);
  try {
    await fetch(url, {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}),
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (_) {} finally {
    clearTimeout(timeout);
  }
}

function requestLogger(req, res, next) {
  if (!REQUEST_LOG_ENABLED) return next();
  const startedAt = Date.now();
  const requestId = req.requestId || (typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Date.now() + '-' + Math.random().toString(16).slice(2));
  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  res.on('finish', function () {
    const durationMs = Date.now() - startedAt;
    const path = req.originalUrl || req.url;
    const payload = {
      level: 'info',
      msg: 'http_request',
      ts: new Date().toISOString(),
      requestId: requestId,
      method: req.method,
      path: path,
      status: res.statusCode,
      durationMs: durationMs,
      routeTier: routeTierForPath(path),
      ip: maskIp(req.ip || (req.socket ? req.socket.remoteAddress : '')),
      userAgent: req.headers['user-agent'] || '',
    };
    console.log(JSON.stringify(payload));
    void postJson(LOG_SHIP_ENDPOINT, payload, LOG_SHIP_TOKEN);
    const windowState = trackWindow(path, res.statusCode);
    const errorRate = windowState.total > 0 ? windowState.errors / windowState.total : 0;
    if (windowState.total >= OPS_SIGNAL_MIN_REQUESTS && errorRate >= OPS_SIGNAL_ERROR_RATE && Date.now() - lastSignalAt >= OPS_SIGNAL_COOLDOWN_MS) {
      lastSignalAt = Date.now();
      const signalPayload = {
        level: 'error',
        msg: 'ops_signal',
        ts: new Date().toISOString(),
        tier: windowState.tier,
        total: windowState.total,
        errors: windowState.errors,
        errorRate: errorRate,
        windowMs: OPS_SIGNAL_WINDOW_MS,
      };
      console.error(JSON.stringify(signalPayload));
      void postJson(OPS_SIGNAL_WEBHOOK_URL, signalPayload, LOG_SHIP_TOKEN);
    }
  });
  return next();
}

module.exports = { requestLogger };
