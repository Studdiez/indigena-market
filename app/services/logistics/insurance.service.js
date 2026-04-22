/**
 * Insurance API Service
 * Artwork and shipment insurance
 */

class InsuranceService {
  constructor() {
    this.policies = new Map();
    this.claims = new Map();
    this.providers = new Map();
    this.initializeProviders();
  }

  initializeProviders() {
    // Insurance providers
    this.providers.set('indigena_protect', {
      name: 'Indigena Protect',
      type: 'platform',
      coverageTypes: ['shipping', 'storage', 'exhibition'],
      maxCoverage: 1000000, // $1M
      deductible: 0,
      premiumRate: 0.015 // 1.5%
    });

    this.providers.set('fine_art_group', {
      name: 'Fine Art Group',
      type: 'specialist',
      coverageTypes: ['shipping', 'storage', 'exhibition', 'title'],
      maxCoverage: 5000000,
      deductible: 250,
      premiumRate: 0.012
    });

    this.providers.set('hiscox', {
      name: 'Hiscox Art Insurance',
      type: 'commercial',
      coverageTypes: ['shipping', 'storage', 'exhibition', 'restoration'],
      maxCoverage: 10000000,
      deductible: 500,
      premiumRate: 0.018
    });
  }

  /**
   * Get insurance quote
   */
  async getQuote(quoteData) {
    try {
      const {
        item,
        coverageType, // 'shipping', 'storage', 'exhibition', 'comprehensive'
        duration,
        destination,
        declaredValue
      } = quoteData;

      const quotes = [];

      for (const [providerId, provider] of this.providers) {
        if (!provider.coverageTypes.includes(coverageType)) continue;
        if (declaredValue > provider.maxCoverage) continue;

        // Calculate premium
        const basePremium = declaredValue * provider.premiumRate;
        const durationMultiplier = this.getDurationMultiplier(duration);
        const riskMultiplier = this.getRiskMultiplier(item, destination);
        
        const premium = basePremium * durationMultiplier * riskMultiplier;

        quotes.push({
          provider: providerId,
          providerName: provider.name,
          type: provider.type,
          coverage: {
            type: coverageType,
            amount: declaredValue,
            deductible: provider.deductible
          },
          premium: Math.round(premium * 100) / 100,
          currency: 'USD',
          duration: duration,
          features: this.getCoverageFeatures(providerId, coverageType),
          exclusions: this.getExclusions(coverageType)
        });
      }

      // Sort by premium
      quotes.sort((a, b) => a.premium - b.premium);

      return {
        success: true,
        item: item,
        declaredValue: declaredValue,
        quotes: quotes,
        recommended: quotes[0]
      };
    } catch (error) {
      console.error('Get quote error:', error);
      throw error;
    }
  }

  /**
   * Purchase insurance policy
   */
  async purchasePolicy(policyData) {
    try {
      const {
        owner,
        item,
        provider,
        coverageType,
        coverageAmount,
        premium,
        duration,
        shipmentId,
        beneficiary
      } = policyData;

      const policy = {
        policyId: this.generatePolicyId(),
        owner: owner,
        item: {
          name: item.name,
          description: item.description,
          nftId: item.nftId || null,
          artist: item.artist,
          year: item.year,
          medium: item.medium,
          dimensions: item.dimensions
        },
        provider: provider,
        coverage: {
          type: coverageType,
          amount: coverageAmount,
          deductible: policyData.deductible || 0
        },
        premium: {
          amount: premium,
          currency: 'USD',
          paid: false,
          paidAt: null
        },
        duration: {
          startDate: new Date().toISOString(),
          endDate: this.calculateEndDate(duration),
          type: duration
        },
        shipmentId: shipmentId || null,
        beneficiary: beneficiary || owner,
        status: 'pending', // 'pending', 'active', 'expired', 'cancelled', 'claimed'
        conditions: this.getPolicyConditions(coverageType),
        createdAt: new Date().toISOString(),
        activatedAt: null,
        claims: []
      };

      this.policies.set(policy.policyId, policy);

      return {
        success: true,
        policyId: policy.policyId,
        status: 'pending',
        premium: premium,
        message: 'Policy created. Payment required to activate.'
      };
    } catch (error) {
      console.error('Purchase policy error:', error);
      throw error;
    }
  }

  /**
   * Activate policy after payment
   */
  async activatePolicy(policyId, paymentConfirmation) {
    try {
      const policy = this.policies.get(policyId);
      if (!policy) throw new Error('Policy not found');
      if (policy.status !== 'pending') throw new Error('Policy not in pending state');

      policy.status = 'active';
      policy.activatedAt = new Date().toISOString();
      policy.premium.paid = true;
      policy.premium.paidAt = new Date().toISOString();
      policy.premium.txId = paymentConfirmation.txId;

      return {
        success: true,
        policyId: policyId,
        status: 'active',
        coverageStart: policy.duration.startDate,
        coverageEnd: policy.duration.endDate
      };
    } catch (error) {
      console.error('Activate policy error:', error);
      throw error;
    }
  }

  /**
   * File insurance claim
   */
  async fileClaim(policyId, claimData) {
    try {
      const policy = this.policies.get(policyId);
      if (!policy) throw new Error('Policy not found');
      if (policy.status !== 'active') throw new Error('Policy not active');

      const {
        claimant,
        incidentType, // 'damage', 'loss', 'theft', 'mysterious_disappearance'
        incidentDate,
        description,
        evidence,
        estimatedLoss,
        policeReport
      } = claimData;

      const claim = {
        claimId: this.generateClaimId(),
        policyId: policyId,
        claimant: claimant,
        incident: {
          type: incidentType,
          date: incidentDate,
          description: description,
          location: claimData.location
        },
        evidence: evidence || [],
        estimatedLoss: estimatedLoss,
        policeReport: policeReport || null,
        status: 'submitted', // 'submitted', 'under_review', 'approved', 'rejected', 'paid'
        submittedAt: new Date().toISOString(),
        reviewedAt: null,
        reviewer: null,
        decision: null,
        payout: null
      };

      this.claims.set(claim.claimId, claim);
      policy.claims.push(claim.claimId);

      return {
        success: true,
        claimId: claim.claimId,
        status: 'submitted',
        message: 'Claim submitted successfully. Review typically takes 5-7 business days.'
      };
    } catch (error) {
      console.error('File claim error:', error);
      throw error;
    }
  }

  /**
   * Review and process claim
   */
  async reviewClaim(claimId, reviewer, decision) {
    try {
      const claim = this.claims.get(claimId);
      if (!claim) throw new Error('Claim not found');

      const policy = this.policies.get(claim.policyId);

      claim.status = decision.approved ? 'approved' : 'rejected';
      claim.reviewedAt = new Date().toISOString();
      claim.reviewer = reviewer;
      claim.decision = {
        approved: decision.approved,
        reasoning: decision.reasoning,
        payoutAmount: decision.payoutAmount || 0,
        deductibleApplied: policy.coverage.deductible
      };

      if (decision.approved) {
        claim.payout = {
          amount: decision.payoutAmount,
          status: 'pending',
          processedAt: null,
          txId: null
        };
      }

      return {
        success: true,
        claimId: claimId,
        status: claim.status,
        payout: claim.payout
      };
    } catch (error) {
      console.error('Review claim error:', error);
      throw error;
    }
  }

  /**
   * Process claim payout
   */
  async processPayout(claimId) {
    try {
      const claim = this.claims.get(claimId);
      if (!claim) throw new Error('Claim not found');
      if (claim.status !== 'approved') throw new Error('Claim not approved');

      const policy = this.policies.get(claim.policyId);

      // In production: Process actual payment
      claim.payout.status = 'paid';
      claim.payout.processedAt = new Date().toISOString();
      claim.payout.txId = `PAY-${Date.now()}`;

      policy.status = 'claimed';

      return {
        success: true,
        claimId: claimId,
        payoutAmount: claim.payout.amount,
        processedAt: claim.payout.processedAt,
        txId: claim.payout.txId
      };
    } catch (error) {
      console.error('Process payout error:', error);
      throw error;
    }
  }

  /**
   * Get policy details
   */
  async getPolicy(policyId, requester) {
    const policy = this.policies.get(policyId);
    if (!policy) throw new Error('Policy not found');
    if (policy.owner !== requester && policy.beneficiary !== requester) {
      throw new Error('Not authorized');
    }

    const claims = policy.claims.map(id => {
      const claim = this.claims.get(id);
      return claim ? {
        claimId: claim.claimId,
        status: claim.status,
        incidentType: claim.incident.type,
        submittedAt: claim.submittedAt,
        payout: claim.payout
      } : null;
    }).filter(c => c);

    return {
      policyId: policy.policyId,
      item: policy.item,
      provider: policy.provider,
      coverage: policy.coverage,
      premium: policy.premium,
      duration: policy.duration,
      status: policy.status,
      claims: claims
    };
  }

  /**
   * Get user's policies
   */
  async getUserPolicies(address) {
    const policies = Array.from(this.policies.values())
      .filter(p => p.owner === address)
      .map(p => ({
        policyId: p.policyId,
        item: p.item.name,
        coverageType: p.coverage.type,
        coverageAmount: p.coverage.amount,
        status: p.status,
        endDate: p.duration.endDate,
        hasActiveClaim: p.claims.some(id => {
          const claim = this.claims.get(id);
          return claim && ['submitted', 'under_review'].includes(claim.status);
        })
      }));

    return { policies, total: policies.length };
  }

  /**
   * Extend policy
   */
  async extendPolicy(policyId, extensionData) {
    try {
      const policy = this.policies.get(policyId);
      if (!policy) throw new Error('Policy not found');
      if (policy.status !== 'active') throw new Error('Policy not active');

      const { additionalDuration, additionalPremium } = extensionData;

      // Calculate new end date
      const currentEnd = new Date(policy.duration.endDate);
      currentEnd.setDate(currentEnd.getDate() + this.parseDuration(additionalDuration));

      policy.duration.endDate = currentEnd.toISOString();
      policy.premium.amount += additionalPremium;

      return {
        success: true,
        policyId: policyId,
        newEndDate: policy.duration.endDate,
        additionalPremium: additionalPremium,
        totalPremium: policy.premium.amount
      };
    } catch (error) {
      console.error('Extend policy error:', error);
      throw error;
    }
  }

  /**
   * Cancel policy
   */
  async cancelPolicy(policyId, owner) {
    try {
      const policy = this.policies.get(policyId);
      if (!policy) throw new Error('Policy not found');
      if (policy.owner !== owner) throw new Error('Not the policy owner');
      if (policy.status !== 'active') throw new Error('Policy not active');

      // Check for claims
      if (policy.claims.length > 0) {
        throw new Error('Cannot cancel policy with active claims');
      }

      policy.status = 'cancelled';
      policy.cancelledAt = new Date().toISOString();

      // Calculate prorated refund
      const daysRemaining = (new Date(policy.duration.endDate) - new Date()) / (1000 * 60 * 60 * 24);
      const totalDays = (new Date(policy.duration.endDate) - new Date(policy.duration.startDate)) / (1000 * 60 * 60 * 24);
      const refundAmount = (policy.premium.amount * (daysRemaining / totalDays)) * 0.8; // 80% refund

      return {
        success: true,
        policyId: policyId,
        status: 'cancelled',
        refundAmount: Math.round(refundAmount * 100) / 100
      };
    } catch (error) {
      console.error('Cancel policy error:', error);
      throw error;
    }
  }

  // Helper methods
  getDurationMultiplier(duration) {
    const multipliers = {
      'single_shipment': 1.0,
      '1_month': 1.5,
      '3_months': 3.0,
      '6_months': 5.0,
      '1_year': 8.0,
      'permanent': 15.0
    };
    return multipliers[duration] || 1.0;
  }

  getRiskMultiplier(item, destination) {
    let multiplier = 1.0;

    // Fragile items
    if (item.fragile) multiplier += 0.2;

    // High value items
    if (item.value > 100000) multiplier += 0.3;
    else if (item.value > 50000) multiplier += 0.2;
    else if (item.value > 10000) multiplier += 0.1;

    // International shipping
    if (destination && destination.international) multiplier += 0.15;

    return multiplier;
  }

  getCoverageFeatures(provider, coverageType) {
    const baseFeatures = [
      'all_risk_coverage',
      'mysterious_disappearance',
      'pair_and_set',
      'restoration_costs'
    ];

    const typeFeatures = {
      'shipping': ['transit_coverage', 'loading_unloading', 'temporary_storage'],
      'storage': ['fire', 'theft', 'water_damage', 'climate_control_failure'],
      'exhibition': ['venue_coverage', 'transit_to_venue', 'public_liability'],
      'comprehensive': ['all_of_above', 'title_insurance', 'authentication_coverage']
    };

    return [...baseFeatures, ...(typeFeatures[coverageType] || [])];
  }

  getExclusions(coverageType) {
    return [
      'wear_and_tear',
      'inherent_vice',
      'war_terrorism',
      'nuclear_risk',
      'government_seizure'
    ];
  }

  getPolicyConditions(coverageType) {
    return {
      appraisalRequired: true,
      securityRequirements: ['alarm', 'climate_control'],
      notificationPeriod: '48_hours',
      subrogation: true
    };
  }

  calculateEndDate(duration) {
    const date = new Date();
    
    switch (duration) {
      case 'single_shipment':
        date.setDate(date.getDate() + 30);
        break;
      case '1_month':
        date.setMonth(date.getMonth() + 1);
        break;
      case '3_months':
        date.setMonth(date.getMonth() + 3);
        break;
      case '6_months':
        date.setMonth(date.getMonth() + 6);
        break;
      case '1_year':
        date.setFullYear(date.getFullYear() + 1);
        break;
      case 'permanent':
        date.setFullYear(date.getFullYear() + 100);
        break;
      default:
        date.setMonth(date.getMonth() + 1);
    }

    return date.toISOString();
  }

  parseDuration(duration) {
    const days = {
      '1_month': 30,
      '3_months': 90,
      '6_months': 180,
      '1_year': 365
    };
    return days[duration] || 30;
  }

  generatePolicyId() {
    return `POL-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  generateClaimId() {
    return `CLM-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new InsuranceService();
