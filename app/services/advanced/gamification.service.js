/**
 * Gamification Service
 * Badges, achievements, leaderboards, and rewards
 */

class GamificationService {
  constructor() {
    this.badges = new Map();
    this.userBadges = new Map();
    this.achievements = new Map();
    this.userAchievements = new Map();
    this.leaderboards = new Map();
    this.points = new Map();
    this.initializeBadges();
    this.initializeAchievements();
  }

  initializeBadges() {
    // Cultural badges
    this.badges.set('first_nation', {
      id: 'first_nation',
      name: 'First Nation',
      description: 'First NFT minted on the platform',
      icon: '🎨',
      rarity: 'common',
      points: 100
    });

    this.badges.set('culture_keeper', {
      id: 'culture_keeper',
      name: 'Culture Keeper',
      description: 'Minted 10 culturally significant NFTs',
      icon: '🏛️',
      rarity: 'rare',
      points: 500
    });

    this.badges.set('wisdom_sharer', {
      id: 'wisdom_sharer',
      name: 'Wisdom Sharer',
      description: 'Created 5 courses',
      icon: '📚',
      rarity: 'rare',
      points: 750
    });

    this.badges.set('community_pillar', {
      id: 'community_pillar',
      name: 'Community Pillar',
      description: 'Received 100 likes on content',
      icon: '🤝',
      rarity: 'epic',
      points: 1000
    });

    this.badges.set('master_artisan', {
      id: 'master_artisan',
      name: 'Master Artisan',
      description: 'Sold 50 NFTs',
      icon: '✨',
      rarity: 'epic',
      points: 2000
    });

    this.badges.set('elder_approved', {
      id: 'elder_approved',
      name: 'Elder Approved',
      description: 'Received elder approval on artwork',
      icon: '👑',
      rarity: 'legendary',
      points: 5000
    });

    this.badges.set('seva_champion', {
      id: 'seva_champion',
      name: 'Seva Champion',
      description: 'Donated 1000 INDI to community causes',
      icon: '❤️',
      rarity: 'legendary',
      points: 3000
    });

    this.badges.set('language_guardian', {
      id: 'language_guardian',
      name: 'Language Guardian',
      description: 'Contributed to language preservation',
      icon: '🗣️',
      rarity: 'epic',
      points: 1500
    });

    this.badges.set('early_adopter', {
      id: 'early_adopter',
      name: 'Early Adopter',
      description: 'Joined in the first month',
      icon: '🚀',
      rarity: 'rare',
      points: 250
    });

    this.badges.set('connector', {
      id: 'connector',
      name: 'Connector',
      description: 'Referred 10 active users',
      icon: '🔗',
      rarity: 'epic',
      points: 1000
    });
  }

  initializeAchievements() {
    // Achievement categories
    this.achievementCategories = {
      creator: 'Creator Achievements',
      collector: 'Collector Achievements',
      community: 'Community Achievements',
      trader: 'Trader Achievements',
      explorer: 'Explorer Achievements'
    };

    // Creator achievements
    this.achievements.set('creator_novice', {
      id: 'creator_novice',
      category: 'creator',
      name: 'Novice Creator',
      description: 'Mint your first NFT',
      target: 1,
      reward: { points: 50, badge: 'first_nation' }
    });

    this.achievements.set('creator_apprentice', {
      id: 'creator_apprentice',
      category: 'creator',
      name: 'Apprentice Creator',
      description: 'Mint 10 NFTs',
      target: 10,
      reward: { points: 200 }
    });

    this.achievements.set('creator_master', {
      id: 'creator_master',
      category: 'creator',
      name: 'Master Creator',
      description: 'Mint 100 NFTs',
      target: 100,
      reward: { points: 1000, badge: 'master_artisan' }
    });

    // Collector achievements
    this.achievements.set('collector_novice', {
      id: 'collector_novice',
      category: 'collector',
      name: 'Novice Collector',
      description: 'Collect your first NFT',
      target: 1,
      reward: { points: 50 }
    });

    this.achievements.set('collector_curator', {
      id: 'collector_curator',
      category: 'collector',
      name: 'Curator',
      description: 'Collect 25 NFTs',
      target: 25,
      reward: { points: 500 }
    });

    // Trader achievements
    this.achievements.set('first_sale', {
      id: 'first_sale',
      category: 'trader',
      name: 'First Sale',
      description: 'Make your first sale',
      target: 1,
      reward: { points: 100 }
    });

    this.achievements.set('volume_trader', {
      id: 'volume_trader',
      category: 'trader',
      name: 'Volume Trader',
      description: 'Trade 10,000 INDI volume',
      target: 10000,
      reward: { points: 1000 }
    });

    // Community achievements
    this.achievements.set('social_butterfly', {
      id: 'social_butterfly',
      category: 'community',
      name: 'Social Butterfly',
      description: 'Follow 50 creators',
      target: 50,
      reward: { points: 300 }
    });

    this.achievements.set('mentor', {
      id: 'mentor',
      category: 'community',
      name: 'Mentor',
      description: 'Complete 5 mentorship sessions',
      target: 5,
      reward: { points: 500 }
    });
  }

  /**
   * Award badge to user
   */
  async awardBadge(user, badgeId) {
    try {
      const badge = this.badges.get(badgeId);
      if (!badge) throw new Error('Badge not found');

      let userBadges = this.userBadges.get(user) || [];
      
      // Check if already has badge
      if (userBadges.some(b => b.badgeId === badgeId)) {
        return { success: false, message: 'Badge already awarded' };
      }

      const awarded = {
        badgeId: badgeId,
        awardedAt: new Date().toISOString(),
        ...badge
      };

      userBadges.push(awarded);
      this.userBadges.set(user, userBadges);

      // Award points
      await this.addPoints(user, badge.points, `Badge: ${badge.name}`);

      return {
        success: true,
        badge: awarded,
        pointsAwarded: badge.points
      };
    } catch (error) {
      console.error('Award badge error:', error);
      throw error;
    }
  }

  /**
   * Track achievement progress
   */
  async trackProgress(user, achievementId, progress) {
    try {
      const achievement = this.achievements.get(achievementId);
      if (!achievement) throw new Error('Achievement not found');

      let userAchievements = this.userAchievements.get(user) || {};
      let userAchievement = userAchievements[achievementId] || {
        achievementId: achievementId,
        progress: 0,
        completed: false,
        startedAt: new Date().toISOString()
      };

      // Update progress
      userAchievement.progress = Math.min(progress, achievement.target);

      // Check completion
      if (userAchievement.progress >= achievement.target && !userAchievement.completed) {
        userAchievement.completed = true;
        userAchievement.completedAt = new Date().toISOString();

        // Award rewards
        if (achievement.reward.points) {
          await this.addPoints(user, achievement.reward.points, `Achievement: ${achievement.name}`);
        }
        if (achievement.reward.badge) {
          await this.awardBadge(user, achievement.reward.badge);
        }
      }

      userAchievements[achievementId] = userAchievement;
      this.userAchievements.set(user, userAchievements);

      return {
        success: true,
        achievement: userAchievement,
        completed: userAchievement.completed
      };
    } catch (error) {
      console.error('Track progress error:', error);
      throw error;
    }
  }

  /**
   * Add points to user
   */
  async addPoints(user, amount, reason) {
    let userPoints = this.points.get(user) || {
      total: 0,
      history: []
    };

    userPoints.total += amount;
    userPoints.history.push({
      amount: amount,
      reason: reason,
      timestamp: new Date().toISOString()
    });

    this.points.set(user, userPoints);

    return {
      success: true,
      total: userPoints.total,
      added: amount
    };
  }

  /**
   * Get user gamification profile
   */
  async getUserProfile(user) {
    const badges = this.userBadges.get(user) || [];
    const achievements = this.userAchievements.get(user) || {};
    const points = this.points.get(user) || { total: 0, history: [] };

    // Calculate level based on points
    const level = this.calculateLevel(points.total);

    return {
      success: true,
      profile: {
        user: user,
        level: level,
        points: points.total,
        badges: badges,
        achievements: Object.values(achievements),
        nextLevel: this.getNextLevelPoints(level)
      }
    };
  }

  /**
   * Calculate level from points
   */
  calculateLevel(points) {
    // Level formula: exponential growth
    let level = 1;
    let required = 100;

    while (points >= required) {
      level++;
      required = Math.floor(required * 1.5);
    }

    return level;
  }

  /**
   * Get points needed for next level
   */
  getNextLevelPoints(currentLevel) {
    let required = 100;
    for (let i = 1; i <= currentLevel; i++) {
      required = Math.floor(required * 1.5);
    }
    return required;
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(category = 'points', period = 'all', limit = 100) {
    try {
      let entries = [];

      if (category === 'points') {
        for (const [user, data] of this.points) {
          entries.push({ user, score: data.total });
        }
      } else if (category === 'badges') {
        for (const [user, badges] of this.userBadges) {
          entries.push({ user, score: badges.length });
        }
      } else if (category === 'sales') {
        // In production: Query from transaction data
        entries = this.generateMockLeaderboard(limit);
      }

      entries.sort((a, b) => b.score - a.score);
      entries = entries.slice(0, limit);

      // Add ranks
      entries = entries.map((e, i) => ({ ...e, rank: i + 1 }));

      return {
        success: true,
        category: category,
        period: period,
        leaderboard: entries
      };
    } catch (error) {
      console.error('Get leaderboard error:', error);
      throw error;
    }
  }

  /**
   * Get available badges
   */
  async getAvailableBadges() {
    return {
      success: true,
      badges: Array.from(this.badges.values())
    };
  }

  /**
   * Get available achievements
   */
  async getAvailableAchievements(category) {
    let achievements = Array.from(this.achievements.values());
    
    if (category) {
      achievements = achievements.filter(a => a.category === category);
    }

    return {
      success: true,
      achievements: achievements
    };
  }

  generateMockLeaderboard(limit) {
    const entries = [];
    for (let i = 0; i < limit; i++) {
      entries.push({
        user: `user_${i}`,
        score: Math.floor(Math.random() * 10000)
      });
    }
    return entries.sort((a, b) => b.score - a.score);
  }
}

module.exports = new GamificationService();
