/**
 * Social Media API Service
 * Integration with major social platforms
 */

class SocialApiService {
  constructor() {
    this.connectedAccounts = new Map();
    this.scheduledPosts = new Map();
    this.analytics = new Map();
  }

  /**
   * Connect social account
   */
  async connectAccount(user, platform, authData) {
    try {
      const account = {
        connectionId: this.generateId('SOC'),
        user: user,
        platform: platform, // 'twitter', 'instagram', 'facebook', 'tiktok', 'linkedin'
        accountName: authData.accountName,
        accountId: authData.accountId,
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
        expiresAt: authData.expiresAt,
        permissions: authData.permissions || ['read', 'write'],
        status: 'active',
        connectedAt: new Date().toISOString()
      };

      this.connectedAccounts.set(account.connectionId, account);

      return {
        success: true,
        connectionId: account.connectionId,
        platform: platform,
        account: account.accountName,
        status: 'connected'
      };
    } catch (error) {
      console.error('Connect account error:', error);
      throw error;
    }
  }

  /**
   * Disconnect social account
   */
  async disconnectAccount(connectionId) {
    try {
      const account = this.connectedAccounts.get(connectionId);
      if (!account) throw new Error('Account not found');

      account.status = 'disconnected';
      account.disconnectedAt = new Date().toISOString();

      return {
        success: true,
        connectionId: connectionId,
        platform: account.platform,
        status: 'disconnected'
      };
    } catch (error) {
      console.error('Disconnect account error:', error);
      throw error;
    }
  }

  /**
   * Share artwork/product to social media
   */
  async shareToSocial(user, shareData) {
    try {
      const { connectionId, content, mediaUrls, link } = shareData;

      const account = this.connectedAccounts.get(connectionId);
      if (!account || account.status !== 'active') {
        throw new Error('Account not connected');
      }

      const post = {
        postId: this.generateId('POST'),
        user: user,
        connectionId: connectionId,
        platform: account.platform,
        content: this.formatContentForPlatform(content, account.platform),
        media: mediaUrls || [],
        link: link,
        status: 'published',
        platformPostId: null,
        engagement: {
          likes: 0,
          shares: 0,
          comments: 0
        },
        publishedAt: new Date().toISOString()
      };

      // In production: Post to actual platform API
      post.platformPostId = `${account.platform}_${this.generateId()}`;

      return {
        success: true,
        postId: post.postId,
        platform: account.platform,
        platformPostId: post.platformPostId,
        url: this.generatePostUrl(account.platform, post.platformPostId)
      };
    } catch (error) {
      console.error('Share to social error:', error);
      throw error;
    }
  }

  /**
   * Schedule post
   */
  async schedulePost(user, postData) {
    try {
      const { connectionId, content, mediaUrls, link, scheduledTime } = postData;

      const scheduled = {
        scheduleId: this.generateId('SCH'),
        user: user,
        connectionId: connectionId,
        content: content,
        media: mediaUrls || [],
        link: link,
        scheduledTime: scheduledTime,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      };

      this.scheduledPosts.set(scheduled.scheduleId, scheduled);

      return {
        success: true,
        scheduleId: scheduled.scheduleId,
        scheduledTime: scheduledTime,
        status: 'scheduled'
      };
    } catch (error) {
      console.error('Schedule post error:', error);
      throw error;
    }
  }

  /**
   * Get scheduled posts
   */
  async getScheduledPosts(user) {
    const posts = Array.from(this.scheduledPosts.values())
      .filter(p => p.user === user)
      .sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime));

    return {
      success: true,
      posts: posts.map(p => ({
        scheduleId: p.scheduleId,
        content: p.content.substring(0, 100) + '...',
        scheduledTime: p.scheduledTime,
        status: p.status
      }))
    };
  }

  /**
   * Cancel scheduled post
   */
  async cancelScheduledPost(scheduleId) {
    const post = this.scheduledPosts.get(scheduleId);
    if (!post) throw new Error('Scheduled post not found');

    post.status = 'cancelled';
    post.cancelledAt = new Date().toISOString();

    return {
      success: true,
      scheduleId: scheduleId,
      status: 'cancelled'
    };
  }

  /**
   * Get social analytics
   */
  async getAnalytics(user, options = {}) {
    try {
      const { platform, period = '30d' } = options;

      // Aggregate analytics from all connected accounts
      const accounts = Array.from(this.connectedAccounts.values())
        .filter(a => a.user === user && a.status === 'active');

      if (platform) {
        const filtered = accounts.filter(a => a.platform === platform);
        return this.generateAnalytics(filtered, period);
      }

      return this.generateAnalytics(accounts, period);
    } catch (error) {
      console.error('Get analytics error:', error);
      throw error;
    }
  }

  generateAnalytics(accounts, period) {
    const platforms = {};
    let totalFollowers = 0;
    let totalEngagement = 0;

    for (const account of accounts) {
      // Mock analytics data
      const followers = Math.floor(Math.random() * 10000) + 1000;
      const engagement = Math.floor(Math.random() * 1000) + 100;

      platforms[account.platform] = {
        accountName: account.accountName,
        followers: followers,
        engagement: engagement,
        posts: Math.floor(Math.random() * 50) + 10,
        growth: (Math.random() * 20 - 5).toFixed(2) // -5% to +15%
      };

      totalFollowers += followers;
      totalEngagement += engagement;
    }

    return {
      success: true,
      period: period,
      summary: {
        totalFollowers: totalFollowers,
        totalEngagement: totalEngagement,
        engagementRate: ((totalEngagement / totalFollowers) * 100).toFixed(2) + '%',
        connectedPlatforms: accounts.length
      },
      platforms: platforms
    };
  }

  /**
   * Cross-post to multiple platforms
   */
  async crossPost(user, postData) {
    try {
      const { content, mediaUrls, link, platforms } = postData;

      const results = [];

      for (const platform of platforms) {
        // Find connection for platform
        const account = Array.from(this.connectedAccounts.values())
          .find(a => a.user === user && a.platform === platform && a.status === 'active');

        if (account) {
          const result = await this.shareToSocial(user, {
            connectionId: account.connectionId,
            content: content,
            mediaUrls: mediaUrls,
            link: link
          });
          results.push(result);
        } else {
          results.push({
            platform: platform,
            success: false,
            error: 'Account not connected'
          });
        }
      }

      return {
        success: true,
        posts: results,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      };
    } catch (error) {
      console.error('Cross post error:', error);
      throw error;
    }
  }

  /**
   * Get user's connected accounts
   */
  async getConnectedAccounts(user) {
    const accounts = Array.from(this.connectedAccounts.values())
      .filter(a => a.user === user);

    return {
      success: true,
      accounts: accounts.map(a => ({
        connectionId: a.connectionId,
        platform: a.platform,
        accountName: a.accountName,
        status: a.status,
        connectedAt: a.connectedAt
      }))
    };
  }

  formatContentForPlatform(content, platform) {
    const limits = {
      twitter: 280,
      instagram: 2200,
      facebook: 63206,
      tiktok: 2200,
      linkedin: 3000
    };

    const limit = limits[platform] || 500;
    
    if (content.length > limit) {
      return content.substring(0, limit - 3) + '...';
    }

    return content;
  }

  generatePostUrl(platform, postId) {
    const urls = {
      twitter: `https://twitter.com/i/web/status/${postId}`,
      instagram: `https://instagram.com/p/${postId}`,
      facebook: `https://facebook.com/posts/${postId}`,
      tiktok: `https://tiktok.com/@user/video/${postId}`,
      linkedin: `https://linkedin.com/feed/update/${postId}`
    };

    return urls[platform] || '#';
  }

  generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new SocialApiService();
