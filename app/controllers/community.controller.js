/**
 * Community Controller
 * Provides endpoints for:
 * - Artist Mentorship
 * - Community Forums
 * - Event Management
 * - Collaborative Workspaces
 * - Storytelling Platform
 */

const mentorshipService = require('../services/community/mentorship.service.js');
const forumService = require('../services/community/forum.service.js');
const eventService = require('../services/community/event.service.js');
const collaborationService = require('../services/community/collaboration.service.js');
const storytellingService = require('../services/community/storytelling.service.js');

// ==================== MENTORSHIP ====================

exports.registerMentor = async (req, res) => {
  try {
    const mentorData = req.body;
    const result = await mentorshipService.registerMentor(mentorData.address, mentorData);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.applyForMentorship = async (req, res) => {
  try {
    const { address } = req.params;
    const result = await mentorshipService.applyForMentorship(address, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createMatch = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { mentorAddress } = req.body;
    const result = await mentorshipService.createMatch(applicationId, mentorAddress, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.scheduleSession = async (req, res) => {
  try {
    const { matchId } = req.params;
    const result = await mentorshipService.scheduleSession(matchId, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.completeSession = async (req, res) => {
  try {
    const { matchId, sessionId } = req.params;
    const result = await mentorshipService.completeSession(matchId, sessionId, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMentorshipDashboard = async (req, res) => {
  try {
    const { address } = req.params;
    const result = await mentorshipService.getMentorshipDashboard(address);
    res.status(200).json({ success: true, dashboard: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAvailableMentors = async (req, res) => {
  try {
    const result = await mentorshipService.getAvailableMentors(req.query);
    res.status(200).json({ success: true, mentors: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.endMentorship = async (req, res) => {
  try {
    const { matchId } = req.params;
    const result = await mentorshipService.endMentorship(matchId, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMentorshipStats = async (req, res) => {
  try {
    const result = await mentorshipService.getMentorshipStats();
    res.status(200).json({ success: true, stats: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== FORUMS ====================

exports.getAllForums = async (req, res) => {
  try {
    const result = await forumService.getAllForums();
    res.status(200).json({ success: true, forums: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getForum = async (req, res) => {
  try {
    const { forumId } = req.params;
    const result = await forumService.getForum(forumId, req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTopic = async (req, res) => {
  try {
    const { forumId } = req.params;
    const { address } = req.body;
    const result = await forumService.createTopic(forumId, address, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const result = await forumService.getTopic(topicId, req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createReply = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { address } = req.body;
    const result = await forumService.createReply(topicId, address, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.searchForums = async (req, res) => {
  try {
    const { query } = req.query;
    const result = await forumService.searchForums(query, req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== EVENTS ====================

exports.createEvent = async (req, res) => {
  try {
    const { address } = req.body;
    const result = await eventService.createEvent(address, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.publishEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const result = await eventService.publishEvent(eventId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const result = await eventService.getEvent(eventId);
    res.status(200).json({ success: true, event: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const result = await eventService.getEvents(req.query);
    res.status(200).json({ success: true, events: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { address } = req.body;
    const result = await eventService.registerForEvent(eventId, address, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.checkIn = async (req, res) => {
  try {
    const { eventId, registrationId } = req.params;
    const result = await eventService.checkIn(eventId, registrationId, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserRegistrations = async (req, res) => {
  try {
    const { address } = req.params;
    const result = await eventService.getUserRegistrations(address);
    res.status(200).json({ success: true, registrations: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== COLLABORATION ====================

exports.createWorkspace = async (req, res) => {
  try {
    const { address } = req.body;
    const result = await collaborationService.createWorkspace(address, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.inviteMember = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { address } = req.body;
    const result = await collaborationService.inviteMember(workspaceId, address, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.acceptInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const { address } = req.body;
    const result = await collaborationService.acceptInvitation(invitationId, address);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addAsset = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { address } = req.body;
    const result = await collaborationService.addAsset(workspaceId, address, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { address } = req.body;
    const result = await collaborationService.createTask(workspaceId, address, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { address } = req.query;
    const result = await collaborationService.getWorkspace(workspaceId, address);
    res.status(200).json({ success: true, workspace: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserWorkspaces = async (req, res) => {
  try {
    const { address } = req.params;
    const result = await collaborationService.getUserWorkspaces(address);
    res.status(200).json({ success: true, workspaces: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== STORYTELLING ====================

exports.createStory = async (req, res) => {
  try {
    const { address } = req.body;
    const result = await storytellingService.createStory(address, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addRecording = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { address } = req.body;
    const result = await storytellingService.addRecording(storyId, address, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addTranslation = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { address } = req.body;
    const result = await storytellingService.addTranslation(storyId, address, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyTranslation = async (req, res) => {
  try {
    const { storyId, translationId } = req.params;
    const { address } = req.body;
    const result = await storytellingService.verifyTranslation(storyId, translationId, address);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const { address } = req.query;
    const result = await storytellingService.getStory(storyId, address);
    res.status(200).json({ success: true, story: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStories = async (req, res) => {
  try {
    const result = await storytellingService.getStories(req.query);
    res.status(200).json({ success: true, stories: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCollection = async (req, res) => {
  try {
    const { address } = req.body;
    const result = await storytellingService.createCollection(address, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addToCollection = async (req, res) => {
  try {
    const { collectionId, storyId } = req.params;
    const { address } = req.body;
    const result = await storytellingService.addToCollection(collectionId, storyId, address);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const result = await storytellingService.getCollection(collectionId);
    res.status(200).json({ success: true, collection: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.searchStories = async (req, res) => {
  try {
    const { query } = req.query;
    const result = await storytellingService.searchStories(query, req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
