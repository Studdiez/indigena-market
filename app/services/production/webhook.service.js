/**
 * Webhook Management Service
 * Standardized webhook delivery with retries
 */

class WebhookService {
  constructor() {
    this.webhooks = new Map();
    this.deliveries = new Map();
    this.eventTypes = new Set();
    this.initializeEventTypes();
  }

  initializeEventTypes() {
    // Core webhook events
    const events = [
      // NFT Events
      'nft.minted',
      'nft.sold',
      'nft.transferred',
      'nft.burned',
      
      // Payment Events
      'payment.received',
      'payment.failed',
      'payment.refunded',
      
      // User Events
      'user.created',
      'user.updated',
      'user.verified',
      
      // Subscription Events
      'subscription.created',
      'subscription.renewed',
      'subscription.canceled',
      
      // Order Events
      'order.created',
      'order.shipped',
      'order.delivered',
      'order.cancelled',
      
      // Governance Events
      'proposal.created',
      'proposal.voted',
      'proposal.executed',
      
      // Revenue Events
      'revenue.transaction',
      'revenue.payout',
      
      // Security Events
      'security.suspicious_activity',
      'security.kyc_completed'
    ];

    events.forEach(event => this.eventTypes.add(event));
  }

  /**
   * Register a webhook
   */
  async registerWebhook(config) {
    try {
      const { url, events, secret, metadata = {} } = config;

      // Validate URL
      if (!this.isValidUrl(url)) {
        return {
          success: false,
          error: 'Invalid webhook URL'
        };
      }

      // Validate events
      const invalidEvents = events.filter(e => !this.eventTypes.has(e));
      if (invalidEvents.length > 0) {
        return {
          success: false,
          error: `Invalid event types: ${invalidEvents.join(', ')}`
        };
      }

      const webhookId = `wh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const webhook = {
        id: webhookId,
        url: url,
        events: events,
        secret: secret || this.generateSecret(),
        status: 'active',
        createdAt: new Date().toISOString(),
        metadata: metadata,
        deliveryAttempts: 0,
        successfulDeliveries: 0,
        failedDeliveries: 0
      };

      this.webhooks.set(webhookId, webhook);

      return {
        success: true,
        webhook: {
          id: webhook.id,
          url: webhook.url,
          events: webhook.events,
          status: webhook.status,
          secret: webhook.secret, // Only shown once
          createdAt: webhook.createdAt
        }
      };
    } catch (error) {
      console.error('Register webhook error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send webhook event
   */
  async sendEvent(eventType, payload, options = {}) {
    try {
      // Find webhooks subscribed to this event
      const subscribedWebhooks = Array.from(this.webhooks.values())
        .filter(wh => wh.status === 'active' && wh.events.includes(eventType));

      if (subscribedWebhooks.length === 0) {
        return {
          success: true,
          delivered: 0,
          message: 'No active webhooks for this event'
        };
      }

      const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const timestamp = new Date().toISOString();

      const event = {
        id: eventId,
        type: eventType,
        timestamp: timestamp,
        data: payload
      };

      const results = [];

      for (const webhook of subscribedWebhooks) {
        const deliveryResult = await this.deliver(webhook, event);
        results.push({
          webhookId: webhook.id,
          success: deliveryResult.success,
          statusCode: deliveryResult.statusCode,
          error: deliveryResult.error
        });
      }

      return {
        success: true,
        eventId: eventId,
        delivered: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results: results
      };
    } catch (error) {
      console.error('Send webhook event error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Deliver webhook to endpoint
   */
  async deliver(webhook, event) {
    const deliveryId = `del_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // Generate signature
      const signature = this.generateSignature(webhook.secret, event);

      const delivery = {
        id: deliveryId,
        webhookId: webhook.id,
        eventId: event.id,
        status: 'pending',
        attempts: 0,
        createdAt: new Date().toISOString()
      };

      this.deliveries.set(deliveryId, delivery);

      // In production, this would make actual HTTP request
      // For now, simulate delivery
      const mockResponse = await this.simulateDelivery(webhook.url, event, signature);

      delivery.status = mockResponse.success ? 'delivered' : 'failed';
      delivery.statusCode = mockResponse.statusCode;
      delivery.completedAt = new Date().toISOString();
      delivery.attempts = 1;

      // Update webhook stats
      webhook.deliveryAttempts++;
      if (mockResponse.success) {
        webhook.successfulDeliveries++;
      } else {
        webhook.failedDeliveries++;
        // Schedule retry
        this.scheduleRetry(webhook, event, deliveryId);
      }

      return {
        success: mockResponse.success,
        statusCode: mockResponse.statusCode,
        deliveryId: deliveryId
      };
    } catch (error) {
      console.error('Webhook delivery error:', error);
      
      const delivery = this.deliveries.get(deliveryId);
      if (delivery) {
        delivery.status = 'failed';
        delivery.error = error.message;
        delivery.completedAt = new Date().toISOString();
      }

      webhook.failedDeliveries++;
      
      return {
        success: false,
        error: error.message,
        deliveryId: deliveryId
      };
    }
  }

  /**
   * Simulate webhook delivery (replace with actual HTTP call in production)
   */
  async simulateDelivery(url, event, signature) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Simulate 95% success rate
    const success = Math.random() > 0.05;
    
    return {
      success: success,
      statusCode: success ? 200 : 500
    };
  }

  /**
   * Schedule retry for failed delivery
   */
  async scheduleRetry(webhook, event, deliveryId, attempt = 1) {
    const maxRetries = 5;
    const retryDelays = [5, 15, 30, 60, 300]; // minutes

    if (attempt >= maxRetries) {
      console.log(`Max retries reached for delivery ${deliveryId}`);
      return;
    }

    const delay = retryDelays[attempt - 1] * 60 * 1000; // convert to ms

    setTimeout(async () => {
      console.log(`Retrying delivery ${deliveryId}, attempt ${attempt + 1}`);
      const result = await this.deliver(webhook, event);
      
      if (!result.success) {
        await this.scheduleRetry(webhook, event, deliveryId, attempt + 1);
      }
    }, delay);
  }

  /**
   * Generate webhook signature
   */
  generateSignature(secret, payload) {
    // In production, use crypto module
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(payload));
    return `sha256=${hmac.digest('hex')}`;
  }

  /**
   * Verify webhook signature
   */
  verifySignature(secret, payload, signature) {
    const expected = this.generateSignature(secret, payload);
    return signature === expected;
  }

  /**
   * List all webhooks
   */
  async listWebhooks() {
    const webhooks = Array.from(this.webhooks.values()).map(wh => ({
      id: wh.id,
      url: wh.url,
      events: wh.events,
      status: wh.status,
      createdAt: wh.createdAt,
      deliveryAttempts: wh.deliveryAttempts,
      successfulDeliveries: wh.successfulDeliveries,
      failedDeliveries: wh.failedDeliveries
    }));

    return {
      success: true,
      count: webhooks.length,
      webhooks: webhooks
    };
  }

  /**
   * Get webhook by ID
   */
  async getWebhook(webhookId) {
    const webhook = this.webhooks.get(webhookId);
    
    if (!webhook) {
      return {
        success: false,
        error: 'Webhook not found'
      };
    }

    return {
      success: true,
      webhook: {
        id: webhook.id,
        url: webhook.url,
        events: webhook.events,
        status: webhook.status,
        createdAt: webhook.createdAt,
        metadata: webhook.metadata,
        stats: {
          deliveryAttempts: webhook.deliveryAttempts,
          successfulDeliveries: webhook.successfulDeliveries,
          failedDeliveries: webhook.failedDeliveries
        }
      }
    };
  }

  /**
   * Update webhook
   */
  async updateWebhook(webhookId, updates) {
    const webhook = this.webhooks.get(webhookId);
    
    if (!webhook) {
      return {
        success: false,
        error: 'Webhook not found'
      };
    }

    if (updates.events) {
      const invalidEvents = updates.events.filter(e => !this.eventTypes.has(e));
      if (invalidEvents.length > 0) {
        return {
          success: false,
          error: `Invalid event types: ${invalidEvents.join(', ')}`
        };
      }
      webhook.events = updates.events;
    }

    if (updates.url) {
      if (!this.isValidUrl(updates.url)) {
        return {
          success: false,
          error: 'Invalid webhook URL'
        };
      }
      webhook.url = updates.url;
    }

    if (updates.status) {
      webhook.status = updates.status;
    }

    webhook.updatedAt = new Date().toISOString();

    return {
      success: true,
      webhook: {
        id: webhook.id,
        url: webhook.url,
        events: webhook.events,
        status: webhook.status
      }
    };
  }

  /**
   * Delete webhook
   */
  async deleteWebhook(webhookId) {
    const existed = this.webhooks.has(webhookId);
    this.webhooks.delete(webhookId);

    return {
      success: true,
      deleted: existed
    };
  }

  /**
   * Get delivery history
   */
  async getDeliveries(webhookId = null, limit = 50) {
    let deliveries = Array.from(this.deliveries.values());
    
    if (webhookId) {
      deliveries = deliveries.filter(d => d.webhookId === webhookId);
    }

    deliveries = deliveries
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);

    return {
      success: true,
      count: deliveries.length,
      deliveries: deliveries
    };
  }

  /**
   * Get available event types
   */
  async getEventTypes() {
    return {
      success: true,
      events: Array.from(this.eventTypes)
    };
  }

  /**
   * Test webhook
   */
  async testWebhook(webhookId) {
    const webhook = this.webhooks.get(webhookId);
    
    if (!webhook) {
      return {
        success: false,
        error: 'Webhook not found'
      };
    }

    const testEvent = {
      id: `test_${Date.now()}`,
      type: 'webhook.test',
      timestamp: new Date().toISOString(),
      data: { message: 'This is a test event' }
    };

    const result = await this.deliver(webhook, testEvent);

    return {
      success: result.success,
      testEvent: testEvent,
      deliveryResult: result
    };
  }

  /**
   * Validate URL
   */
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generate secret
   */
  generateSecret() {
    return require('crypto').randomBytes(32).toString('hex');
  }
}

module.exports = new WebhookService();
