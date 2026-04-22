const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const dotenv = require('dotenv');
const { requestLogger } = require('./app/middlewares/requestLogger');
const { createRateLimiter } = require('./app/middlewares/rateLimiter');
const premiumPlacementService = require('./app/services/premiumPlacement.service.js');
const tourismPaymentService = require('./app/services/pillars/culturalTourismPayment.service.js');

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5000);
const TRUST_PROXY = process.env.TRUST_PROXY === 'true';
const REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS || 30000);
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60000);
const RATE_LIMIT_MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 120);

app.disable('x-powered-by');
if (TRUST_PROXY) {
  app.set('trust proxy', 1);
}

const corsAllowList = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || corsAllowList.length === 0 || corsAllowList.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('CORS origin not allowed'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

app.use((req, res, next) => {
  const requestId =
    typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

app.use(requestLogger);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use(
  createRateLimiter({
    windowMs: RATE_LIMIT_WINDOW_MS,
    maxRequests: RATE_LIMIT_MAX_REQUESTS,
    prefix: 'indigena-api',
    redisUrl: process.env.REDIS_URL,
  })
);

app.use((req, res, next) => {
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      res.status(503).json({
        success: false,
        message: 'Request timed out',
        requestId: req.requestId,
      });
    }
  }, REQUEST_TIMEOUT_MS);

  res.on('finish', () => clearTimeout(timeout));
  res.on('close', () => clearTimeout(timeout));
  next();
});

global.reqCnt = 0;
global.tagreq = '';

require('./app/version.js')(app);
const router = require('./app/routes/ui.route.js');
app.use('/api', router);

app.get('/healthz', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'indigena-backend',
    ts: new Date().toISOString(),
  });
});

app.get('/readyz', (_req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
  const requiredTourismTypes = [
    'tour_hero_banner',
    'tour_operator_spotlight',
    'tour_sponsored_card',
    'tour_region_boost',
    'tour_newsletter_feature',
    'tour_seasonal_takeover'
  ];
  const tourismPlacementReady = requiredTourismTypes.every((typeId) => Boolean(premiumPlacementService.getPlacementType(typeId)));
  const tourismPaymentProvider = tourismPaymentService.getProvider();
  const requireRealPayments = process.env.TOURISM_REQUIRE_REAL_PAYMENTS === 'true';
  const tourismPaymentReady = requireRealPayments ? tourismPaymentProvider !== 'simulated' : true;
  const tourismReady = tourismPlacementReady && tourismPaymentReady;
  const enforceTourismReady = process.env.TOURISM_STRICT_READINESS === 'true';

  if (!dbReady) {
    return res.status(503).json({
      status: 'not-ready',
      db: mongoose.connection.readyState,
      tourismReady
    });
  }

  if (enforceTourismReady && !tourismReady) {
    return res.status(503).json({
      status: 'not-ready',
      db: mongoose.connection.readyState,
      tourismReady,
      tourismPlacementReady,
      tourismPaymentProvider,
      tourismPaymentReady
    });
  }

  return res.status(200).json({
    status: 'ready',
    db: mongoose.connection.readyState,
    tourismReady,
    tourismPlacementReady,
    tourismPaymentProvider,
    tourismPaymentReady
  });
});

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: 'Route not found',
      requestId: req.requestId,
    });
  }
  return next();
});

app.use((err, req, res, _next) => {
  const status = err && err.message === 'CORS origin not allowed' ? 403 : 500;
  const safeMessage = status === 500 ? 'Internal server error' : err.message;

  console.error(`[${req.requestId}]`, err);
  res.status(status).json({
    success: false,
    message: safeMessage,
    requestId: req.requestId,
  });
});

mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Successfully connected to the database');
  })
  .catch((err) => {
    console.log('Could not connect to the database.', err);
  });

const server = app.listen(PORT, () => {
  console.log('port', PORT);
});

function shutdown(signal) {
  console.log(`Received ${signal}. Closing server...`);
  server.close(() => {
    mongoose.connection.close(false, () => {
      process.exit(0);
    });
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
