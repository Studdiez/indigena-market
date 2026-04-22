/**
 * Mobile Optimization Service
 * API optimizations for mobile clients
 */

class MobileOptimizationService {
  constructor() {
    this.cache = new Map();
    this.syncQueues = new Map();
    this.compressionEnabled = true;
    this.offlineData = new Map();
  }

  /**
   * Get optimized feed for mobile
   */
  async getMobileFeed(user, options = {}) {
    try {
      const { 
        page = 1, 
        pageSize = 10, 
        contentType = 'mixed',
        quality = 'medium' // low, medium, high
      } = options;

      // Generate cache key
      const cacheKey = `feed_${user}_${page}_${contentType}`;
      
      // Check cache
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < 60000) { // 1 min cache
        return cached.data;
      }

      // In production: Fetch from database with optimized queries
      const feed = this.generateMockFeed(page, pageSize, contentType);

      // Optimize for mobile
      const optimized = this.optimizeForMobile(feed, quality);

      const result = {
        success: true,
        feed: optimized,
        pagination: {
          page: page,
          hasMore: feed.length === pageSize
        },
        syncToken: this.generateSyncToken()
      };

      // Cache result
      this.cache.set(cacheKey, { data: result, timestamp: Date.now() });

      return result;
    } catch (error) {
      console.error('Get mobile feed error:', error);
      throw error;
    }
  }

  /**
   * Optimize content for mobile
   */
  optimizeForMobile(items, quality) {
    const qualitySettings = {
      low: { imageWidth: 400, descriptionLength: 100 },
      medium: { imageWidth: 800, descriptionLength: 200 },
      high: { imageWidth: 1200, descriptionLength: 500 }
    };

    const settings = qualitySettings[quality] || qualitySettings.medium;

    return items.map(item => ({
      ...item,
      // Compress images
      imageUrl: this.getCompressedImageUrl(item.imageUrl, settings.imageWidth),
      // Truncate descriptions
      description: this.truncateText(item.description, settings.descriptionLength),
      // Remove unnecessary fields
      metadata: this.filterMobileFields(item.metadata),
      // Add mobile-specific data
      mobile: {
        aspectRatio: item.aspectRatio || '1:1',
        touchTarget: true,
        swipeable: true
      }
    }));
  }

  /**
   * Get compressed image URL
   */
  getCompressedImageUrl(originalUrl, width) {
    if (!originalUrl) return null;
    // In production: Use CDN with on-the-fly resizing
    return `${originalUrl}?w=${width}&q=80&format=webp`;
  }

  /**
   * Truncate text
   */
  truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  }

  /**
   * Filter fields for mobile
   */
  filterMobileFields(metadata) {
    if (!metadata) return null;
    
    // Keep only essential fields
    const essential = ['price', 'currency', 'creator', 'createdAt', 'likes', 'views'];
    const filtered = {};
    
    for (const key of essential) {
      if (metadata[key] !== undefined) {
        filtered[key] = metadata[key];
      }
    }
    
    return filtered;
  }

  /**
   * Sync offline changes
   */
  async syncOfflineChanges(user, changes) {
    try {
      const results = [];
      const failed = [];

      for (const change of changes) {
        try {
          // Process each change
          const result = await this.processOfflineChange(user, change);
          results.push({ id: change.id, status: 'synced', result });
        } catch (error) {
          failed.push({ id: change.id, status: 'failed', error: error.message });
        }
      }

      return {
        success: true,
        synced: results.length,
        failed: failed.length,
        results: results,
        failures: failed
      };
    } catch (error) {
      console.error('Sync offline changes error:', error);
      throw error;
    }
  }

  /**
   * Process individual offline change
   */
  async processOfflineChange(user, change) {
    const { type, action, data, timestamp } = change;

    // Check if change is too old (conflict resolution)
    const age = Date.now() - new Date(timestamp);
    if (age > 7 * 24 * 60 * 60 * 1000) { // 7 days
      throw new Error('Change too old to sync');
    }

    // In production: Apply change to database
    return {
      type: type,
      action: action,
      appliedAt: new Date().toISOString()
    };
  }

  /**
   * Get offline data package
   */
  async getOfflinePackage(user, options = {}) {
    try {
      const { contentTypes = ['favorites', 'purchases', 'listings'] } = options;

      const package_ = {
        user: user,
        generatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        data: {}
      };

      // In production: Fetch user's data for offline use
      for (const type of contentTypes) {
        package_.data[type] = await this.getOfflineData(user, type);
      }

      // Compress package
      const compressed = this.compressData(package_);

      return {
        success: true,
        package: compressed,
        size: JSON.stringify(compressed).length
      };
    } catch (error) {
      console.error('Get offline package error:', error);
      throw error;
    }
  }

  /**
   * Get offline data for type
   */
  async getOfflineData(user, type) {
    // Mock data - in production fetch from DB
    switch (type) {
      case 'favorites':
        return { count: 0, items: [] };
      case 'purchases':
        return { count: 0, items: [] };
      case 'listings':
        return { count: 0, items: [] };
      default:
        return {};
    }
  }

  /**
   * Compress data
   */
  compressData(data) {
    // In production: Use actual compression
    return data;
  }

  /**
   * Register push notification token
   */
  async registerPushToken(user, tokenData) {
    try {
      const { token, platform, deviceId } = tokenData;

      // Store token for user
      const userTokens = this.getUserPushTokens(user);
      
      // Remove old token for this device
      const filtered = userTokens.filter(t => t.deviceId !== deviceId);
      filtered.push({
        token: token,
        platform: platform,
        deviceId: deviceId,
        registeredAt: new Date().toISOString()
      });

      this.setUserPushTokens(user, filtered);

      return {
        success: true,
        message: 'Push token registered'
      };
    } catch (error) {
      console.error('Register push token error:', error);
      throw error;
    }
  }

  /**
   * Get user push tokens
   */
  getUserPushTokens(user) {
    // In production: Get from database
    return [];
  }

  /**
   * Set user push tokens
   */
  setUserPushTokens(user, tokens) {
    // In production: Save to database
  }

  /**
   * Get app configuration
   */
  async getAppConfig(platform, version) {
    try {
      const config = {
        version: '1.0.0',
        minVersion: '1.0.0',
        forceUpdate: false,
        features: {
          offlineMode: true,
          pushNotifications: true,
          biometricAuth: true,
          darkMode: true,
          voiceSearch: true
        },
        api: {
          baseUrl: process.env.API_BASE_URL || 'https://api.indigena.market',
          timeout: 30000,
          retryAttempts: 3
        },
        cache: {
          feedTTL: 60,
          imageTTL: 86400,
          profileTTL: 300
        },
        limits: {
          maxUploadSize: 50 * 1024 * 1024, // 50MB
          maxOfflineItems: 100,
          syncBatchSize: 50
        }
      };

      // Check if update required
      if (this.compareVersions(version, config.minVersion) < 0) {
        config.forceUpdate = true;
      }

      return {
        success: true,
        config: config
      };
    } catch (error) {
      console.error('Get app config error:', error);
      throw error;
    }
  }

  /**
   * Compare version strings
   */
  compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const p1 = parts1[i] || 0;
      const p2 = parts2[i] || 0;
      if (p1 < p2) return -1;
      if (p1 > p2) return 1;
    }
    return 0;
  }

  /**
   * Generate mock feed
   */
  generateMockFeed(page, pageSize, contentType) {
    const items = [];
    for (let i = 0; i < pageSize; i++) {
      items.push({
        id: `item_${page}_${i}`,
        type: contentType === 'mixed' ? ['art', 'course', 'experience'][i % 3] : contentType,
        title: `Item ${page * pageSize + i}`,
        description: 'This is a sample description for mobile optimization testing.',
        imageUrl: `https://example.com/image${i}.jpg`,
        creator: `creator${i}`,
        metadata: {
          price: 100 + i * 10,
          currency: 'INDI',
          createdAt: new Date().toISOString(),
          likes: i * 10,
          views: i * 100
        }
      });
    }
    return items;
  }

  /**
   * Generate sync token
   */
  generateSyncToken() {
    return `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

module.exports = new MobileOptimizationService();
