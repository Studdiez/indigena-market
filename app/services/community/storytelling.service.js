/**
 * Storytelling Platform Service
 * Oral history preservation and sharing
 */

class StorytellingService {
  constructor() {
    this.stories = new Map();
    this.collections = new Map();
    this.recordings = new Map();
    this.contributors = new Map();
  }

  async createStory(creatorAddress, storyData) {
    const story = {
      storyId: this.generateId('STY'),
      creator: creatorAddress,
      title: storyData.title,
      summary: storyData.summary,
      content: storyData.content,
      type: storyData.type, // 'oral_history', 'legend', 'personal', 'cultural'
      nation: storyData.nation,
      language: storyData.language || 'English',
      tags: storyData.tags || [],
      recordings: [],
      translations: [],
      contributors: [creatorAddress],
      permissions: storyData.permissions || {
        canView: 'public', // 'public', 'community', 'private'
        canContribute: 'community', // 'community', 'invited', 'none'
        canTranslate: 'community'
      },
      metadata: {
        elderApproved: storyData.elderApproved || false,
        elderApprover: storyData.elderApprover || null,
        seasonalRestriction: storyData.seasonalRestriction || null,
        sacredStatus: storyData.sacredStatus || 'public' // 'sacred', 'ceremonial', 'public'
      },
      stats: {
        views: 0,
        likes: 0,
        shares: 0,
        contributions: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: storyData.status || 'draft' // 'draft', 'published', 'archived'
    };

    this.stories.set(story.storyId, story);

    return { success: true, storyId: story.storyId, story };
  }

  async addRecording(storyId, contributorAddress, recordingData) {
    const story = this.stories.get(storyId);
    if (!story) throw new Error('Story not found');

    // Check permissions
    if (!this.canContribute(story, contributorAddress)) {
      throw new Error('Not authorized to contribute to this story');
    }

    const recording = {
      recordingId: this.generateId('REC'),
      storyId,
      contributor: contributorAddress,
      type: recordingData.type, // 'audio', 'video', 'text'
      language: recordingData.language,
      duration: recordingData.duration,
      contentUrl: recordingData.contentUrl,
      transcript: recordingData.transcript || null,
      translationOf: recordingData.translationOf || null, // Original recording ID if translation
      metadata: {
        recordedAt: recordingData.recordedAt || new Date().toISOString(),
        location: recordingData.location || null,
        elderNarrator: recordingData.elderNarrator || null
      },
      createdAt: new Date().toISOString()
    };

    this.recordings.set(recording.recordingId, recording);
    story.recordings.push(recording.recordingId);
    story.stats.contributions++;
    story.updatedAt = new Date().toISOString();

    return { success: true, recordingId: recording.recordingId, recording };
  }

  async addTranslation(storyId, translatorAddress, translationData) {
    const story = this.stories.get(storyId);
    if (!story) throw new Error('Story not found');

    if (!this.canTranslate(story, translatorAddress)) {
      throw new Error('Not authorized to translate this story');
    }

    const translation = {
      translationId: this.generateId('TRL'),
      storyId,
      translator: translatorAddress,
      language: translationData.language,
      title: translationData.title,
      content: translationData.content,
      originalRecordingId: translationData.originalRecordingId,
      verifiedBy: null,
      status: 'pending', // 'pending', 'verified', 'rejected'
      createdAt: new Date().toISOString()
    };

    story.translations.push(translation);

    return { success: true, translationId: translation.translationId, translation };
  }

  async verifyTranslation(storyId, translationId, verifierAddress) {
    const story = this.stories.get(storyId);
    if (!story) throw new Error('Story not found');

    const translation = story.translations.find(t => t.translationId === translationId);
    if (!translation) throw new Error('Translation not found');

    // Only elders or story creator can verify
    if (!this.isElderOrCreator(story, verifierAddress)) {
      throw new Error('Not authorized to verify translations');
    }

    translation.status = 'verified';
    translation.verifiedBy = verifierAddress;
    translation.verifiedAt = new Date().toISOString();

    return { success: true, translationId, status: 'verified' };
  }

  async getStory(storyId, viewerAddress) {
    const story = this.stories.get(storyId);
    if (!story) throw new Error('Story not found');

    // Check viewing permissions
    if (!this.canView(story, viewerAddress)) {
      throw new Error('Not authorized to view this story');
    }

    // Check seasonal restrictions
    if (story.metadata.seasonalRestriction) {
      const canViewSeasonal = await this.checkSeasonalAccess(story, viewerAddress);
      if (!canViewSeasonal) {
        return {
          storyId,
          title: story.title,
          restricted: true,
          message: 'This story is only available during specific seasons'
        };
      }
    }

    story.stats.views++;

    // Get full recordings
    const recordings = story.recordings
      .map(id => this.recordings.get(id))
      .filter(r => r);

    return {
      ...story,
      recordings,
      canContribute: this.canContribute(story, viewerAddress),
      canTranslate: this.canTranslate(story, viewerAddress)
    };
  }

  async getStories(filters = {}) {
    let stories = Array.from(this.stories.values())
      .filter(s => s.status === 'published');

    if (filters.nation) {
      stories = stories.filter(s => s.nation === filters.nation);
    }
    if (filters.type) {
      stories = stories.filter(s => s.type === filters.type);
    }
    if (filters.language) {
      stories = stories.filter(s => s.language === filters.language);
    }
    if (filters.tags) {
      const tags = Array.isArray(filters.tags) ? filters.tags : [filters.tags];
      stories = stories.filter(s => tags.some(tag => s.tags.includes(tag)));
    }

    // Sort by popularity or date
    if (filters.sort === 'popular') {
      stories.sort((a, b) => b.stats.views - a.stats.views);
    } else {
      stories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return stories.map(s => ({
      storyId: s.storyId,
      title: s.title,
      summary: s.summary,
      type: s.type,
      nation: s.nation,
      language: s.language,
      tags: s.tags,
      stats: s.stats,
      createdAt: s.createdAt,
      elderApproved: s.metadata.elderApproved
    }));
  }

  async createCollection(creatorAddress, collectionData) {
    const collection = {
      collectionId: this.generateId('COL'),
      creator: creatorAddress,
      title: collectionData.title,
      description: collectionData.description,
      theme: collectionData.theme,
      stories: [],
      contributors: [creatorAddress],
      visibility: collectionData.visibility || 'public',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.collections.set(collection.collectionId, collection);

    return { success: true, collectionId: collection.collectionId, collection };
  }

  async addToCollection(collectionId, storyId, contributorAddress) {
    const collection = this.collections.get(collectionId);
    if (!collection) throw new Error('Collection not found');

    const story = this.stories.get(storyId);
    if (!story) throw new Error('Story not found');

    if (!collection.stories.includes(storyId)) {
      collection.stories.push(storyId);
      collection.updatedAt = new Date().toISOString();
    }

    return { success: true, collectionId, storyCount: collection.stories.length };
  }

  async getCollection(collectionId) {
    const collection = this.collections.get(collectionId);
    if (!collection) throw new Error('Collection not found');

    const stories = collection.stories
      .map(id => this.stories.get(id))
      .filter(s => s && s.status === 'published')
      .map(s => ({
        storyId: s.storyId,
        title: s.title,
        summary: s.summary,
        type: s.type,
        nation: s.nation
      }));

    return {
      ...collection,
      stories
    };
  }

  async searchStories(query, options = {}) {
    const { nation, language, type } = options;

    let stories = Array.from(this.stories.values())
      .filter(s => s.status === 'published');

    if (nation) stories = stories.filter(s => s.nation === nation);
    if (language) stories = stories.filter(s => s.language === language);
    if (type) stories = stories.filter(s => s.type === type);

    const results = stories.filter(s => 
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.summary.toLowerCase().includes(query.toLowerCase()) ||
      s.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
    );

    return {
      query,
      total: results.length,
      stories: results.map(s => ({
        storyId: s.storyId,
        title: s.title,
        summary: s.summary,
        nation: s.nation,
        type: s.type,
        stats: s.stats
      }))
    };
  }

  // Permission helpers
  canView(story, userAddress) {
    if (story.permissions.canView === 'public') return true;
    if (story.permissions.canView === 'community') {
      // Check if user is community member
      return true; // Simplified
    }
    return story.contributors.includes(userAddress);
  }

  canContribute(story, userAddress) {
    if (story.permissions.canContribute === 'none') return false;
    if (story.permissions.canContribute === 'invited') {
      return story.contributors.includes(userAddress);
    }
    return true; // community
  }

  canTranslate(story, userAddress) {
    if (story.permissions.canTranslate === 'none') return false;
    return true; // community
  }

  isElderOrCreator(story, userAddress) {
    return story.creator === userAddress || story.metadata.elderApprover === userAddress;
  }

  async checkSeasonalAccess(story, userAddress) {
    // In production: Check current season against story restrictions
    return true; // Simplified
  }

  generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new StorytellingService();
