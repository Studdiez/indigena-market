/**
 * Subscription Service
 * Manages membership tiers, billing, and subscription logic
 */

const { v4: uuidv4 } = require('uuid');

class SubscriptionService {
  constructor() {
    this.subscriptions = new Map();
    this.plans = new Map();
    this.initializePlans();
  }

  initializePlans() {
    // Main Membership Tiers
    this.plans.set('free', {
      id: 'free',
      name: 'Free',
      monthlyPrice: 0,
      annualPrice: 0,
      features: ['browse', 'basic_profile', 'community_discussions', '5_favorites', 'newsletter'],
      limits: {
        favorites: 5,
        listings: 0,
        uploads: 0
      }
    });

    this.plans.set('community', {
      id: 'community',
      name: 'Community',
      monthlyPrice: 4.99,
      annualPrice: 49.90,
      features: ['ad_free', 'artist_newsletter', 'archive_access', 'supporter_badge', 'unlimited_favorites'],
      limits: {
        favorites: Infinity,
        listings: 0,
        uploads: 0
      }
    });

    this.plans.set('creator', {
      id: 'creator',
      name: 'Creator',
      monthlyPrice: 9.99,
      annualPrice: 99.90,
      features: ['reduced_fees', 'unlimited_uploads', 'priority_placement', 'analytics', 'verified_badge', 'early_access'],
      limits: {
        favorites: Infinity,
        listings: Infinity,
        uploads: Infinity
      },
      feeReduction: {
        from: 8,
        to: 5
      }
    });

    this.plans.set('patron', {
      id: 'patron',
      name: 'Patron',
      monthlyPrice: 29.99,
      annualPrice: 299.90,
      features: ['zero_buyer_fees', 'early_drops', 'exclusive_collections', 'personal_curator', 'vip_events', 'custom_alerts'],
      limits: {
        favorites: Infinity,
        listings: Infinity,
        uploads: Infinity
      },
      buyerFeeWaived: true
    });

    // Pillar Passes
    this.plans.set('pillar_digital_arts', {
      id: 'pillar_digital_arts',
      name: 'Digital Arts Pass',
      monthlyPrice: 3.99,
      annualPrice: 39.90,
      category: 'pillar_pass',
      pillar: 'digital_arts'
    });

    this.plans.set('pillar_heritage', {
      id: 'pillar_heritage',
      name: 'Heritage Archive Pass',
      monthlyPrice: 4.99,
      annualPrice: 49.90,
      category: 'pillar_pass',
      pillar: 'language_heritage'
    });

    this.plans.set('pillar_seva', {
      id: 'pillar_seva',
      name: 'Seva Impact Pass',
      monthlyPrice: 5.99,
      annualPrice: 59.90,
      category: 'pillar_pass',
      pillar: 'seva'
    });

    this.plans.set('pillar_all_access', {
      id: 'pillar_all_access',
      name: 'All-Access Pass',
      monthlyPrice: 14.99,
      annualPrice: 149.90,
      category: 'pillar_pass',
      includesAllPillars: true
    });

    // Promo Bundles
    this.plans.set('bundle_starter', {
      id: 'bundle_starter',
      name: 'Starter Promo',
      monthlyPrice: 14.99,
      category: 'promo_bundle',
      includes: ['creator_tier', '1_featured_listing'],
      savings: '20%'
    });

    this.plans.set('bundle_growing', {
      id: 'bundle_growing',
      name: 'Growing Artist',
      monthlyPrice: 29.99,
      category: 'promo_bundle',
      includes: ['creator_tier', '2_featured_listings', '1_newsletter'],
      savings: '25%'
    });

    this.plans.set('bundle_master', {
      id: 'bundle_master',
      name: 'Master Artist',
      monthlyPrice: 99,
      category: 'promo_bundle',
      includes: ['creator_tier', 'hero_placement', '4_featured_listings', 'monthly_newsletter'],
      savings: '30%'
    });

    // Team Plans
    this.plans.set('team_collective', {
      id: 'team_collective',
      name: 'Small Collective',
      monthlyPrice: 29.99,
      maxMembers: 5,
      category: 'team'
    });

    this.plans.set('team_hub', {
      id: 'team_hub',
      name: 'Community Hub',
      monthlyPrice: 99,
      maxMembers: 20,
      category: 'team'
    });

    this.plans.set('team_organization', {
      id: 'team_organization',
      name: 'Nation/Organization',
      price: 'custom',
      maxMembers: Infinity,
      category: 'team'
    });

    // Lifetime
    this.plans.set('lifetime_founder', {
      id: 'lifetime_founder',
      name: "Founder's Circle",
      price: 499,
      oneTime: true,
      category: 'lifetime'
    });

    this.plans.set('lifetime_elder', {
      id: 'lifetime_elder',
      name: "Elder's Legacy",
      price: 999,
      oneTime: true,
      category: 'lifetime'
    });
  }

  // Get all available plans
  getAllPlans() {
    return Array.from(this.plans.values());
  }

  // Get plans by category
  getPlansByCategory(category) {
    return this.getAllPlans().filter(plan => plan.category === category);
  }

  // Get plan by ID
  getPlan(planId) {
    return this.plans.get(planId);
  }

  // Calculate price with discounts
  calculatePrice(planId, options = {}) {
    const plan = this.plans.get(planId);
    if (!plan) return null;

    const { isAnnual = false, paymentMethod = 'card' } = options;
    
    let basePrice;
    if (plan.oneTime) {
      basePrice = plan.price;
    } else if (isAnnual && plan.annualPrice) {
      basePrice = plan.annualPrice;
    } else {
      basePrice = plan.monthlyPrice;
    }

    // Apply payment method discounts
    const discounts = {
      card: 0,
      indi: 15,
      staked: 25
    };

    const discount = discounts[paymentMethod] || 0;
    const finalPrice = basePrice * (1 - discount / 100);

    return {
      basePrice,
      discount,
      discountAmount: basePrice * (discount / 100),
      finalPrice: Math.round(finalPrice * 100) / 100,
      period: plan.oneTime ? 'one-time' : (isAnnual ? 'year' : 'month')
    };
  }

  // Create subscription
  async createSubscription(userId, planId, options = {}) {
    const plan = this.plans.get(planId);
    if (!plan) {
      throw new Error('Invalid plan ID');
    }

    const pricing = this.calculatePrice(planId, options);
    
    const subscription = {
      id: uuidv4(),
      userId,
      planId,
      planName: plan.name,
      status: 'active',
      pricing,
      createdAt: new Date().toISOString(),
      ...options
    };

    this.subscriptions.set(subscription.id, subscription);
    
    return subscription;
  }

  // Get user's active subscriptions
  getUserSubscriptions(userId) {
    return Array.from(this.subscriptions.values())
      .filter(sub => sub.userId === userId && sub.status === 'active');
  }

  // Check if user has specific feature
  hasFeature(userId, feature) {
    const subs = this.getUserSubscriptions(userId);
    return subs.some(sub => {
      const plan = this.plans.get(sub.planId);
      return plan && plan.features && plan.features.includes(feature);
    });
  }

  // Get user's fee rate (for creators)
  getUserFeeRate(userId, defaultRate = 8) {
    const subs = this.getUserSubscriptions(userId);
    
    // Check for Creator tier with fee reduction
    const creatorSub = subs.find(sub => sub.planId === 'creator');
    if (creatorSub) {
      const plan = this.plans.get('creator');
      return plan.feeReduction ? plan.feeReduction.to : defaultRate;
    }
    
    return defaultRate;
  }

  // Check if user has buyer fees waived
  hasBuyerFeesWaived(userId) {
    const subs = this.getUserSubscriptions(userId);
    return subs.some(sub => {
      const plan = this.plans.get(sub.planId);
      return plan && plan.buyerFeeWaived;
    });
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId) {
    const sub = this.subscriptions.get(subscriptionId);
    if (!sub) {
      throw new Error('Subscription not found');
    }

    sub.status = 'cancelled';
    sub.cancelledAt = new Date().toISOString();
    
    return sub;
  }
}

module.exports = new SubscriptionService();
