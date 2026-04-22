/**
 * Fiat Payment Service
 * Stripe and PayPal integration for fiat on/off ramps
 */

class FiatPaymentService {
  constructor() {
    this.stripeConfig = {
      apiKey: process.env.STRIPE_API_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
    };
    this.paypalConfig = {
      clientId: process.env.PAYPAL_CLIENT_ID,
      clientSecret: process.env.PAYPAL_CLIENT_SECRET,
      environment: process.env.PAYPAL_ENV || 'sandbox'
    };
    this.transactions = new Map();
    this.payouts = new Map();
  }

  /**
   * Create Stripe payment intent
   */
  async createStripePaymentIntent(user, paymentData) {
    try {
      const { amount, currency, description, metadata } = paymentData;

      const intent = {
        id: `pi_${this.generateId()}`,
        object: 'payment_intent',
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        description: description,
        metadata: {
          ...metadata,
          user: user,
          platform: 'indigena_market'
        },
        status: 'requires_confirmation',
        client_secret: `${this.generateId()}_secret_${this.generateId()}`,
        created: Math.floor(Date.now() / 1000)
      };

      this.transactions.set(intent.id, {
        ...intent,
        provider: 'stripe',
        user: user,
        type: 'payment_intent'
      });

      return {
        success: true,
        clientSecret: intent.client_secret,
        paymentIntentId: intent.id,
        amount: amount,
        currency: currency
      };
    } catch (error) {
      console.error('Create Stripe payment intent error:', error);
      throw error;
    }
  }

  /**
   * Confirm Stripe payment
   */
  async confirmStripePayment(paymentIntentId, paymentMethod) {
    try {
      const intent = this.transactions.get(paymentIntentId);
      if (!intent) throw new Error('Payment intent not found');

      intent.status = 'succeeded';
      intent.charges = {
        data: [{
          id: `ch_${this.generateId()}`,
          status: 'succeeded',
          amount: intent.amount,
          currency: intent.currency,
          payment_method: paymentMethod
        }]
      };

      return {
        success: true,
        paymentIntentId: paymentIntentId,
        status: 'succeeded',
        amount: intent.amount / 100,
        currency: intent.currency
      };
    } catch (error) {
      console.error('Confirm Stripe payment error:', error);
      throw error;
    }
  }

  /**
   * Create PayPal order
   */
  async createPayPalOrder(user, orderData) {
    try {
      const { amount, currency, description } = orderData;

      const order = {
        id: `PAYPAL-${this.generateId()}`,
        intent: 'CAPTURE',
        status: 'CREATED',
        purchase_units: [{
          amount: {
            currency_code: currency,
            value: amount.toFixed(2)
          },
          description: description,
          custom_id: user
        }],
        create_time: new Date().toISOString(),
        links: [
          {
            href: `https://www.sandbox.paypal.com/checkoutnow?token=PAYPAL-${this.generateId()}`,
            rel: 'approve',
            method: 'GET'
          }
        ]
      };

      this.transactions.set(order.id, {
        ...order,
        provider: 'paypal',
        user: user,
        type: 'order'
      });

      return {
        success: true,
        orderId: order.id,
        status: order.status,
        approvalUrl: order.links[0].href,
        amount: amount,
        currency: currency
      };
    } catch (error) {
      console.error('Create PayPal order error:', error);
      throw error;
    }
  }

  /**
   * Capture PayPal payment
   */
  async capturePayPalPayment(orderId) {
    try {
      const order = this.transactions.get(orderId);
      if (!order) throw new Error('Order not found');

      order.status = 'COMPLETED';
      order.purchase_units[0].payments = {
        captures: [{
          id: `CAPTURE-${this.generateId()}`,
          status: 'COMPLETED',
          amount: order.purchase_units[0].amount,
          create_time: new Date().toISOString()
        }]
      };

      return {
        success: true,
        orderId: orderId,
        status: 'COMPLETED',
        captureId: order.purchase_units[0].payments.captures[0].id
      };
    } catch (error) {
      console.error('Capture PayPal payment error:', error);
      throw error;
    }
  }

  /**
   * Process payout to seller
   */
  async processPayout(seller, payoutData) {
    try {
      const { amount, currency, method, destination } = payoutData;

      const payout = {
        payoutId: this.generateId('PO'),
        seller: seller,
        amount: amount,
        currency: currency,
        method: method, // 'stripe', 'paypal', 'bank_transfer'
        destination: destination,
        status: 'pending',
        estimatedArrival: this.calculateArrival(method),
        createdAt: new Date().toISOString()
      };

      this.payouts.set(payout.payoutId, payout);

      // Simulate processing
      setTimeout(() => {
        payout.status = 'completed';
        payout.completedAt = new Date().toISOString();
      }, 5000);

      return {
        success: true,
        payoutId: payout.payoutId,
        status: payout.status,
        estimatedArrival: payout.estimatedArrival
      };
    } catch (error) {
      console.error('Process payout error:', error);
      throw error;
    }
  }

  /**
   * Create subscription
   */
  async createSubscription(user, subscriptionData) {
    try {
      const { plan, amount, currency, interval } = subscriptionData;

      const subscription = {
        id: `sub_${this.generateId()}`,
        user: user,
        status: 'active',
        plan: plan,
        price: {
          amount: amount,
          currency: currency,
          interval: interval // 'month', 'year'
        },
        current_period_start: new Date().toISOString(),
        current_period_end: this.calculatePeriodEnd(interval),
        createdAt: new Date().toISOString()
      };

      this.transactions.set(subscription.id, subscription);

      return {
        success: true,
        subscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end
      };
    } catch (error) {
      console.error('Create subscription error:', error);
      throw error;
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId) {
    try {
      const subscription = this.transactions.get(subscriptionId);
      if (!subscription) throw new Error('Subscription not found');

      subscription.status = 'cancelled';
      subscription.cancelledAt = new Date().toISOString();

      return {
        success: true,
        subscriptionId: subscriptionId,
        status: 'cancelled',
        effectiveDate: subscription.current_period_end
      };
    } catch (error) {
      console.error('Cancel subscription error:', error);
      throw error;
    }
  }

  /**
   * Handle webhook (Stripe/PayPal)
   */
  async handleWebhook(provider, payload, signature) {
    try {
      // Verify signature in production
      const event = {
        id: `evt_${this.generateId()}`,
        object: 'event',
        type: payload.type,
        data: payload,
        created: Math.floor(Date.now() / 1000)
      };

      // Process event based on type
      switch (payload.type) {
        case 'payment_intent.succeeded':
          await this.processPaymentSuccess(payload.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.processPaymentFailure(payload.data.object);
          break;
        case 'checkout.session.completed':
          await this.processCheckoutComplete(payload.data.object);
          break;
      }

      return {
        success: true,
        eventId: event.id,
        type: event.type,
        processed: true
      };
    } catch (error) {
      console.error('Handle webhook error:', error);
      throw error;
    }
  }

  /**
   * Get transaction history
   */
  async getTransactionHistory(user, options = {}) {
    const { limit = 50, type } = options;

    let transactions = Array.from(this.transactions.values())
      .filter(t => t.user === user);

    if (type) transactions = transactions.filter(t => t.type === type);

    transactions.sort((a, b) => new Date(b.createdAt || b.created) - new Date(a.createdAt || a.created));

    return {
      success: true,
      transactions: transactions.slice(0, limit),
      total: transactions.length
    };
  }

  // Helper methods
  processPaymentSuccess(paymentIntent) {
    console.log('Payment succeeded:', paymentIntent.id);
    // Update order status, notify user, etc.
  }

  processPaymentFailure(paymentIntent) {
    console.log('Payment failed:', paymentIntent.id);
    // Handle failure, notify user, etc.
  }

  processCheckoutComplete(session) {
    console.log('Checkout completed:', session.id);
    // Fulfill order, etc.
  }

  calculateArrival(method) {
    const date = new Date();
    switch (method) {
      case 'stripe':
        date.setDate(date.getDate() + 2);
        break;
      case 'paypal':
        date.setDate(date.getDate() + 1);
        break;
      case 'bank_transfer':
        date.setDate(date.getDate() + 3);
        break;
      default:
        date.setDate(date.getDate() + 2);
    }
    return date.toISOString();
  }

  calculatePeriodEnd(interval) {
    const date = new Date();
    if (interval === 'month') {
      date.setMonth(date.getMonth() + 1);
    } else if (interval === 'year') {
      date.setFullYear(date.getFullYear() + 1);
    }
    return date.toISOString();
  }

  generateId() {
    return Math.random().toString(36).substr(2, 16);
  }
}

module.exports = new FiatPaymentService();
