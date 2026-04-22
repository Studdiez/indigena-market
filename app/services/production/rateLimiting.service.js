/**
 * Rate Limiting Service
 * Prevent API abuse with tiered rate limits
 */

class RateLimitingService {
  constructor() {
    this.requests = new Map();
    this.banned = new Set();
    this.whitelist = new Set();
    this.initializeLimits();
  }

  initializeLimits() {
    // Rate limits by tier (requests per window)
    this.limits = {
      anonymous: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100,
        description: 'Non-authenticated users'
      },
      free: {
        windowMs: 15 * 60 * 1000,
        maxRequests: 300,
        description: 'Authenticated free users'
      },
      premium: {
        windowMs: 15 * 60 * 1000,
        maxRequests: 1000,
        description: 'Premium subscribers'
      },
      enterprise: {
        windowMs: 15 * 60 * 1000,
        maxRequests: 5000,
        description: 'Enterprise API clients'
      },
      internal: {
        windowMs: 15 * 60 * 1000,
        maxRequests: 10000,
        description: 'Internal services'
      }
    };

    // Endpoint-specific limits
    this.endpointLimits = {
      'POST /api/xrpl/mint': { tier: 'free', maxRequests: 10 }, // Limited minting
      'POST /api/ai/analyze': { tier: 'premium', maxRequests: 50 }, // AI is expensive
      'POST /api/bulk/mint': { tier: 'premium', maxRequests: 5 }, // Bulk operations
      'GET /api/analytics/realtime': { tier: 'premium', maxRequests: 100 },
      'POST /api/governance/votes/cast': { tier: 'free', maxRequests: 50 } // Voting
    };
  }

  /**
   * Check if request is allowed
   */
  async checkLimit(identifier, tier = 'anonymous', endpoint = null) {
    try {
      // Check whitelist
      if (this.whitelist.has(identifier)) {
        return { allowed: true, remaining: Infinity };
      }

      // Check blacklist
      if (this.banned.has(identifier)) {
        return { allowed: false, reason: 'banned', retryAfter: null };
      }

      // Get limit config
      let limitConfig = this.limits[tier] || this.limits.anonymous;
      
      // Check endpoint-specific limits
      if (endpoint && this.endpointLimits[endpoint]) {
        const endpointLimit = this.endpointLimits[endpoint];
        if (tier === endpointLimit.tier || this.getTierPriority(tier) < this.getTierPriority(endpointLimit.tier)) {
          limitConfig = { ...limitConfig, maxRequests: endpointLimit.maxRequests };
        }
      }

      const now = Date.now();
      const windowStart = now - limitConfig.windowMs;

      // Get or create request record
      let record = this.requests.get(identifier);
      if (!record) {
        record = {
          requests: [],
          tier: tier,
          firstRequest: now
        };
        this.requests.set(identifier, record);
      }

      // Clean old requests outside window
      record.requests = record.requests.filter(time => time > windowStart);

      // Check if limit exceeded
      if (record.requests.length >= limitConfig.maxRequests) {
        const oldestRequest = record.requests[0];
        const retryAfter = Math.ceil((oldestRequest + limitConfig.windowMs - now) / 1000);
        
        return {
          allowed: false,
          reason: 'rate_limit_exceeded',
          limit: limitConfig.maxRequests,
          current: record.requests.length,
          retryAfter: retryAfter,
          windowMs: limitConfig.windowMs
        };
      }

      // Record this request
      record.requests.push(now);

      return {
        allowed: true,
        limit: limitConfig.maxRequests,
        remaining: limitConfig.maxRequests - record.requests.length,
        resetTime: now + limitConfig.windowMs
      };
    } catch (error) {
      console.error('Rate limit check error:', error);
      // Fail open - allow request on error
      return { allowed: true, error: error.message };
    }
  }

  /**
   * Get tier priority (lower = more privileged)
   */
  getTierPriority(tier) {
    const priorities = {
      internal: 0,
      enterprise: 1,
      premium: 2,
      free: 3,
      anonymous: 4
    };
    return priorities[tier] || 4;
  }

  /**
   * Ban an identifier
   */
  async ban(identifier, reason, duration = null) {
    this.banned.add(identifier);
    
    const banRecord = {
      identifier: identifier,
      reason: reason,
      bannedAt: new Date().toISOString(),
      expiresAt: duration ? new Date(Date.now() + duration).toISOString() : null
    };

    // Auto-unban after duration
    if (duration) {
      setTimeout(() => {
        this.banned.delete(identifier);
      }, duration);
    }

    return {
      success: true,
      identifier: identifier,
      banned: true
    };
  }

  /**
   * Unban an identifier
   */
  async unban(identifier) {
    this.banned.delete(identifier);
    return {
      success: true,
      identifier: identifier,
      banned: false
    };
  }

  /**
   * Add to whitelist
   */
  async whitelist(identifier, reason) {
    this.whitelist.add(identifier);
    return {
      success: true,
      identifier: identifier,
      whitelisted: true,
      reason: reason
    };
  }

  /**
   * Remove from whitelist
   */
  async unwhitelist(identifier) {
    this.whitelist.delete(identifier);
    return {
      success: true,
      identifier: identifier,
      whitelisted: false
    };
  }

  /**
   * Get current usage for identifier
   */
  async getUsage(identifier) {
    const record = this.requests.get(identifier);
    if (!record) {
      return {
        identifier: identifier,
        requests: 0,
        tier: 'anonymous'
      };
    }

    const limitConfig = this.limits[record.tier] || this.limits.anonymous;
    const now = Date.now();
    const windowStart = now - limitConfig.windowMs;
    const recentRequests = record.requests.filter(time => time > windowStart);

    return {
      identifier: identifier,
      tier: record.tier,
      requests: recentRequests.length,
      limit: limitConfig.maxRequests,
      remaining: Math.max(0, limitConfig.maxRequests - recentRequests.length),
      windowMs: limitConfig.windowMs
    };
  }

  /**
   * Get rate limit status for response headers
   */
  async getHeaders(identifier, tier = 'anonymous') {
    const status = await this.checkLimit(identifier, tier);
    
    return {
      'X-RateLimit-Limit': status.limit,
      'X-RateLimit-Remaining': status.remaining,
      'X-RateLimit-Reset': status.resetTime
    };
  }

  /**
   * Middleware for Express
   */
  middleware(options = {}) {
    return async (req, res, next) => {
      try {
        const identifier = req.ip || req.connection.remoteAddress;
        const tier = req.user?.tier || 'anonymous';
        const endpoint = `${req.method} ${req.path}`;

        const result = await this.checkLimit(identifier, tier, endpoint);

        // Add rate limit headers
        res.set({
          'X-RateLimit-Limit': result.limit,
          'X-RateLimit-Remaining': result.remaining,
          'X-RateLimit-Reset': result.resetTime
        });

        if (!result.allowed) {
          return res.status(429).json({
            success: false,
            error: 'Rate limit exceeded',
            message: `Too many requests. Retry after ${result.retryAfter} seconds.`,
            retryAfter: result.retryAfter,
            limit: result.limit,
            current: result.current
          });
        }

        next();
      } catch (error) {
        console.error('Rate limit middleware error:', error);
        next();
      }
    };
  }

  /**
   * Get all banned identifiers
   */
  async getBannedList() {
    return {
      success: true,
      banned: Array.from(this.banned)
    };
  }

  /**
   * Get all whitelisted identifiers
   */
  async getWhitelist() {
    return {
      success: true,
      whitelist: Array.from(this.whitelist)
    };
  }

  /**
   * Cleanup old records
   */
  async cleanup() {
    const now = Date.now();
    let cleaned = 0;

    for (const [identifier, record] of this.requests) {
      const limitConfig = this.limits[record.tier] || this.limits.anonymous;
      const windowStart = now - limitConfig.windowMs;
      
      // Remove old requests
      record.requests = record.requests.filter(time => time > windowStart);
      
      // Remove empty records
      if (record.requests.length === 0) {
        this.requests.delete(identifier);
        cleaned++;
      }
    }

    return {
      success: true,
      cleaned: cleaned,
      remaining: this.requests.size
    };
  }
}

module.exports = new RateLimitingService();
