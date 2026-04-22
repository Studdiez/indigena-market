/**
 * GDPR Compliance Service
 * Data privacy and protection for international users
 */

const crypto = require('crypto');

class GDPRComplianceService {
  constructor() {
    this.dataRetentionPeriods = new Map([
      ['user_activity', 365], // days
      ['transaction_data', 2555], // 7 years
      ['communication_logs', 730], // 2 years
      ['analytics_data', 365],
      ['verification_documents', 2555],
      ['audit_logs', 2555]
    ]);
    
    this.sensitiveDataTypes = new Set([
      'ssn',
      'government_id',
      'biometric',
      'health_info',
      'financial_details',
      'location_precise'
    ]);
    
    this.consentRecords = new Map();
    this.dataProcessingRecords = new Map();
    this.userDataInventory = new Map();
  }

  /**
   * Record user consent
   */
  async recordConsent(userAddress, consentData) {
    try {
      const {
        consentType,
        granted,
        purposes = [],
        version,
        ipAddress,
        userAgent
      } = consentData;

      const consentRecord = {
        consentId: this.generateConsentId(),
        userAddress,
        consentType,
        granted,
        purposes,
        version,
        timestamp: new Date().toISOString(),
        ipHash: this.hashData(ipAddress),
        userAgentHash: this.hashData(userAgent),
        withdrawal: null
      };

      // Store consent
      if (!this.consentRecords.has(userAddress)) {
        this.consentRecords.set(userAddress, []);
      }
      this.consentRecords.get(userAddress).push(consentRecord);

      return {
        success: true,
        consentId: consentRecord.consentId,
        timestamp: consentRecord.timestamp,
        message: granted 
          ? 'Consent recorded successfully' 
          : 'Consent declined - limited services available'
      };
    } catch (error) {
      console.error('Record consent error:', error);
      throw error;
    }
  }

  /**
   * Withdraw consent
   */
  async withdrawConsent(userAddress, withdrawalData) {
    try {
      const { consentType, reason, ipAddress } = withdrawalData;

      const userConsents = this.consentRecords.get(userAddress) || [];
      
      // Find active consent
      const activeConsent = userConsents
        .filter(c => c.consentType === consentType && c.granted && !c.withdrawal)
        .pop();

      if (!activeConsent) {
        return {
          success: false,
          message: 'No active consent found to withdraw'
        };
      }

      // Record withdrawal
      activeConsent.withdrawal = {
        timestamp: new Date().toISOString(),
        reason,
        ipHash: this.hashData(ipAddress)
      };

      // Stop processing affected data
      await this.stopDataProcessing(userAddress, consentType);

      return {
        success: true,
        consentId: activeConsent.consentId,
        withdrawnAt: activeConsent.withdrawal.timestamp,
        message: 'Consent withdrawn successfully'
      };
    } catch (error) {
      console.error('Withdraw consent error:', error);
      throw error;
    }
  }

  /**
   * Get user consent status
   */
  async getConsentStatus(userAddress) {
    try {
      const userConsents = this.consentRecords.get(userAddress) || [];
      
      const consentTypes = [
        'data_processing',
        'marketing',
        'analytics',
        'third_party_sharing',
        'automated_decision_making'
      ];

      const status = consentTypes.map(type => {
        const consents = userConsents.filter(c => c.consentType === type);
        const latest = consents[consents.length - 1];
        
        return {
          type,
          granted: latest?.granted || false,
          timestamp: latest?.timestamp || null,
          canWithdraw: latest?.granted && !latest?.withdrawal,
          purposes: latest?.purposes || []
        };
      });

      return {
        success: true,
        userAddress,
        overallStatus: status.every(s => s.granted) ? 'full' : 
                      status.some(s => s.granted) ? 'partial' : 'none',
        consents: status
      };
    } catch (error) {
      console.error('Get consent status error:', error);
      throw error;
    }
  }

  /**
   * Handle data access request (Right to Access)
   */
  async handleDataAccessRequest(userAddress) {
    try {
      const userData = await this.collectUserData(userAddress);
      
      const accessReport = {
        requestId: this.generateRequestId(),
        userAddress,
        generatedAt: new Date().toISOString(),
        dataCategories: Object.keys(userData).length,
        data: userData,
        processingInfo: await this.getProcessingInfo(userAddress),
        retentionInfo: this.getRetentionInfo(userAddress),
        thirdParties: await this.getThirdPartySharing(userAddress)
      };

      return {
        success: true,
        requestId: accessReport.requestId,
        report: accessReport,
        downloadUrl: `/api/gdpr/data-export/${accessReport.requestId}`,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };
    } catch (error) {
      console.error('Data access request error:', error);
      throw error;
    }
  }

  /**
   * Handle data portability request
   */
  async handleDataPortabilityRequest(userAddress, format = 'json') {
    try {
      const userData = await this.collectUserData(userAddress);
      
      // Format data for portability
      const portableData = {
        schema_version: '1.0',
        export_date: new Date().toISOString(),
        platform: 'Indigena Market',
        user: {
          address: userAddress,
          profile: userData.profile,
          activity: userData.activity,
          transactions: userData.transactions,
          creations: userData.creations
        }
      };

      // Generate export file
      const exportData = format === 'json' 
        ? JSON.stringify(portableData, null, 2)
        : this.convertToCSV(portableData);

      const requestId = this.generateRequestId();

      return {
        success: true,
        requestId,
        format,
        fileSize: Buffer.byteLength(exportData),
        downloadUrl: `/api/gdpr/portability/${requestId}`,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        data: exportData
      };
    } catch (error) {
      console.error('Data portability error:', error);
      throw error;
    }
  }

  /**
   * Handle data deletion request (Right to be Forgotten)
   */
  async handleDataDeletionRequest(userAddress, deletionData) {
    try {
      const { reason, scope = 'all', exceptions = [] } = deletionData;

      const requestId = this.generateRequestId();
      
      const deletionPlan = {
        requestId,
        userAddress,
        requestedAt: new Date().toISOString(),
        scope,
        exceptions,
        dataToDelete: [],
        dataToRetain: [],
        estimatedCompletion: null
      };

      // Identify data categories
      const dataCategories = await this.identifyUserData(userAddress);

      for (const category of dataCategories) {
        // Check if retention required by law
        if (this.isRetentionRequired(category.type)) {
          deletionPlan.dataToRetain.push({
            type: category.type,
            reason: 'Legal obligation',
            retentionPeriod: this.dataRetentionPeriods.get(category.type),
            anonymized: true
          });
        } else if (exceptions.includes(category.type)) {
          deletionPlan.dataToRetain.push({
            type: category.type,
            reason: 'User exception',
            retentionPeriod: null
          });
        } else {
          deletionPlan.dataToDelete.push(category);
        }
      }

      // Schedule deletion
      deletionPlan.estimatedCompletion = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      // Execute deletion (in production: queue for processing)
      await this.executeDataDeletion(deletionPlan);

      return {
        success: true,
        requestId,
        status: 'processing',
        plan: deletionPlan,
        message: 'Data deletion request received and is being processed'
      };
    } catch (error) {
      console.error('Data deletion error:', error);
      throw error;
    }
  }

  /**
   * Handle data rectification request
   */
  async handleDataRectification(userAddress, rectificationData) {
    try {
      const { field, currentValue, requestedValue, reason } = rectificationData;

      const requestId = this.generateRequestId();

      const rectification = {
        requestId,
        userAddress,
        field,
        currentValue,
        requestedValue,
        reason,
        status: 'pending_review',
        submittedAt: new Date().toISOString(),
        reviewedAt: null,
        reviewedBy: null
      };

      // Auto-approve simple changes
      if (this.canAutoApprove(field)) {
        rectification.status = 'approved';
        rectification.reviewedAt = new Date().toISOString();
        rectification.reviewedBy = 'system';
        
        // Apply change
        await this.applyDataChange(userAddress, field, requestedValue);
      } else {
        // Queue for manual review
        await this.queueForReview(rectification);
      }

      return {
        success: true,
        requestId,
        status: rectification.status,
        field,
        message: rectification.status === 'approved' 
          ? 'Data updated successfully' 
          : 'Request submitted for review'
      };
    } catch (error) {
      console.error('Data rectification error:', error);
      throw error;
    }
  }

  /**
   * Record data processing activity
   */
  async recordProcessingActivity(activityData) {
    try {
      const {
        processingType,
        dataCategories,
        purposes,
        legalBasis,
        recipients,
        retentionPeriod,
        securityMeasures
      } = activityData;

      const record = {
        activityId: this.generateActivityId(),
        processingType,
        dataCategories,
        purposes,
        legalBasis,
        recipients,
        retentionPeriod,
        securityMeasures,
        recordedAt: new Date().toISOString(),
        lastReviewed: new Date().toISOString()
      };

      this.dataProcessingRecords.set(record.activityId, record);

      return {
        success: true,
        activityId: record.activityId
      };
    } catch (error) {
      console.error('Record processing activity error:', error);
      throw error;
    }
  }

  /**
   * Check if processing is lawful
   */
  async isProcessingLawful(userAddress, processingType, dataCategory) {
    try {
      // Check consent
      const consentStatus = await this.getConsentStatus(userAddress);
      const relevantConsent = consentStatus.consents.find(
        c => c.type === 'data_processing' && c.granted
      );

      if (!relevantConsent) {
        return {
          lawful: false,
          reason: 'No valid consent'
        };
      }

      // Check if purpose is covered
      const purposeCovered = relevantConsent.purposes.includes(processingType);

      if (!purposeCovered) {
        return {
          lawful: false,
          reason: 'Purpose not covered by consent'
        };
      }

      // Check sensitive data requirements
      if (this.sensitiveDataTypes.has(dataCategory)) {
        const explicitConsent = consentStatus.consents.find(
          c => c.type === 'sensitive_data' && c.granted
        );

        if (!explicitConsent) {
          return {
            lawful: false,
            reason: 'Explicit consent required for sensitive data'
          };
        }
      }

      return {
        lawful: true,
        basis: 'consent',
        consentId: relevantConsent.timestamp
      };
    } catch (error) {
      console.error('Lawfulness check error:', error);
      throw error;
    }
  }

  /**
   * Anonymize user data
   */
  async anonymizeUserData(userAddress) {
    try {
      const anonymization = {
        originalAddress: userAddress,
        anonymizedId: this.generateAnonymizedId(),
        timestamp: new Date().toISOString(),
        fieldsAnonymized: []
      };

      // Anonymize personal identifiers
      const fieldsToAnonymize = [
        'name',
        'email',
        'phone',
        'location',
        'profile_image'
      ];

      for (const field of fieldsToAnonymize) {
        await this.anonymizeField(userAddress, field);
        anonymization.fieldsAnonymized.push(field);
      }

      // Retain transaction data but unlink from identity
      await this.unlinkTransactionData(userAddress, anonymization.anonymizedId);

      return {
        success: true,
        anonymizedId: anonymization.anonymizedId,
        fieldsAnonymized: anonymization.fieldsAnonymized
      };
    } catch (error) {
      console.error('Anonymization error:', error);
      throw error;
    }
  }

  /**
   * Generate privacy report
   */
  async generatePrivacyReport() {
    try {
      const report = {
        generatedAt: new Date().toISOString(),
        dataProcessingActivities: this.dataProcessingRecords.size,
        activeConsents: this.countActiveConsents(),
        dataRetention: this.getRetentionSummary(),
        thirdPartyProcessors: await this.getThirdPartyProcessors(),
        securityMeasures: this.listSecurityMeasures(),
        dataBreachHistory: await this.getBreachHistory(),
        complianceStatus: await this.assessCompliance()
      };

      return report;
    } catch (error) {
      console.error('Privacy report error:', error);
      throw error;
    }
  }

  /**
   * Handle data breach notification
   */
  async handleDataBreach(breachData) {
    try {
      const {
        discoveryDate,
        breachType,
        affectedUsers,
        affectedData,
        severity,
        containmentMeasures
      } = breachData;

      const breach = {
        breachId: this.generateBreachId(),
        discoveryDate,
        reportedAt: new Date().toISOString(),
        breachType,
        affectedUsers: affectedUsers.length,
        affectedDataCategories: affectedData,
        severity,
        containmentMeasures,
        notificationsSent: {
          supervisoryAuthority: false,
          affectedUsers: false,
          public: false
        }
      };

      // Determine notification requirements
      const notificationRequirements = this.determineNotificationRequirements(breach);

      // Schedule notifications
      await this.scheduleBreachNotifications(breach, notificationRequirements);

      return {
        success: true,
        breachId: breach.breachId,
        notificationRequirements,
        message: 'Breach recorded and notifications scheduled'
      };
    } catch (error) {
      console.error('Data breach handling error:', error);
      throw error;
    }
  }

  // Helper methods
  generateConsentId() {
    return `CON-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  generateRequestId() {
    return `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  generateActivityId() {
    return `ACT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  generateAnonymizedId() {
    return `ANO-${crypto.randomBytes(16).toString('hex').toUpperCase()}`;
  }

  generateBreachId() {
    return `BRH-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  hashData(data) {
    if (!data) return null;
    return crypto.createHash('sha256').update(String(data)).digest('hex');
  }

  async collectUserData(userAddress) {
    // In production: Query all user data from database
    return {
      profile: {
        address: userAddress,
        registrationDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        verificationLevel: 'heritage',
        nation: 'Navajo'
      },
      activity: {
        loginHistory: [],
        pageViews: 150,
        searches: 45
      },
      transactions: {
        purchases: 12,
        sales: 8,
        totalVolume: 5000
      },
      creations: {
        artworks: 15,
        collections: 3
      },
      communications: {
        supportTickets: 2,
        marketingEmails: 25
      }
    };
  }

  async getProcessingInfo(userAddress) {
    return {
      purposes: ['platform_operation', 'transaction_processing', 'analytics'],
      legalBasis: 'consent',
      automatedDecisionMaking: false,
      profiling: false
    };
  }

  getRetentionInfo(userAddress) {
    const retention = {};
    for (const [type, days] of this.dataRetentionPeriods) {
      retention[type] = {
        period: days,
        deletionDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
      };
    }
    return retention;
  }

  async getThirdPartySharing(userAddress) {
    return [
      { processor: 'XRPL Ledger', purpose: 'Transaction processing', data: 'transaction_data' },
      { processor: 'Xumm Wallet', purpose: 'Wallet integration', data: 'wallet_address' },
      { processor: 'IPFS', purpose: 'File storage', data: 'artwork_files' }
    ];
  }

  convertToCSV(data) {
    // Simplified CSV conversion
    return 'data:text/csv;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));
  }

  async identifyUserData(userAddress) {
    return [
      { type: 'profile', count: 1 },
      { type: 'activity_logs', count: 150 },
      { type: 'transactions', count: 20 },
      { type: 'communications', count: 27 },
      { type: 'verification_documents', count: 3 }
    ];
  }

  isRetentionRequired(dataType) {
    const required = ['transaction_data', 'audit_logs', 'verification_documents'];
    return required.includes(dataType);
  }

  async executeDataDeletion(plan) {
    console.log(`Executing data deletion for ${plan.userAddress}`);
    // In production: Queue for async processing
  }

  canAutoApprove(field) {
    const autoApproveFields = ['display_name', 'bio', 'profile_image', 'preferences'];
    return autoApproveFields.includes(field);
  }

  async applyDataChange(userAddress, field, value) {
    console.log(`Applying change to ${field} for ${userAddress}`);
    // In production: Update database
  }

  async queueForReview(rectification) {
    console.log(`Queued for review: ${rectification.requestId}`);
    // In production: Add to review queue
  }

  async stopDataProcessing(userAddress, consentType) {
    console.log(`Stopped ${consentType} processing for ${userAddress}`);
    // In production: Update processing flags
  }

  countActiveConsents() {
    let count = 0;
    for (const consents of this.consentRecords.values()) {
      count += consents.filter(c => c.granted && !c.withdrawal).length;
    }
    return count;
  }

  getRetentionSummary() {
    const summary = {};
    for (const [type, days] of this.dataRetentionPeriods) {
      summary[type] = { days, years: Math.round(days / 365 * 10) / 10 };
    }
    return summary;
  }

  async getThirdPartyProcessors() {
    return [
      { name: 'XRPL Ledger', location: 'Global', purpose: 'Blockchain' },
      { name: 'Xumm', location: 'Netherlands', purpose: 'Wallet' },
      { name: 'MongoDB Atlas', location: 'USA', purpose: 'Database' }
    ];
  }

  listSecurityMeasures() {
    return [
      'Encryption at rest and in transit',
      'Access control and authentication',
      'Regular security audits',
      'Data minimization practices',
      'Employee training on data protection'
    ];
  }

  async getBreachHistory() {
    return []; // No breaches recorded
  }

  async assessCompliance() {
    return {
      overall: 'compliant',
      areas: [
        { area: 'Consent management', status: 'compliant' },
        { area: 'Data retention', status: 'compliant' },
        { area: 'User rights', status: 'compliant' },
        { area: 'Security measures', status: 'compliant' }
      ]
    };
  }

  determineNotificationRequirements(breach) {
    const requirements = {
      supervisoryAuthority: breach.severity === 'high' || breach.severity === 'critical',
      affectedUsers: breach.severity !== 'low',
      public: breach.affectedUsers > 1000
    };

    return {
      ...requirements,
      timeframe: requirements.supervisoryAuthority ? '72 hours' : 'without undue delay'
    };
  }

  async scheduleBreachNotifications(breach, requirements) {
    console.log(`Scheduled notifications for breach ${breach.breachId}`);
    // In production: Schedule notification jobs
  }

  async anonymizeField(userAddress, field) {
    console.log(`Anonymized ${field} for ${userAddress}`);
  }

  async unlinkTransactionData(userAddress, anonymizedId) {
    console.log(`Unlinked transaction data for ${userAddress}`);
  }
}

module.exports = new GDPRComplianceService();
