/**
 * PILLAR 9: ADVOCACY & LEGAL
 * Protection and power marketplace
 */

class AdvocacyLegalService {
  constructor() {
    this.cases = new Map();
    this.professionals = new Map();
    this.defenseFund = new Map();
    this.alerts = new Map();
  }

  async createDefenseCase(creator, caseData) {
    const defenseCase = {
      caseId: this.generateId('CASE'),
      pillar: 'advocacy_legal',
      creator: creator,
      title: caseData.title,
      description: caseData.description,
      type: caseData.type, // 'land_rights', 'cultural_preservation', 'environmental', 'human_rights', 'sovereignty'
      urgency: caseData.urgency || 'high', // 'critical', 'high', 'medium', 'low'
      beneficiary: {
        type: caseData.beneficiaryType, // 'individual', 'community', 'nation', 'organization'
        name: caseData.beneficiaryName,
        description: caseData.beneficiaryDescription,
        nation: caseData.nation
      },
      legal: {
        status: caseData.legalStatus || 'active', // 'active', 'pending', 'resolved', 'appeal'
        jurisdiction: caseData.jurisdiction,
        representation: caseData.representation || null,
        documents: caseData.documents || []
      },
      funding: {
        goal: caseData.fundingGoal,
        raised: 0,
        currency: caseData.currency || 'INDI',
        contributors: 0
      },
      timeline: caseData.timeline || [],
      updates: [],
      status: 'active',
      createdAt: new Date().toISOString()
    };

    this.cases.set(defenseCase.caseId, defenseCase);

    return {
      success: true,
      caseId: defenseCase.caseId,
      title: defenseCase.title,
      fundingGoal: defenseCase.funding.goal
    };
  }

  async contributeToDefense(contributor, caseId, contributionData) {
    const defenseCase = this.cases.get(caseId);
    if (!defenseCase) throw new Error('Case not found');

    const contribution = {
      contributionId: this.generateId('DEF'),
      caseId: caseId,
      contributor: contributor,
      amount: contributionData.amount,
      currency: contributionData.currency || 'INDI',
      message: contributionData.message || null,
      anonymous: contributionData.anonymous || false,
      txId: contributionData.txId,
      createdAt: new Date().toISOString()
    };

    defenseCase.funding.raised += contribution.amount;
    defenseCase.funding.contributors++;

    return {
      success: true,
      contributionId: contribution.contributionId,
      case: defenseCase.title,
      totalRaised: defenseCase.funding.raised,
      percentFunded: Math.round((defenseCase.funding.raised / defenseCase.funding.goal) * 100)
    };
  }

  async registerProfessional(professional, profileData) {
    const profile = {
      profileId: this.generateId('PRO'),
      pillar: 'advocacy_legal',
      professional: professional,
      name: profileData.name,
      type: profileData.type, // 'attorney', 'paralegal', 'advocate', 'consultant', 'expert_witness'
      specializations: profileData.specializations || [],
      jurisdictions: profileData.jurisdictions || [],
      experience: {
        years: profileData.yearsExperience,
        cases: profileData.casesHandled || [],
        education: profileData.education || []
      },
      services: {
        proBono: profileData.proBono || false,
        proBonoHours: profileData.proBonoHours || 0,
        slidingScale: profileData.slidingScale || false,
        consultationRate: profileData.consultationRate || null
      },
      availability: {
        status: profileData.availability || 'available',
        nextAvailable: profileData.nextAvailable || null
      },
      verification: {
        barNumber: profileData.barNumber || null,
        licenses: profileData.licenses || [],
        verified: false
      },
      stats: {
        casesAssisted: 0,
        communitiesServed: 0,
        rating: 0
      },
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    this.professionals.set(profile.profileId, profile);

    return {
      success: true,
      profileId: profile.profileId,
      status: profile.status,
      message: 'Profile submitted for verification'
    };
  }

  async createPolicyAlert(creator, alertData) {
    const alert = {
      alertId: this.generateId('ALERT'),
      pillar: 'advocacy_legal',
      creator: creator,
      title: alertData.title,
      description: alertData.description,
      type: alertData.type, // 'legislation', 'court_decision', 'regulatory', 'opportunity'
      urgency: alertData.urgency || 'medium',
      scope: {
        nations: alertData.affectedNations || [],
        regions: alertData.affectedRegions || [],
        topics: alertData.topics || []
      },
      action: {
        required: alertData.actionRequired || false,
        deadline: alertData.deadline || null,
        instructions: alertData.actionInstructions || null,
        contact: alertData.contactInfo || null
      },
      resources: {
        documents: alertData.documents || [],
        links: alertData.links || [],
        contacts: alertData.contacts || []
      },
      status: 'active',
      createdAt: new Date().toISOString()
    };

    this.alerts.set(alert.alertId, alert);

    return {
      success: true,
      alertId: alert.alertId,
      title: alert.title,
      urgency: alert.urgency
    };
  }

  async requestAssistance(requester, requestData) {
    const request = {
      requestId: this.generateId('REQ'),
      pillar: 'advocacy_legal',
      requester: requester,
      type: requestData.type, // 'legal_representation', 'consultation', 'document_review', 'policy_research'
      description: requestData.description,
      urgency: requestData.urgency || 'medium',
      jurisdiction: requestData.jurisdiction,
      nation: requestData.nation,
      budget: {
        available: requestData.budgetAvailable || false,
        amount: requestData.budgetAmount || null,
        currency: requestData.currency || 'INDI'
      },
      proBonoEligible: requestData.proBonoEligible || false,
      status: 'pending',
      matches: [],
      createdAt: new Date().toISOString()
    };

    // Find matching professionals
    const matches = Array.from(this.professionals.values())
      .filter(p => 
        p.status === 'active' &&
        p.specializations.some(s => requestData.type.includes(s)) &&
        p.jurisdictions.includes(requestData.jurisdiction)
      )
      .map(p => ({
        profileId: p.profileId,
        name: p.name,
        type: p.type,
        proBono: p.services.proBono,
        rating: p.stats.rating
      }));

    request.matches = matches;

    return {
      success: true,
      requestId: request.requestId,
      matchesFound: matches.length,
      professionals: matches.slice(0, 5)
    };
  }

  async getDefenseCases(filters = {}) {
    let cases = Array.from(this.cases.values())
      .filter(c => c.status === 'active');

    if (filters.type) cases = cases.filter(c => c.type === filters.type);
    if (filters.nation) cases = cases.filter(c => c.beneficiary.nation === filters.nation);
    if (filters.urgency) cases = cases.filter(c => c.urgency === filters.urgency);

    return cases.map(c => ({
      caseId: c.caseId,
      title: c.title,
      type: c.type,
      urgency: c.urgency,
      beneficiary: c.beneficiary.name,
      nation: c.beneficiary.nation,
      goal: c.funding.goal,
      raised: c.funding.raised,
      percentFunded: Math.round((c.funding.raised / c.funding.goal) * 100)
    }));
  }

  async getProfessionals(filters = {}) {
    let professionals = Array.from(this.professionals.values())
      .filter(p => p.status === 'active');

    if (filters.type) professionals = professionals.filter(p => p.type === filters.type);
    if (filters.specialization) {
      professionals = professionals.filter(p => 
        p.specializations.includes(filters.specialization)
      );
    }
    if (filters.proBono) professionals = professionals.filter(p => p.services.proBono);
    if (filters.jurisdiction) {
      professionals = professionals.filter(p => 
        p.jurisdictions.includes(filters.jurisdiction)
      );
    }

    return professionals.map(p => ({
      profileId: p.profileId,
      name: p.name,
      type: p.type,
      specializations: p.specializations,
      proBono: p.services.proBono,
      rating: p.stats.rating,
      availability: p.availability.status
    }));
  }

  async getPolicyAlerts(filters = {}) {
    let alerts = Array.from(this.alerts.values())
      .filter(a => a.status === 'active');

    if (filters.type) alerts = alerts.filter(a => a.type === filters.type);
    if (filters.nation) alerts = alerts.filter(a => a.scope.nations.includes(filters.nation));
    if (filters.urgency) alerts = alerts.filter(a => a.urgency === filters.urgency);

    return alerts.map(a => ({
      alertId: a.alertId,
      title: a.title,
      type: a.type,
      urgency: a.urgency,
      actionRequired: a.action.required,
      deadline: a.action.deadline,
      createdAt: a.createdAt
    }));
  }

  generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new AdvocacyLegalService();
