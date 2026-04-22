/**
 * Search & Discovery Engine
 * AI-powered search across all 10 pillars
 */

class SearchEngineService {
  constructor() {
    this.index = new Map();
    this.searchHistory = new Map();
    this.trending = new Map();
    this.recommendations = new Map();
    this.initializeIndex();
  }

  initializeIndex() {
    // Initialize search index for each pillar
    this.pillars = [
      'digital_arts', 'physical_items', 'courses', 'freelancing',
      'seva', 'tourism', 'language', 'land_food', 'advocacy', 'materials'
    ];

    this.pillars.forEach(pillar => {
      this.index.set(pillar, []);
    });
  }

  /**
   * Index item for search
   */
  async indexItem(itemData) {
    try {
      const { id, pillar, title, description, tags, metadata, creator, cultural } = itemData;

      const indexEntry = {
        id: id,
        pillar: pillar,
        title: title.toLowerCase(),
        description: description.toLowerCase(),
        tags: tags.map(t => t.toLowerCase()),
        metadata: metadata,
        creator: creator,
        cultural: cultural,
        indexedAt: new Date().toISOString(),
        searchScore: 0
      };

      const pillarIndex = this.index.get(pillar) || [];
      
      // Remove existing entry if updating
      const existingIdx = pillarIndex.findIndex(i => i.id === id);
      if (existingIdx >= 0) {
        pillarIndex[existingIdx] = indexEntry;
      } else {
        pillarIndex.push(indexEntry);
      }

      this.index.set(pillar, pillarIndex);

      return {
        success: true,
        itemId: id,
        pillar: pillar,
        indexed: true
      };
    } catch (error) {
      console.error('Index item error:', error);
      throw error;
    }
  }

  /**
   * Search across all pillars
   */
  async search(query, options = {}) {
    try {
      const { 
        pillars, 
        filters = {}, 
        sortBy = 'relevance', 
        limit = 20, 
        offset = 0 
      } = options;

      const searchTerms = query.toLowerCase().split(' ').filter(t => t.length > 2);
      const results = [];

      // Determine which pillars to search
      const searchPillars = pillars || this.pillars;

      for (const pillar of searchPillars) {
        const pillarIndex = this.index.get(pillar) || [];
        
        for (const item of pillarIndex) {
          let score = this.calculateRelevance(item, searchTerms, query.toLowerCase());
          
          if (score > 0) {
            // Apply filters
            if (filters.creator && item.creator !== filters.creator) continue;
            if (filters.nation && item.cultural?.nation !== filters.nation) continue;
            if (filters.minPrice && item.metadata?.price < filters.minPrice) continue;
            if (filters.maxPrice && item.metadata?.price > filters.maxPrice) continue;

            // Apply cultural significance boost
            if (filters.sacred && item.cultural?.sacred) score *= 1.5;
            if (filters.elderApproved && item.cultural?.elderApproved) score *= 1.3;

            results.push({
              ...item,
              searchScore: score,
              matchedTerms: searchTerms.filter(term => 
                item.title.includes(term) || 
                item.description.includes(term) ||
                item.tags.some(t => t.includes(term))
              )
            });
          }
        }
      }

      // Sort results
      if (sortBy === 'relevance') {
        results.sort((a, b) => b.searchScore - a.searchScore);
      } else if (sortBy === 'newest') {
        results.sort((a, b) => new Date(b.metadata?.createdAt || 0) - new Date(a.metadata?.createdAt || 0));
      } else if (sortBy === 'price_low') {
        results.sort((a, b) => (a.metadata?.price || 0) - (b.metadata?.price || 0));
      } else if (sortBy === 'price_high') {
        results.sort((a, b) => (b.metadata?.price || 0) - (a.metadata?.price || 0));
      }

      const total = results.length;
      const paginated = results.slice(offset, offset + limit);

      // Record search for analytics
      this.recordSearch(query, options, total);

      return {
        success: true,
        query: query,
        results: paginated,
        summary: {
          total: total,
          returned: paginated.length,
          pillars: [...new Set(paginated.map(r => r.pillar))]
        }
      };
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  /**
   * Calculate relevance score
   */
  calculateRelevance(item, searchTerms, fullQuery) {
    let score = 0;

    for (const term of searchTerms) {
      // Title match (highest weight)
      if (item.title.includes(term)) {
        score += term === fullQuery ? 20 : 10;
        if (item.title.startsWith(term)) score += 5;
      }

      // Tag match
      if (item.tags.some(t => t.includes(term))) {
        score += 8;
      }

      // Description match
      if (item.description.includes(term)) {
        score += 5;
      }

      // Cultural metadata match
      if (item.cultural?.nation?.toLowerCase().includes(term)) score += 7;
      if (item.cultural?.significance?.toLowerCase().includes(term)) score += 6;
    }

    // Exact phrase match bonus
    if (item.title.includes(fullQuery)) score += 15;
    if (item.description.includes(fullQuery)) score += 10;

    return score;
  }

  /**
   * Get AI-powered recommendations
   */
  async getRecommendations(user, context = {}) {
    try {
      const { pillar, itemId, limit = 10 } = context;

      // Get user's search history
      const history = this.searchHistory.get(user) || [];
      const interests = this.extractInterests(history);

      let candidates = [];

      // If viewing specific item, find similar
      if (itemId && pillar) {
        const item = this.findItem(itemId, pillar);
        if (item) {
          candidates = this.findSimilar(item);
        }
      }

      // If no specific item or not enough results, use interests
      if (candidates.length < limit) {
        for (const interest of interests) {
          const interestResults = await this.search(interest, { limit: 5 });
          candidates.push(...interestResults.results);
        }
      }

      // Remove duplicates and already viewed
      const unique = [...new Map(candidates.map(c => [c.id, c])).values()];
      
      // Score by relevance to user interests
      const scored = unique.map(item => ({
        ...item,
        recommendationScore: this.calculateRecommendationScore(item, interests)
      }));

      scored.sort((a, b) => b.recommendationScore - a.recommendationScore);

      return {
        success: true,
        recommendations: scored.slice(0, limit),
        basedOn: interests
      };
    } catch (error) {
      console.error('Get recommendations error:', error);
      throw error;
    }
  }

  /**
   * Extract user interests from search history
   */
  extractInterests(history) {
    const termFrequency = {};
    
    for (const search of history.slice(-20)) { // Last 20 searches
      const terms = search.query.toLowerCase().split(' ');
      for (const term of terms) {
        if (term.length > 3) {
          termFrequency[term] = (termFrequency[term] || 0) + 1;
        }
      }
    }

    // Return top 5 interests
    return Object.entries(termFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([term]) => term);
  }

  /**
   * Calculate recommendation score
   */
  calculateRecommendationScore(item, interests) {
    let score = 0;
    const itemText = `${item.title} ${item.description} ${item.tags.join(' ')}`.toLowerCase();

    for (const interest of interests) {
      if (itemText.includes(interest)) score += 10;
    }

    // Boost for cultural significance
    if (item.cultural?.elderApproved) score += 5;
    if (item.cultural?.sacred) score += 3;

    // Recency boost
    const daysSinceIndexed = (Date.now() - new Date(item.indexedAt)) / (1000 * 60 * 60 * 24);
    if (daysSinceIndexed < 7) score += 3;

    return score;
  }

  /**
   * Find similar items
   */
  findSimilar(item) {
    const allItems = [];
    for (const pillar of this.pillars) {
      allItems.push(...(this.index.get(pillar) || []));
    }

    return allItems
      .filter(i => i.id !== item.id)
      .map(i => ({
        ...i,
        similarity: this.calculateSimilarity(item, i)
      }))
      .filter(i => i.similarity > 0.3)
      .sort((a, b) => b.similarity - a.similarity);
  }

  /**
   * Calculate item similarity
   */
  calculateSimilarity(item1, item2) {
    let score = 0;

    // Same creator
    if (item1.creator === item2.creator) score += 0.3;

    // Same nation
    if (item1.cultural?.nation === item2.cultural?.nation) score += 0.4;

    // Shared tags
    const sharedTags = item1.tags.filter(t => item2.tags.includes(t));
    score += (sharedTags.length / Math.max(item1.tags.length, item2.tags.length)) * 0.3;

    return Math.min(score, 1);
  }

  /**
   * Get trending items
   */
  async getTrending(pillar, period = '24h') {
    try {
      const now = Date.now();
      const periodMs = period === '24h' ? 24 * 60 * 60 * 1000 :
                       period === '7d' ? 7 * 24 * 60 * 60 * 1000 :
                       30 * 24 * 60 * 60 * 1000;

      let items = [];
      if (pillar) {
        items = this.index.get(pillar) || [];
      } else {
        for (const p of this.pillars) {
          items.push(...(this.index.get(p) || []));
        }
      }

      // Filter by recency and sort by engagement (mock)
      const trending = items
        .filter(i => now - new Date(i.indexedAt) < periodMs)
        .map(i => ({
          ...i,
          trendingScore: Math.random() * 100 // Mock engagement score
        }))
        .sort((a, b) => b.trendingScore - a.trendingScore)
        .slice(0, 20);

      return {
        success: true,
        period: period,
        pillar: pillar || 'all',
        trending: trending
      };
    } catch (error) {
      console.error('Get trending error:', error);
      throw error;
    }
  }

  /**
   * Record search for analytics
   */
  recordSearch(query, options, resultCount) {
    const searchRecord = {
      query: query,
      options: options,
      resultCount: resultCount,
      timestamp: new Date().toISOString()
    };

    // Store per user if available
    if (options.user) {
      const userHistory = this.searchHistory.get(options.user) || [];
      userHistory.push(searchRecord);
      this.searchHistory.set(options.user, userHistory.slice(-100)); // Keep last 100
    }
  }

  /**
   * Get search suggestions
   */
  async getSuggestions(partial, limit = 5) {
    try {
      const partialLower = partial.toLowerCase();
      const suggestions = new Set();

      // Collect all titles and tags
      for (const pillar of this.pillars) {
        const items = this.index.get(pillar) || [];
        for (const item of items) {
          if (item.title.includes(partialLower)) {
            suggestions.add(item.title);
          }
          for (const tag of item.tags) {
            if (tag.includes(partialLower)) {
              suggestions.add(tag);
            }
          }
        }
      }

      return {
        success: true,
        query: partial,
        suggestions: Array.from(suggestions).slice(0, limit)
      };
    } catch (error) {
      console.error('Get suggestions error:', error);
      throw error;
    }
  }

  findItem(id, pillar) {
    const items = this.index.get(pillar) || [];
    return items.find(i => i.id === id);
  }
}

module.exports = new SearchEngineService();
