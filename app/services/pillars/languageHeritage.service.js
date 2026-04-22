/**
 * PILLAR 7: LANGUAGE & HERITAGE
 * Preservation as asset marketplace
 */

class LanguageHeritageService {
  constructor() {
    this.archives = new Map();
    this.subscriptions = new Map();
    this.tools = new Map();
    this.translations = new Map();
  }

  async createArchive(creator, archiveData) {
    const archive = {
      archiveId: this.generateId('ARC'),
      pillar: 'language_heritage',
      creator: creator,
      language: {
        name: archiveData.languageName,
        nation: archiveData.nation,
        family: archiveData.languageFamily,
        status: archiveData.languageStatus || 'living', // 'living', 'endangered', 'dormant', 'reviving'
        speakers: archiveData.estimatedSpeakers || null
      },
      title: archiveData.title,
      description: archiveData.description,
      content: {
        audio: archiveData.audioFiles || [],
        video: archiveData.videoFiles || [],
        documents: archiveData.documents || [],
        images: archiveData.images || [],
        interactive: archiveData.interactiveContent || []
      },
      categories: archiveData.categories || [
        'vocabulary', 'grammar', 'stories', 'songs', 'ceremonies', 'history'
      ],
      access: {
        type: archiveData.accessType || 'subscription', // 'free', 'subscription', 'purchase'
        price: archiveData.price || null,
        currency: archiveData.currency || 'INDI',
        trialAvailable: archiveData.trialAvailable !== false
      },
      contributors: archiveData.contributors || [],
      elders: archiveData.elders || [],
      protocols: archiveData.protocols || [],
      stats: {
        subscribers: 0,
        totalContent: 0,
        monthlyViews: 0
      },
      status: 'active',
      createdAt: new Date().toISOString()
    };

    // Count total content
    archive.stats.totalContent = 
      archive.content.audio.length +
      archive.content.video.length +
      archive.content.documents.length +
      archive.content.interactive.length;

    this.archives.set(archive.archiveId, archive);

    return {
      success: true,
      archiveId: archive.archiveId,
      language: archive.language.name,
      totalContent: archive.stats.totalContent
    };
  }

  async subscribeToArchive(user, archiveId, subscriptionData) {
    const archive = this.archives.get(archiveId);
    if (!archive) throw new Error('Archive not found');

    const subscription = {
      subscriptionId: this.generateId('SUB'),
      archiveId: archiveId,
      user: user,
      type: subscriptionData.type || 'monthly', // 'monthly', 'yearly', 'lifetime'
      price: archive.access.price,
      currency: archive.access.currency,
      startDate: new Date().toISOString(),
      endDate: this.calculateEndDate(subscriptionData.type),
      status: 'active',
      autoRenew: subscriptionData.autoRenew !== false
    };

    this.subscriptions.set(subscription.subscriptionId, subscription);
    archive.stats.subscribers++;

    return {
      success: true,
      subscriptionId: subscription.subscriptionId,
      archive: archive.title,
      accessUntil: subscription.endDate
    };
  }

  async createLanguageTool(creator, toolData) {
    const tool = {
      toolId: this.generateId('TOOL'),
      pillar: 'language_heritage',
      creator: creator,
      type: toolData.type, // 'dictionary', 'translator', 'learning_app', 'keyboard', 'font'
      name: toolData.name,
      description: toolData.description,
      language: {
        name: toolData.languageName,
        nation: toolData.nation
      },
      features: toolData.features || [],
      platforms: toolData.platforms || ['web'], // 'web', 'ios', 'android', 'desktop'
      pricing: {
        type: toolData.pricingType || 'free', // 'free', 'freemium', 'paid', 'subscription'
        price: toolData.price || 0,
        currency: toolData.currency || 'INDI'
      },
      stats: {
        downloads: 0,
        activeUsers: 0,
        rating: 0
      },
      status: 'active',
      createdAt: new Date().toISOString()
    };

    this.tools.set(tool.toolId, tool);

    return {
      success: true,
      toolId: tool.toolId,
      name: tool.name,
      pricing: tool.pricing
    };
  }

  async requestTranslation(requester, translationData) {
    const translation = {
      requestId: this.generateId('TRN'),
      pillar: 'language_heritage',
      requester: requester,
      sourceLanguage: translationData.sourceLanguage,
      targetLanguage: translationData.targetLanguage,
      content: {
        text: translationData.text,
        context: translationData.context,
        type: translationData.contentType // 'document', 'audio', 'video', 'live'
      },
      requirements: {
        certified: translationData.certified || false,
        urgency: translationData.urgency || 'standard', // 'standard', 'urgent'
        domain: translationData.domain || 'general' // 'general', 'legal', 'medical', 'ceremonial'
      },
      pricing: {
        estimated: translationData.estimatedPrice,
        currency: translationData.currency || 'INDI',
        final: null
      },
      status: 'pending', // 'pending', 'assigned', 'in_progress', 'completed'
      translator: null,
      createdAt: new Date().toISOString()
    };

    this.translations.set(translation.requestId, translation);

    return {
      success: true,
      requestId: translation.requestId,
      status: 'pending',
      estimatedPrice: translation.pricing.estimated
    };
  }

  async getArchives(filters = {}) {
    let archives = Array.from(this.archives.values())
      .filter(a => a.status === 'active');

    if (filters.nation) archives = archives.filter(a => a.language.nation === filters.nation);
    if (filters.language) archives = archives.filter(a => 
      a.language.name.toLowerCase().includes(filters.language.toLowerCase())
    );
    if (filters.status) archives = archives.filter(a => a.language.status === filters.status);

    return archives.map(a => ({
      archiveId: a.archiveId,
      title: a.title,
      language: a.language.name,
      nation: a.language.nation,
      status: a.language.status,
      thumbnail: a.content.images[0],
      totalContent: a.stats.totalContent,
      subscribers: a.stats.subscribers,
      price: a.access.price,
      accessType: a.access.type
    }));
  }

  async getTools(filters = {}) {
    let tools = Array.from(this.tools.values())
      .filter(t => t.status === 'active');

    if (filters.language) tools = tools.filter(t => t.language.name === filters.language);
    if (filters.type) tools = tools.filter(t => t.type === filters.type);
    if (filters.platform) tools = tools.filter(t => t.platforms.includes(filters.platform));

    return tools.map(t => ({
      toolId: t.toolId,
      name: t.name,
      type: t.type,
      language: t.language.name,
      platforms: t.platforms,
      pricing: t.pricing,
      rating: t.stats.rating
    }));
  }

  calculateEndDate(type) {
    const date = new Date();
    switch (type) {
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        break;
      case 'lifetime':
        date.setFullYear(date.getFullYear() + 100);
        break;
      default:
        date.setMonth(date.getMonth() + 1);
    }
    return date.toISOString();
  }

  generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new LanguageHeritageService();
