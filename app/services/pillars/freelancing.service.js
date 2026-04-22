/**
 * PILLAR 4: FREELANCING
 * Expertise as service marketplace
 */

class FreelancingService {
  constructor() {
    this.profiles = new Map();
    this.gigs = new Map();
    this.contracts = new Map();
    this.reviews = new Map();
  }

  async createProfile(user, profileData) {
    const profile = {
      profileId: this.generateId('FLP'),
      pillar: 'freelancing',
      user: user,
      name: profileData.name,
      tagline: profileData.tagline,
      bio: profileData.bio,
      nation: profileData.nation,
      location: profileData.location,
      skills: profileData.skills || [],
      categories: profileData.categories || [], // 'design', 'development', 'writing', 'consulting', 'teaching'
      portfolio: profileData.portfolio || [],
      experience: profileData.experience || [],
      education: profileData.education || [],
      certifications: profileData.certifications || [],
      rates: {
        hourly: profileData.hourlyRate || null,
        daily: profileData.dailyRate || null,
        project: profileData.projectRate || null,
        currency: profileData.currency || 'INDI'
      },
      availability: {
        status: profileData.availability || 'available', // 'available', 'busy', 'unavailable'
        hoursPerWeek: profileData.hoursPerWeek || 40,
        timezone: profileData.timezone
      },
      stats: {
        completedProjects: 0,
        totalEarnings: 0,
        rating: 0,
        reviewCount: 0,
        onTimeDelivery: 100,
        repeatClients: 0
      },
      verification: {
        identity: false,
        skills: [],
        background: false
      },
      status: 'active',
      createdAt: new Date().toISOString()
    };

    this.profiles.set(profile.profileId, profile);

    return {
      success: true,
      profileId: profile.profileId,
      status: profile.status
    };
  }

  async createGig(freelancer, gigData) {
    const profile = Array.from(this.profiles.values()).find(p => p.user === freelancer);
    
    const gig = {
      gigId: this.generateId('GIG'),
      pillar: 'freelancing',
      freelancer: freelancer,
      profileId: profile?.profileId,
      title: gigData.title,
      description: gigData.description,
      category: gigData.category,
      skills: gigData.skills || [],
      deliverables: gigData.deliverables || [],
      pricing: {
        type: gigData.pricingType || 'fixed', // 'fixed', 'hourly', 'milestone'
        packages: gigData.packages || [{
          name: 'Basic',
          description: gigData.basicDescription,
          price: gigData.basicPrice,
          delivery: gigData.basicDelivery,
          revisions: gigData.basicRevisions,
          features: gigData.basicFeatures || []
        }]
      },
      requirements: gigData.requirements || [],
      faq: gigData.faq || [],
      portfolio: gigData.portfolioExamples || [],
      status: 'active',
      stats: {
        views: 0,
        orders: 0,
        rating: 0
      },
      createdAt: new Date().toISOString()
    };

    this.gigs.set(gig.gigId, gig);

    return {
      success: true,
      gigId: gig.gigId,
      status: gig.status
    };
  }

  async createContract(client, contractData) {
    const gig = this.gigs.get(contractData.gigId);
    if (!gig) throw new Error('Gig not found');

    const contract = {
      contractId: this.generateId('CNT'),
      pillar: 'freelancing',
      client: client,
      freelancer: gig.freelancer,
      gigId: contractData.gigId,
      package: contractData.packageSelected,
      price: contractData.price,
      currency: contractData.currency || 'INDI',
      deliverables: contractData.deliverables || gig.deliverables,
      timeline: {
        startDate: new Date().toISOString(),
        deadline: contractData.deadline,
        deliveredAt: null
      },
      milestones: contractData.milestones || [],
      escrow: {
        amount: contractData.price,
        status: 'pending', // 'pending', 'funded', 'released', 'disputed'
        fundedAt: null,
        releasedAt: null
      },
      communication: {
        method: contractData.communicationMethod || 'platform',
        meetings: []
      },
      status: 'pending', // 'pending', 'active', 'completed', 'cancelled', 'disputed'
      createdAt: new Date().toISOString()
    };

    this.contracts.set(contract.contractId, contract);

    return {
      success: true,
      contractId: contract.contractId,
      status: contract.status,
      escrowRequired: contract.price
    };
  }

  async fundEscrow(contractId, client, paymentData) {
    const contract = this.contracts.get(contractId);
    if (!contract) throw new Error('Contract not found');
    if (contract.client !== client) throw new Error('Not authorized');

    contract.escrow.status = 'funded';
    contract.escrow.fundedAt = new Date().toISOString();
    contract.escrow.txId = paymentData.txId;
    contract.status = 'active';

    return {
      success: true,
      contractId: contractId,
      escrowStatus: 'funded',
      contractStatus: 'active'
    };
  }

  async completeContract(contractId, freelancer) {
    const contract = this.contracts.get(contractId);
    if (!contract) throw new Error('Contract not found');
    if (contract.freelancer !== freelancer) throw new Error('Not authorized');

    contract.status = 'completed';
    contract.timeline.deliveredAt = new Date().toISOString();

    // Release escrow
    contract.escrow.status = 'released';
    contract.escrow.releasedAt = new Date().toISOString();

    // Update stats
    const profile = Array.from(this.profiles.values())
      .find(p => p.user === freelancer);
    if (profile) {
      profile.stats.completedProjects++;
      profile.stats.totalEarnings += contract.price;
    }

    return {
      success: true,
      contractId: contractId,
      status: 'completed',
      paymentReleased: contract.price
    };
  }

  async submitReview(contractId, reviewer, reviewData) {
    const contract = this.contracts.get(contractId);
    if (!contract) throw new Error('Contract not found');

    const review = {
      reviewId: this.generateId('REV'),
      contractId: contractId,
      reviewer: reviewer,
      reviewee: reviewer === contract.client ? contract.freelancer : contract.client,
      role: reviewer === contract.client ? 'client' : 'freelancer',
      rating: reviewData.rating,
      title: reviewData.title,
      content: reviewData.content,
      tags: reviewData.tags || [],
      wouldRecommend: reviewData.wouldRecommend,
      createdAt: new Date().toISOString()
    };

    this.reviews.set(review.reviewId, review);

    // Update profile rating
    const profile = Array.from(this.profiles.values())
      .find(p => p.user === review.reviewee);
    if (profile) {
      profile.stats.reviewCount++;
      // Recalculate average rating
      const userReviews = Array.from(this.reviews.values())
        .filter(r => r.reviewee === review.reviewee);
      profile.stats.rating = userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;
    }

    return {
      success: true,
      reviewId: review.reviewId
    };
  }

  async getGigs(filters = {}) {
    let gigs = Array.from(this.gigs.values())
      .filter(g => g.status === 'active');

    if (filters.category) gigs = gigs.filter(g => g.category === filters.category);
    if (filters.skill) gigs = gigs.filter(g => g.skills.includes(filters.skill));
    if (filters.minPrice) gigs = gigs.filter(g => 
      g.pricing.packages.some(p => p.price >= filters.minPrice)
    );
    if (filters.maxPrice) gigs = gigs.filter(g => 
      g.pricing.packages.some(p => p.price <= filters.maxPrice)
    );

    return gigs.map(g => ({
      gigId: g.gigId,
      title: g.title,
      category: g.category,
      startingPrice: Math.min(...g.pricing.packages.map(p => p.price)),
      freelancer: g.freelancer,
      rating: g.stats.rating,
      orders: g.stats.orders
    }));
  }

  async getFreelancers(filters = {}) {
    let profiles = Array.from(this.profiles.values())
      .filter(p => p.status === 'active');

    if (filters.skill) profiles = profiles.filter(p => p.skills.includes(filters.skill));
    if (filters.category) profiles = profiles.filter(p => p.categories.includes(filters.category));
    if (filters.minRating) profiles = profiles.filter(p => p.stats.rating >= filters.minRating);
    if (filters.available) profiles = profiles.filter(p => p.availability.status === 'available');

    return profiles.map(p => ({
      profileId: p.profileId,
      name: p.name,
      tagline: p.tagline,
      skills: p.skills.slice(0, 5),
      hourlyRate: p.rates.hourly,
      rating: p.stats.rating,
      completedProjects: p.stats.completedProjects,
      availability: p.availability.status
    }));
  }

  generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new FreelancingService();
