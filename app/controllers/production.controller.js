/**
 * Production Readiness Controller
 * API endpoints for production services
 */

const rateLimiting = require('../services/production/rateLimiting.service.js');
const caching = require('../services/production/caching.service.js');
const healthCheck = require('../services/production/healthCheck.service.js');
const apiVersioning = require('../services/production/apiVersioning.service.js');
const webhook = require('../services/production/webhook.service.js');

// ==================== RATE LIMITING ====================

exports.checkRateLimit = async (req, res) => {
  try {
    const { identifier, tier, endpoint } = req.body;
    const result = await rateLimiting.checkLimit(identifier, tier, endpoint);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getRateLimitUsage = async (req, res) => {
  try {
    const { identifier } = req.params;
    const result = await rateLimiting.getUsage(identifier);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.banIdentifier = async (req, res) => {
  try {
    const { identifier, reason, duration } = req.body;
    const result = await rateLimiting.ban(identifier, reason, duration);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.unbanIdentifier = async (req, res) => {
  try {
    const { identifier } = req.body;
    const result = await rateLimiting.unban(identifier);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.whitelistIdentifier = async (req, res) => {
  try {
    const { identifier, reason } = req.body;
    const result = await rateLimiting.whitelist(identifier, reason);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getBannedList = async (req, res) => {
  try {
    const result = await rateLimiting.getBannedList();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getWhitelist = async (req, res) => {
  try {
    const result = await rateLimiting.getWhitelist();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.cleanupRateLimits = async (req, res) => {
  try {
    const result = await rateLimiting.cleanup();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== CACHING ====================

exports.cacheGet = async (req, res) => {
  try {
    const { key } = req.params;
    const result = await caching.get(key);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.cacheSet = async (req, res) => {
  try {
    const { key, value, ttl } = req.body;
    const result = await caching.set(key, value, ttl);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.cacheDelete = async (req, res) => {
  try {
    const { key } = req.params;
    const result = await caching.delete(key);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.cacheFlush = async (req, res) => {
  try {
    const result = await caching.flush();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.cacheStats = async (req, res) => {
  try {
    const result = await caching.getStats();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.cacheKeys = async (req, res) => {
  try {
    const { pattern } = req.query;
    const result = await caching.keys(pattern || '*');
    res.status(200).json({ success: true, keys: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== HEALTH CHECKS ====================

exports.healthCheck = async (req, res) => {
  try {
    const result = await healthCheck.runAllChecks();
    const statusCode = result.status === 'healthy' ? 200 : result.status === 'degraded' ? 200 : 503;
    res.status(statusCode).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.healthCheckSingle = async (req, res) => {
  try {
    const { name } = req.params;
    const result = await healthCheck.runCheck(name);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.healthStatus = async (req, res) => {
  try {
    const result = await healthCheck.getStatus();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.healthMetrics = async (req, res) => {
  try {
    const result = await healthCheck.getMetrics();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.readinessCheck = async (req, res) => {
  try {
    const result = await healthCheck.getReadiness();
    const statusCode = result.ready ? 200 : 503;
    res.status(statusCode).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.livenessCheck = async (req, res) => {
  try {
    const result = await healthCheck.getLiveness();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.registeredChecks = async (req, res) => {
  try {
    const result = await healthCheck.getRegisteredChecks();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== API VERSIONING ====================

exports.getVersions = async (req, res) => {
  try {
    const result = await apiVersioning.getAllVersions();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getVersion = async (req, res) => {
  try {
    const { version } = req.params;
    const result = await apiVersioning.getVersion(version);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getChangelog = async (req, res) => {
  try {
    const { version } = req.params;
    const result = await apiVersioning.getChangelog(version);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getMigrationGuide = async (req, res) => {
  try {
    const { from, to } = req.query;
    const result = await apiVersioning.getMigrationGuide(from, to);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== WEBHOOKS ====================

exports.registerWebhook = async (req, res) => {
  try {
    const result = await webhook.registerWebhook(req.body);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.listWebhooks = async (req, res) => {
  try {
    const result = await webhook.listWebhooks();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getWebhook = async (req, res) => {
  try {
    const { webhookId } = req.params;
    const result = await webhook.getWebhook(webhookId);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateWebhook = async (req, res) => {
  try {
    const { webhookId } = req.params;
    const result = await webhook.updateWebhook(webhookId, req.body);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteWebhook = async (req, res) => {
  try {
    const { webhookId } = req.params;
    const result = await webhook.deleteWebhook(webhookId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.sendWebhookEvent = async (req, res) => {
  try {
    const { eventType, payload, options } = req.body;
    const result = await webhook.sendEvent(eventType, payload, options);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getWebhookDeliveries = async (req, res) => {
  try {
    const { webhookId } = req.params;
    const { limit } = req.query;
    const result = await webhook.getDeliveries(webhookId, parseInt(limit) || 50);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getWebhookEventTypes = async (req, res) => {
  try {
    const result = await webhook.getEventTypes();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.testWebhook = async (req, res) => {
  try {
    const { webhookId } = req.params;
    const result = await webhook.testWebhook(webhookId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
