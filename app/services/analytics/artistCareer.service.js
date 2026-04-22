/**
 * Artist Career Tracking Service
 * Long-term growth metrics and insights for artists
 */

class ArtistCareerService {
  constructor() {
    this.careerStages = new Map([
      ['emerging', { minSales: 0, maxSales: 10, label: 'Emerging Artist' }],
      ['developing', { minSales: 11, maxSales: 50, label: 'Developing Artist' }],
      ['established', { minSales: 51, maxSales: 200, label: 'Established Artist' }],
      ['master', { minSales: 201, maxSales: Infinity, label: 'Master Artist' }]
    ]);
    
    this.milestones = new Map();
    this.initializeMilestones();
  }

  initializeMilestones() {
    this.milestones.set('first_sale', {
      name: 'First Sale',
      description: 'Completed your first sale on Indigena',
      icon: '🎉',
      points: 10
    });
    
    this.milestones.set('ten_sales', {
      name: 'Decade of Sales',
      description: 'Reached 10 total sales',
      icon: '🏆',
      points: 50
    });
    
    this.milestones.set('first_collection', {
      name: 'Collection Creator',
      description: 'Created your first collection',
      icon: '📚',
      points: 25
    });
    
    this.milestones.set('first_secondary', {
      name: 'Secondary Market Star',
      description: 'First resale of your work on secondary market',
      icon: '🔄',
      points: 75
    });
    
    this.milestones.set('thousand_xrp', {
      name: 'XRP Thousandaire',
      description: 'Earned 1,000 XRP in total sales',
      icon: '💎',
      points: 100
    });
    
    this.milestones.set('verified_artist', {
      name: 'Verified Creator',
      description: 'Completed cultural heritage verification',
      icon: '✅',
      points: 50
    });
    
    this.milestones.set('featured_artist', {
      name: 'Featured Creator',
      description: 'Featured on Indigena marketplace',
      icon: '⭐',
      points: 150
    });
  }

  /**
   * Get comprehensive career dashboard for an artist
   */
  async getCareerDashboard(artistAddress) {
    try {
      const dashboard = {
        artistAddress,
        generatedAt: new Date().toISOString(),
        overview: {},
        careerProgression: {},
        performanceMetrics: {},
        milestones: [],
        growthTrajectory: {},
        peerComparison: {},
        recommendations: []
      };

      // Get overview stats
      dashboard.overview = await this.getOverviewStats(artistAddress);

      // Career progression
      dashboard.careerProgression = await this.getCareerProgression(artistAddress);

      // Performance metrics
      dashboard.performanceMetrics = await this.getPerformanceMetrics(artistAddress);

      // Milestones
      dashboard.milestones = await this.getMilestones(artistAddress);

      // Growth trajectory
      dashboard.growthTrajectory = await this.getGrowthTrajectory(artistAddress);

      // Peer comparison
      dashboard.peerComparison = await this.getPeerComparison(artistAddress);

      // Recommendations
      dashboard.recommendations = this.generateRecommendations(dashboard);

      return dashboard;
    } catch (error) {
      console.error('Career dashboard error:', error);
      throw error;
    }
  }

  /**
   * Get overview statistics
   */
  async getOverviewStats(artistAddress) {
    // In production, query database
    return {
      totalSales: Math.floor(Math.random() * 150) + 5,
      totalRevenue: Math.floor(Math.random() * 15000) + 500,
      totalRoyalties: Math.floor(Math.random() * 2000) + 100,
      activeListings: Math.floor(Math.random() * 20) + 1,
      totalWorks: Math.floor(Math.random() * 50) + 5,
      careerStart: new Date(Date.now() - Math.floor(Math.random() * 730) * 24 * 60 * 60 * 1000).toISOString(),
      daysActive: Math.floor(Math.random() * 730) + 30,
      currentTier: ['emerging', 'developing', 'established', 'master'][Math.floor(Math.random() * 4)],
      reputationScore: Math.floor(Math.random() * 40) + 60
    };
  }

  /**
   * Get career progression data
   */
  async getCareerProgression(artistAddress) {
    const stats = await this.getOverviewStats(artistAddress);
    const currentStage = this.careerStages.get(stats.currentTier);
    
    // Find next stage
    const stages = Array.from(this.careerStages.entries());
    const currentIndex = stages.findIndex(([key]) => key === stats.currentTier);
    const nextStage = stages[currentIndex + 1];

    return {
      currentStage: {
        name: stats.currentTier,
        label: currentStage.label,
        salesRange: `${currentStage.minSales}-${currentStage.maxSales === Infinity ? '∞' : currentStage.maxSales}`
      },
      nextStage: nextStage ? {
        name: nextStage[0],
        label: nextStage[1].label,
        salesNeeded: nextStage[1].minSales - stats.totalSales,
        progress: Math.min(100, (stats.totalSales / nextStage[1].minSales) * 100)
      } : null,
      careerTimeline: await this.generateCareerTimeline(artistAddress),
      progressionRate: await this.calculateProgressionRate(artistAddress)
    };
  }

  /**
   * Get performance metrics
   */
  async getPerformanceMetrics(artistAddress) {
    return {
      sales: {
        thisMonth: Math.floor(Math.random() * 10) + 1,
        lastMonth: Math.floor(Math.random() * 8) + 1,
        thisYear: Math.floor(Math.random() * 50) + 10,
        growth: Math.floor(Math.random() * 40) - 10
      },
      revenue: {
        thisMonth: Math.floor(Math.random() * 1000) + 200,
        lastMonth: Math.floor(Math.random() * 800) + 150,
        thisYear: Math.floor(Math.random() * 8000) + 2000,
        growth: Math.floor(Math.random() * 50) - 15
      },
      engagement: {
        profileViews: Math.floor(Math.random() * 500) + 50,
        favorites: Math.floor(Math.random() * 100) + 10,
        shares: Math.floor(Math.random() * 50) + 5,
        comments: Math.floor(Math.random() * 30) + 2
      },
      conversion: {
        viewToFavorite: Math.floor(Math.random() * 20) + 5,
        favoriteToSale: Math.floor(Math.random() * 15) + 3
      },
      averages: {
        avgSalePrice: Math.floor(Math.random() * 300) + 100,
        avgTimeToSell: Math.floor(Math.random() * 20) + 5,
        avgRating: (3.5 + Math.random() * 1.5).toFixed(1)
      }
    };
  }

  /**
   * Get artist milestones
   */
  async getMilestones(artistAddress) {
    const milestones = [];
    const stats = await this.getOverviewStats(artistAddress);

    // Check each milestone
    if (stats.totalSales >= 1) {
      milestones.push({
        ...this.milestones.get('first_sale'),
        achieved: true,
        achievedAt: new Date(Date.now() - stats.daysActive * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    if (stats.totalSales >= 10) {
      milestones.push({
        ...this.milestones.get('ten_sales'),
        achieved: true,
        achievedAt: new Date(Date.now() - (stats.daysActive / 2) * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    if (stats.totalRevenue >= 1000) {
      milestones.push({
        ...this.milestones.get('thousand_xrp'),
        achieved: true,
        achievedAt: new Date(Date.now() - (stats.daysActive / 3) * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    // Add locked milestones
    const lockedMilestones = ['first_secondary', 'featured_artist'];
    lockedMilestones.forEach(key => {
      milestones.push({
        ...this.milestones.get(key),
        achieved: false,
        progress: Math.floor(Math.random() * 50)
      });
    });

    // Calculate total points
    const totalPoints = milestones
      .filter(m => m.achieved)
      .reduce((sum, m) => sum + m.points, 0);

    return {
      achieved: milestones.filter(m => m.achieved),
      locked: milestones.filter(m => !m.achieved),
      totalPoints,
      nextMilestone: milestones.find(m => !m.achieved)
    };
  }

  /**
   * Get growth trajectory
   */
  async getGrowthTrajectory(artistAddress) {
    const months = 12;
    const trajectory = [];
    
    let cumulativeSales = 0;
    let cumulativeRevenue = 0;

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      const monthlySales = Math.floor(Math.random() * 10) + (months - i);
      const monthlyRevenue = monthlySales * (Math.floor(Math.random() * 200) + 100);
      
      cumulativeSales += monthlySales;
      cumulativeRevenue += monthlyRevenue;

      trajectory.push({
        month: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
        sales: monthlySales,
        revenue: monthlyRevenue,
        cumulativeSales,
        cumulativeRevenue,
        growthRate: i === months - 1 ? 0 : Math.floor(Math.random() * 30) - 5
      });
    }

    // Calculate trend
    const firstHalf = trajectory.slice(0, 6).reduce((sum, t) => sum + t.sales, 0);
    const secondHalf = trajectory.slice(6).reduce((sum, t) => sum + t.sales, 0);
    const trend = secondHalf > firstHalf ? 'upward' : 'stable';

    // Forecast next 3 months
    const forecast = [];
    for (let i = 1; i <= 3; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      forecast.push({
        month: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
        predictedSales: Math.floor(trajectory[trajectory.length - 1].sales * (1 + Math.random() * 0.2)),
        confidence: 0.7 + Math.random() * 0.2
      });
    }

    return {
      historical: trajectory,
      trend,
      growthRate: Math.round(((secondHalf - firstHalf) / firstHalf) * 100),
      forecast
    };
  }

  /**
   * Get peer comparison
   */
  async getPeerComparison(artistAddress) {
    const stats = await this.getOverviewStats(artistAddress);
    const peers = await this.getPeerGroup(stats.currentTier);

    const myMetrics = {
      avgPrice: stats.totalRevenue / stats.totalSales,
      salesPerMonth: stats.totalSales / (stats.daysActive / 30),
      revenuePerMonth: stats.totalRevenue / (stats.daysActive / 30)
    };

    const peerAvg = {
      avgPrice: peers.reduce((sum, p) => sum + p.avgPrice, 0) / peers.length,
      salesPerMonth: peers.reduce((sum, p) => sum + p.salesPerMonth, 0) / peers.length,
      revenuePerMonth: peers.reduce((sum, p) => sum + p.revenuePerMonth, 0) / peers.length
    };

    return {
      peerGroup: stats.currentTier,
      peerCount: peers.length,
      comparisons: [
        {
          metric: 'Average Sale Price',
          myValue: Math.round(myMetrics.avgPrice),
          peerAverage: Math.round(peerAvg.avgPrice),
          percentile: this.calculatePercentile(myMetrics.avgPrice, peers.map(p => p.avgPrice))
        },
        {
          metric: 'Sales per Month',
          myValue: Math.round(myMetrics.salesPerMonth * 10) / 10,
          peerAverage: Math.round(peerAvg.salesPerMonth * 10) / 10,
          percentile: this.calculatePercentile(myMetrics.salesPerMonth, peers.map(p => p.salesPerMonth))
        },
        {
          metric: 'Revenue per Month',
          myValue: Math.round(myMetrics.revenuePerMonth),
          peerAverage: Math.round(peerAvg.revenuePerMonth),
          percentile: this.calculatePercentile(myMetrics.revenuePerMonth, peers.map(p => p.revenuePerMonth))
        }
      ],
      ranking: {
        overall: Math.floor(Math.random() * 50) + 1,
        inTier: Math.floor(Math.random() * 20) + 1
      }
    };
  }

  /**
   * Generate career recommendations
   */
  generateRecommendations(dashboard) {
    const recommendations = [];

    // Based on career stage
    if (dashboard.overview.currentTier === 'emerging') {
      recommendations.push({
        category: 'growth',
        priority: 'high',
        title: 'Build Your Portfolio',
        description: 'Create 5-10 high-quality pieces to establish your presence',
        action: 'Create Collection',
        impact: 'Increase visibility by 40%'
      });
    }

    // Based on performance
    if (dashboard.performanceMetrics?.conversion?.viewToFavorite < 10) {
      recommendations.push({
        category: 'engagement',
        priority: 'medium',
        title: 'Improve Artwork Presentation',
        description: 'Add detailed descriptions and high-quality images',
        action: 'Update Listings',
        impact: 'Increase favorites by 25%'
      });
    }

    // Based on milestones
    const lockedMilestones = dashboard.milestones.locked;
    if (lockedMilestones.length > 0) {
      const nextMilestone = lockedMilestones[0];
      recommendations.push({
        category: 'milestone',
        priority: 'medium',
        title: `Unlock: ${nextMilestone.name}`,
        description: nextMilestone.description,
        action: 'View Requirements',
        impact: `Earn ${nextMilestone.points} reputation points`
      });
    }

    // General recommendations
    recommendations.push({
      category: 'network',
      priority: 'low',
      title: 'Connect with Collectors',
      description: 'Engage with buyers through comments and updates',
      action: 'View Community',
      impact: 'Build lasting relationships'
    });

    return recommendations;
  }

  /**
   * Helper methods
   */

  async generateCareerTimeline(artistAddress) {
    return [
      {
        date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        event: 'Joined Indigena Market',
        type: 'milestone',
        impact: 'high'
      },
      {
        date: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString(),
        event: 'First Sale',
        type: 'sale',
        impact: 'high'
      },
      {
        date: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
        event: 'Reached 10 Sales',
        type: 'milestone',
        impact: 'medium'
      },
      {
        date: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
        event: 'Verified Artist Status',
        type: 'verification',
        impact: 'high'
      }
    ];
  }

  async calculateProgressionRate(artistAddress) {
    return {
      salesPerMonth: Math.floor(Math.random() * 5) + 1,
      revenueGrowth: Math.floor(Math.random() * 30) + 5,
      tierProgression: 'on_track', // ahead, on_track, behind
      estimatedNextTier: '6 months'
    };
  }

  async getPeerGroup(tier) {
    // Generate mock peer data
    return Array.from({ length: 20 }, () => ({
      avgPrice: Math.floor(Math.random() * 300) + 100,
      salesPerMonth: Math.random() * 5 + 0.5,
      revenuePerMonth: Math.floor(Math.random() * 1000) + 200
    }));
  }

  calculatePercentile(value, peerValues) {
    const sorted = peerValues.sort((a, b) => a - b);
    const index = sorted.findIndex(v => v >= value);
    return Math.round((index / sorted.length) * 100);
  }

  /**
   * Get artist leaderboard
   */
  async getLeaderboard(category = 'overall', limit = 10) {
    const artists = Array.from({ length: limit }, (_, i) => ({
      rank: i + 1,
      artist: `Artist ${i + 1}`,
      address: `r${Math.random().toString(36).substring(2, 15)}`,
      tier: ['master', 'established', 'developing', 'emerging'][Math.floor(Math.random() * 4)],
      totalSales: Math.floor(Math.random() * 500) + 10,
      totalRevenue: Math.floor(Math.random() * 50000) + 1000,
      reputationScore: Math.floor(Math.random() * 40) + 60,
      growthRate: Math.floor(Math.random() * 50) + 5
    }));

    // Sort by category
    if (category === 'sales') {
      artists.sort((a, b) => b.totalSales - a.totalSales);
    } else if (category === 'revenue') {
      artists.sort((a, b) => b.totalRevenue - a.totalRevenue);
    } else if (category === 'growth') {
      artists.sort((a, b) => b.growthRate - a.growthRate);
    }

    // Re-rank after sorting
    artists.forEach((artist, index) => {
      artist.rank = index + 1;
    });

    return {
      category,
      generatedAt: new Date().toISOString(),
      artists
    };
  }

  /**
   * Get artist achievements
   */
  async getAchievements(artistAddress) {
    const allAchievements = Array.from(this.milestones.entries()).map(([key, data]) => ({
      id: key,
      ...data,
      achieved: Math.random() > 0.5,
      achievedAt: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString() : null,
      progress: Math.floor(Math.random() * 100)
    }));

    return {
      total: allAchievements.length,
      achieved: allAchievements.filter(a => a.achieved).length,
      totalPoints: allAchievements.filter(a => a.achieved).reduce((sum, a) => sum + a.points, 0),
      achievements: allAchievements
    };
  }
}

module.exports = new ArtistCareerService();
