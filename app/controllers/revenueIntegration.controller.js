/**
 * Revenue Integration Controller
 * Processes all revenue-generating activities
 */

const revenueIntegration = require('../services/revenue/revenueIntegration.service.js');

// ==================== TRANSACTION PROCESSING ====================

exports.processNFTSale = async (req, res) => {
  try {
    const { seller, buyer, nftId, amount, currency, pillar, escrow, instantPayout } = req.body;
    const result = await revenueIntegration.processNFTSale({ 
      seller, buyer, nftId, amount, currency, pillar, escrow, instantPayout 
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.processSubscriptionPayment = async (req, res) => {
  try {
    const { user, tier, amount, currency, period } = req.body;
    const result = await revenueIntegration.processSubscriptionPayment({ user, tier, amount, currency, period });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.processSevaDonation = async (req, res) => {
  try {
    const { donor, campaignId, amount, currency, type } = req.body;
    const result = await revenueIntegration.processSevaDonation({ donor, campaignId, amount, currency, type });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.processPremiumFeature = async (req, res) => {
  try {
    const { user, feature, amount, currency } = req.body;
    const result = await revenueIntegration.processPremiumFeature({ user, feature, amount, currency });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.processB2BService = async (req, res) => {
  try {
    const { client, service, amount, currency } = req.body;
    const result = await revenueIntegration.processB2BService({ client, service, amount, currency });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.processLogisticsService = async (req, res) => {
  try {
    const { user, service, amount, currency, itemCount } = req.body;
    const result = await revenueIntegration.processLogisticsService({ user, service, amount, currency, itemCount });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.processDataInsights = async (req, res) => {
  try {
    const { client, product, amount, currency } = req.body;
    const result = await revenueIntegration.processDataInsightsPurchase({ client, product, amount, currency });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.processAdvertising = async (req, res) => {
  try {
    const { advertiser, option, amount, currency, duration } = req.body;
    const result = await revenueIntegration.processAdvertisingPurchase({ advertiser, option, amount, currency, duration });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.processEventTicketing = async (req, res) => {
  try {
    const { eventId, buyer, amount, currency, eventType } = req.body;
    const result = await revenueIntegration.processEventTicketing({ eventId, buyer, amount, currency, eventType });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.processArchiveAccess = async (req, res) => {
  try {
    const { user, tier, amount, currency } = req.body;
    const result = await revenueIntegration.processArchiveAccess({ user, tier, amount, currency });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.processCertification = async (req, res) => {
  try {
    const { user, service, amount, currency } = req.body;
    const result = await revenueIntegration.processCertification({ user, service, amount, currency });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.processCommission = async (req, res) => {
  try {
    const { client, artist, service, amount, currency } = req.body;
    const result = await revenueIntegration.processCommission({ client, artist, service, amount, currency });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.processPhysicalVenture = async (req, res) => {
  try {
    const { buyer, product, amount, currency } = req.body;
    const result = await revenueIntegration.processPhysicalVenture({ buyer, product, amount, currency });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== DAILY SUMMARY ====================

exports.getDailyRevenue = async (req, res) => {
  try {
    const { date } = req.query;
    const queryDate = date ? new Date(date) : new Date();
    const result = await revenueIntegration.getDailyRevenueSummary(queryDate);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== AUTOMATED COLLECTION ====================

exports.autoCollectRevenue = async (req, res) => {
  try {
    // This endpoint would be called by a cron job or scheduler
    // to automatically process pending revenue collections
    
    const { streamId, pendingTransactions } = req.body;
    
    const results = [];
    for (const tx of pendingTransactions) {
      try {
        let result;
        switch (tx.type) {
          case 'nft_sale':
            result = await revenueIntegration.processNFTSale(tx.data);
            break;
          case 'subscription':
            result = await revenueIntegration.processSubscriptionPayment(tx.data);
            break;
          case 'donation':
            result = await revenueIntegration.processSevaDonation(tx.data);
            break;
          case 'premium':
            result = await revenueIntegration.processPremiumFeature(tx.data);
            break;
          default:
            result = { success: false, message: 'Unknown transaction type' };
        }
        results.push({ txId: tx.id, result });
      } catch (error) {
        results.push({ txId: tx.id, error: error.message });
      }
    }

    res.status(200).json({
      success: true,
      processed: results.length,
      results: results
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
