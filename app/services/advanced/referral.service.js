/**
 * Referral Program Service
 * Track referrals and reward users
 */

class ReferralService {
  constructor() {
    this.referrals = new Map();
    this.referralCodes = new Map();
    this.rewards = new Map();
    this.campaigns = new Map();
    this.initializeCampaigns();
  }

  initializeCampaigns() {
    // Default referral campaign
    this.campaigns.set('default', {
      id: 'default',
      name: 'Indigena Ambassador',
      description: 'Refer friends and earn rewards',
      active: true,
      referrerReward: {
        type: 'points',
        amount: 500,
        description: '500 points per referral'
      },
      referredReward: {
        type: 'discount',
        amount: 10,
        description: '10% off first purchase'
      },
      milestones: [
        { count: 5, reward: { type: 'badge', id: 'connector' } },
        { count: 10, reward: { type: 'points', amount: 2000 } },
        { count: 25, reward: { type: 'nft', tier: 'rare' } },
        { count: 50, reward: { type: 'token', amount: 1000, currency: 'INDI' } }
      ]
    });
  }

  /**
   * Generate referral code for user
   */
  async generateReferralCode(user) {
    try {
      // Check if user already has a code
      let existingCode = null;
      for (const [code, data] of this.referralCodes) {
        if (data.user === user) {
          existingCode = code;
          break;
        }
      }

      if (existingCode) {
        return {
          success: true,
          code: existingCode,
          existing: true
        };
      }

      // Generate new code
      const code = this.generateCode();
      
      this.referralCodes.set(code, {
        code: code,
        user: user,
        createdAt: new Date().toISOString(),
        totalReferrals: 0,
        activeReferrals: 0,
        totalRewards: 0
      });

      return {
        success: true,
        code: code,
        link: `https://indigena.market/ref/${code}`
      };
    } catch (error) {
      console.error('Generate referral code error:', error);
      throw error;
    }
  }

  /**
   * Track referral signup
   */
  async trackReferral(referredUser, referralCode) {
    try {
      const codeData = this.referralCodes.get(referralCode);
      if (!codeData) throw new Error('Invalid referral code');
      if (codeData.user === referredUser) {
        throw new Error('Cannot refer yourself');
      }

      // Check if user was already referred
      for (const ref of this.referrals.values()) {
        if (ref.referred === referredUser) {
          throw new Error('User already referred');
        }
      }

      const referral = {
        referralId: this.generateId('REF'),
        referrer: codeData.user,
        referred: referredUser,
        code: referralCode,
        status: 'pending',
        createdAt: new Date().toISOString(),
        convertedAt: null,
        rewardsGiven: {
          referrer: false,
          referred: false
        }
      };

      this.referrals.set(referral.referralId, referral);

      // Update code stats
      codeData.totalReferrals++;

      return {
        success: true,
        referralId: referral.referralId,
        referrer: codeData.user,
        message: 'Referral tracked successfully'
      };
    } catch (error) {
      console.error('Track referral error:', error);
      throw error;
    }
  }

  /**
   * Convert referral (when referred user makes first purchase)
   */
  async convertReferral(referredUser, purchaseAmount) {
    try {
      // Find referral
      let referral = null;
      for (const ref of this.referrals.values()) {
        if (ref.referred === referredUser && ref.status === 'pending') {
          referral = ref;
          break;
        }
      }

      if (!referral) {
        return { success: false, message: 'No pending referral found' };
      }

      referral.status = 'converted';
      referral.convertedAt = new Date().toISOString();
      referral.purchaseAmount = purchaseAmount;

      // Get campaign
      const campaign = this.campaigns.get('default');

      // Give rewards
      const rewards = await this.giveRewards(referral, campaign);

      // Update referrer stats
      const codeData = this.referralCodes.get(referral.code);
      if (codeData) {
        codeData.activeReferrals++;
        codeData.totalRewards += rewards.referrer.value;

        // Check milestones
        await this.checkMilestones(codeData.user, codeData.activeReferrals, campaign);
      }

      return {
        success: true,
        referralId: referral.referralId,
        status: 'converted',
        rewards: rewards
      };
    } catch (error) {
      console.error('Convert referral error:', error);
      throw error;
    }
  }

  /**
   * Give rewards to both parties
   */
  async giveRewards(referral, campaign) {
    const rewards = {
      referrer: null,
      referred: null
    };

    // Referrer reward
    if (campaign.referrerReward) {
      rewards.referrer = {
        type: campaign.referrerReward.type,
        value: campaign.referrerReward.amount,
        description: campaign.referrerReward.description,
        given: true
      };
      referral.rewardsGiven.referrer = true;
    }

    // Referred reward
    if (campaign.referredReward) {
      rewards.referred = {
        type: campaign.referredReward.type,
        value: campaign.referredReward.amount,
        description: campaign.referredReward.description,
        given: true
      };
      referral.rewardsGiven.referred = true;
    }

    return rewards;
  }

  /**
   * Check and award milestones
   */
  async checkMilestones(user, referralCount, campaign) {
    for (const milestone of campaign.milestones) {
      if (referralCount === milestone.count) {
        // Award milestone reward
        const reward = {
          rewardId: this.generateId('MILESTONE'),
          user: user,
          milestone: milestone.count,
          reward: milestone.reward,
          awardedAt: new Date().toISOString()
        };

        let userRewards = this.rewards.get(user) || [];
        userRewards.push(reward);
        this.rewards.set(user, userRewards);

        return reward;
      }
    }
  }

  /**
   * Get referral stats for user
   */
  async getReferralStats(user) {
    try {
      // Find user's code
      let userCode = null;
      for (const [code, data] of this.referralCodes) {
        if (data.user === user) {
          userCode = data;
          break;
        }
      }

      // Get referrals
      const userReferrals = [];
      for (const ref of this.referrals.values()) {
        if (ref.referrer === user) {
          userReferrals.push(ref);
        }
      }

      const stats = {
        code: userCode?.code || null,
        totalReferrals: userReferrals.length,
        converted: userReferrals.filter(r => r.status === 'converted').length,
        pending: userReferrals.filter(r => r.status === 'pending').length,
        totalRewards: userCode?.totalRewards || 0,
        nextMilestone: this.getNextMilestone(userReferrals.filter(r => r.status === 'converted').length)
      };

      return {
        success: true,
        stats: stats,
        referrals: userReferrals
      };
    } catch (error) {
      console.error('Get referral stats error:', error);
      throw error;
    }
  }

  /**
   * Get next milestone
   */
  getNextMilestone(currentCount) {
    const campaign = this.campaigns.get('default');
    for (const milestone of campaign.milestones) {
      if (milestone.count > currentCount) {
        return {
          referralsNeeded: milestone.count - currentCount,
          reward: milestone.reward
        };
      }
    }
    return null;
  }

  /**
   * Get referral rewards history
   */
  async getRewardsHistory(user) {
    const rewards = this.rewards.get(user) || [];

    return {
      success: true,
      rewards: rewards
    };
  }

  /**
   * Get top referrers
   */
  async getTopReferrers(limit = 10) {
    const referrers = [];

    for (const [code, data] of this.referralCodes) {
      referrers.push({
        user: data.user,
        referrals: data.activeReferrals,
        code: code
      });
    }

    referrers.sort((a, b) => b.referrals - a.referrals);

    return {
      success: true,
      topReferrers: referrers.slice(0, limit)
    };
  }

  /**
   * Create custom referral campaign
   */
  async createCampaign(campaignData) {
    try {
      const campaign = {
        id: this.generateId('CAMP'),
        ...campaignData,
        createdAt: new Date().toISOString(),
        active: true
      };

      this.campaigns.set(campaign.id, campaign);

      return {
        success: true,
        campaignId: campaign.id
      };
    } catch (error) {
      console.error('Create campaign error:', error);
      throw error;
    }
  }

  generateCode() {
    // Generate 8 character alphanumeric code
    return Array.from({length: 8}, () => 
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]
    ).join('');
  }

  generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new ReferralService();
