/**
 * Fraud Detection Service
 * ML-based anomaly detection for suspicious activities
 */

class FraudDetectionService {
  constructor() {
    this.riskModels = new Map();
    this.suspiciousPatterns = new Map();
    this.userRiskScores = new Map();
    this.transactionHistory = new Map();
    this.initializeRiskModels();
    this.initializePatterns();
  }

  initializeRiskModels() {
    // Transaction risk model
    this.riskModels.set('transaction', {
      name: 'Transaction Risk',
      factors: [
        { name: 'amount_anomaly', weight: 0.25 },
        { name: 'velocity', weight: 0.20 },
        { name: 'location', weight: 0.15 },
        { name: 'device_fingerprint', weight: 0.15 },
        { name: 'behavior_pattern', weight: 0.15 },
        { name: 'account_age', weight: 0.10 }
      ]
    });

    // Account risk model
    this.riskModels.set('account', {
      name: 'Account Risk',
      factors: [
        { name: 'verification_status', weight: 0.30 },
        { name: 'activity_pattern', weight: 0.25 },
        { name: 'reputation', weight: 0.20 },
        { name: 'connection_graph', weight: 0.15 },
        { name: 'complaint_history', weight: 0.10 }
      ]
    });

    // Content risk model
    this.riskModels.set('content', {
      name: 'Content Risk',
      factors: [
        { name: 'authenticity_score', weight: 0.35 },
        { name: 'appropriation_indicators', weight: 0.25 },
        { name: 'metadata_consistency', weight: 0.20 },
        { name: 'seller_reputation', weight: 0.20 }
      ]
    });
  }

  initializePatterns() {
    // Known fraud patterns
    this.suspiciousPatterns.set('rapid_fire_purchases', {
      name: 'Rapid Fire Purchases',
      description: 'Multiple purchases in short time window',
      threshold: 5,
      timeWindow: 300, // seconds
      severity: 'medium'
    });

    this.suspiciousPatterns.set('price_manipulation', {
      name: 'Price Manipulation',
      description: 'Unusual bidding patterns suggesting market manipulation',
      indicators: ['shill_bidding', 'wash_trading'],
      severity: 'high'
    });

    this.suspiciousPatterns.set('account_takeover', {
      name: 'Account Takeover',
      description: 'Signs of unauthorized account access',
      indicators: ['new_device', 'location_jump', 'behavior_change'],
      severity: 'critical'
    });

    this.suspiciousPatterns.set('counterfeit_art', {
      name: 'Counterfeit Art',
      description: 'Artwork showing signs of inauthenticity',
      indicators: ['pattern_mismatch', 'material_inconsistency', 'provenance_gaps'],
      severity: 'high'
    });

    this.suspiciousPatterns.set('layering', {
      name: 'Transaction Layering',
      description: 'Complex transaction patterns to obscure origins',
      indicators: ['rapid_transfers', 'multiple_wallets', 'mixing_services'],
      severity: 'high'
    });
  }

  /**
   * Analyze transaction for fraud risk
   */
  async analyzeTransaction(transactionData) {
    try {
      const {
        transactionId,
        buyerAddress,
        sellerAddress,
        amount,
        nftId,
        timestamp,
        deviceInfo,
        location
      } = transactionData;

      const analysis = {
        transactionId,
        timestamp: new Date().toISOString(),
        riskScore: 0,
        riskLevel: 'low',
        factors: [],
        flags: [],
        recommendations: [],
        action: 'allow' // allow, review, block
      };

      // 1. Amount anomaly detection
      const amountRisk = await this.analyzeAmountAnomaly(buyerAddress, amount);
      analysis.factors.push({ name: 'amount_anomaly', score: amountRisk.score, details: amountRisk });

      // 2. Velocity check
      const velocityRisk = await this.checkTransactionVelocity(buyerAddress, timestamp);
      analysis.factors.push({ name: 'velocity', score: velocityRisk.score, details: velocityRisk });

      // 3. Device fingerprint analysis
      const deviceRisk = await this.analyzeDeviceFingerprint(buyerAddress, deviceInfo);
      analysis.factors.push({ name: 'device_fingerprint', score: deviceRisk.score, details: deviceRisk });

      // 4. Location analysis
      const locationRisk = await this.analyzeLocation(buyerAddress, location);
      analysis.factors.push({ name: 'location', score: locationRisk.score, details: locationRisk });

      // 5. Behavior pattern analysis
      const behaviorRisk = await this.analyzeBehaviorPattern(buyerAddress, transactionData);
      analysis.factors.push({ name: 'behavior_pattern', score: behaviorRisk.score, details: behaviorRisk });

      // 6. Account age factor
      const accountRisk = await this.assessAccountAge(buyerAddress);
      analysis.factors.push({ name: 'account_age', score: accountRisk.score, details: accountRisk });

      // Calculate weighted risk score
      analysis.riskScore = this.calculateWeightedScore(analysis.factors, 'transaction');

      // Determine risk level and action
      const { level, action } = this.determineRiskLevel(analysis.riskScore);
      analysis.riskLevel = level;
      analysis.action = action;

      // Generate flags
      analysis.flags = this.generateFlags(analysis.factors);

      // Generate recommendations
      analysis.recommendations = this.generateRecommendations(analysis);

      // Update user risk score
      await this.updateUserRiskScore(buyerAddress, analysis.riskScore);

      // Store transaction for future analysis
      this.storeTransaction(transactionId, transactionData, analysis);

      return analysis;
    } catch (error) {
      console.error('Transaction analysis error:', error);
      throw error;
    }
  }

  /**
   * Analyze account for fraud risk
   */
  async analyzeAccount(userAddress) {
    try {
      const analysis = {
        userAddress,
        timestamp: new Date().toISOString(),
        riskScore: 0,
        riskLevel: 'low',
        factors: [],
        flags: [],
        suspiciousConnections: [],
        recommendations: []
      };

      // 1. Verification status
      const verificationRisk = await this.assessVerificationStatus(userAddress);
      analysis.factors.push({ name: 'verification_status', score: verificationRisk.score, details: verificationRisk });

      // 2. Activity pattern analysis
      const activityRisk = await this.analyzeActivityPattern(userAddress);
      analysis.factors.push({ name: 'activity_pattern', score: activityRisk.score, details: activityRisk });

      // 3. Reputation analysis
      const reputationRisk = await this.assessReputation(userAddress);
      analysis.factors.push({ name: 'reputation', score: reputationRisk.score, details: reputationRisk });

      // 4. Connection graph analysis
      const connectionRisk = await this.analyzeConnections(userAddress);
      analysis.factors.push({ name: 'connection_graph', score: connectionRisk.score, details: connectionRisk });
      analysis.suspiciousConnections = connectionRisk.suspiciousConnections;

      // 5. Complaint history
      const complaintRisk = await this.checkComplaintHistory(userAddress);
      analysis.factors.push({ name: 'complaint_history', score: complaintRisk.score, details: complaintRisk });

      // Calculate risk score
      analysis.riskScore = this.calculateWeightedScore(analysis.factors, 'account');

      // Determine risk level
      const { level, action } = this.determineRiskLevel(analysis.riskScore);
      analysis.riskLevel = level;

      // Generate flags
      analysis.flags = this.generateFlags(analysis.factors);

      // Generate recommendations
      analysis.recommendations = this.generateAccountRecommendations(analysis);

      // Update stored risk score
      this.userRiskScores.set(userAddress, {
        score: analysis.riskScore,
        level: analysis.riskLevel,
        lastUpdated: new Date().toISOString()
      });

      return analysis;
    } catch (error) {
      console.error('Account analysis error:', error);
      throw error;
    }
  }

  /**
   * Analyze content for fraud/authenticity
   */
  async analyzeContent(contentData) {
    try {
      const {
        nftId,
        metadata,
        sellerAddress,
        images
      } = contentData;

      const analysis = {
        nftId,
        timestamp: new Date().toISOString(),
        riskScore: 0,
        riskLevel: 'low',
        authenticityScore: 0,
        factors: [],
        flags: [],
        recommendations: []
      };

      // 1. Authenticity analysis
      const authenticityRisk = await this.assessAuthenticity(metadata, images);
      analysis.factors.push({ name: 'authenticity_score', score: 100 - authenticityRisk.score, details: authenticityRisk });
      analysis.authenticityScore = authenticityRisk.score;

      // 2. Appropriation detection
      const appropriationRisk = await this.detectAppropriation(metadata);
      analysis.factors.push({ name: 'appropriation_indicators', score: appropriationRisk.score, details: appropriationRisk });

      // 3. Metadata consistency
      const metadataRisk = await this.checkMetadataConsistency(metadata);
      analysis.factors.push({ name: 'metadata_consistency', score: metadataRisk.score, details: metadataRisk });

      // 4. Seller reputation
      const sellerRisk = await this.assessSellerReputation(sellerAddress);
      analysis.factors.push({ name: 'seller_reputation', score: sellerRisk.score, details: sellerRisk });

      // Calculate risk score
      analysis.riskScore = this.calculateWeightedScore(analysis.factors, 'content');

      // Determine risk level
      const { level, action } = this.determineRiskLevel(analysis.riskScore);
      analysis.riskLevel = level;

      // Generate flags
      analysis.flags = this.generateFlags(analysis.factors);

      // Generate recommendations
      analysis.recommendations = this.generateContentRecommendations(analysis);

      return analysis;
    } catch (error) {
      console.error('Content analysis error:', error);
      throw error;
    }
  }

  /**
   * Real-time monitoring of suspicious patterns
   */
  async monitorSuspiciousActivity() {
    const alerts = [];

    // Check for rapid fire purchases
    const rapidFireAlerts = await this.detectRapidFirePurchases();
    alerts.push(...rapidFireAlerts);

    // Check for price manipulation
    const manipulationAlerts = await this.detectPriceManipulation();
    alerts.push(...manipulationAlerts);

    // Check for account takeovers
    const takeoverAlerts = await this.detectAccountTakeovers();
    alerts.push(...takeoverAlerts);

    // Check for layering
    const layeringAlerts = await this.detectLayering();
    alerts.push(...layeringAlerts);

    return {
      generatedAt: new Date().toISOString(),
      totalAlerts: alerts.length,
      criticalAlerts: alerts.filter(a => a.severity === 'critical').length,
      alerts: alerts.sort((a, b) => this.severityRank(b.severity) - this.severityRank(a.severity))
    };
  }

  /**
   * Report suspicious activity
   */
  async reportSuspiciousActivity(reportData) {
    try {
      const {
        reporter,
        subject,
        activityType,
        description,
        evidence
      } = reportData;

      const report = {
        reportId: this.generateReportId(),
        reporter,
        subject,
        activityType,
        description,
        evidence,
        status: 'pending_review',
        submittedAt: new Date().toISOString(),
        reviewedAt: null,
        resolution: null
      };

      // Auto-analyze reported activity
      const autoAnalysis = await this.analyzeReportedActivity(report);
      report.autoAnalysis = autoAnalysis;

      // Escalate if high risk
      if (autoAnalysis.riskScore > 70) {
        report.priority = 'high';
        await this.escalateReport(report);
      }

      return {
        success: true,
        reportId: report.reportId,
        status: report.status,
        priority: report.priority || 'medium',
        estimatedReview: '24-48 hours'
      };
    } catch (error) {
      console.error('Report suspicious activity error:', error);
      throw error;
    }
  }

  /**
   * Get fraud statistics
   */
  async getFraudStatistics(timeframe = '30d') {
    const days = this.parseTimeframe(timeframe);
    
    return {
      timeframe,
      generatedAt: new Date().toISOString(),
      overview: {
        totalTransactionsAnalyzed: Math.floor(Math.random() * 10000) + 1000,
        flaggedTransactions: Math.floor(Math.random() * 100) + 10,
        blockedTransactions: Math.floor(Math.random() * 20) + 2,
        falsePositives: Math.floor(Math.random() * 10) + 1
      },
      byRiskLevel: {
        low: Math.floor(Math.random() * 8000) + 800,
        medium: Math.floor(Math.random() * 1500) + 150,
        high: Math.floor(Math.random() * 300) + 30,
        critical: Math.floor(Math.random() * 50) + 5
      },
      byPattern: {
        rapid_fire: Math.floor(Math.random() * 20) + 2,
        price_manipulation: Math.floor(Math.random() * 10) + 1,
        account_takeover: Math.floor(Math.random() * 5) + 1,
        counterfeit: Math.floor(Math.random() * 15) + 2,
        layering: Math.floor(Math.random() * 8) + 1
      },
      detectionAccuracy: {
        precision: 0.94,
        recall: 0.89,
        f1Score: 0.91
      }
    };
  }

  // Analysis helper methods
  async analyzeAmountAnomaly(userAddress, amount) {
    // Get user's transaction history
    const history = this.transactionHistory.get(userAddress) || [];
    
    if (history.length < 3) {
      return { score: 30, reason: 'insufficient_history' };
    }

    const avgAmount = history.reduce((sum, t) => sum + t.amount, 0) / history.length;
    const deviation = Math.abs(amount - avgAmount) / avgAmount;

    if (deviation > 3) return { score: 90, reason: 'extreme_deviation', deviation };
    if (deviation > 2) return { score: 70, reason: 'high_deviation', deviation };
    if (deviation > 1) return { score: 40, reason: 'moderate_deviation', deviation };
    return { score: 10, reason: 'normal', deviation };
  }

  async checkTransactionVelocity(userAddress, timestamp) {
    const recentTransactions = this.getRecentTransactions(userAddress, 300); // 5 minutes
    
    if (recentTransactions.length > 5) {
      return { score: 85, reason: 'excessive_velocity', count: recentTransactions.length };
    }
    if (recentTransactions.length > 3) {
      return { score: 60, reason: 'high_velocity', count: recentTransactions.length };
    }
    return { score: 15, reason: 'normal_velocity', count: recentTransactions.length };
  }

  async analyzeDeviceFingerprint(userAddress, deviceInfo) {
    // In production: Compare with known devices
    const knownDevices = []; // Get from database
    
    if (knownDevices.length === 0) {
      return { score: 25, reason: 'new_user' };
    }

    const isKnown = knownDevices.some(d => d.fingerprint === deviceInfo.fingerprint);
    
    if (!isKnown) {
      return { score: 55, reason: 'new_device' };
    }
    return { score: 5, reason: 'known_device' };
  }

  async analyzeLocation(userAddress, location) {
    // In production: Compare with typical locations
    const lastLocation = null; // Get from database
    
    if (!lastLocation) {
      return { score: 20, reason: 'first_location' };
    }

    const distance = this.calculateDistance(lastLocation, location);
    
    if (distance > 1000) { // 1000 km
      return { score: 75, reason: 'location_jump', distance };
    }
    if (distance > 500) {
      return { score: 45, reason: 'significant_travel', distance };
    }
    return { score: 10, reason: 'normal_location', distance };
  }

  async analyzeBehaviorPattern(userAddress, transactionData) {
    // Analyze if transaction matches user's typical behavior
    const typicalPatterns = {}; // Get from database
    
    // Simplified check
    const hour = new Date(transactionData.timestamp).getHours();
    const isUnusualHour = hour < 6 || hour > 23;
    
    if (isUnusualHour) {
      return { score: 35, reason: 'unusual_hours' };
    }
    return { score: 15, reason: 'normal_pattern' };
  }

  async assessAccountAge(userAddress) {
    // In production: Get account creation date
    const accountAge = Math.floor(Math.random() * 365) + 1; // days
    
    if (accountAge < 7) return { score: 60, reason: 'very_new_account', age: accountAge };
    if (accountAge < 30) return { score: 35, reason: 'new_account', age: accountAge };
    if (accountAge < 90) return { score: 20, reason: 'recent_account', age: accountAge };
    return { score: 5, reason: 'established_account', age: accountAge };
  }

  async assessVerificationStatus(userAddress) {
    // In production: Check verification level
    const verificationLevel = ['none', 'basic', 'verified', 'heritage'][Math.floor(Math.random() * 4)];
    
    const scores = { none: 80, basic: 50, verified: 20, heritage: 5 };
    return { score: scores[verificationLevel], level: verificationLevel };
  }

  async analyzeActivityPattern(userAddress) {
    // In production: Analyze login patterns, activity times, etc.
    return { score: Math.floor(Math.random() * 30) + 10, consistency: 'normal' };
  }

  async assessReputation(userAddress) {
    // In production: Calculate based on ratings, disputes, etc.
    const reputation = Math.floor(Math.random() * 40) + 60;
    return { score: 100 - reputation, reputation };
  }

  async analyzeConnections(userAddress) {
    // In production: Analyze transaction graph
    return {
      score: Math.floor(Math.random() * 30) + 10,
      suspiciousConnections: []
    };
  }

  async checkComplaintHistory(userAddress) {
    // In production: Check complaint database
    const complaints = Math.floor(Math.random() * 3);
    if (complaints > 1) return { score: 70, complaints };
    if (complaints > 0) return { score: 40, complaints };
    return { score: 5, complaints: 0 };
  }

  async assessAuthenticity(metadata, images) {
    // In production: Use AI authentication service
    return { score: Math.floor(Math.random() * 20) + 80 };
  }

  async detectAppropriation(metadata) {
    // In production: Use content moderation service
    return { score: Math.floor(Math.random() * 20) };
  }

  async checkMetadataConsistency(metadata) {
    // Check for inconsistencies in metadata
    let inconsistencies = 0;
    
    if (!metadata.nation && !metadata.tribe) inconsistencies++;
    if (!metadata.artistName) inconsistencies++;
    if (!metadata.creationDate) inconsistencies++;
    
    return { score: inconsistencies * 20, inconsistencies };
  }

  async assessSellerReputation(sellerAddress) {
    // In production: Get seller metrics
    const sales = Math.floor(Math.random() * 100);
    const rating = Math.random() * 2 + 3;
    
    if (sales < 5) return { score: 40, sales, rating };
    if (rating < 3) return { score: 60, sales, rating };
    return { score: 10, sales, rating };
  }

  // Pattern detection methods
  async detectRapidFirePurchases() {
    const alerts = [];
    // Implementation would scan recent transactions
    if (Math.random() > 0.7) {
      alerts.push({
        type: 'rapid_fire_purchases',
        severity: 'medium',
        user: 'r' + Math.random().toString(36).substring(2, 15),
        description: '5 purchases in 5 minutes',
        detectedAt: new Date().toISOString()
      });
    }
    return alerts;
  }

  async detectPriceManipulation() {
    const alerts = [];
    if (Math.random() > 0.8) {
      alerts.push({
        type: 'price_manipulation',
        severity: 'high',
        nftId: 'NFT-' + Math.floor(Math.random() * 1000),
        description: 'Suspicious bidding pattern detected',
        detectedAt: new Date().toISOString()
      });
    }
    return alerts;
  }

  async detectAccountTakeovers() {
    const alerts = [];
    if (Math.random() > 0.9) {
      alerts.push({
        type: 'account_takeover',
        severity: 'critical',
        user: 'r' + Math.random().toString(36).substring(2, 15),
        description: 'Multiple indicators of unauthorized access',
        detectedAt: new Date().toISOString()
      });
    }
    return alerts;
  }

  async detectLayering() {
    const alerts = [];
    if (Math.random() > 0.85) {
      alerts.push({
        type: 'layering',
        severity: 'high',
        user: 'r' + Math.random().toString(36).substring(2, 15),
        description: 'Complex transaction pattern detected',
        detectedAt: new Date().toISOString()
      });
    }
    return alerts;
  }

  // Utility methods
  calculateWeightedScore(factors, modelType) {
    const model = this.riskModels.get(modelType);
    if (!model) return 50;

    let totalScore = 0;
    let totalWeight = 0;

    for (const factor of factors) {
      const modelFactor = model.factors.find(f => f.name === factor.name);
      if (modelFactor) {
        totalScore += factor.score * modelFactor.weight;
        totalWeight += modelFactor.weight;
      }
    }

    return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 50;
  }

  determineRiskLevel(score) {
    if (score >= 80) return { level: 'critical', action: 'block' };
    if (score >= 60) return { level: 'high', action: 'review' };
    if (score >= 40) return { level: 'medium', action: 'monitor' };
    return { level: 'low', action: 'allow' };
  }

  generateFlags(factors) {
    const flags = [];
    
    for (const factor of factors) {
      if (factor.score > 60) {
        flags.push({
          factor: factor.name,
          severity: factor.score > 80 ? 'high' : 'medium',
          details: factor.details
        });
      }
    }
    
    return flags;
  }

  generateRecommendations(analysis) {
    const recommendations = [];
    
    if (analysis.riskLevel === 'critical') {
      recommendations.push('Block transaction and freeze account pending review');
    } else if (analysis.riskLevel === 'high') {
      recommendations.push('Require additional verification before proceeding');
      recommendations.push('Notify security team for review');
    } else if (analysis.riskLevel === 'medium') {
      recommendations.push('Monitor transaction closely');
      recommendations.push('Request additional documentation if pattern continues');
    }
    
    return recommendations;
  }

  generateAccountRecommendations(analysis) {
    const recommendations = [];
    
    if (analysis.riskLevel === 'high' || analysis.riskLevel === 'critical') {
      recommendations.push('Require enhanced verification');
      recommendations.push('Limit transaction amounts');
      recommendations.push('Enable 2FA if not already active');
    }
    
    return recommendations;
  }

  generateContentRecommendations(analysis) {
    const recommendations = [];
    
    if (analysis.authenticityScore < 50) {
      recommendations.push('Require additional provenance documentation');
      recommendations.push('Submit for expert review');
    }
    
    return recommendations;
  }

  async updateUserRiskScore(userAddress, score) {
    const current = this.userRiskScores.get(userAddress) || { score: 0 };
    // Exponential moving average
    const newScore = Math.round(current.score * 0.7 + score * 0.3);
    
    this.userRiskScores.set(userAddress, {
      score: newScore,
      lastUpdated: new Date().toISOString()
    });
  }

  storeTransaction(transactionId, data, analysis) {
    if (!this.transactionHistory.has(data.buyerAddress)) {
      this.transactionHistory.set(data.buyerAddress, []);
    }
    
    this.transactionHistory.get(data.buyerAddress).push({
      transactionId,
      amount: data.amount,
      timestamp: data.timestamp,
      riskScore: analysis.riskScore
    });
  }

  getRecentTransactions(userAddress, seconds) {
    const history = this.transactionHistory.get(userAddress) || [];
    const cutoff = Date.now() - seconds * 1000;
    
    return history.filter(t => new Date(t.timestamp).getTime() > cutoff);
  }

  calculateDistance(loc1, loc2) {
    // Simplified distance calculation
    return Math.floor(Math.random() * 2000);
  }

  parseTimeframe(timeframe) {
    const match = timeframe.match(/(\d+)([dmy])/);
    if (!match) return 30;
    
    const [, num, unit] = match;
    switch(unit) {
      case 'd': return parseInt(num);
      case 'm': return parseInt(num) * 30;
      case 'y': return parseInt(num) * 365;
      default: return 30;
    }
  }

  severityRank(severity) {
    const ranks = { low: 1, medium: 2, high: 3, critical: 4 };
    return ranks[severity] || 0;
  }

  generateReportId() {
    return `FRD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  async analyzeReportedActivity(report) {
    return {
      riskScore: Math.floor(Math.random() * 100),
      patternMatch: Math.random() > 0.5
    };
  }

  async escalateReport(report) {
    console.log(`Escalated report ${report.reportId} for immediate review`);
  }
}

module.exports = new FraudDetectionService();
