/**
 * Community Forums Service
 * Discussion boards by nation and pillar
 */

class ForumService {
  constructor() {
    this.forums = new Map();
    this.topics = new Map();
    this.posts = new Map();
    this.userActivity = new Map();
    this.initializeForums();
  }

  initializeForums() {
    const forumCategories = [
      { id: 'general', name: 'General Discussion', description: 'General topics and introductions' },
      { id: 'navajo', name: 'Navajo Nation', description: 'Discussions for Navajo artists and community' },
      { id: 'cherokee', name: 'Cherokee Nation', description: 'Discussions for Cherokee artists and community' },
      { id: 'hopi', name: 'Hopi Tribe', description: 'Discussions for Hopi artists and community' },
      { id: 'weaving', name: 'Weaving & Textiles', description: 'Traditional and contemporary weaving' },
      { id: 'pottery', name: 'Pottery & Ceramics', description: 'Pottery techniques and traditions' },
      { id: 'jewelry', name: 'Jewelry & Metalwork', description: 'Silverwork, beadwork, and jewelry' },
      { id: 'digital', name: 'Digital Arts', description: 'Digital art, NFTs, and new media' },
      { id: 'language', name: 'Language Preservation', description: 'Indigenous language learning and teaching' },
      { id: 'marketplace', name: 'Marketplace', description: 'Buying, selling, and pricing discussions' },
      { id: 'events', name: 'Events & Gatherings', description: 'Upcoming events, powwows, and markets' },
      { id: 'mentorship', name: 'Mentorship', description: 'Mentorship opportunities and advice' }
    ];

    forumCategories.forEach(forum => {
      this.forums.set(forum.id, {
        ...forum,
        createdAt: new Date().toISOString(),
        topicCount: 0,
        postCount: 0,
        lastActivity: null
      });
    });
  }

  async createTopic(forumId, userAddress, topicData) {
    const forum = this.forums.get(forumId);
    if (!forum) throw new Error('Forum not found');

    const topic = {
      topicId: this.generateId('TOP'),
      forumId,
      author: userAddress,
      title: topicData.title,
      content: topicData.content,
      tags: topicData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      replyCount: 0,
      viewCount: 0,
      isPinned: topicData.isPinned || false,
      isLocked: false,
      lastReply: null
    };

    this.topics.set(topic.topicId, topic);
    forum.topicCount++;
    forum.lastActivity = topic.createdAt;

    return { success: true, topicId: topic.topicId, topic };
  }

  async createReply(topicId, userAddress, replyData) {
    const topic = this.topics.get(topicId);
    if (!topic) throw new Error('Topic not found');
    if (topic.isLocked) throw new Error('Topic is locked');

    const reply = {
      postId: this.generateId('PST'),
      topicId,
      author: userAddress,
      content: replyData.content,
      replyTo: replyData.replyTo || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      isSolution: false
    };

    this.posts.set(reply.postId, reply);
    topic.replyCount++;
    topic.lastReply = {
      author: userAddress,
      createdAt: reply.createdAt
    };

    const forum = this.forums.get(topic.forumId);
    if (forum) {
      forum.postCount++;
      forum.lastActivity = reply.createdAt;
    }

    return { success: true, postId: reply.postId, reply };
  }

  async getForum(forumId, options = {}) {
    const forum = this.forums.get(forumId);
    if (!forum) throw new Error('Forum not found');

    const { page = 1, limit = 20, sortBy = 'latest' } = options;

    let topics = Array.from(this.topics.values())
      .filter(t => t.forumId === forumId);

    // Sort topics
    if (sortBy === 'latest') {
      topics.sort((a, b) => new Date(b.lastReply?.createdAt || b.createdAt) - new Date(a.lastReply?.createdAt || a.createdAt));
    } else if (sortBy === 'popular') {
      topics.sort((a, b) => b.viewCount - a.viewCount);
    }

    const total = topics.length;
    const start = (page - 1) * limit;
    topics = topics.slice(start, start + limit);

    return {
      forum,
      topics,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    };
  }

  async getTopic(topicId, options = {}) {
    const topic = this.topics.get(topicId);
    if (!topic) throw new Error('Topic not found');

    topic.viewCount++;

    const { page = 1, limit = 20 } = options;

    let posts = Array.from(this.posts.values())
      .filter(p => p.topicId === topicId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const total = posts.length;
    const start = (page - 1) * limit;
    posts = posts.slice(start, start + limit);

    return {
      topic,
      posts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    };
  }

  async searchForums(query, options = {}) {
    const { forumId, author, tags } = options;

    let results = [];

    // Search topics
    let topics = Array.from(this.topics.values());
    if (forumId) topics = topics.filter(t => t.forumId === forumId);
    if (author) topics = topics.filter(t => t.author === author);
    if (tags) topics = topics.filter(t => tags.some(tag => t.tags.includes(tag)));

    topics.forEach(topic => {
      if (topic.title.toLowerCase().includes(query.toLowerCase()) ||
          topic.content.toLowerCase().includes(query.toLowerCase())) {
        results.push({ type: 'topic', ...topic });
      }
    });

    // Search posts
    let posts = Array.from(this.posts.values());
    if (author) posts = posts.filter(p => p.author === author);

    posts.forEach(post => {
      if (post.content.toLowerCase().includes(query.toLowerCase())) {
        results.push({ type: 'post', ...post });
      }
    });

    return {
      query,
      total: results.length,
      results: results.slice(0, 50)
    };
  }

  async getAllForums() {
    return Array.from(this.forums.values()).map(f => ({
      id: f.id,
      name: f.name,
      description: f.description,
      topicCount: f.topicCount,
      postCount: f.postCount,
      lastActivity: f.lastActivity
    }));
  }

  generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new ForumService();
