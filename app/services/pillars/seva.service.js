/**
 * PILLAR 5: SEVA (GIVING)
 * Reciprocity and community building
 */

class SevaService {
  constructor() {
    this.campaigns = new Map();
    this.donations = new Map();
    this.sponsorships = new Map();
    this.honorariums = new Map();
  }

  async createCampaign(creator, campaignData) {
    const campaign = {
      campaignId: this.generateId('SEVA'),
      pillar: 'seva',
      creator: creator,
      type: campaignData.type, // 'apprenticeship', 'community_project', 'emergency_relief', 'cultural_preservation'
      title: campaignData.title,
      description: campaignData.description,
      story: campaignData.story,
      beneficiary: {
        type: campaignData.beneficiaryType, // 'individual', 'community', 'organization'
        name: campaignData.beneficiaryName,
        description: campaignData.beneficiaryDescription,
        verification: campaignData.beneficiaryVerification || null
      },
      goal: {
        amount: campaignData.goalAmount,
        currency: campaignData.currency || 'INDI',
        deadline: campaignData.deadline
      },
      tiers: campaignData.tiers || [
        { name: 'Supporter', amount: 10, reward: 'Digital thank you card' },
        { name: 'Advocate', amount: 50, reward: 'Name on honor wall' },
        { name: 'Guardian', amount: 100, reward: 'Personalized video message' },
        { name: 'Elder', amount: 500, reward: 'Handmade gift from beneficiary' }
      ],
      media: {
        images: campaignData.images || [],
        video: campaignData.video || null,
        documents: campaignData.documents || []
      },
      updates: [],
      stats: {
        raised: 0,
        contributors: 0,
        percentFunded: 0
      },
      status: 'active',
      createdAt: new Date().toISOString()
    };

    this.campaigns.set(campaign.campaignId, campaign);

    return {
      success: true,
      campaignId: campaign.campaignId,
      status: campaign.status
    };
  }

  async donate(donor, campaignId, donationData) {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) throw new Error('Campaign not found');

    const donation = {
      donationId: this.generateId('DON'),
      campaignId: campaignId,
      donor: donor,
      amount: donationData.amount,
      currency: donationData.currency || 'INDI',
      tier: donationData.tier || null,
      message: donationData.message || null,
      anonymous: donationData.anonymous || false,
      recurring: donationData.recurring || false,
      txId: donationData.txId,
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    this.donations.set(donation.donationId, donation);

    // Update campaign stats
    campaign.stats.raised += donation.amount;
    campaign.stats.contributors++;
    campaign.stats.percentFunded = Math.round(
      (campaign.stats.raised / campaign.goal.amount) * 100
    );

    return {
      success: true,
      donationId: donation.donationId,
      amount: donation.amount,
      campaignPercentFunded: campaign.stats.percentFunded
    };
  }

  async createSponsorship(sponsor, sponsorshipData) {
    const sponsorship = {
      sponsorshipId: this.generateId('SPN'),
      pillar: 'seva',
      sponsor: sponsor,
      type: sponsorshipData.type, // 'apprentice', 'student', 'artist', 'elder'
      beneficiary: {
        name: sponsorshipData.beneficiaryName,
        description: sponsorshipData.beneficiaryDescription,
        nation: sponsorshipData.beneficiaryNation,
        goals: sponsorshipData.beneficiaryGoals
      },
      commitment: {
        amount: sponsorshipData.monthlyAmount,
        currency: sponsorshipData.currency || 'INDI',
        duration: sponsorshipData.duration, // months
        startDate: new Date().toISOString(),
        endDate: this.calculateEndDate(sponsorshipData.duration)
      },
      engagement: {
        type: sponsorshipData.engagementType || 'financial', // 'financial', 'mentorship', 'both'
        checkins: [],
        reports: []
      },
      status: 'active',
      createdAt: new Date().toISOString()
    };

    this.sponsorships.set(sponsorship.sponsorshipId, sponsorship);

    return {
      success: true,
      sponsorshipId: sponsorship.sponsorshipId,
      monthlyAmount: sponsorship.commitment.amount,
      totalCommitment: sponsorship.commitment.amount * sponsorship.commitment.duration
    };
  }

  async createHonorarium(donor, honorariumData) {
    const honorarium = {
      honorariumId: this.generateId('HNR'),
      pillar: 'seva',
      donor: donor,
      elder: {
        name: honorariumData.elderName,
        nation: honorariumData.elderNation,
        role: honorariumData.elderRole,
        contributions: honorariumData.contributions
      },
      amount: honorariumData.amount,
      currency: honorariumData.currency || 'INDI',
      occasion: honorariumData.occasion,
      message: honorariumData.message,
      public: honorariumData.public !== false,
      txId: honorariumData.txId,
      status: 'completed',
      createdAt: new Date().toISOString()
    };

    this.honorariums.set(honorarium.honorariumId, honorarium);

    return {
      success: true,
      honorariumId: honorarium.honorariumId,
      elder: honorarium.elder.name,
      amount: honorarium.amount
    };
  }

  async getCampaigns(filters = {}) {
    let campaigns = Array.from(this.campaigns.values())
      .filter(c => c.status === 'active');

    if (filters.type) campaigns = campaigns.filter(c => c.type === filters.type);
    if (filters.nation) campaigns = campaigns.filter(c => c.beneficiary.nation === filters.nation);
    if (filters.urgent) {
      campaigns = campaigns.filter(c => 
        (c.stats.percentFunded < 50) && 
        (new Date(c.goal.deadline) - new Date() < 7 * 24 * 60 * 60 * 1000)
      );
    }

    return campaigns.map(c => ({
      campaignId: c.campaignId,
      title: c.title,
      type: c.type,
      thumbnail: c.media.images[0],
      goal: c.goal.amount,
      raised: c.stats.raised,
      percentFunded: c.stats.percentFunded,
      contributors: c.stats.contributors,
      deadline: c.goal.deadline,
      beneficiary: c.beneficiary.name
    }));
  }

  async getDonationHistory(address) {
    const donations = Array.from(this.donations.values())
      .filter(d => d.donor === address)
      .map(d => {
        const campaign = this.campaigns.get(d.campaignId);
        return {
          donationId: d.donationId,
          campaign: campaign?.title,
          amount: d.amount,
          date: d.createdAt,
          status: d.status
        };
      });

    const totalGiven = donations.reduce((sum, d) => sum + d.amount, 0);

    return {
      donations: donations,
      totalGiven: totalGiven,
      campaignsSupported: [...new Set(donations.map(d => d.campaignId))].length
    };
  }

  calculateEndDate(durationMonths) {
    const date = new Date();
    date.setMonth(date.getMonth() + durationMonths);
    return date.toISOString();
  }

  generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new SevaService();
