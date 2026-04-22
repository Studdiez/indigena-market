const RoyaltyEarning = require('../models/RoyaltyEarning.model.js');
const RoyaltyBeneficiary = require('../models/RoyaltyBeneficiary.model.js');
const RoyaltyTier = require('../models/RoyaltyTier.model.js');
const RoyaltyClaim = require('../models/RoyaltyClaim.model.js');
const RoyaltyNotification = require('../models/RoyaltyNotification.model.js');
const NFTCollection = require('../models/NFTcollection.model.js');
const User = require('../models/user.model.js');

/**
 * Royalty Controller
 * Advanced royalty management system with analytics, multi-beneficiary support,
 * tiered royalties, claims, notifications, and cross-platform tracking
 */

// ==================== 1. ROYALTY ANALYTICS ====================

// Get comprehensive royalty analytics for an artist
exports.getRoyaltyAnalytics = async (req, res) => {
  try {
    const { address } = req.params;
    const { period = '30d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    switch(period) {
      case '7d': startDate.setDate(now.getDate() - 7); break;
      case '30d': startDate.setDate(now.getDate() - 30); break;
      case '90d': startDate.setDate(now.getDate() - 90); break;
      case '1y': startDate.setFullYear(now.getFullYear() - 1); break;
      case 'all': startDate = new Date(0); break;
      default: startDate.setDate(now.getDate() - 30);
    }
    
    // Aggregate earnings data
    const earnings = await RoyaltyEarning.aggregate([
      { 
        $match: { 
          artistAddress: address,
          saleDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$royaltyAmount' },
          totalTransactions: { $sum: 1 },
          primarySales: { 
            $sum: { $cond: [{ $eq: ['$saleType', 'primary'] }, 1, 0] }
          },
          secondarySales: { 
            $sum: { $cond: [{ $eq: ['$saleType', 'secondary'] }, 1, 0] }
          },
          primaryEarnings: {
            $sum: { $cond: [{ $eq: ['$saleType', 'primary'] }, '$royaltyAmount', 0] }
          },
          secondaryEarnings: {
            $sum: { $cond: [{ $eq: ['$saleType', 'secondary'] }, '$royaltyAmount', 0] }
          },
          avgRoyaltyPerSale: { $avg: '$royaltyAmount' },
          highestSale: { $max: '$salePrice' },
          topNFT: { $max: { royaltyAmount: '$royaltyAmount', nftId: '$nftId', nftName: '$nftName' } }
        }
      }
    ]);
    
    // Daily earnings for charts
    const dailyEarnings = await RoyaltyEarning.aggregate([
      {
        $match: {
          artistAddress: address,
          saleDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$saleDate' } },
          earnings: { $sum: '$royaltyAmount' },
          sales: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Top earning NFTs
    const topNFTs = await RoyaltyEarning.aggregate([
      {
        $match: {
          artistAddress: address,
          saleDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$nftId',
          nftName: { $first: '$nftName' },
          totalEarnings: { $sum: '$royaltyAmount' },
          sales: { $sum: 1 },
          avgSalePrice: { $avg: '$salePrice' }
        }
      },
      { $sort: { totalEarnings: -1 } },
      { $limit: 5 }
    ]);
    
    // Secondary market activity
    const secondaryActivity = await RoyaltyEarning.aggregate([
      {
        $match: {
          artistAddress: address,
          saleType: 'secondary',
          saleDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalSecondaryVolume: { $sum: '$salePrice' },
          totalSecondaryRoyalties: { $sum: '$royaltyAmount' },
          avgResalePrice: { $avg: '$salePrice' },
          resaleCount: { $sum: 1 }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      period,
      summary: earnings[0] || {
        totalEarnings: 0,
        totalTransactions: 0,
        primarySales: 0,
        secondarySales: 0
      },
      dailyEarnings,
      topNFTs,
      secondaryMarket: secondaryActivity[0] || {
        totalSecondaryVolume: 0,
        totalSecondaryRoyalties: 0,
        resaleCount: 0
      }
    });
  } catch (error) {
    console.error('Royalty analytics error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get royalty leaderboard (top earning artists)
exports.getRoyaltyLeaderboard = async (req, res) => {
  try {
    const { period = '30d', limit = 10 } = req.query;
    
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - parseInt(period));
    
    const leaderboard = await RoyaltyEarning.aggregate([
      {
        $match: { saleDate: { $gte: startDate } }
      },
      {
        $group: {
          _id: '$artistAddress',
          artistName: { $first: '$artistName' },
          totalEarnings: { $sum: '$royaltyAmount' },
          totalSales: { $sum: 1 },
          secondarySales: {
            $sum: { $cond: [{ $eq: ['$saleType', 'secondary'] }, 1, 0] }
          }
        }
      },
      { $sort: { totalEarnings: -1 } },
      { $limit: parseInt(limit) }
    ]);
    
    res.status(200).json({
      success: true,
      period,
      leaderboard
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== 2. MULTI-BENEFICIARY ROYALTIES ====================

// Set up royalty beneficiaries for an NFT
exports.setBeneficiaries = async (req, res) => {
  try {
    const { nftId } = req.params;
    const { beneficiaries, communityFundAllocation, splitRules } = req.body;
    
    // Validate total percentage = 100
    const totalPercent = beneficiaries.reduce((sum, b) => sum + b.percentage, 0);
    if (communityFundAllocation?.enabled) {
      totalPercent += communityFundAllocation.percentage;
    }
    
    if (totalPercent !== 100) {
      return res.status(400).json({
        success: false,
        message: 'Total beneficiary percentage must equal 100%'
      });
    }
    
    // Get NFT and artist info
    const nft = await NFTCollection.findOne({ NftId: nftId });
    if (!nft) {
      return res.status(404).json({ success: false, message: 'NFT not found' });
    }
    
    // Create or update beneficiary record
    const beneficiaryRecord = await RoyaltyBeneficiary.findOneAndUpdate(
      { nftId },
      {
        primaryArtistAddress: nft.WalletAddress,
        primaryArtistName: nft.Creator,
        beneficiaries,
        communityFundAllocation,
        splitRules,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Royalty beneficiaries updated',
      data: beneficiaryRecord
    });
  } catch (error) {
    console.error('Set beneficiaries error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get beneficiaries for an NFT
exports.getBeneficiaries = async (req, res) => {
  try {
    const { nftId } = req.params;
    
    const beneficiaries = await RoyaltyBeneficiary.findOne({ nftId });
    
    if (!beneficiaries) {
      return res.status(200).json({
        success: true,
        data: {
          nftId,
          beneficiaries: [],
          isActive: false
        }
      });
    }
    
    res.status(200).json({ success: true, data: beneficiaries });
  } catch (error) {
    console.error('Get beneficiaries error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Distribute royalty to multiple beneficiaries
exports.distributeRoyalty = async (req, res) => {
  try {
    const { earningId } = req.params;
    
    const earning = await RoyaltyEarning.findById(earningId);
    if (!earning) {
      return res.status(404).json({ success: false, message: 'Earning not found' });
    }
    
    const beneficiaries = await RoyaltyBeneficiary.findOne({ nftId: earning.nftId });
    if (!beneficiaries || !beneficiaries.isActive) {
      return res.status(200).json({
        success: true,
        message: 'No multi-beneficiary setup, full amount goes to primary artist',
        distribution: [{
          address: earning.artistAddress,
          name: earning.artistName,
          amount: earning.royaltyAmount,
          percentage: 100
        }]
      });
    }
    
    // Calculate distribution
    const distributions = beneficiaries.beneficiaries.map(b => ({
      address: b.walletAddress,
      name: b.name,
      relationship: b.relationship,
      percentage: b.percentage,
      amount: (earning.royaltyAmount * b.percentage) / 100
    }));
    
    // Add community fund if enabled
    if (beneficiaries.communityFundAllocation.enabled) {
      distributions.push({
        address: beneficiaries.communityFundAllocation.fundAddress,
        name: beneficiaries.communityFundAllocation.fundName,
        relationship: 'community_fund',
        percentage: beneficiaries.communityFundAllocation.percentage,
        amount: (earning.royaltyAmount * beneficiaries.communityFundAllocation.percentage) / 100
      });
    }
    
    res.status(200).json({
      success: true,
      totalAmount: earning.royaltyAmount,
      distributions
    });
  } catch (error) {
    console.error('Distribute royalty error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== 3. TIERED ROYALTY SYSTEM ====================

// Create or update royalty tier configuration
exports.setRoyaltyTier = async (req, res) => {
  try {
    const { nftId } = req.params;
    const tierData = req.body;
    
    const tier = await RoyaltyTier.findOneAndUpdate(
      { nftId },
      { ...tierData, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Royalty tier configuration updated',
      data: tier
    });
  } catch (error) {
    console.error('Set royalty tier error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Calculate royalty with tier rules
exports.calculateTieredRoyalty = async (req, res) => {
  try {
    const { nftId } = req.params;
    const { salePrice, buyerType = 'public', volumeCount = 0 } = req.body;
    
    const tier = await RoyaltyTier.findOne({ nftId, isActive: true });
    
    if (!tier) {
      // Return default royalty calculation
      return res.status(200).json({
        success: true,
        defaultCalculation: true,
        royaltyPercent: 10,
        royaltyAmount: salePrice * 0.1,
        message: 'No tier configuration found, using default 10%'
      });
    }
    
    const result = tier.calculateRoyalty(salePrice, new Date(), buyerType, volumeCount);
    
    res.status(200).json({
      success: true,
      tierType: tier.tierType,
      ...result
    });
  } catch (error) {
    console.error('Calculate tiered royalty error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== 4. ROYALTY CLAIMS & PAYOUTS ====================

// Get available earnings for claim
exports.getClaimableEarnings = async (req, res) => {
  try {
    const { address } = req.params;
    
    const earnings = await RoyaltyEarning.find({
      artistAddress: address,
      status: { $in: ['confirmed', 'pending'] }
    }).sort({ saleDate: -1 });
    
    const totalClaimable = earnings.reduce((sum, e) => sum + e.royaltyAmount, 0);
    
    res.status(200).json({
      success: true,
      totalClaimable,
      earningsCount: earnings.length,
      earnings
    });
  } catch (error) {
    console.error('Get claimable earnings error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a royalty claim
exports.createClaim = async (req, res) => {
  try {
    const { address } = req.params;
    const { periodStart, periodEnd, payoutMethod } = req.body;
    
    // Get earnings in period
    const earnings = await RoyaltyEarning.find({
      artistAddress: address,
      status: { $in: ['confirmed', 'pending'] },
      saleDate: { $gte: new Date(periodStart), $lte: new Date(periodEnd) }
    });
    
    if (earnings.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No earnings available for claim in this period'
      });
    }
    
    // Calculate summary
    const summary = {
      totalEarnings: earnings.reduce((sum, e) => sum + e.royaltyAmount, 0),
      totalTransactions: earnings.length,
      primarySales: earnings.filter(e => e.saleType === 'primary').length,
      secondarySales: earnings.filter(e => e.saleType === 'secondary').length,
      platformFees: 0, // Calculate if applicable
      netAmount: earnings.reduce((sum, e) => sum + e.royaltyAmount, 0)
    };
    
    // Create claim
    const claim = new RoyaltyClaim({
      artistAddress: address,
      artistName: earnings[0]?.artistName,
      periodStart: new Date(periodStart),
      periodEnd: new Date(periodEnd),
      earnings: earnings.map(e => ({
        earningId: e._id,
        nftId: e.nftId,
        nftName: e.nftName,
        salePrice: e.salePrice,
        royaltyAmount: e.royaltyAmount,
        saleDate: e.saleDate
      })),
      summary,
      payoutMethod,
      status: 'pending'
    });
    
    await claim.save();
    
    // Update earnings status
    await RoyaltyEarning.updateMany(
      { _id: { $in: earnings.map(e => e._id) } },
      { status: 'claimed', claimedAt: new Date() }
    );
    
    res.status(200).json({
      success: true,
      message: 'Royalty claim created',
      claim
    });
  } catch (error) {
    console.error('Create claim error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get claim history
exports.getClaimHistory = async (req, res) => {
  try {
    const { address } = req.params;
    
    const claims = await RoyaltyClaim.find({
      artistAddress: address
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      claims
    });
  } catch (error) {
    console.error('Get claim history error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== 5. SMART ROYALTY RULES ====================

// Apply smart rules to a sale
exports.applySmartRules = async (req, res) => {
  try {
    const { nftId } = req.params;
    const { salePrice, buyerAddress, sellerAddress } = req.body;
    
    const nft = await NFTCollection.findOne({ NftId: nftId });
    const tier = await RoyaltyTier.findOne({ nftId, isActive: true });
    
    let rules = [];
    let finalRoyalty = { percent: 10, amount: salePrice * 0.1 };
    
    // Check minimum royalty floor
    if (tier?.limits?.minimumRoyalty) {
      const minAmount = tier.limits.minimumRoyalty;
      if (finalRoyalty.amount < minAmount) {
        finalRoyalty.amount = minAmount;
        finalRoyalty.percent = (minAmount / salePrice) * 100;
        rules.push({ type: 'minimum_floor', applied: true, minimum: minAmount });
      }
    }
    
    // Check maximum cap
    if (tier?.limits?.maximumRoyalty) {
      const maxAmount = tier.limits.maximumRoyalty;
      if (finalRoyalty.amount > maxAmount) {
        finalRoyalty.amount = maxAmount;
        finalRoyalty.percent = (maxAmount / salePrice) * 100;
        rules.push({ type: 'maximum_cap', applied: true, maximum: maxAmount });
      }
    }
    
    // Check buyer type for discounts
    const buyer = await User.findOne({ walletAddress: buyerAddress });
    if (buyer) {
      if (tier?.loyaltyDiscounts?.enabled) {
        let discount = 0;
        if (buyer.userType === 'community') discount = tier.loyaltyDiscounts.communityMemberDiscount;
        else if (buyer.userType === 'elder') discount = tier.loyaltyDiscounts.elderDiscount;
        
        if (discount > 0) {
          finalRoyalty.amount = finalRoyalty.amount * (1 - discount / 100);
          rules.push({ type: 'loyalty_discount', applied: true, discount, buyerType: buyer.userType });
        }
      }
    }
    
    res.status(200).json({
      success: true,
      originalPrice: salePrice,
      rulesApplied: rules,
      finalRoyalty
    });
  } catch (error) {
    console.error('Apply smart rules error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== 6. ROYALTY NOTIFICATIONS ====================

// Get notifications for an artist
exports.getNotifications = async (req, res) => {
  try {
    const { address } = req.params;
    const { unreadOnly = false, limit = 20 } = req.query;
    
    const query = { artistAddress: address };
    if (unreadOnly === 'true') query.read = false;
    
    const notifications = await RoyaltyNotification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    const unreadCount = await RoyaltyNotification.countDocuments({
      artistAddress: address,
      read: false
    });
    
    res.status(200).json({
      success: true,
      unreadCount,
      notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark notification as read
exports.markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    await RoyaltyNotification.findByIdAndUpdate(notificationId, {
      read: true,
      readAt: new Date()
    });
    
    res.status(200).json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create notification (internal use)
exports.createNotification = async (artistAddress, type, data) => {
  try {
    const templates = {
      royalty_earned: {
        title: '💰 Royalty Earned!',
        message: `You earned ${data.amount} XRP from a ${data.saleType} sale of "${data.nftName}"`
      },
      threshold_reached: {
        title: '🎯 Payout Threshold Reached',
        message: `Your unclaimed royalties have reached ${data.amount} XRP. Ready to claim!`
      },
      weekly_summary: {
        title: '📊 Weekly Royalty Summary',
        message: `This week: ${data.earnings} XRP from ${data.sales} sales`
      },
      secondary_sale: {
        title: '🎉 Secondary Sale!',
        message: `"${data.nftName}" was resold! You earned ${data.amount} XRP in royalties`
      }
    };
    
    const template = templates[type] || { title: 'Royalty Update', message: 'You have a new royalty update' };
    
    const notification = new RoyaltyNotification({
      artistAddress,
      type,
      title: template.title,
      message: template.message,
      relatedData: data,
      channels: { inApp: true, email: data.amount > 100, sms: data.amount > 500 }
    });
    
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Create notification error:', error);
  }
};

// ==================== 7. CROSS-PLATFORM TRACKING ====================

// Record royalty from external platform
exports.recordExternalRoyalty = async (req, res) => {
  try {
    const {
      nftId,
      artistAddress,
      salePrice,
      royaltyAmount,
      royaltyPercent,
      platform,
      transactionHash,
      saleDate
    } = req.body;
    
    const earning = new RoyaltyEarning({
      nftId,
      artistAddress,
      salePrice,
      royaltyAmount,
      royaltyPercent,
      platform,
      transactionHash,
      saleDate: new Date(saleDate),
      saleType: 'secondary',
      status: 'confirmed'
    });
    
    await earning.save();
    
    res.status(200).json({
      success: true,
      message: 'External royalty recorded',
      earning
    });
  } catch (error) {
    console.error('Record external royalty error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get aggregated royalties across platforms
exports.getAggregatedRoyalties = async (req, res) => {
  try {
    const { address } = req.params;
    
    const aggregation = await RoyaltyEarning.aggregate([
      { $match: { artistAddress: address } },
      {
        $group: {
          _id: '$platform',
          totalEarnings: { $sum: '$royaltyAmount' },
          totalSales: { $sum: 1 },
          avgRoyalty: { $avg: '$royaltyAmount' }
        }
      },
      { $sort: { totalEarnings: -1 } }
    ]);
    
    res.status(200).json({
      success: true,
      platforms: aggregation
    });
  } catch (error) {
    console.error('Get aggregated royalties error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== UTILITY FUNCTIONS ====================

// Record a new royalty earning (called from other controllers)
exports.recordRoyaltyEarning = async (earningData) => {
  try {
    const earning = new RoyaltyEarning(earningData);
    await earning.save();
    
    // Create notification
    await exports.createNotification(earningData.artistAddress, 'royalty_earned', {
      earningId: earning._id,
      nftId: earningData.nftId,
      nftName: earningData.nftName,
      amount: earningData.royaltyAmount,
      saleType: earningData.saleType
    });
    
    // Check threshold for auto-claim notification
    const unclaimedTotal = await RoyaltyEarning.aggregate([
      {
        $match: {
          artistAddress: earningData.artistAddress,
          status: { $in: ['pending', 'confirmed'] }
        }
      },
      { $group: { _id: null, total: { $sum: '$royaltyAmount' } } }
    ]);
    
    if (unclaimedTotal[0]?.total >= 100) {
      await exports.createNotification(earningData.artistAddress, 'threshold_reached', {
        amount: unclaimedTotal[0].total
      });
    }
    
    return earning;
  } catch (error) {
    console.error('Record royalty earning error:', error);
    throw error;
  }
};
