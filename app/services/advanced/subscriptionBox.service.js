/**
 * Subscription Box Service
 * Curated monthly art boxes
 */

class SubscriptionBoxService {
  constructor() {
    this.boxes = new Map();
    this.subscriptions = new Map();
    this.curators = new Map();
    this.shipments = new Map();
    this.initializeBoxes();
  }

  initializeBoxes() {
    // Default subscription boxes
    this.boxes.set('culture_explorer', {
      id: 'culture_explorer',
      name: 'Culture Explorer',
      description: 'Discover art from different Indigenous nations each month',
      tier: 'standard',
      price: 49.99,
      currency: 'INDI',
      frequency: 'monthly',
      itemsPerBox: 3,
      features: [
        '3 curated digital artworks',
        'Artist story cards',
        'Cultural significance guide',
        'Exclusive community access'
      ],
      active: true
    });

    this.boxes.set('master_collector', {
      id: 'master_collector',
      name: 'Master Collector',
      description: 'Premium curated collection for serious collectors',
      tier: 'premium',
      price: 149.99,
      currency: 'INDI',
      frequency: 'monthly',
      itemsPerBox: 5,
      features: [
        '5 premium digital artworks',
        '1 physical print',
        'Artist video story',
        'Virtual gallery access',
        'Early access to drops'
      ],
      active: true
    });

    this.boxes.set('elder_wisdom', {
      id: 'elder_wisdom',
      name: 'Elder Wisdom',
      description: 'Sacred teachings and elder-approved content',
      tier: 'sacred',
      price: 99.99,
      currency: 'INDI',
      frequency: 'monthly',
      itemsPerBox: 2,
      features: [
        'Elder-approved digital content',
        'Language lessons',
        'Story recordings',
        'Ceremonial guidance',
        'Direct elder connection'
      ],
      requiresVerification: true,
      active: true
    });
  }

  /**
   * Create subscription
   */
  async createSubscription(user, subscriptionData) {
    try {
      const { boxId, shippingAddress, paymentMethod } = subscriptionData;

      const box = this.boxes.get(boxId);
      if (!box) throw new Error('Box not found');
      if (!box.active) throw new Error('Box not available');

      // Check verification for sacred boxes
      if (box.requiresVerification) {
        // In production: Check user verification status
      }

      const subscription = {
        subscriptionId: this.generateId('SUBBOX'),
        user: user,
        boxId: boxId,
        box: box,
        status: 'active',
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        startDate: new Date().toISOString(),
        nextDelivery: this.calculateNextDelivery(box.frequency),
        totalDeliveries: 0,
        skippedDeliveries: 0,
        createdAt: new Date().toISOString()
      };

      this.subscriptions.set(subscription.subscriptionId, subscription);

      return {
        success: true,
        subscriptionId: subscription.subscriptionId,
        box: box.name,
        nextDelivery: subscription.nextDelivery
      };
    } catch (error) {
      console.error('Create subscription error:', error);
      throw error;
    }
  }

  /**
   * Calculate next delivery date
   */
  calculateNextDelivery(frequency) {
    const date = new Date();
    if (frequency === 'monthly') {
      date.setMonth(date.getMonth() + 1);
    } else if (frequency === 'quarterly') {
      date.setMonth(date.getMonth() + 3);
    }
    return date.toISOString();
  }

  /**
   * Curate box contents
   */
  async curateBox(boxId, curator, curationData) {
    try {
      const { month, year, items, theme, story } = curationData;

      const curation = {
        curationId: this.generateId('CURATION'),
        boxId: boxId,
        curator: curator,
        month: month,
        year: year,
        theme: theme,
        story: story,
        items: items.map((item, index) => ({
          position: index + 1,
          nftId: item.nftId,
          artist: item.artist,
          nation: item.nation,
          significance: item.significance,
          exclusive: item.exclusive || false
        })),
        createdAt: new Date().toISOString(),
        status: 'draft'
      };

      this.curators.set(curation.curationId, curation);

      return {
        success: true,
        curationId: curation.curationId,
        items: items.length
      };
    } catch (error) {
      console.error('Curate box error:', error);
      throw error;
    }
  }

  /**
   * Approve curation
   */
  async approveCuration(curationId, approver) {
    try {
      const curation = this.curators.get(curationId);
      if (!curation) throw new Error('Curation not found');

      curation.status = 'approved';
      curation.approvedBy = approver;
      curation.approvedAt = new Date().toISOString();

      return {
        success: true,
        curationId: curationId,
        status: 'approved'
      };
    } catch (error) {
      console.error('Approve curation error:', error);
      throw error;
    }
  }

  /**
   * Process monthly shipment
   */
  async processShipment(boxId, month, year) {
    try {
      // Find curation
      let curation = null;
      for (const cur of this.curators.values()) {
        if (cur.boxId === boxId && cur.month === month && cur.year === year && cur.status === 'approved') {
          curation = cur;
          break;
        }
      }

      if (!curation) throw new Error('No approved curation found');

      // Find active subscriptions
      const subscriptions = Array.from(this.subscriptions.values())
        .filter(s => s.boxId === boxId && s.status === 'active');

      const shipments = [];

      for (const sub of subscriptions) {
        const shipment = {
          shipmentId: this.generateId('SHIP'),
          subscriptionId: sub.subscriptionId,
          user: sub.user,
          curationId: curation.curationId,
          items: curation.items,
          status: 'preparing',
          shippingAddress: sub.shippingAddress,
          createdAt: new Date().toISOString(),
          shippedAt: null,
          deliveredAt: null
        };

        this.shipments.set(shipment.shipmentId, shipment);
        shipments.push(shipment);

        // Update subscription
        sub.totalDeliveries++;
        sub.nextDelivery = this.calculateNextDelivery(sub.box.frequency);
        sub.lastDelivery = new Date().toISOString();
      }

      return {
        success: true,
        shipments: shipments.length,
        subscribers: subscriptions.length
      };
    } catch (error) {
      console.error('Process shipment error:', error);
      throw error;
    }
  }

  /**
   * Get available boxes
   */
  async getAvailableBoxes() {
    try {
      const boxes = Array.from(this.boxes.values())
        .filter(b => b.active);

      return {
        success: true,
        boxes: boxes
      };
    } catch (error) {
      console.error('Get available boxes error:', error);
      throw error;
    }
  }

  /**
   * Get user's subscriptions
   */
  async getUserSubscriptions(user) {
    try {
      const subscriptions = Array.from(this.subscriptions.values())
        .filter(s => s.user === user)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return {
        success: true,
        subscriptions: subscriptions.map(s => ({
          subscriptionId: s.subscriptionId,
          box: s.box.name,
          status: s.status,
          nextDelivery: s.nextDelivery,
          totalDeliveries: s.totalDeliveries
        }))
      };
    } catch (error) {
      console.error('Get user subscriptions error:', error);
      throw error;
    }
  }

  /**
   * Get shipment history
   */
  async getShipmentHistory(user) {
    try {
      const shipments = Array.from(this.shipments.values())
        .filter(s => s.user === user)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return {
        success: true,
        shipments: shipments.map(s => ({
          shipmentId: s.shipmentId,
          theme: this.curators.get(s.curationId)?.theme,
          items: s.items.length,
          status: s.status,
          shippedAt: s.shippedAt,
          deliveredAt: s.deliveredAt
        }))
      };
    } catch (error) {
      console.error('Get shipment history error:', error);
      throw error;
    }
  }

  /**
   * Skip delivery
   */
  async skipDelivery(user, subscriptionId) {
    try {
      const subscription = this.subscriptions.get(subscriptionId);
      if (!subscription) throw new Error('Subscription not found');
      if (subscription.user !== user) throw new Error('Not your subscription');

      subscription.skippedDeliveries++;
      subscription.nextDelivery = this.calculateNextDelivery(subscription.box.frequency);

      return {
        success: true,
        subscriptionId: subscriptionId,
        nextDelivery: subscription.nextDelivery
      };
    } catch (error) {
      console.error('Skip delivery error:', error);
      throw error;
    }
  }

  /**
   * Pause subscription
   */
  async pauseSubscription(user, subscriptionId) {
    try {
      const subscription = this.subscriptions.get(subscriptionId);
      if (!subscription) throw new Error('Subscription not found');
      if (subscription.user !== user) throw new Error('Not your subscription');

      subscription.status = 'paused';
      subscription.pausedAt = new Date().toISOString();

      return {
        success: true,
        subscriptionId: subscriptionId,
        status: 'paused'
      };
    } catch (error) {
      console.error('Pause subscription error:', error);
      throw error;
    }
  }

  /**
   * Resume subscription
   */
  async resumeSubscription(user, subscriptionId) {
    try {
      const subscription = this.subscriptions.get(subscriptionId);
      if (!subscription) throw new Error('Subscription not found');
      if (subscription.user !== user) throw new Error('Not your subscription');

      subscription.status = 'active';
      subscription.resumedAt = new Date().toISOString();
      subscription.nextDelivery = this.calculateNextDelivery(subscription.box.frequency);

      return {
        success: true,
        subscriptionId: subscriptionId,
        status: 'active',
        nextDelivery: subscription.nextDelivery
      };
    } catch (error) {
      console.error('Resume subscription error:', error);
      throw error;
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(user, subscriptionId) {
    try {
      const subscription = this.subscriptions.get(subscriptionId);
      if (!subscription) throw new Error('Subscription not found');
      if (subscription.user !== user) throw new Error('Not your subscription');

      subscription.status = 'cancelled';
      subscription.cancelledAt = new Date().toISOString();

      return {
        success: true,
        subscriptionId: subscriptionId,
        status: 'cancelled'
      };
    } catch (error) {
      console.error('Cancel subscription error:', error);
      throw error;
    }
  }

  /**
   * Update shipping address
   */
  async updateShippingAddress(user, subscriptionId, address) {
    try {
      const subscription = this.subscriptions.get(subscriptionId);
      if (!subscription) throw new Error('Subscription not found');
      if (subscription.user !== user) throw new Error('Not your subscription');

      subscription.shippingAddress = address;
      subscription.addressUpdatedAt = new Date().toISOString();

      return {
        success: true,
        subscriptionId: subscriptionId,
        address: address
      };
    } catch (error) {
      console.error('Update shipping address error:', error);
      throw error;
    }
  }

  generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new SubscriptionBoxService();
