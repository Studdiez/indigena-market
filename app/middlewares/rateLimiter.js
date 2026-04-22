const DEFAULT_ROUTE_TIERS = [
  {
    name: 'admin',
    match: '/api/admin',
    windowMs: 60000,
    maxRequests: 60,
    circuitTriggerCount: 50,
    circuitOpenMs: 30000,
  },
  {
    name: 'mutations',
    match: '/api',
    methods: ['POST', 'PUT', 'PATCH', 'DELETE'],
    windowMs: 60000,
    maxRequests: 90,
    circuitTriggerCount: 80,
    circuitOpenMs: 30000,
  },
  {
    name: 'default',
    match: '/api',
    windowMs: 60000,
    maxRequests: 150,
    circuitTriggerCount: 120,
    circuitOpenMs: 20000,
  },
];

function parseTierConfig() {
  const raw = process.env.RATE_LIMIT_TIERS_JSON;
  if (!raw) return DEFAULT_ROUTE_TIERS;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_ROUTE_TIERS;
  } catch {
    return DEFAULT_ROUTE_TIERS;
  }
}

function tryCreateRedisClient(redisUrl) {
  if (!redisUrl) return null;

  try {
    const Redis = require('ioredis');
    return new Redis(redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableReadyCheck: true,
      reconnectOnError() {
        return true;
      },
    });
  } catch {
    return null;
  }
}

function createInMemoryLimiter(windowMs, maxRequests) {
  const buckets = new Map();

  return {
    async consume(key) {
      const now = Date.now();
      const current = buckets.get(key);
      if (!current || now >= current.resetAt) {
        const next = { count: 1, resetAt: now + windowMs };
        buckets.set(key, next);
        return { allowed: true, remaining: Math.max(maxRequests - 1, 0), resetAt: next.resetAt };
      }

      current.count += 1;
      const remaining = Math.max(maxRequests - current.count, 0);
      return { allowed: current.count <= maxRequests, remaining, resetAt: current.resetAt };
    },
  };
}

function createRedisLimiter(redisClient, windowMs, maxRequests, prefix) {
  return {
    async consume(key) {
      const redisKey = `${prefix}:${key}`;
      const ttlMs = await redisClient.pttl(redisKey);
      const pipeline = redisClient.multi();
      pipeline.incr(redisKey);
      if (ttlMs < 0) {
        pipeline.pexpire(redisKey, windowMs);
      }
      const results = await pipeline.exec();
      const count = Number(results?.[0]?.[1] || 0);

      const resetAt = Date.now() + (ttlMs > 0 ? ttlMs : windowMs);
      return {
        allowed: count <= maxRequests,
        remaining: Math.max(maxRequests - count, 0),
        resetAt,
      };
    },
  };
}

function resolveTier(routeTiers, path, method) {
  for (const tier of routeTiers) {
    const prefixMatch = typeof tier.match === 'string' ? path.startsWith(tier.match) : false;
    if (!prefixMatch) continue;

    if (Array.isArray(tier.methods) && tier.methods.length > 0) {
      if (!tier.methods.includes(method)) continue;
    }

    return tier;
  }

  return routeTiers[routeTiers.length - 1] || {
    name: 'fallback',
    windowMs: 60000,
    maxRequests: 120,
    circuitTriggerCount: 100,
    circuitOpenMs: 20000,
  };
}

function createRateLimiter(options = {}) {
  const defaultWindow = Number(options.windowMs || process.env.RATE_LIMIT_WINDOW_MS || 60000);
  const defaultMaxRequests = Number(options.maxRequests || process.env.RATE_LIMIT_MAX_REQUESTS || 120);
  const prefix = options.prefix || process.env.RATE_LIMIT_PREFIX || 'ratelimit';
  const redisUrl = options.redisUrl || process.env.REDIS_URL;
  const requireRedis = process.env.NODE_ENV === 'production' || process.env.REQUIRE_REDIS_RATE_LIMIT === 'true';

  const routeTiers = parseTierConfig().map((tier) => ({
    ...tier,
    windowMs: Number(tier.windowMs || defaultWindow),
    maxRequests: Number(tier.maxRequests || defaultMaxRequests),
    circuitTriggerCount: Number(tier.circuitTriggerCount || Math.max(1, Math.round((tier.maxRequests || defaultMaxRequests) * 0.8))),
    circuitOpenMs: Number(tier.circuitOpenMs || 30000),
  }));

  const memoryLimiters = new Map();
  const redisLimiters = new Map();
  const circuitState = new Map();
  const redisClient = tryCreateRedisClient(redisUrl);
  let redisReady = false;

  if (redisClient) {
    redisClient
      .connect()
      .then(() => {
        redisReady = true;
        console.log('[rate-limit] redis enabled');
      })
      .catch((error) => {
        redisReady = false;
        console.warn('[rate-limit] redis unavailable, falling back to memory:', error?.message || error);
      });
  }

  function getLimiter(tier) {
    const key = String(tier.name || 'default');
    if (redisClient && redisReady) {
      if (!redisLimiters.has(key)) {
        redisLimiters.set(key, createRedisLimiter(redisClient, tier.windowMs, tier.maxRequests, `${prefix}:${key}`));
      }
      return redisLimiters.get(key);
    }

    if (!memoryLimiters.has(key)) {
      memoryLimiters.set(key, createInMemoryLimiter(tier.windowMs, tier.maxRequests));
    }
    return memoryLimiters.get(key);
  }

  function getCircuit(tierName, tierWindowMs) {
    const now = Date.now();
    const existing = circuitState.get(tierName);
    if (!existing || now > existing.windowStart + tierWindowMs) {
      const next = {
        windowStart: now,
        limitedCount: 0,
        openUntil: 0,
      };
      circuitState.set(tierName, next);
      return next;
    }
    return existing;
  }

  return async function rateLimiter(req, res, next) {
    const path = req.path || req.originalUrl || '/';
    const method = req.method || 'GET';
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    const tier = resolveTier(routeTiers, path, method);
    const tierName = String(tier.name || 'default');

    if (requireRedis && (!redisClient || !redisReady)) {
      return res.status(503).json({
        success: false,
        message: 'Rate limiter backend unavailable (redis required)',
        requestId: req.requestId,
      });
    }

    const circuit = getCircuit(tierName, tier.windowMs);
    if (Date.now() < circuit.openUntil) {
      res.setHeader('Retry-After', String(Math.ceil((circuit.openUntil - Date.now()) / 1000)));
      return res.status(503).json({
        success: false,
        message: 'Service temporarily throttled for stability',
        requestId: req.requestId,
        tier: tierName,
      });
    }

    const key = `${ip}:${method}`;

    try {
      const limiter = getLimiter(tier);
      const result = await limiter.consume(key);

      res.setHeader('X-RateLimit-Tier', tierName);
      res.setHeader('X-RateLimit-Limit', String(tier.maxRequests));
      res.setHeader('X-RateLimit-Remaining', String(result.remaining));
      res.setHeader('X-RateLimit-Reset', String(Math.ceil(result.resetAt / 1000)));

      if (!result.allowed) {
        circuit.limitedCount += 1;
        if (circuit.limitedCount >= tier.circuitTriggerCount) {
          circuit.openUntil = Date.now() + tier.circuitOpenMs;
          console.warn(`[rate-limit] circuit open tier=${tierName} openMs=${tier.circuitOpenMs}`);
        }

        res.setHeader('Retry-After', String(Math.ceil((result.resetAt - Date.now()) / 1000)));
        return res.status(429).json({
          success: false,
          message: 'Too many requests',
          requestId: req.requestId,
          tier: tierName,
        });
      }

      return next();
    } catch (error) {
      console.warn('[rate-limit] check failed, continuing request:', error?.message || error);
      return next();
    }
  };
}

module.exports = { createRateLimiter };
