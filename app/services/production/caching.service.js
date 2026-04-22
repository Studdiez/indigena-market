/**
 * Caching Service
 * Redis-like caching layer for performance
 */

class CachingService {
  constructor() {
    this.cache = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0
    };
    this.defaultTTL = 300; // 5 minutes default
    this.startCleanupInterval();
  }

  /**
   * Start cleanup interval for expired keys
   */
  startCleanupInterval() {
    // Clean up expired keys every 60 seconds
    setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  /**
   * Get value from cache
   */
  async get(key) {
    try {
      const entry = this.cache.get(key);
      
      if (!entry) {
        this.stats.misses++;
        return { found: false, value: null };
      }

      // Check if expired
      if (entry.expiresAt && Date.now() > entry.expiresAt) {
        this.cache.delete(key);
        this.stats.misses++;
        return { found: false, value: null, expired: true };
      }

      this.stats.hits++;
      return {
        found: true,
        value: entry.value,
        ttl: entry.expiresAt ? Math.ceil((entry.expiresAt - Date.now()) / 1000) : null
      };
    } catch (error) {
      console.error('Cache get error:', error);
      return { found: false, error: error.message };
    }
  }

  /**
   * Set value in cache
   */
  async set(key, value, ttl = null) {
    try {
      const expiresAt = ttl ? Date.now() + (ttl * 1000) : null;
      
      this.cache.set(key, {
        value: value,
        expiresAt: expiresAt,
        createdAt: Date.now()
      });

      this.stats.sets++;

      return {
        success: true,
        key: key,
        ttl: ttl
      };
    } catch (error) {
      console.error('Cache set error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key) {
    try {
      const existed = this.cache.has(key);
      this.cache.delete(key);
      
      if (existed) {
        this.stats.deletes++;
      }

      return {
        success: true,
        deleted: existed
      };
    } catch (error) {
      console.error('Cache delete error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if key exists
   */
  async exists(key) {
    const entry = this.cache.get(key);
    
    if (!entry) return false;
    
    // Check if expired
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Get or set (cache-aside pattern)
   */
  async getOrSet(key, factory, ttl = null) {
    // Try to get from cache
    const cached = await this.get(key);
    if (cached.found) {
      return { fromCache: true, value: cached.value };
    }

    // Generate value
    try {
      const value = await factory();
      
      // Store in cache
      await this.set(key, value, ttl || this.defaultTTL);
      
      return { fromCache: false, value: value };
    } catch (error) {
      console.error('Cache factory error:', error);
      throw error;
    }
  }

  /**
   * Increment counter
   */
  async increment(key, amount = 1) {
    try {
      const entry = this.cache.get(key);
      
      if (!entry || typeof entry.value !== 'number') {
        await this.set(key, amount);
        return { success: true, value: amount };
      }

      entry.value += amount;
      return { success: true, value: entry.value };
    } catch (error) {
      console.error('Cache increment error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Decrement counter
   */
  async decrement(key, amount = 1) {
    return this.increment(key, -amount);
  }

  /**
   * Set expiration on key
   */
  async expire(key, ttl) {
    try {
      const entry = this.cache.get(key);
      if (!entry) {
        return { success: false, exists: false };
      }

      entry.expiresAt = Date.now() + (ttl * 1000);
      return { success: true, ttl: ttl };
    } catch (error) {
      console.error('Cache expire error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get time to live
   */
  async ttl(key) {
    const entry = this.cache.get(key);
    
    if (!entry) return { exists: false, ttl: -2 };
    if (!entry.expiresAt) return { exists: true, ttl: -1 }; // No expiration
    
    const remaining = Math.ceil((entry.expiresAt - Date.now()) / 1000);
    if (remaining <= 0) {
      this.cache.delete(key);
      return { exists: false, ttl: -2 };
    }

    return { exists: true, ttl: remaining };
  }

  /**
   * Get all keys matching pattern
   */
  async keys(pattern = '*') {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    const matching = [];

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        matching.push(key);
      }
    }

    return matching;
  }

  /**
   * Delete keys by pattern
   */
  async deletePattern(pattern) {
    const keys = await this.keys(pattern);
    let deleted = 0;

    for (const key of keys) {
      this.cache.delete(key);
      deleted++;
    }

    return {
      success: true,
      deleted: deleted,
      pattern: pattern
    };
  }

  /**
   * Flush all cache
   */
  async flush() {
    const count = this.cache.size;
    this.cache.clear();
    
    return {
      success: true,
      flushed: count
    };
  }

  /**
   * Get cache stats
   */
  async getStats() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? (this.stats.hits / total * 100).toFixed(2) : 0;

    return {
      success: true,
      stats: {
        ...this.stats,
        hitRate: hitRate + '%',
        totalRequests: total,
        keysInCache: this.cache.size
      }
    };
  }

  /**
   * Cleanup expired keys
   */
  async cleanup() {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache) {
      if (entry.expiresAt && now > entry.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    return {
      success: true,
      cleaned: cleaned,
      remaining: this.cache.size
    };
  }

  /**
   * Cache middleware for Express routes
   */
  middleware(ttl = null, keyGenerator = null) {
    return async (req, res, next) => {
      try {
        // Generate cache key
        const key = keyGenerator 
          ? keyGenerator(req)
          : `cache:${req.method}:${req.originalUrl}:${JSON.stringify(req.query)}`;

        // Try to get from cache
        const cached = await this.get(key);
        
        if (cached.found) {
          res.set('X-Cache', 'HIT');
          return res.json(cached.value);
        }

        // Store original json method
        const originalJson = res.json.bind(res);

        // Override json method to cache response
        res.json = (data) => {
          // Only cache successful responses
          if (res.statusCode >= 200 && res.statusCode < 300) {
            this.set(key, data, ttl || this.defaultTTL);
          }
          res.set('X-Cache', 'MISS');
          return originalJson(data);
        };

        next();
      } catch (error) {
        console.error('Cache middleware error:', error);
        next();
      }
    };
  }

  /**
   * Cache invalidation helper
   */
  async invalidateRelated(patterns) {
    const results = [];
    
    for (const pattern of patterns) {
      const result = await this.deletePattern(pattern);
      results.push(result);
    }

    return {
      success: true,
      invalidated: results.reduce((sum, r) => sum + r.deleted, 0)
    };
  }
}

module.exports = new CachingService();
