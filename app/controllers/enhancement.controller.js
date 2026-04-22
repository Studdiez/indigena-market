/**
 * Enhancement Controller
 * Notifications, Search, Messaging, Mobile, Admin
 */

const notificationService = require('../services/enhancements/notification.service.js');
const searchEngine = require('../services/enhancements/searchEngine.service.js');
const messagingService = require('../services/enhancements/messaging.service.js');
const mobileOptimization = require('../services/enhancements/mobileOptimization.service.js');
const adminDashboard = require('../services/enhancements/adminDashboard.service.js');

// ==================== NOTIFICATIONS ====================

exports.createNotification = async (req, res) => {
  try {
    const { user, type, title, message, data, priority } = req.body;
    const result = await notificationService.createNotification(user, { type, title, message, data, priority });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.registerPushToken = async (req, res) => {
  try {
    const { user, token, platform, deviceId } = req.body;
    const result = await notificationService.registerPushToken(user, { token, platform, deviceId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateNotificationPreferences = async (req, res) => {
  try {
    const { user, preferences } = req.body;
    const result = await notificationService.updatePreferences(user, preferences);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const { user } = req.params;
    const result = await notificationService.getNotifications(user, req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { user } = req.body;
    const result = await notificationService.markAsRead(user, notificationId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAllNotificationsRead = async (req, res) => {
  try {
    const { user } = req.body;
    const result = await notificationService.markAllAsRead(user);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { user } = req.body;
    const result = await notificationService.deleteNotification(user, notificationId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.subscribeToChannel = async (req, res) => {
  try {
    const { user, channel, filters } = req.body;
    const result = await notificationService.subscribe(user, { channel, filters });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.unsubscribe = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const result = await notificationService.unsubscribe(subscriptionId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendBulkNotifications = async (req, res) => {
  try {
    const { users, notification } = req.body;
    const result = await notificationService.sendBulk(users, notification);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== SEARCH ENGINE ====================

exports.search = async (req, res) => {
  try {
    const { query, pillars, filters, sortBy, limit, offset } = req.body;
    const result = await searchEngine.search(query, { pillars, filters, sortBy, limit, offset });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.indexItem = async (req, res) => {
  try {
    const { id, pillar, title, description, tags, metadata, creator, cultural } = req.body;
    const result = await searchEngine.indexItem({ id, pillar, title, description, tags, metadata, creator, cultural });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const { user } = req.params;
    const { pillar, itemId, limit } = req.query;
    const result = await searchEngine.getRecommendations(user, { pillar, itemId, limit: parseInt(limit) });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTrending = async (req, res) => {
  try {
    const { pillar, period } = req.query;
    const result = await searchEngine.getTrending(pillar, period);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSearchSuggestions = async (req, res) => {
  try {
    const { q, limit } = req.query;
    const result = await searchEngine.getSuggestions(q, parseInt(limit));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== MESSAGING ====================

exports.getOrCreateConversation = async (req, res) => {
  try {
    const { participants } = req.body;
    const result = await messagingService.getOrCreateConversation(participants);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { sender, conversationId, content, type, metadata } = req.body;
    const result = await messagingService.sendMessage(sender, conversationId, { content, type, metadata });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { conversationId, user } = req.params;
    const { before, limit } = req.query;
    const result = await messagingService.getMessages(conversationId, user, { before, limit: parseInt(limit) });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const { user } = req.params;
    const { archived, limit } = req.query;
    const result = await messagingService.getConversations(user, { archived: archived === 'true', limit: parseInt(limit) });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { user, content } = req.body;
    const result = await messagingService.editMessage(user, messageId, content);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { user } = req.body;
    const result = await messagingService.deleteMessage(user, messageId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markConversationRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { user } = req.body;
    const result = await messagingService.markAsRead(user, conversationId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.archiveConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { user } = req.body;
    const result = await messagingService.archiveConversation(user, conversationId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.unarchiveConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { user } = req.body;
    const result = await messagingService.unarchiveConversation(user, conversationId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.setTyping = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { user, typing } = req.body;
    const result = await messagingService.setTyping(user, conversationId, typing);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTyping = async (req, res) => {
  try {
    const { conversationId, user } = req.params;
    const result = await messagingService.getTyping(conversationId, user);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const { user, blockedUser } = req.body;
    const result = await messagingService.blockUser(user, blockedUser);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.unblockUser = async (req, res) => {
  try {
    const { user, blockedUser } = req.body;
    const result = await messagingService.unblockUser(user, blockedUser);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBlockedUsers = async (req, res) => {
  try {
    const { user } = req.params;
    const result = await messagingService.getBlockedUsers(user);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== MOBILE OPTIMIZATION ====================

exports.getMobileFeed = async (req, res) => {
  try {
    const { user } = req.params;
    const { page, pageSize, contentType, quality } = req.query;
    const result = await mobileOptimization.getMobileFeed(user, { 
      page: parseInt(page), 
      pageSize: parseInt(pageSize), 
      contentType, 
      quality 
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.syncOfflineChanges = async (req, res) => {
  try {
    const { user, changes } = req.body;
    const result = await mobileOptimization.syncOfflineChanges(user, changes);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOfflinePackage = async (req, res) => {
  try {
    const { user } = req.params;
    const { contentTypes } = req.query;
    const result = await mobileOptimization.getOfflinePackage(user, { contentTypes: contentTypes?.split(',') });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.registerMobilePushToken = async (req, res) => {
  try {
    const { user, token, platform, deviceId } = req.body;
    const result = await mobileOptimization.registerPushToken(user, { token, platform, deviceId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAppConfig = async (req, res) => {
  try {
    const { platform, version } = req.query;
    const result = await mobileOptimization.getAppConfig(platform, version);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ADMIN DASHBOARD ====================

exports.getPlatformOverview = async (req, res) => {
  try {
    const result = await adminDashboard.getPlatformOverview();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAdminUsers = async (req, res) => {
  try {
    const { status, role, search, sortBy, sortOrder, limit, offset } = req.query;
    const result = await adminDashboard.getUsers({ status, role, search, sortBy, sortOrder, limit: parseInt(limit), offset: parseInt(offset) });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAdminUserDetails = async (req, res) => {
  try {
    const { address } = req.params;
    const result = await adminDashboard.getUserDetails(address);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { address } = req.params;
    const { admin, status, reason } = req.body;
    const result = await adminDashboard.updateUserStatus(admin, address, status, reason);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getModerationQueue = async (req, res) => {
  try {
    const { type, limit, offset } = req.query;
    const result = await adminDashboard.getModerationQueue({ type, limit: parseInt(limit), offset: parseInt(offset) });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.moderateContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const { admin, action, reason } = req.body;
    const result = await adminDashboard.moderateContent(admin, contentId, action, reason);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const { period } = req.query;
    const result = await adminDashboard.getAnalytics(period);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSystemHealth = async (req, res) => {
  try {
    const result = await adminDashboard.getSystemHealth();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getConfiguration = async (req, res) => {
  try {
    const result = await adminDashboard.getConfiguration();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateConfiguration = async (req, res) => {
  try {
    const { admin, updates } = req.body;
    const result = await adminDashboard.updateConfiguration(admin, updates);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAuditLog = async (req, res) => {
  try {
    const { admin, action, limit, offset } = req.query;
    const result = await adminDashboard.getAuditLog({ admin, action, limit: parseInt(limit), offset: parseInt(offset) });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
