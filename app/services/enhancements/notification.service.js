/**
 * Notification Service
 * Real-time alerts and multi-channel notifications
 */

class NotificationService {
  constructor() {
    this.notifications = new Map();
    this.subscriptions = new Map();
    this.preferences = new Map();
    this.pushTokens = new Map();
    this.initializeDefaultPreferences();
  }

  initializeDefaultPreferences() {
    this.defaultPreferences = {
      sales: { push: true, email: true, inApp: true },
      bids: { push: true, email: false, inApp: true },
      offers: { push: true, email: true, inApp: true },
      governance: { push: true, email: true, inApp: true },
      elder_approvals: { push: true, email: true, inApp: true },
      community: { push: false, email: false, inApp: true },
      mentions: { push: true, email: false, inApp: true },
      system: { push: true, email: true, inApp: true },
      marketing: { push: false, email: false, inApp: false }
    };
  }

  /**
   * Create notification
   */
  async createNotification(user, notificationData) {
    try {
      const { type, title, message, data, priority = 'normal' } = notificationData;

      const notification = {
        notificationId: this.generateId('NOTIF'),
        user: user,
        type: type,
        title: title,
        message: message,
        data: data || {},
        priority: priority, // 'low', 'normal', 'high', 'urgent'
        status: 'unread',
        channels: [],
        createdAt: new Date().toISOString(),
        readAt: null
      };

      // Get user preferences
      const prefs = this.preferences.get(user) || this.defaultPreferences;
      const typePrefs = prefs[type] || prefs.system;

      // Send through enabled channels
      const deliveryPromises = [];

      if (typePrefs.inApp) {
        deliveryPromises.push(this.sendInApp(notification));
      }
      if (typePrefs.push) {
        deliveryPromises.push(this.sendPush(user, notification));
      }
      if (typePrefs.email) {
        deliveryPromises.push(this.sendEmail(user, notification));
      }

      const results = await Promise.allSettled(deliveryPromises);
      notification.channels = results.map((r, i) => {
        const channels = ['inApp', 'push', 'email'];
        return { channel: channels[i], status: r.status };
      });

      this.notifications.set(notification.notificationId, notification);

      return {
        success: true,
        notificationId: notification.notificationId,
        delivered: results.filter(r => r.status === 'fulfilled').length
      };
    } catch (error) {
      console.error('Create notification error:', error);
      throw error;
    }
  }

  /**
   * Send in-app notification
   */
  async sendInApp(notification) {
    // Store for in-app retrieval
    return { channel: 'inApp', status: 'delivered' };
  }

  /**
   * Send push notification
   */
  async sendPush(user, notification) {
    const tokens = this.pushTokens.get(user) || [];
    if (tokens.length === 0) {
      return { channel: 'push', status: 'no_tokens' };
    }

    // In production: Send to FCM/APNs
    const results = tokens.map(token => ({
      token: token,
      status: 'sent',
      platform: token.platform
    }));

    return { channel: 'push', status: 'delivered', tokens: results.length };
  }

  /**
   * Send email notification
   */
  async sendEmail(user, notification) {
    // In production: Send via SendGrid/AWS SES
    return { channel: 'email', status: 'queued' };
  }

  /**
   * Register push token
   */
  async registerPushToken(user, tokenData) {
    try {
      const { token, platform, deviceId } = tokenData;

      let userTokens = this.pushTokens.get(user) || [];
      
      // Remove existing token for this device
      userTokens = userTokens.filter(t => t.deviceId !== deviceId);
      
      // Add new token
      userTokens.push({
        token: token,
        platform: platform,
        deviceId: deviceId,
        registeredAt: new Date().toISOString()
      });

      this.pushTokens.set(user, userTokens);

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
   * Update notification preferences
   */
  async updatePreferences(user, preferences) {
    try {
      const current = this.preferences.get(user) || { ...this.defaultPreferences };
      
      // Merge new preferences
      for (const [type, prefs] of Object.entries(preferences)) {
        current[type] = { ...current[type], ...prefs };
      }

      this.preferences.set(user, current);

      return {
        success: true,
        preferences: current
      };
    } catch (error) {
      console.error('Update preferences error:', error);
      throw error;
    }
  }

  /**
   * Get user notifications
   */
  async getNotifications(user, options = {}) {
    try {
      const { status, type, limit = 50, offset = 0 } = options;

      let notifs = Array.from(this.notifications.values())
        .filter(n => n.user === user);

      if (status) notifs = notifs.filter(n => n.status === status);
      if (type) notifs = notifs.filter(n => n.type === type);

      notifs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const total = notifs.length;
      const unread = notifs.filter(n => n.status === 'unread').length;
      notifs = notifs.slice(offset, offset + limit);

      return {
        success: true,
        notifications: notifs,
        summary: { total, unread, limit, offset }
      };
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(user, notificationId) {
    try {
      const notification = this.notifications.get(notificationId);
      if (!notification) throw new Error('Notification not found');
      if (notification.user !== user) throw new Error('Not authorized');

      notification.status = 'read';
      notification.readAt = new Date().toISOString();

      return {
        success: true,
        notificationId: notificationId,
        readAt: notification.readAt
      };
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  }

  /**
   * Mark all as read
   */
  async markAllAsRead(user) {
    try {
      let count = 0;
      for (const notification of this.notifications.values()) {
        if (notification.user === user && notification.status === 'unread') {
          notification.status = 'read';
          notification.readAt = new Date().toISOString();
          count++;
        }
      }

      return {
        success: true,
        markedRead: count
      };
    } catch (error) {
      console.error('Mark all as read error:', error);
      throw error;
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(user, notificationId) {
    try {
      const notification = this.notifications.get(notificationId);
      if (!notification) throw new Error('Notification not found');
      if (notification.user !== user) throw new Error('Not authorized');

      this.notifications.delete(notificationId);

      return {
        success: true,
        notificationId: notificationId
      };
    } catch (error) {
      console.error('Delete notification error:', error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time updates
   */
  async subscribe(user, subscriptionData) {
    try {
      const { channel, filters } = subscriptionData;

      const subscription = {
        subscriptionId: this.generateId('SUB'),
        user: user,
        channel: channel,
        filters: filters || {},
        createdAt: new Date().toISOString(),
        active: true
      };

      this.subscriptions.set(subscription.subscriptionId, subscription);

      return {
        success: true,
        subscriptionId: subscription.subscriptionId
      };
    } catch (error) {
      console.error('Subscribe error:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe
   */
  async unsubscribe(subscriptionId) {
    try {
      const subscription = this.subscriptions.get(subscriptionId);
      if (!subscription) throw new Error('Subscription not found');

      subscription.active = false;
      subscription.unsubscribedAt = new Date().toISOString();

      return {
        success: true,
        subscriptionId: subscriptionId
      };
    } catch (error) {
      console.error('Unsubscribe error:', error);
      throw error;
    }
  }

  /**
   * Send bulk notification
   */
  async sendBulk(users, notificationData) {
    try {
      const results = [];
      
      for (const user of users) {
        const result = await this.createNotification(user, notificationData);
        results.push(result);
      }

      return {
        success: true,
        sent: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      };
    } catch (error) {
      console.error('Send bulk error:', error);
      throw error;
    }
  }

  generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new NotificationService();
