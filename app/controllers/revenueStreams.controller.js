/**
 * Revenue Streams Controller
 * All 14 revenue streams management
 */

const revenueModel = require('../services/revenue/revenueModel.service.js');

// ==================== REVENUE TRANSACTIONS ====================

exports.recordTransaction = async (req, res) => {
  try {
    const { streamId, pillar, amount, currency, source, metadata } = req.body;
    const result = await revenueModel.recordTransaction({ streamId, pillar, amount, currency, source, metadata });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.calculateFees = async (req, res) => {
  try {
    const { pillar, amount, escrow, instantPayout } = req.body;
    const result = await revenueModel.calculateFees(pillar, amount, { escrow, instantPayout });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== REVENUE DASHBOARD ====================

exports.getRevenueDashboard = async (req, res) => {
  try {
    const { period } = req.query;
    const result = await revenueModel.getRevenueDashboard(period);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPillarRevenue = async (req, res) => {
  try {
    const { pillar } = req.params;
    const { period } = req.query;
    const result = await revenueModel.getPillarRevenue(pillar, { period });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRevenueStream = async (req, res) => {
  try {
    const { streamId } = req.params;
    const result = await revenueModel.getRevenueStream(streamId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllRevenueStreams = async (req, res) => {
  try {
    const result = await revenueModel.getAllRevenueStreams();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== PROJECTIONS ====================

exports.getRevenueProjections = async (req, res) => {
  try {
    const { years } = req.query;
    const result = await revenueModel.projectRevenue(parseInt(years) || 5);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== TRANSACTION FEE STREAM ====================

exports.getTransactionFeesConfig = async (req, res) => {
  try {
    const stream = await revenueModel.getRevenueStream('transaction_fees');
    res.status(200).json(stream);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== SUBSCRIPTION STREAM ====================

exports.getSubscriptionTiers = async (req, res) => {
  try {
    const stream = await revenueModel.getRevenueStream('subscriptions');
    res.status(200).json({
      success: true,
      tiers: stream.stream.tiers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== SEVA SERVICES STREAM ====================

exports.getSevaServicesConfig = async (req, res) => {
  try {
    const stream = await revenueModel.getRevenueStream('seva_services');
    res.status(200).json({
      success: true,
      fees: stream.stream.fees
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== PREMIUM FEATURES STREAM ====================

exports.getPremiumFeatures = async (req, res) => {
  try {
    const stream = await revenueModel.getRevenueStream('premium_features');
    res.status(200).json({
      success: true,
      features: stream.stream.features
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== B2B ENTERPRISE STREAM ====================

exports.getB2BServices = async (req, res) => {
  try {
    const stream = await revenueModel.getRevenueStream('b2b_enterprise');
    res.status(200).json({
      success: true,
      services: stream.stream.services
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== LOGISTICS STREAM ====================

exports.getLogisticsServices = async (req, res) => {
  try {
    const stream = await revenueModel.getRevenueStream('logistics');
    res.status(200).json({
      success: true,
      services: stream.stream.services
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== DATA INSIGHTS STREAM ====================

exports.getDataProducts = async (req, res) => {
  try {
    const stream = await revenueModel.getRevenueStream('data_insights');
    res.status(200).json({
      success: true,
      products: stream.stream.products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ADVERTISING STREAM ====================

exports.getAdvertisingOptions = async (req, res) => {
  try {
    const stream = await revenueModel.getRevenueStream('advertising');
    res.status(200).json({
      success: true,
      options: stream.stream.options
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== TICKETING STREAM ====================

exports.getTicketingEvents = async (req, res) => {
  try {
    const stream = await revenueModel.getRevenueStream('ticketing');
    res.status(200).json({
      success: true,
      events: stream.stream.events
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== FINANCIAL SERVICES STREAM ====================

exports.getFinancialServices = async (req, res) => {
  try {
    const stream = await revenueModel.getRevenueStream('financial_services');
    res.status(200).json({
      success: true,
      services: stream.stream.services
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ARCHIVE ACCESS STREAM ====================

exports.getArchiveTiers = async (req, res) => {
  try {
    const stream = await revenueModel.getRevenueStream('archive_access');
    res.status(200).json({
      success: true,
      tiers: stream.stream.tiers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== CERTIFICATION STREAM ====================

exports.getCertificationServices = async (req, res) => {
  try {
    const stream = await revenueModel.getRevenueStream('certification');
    res.status(200).json({
      success: true,
      services: stream.stream.services
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== COMMISSIONS STREAM ====================

exports.getCommissionServices = async (req, res) => {
  try {
    const stream = await revenueModel.getRevenueStream('commissions');
    res.status(200).json({
      success: true,
      services: stream.stream.services
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== PHYSICAL VENTURES STREAM ====================

exports.getPhysicalProducts = async (req, res) => {
  try {
    const stream = await revenueModel.getRevenueStream('physical_ventures');
    res.status(200).json({
      success: true,
      products: stream.stream.products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== COMPREHENSIVE REPORTS ====================

exports.getYear5Projection = async (req, res) => {
  try {
    const projection = await revenueModel.projectRevenue(5);
    
    res.status(200).json({
      success: true,
      year5Total: projection.totalYear5,
      byStream: projection.byStream,
      breakdown: {
        recurring: 186000000, // Subscriptions
        transactionBased: 78000000,
        serviceBased: 72000000,
        licensingData: 35000000
      },
      profitability: {
        revenue: 371175000,
        operatingExpenses: 120000000,
        operatingProfit: 251175000,
        profitMargin: '68%',
        rdReinvestment: 60000000,
        sevaAllocation: 75000000,
        artistDevelopment: 40000000,
        netToPlatform: 76175000
      },
      valuation: {
        revenue10x: 3711750000,
        revenue15x: 5567625000,
        revenue20x: 7423500000,
        revenue25x: 9279375000
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPillarRevenueBreakdown = async (req, res) => {
  try {
    const breakdown = {
      digital_arts: { revenue: 42000000, sources: ['Transaction fees', 'Licensing', 'Featured listings'] },
      physical_items: { revenue: 48000000, sources: ['Transaction fees', 'Shipping', 'Insurance', 'NFC tags'] },
      courses: { revenue: 28000000, sources: ['Transaction fees', 'Certifications', 'Featured courses'] },
      freelancing: { revenue: 18000000, sources: ['Transaction fees', 'Featured profiles', 'Escrow'] },
      seva: { revenue: 65000000, sources: ['Donation fees', 'Project management', 'Corporate matching'] },
      cultural_tourism: { revenue: 22000000, sources: ['Booking fees', 'Event tickets', 'Featured experiences'] },
      language_heritage: { revenue: 68000000, sources: ['Subscriptions', 'Archive access', 'Translation services'] },
      land_food: { revenue: 15000000, sources: ['Transaction fees', 'Seed sales', 'Conservation fees'] },
      advocacy_legal: { revenue: 12000000, sources: ['Legal fund fees', 'Pro bono matching', 'Policy alerts'] },
      materials_tools: { revenue: 28000000, sources: ['Transaction fees', 'Bulk orders', 'Tool rental'] },
      platform_wide: { revenue: 25000000, sources: ['Advertising', 'Data insights', 'Financial services'] }
    };

    res.status(200).json({
      success: true,
      year5: breakdown,
      total: 371175000
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
