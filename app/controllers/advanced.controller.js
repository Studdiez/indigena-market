/**
 * Advanced Features Controller
 * Gamification, Referrals, Bulk Operations, Auctions, Subscription Boxes
 */

const gamificationService = require('../services/advanced/gamification.service.js');
const referralService = require('../services/advanced/referral.service.js');
const bulkOperationsService = require('../services/advanced/bulkOperations.service.js');
const auctionService = require('../services/advanced/auction.service.js');
const subscriptionBoxService = require('../services/advanced/subscriptionBox.service.js');

// ==================== GAMIFICATION ====================

exports.awardBadge = async (req, res) => {
  try {
    const { user, badgeId } = req.body;
    const result = await gamificationService.awardBadge(user, badgeId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.trackAchievement = async (req, res) => {
  try {
    const { user, achievementId, progress } = req.body;
    const result = await gamificationService.trackProgress(user, achievementId, progress);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getGamificationProfile = async (req, res) => {
  try {
    const { user } = req.params;
    const result = await gamificationService.getUserProfile(user);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const { category, period, limit } = req.query;
    const result = await gamificationService.getLeaderboard(category, period, parseInt(limit));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAvailableBadges = async (req, res) => {
  try {
    const result = await gamificationService.getAvailableBadges();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAvailableAchievements = async (req, res) => {
  try {
    const { category } = req.query;
    const result = await gamificationService.getAvailableAchievements(category);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addPoints = async (req, res) => {
  try {
    const { user, amount, reason } = req.body;
    const result = await gamificationService.addPoints(user, amount, reason);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== REFERRAL PROGRAM ====================

exports.generateReferralCode = async (req, res) => {
  try {
    const { user } = req.body;
    const result = await referralService.generateReferralCode(user);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.trackReferral = async (req, res) => {
  try {
    const { referredUser, referralCode } = req.body;
    const result = await referralService.trackReferral(referredUser, referralCode);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.convertReferral = async (req, res) => {
  try {
    const { referredUser, purchaseAmount } = req.body;
    const result = await referralService.convertReferral(referredUser, purchaseAmount);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReferralStats = async (req, res) => {
  try {
    const { user } = req.params;
    const result = await referralService.getReferralStats(user);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReferralRewards = async (req, res) => {
  try {
    const { user } = req.params;
    const result = await referralService.getRewardsHistory(user);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTopReferrers = async (req, res) => {
  try {
    const { limit } = req.query;
    const result = await referralService.getTopReferrers(parseInt(limit));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createReferralCampaign = async (req, res) => {
  try {
    const campaignData = req.body;
    const result = await referralService.createCampaign(campaignData);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== BULK OPERATIONS ====================

exports.createBulkMint = async (req, res) => {
  try {
    const { user, items, collectionId, royaltySettings } = req.body;
    const result = await bulkOperationsService.createBulkMint(user, { items, collectionId, royaltySettings });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.executeBulkMint = async (req, res) => {
  try {
    const { operationId } = req.params;
    const result = await bulkOperationsService.executeBulkMint(operationId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBulkTransfer = async (req, res) => {
  try {
    const { user, transfers } = req.body;
    const result = await bulkOperationsService.createBulkTransfer(user, { transfers });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.executeBulkTransfer = async (req, res) => {
  try {
    const { operationId } = req.params;
    const result = await bulkOperationsService.executeBulkTransfer(operationId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBulkListing = async (req, res) => {
  try {
    const { user, items } = req.body;
    const result = await bulkOperationsService.createBulkListing(user, { items });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBulkPriceUpdate = async (req, res) => {
  try {
    const { user, items, newPrice } = req.body;
    const result = await bulkOperationsService.createBulkPriceUpdate(user, { items, newPrice });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOperationStatus = async (req, res) => {
  try {
    const { operationId } = req.params;
    const result = await bulkOperationsService.getOperationStatus(operationId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOperationDetails = async (req, res) => {
  try {
    const { operationId } = req.params;
    const result = await bulkOperationsService.getOperationDetails(operationId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelOperation = async (req, res) => {
  try {
    const { operationId } = req.params;
    const { user } = req.body;
    const result = await bulkOperationsService.cancelOperation(user, operationId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserOperations = async (req, res) => {
  try {
    const { user } = req.params;
    const { status, type, limit } = req.query;
    const result = await bulkOperationsService.getUserOperations(user, { status, type, limit: parseInt(limit) });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== AUCTIONS ====================

exports.createAuction = async (req, res) => {
  try {
    const { seller, nftId, type, startPrice, reservePrice, buyNowPrice, duration, minBidIncrement, description } = req.body;
    const result = await auctionService.createAuction(seller, { nftId, type, startPrice, reservePrice, buyNowPrice, duration, minBidIncrement, description });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.startAuction = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const { seller } = req.body;
    const result = await auctionService.startAuction(seller, auctionId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.placeBid = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const { bidder, amount, sealed } = req.body;
    const result = await auctionService.placeBid(bidder, auctionId, { amount, sealed });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.buyNow = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const { buyer } = req.body;
    const result = await auctionService.buyNow(buyer, auctionId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.endAuction = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const result = await auctionService.endAuction(auctionId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAuction = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const result = await auctionService.getAuction(auctionId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getActiveAuctions = async (req, res) => {
  try {
    const { type, seller, limit } = req.query;
    const result = await auctionService.getActiveAuctions({ type, seller, limit: parseInt(limit) });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addToWatchlist = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const { user } = req.body;
    const result = await auctionService.addToWatchlist(user, auctionId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeFromWatchlist = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const { user } = req.body;
    const result = await auctionService.removeFromWatchlist(user, auctionId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getWatchlist = async (req, res) => {
  try {
    const { user } = req.params;
    const result = await auctionService.getWatchlist(user);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserBids = async (req, res) => {
  try {
    const { user } = req.params;
    const result = await auctionService.getUserBids(user);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelAuction = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const { seller } = req.body;
    const result = await auctionService.cancelAuction(seller, auctionId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== SUBSCRIPTION BOXES ====================

exports.getAvailableBoxes = async (req, res) => {
  try {
    const result = await subscriptionBoxService.getAvailableBoxes();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBoxSubscription = async (req, res) => {
  try {
    const { user, boxId, shippingAddress, paymentMethod } = req.body;
    const result = await subscriptionBoxService.createSubscription(user, { boxId, shippingAddress, paymentMethod });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.curateBox = async (req, res) => {
  try {
    const { boxId, curator, month, year, items, theme, story } = req.body;
    const result = await subscriptionBoxService.curateBox(boxId, curator, { month, year, items, theme, story });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveCuration = async (req, res) => {
  try {
    const { curationId } = req.params;
    const { approver } = req.body;
    const result = await subscriptionBoxService.approveCuration(curationId, approver);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.processShipment = async (req, res) => {
  try {
    const { boxId, month, year } = req.body;
    const result = await subscriptionBoxService.processShipment(boxId, month, year);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserSubscriptions = async (req, res) => {
  try {
    const { user } = req.params;
    const result = await subscriptionBoxService.getUserSubscriptions(user);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getShipmentHistory = async (req, res) => {
  try {
    const { user } = req.params;
    const result = await subscriptionBoxService.getShipmentHistory(user);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.skipDelivery = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { user } = req.body;
    const result = await subscriptionBoxService.skipDelivery(user, subscriptionId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.pauseSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { user } = req.body;
    const result = await subscriptionBoxService.pauseSubscription(user, subscriptionId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.resumeSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { user } = req.body;
    const result = await subscriptionBoxService.resumeSubscription(user, subscriptionId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelBoxSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { user } = req.body;
    const result = await subscriptionBoxService.cancelSubscription(user, subscriptionId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateShippingAddress = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { user, address } = req.body;
    const result = await subscriptionBoxService.updateShippingAddress(user, subscriptionId, address);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
