/**
 * Integration Controller
 * External service integrations
 */

const xrplDex = require('../services/integration/xrplDex.service.js');
const ipfsStorage = require('../services/integration/ipfsStorage.service.js');
const chainlinkOracle = require('../services/integration/chainlinkOracle.service.js');
const fiatPayment = require('../services/integration/fiatPayment.service.js');
const socialApi = require('../services/integration/socialApi.service.js');

// ==================== XRPL DEX ====================

exports.getIndiPrice = async (req, res) => {
  try {
    const result = await xrplDex.getIndiPrice();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrderBook = async (req, res) => {
  try {
    const { depth } = req.query;
    const result = await xrplDex.getOrderBook(parseInt(depth) || 50);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.placeLimitOrder = async (req, res) => {
  try {
    const { user, side, price, amount, expiration } = req.body;
    const result = await xrplDex.placeLimitOrder(user, { side, price, amount, expiration });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.executeSwap = async (req, res) => {
  try {
    const { user, fromToken, toToken, amount, slippageTolerance } = req.body;
    const result = await xrplDex.executeSwap(user, { fromToken, toToken, amount, slippageTolerance });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addLiquidity = async (req, res) => {
  try {
    const { user, xrpAmount, indiAmount } = req.body;
    const result = await xrplDex.addLiquidity(user, { xrpAmount, indiAmount });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeLiquidity = async (req, res) => {
  try {
    const { user, lpTokens } = req.body;
    const result = await xrplDex.removeLiquidity(user, lpTokens);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLiquidityPosition = async (req, res) => {
  try {
    const { user } = req.params;
    const result = await xrplDex.getLiquidityPosition(user);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTradeHistory = async (req, res) => {
  try {
    const { user } = req.params;
    const result = await xrplDex.getTradeHistory(user, req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { user } = req.body;
    const result = await xrplDex.cancelOrder(user, orderId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== IPFS STORAGE ====================

exports.uploadFile = async (req, res) => {
  try {
    const { user, content, filename, contentType, metadata } = req.body;
    const result = await ipfsStorage.uploadFile(user, { content, filename, contentType, metadata });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadNFTMetadata = async (req, res) => {
  try {
    const { user, name, description, imageUrl, attributes, properties, cultural, license } = req.body;
    const result = await ipfsStorage.uploadNFTMetadata(user, { 
      name, description, imageUrl, attributes, properties, cultural, license 
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadBatch = async (req, res) => {
  try {
    const { user, files } = req.body;
    const result = await ipfsStorage.uploadBatch(user, files);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFile = async (req, res) => {
  try {
    const { cid } = req.params;
    const result = await ipfsStorage.getFile(cid);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.pinCID = async (req, res) => {
  try {
    const { user, cid, metadata } = req.body;
    const result = await ipfsStorage.pinCID(user, cid, metadata);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.unpinFile = async (req, res) => {
  try {
    const { pinId } = req.params;
    const { user } = req.body;
    const result = await ipfsStorage.unpinFile(user, pinId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStorageUsage = async (req, res) => {
  try {
    const { user } = req.params;
    const result = await ipfsStorage.getStorageUsage(user);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyIntegrity = async (req, res) => {
  try {
    const { cid } = req.params;
    const result = await ipfsStorage.verifyIntegrity(cid);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStorageReport = async (req, res) => {
  try {
    const result = await ipfsStorage.generateReport();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== CHAINLINK ORACLE ====================

exports.getLatestPrice = async (req, res) => {
  try {
    const { pair } = req.params;
    const result = await chainlinkOracle.getLatestPrice(pair);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMultiplePrices = async (req, res) => {
  try {
    const { pairs } = req.body;
    const result = await chainlinkOracle.getMultiplePrices(pairs);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPriceHistory = async (req, res) => {
  try {
    const { pair } = req.params;
    const { hours, interval } = req.query;
    const result = await chainlinkOracle.getPriceHistory(pair, { hours: parseInt(hours), interval });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.requestExternalData = async (req, res) => {
  try {
    const { jobId, url, path, payment } = req.body;
    const result = await chainlinkOracle.requestExternalData({ jobId, url, path, payment });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const result = await chainlinkOracle.getRequestStatus(requestId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.registerAutomation = async (req, res) => {
  try {
    const { name, contractAddress, functionSelector, checkData, cron, gasLimit, linkAmount } = req.body;
    const result = await chainlinkOracle.registerAutomation({ 
      name, contractAddress, functionSelector, checkData, cron, gasLimit, linkAmount 
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAutomationStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const result = await chainlinkOracle.getAutomationStatus(jobId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyPrice = async (req, res) => {
  try {
    const { pair } = req.params;
    const { expectedPrice, tolerance } = req.body;
    const result = await chainlinkOracle.verifyPrice(pair, expectedPrice, tolerance);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== FIAT PAYMENT ====================

exports.createStripePayment = async (req, res) => {
  try {
    const { user, amount, currency, description, metadata } = req.body;
    const result = await fiatPayment.createStripePaymentIntent(user, { amount, currency, description, metadata });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.confirmStripePayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    const { paymentMethod } = req.body;
    const result = await fiatPayment.confirmStripePayment(paymentIntentId, paymentMethod);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createPayPalOrder = async (req, res) => {
  try {
    const { user, amount, currency, description } = req.body;
    const result = await fiatPayment.createPayPalOrder(user, { amount, currency, description });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.capturePayPalPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await fiatPayment.capturePayPalPayment(orderId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.processPayout = async (req, res) => {
  try {
    const { seller, amount, currency, method, destination } = req.body;
    const result = await fiatPayment.processPayout(seller, { amount, currency, method, destination });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createSubscription = async (req, res) => {
  try {
    const { user, plan, amount, currency, interval } = req.body;
    const result = await fiatPayment.createSubscription(user, { plan, amount, currency, interval });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const result = await fiatPayment.cancelSubscription(subscriptionId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.handleWebhook = async (req, res) => {
  try {
    const { provider } = req.params;
    const { payload, signature } = req.body;
    const result = await fiatPayment.handleWebhook(provider, payload, signature);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFiatTransactionHistory = async (req, res) => {
  try {
    const { user } = req.params;
    const result = await fiatPayment.getTransactionHistory(user, req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== SOCIAL API ====================

exports.connectSocialAccount = async (req, res) => {
  try {
    const { user, platform, accountName, accountId, accessToken, refreshToken, permissions } = req.body;
    const result = await socialApi.connectAccount(user, platform, { 
      accountName, accountId, accessToken, refreshToken, permissions 
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.disconnectSocialAccount = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const result = await socialApi.disconnectAccount(connectionId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.shareToSocial = async (req, res) => {
  try {
    const { user, connectionId, content, mediaUrls, link } = req.body;
    const result = await socialApi.shareToSocial(user, { connectionId, content, mediaUrls, link });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.schedulePost = async (req, res) => {
  try {
    const { user, connectionId, content, mediaUrls, link, scheduledTime } = req.body;
    const result = await socialApi.schedulePost(user, { connectionId, content, mediaUrls, link, scheduledTime });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getScheduledPosts = async (req, res) => {
  try {
    const { user } = req.params;
    const result = await socialApi.getScheduledPosts(user);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelScheduledPost = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const result = await socialApi.cancelScheduledPost(scheduleId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSocialAnalytics = async (req, res) => {
  try {
    const { user } = req.params;
    const { platform, period } = req.query;
    const result = await socialApi.getAnalytics(user, { platform, period });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.crossPost = async (req, res) => {
  try {
    const { user, content, mediaUrls, link, platforms } = req.body;
    const result = await socialApi.crossPost(user, { content, mediaUrls, link, platforms });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getConnectedAccounts = async (req, res) => {
  try {
    const { user } = req.params;
    const result = await socialApi.getConnectedAccounts(user);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
