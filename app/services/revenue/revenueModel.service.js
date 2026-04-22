/**
 * Revenue Model Service
 * Complete revenue tracking for all 14 streams across 10 pillars
 */

class RevenueModelService {
  constructor() {
    this.transactions = new Map();
    this.revenueStreams = new Map();
    this.pillarRevenue = new Map();
    this.subscriptions = new Map();
    this.initializeRevenueStreams();
  }

  initializeRevenueStreams() {
    // Initialize all 14 revenue streams
    this.revenueStreams.set('transaction_fees', {
      id: 'transaction_fees',
      name: 'Transaction Fees (Firekeeper Fee)',
      type: 'percentage',
      description: 'Applied to every sale across all 10 pillars',
      fees: {
        digital_arts: 8,
        physical_items: 5,
        courses: 10,
        freelancing: 10,
        cultural_tourism: 6,
        language_heritage: 8,
        land_food: 5,
        materials_tools: 4,
        advocacy_legal: 5,
        seva: 0 // Seva has donation fees instead
      }
    });

    this.revenueStreams.set('subscriptions', {
      id: 'subscriptions',
      name: 'Circle of Support Subscriptions',
      type: 'recurring',
      tiers: {
        friend: { name: 'Friend of the Circle', price: 5, period: 'monthly' },
        guardian: { name: 'Guardian', price: 15, period: 'monthly' },
        elder_circle: { name: 'Elder\'s Circle', price: 50, period: 'monthly' },
        ancestor_circle: { name: 'Ancestor\'s Circle', price: 500, period: 'monthly' }
      }
    });

    this.revenueStreams.set('seva_services', {
      id: 'seva_services',
      name: 'Seva Impact Services',
      type: 'mixed',
      fees: {
        checkout_donations: 5,
        project_management: 10,
        corporate_matching: 5,
        impact_reporting: 5000, // flat fee
        legacy_giving: 1, // percentage AUM
        apprentice_sponsorship: 5
      }
    });

    this.revenueStreams.set('premium_features', {
      id: 'premium_features',
      name: 'Premium Creator Features',
      type: 'flat',
      features: {
        premium_artist: { price: 5, period: 'monthly' },
        featured_listing: { price: 10, period: 'per_listing' },
        analytics_pro: { price: 10, period: 'monthly' },
        promoted_artist: { price: 20, period: 'daily' },
        bulk_upload: { price: 50, period: 'one_time' },
        verification_badge: { price: 25, period: 'one_time' }
      }
    });

    this.revenueStreams.set('b2b_enterprise', {
      id: 'b2b_enterprise',
      name: 'B2B Enterprise Services',
      type: 'percentage',
      services: {
        art_licensing: 15,
        corporate_training: 20,
        museum_partnerships: 15,
        translation_services: 12,
        cultural_consulting: 12,
        brand_sponsorships: 25000 // flat annual
      }
    });

    this.revenueStreams.set('logistics', {
      id: 'logistics',
      name: 'Logistics & Operations',
      type: 'mixed',
      services: {
        shipping: 5,
        insurance: 10,
        nfc_tags: 5, // per item
        warehouse: 15,
        digital_champion: 10,
        inventory_tools: { price: 10, period: 'monthly' }
      }
    });

    this.revenueStreams.set('data_insights', {
      id: 'data_insights',
      name: 'Data Insights (Anonymized)',
      type: 'flat',
      products: {
        annual_report: 5000,
        custom_research: 25000,
        api_access: { price: 1000, period: 'monthly' },
        trend_forecasting: { price: 500, period: 'yearly' },
        regional_analysis: 10000
      }
    });

    this.revenueStreams.set('advertising', {
      id: 'advertising',
      name: 'Advertising & Sponsorships',
      type: 'flat',
      options: {
        // Homepage Premium Placements (Sweet Spot Pricing)
        homepage_hero: { price: 500, period: 'weekly', description: 'Hero section featured NFT' },
        homepage_collections: { price: 300, period: 'weekly', description: 'Featured collections carousel' },
        homepage_auctions: { price: 200, period: 'weekly', description: 'Live auctions section' },
        homepage_artist_spotlight: { price: 400, period: 'weekly', description: 'Artist spotlight feature' },
        homepage_events: { price: 150, period: 'weekly', description: 'Event promotions section' },
        homepage_sticky_banner: { price: 100, period: 'weekly', description: 'Sticky top banner rotation' },
        homepage_newsletter_partner: { price: 250, period: 'monthly', description: 'Newsletter partner banner' },
        
        // Standalone Marketplace Placements (Value Tier)
        banner_ads: { price: 150, period: 'monthly', description: 'Standard banner ads' },
        sponsored_content: { price: 100, period: 'per_post', description: 'Blog/Content sponsorship' },
        newsletter: { price: 350, period: 'per_issue', description: 'Dedicated newsletter feature' },
        event_sponsorship: { price: 500, period: 'per_event', description: 'Event sponsorship' },
        pillar_sponsorship: { price: 2000, period: 'yearly', description: 'Full pillar sponsorship' },
        artist_spotlight: { price: 120, period: 'per_spotlight', description: 'Standalone artist spotlight' },
        
        // Pillar-Specific Featured Listings (Entry Tier)
        pillar_featured_digital_arts: { price: 50, period: 'weekly', description: 'Featured in Digital Arts' },
        pillar_featured_courses: { price: 40, period: 'weekly', description: 'Featured in Courses' },
        pillar_featured_physical: { price: 35, period: 'weekly', description: 'Featured in Physical Items' },
        pillar_featured_freelancing: { price: 40, period: 'weekly', description: 'Featured in Freelancing' },
        pillar_featured_tourism: { price: 60, period: 'weekly', description: 'Featured in Cultural Tourism' }
      }
    });

    this.revenueStreams.set('ticketing', {
      id: 'ticketing',
      name: 'Ticketing & Events',
      type: 'percentage',
      events: {
        virtual_workshop: 10,
        physical_event: 8,
        festival_pass: 10,
        livestream: 15,
        vip_experience: 12,
        workshop_hosting: 15
      }
    });

    this.revenueStreams.set('financial_services', {
      id: 'financial_services',
      name: 'Financial Services',
      type: 'mixed',
      services: {
        escrow: 1,
        currency_conversion: 0.5,
        instant_payout: 1,
        tax_reporting: 25, // per report
        micro_loan: 3, // avg interest
        installment: 4
      }
    });

    this.revenueStreams.set('archive_access', {
      id: 'archive_access',
      name: 'Premium Archive Access (Pillar 7)',
      type: 'flat',
      tiers: {
        basic: { price: 3, period: 'monthly' },
        researcher: { price: 20, period: 'monthly' },
        institutional: { price: 1000, period: 'yearly' },
        audio_download: { price: 1, period: 'per_download' },
        language_tools: { price: 5, period: 'monthly' }
      }
    });

    this.revenueStreams.set('certification', {
      id: 'certification',
      name: 'Certification & Verification',
      type: 'flat',
      services: {
        course_certificate: 25,
        artist_verification: { price: 10, period: 'yearly' },
        community_verification: { price: 50, period: 'yearly' },
        elder_signature: 100, // per use
        blockchain_auth: 5 // per item
      }
    });

    this.revenueStreams.set('commissions', {
      id: 'commissions',
      name: 'Commissions & Custom Work',
      type: 'percentage',
      services: {
        art_matching: 12,
        speaking_engagement: 15,
        custom_course: 20,
        corporate_procurement: 10,
        collection_curation: 15
      }
    });

    this.revenueStreams.set('physical_ventures', {
      id: 'physical_ventures',
      name: 'Physical Ventures (Land & Food)',
      type: 'percentage',
      products: {
        native_seeds: 8,
        indigenous_food: 6,
        conservation: 3,
        material_dyes: 5,
        tool_rental: 15
      }
    });
  }

  /**
   * Record revenue transaction
   */
  async recordTransaction(transactionData) {
    try {
      const {
        streamId,
        pillar,
        amount,
        currency = 'INDI',
        source,
        metadata = {}
      } = transactionData;

      const stream = this.revenueStreams.get(streamId);
      if (!stream) throw new Error('Invalid revenue stream');

      // Calculate platform revenue
      let platformRevenue = 0;
      
      if (stream.type === 'percentage') {
        const feeRate = this.getFeeRate(stream, pillar, source);
        platformRevenue = amount * (feeRate / 100);
      } else if (stream.type === 'flat') {
        platformRevenue = this.getFlatFee(stream, source);
      } else if (stream.type === 'mixed') {
        platformRevenue = this.calculateMixedRevenue(stream, amount, source);
      } else if (stream.type === 'recurring') {
        platformRevenue = amount; // Full subscription amount
      }

      const transaction = {
        transactionId: this.generateId('REV'),
        streamId: streamId,
        streamName: stream.name,
        pillar: pillar,
        grossAmount: amount,
        platformRevenue: platformRevenue,
        currency: currency,
        source: source,
        metadata: metadata,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };

      this.transactions.set(transaction.transactionId, transaction);

      // Update pillar revenue
      this.updatePillarRevenue(pillar, streamId, platformRevenue);

      return {
        success: true,
        transactionId: transaction.transactionId,
        platformRevenue: platformRevenue,
        stream: stream.name
      };
    } catch (error) {
      console.error('Record transaction error:', error);
      throw error;
    }
  }

  /**
   * Get fee rate for percentage-based streams
   */
  getFeeRate(stream, pillar, source) {
    if (stream.fees && stream.fees[pillar]) {
      return stream.fees[pillar];
    }
    if (stream.services && stream.services[source]) {
      return stream.services[source];
    }
    return 0;
  }

  /**
   * Get flat fee
   */
  getFlatFee(stream, source) {
    if (stream.features && stream.features[source]) {
      return stream.features[source].price;
    }
    if (stream.products && stream.products[source]) {
      if (typeof stream.products[source] === 'object') {
        return stream.products[source].price;
      }
      return stream.products[source];
    }
    if (stream.services && stream.services[source]) {
      if (typeof stream.services[source] === 'object') {
        return stream.services[source].price;
      }
      return stream.services[source];
    }
    return 0;
  }

  /**
   * Calculate mixed revenue
   */
  calculateMixedRevenue(stream, amount, source) {
    if (stream.services && stream.services[source]) {
      const fee = stream.services[source];
      if (typeof fee === 'object') {
        return fee.price;
      }
      // Percentage fee
      return amount * (fee / 100);
    }
    return 0;
  }

  /**
   * Update pillar revenue tracking
   */
  updatePillarRevenue(pillar, streamId, amount) {
    let pillarData = this.pillarRevenue.get(pillar) || {
      total: 0,
      streams: {}
    };

    pillarData.total += amount;
    pillarData.streams[streamId] = (pillarData.streams[streamId] || 0) + amount;

    this.pillarRevenue.set(pillar, pillarData);
  }

  /**
   * Get revenue dashboard
   */
  async getRevenueDashboard(period = '30d') {
    try {
      const now = new Date();
      const periodStart = new Date(now - this.parsePeriod(period));

      // Filter transactions by period
      const periodTransactions = Array.from(this.transactions.values())
        .filter(t => new Date(t.timestamp) >= periodStart);

      // Calculate totals
      const totalRevenue = periodTransactions.reduce((sum, t) => sum + t.platformRevenue, 0);
      
      // By stream
      const byStream = {};
      for (const t of periodTransactions) {
        byStream[t.streamId] = (byStream[t.streamId] || 0) + t.platformRevenue;
      }

      // By pillar
      const byPillar = {};
      for (const t of periodTransactions) {
        byPillar[t.pillar] = (byPillar[t.pillar] || 0) + t.platformRevenue;
      }

      // Daily breakdown
      const daily = this.calculateDailyBreakdown(periodTransactions);

      return {
        success: true,
        period: period,
        summary: {
          totalRevenue: totalRevenue,
          transactionCount: periodTransactions.length,
          averageTransaction: periodTransactions.length > 0 ? totalRevenue / periodTransactions.length : 0
        },
        byStream: byStream,
        byPillar: byPillar,
        daily: daily
      };
    } catch (error) {
      console.error('Get revenue dashboard error:', error);
      throw error;
    }
  }

  /**
   * Calculate daily breakdown
   */
  calculateDailyBreakdown(transactions) {
    const daily = {};
    
    for (const t of transactions) {
      const date = t.timestamp.split('T')[0];
      daily[date] = (daily[date] || 0) + t.platformRevenue;
    }

    return Object.entries(daily)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Parse period string to milliseconds
   */
  parsePeriod(period) {
    const units = {
      'd': 24 * 60 * 60 * 1000,
      'w': 7 * 24 * 60 * 60 * 1000,
      'm': 30 * 24 * 60 * 60 * 1000,
      'y': 365 * 24 * 60 * 60 * 1000
    };

    const value = parseInt(period);
    const unit = period.slice(-1);
    return value * (units[unit] || units['d']);
  }

  /**
   * Get pillar revenue report
   */
  async getPillarRevenue(pillar, options = {}) {
    try {
      const { period = '30d' } = options;
      const periodStart = new Date(Date.now() - this.parsePeriod(period));

      const transactions = Array.from(this.transactions.values())
        .filter(t => t.pillar === pillar && new Date(t.timestamp) >= periodStart);

      const total = transactions.reduce((sum, t) => sum + t.platformRevenue, 0);

      // By stream
      const byStream = {};
      for (const t of transactions) {
        byStream[t.streamId] = (byStream[t.streamId] || 0) + t.platformRevenue;
      }

      return {
        success: true,
        pillar: pillar,
        period: period,
        totalRevenue: total,
        transactionCount: transactions.length,
        byStream: byStream
      };
    } catch (error) {
      console.error('Get pillar revenue error:', error);
      throw error;
    }
  }

  /**
   * Get revenue stream details
   */
  async getRevenueStream(streamId) {
    try {
      const stream = this.revenueStreams.get(streamId);
      if (!stream) throw new Error('Revenue stream not found');

      // Get transactions for this stream
      const transactions = Array.from(this.transactions.values())
        .filter(t => t.streamId === streamId);

      const totalRevenue = transactions.reduce((sum, t) => sum + t.platformRevenue, 0);

      return {
        success: true,
        stream: stream,
        stats: {
          totalRevenue: totalRevenue,
          transactionCount: transactions.length
        }
      };
    } catch (error) {
      console.error('Get revenue stream error:', error);
      throw error;
    }
  }

  /**
   * Get all revenue streams
   */
  async getAllRevenueStreams() {
    try {
      const streams = [];
      
      for (const [id, stream] of this.revenueStreams) {
        const transactions = Array.from(this.transactions.values())
          .filter(t => t.streamId === id);
        
        const totalRevenue = transactions.reduce((sum, t) => sum + t.platformRevenue, 0);

        streams.push({
          id: id,
          name: stream.name,
          type: stream.type,
          totalRevenue: totalRevenue,
          transactionCount: transactions.length
        });
      }

      return {
        success: true,
        streams: streams.sort((a, b) => b.totalRevenue - a.totalRevenue)
      };
    } catch (error) {
      console.error('Get all revenue streams error:', error);
      throw error;
    }
  }

  /**
   * Project future revenue
   */
  async projectRevenue(years = 5) {
    try {
      // Year 1-5 projections based on the revenue model
      const projections = {
        year1: { revenue: 25000000, growth: 100 },
        year2: { revenue: 75000000, growth: 200 },
        year3: { revenue: 180000000, growth: 140 },
        year4: { revenue: 280000000, growth: 56 },
        year5: { revenue: 371175000, growth: 33 }
      };

      // By stream projection
      const byStream = {
        subscriptions: { year5: 186000000, percentage: 50 },
        transaction_fees: { year5: 33050000, percentage: 9 },
        archive_access: { year5: 43300000, percentage: 12 },
        premium_features: { year5: 25350000, percentage: 7 },
        seva_services: { year5: 10750000, percentage: 3 },
        logistics: { year5: 15850000, percentage: 4 },
        certification: { year5: 12750000, percentage: 3 },
        b2b_enterprise: { year5: 11360000, percentage: 3 },
        advertising: { year5: 9830000, percentage: 3 },
        data_insights: { year5: 8175000, percentage: 2 },
        ticketing: { year5: 4480000, percentage: 1 },
        financial_services: { year5: 4400000, percentage: 1 },
        commissions: { year5: 3950000, percentage: 1 },
        physical_ventures: { year5: 1930000, percentage: 0.5 }
      };

      return {
        success: true,
        projections: projections,
        byStream: byStream,
        totalYear5: 371175000
      };
    } catch (error) {
      console.error('Project revenue error:', error);
      throw error;
    }
  }

  /**
   * Calculate fees for a transaction
   */
  async calculateFees(pillar, amount, options = {}) {
    try {
      const stream = this.revenueStreams.get('transaction_fees');
      const feeRate = stream.fees[pillar] || 0;
      const platformFee = amount * (feeRate / 100);

      // Calculate additional fees based on options
      let additionalFees = 0;
      
      if (options.escrow) {
        additionalFees += amount * 0.01; // 1% escrow fee
      }
      
      if (options.instantPayout) {
        additionalFees += amount * 0.01; // 1% instant payout
      }

      const totalFees = platformFee + additionalFees;
      const artistReceives = amount - totalFees;

      return {
        success: true,
        pillar: pillar,
        saleAmount: amount,
        breakdown: {
          platformFee: platformFee,
          additionalFees: additionalFees,
          totalFees: totalFees,
          artistReceives: artistReceives
        },
        feePercentage: (totalFees / amount * 100).toFixed(2) + '%'
      };
    } catch (error) {
      console.error('Calculate fees error:', error);
      throw error;
    }
  }

  generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  /**
   * Get homepage placement pricing
   * Returns pricing for all 7 homepage premium placements
   */
  async getHomepagePlacementPricing() {
    const advertising = this.revenueStreams.get('advertising');
    
    const homepagePlacements = {
      hero_section: {
        name: 'Hero Section Featured NFT',
        price: advertising.options.homepage_hero.price,
        period: advertising.options.homepage_hero.period,
        weeklyRate: advertising.options.homepage_hero.price,
        monthlyRate: advertising.options.homepage_hero.price * 4,
        description: 'Prime placement in hero carousel - highest visibility'
      },
      featured_collections: {
        name: 'Featured Collections',
        price: advertising.options.homepage_collections.price,
        period: advertising.options.homepage_collections.period,
        weeklyRate: advertising.options.homepage_collections.price,
        monthlyRate: advertising.options.homepage_collections.price * 4,
        description: 'Showcase curated collections to all visitors'
      },
      live_auctions: {
        name: 'Live Auctions Section',
        price: advertising.options.homepage_auctions.price,
        period: advertising.options.homepage_auctions.period,
        weeklyRate: advertising.options.homepage_auctions.price,
        monthlyRate: advertising.options.homepage_auctions.price * 4,
        description: 'Promote auctions with countdown urgency'
      },
      artist_spotlight: {
        name: 'Artist Spotlight',
        price: advertising.options.homepage_artist_spotlight.price,
        period: advertising.options.homepage_artist_spotlight.period,
        weeklyRate: advertising.options.homepage_artist_spotlight.price,
        monthlyRate: advertising.options.homepage_artist_spotlight.price * 4,
        description: 'Full artist profile with featured works'
      },
      event_promotions: {
        name: 'Event & Workshop Promotions',
        price: advertising.options.homepage_events.price,
        period: advertising.options.homepage_events.period,
        weeklyRate: advertising.options.homepage_events.price,
        monthlyRate: advertising.options.homepage_events.price * 4,
        description: 'Promote workshops, markets, and exhibitions'
      },
      sticky_banner: {
        name: 'Sticky Top Banner',
        price: advertising.options.homepage_sticky_banner.price,
        period: advertising.options.homepage_sticky_banner.period,
        weeklyRate: advertising.options.homepage_sticky_banner.price,
        monthlyRate: advertising.options.homepage_sticky_banner.price * 4,
        description: 'Rotating banner fixed at top of page'
      },
      newsletter_partner: {
        name: 'Newsletter Partner',
        price: advertising.options.homepage_newsletter_partner.price,
        period: advertising.options.homepage_newsletter_partner.period,
        weeklyRate: null, // Monthly only
        monthlyRate: advertising.options.homepage_newsletter_partner.price,
        description: 'Brand partnership in newsletter section'
      }
    };

    // Calculate total for all 7 placements
    const totalWeekly = Object.values(homepagePlacements)
      .filter(p => p.weeklyRate)
      .reduce((sum, p) => sum + p.weeklyRate, 0);
    
    const totalMonthly = Object.values(homepagePlacements)
      .reduce((sum, p) => sum + (p.monthlyRate || 0), 0);

    return {
      success: true,
      placements: homepagePlacements,
      summary: {
        totalPlacements: 7,
        totalWeeklyRevenue: totalWeekly,
        totalMonthlyRevenue: totalMonthly,
        averageWeeklyPerPlacement: Math.round(totalWeekly / 6) // 6 weekly placements
      }
    };
  }

  /**
   * Compare homepage vs standalone marketplace pricing
   */
  async comparePlacementPricing() {
    const advertising = this.revenueStreams.get('advertising');
    
    const comparison = {
      homepage: {
        hero_section: { price: 500, period: 'weekly', visibility: '100% - All visitors' },
        artist_spotlight: { price: 400, period: 'weekly', visibility: '100% - All visitors' },
        featured_collections: { price: 300, period: 'weekly', visibility: '100% - All visitors' },
        live_auctions: { price: 200, period: 'weekly', visibility: '100% - All visitors' },
        event_promotions: { price: 150, period: 'weekly', visibility: '100% - All visitors' },
        sticky_banner: { price: 100, period: 'weekly', visibility: '100% - All visitors' },
        newsletter_partner: { price: 250, period: 'monthly', visibility: 'Newsletter subscribers' }
      },
      standalone: {
        digital_arts_featured: { price: 50, period: 'weekly', visibility: '~15% - Pillar visitors' },
        cultural_tourism_featured: { price: 60, period: 'weekly', visibility: '~12% - Pillar visitors' },
        courses_featured: { price: 40, period: 'weekly', visibility: '~18% - Pillar visitors' },
        freelancing_featured: { price: 40, period: 'weekly', visibility: '~10% - Pillar visitors' },
        physical_items_featured: { price: 35, period: 'weekly', visibility: '~20% - Pillar visitors' },
        artist_spotlight: { price: 120, period: 'per_spotlight', visibility: '~25% - Discovery page' },
        banner_ads: { price: 150, period: 'monthly', visibility: 'Varies by placement' }
      }
    };

    // Calculate value proposition
    const homepageAvgWeekly = (500 + 400 + 300 + 200 + 150 + 100) / 6;
    const standaloneAvgWeekly = (50 + 60 + 40 + 40 + 35) / 5;
    const premiumMultiplier = (homepageAvgWeekly / standaloneAvgWeekly).toFixed(1);

    return {
      success: true,
      comparison: comparison,
      analysis: {
        homepageAverageWeekly: homepageAvgWeekly,
        standaloneAverageWeekly: standaloneAvgWeekly,
        premiumMultiplier: `${premiumMultiplier}x`,
        valueProposition: `Homepage placements cost ${premiumMultiplier}x more but reach 5-8x more visitors`,
        recommendation: 'Homepage placements ideal for major launches; standalone for niche targeting',
        affordabilityNote: 'All pricing in INDI tokens - designed to be accessible for Indigenous artists'
      }
    };
  }

  /**
   * Calculate package deals for multiple homepage placements
   */
  async calculateHomepagePackage(placements = []) {
    const pricing = await this.getHomepagePlacementPricing();
    const selectedPlacements = placements.length > 0 ? placements : Object.keys(pricing.placements);
    
    let baseTotal = 0;
    const breakdown = [];

    for (const placementId of selectedPlacements) {
      const placement = pricing.placements[placementId];
      if (placement && placement.weeklyRate) {
        baseTotal += placement.weeklyRate;
        breakdown.push({
          placement: placement.name,
          weeklyRate: placement.weeklyRate
        });
      }
    }

    // Apply package discounts
    let discountRate = 0;
    if (selectedPlacements.length >= 6) discountRate = 0.20; // 20% off for 6+
    else if (selectedPlacements.length >= 4) discountRate = 0.15; // 15% off for 4-5
    else if (selectedPlacements.length >= 2) discountRate = 0.10; // 10% off for 2-3

    const discountAmount = baseTotal * discountRate;
    const finalTotal = baseTotal - discountAmount;

    return {
      success: true,
      package: {
        placements: selectedPlacements.length,
        breakdown: breakdown,
        baseTotal: baseTotal,
        discountRate: `${(discountRate * 100).toFixed(0)}%`,
        discountAmount: discountAmount,
        finalTotal: finalTotal,
        savings: discountAmount
      }
    };
  }
}

module.exports = new RevenueModelService();
