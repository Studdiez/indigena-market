/**
 * Content Moderation AI Service
 * Screens uploads for culturally inappropriate content and potential appropriation
 */

class ContentModerationService {
  constructor() {
    this.sensitivePatterns = new Map();
    this.culturalGuidelines = new Map();
    this.appropriationIndicators = new Set();
    this.initializeModerationRules();
  }

  initializeModerationRules() {
    // Sacred/Sensitive content by nation
    this.sensitivePatterns.set('navajo', {
      sacredSymbols: ['yei', 'sandpainting', 'medicine_bundle', 'prayer_stick'],
      restrictedPractices: ['ceremonial_sandpainting_commercial'],
      requiresElderApproval: ['religious_ceremony_depiction', 'healing_practice'],
      seasonalRestrictions: ['winter_stories_out_of_season']
    });

    this.sensitivePatterns.set('hopi', {
      sacredSymbols: ['kachina_mask', 'altar', 'prayer_feather', 'ceremonial_room'],
      restrictedPractices: ['kachina_commercial_sale'],
      requiresElderApproval: ['kachina_representation', 'ceremonial_dance'],
      seasonalRestrictions: ['kachina_out_of_ceremonial_season']
    });

    this.sensitivePatterns.set('cherokee', {
      sacredSymbols: ['seven_pointed_star', 'sacred_fire', 'medicine_wheel'],
      restrictedPractices: ['sacred_ceremony_commercialization'],
      requiresElderApproval: ['religious_ritual', 'sacred_site'],
      seasonalRestrictions: []
    });

    // General appropriation indicators
    this.appropriationIndicators = new Set([
      'stereotypical_headdress',
      'generic_tribal_pattern',
      'war_paint_cosmetic',
      'sacred_symbol_fashion',
      'ceremonial_item_decorative',
      'spiritual_practice_commodified',
      'tribal_name_unauthorized_use',
      'traditional_design_mass_produced'
    ]);

    // Cultural guidelines
    this.culturalGuidelines.set('general', {
      respectPrinciples: [
        'Obtain permission for sacred content',
        'Credit the specific nation/tribe',
        'Respect seasonal/ceremonial restrictions',
        'Avoid mixing unrelated cultural elements',
        'Do not commodify spiritual practices'
      ],
      prohibitedContent: [
        'Sacred ceremonies for entertainment',
        'Religious items as fashion accessories',
        'Stereotypical or caricatured depictions',
        'Unauthorized use of tribal names/symbols',
        'Commercialization of spiritual practices'
      ]
    });
  }

  /**
   * Moderate content (image + metadata)
   */
  async moderateContent(contentData) {
    try {
      const {
        imageBuffer,
        metadata,
        artistAddress,
        claimedNation
      } = contentData;

      const result = {
        approved: false,
        status: 'pending_review',
        confidence: 0,
        flags: [],
        warnings: [],
        recommendations: [],
        requiresHumanReview: false,
        reviewPriority: 'low',
        culturalChecks: {},
        timestamp: new Date().toISOString()
      };

      // 1. Visual Content Analysis
      const visualAnalysis = await this.analyzeVisualContent(imageBuffer, claimedNation);
      result.culturalChecks.visual = visualAnalysis;

      // 2. Metadata Analysis
      const metadataAnalysis = this.analyzeMetadata(metadata, claimedNation);
      result.culturalChecks.metadata = metadataAnalysis;

      // 3. Artist Verification Check
      const artistCheck = await this.verifyArtistCulturalConnection(
        artistAddress, 
        claimedNation
      );
      result.culturalChecks.artist = artistCheck;

      // 4. Appropriation Risk Assessment
      const appropriationCheck = this.assessAppropriationRisk(
        visualAnalysis,
        metadataAnalysis,
        artistCheck
      );
      result.culturalChecks.appropriation = appropriationCheck;

      // 5. Sacred Content Detection
      const sacredCheck = this.detectSacredContent(
        visualAnalysis,
        metadataAnalysis,
        claimedNation
      );
      result.culturalChecks.sacred = sacredCheck;

      // Compile flags and warnings
      result.flags = [
        ...visualAnalysis.flags,
        ...metadataAnalysis.flags,
        ...appropriationCheck.flags,
        ...sacredCheck.flags
      ];

      result.warnings = [
        ...visualAnalysis.warnings,
        ...metadataAnalysis.warnings,
        ...appropriationCheck.warnings,
        ...sacredCheck.warnings
      ];

      // Determine approval status
      const decision = this.makeModerationDecision(result);
      result.approved = decision.approved;
      result.status = decision.status;
      result.requiresHumanReview = decision.requiresHumanReview;
      result.reviewPriority = decision.priority;

      // Generate recommendations
      result.recommendations = this.generateRecommendations(result);

      // Calculate overall confidence
      result.confidence = this.calculateConfidence(result.culturalChecks);

      return result;
    } catch (error) {
      console.error('Content moderation error:', error);
      throw error;
    }
  }

  /**
   * Analyze visual content
   */
  async analyzeVisualContent(imageBuffer, claimedNation) {
    const analysis = {
      score: 100,
      flags: [],
      warnings: [],
      detectedElements: [],
      confidence: 0
    };

    // In production, use computer vision ML models
    // For now, simulate detection based on metadata

    // Check for appropriation indicators
    const detectedIndicators = Array.from(this.appropriationIndicators).filter(() => 
      Math.random() < 0.05 // 5% chance of detection for demo
    );

    detectedIndicators.forEach(indicator => {
      analysis.flags.push({
        type: 'appropriation_risk',
        severity: 'high',
        code: indicator,
        description: this.getFlagDescription(indicator)
      });
      analysis.score -= 20;
    });

    // Check for sacred symbols if nation is specified
    if (claimedNation && this.sensitivePatterns.has(claimedNation.toLowerCase())) {
      const patterns = this.sensitivePatterns.get(claimedNation.toLowerCase());
      
      // Simulate sacred symbol detection
      const detectedSacred = patterns.sacredSymbols.filter(() =>
        Math.random() < 0.1 // 10% chance
      );

      detectedSacred.forEach(symbol => {
        analysis.warnings.push({
          type: 'sacred_symbol_detected',
          severity: 'medium',
          symbol: symbol,
          description: `Sacred symbol "${symbol}" detected - may require elder review`
        });
      });
    }

    analysis.confidence = Math.random() * 0.3 + 0.7;
    analysis.score = Math.max(0, analysis.score);

    return analysis;
  }

  /**
   * Analyze metadata for issues
   */
  analyzeMetadata(metadata, claimedNation) {
    const analysis = {
      score: 100,
      flags: [],
      warnings: [],
      issues: [],
      confidence: 0
    };

    // Check for appropriate cultural attribution
    if (!metadata.nation && !metadata.tribe) {
      analysis.warnings.push({
        type: 'missing_attribution',
        severity: 'medium',
        description: 'No specific nation/tribe attributed - consider adding for cultural accuracy'
      });
      analysis.score -= 10;
    }

    // Check for respectful language
    const disrespectfulTerms = ['primitive', 'savage', 'redskin', 'squaw', 'chief_fake'];
    const textToCheck = JSON.stringify(metadata).toLowerCase();
    
    disrespectfulTerms.forEach(term => {
      if (textToCheck.includes(term)) {
        analysis.flags.push({
          type: 'disrespectful_language',
          severity: 'high',
          term: term,
          description: `Disrespectful term "${term}" detected`
        });
        analysis.score -= 30;
      }
    });

    // Check for generic/stereotypical descriptions
    const genericTerms = ['generic indian', 'native american style', 'tribal chic'];
    genericTerms.forEach(term => {
      if (textToCheck.includes(term)) {
        analysis.warnings.push({
          type: 'generic_description',
          severity: 'medium',
          description: 'Generic description may indicate cultural appropriation'
        });
        analysis.score -= 15;
      }
    });

    // Check sacred status claims
    if (metadata.sacredStatus === 'sacred' && !metadata.elderVerified) {
      analysis.flags.push({
        type: 'unverified_sacred_claim',
        severity: 'high',
        description: 'Item claimed as sacred but not verified by elder'
      });
      analysis.score -= 25;
    }

    analysis.confidence = 0.85;
    analysis.score = Math.max(0, analysis.score);

    return analysis;
  }

  /**
   * Verify artist's cultural connection
   */
  async verifyArtistCulturalConnection(artistAddress, claimedNation) {
    const verification = {
      verified: false,
      connectionType: 'unknown',
      confidence: 0,
      flags: [],
      warnings: []
    };

    // In production, check artist profile database
    // For now, simulate verification

    const verificationStatus = Math.random();
    
    if (verificationStatus > 0.7) {
      verification.verified = true;
      verification.connectionType = 'enrolled_member';
      verification.confidence = 0.9;
    } else if (verificationStatus > 0.4) {
      verification.verified = true;
      verification.connectionType = 'descendant';
      verification.confidence = 0.7;
      verification.warnings.push({
        type: 'descendant_status',
        description: 'Artist is descendant but may not be enrolled member'
      });
    } else {
      verification.verified = false;
      verification.connectionType = 'unverified';
      verification.confidence = 0.3;
      verification.flags.push({
        type: 'unverified_artist',
        severity: 'high',
        description: 'Unable to verify artist\'s cultural connection to claimed nation'
      });
    }

    return verification;
  }

  /**
   * Assess appropriation risk
   */
  assessAppropriationRisk(visualAnalysis, metadataAnalysis, artistCheck) {
    const assessment = {
      riskLevel: 'low',
      score: 100,
      flags: [],
      warnings: [],
      factors: []
    };

    // Factor 1: Artist verification
    if (!artistCheck.verified) {
      assessment.score -= 30;
      assessment.factors.push({
        factor: 'unverified_artist',
        impact: -30,
        description: 'Artist cultural connection unverified'
      });
    }

    // Factor 2: Visual flags
    const visualFlagCount = visualAnalysis.flags.length;
    if (visualFlagCount > 0) {
      const impact = visualFlagCount * 15;
      assessment.score -= impact;
      assessment.factors.push({
        factor: 'visual_flags',
        impact: -impact,
        description: `${visualFlagCount} visual appropriation indicators detected`
      });
    }

    // Factor 3: Metadata issues
    const metadataIssueCount = metadataAnalysis.flags.length;
    if (metadataIssueCount > 0) {
      const impact = metadataIssueCount * 20;
      assessment.score -= impact;
      assessment.factors.push({
        factor: 'metadata_issues',
        impact: -impact,
        description: `${metadataIssueCount} metadata issues detected`
      });
    }

    // Determine risk level
    if (assessment.score < 40) {
      assessment.riskLevel = 'high';
    } else if (assessment.score < 70) {
      assessment.riskLevel = 'medium';
    } else {
      assessment.riskLevel = 'low';
    }

    assessment.score = Math.max(0, assessment.score);

    return assessment;
  }

  /**
   * Detect sacred content
   */
  detectSacredContent(visualAnalysis, metadataAnalysis, claimedNation) {
    const detection = {
      containsSacredContent: false,
      sacredElements: [],
      requiresElderReview: false,
      seasonalRestrictions: [],
      flags: [],
      warnings: []
    };

    // Check metadata for sacred claims
    if (metadataAnalysis.flags.some(f => f.type === 'unverified_sacred_claim')) {
      detection.containsSacredContent = true;
      detection.requiresElderReview = true;
    }

    // Check for sacred symbols in visual analysis
    const sacredWarnings = visualAnalysis.warnings.filter(
      w => w.type === 'sacred_symbol_detected'
    );

    if (sacredWarnings.length > 0) {
      detection.containsSacredContent = true;
      detection.sacredElements = sacredWarnings.map(w => w.symbol);
      detection.requiresElderReview = true;
    }

    // Check seasonal restrictions
    if (claimedNation && this.sensitivePatterns.has(claimedNation.toLowerCase())) {
      const patterns = this.sensitivePatterns.get(claimedNation.toLowerCase());
      
      // Check if any sacred elements have seasonal restrictions
      detection.sacredElements.forEach(element => {
        if (patterns.seasonalRestrictions.some(r => r.includes(element))) {
          detection.seasonalRestrictions.push({
            element,
            restriction: 'Seasonal use only'
          });
        }
      });
    }

    if (detection.requiresElderReview) {
      detection.warnings.push({
        type: 'elder_review_required',
        severity: 'high',
        description: 'Content contains sacred elements and requires elder review'
      });
    }

    return detection;
  }

  /**
   * Make final moderation decision
   */
  makeModerationDecision(result) {
    const { flags, warnings, culturalChecks } = result;
    
    const highSeverityFlags = flags.filter(f => f.severity === 'high');
    const mediumSeverityFlags = flags.filter(f => f.severity === 'medium');

    // Auto-reject conditions
    if (highSeverityFlags.length >= 2) {
      return {
        approved: false,
        status: 'rejected',
        requiresHumanReview: false,
        priority: 'high'
      };
    }

    // Requires human review conditions
    if (highSeverityFlags.length === 1 || 
        mediumSeverityFlags.length >= 3 ||
        culturalChecks.sacred?.requiresElderReview ||
        culturalChecks.appropriation?.riskLevel === 'high') {
      return {
        approved: false,
        status: 'pending_review',
        requiresHumanReview: true,
        priority: highSeverityFlags.length > 0 ? 'high' : 'medium'
      };
    }

    // Auto-approve with warnings
    if (warnings.length > 0) {
      return {
        approved: true,
        status: 'approved_with_warnings',
        requiresHumanReview: false,
        priority: 'low'
      };
    }

    // Clean approval
    return {
      approved: true,
      status: 'approved',
      requiresHumanReview: false,
      priority: 'low'
    };
  }

  /**
   * Generate recommendations
   */
  generateRecommendations(result) {
    const recommendations = [];

    if (result.culturalChecks.artist?.verified === false) {
      recommendations.push({
        type: 'artist_verification',
        priority: 'high',
        description: 'Complete cultural heritage verification process'
      });
    }

    if (result.culturalChecks.sacred?.requiresElderReview) {
      recommendations.push({
        type: 'elder_consultation',
        priority: 'high',
        description: 'Consult with cultural elders regarding sacred content'
      });
    }

    if (result.warnings.some(w => w.type === 'missing_attribution')) {
      recommendations.push({
        type: 'add_attribution',
        priority: 'medium',
        description: 'Add specific nation/tribe attribution for cultural accuracy'
      });
    }

    if (result.culturalChecks.appropriation?.riskLevel === 'medium') {
      recommendations.push({
        type: 'cultural_training',
        priority: 'medium',
        description: 'Complete cultural sensitivity training'
      });
    }

    return recommendations;
  }

  /**
   * Calculate overall confidence
   */
  calculateConfidence(checks) {
    const confidences = [
      checks.visual?.confidence || 0,
      checks.metadata?.confidence || 0,
      checks.artist?.confidence || 0
    ];
    
    return Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length * 100);
  }

  getFlagDescription(code) {
    const descriptions = {
      'stereotypical_headdress': 'Depiction of stereotypical headdress without context',
      'generic_tribal_pattern': 'Generic pattern not specific to any nation',
      'war_paint_cosmetic': 'War paint used as cosmetic/fashion',
      'sacred_symbol_fashion': 'Sacred symbol used in fashion context',
      'ceremonial_item_decorative': 'Ceremonial item used as decoration',
      'spiritual_practice_commodified': 'Spiritual practice commodified',
      'tribal_name_unauthorized_use': 'Tribal name used without authorization',
      'traditional_design_mass_produced': 'Traditional design appears mass-produced'
    };
    return descriptions[code] || code;
  }

  /**
   * Get moderation guidelines
   */
  getGuidelines(nation = null) {
    if (nation && this.sensitivePatterns.has(nation.toLowerCase())) {
      return {
        general: this.culturalGuidelines.get('general'),
        specific: this.sensitivePatterns.get(nation.toLowerCase())
      };
    }
    return { general: this.culturalGuidelines.get('general') };
  }
}

module.exports = new ContentModerationService();
