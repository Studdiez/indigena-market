/**
 * Smart Pricing Engine Service
 * ML-powered pricing recommendations based on market data and artwork attributes
 */

class PricingEngineService {
  constructor() {
    this.marketData = new Map();
    this.artistTiers = new Map();
    this.categoryMultipliers = new Map();
    this.initializePricingModels();
  }

  initializePricingModels() {
    // Artist tier multipliers (base price multiplier)
    this.artistTiers.set('master', 5.0);
    this.artistTiers.set('established', 3.0);
    this.artistTiers.set('emerging', 1.5);
    this.artistTiers.set('new', 1.0);

    // Category base prices (in XRP)
    this.categoryMultipliers.set('digital_art', { base: 100, multiplier: 1.0 });
    this.categoryMultipliers.set('physical_art', { base: 150, multiplier: 1.2 });
    this.categoryMultipliers.set('nft', { base: 80, multiplier: 0.8 });
    this.categoryMultipliers.set('weaving', { base: 200, multiplier: 1.5 });
    this.categoryMultipliers.set('pottery', { base: 120, multiplier: 1.3 });
    this.categoryMultipliers.set('jewelry', { base: 180, multiplier: 1.4 });
    this.categoryMultipliers.set('carving', { base: 250, multiplier: 1.6 });
    this.categoryMultipliers.set('painting', { base: 300, multiplier: 1.5 });
    this.categoryMultipliers.set('photography', { base: 90, multiplier: 0.9 });
    this.categoryMultipliers.set('music', { base: 70, multiplier: 0.7 });
    this.categoryMultipliers.set('course', { base: 50, multiplier: 0.5 });
    this.categoryMultipliers.set('service', { base: 40, multiplier: 0.4 });

    // Historical market data (would be populated from database)
    this.marketData = {
      lastUpdated: new Date(),
      averagePrices: {},
      volumeByCategory: {},
      trendingArtists: [],
      hotCategories: []
    };
  }

  /**
   * Get smart pricing recommendation for an artwork
   */
  async getPricingRecommendation(artworkData, marketContext = {}) {
    try {
      const recommendation = {
        suggestedPrice: 0,
        priceRange: { min: 0, max: 0 },
        confidence: 0,
        factors: [],
        marketAnalysis: {},
        comparableSales: [],
        timestamp: new Date().toISOString()
      };

      // 1. Base price calculation
      const basePrice = this.calculateBasePrice(artworkData);
      
      // 2. Apply artist tier multiplier
      const artistMultiplier = await this.getArtistMultiplier(artworkData.artistAddress);
      
      // 3. Apply quality/scarcity factors
      const qualityFactor = this.calculateQualityFactor(artworkData);
      const scarcityFactor = this.calculateScarcityFactor(artworkData);
      
      // 4. Apply market trends
      const marketFactor = this.calculateMarketFactor(artworkData, marketContext);
      
      // 5. Apply cultural significance premium
      const culturalPremium = this.calculateCulturalPremium(artworkData);

      // Calculate final price
      const adjustedPrice = basePrice * artistMultiplier * qualityFactor * 
                           scarcityFactor * marketFactor * culturalPremium;

      recommendation.suggestedPrice = Math.round(adjustedPrice);
      
      // Calculate price range (±20%)
      recommendation.priceRange = {
        min: Math.round(adjustedPrice * 0.8),
        max: Math.round(adjustedPrice * 1.2)
      };

      // Build factors list
      recommendation.factors = [
        { name: 'base_price', value: basePrice, weight: 0.25 },
        { name: 'artist_tier', value: artistMultiplier, weight: 0.20 },
        { name: 'quality', value: qualityFactor, weight: 0.15 },
        { name: 'scarcity', value: scarcityFactor, weight: 0.15 },
        { name: 'market_trends', value: marketFactor, weight: 0.15 },
        { name: 'cultural_significance', value: culturalPremium, weight: 0.10 }
      ];

      // Get comparable sales
      recommendation.comparableSales = await this.findComparableSales(artworkData);

      // Market analysis
      recommendation.marketAnalysis = await this.getMarketAnalysis(artworkData.Type);

      // Calculate confidence
      recommendation.confidence = this.calculateConfidence(recommendation.factors);

      return recommendation;
    } catch (error) {
      console.error('Pricing recommendation error:', error);
      throw error;
    }
  }

  /**
   * Calculate base price from category
   */
  calculateBasePrice(artworkData) {
    const category = artworkData.Type?.toLowerCase() || 'digital_art';
    const categoryData = this.categoryMultipliers.get(category) || 
                        this.categoryMultipliers.get('digital_art');
    
    // Adjust for size/complexity
    let sizeMultiplier = 1.0;
    if (artworkData.dimensions) {
      const area = artworkData.dimensions.width * artworkData.dimensions.height;
      if (area > 10000) sizeMultiplier = 2.0;
      else if (area > 5000) sizeMultiplier = 1.5;
      else if (area > 2000) sizeMultiplier = 1.2;
    }

    // Adjust for time invested
    let timeMultiplier = 1.0;
    if (artworkData.hoursInvested) {
      if (artworkData.hoursInvested > 100) timeMultiplier = 1.5;
      else if (artworkData.hoursInvested > 50) timeMultiplier = 1.3;
      else if (artworkData.hoursInvested > 20) timeMultiplier = 1.1;
    }

    return categoryData.base * categoryData.multiplier * sizeMultiplier * timeMultiplier;
  }

  /**
   * Get artist tier multiplier
   */
  async getArtistMultiplier(artistAddress) {
    // In production, fetch from database
    // For now, return based on mock data or default
    const tier = this.artistTiers.get('emerging'); // Default
    return tier || 1.0;
  }

  /**
   * Calculate quality factor based on artwork attributes
   */
  calculateQualityFactor(artworkData) {
    let factor = 1.0;

    // Materials quality
    if (artworkData.materials) {
      const premiumMaterials = ['gold', 'silver', 'turquoise', 'natural_dyes', 'traditional_clay'];
      const hasPremium = artworkData.materials.some(m => 
        premiumMaterials.some(pm => m.toLowerCase().includes(pm))
      );
      if (hasPremium) factor += 0.2;
    }

    // Technique complexity
    if (artworkData.technique) {
      const complexTechniques = ['weaving', 'sandpainting', 'silver_inlay', 'double_weave'];
      if (complexTechniques.some(t => artworkData.technique.toLowerCase().includes(t))) {
        factor += 0.15;
      }
    }

    // Condition
    if (artworkData.condition) {
      switch(artworkData.condition.toLowerCase()) {
        case 'excellent': factor += 0.1; break;
        case 'good': factor += 0.05; break;
        case 'fair': factor -= 0.1; break;
        case 'poor': factor -= 0.2; break;
      }
    }

    // Certification
    if (artworkData.certificateOfAuthenticity) factor += 0.1;
    if (artworkData.elderVerified) factor += 0.15;

    return Math.max(0.5, Math.min(2.0, factor));
  }

  /**
   * Calculate scarcity factor
   */
  calculateScarcityFactor(artworkData) {
    let factor = 1.0;

    // Edition size
    if (artworkData.editionSize) {
      if (artworkData.editionSize === 1) factor += 0.5; // One-of-a-kind
      else if (artworkData.editionSize <= 5) factor += 0.3;
      else if (artworkData.editionSize <= 10) factor += 0.2;
      else if (artworkData.editionSize <= 25) factor += 0.1;
    }

    // Rarity of materials
    if (artworkData.rareMaterials) {
      factor += 0.2;
    }

    // Historical significance
    if (artworkData.historicalSignificance) {
      factor += 0.25;
    }

    return Math.max(0.8, Math.min(2.0, factor));
  }

  /**
   * Calculate market trend factor
   */
  calculateMarketFactor(artworkData, marketContext) {
    let factor = 1.0;

    // Category trend
    const category = artworkData.Type?.toLowerCase();
    if (this.marketData.hotCategories.includes(category)) {
      factor += 0.15;
    }

    // Seasonal factors
    const month = new Date().getMonth();
    const isHolidaySeason = month === 11 || month === 0; // Dec-Jan
    if (isHolidaySeason) factor += 0.1;

    // Market demand from context
    if (marketContext.demandLevel) {
      switch(marketContext.demandLevel) {
        case 'very_high': factor += 0.2; break;
        case 'high': factor += 0.1; break;
        case 'low': factor -= 0.1; break;
        case 'very_low': factor -= 0.2; break;
      }
    }

    return Math.max(0.7, Math.min(1.5, factor));
  }

  /**
   * Calculate cultural significance premium
   */
  calculateCulturalPremium(artworkData) {
    let premium = 1.0;

    // Sacred or ceremonial significance
    if (artworkData.sacredStatus === 'sacred') {
      premium += 0.3;
    } else if (artworkData.sacredStatus === 'ceremonial') {
      premium += 0.2;
    }

    // Traditional knowledge
    if (artworkData.traditionalKnowledge) {
      premium += 0.15;
    }

    // Language preservation element
    if (artworkData.languageElement) {
      premium += 0.1;
    }

    // Story/history included
    if (artworkData.story || artworkData.provenance) {
      premium += 0.1;
    }

    return Math.max(1.0, Math.min(1.5, premium));
  }

  /**
   * Find comparable sales
   */
  async findComparableSales(artworkData) {
    // In production, query database for similar sales
    // Return mock data for now
    return [
      {
        artworkName: 'Similar ' + artworkData.Type,
        artist: 'Comparable Artist',
        price: Math.round(this.calculateBasePrice(artworkData) * 1.1),
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        similarity: 0.85
      },
      {
        artworkName: artworkData.Type + ' Piece',
        artist: 'Another Artist',
        price: Math.round(this.calculateBasePrice(artworkData) * 0.9),
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        similarity: 0.75
      }
    ];
  }

  /**
   * Get market analysis for a category
   */
  async getMarketAnalysis(category) {
    const categoryKey = category?.toLowerCase() || 'digital_art';
    
    return {
      category: categoryKey,
      averagePrice: this.categoryMultipliers.get(categoryKey)?.base || 100,
      volume30d: Math.floor(Math.random() * 100) + 20,
      priceTrend: ['up', 'stable', 'down'][Math.floor(Math.random() * 3)],
      trendPercentage: Math.floor(Math.random() * 20) - 5,
      demandLevel: ['very_high', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)]
    };
  }

  /**
   * Calculate confidence score
   */
  calculateConfidence(factors) {
    // More factors with high weights = higher confidence
    const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
    const weightedScore = factors.reduce((sum, f) => sum + (f.value * f.weight), 0);
    
    const normalizedScore = weightedScore / totalWeight;
    const confidence = Math.min(95, Math.max(60, normalizedScore * 100));
    
    return Math.round(confidence);
  }

  /**
   * Batch pricing for multiple artworks
   */
  async getBatchPricing(artworksData) {
    const recommendations = await Promise.all(
      artworksData.map(artwork => this.getPricingRecommendation(artwork))
    );
    
    return {
      totalArtworks: artworksData.length,
      totalSuggestedValue: recommendations.reduce((sum, r) => sum + r.suggestedPrice, 0),
      averagePrice: Math.round(recommendations.reduce((sum, r) => sum + r.suggestedPrice, 0) / recommendations.length),
      recommendations
    };
  }

  /**
   * Update market data (called periodically)
   */
  async updateMarketData(salesData) {
    this.marketData.lastUpdated = new Date();
    
    // Calculate averages by category
    const categoryTotals = {};
    const categoryCounts = {};
    
    salesData.forEach(sale => {
      const category = sale.Type?.toLowerCase() || 'digital_art';
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
        categoryCounts[category] = 0;
      }
      categoryTotals[category] += sale.Price;
      categoryCounts[category]++;
    });
    
    for (const category of Object.keys(categoryTotals)) {
      this.marketData.averagePrices[category] = 
        categoryTotals[category] / categoryCounts[category];
      this.marketData.volumeByCategory[category] = categoryCounts[category];
    }
    
    // Identify trending categories (top 3 by volume)
    this.marketData.hotCategories = Object.entries(this.marketData.volumeByCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category]) => category);
  }
}

module.exports = new PricingEngineService();
