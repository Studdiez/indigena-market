/**
 * Analytics Controller
 * Provides endpoints for:
 * - Real-time dashboards with WebSocket
 * - Predictive analytics
 * - Artist career tracking
 * - Market intelligence
 * - Cultural impact reporting
 */

const websocketService = require('../services/analytics/websocket.service.js');
const predictiveAnalytics = require('../services/analytics/predictiveAnalytics.service.js');
const artistCareer = require('../services/analytics/artistCareer.service.js');
const marketIntelligence = require('../services/analytics/marketIntelligence.service.js');
const culturalImpact = require('../services/analytics/culturalImpact.service.js');

// ==================== REAL-TIME DASHBOARD ====================

exports.getRealtimeStats = async (req, res) => {
  try {
    const stats = websocketService.getMetrics();
    
    res.status(200).json({
      success: true,
      stats: {
        ...stats,
        websocketStatus: 'active',
        endpoint: '/ws/analytics'
      }
    });
  } catch (error) {
    console.error('Get realtime stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMarketOverview = async (req, res) => {
  try {
    const overview = await websocketService.generateMarketOverview();
    
    res.status(200).json({
      success: true,
      overview: overview.data
    });
  } catch (error) {
    console.error('Get market overview error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSalesFeed = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const feed = {
      type: 'sales_feed',
      data: Array.from({ length: parseInt(limit) }, (_, i) => ({
        id: `sale_${Date.now()}_${i}`,
        artwork: `Artwork ${i + 1}`,
        artist: `Artist ${Math.floor(Math.random() * 50) + 1}`,
        price: Math.floor(Math.random() * 1000) + 50,
        buyer: `Buyer ${Math.floor(Math.random() * 100) + 1}`,
        time: new Date(Date.now() - i * 60000).toISOString(),
        type: ['primary', 'secondary'][Math.floor(Math.random() * 2)]
      }))
    };
    
    res.status(200).json({
      success: true,
      feed
    });
  } catch (error) {
    console.error('Get sales feed error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== PREDICTIVE ANALYTICS ====================

exports.forecastMarketTrends = async (req, res) => {
  try {
    const { timeframe = '30d', category = 'all', granularity = 'daily' } = req.query;
    
    const forecast = await predictiveAnalytics.forecastMarketTrends({
      timeframe,
      category,
      granularity
    });
    
    res.status(200).json({
      success: true,
      forecast
    });
  } catch (error) {
    console.error('Forecast market trends error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.predictPrice = async (req, res) => {
  try {
    const { nftId } = req.params;
    const artworkData = req.body;
    
    const prediction = await predictiveAnalytics.predictPrice(artworkData);
    
    res.status(200).json({
      success: true,
      nftId,
      prediction
    });
  } catch (error) {
    console.error('Predict price error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.predictDemand = async (req, res) => {
  try {
    const { category, nation } = req.params;
    const { timeframe = '30d' } = req.query;
    
    const demand = await predictiveAnalytics.predictDemand(category, nation, timeframe);
    
    res.status(200).json({
      success: true,
      demand
    });
  } catch (error) {
    console.error('Predict demand error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.identifyEmergingTrends = async (req, res) => {
  try {
    const { lookbackDays = 90, minGrowthRate = 0.2 } = req.query;
    
    const trends = await predictiveAnalytics.identifyEmergingTrends({
      lookbackDays: parseInt(lookbackDays),
      minGrowthRate: parseFloat(minGrowthRate)
    });
    
    res.status(200).json({
      success: true,
      trends
    });
  } catch (error) {
    console.error('Identify trends error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSeasonalForecast = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    
    const forecast = await predictiveAnalytics.generateSeasonalForecast(parseInt(year));
    
    res.status(200).json({
      success: true,
      forecast
    });
  } catch (error) {
    console.error('Seasonal forecast error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ARTIST CAREER TRACKING ====================

exports.getCareerDashboard = async (req, res) => {
  try {
    const { address } = req.params;
    
    const dashboard = await artistCareer.getCareerDashboard(address);
    
    res.status(200).json({
      success: true,
      dashboard
    });
  } catch (error) {
    console.error('Get career dashboard error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getArtistLeaderboard = async (req, res) => {
  try {
    const { category = 'overall', limit = 10 } = req.query;
    
    const leaderboard = await artistCareer.getLeaderboard(category, parseInt(limit));
    
    res.status(200).json({
      success: true,
      leaderboard
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getArtistAchievements = async (req, res) => {
  try {
    const { address } = req.params;
    
    const achievements = await artistCareer.getAchievements(address);
    
    res.status(200).json({
      success: true,
      achievements
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getArtistGrowthTrajectory = async (req, res) => {
  try {
    const { address } = req.params;
    
    const trajectory = await artistCareer.getGrowthTrajectory(address);
    
    res.status(200).json({
      success: true,
      trajectory
    });
  } catch (error) {
    console.error('Get growth trajectory error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== MARKET INTELLIGENCE ====================

exports.getMarketIntelligenceReport = async (req, res) => {
  try {
    const { timeframe = '30d', category = 'all' } = req.query;
    
    const report = await marketIntelligence.getMarketIntelligenceReport({
      timeframe,
      category
    });
    
    res.status(200).json({
      success: true,
      report
    });
  } catch (error) {
    console.error('Market intelligence error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCompetitorAnalysis = async (req, res) => {
  try {
    const analysis = await marketIntelligence.analyzeCompetitors();
    
    res.status(200).json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Competitor analysis error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPricingTrends = async (req, res) => {
  try {
    const { category = 'all', timeframe = '30d' } = req.query;
    
    const trends = await marketIntelligence.analyzePricingTrends(category, timeframe);
    
    res.status(200).json({
      success: true,
      trends
    });
  } catch (error) {
    console.error('Pricing trends error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMarketOpportunities = async (req, res) => {
  try {
    const opportunities = await marketIntelligence.identifyOpportunities();
    
    res.status(200).json({
      success: true,
      opportunities
    });
  } catch (error) {
    console.error('Market opportunities error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPricingIntelligence = async (req, res) => {
  try {
    const { nftId } = req.params;
    const artworkData = req.body;
    
    const intelligence = await marketIntelligence.getPricingIntelligence(artworkData);
    
    res.status(200).json({
      success: true,
      nftId,
      intelligence
    });
  } catch (error) {
    console.error('Pricing intelligence error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMarketAlerts = async (req, res) => {
  try {
    const alerts = await marketIntelligence.getMarketAlerts();
    
    res.status(200).json({
      success: true,
      alerts
    });
  } catch (error) {
    console.error('Market alerts error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== CULTURAL IMPACT ====================

exports.getCulturalImpactReport = async (req, res) => {
  try {
    const { timeframe = '1y', nation = 'all' } = req.query;
    
    const report = await culturalImpact.generateImpactReport({
      timeframe,
      nation
    });
    
    res.status(200).json({
      success: true,
      report
    });
  } catch (error) {
    console.error('Cultural impact error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRealtimeImpact = async (req, res) => {
  try {
    const impact = await culturalImpact.getRealtimeImpact();
    
    res.status(200).json({
      success: true,
      impact
    });
  } catch (error) {
    console.error('Realtime impact error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getImpactByNation = async (req, res) => {
  try {
    const { nation } = req.params;
    
    const impact = await culturalImpact.getImpactByNation(nation);
    
    res.status(200).json({
      success: true,
      impact
    });
  } catch (error) {
    console.error('Impact by nation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPreservationEfforts = async (req, res) => {
  try {
    const { timeframe = '1y' } = req.query;
    
    const efforts = await culturalImpact.analyzePreservationEfforts(timeframe);
    
    res.status(200).json({
      success: true,
      preservation: efforts
    });
  } catch (error) {
    console.error('Preservation efforts error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLanguageImpact = async (req, res) => {
  try {
    const { timeframe = '1y' } = req.query;
    
    const impact = await culturalImpact.analyzeLanguageImpact(timeframe);
    
    res.status(200).json({
      success: true,
      language: impact
    });
  } catch (error) {
    console.error('Language impact error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== COMBINED ANALYTICS ====================

exports.getComprehensiveAnalytics = async (req, res) => {
  try {
    const { address } = req.params;
    const { timeframe = '30d' } = req.query;
    
    // Fetch multiple analytics in parallel
    const [
      careerData,
      marketTrends,
      culturalData
    ] = await Promise.all([
      artistCareer.getCareerDashboard(address),
      predictiveAnalytics.forecastMarketTrends({ timeframe }),
      culturalImpact.getRealtimeImpact()
    ]);
    
    res.status(200).json({
      success: true,
      analytics: {
        artist: careerData,
        market: marketTrends,
        cultural: culturalData,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Comprehensive analytics error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDashboardSummary = async (req, res) => {
  try {
    // Get key metrics for main dashboard
    const [
      marketOverview,
      culturalImpact,
      realtimeStats
    ] = await Promise.all([
      websocketService.generateMarketOverview(),
      culturalImpact.getRealtimeImpact(),
      Promise.resolve(websocketService.getMetrics())
    ]);
    
    res.status(200).json({
      success: true,
      summary: {
        market: marketOverview.data,
        impact: culturalImpact,
        system: realtimeStats,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
