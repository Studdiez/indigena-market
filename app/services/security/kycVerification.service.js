/**
 * KYC/Identity Verification Service
 * Verifies Indigenous heritage claims and artist identity
 */

const crypto = require('crypto');

class KYCVerificationService {
  constructor() {
    this.verificationLevels = new Map([
      ['basic', { name: 'Basic', description: 'Email and wallet verified' }],
      ['identity', { name: 'Identity Verified', description: 'Government ID verified' }],
      ['heritage', { name: 'Heritage Verified', description: 'Indigenous heritage confirmed' }],
      ['elder', { name: 'Elder Verified', description: 'Verified by community elder' }],
      ['master', { name: 'Master Artist', description: 'Recognized master practitioner' }]
    ]);
    
    this.verificationMethods = new Map();
    this.pendingVerifications = new Map();
    this.initializeVerificationMethods();
  }

  initializeVerificationMethods() {
    // Tribal enrollment verification
    this.verificationMethods.set('tribal_enrollment', {
      name: 'Tribal Enrollment',
      description: 'Official tribal enrollment documentation',
      documents: ['tribal_id', 'enrollment_card', 'cdib_card'],
      reliability: 'high'
    });

    // Community verification
    this.verificationMethods.set('community_verification', {
      name: 'Community Verification',
      description: 'Verification by recognized community members',
      documents: ['elder_letter', 'community_resolution', 'family_tree'],
      reliability: 'medium'
    });

    // Artistic lineage
    this.verificationMethods.set('artistic_lineage', {
      name: 'Artistic Lineage',
      description: 'Documentation of artistic family heritage',
      documents: ['family_history', 'apprenticeship_records', 'elder_testimony'],
      reliability: 'medium'
    });

    // Academic/Institutional
    this.verificationMethods.set('academic', {
      name: 'Academic/Institutional',
      description: 'Verification through academic or cultural institutions',
      documents: ['university_records', 'museum_affiliation', 'research_papers'],
      reliability: 'high'
    });
  }

  /**
   * Submit KYC verification request
   */
  async submitVerification(userAddress, verificationData) {
    try {
      const {
        verificationType,
        personalInfo,
        documents,
        nation,
        verificationMethod
      } = verificationData;

      const submission = {
        submissionId: this.generateSubmissionId(),
        userAddress,
        verificationType,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        personalInfo: {
          ...personalInfo,
          // Hash sensitive data
          ssn: personalInfo.ssn ? this.hashData(personalInfo.ssn) : null,
          dob: personalInfo.dob
        },
        nation,
        verificationMethod,
        documents: documents.map(doc => ({
          ...doc,
          hash: this.hashData(doc.content),
          submittedAt: new Date().toISOString()
        })),
        reviewHistory: [],
        riskAssessment: await this.assessRisk(userAddress, verificationData)
      };

      // Store pending verification
      this.pendingVerifications.set(submission.submissionId, submission);

      // Auto-approve low-risk basic verifications
      if (verificationType === 'basic' && submission.riskAssessment.score < 30) {
        await this.approveVerification(submission.submissionId, {
          reviewer: 'system',
          notes: 'Auto-approved low-risk verification'
        });
      }

      return {
        success: true,
        submissionId: submission.submissionId,
        status: submission.status,
        estimatedReviewTime: this.getEstimatedReviewTime(verificationType),
        nextSteps: this.getNextSteps(verificationType)
      };
    } catch (error) {
      console.error('KYC submission error:', error);
      throw error;
    }
  }

  /**
   * Review verification submission
   */
  async reviewVerification(submissionId, reviewData) {
    try {
      const submission = this.pendingVerifications.get(submissionId);
      if (!submission) {
        throw new Error('Submission not found');
      }

      const { decision, reviewer, notes, verificationLevel } = reviewData;

      // Add to review history
      submission.reviewHistory.push({
        reviewer,
        decision,
        notes,
        timestamp: new Date().toISOString()
      });

      if (decision === 'approved') {
        await this.approveVerification(submissionId, reviewData);
      } else if (decision === 'rejected') {
        await this.rejectVerification(submissionId, reviewData);
      } else if (decision === 'additional_info') {
        submission.status = 'pending_additional_info';
        submission.additionalInfoRequired = reviewData.requiredInfo;
      }

      return {
        success: true,
        submissionId,
        status: submission.status,
        decision
      };
    } catch (error) {
      console.error('Review verification error:', error);
      throw error;
    }
  }

  /**
   * Approve verification
   */
  async approveVerification(submissionId, approvalData) {
    const submission = this.pendingVerifications.get(submissionId);
    
    submission.status = 'approved';
    submission.approvedAt = new Date().toISOString();
    submission.approvedBy = approvalData.reviewer;
    submission.verificationLevel = approvalData.verificationLevel || 'identity';
    
    // Generate verification certificate
    submission.certificate = {
      certificateId: this.generateCertificateId(),
      issuedAt: new Date().toISOString(),
      expiresAt: this.calculateExpiry(submission.verificationLevel),
      level: submission.verificationLevel,
      nation: submission.nation
    };

    // In production: Update user record in database
    // await User.updateOne({ walletAddress: submission.userAddress }, {
    //   verificationStatus: 'verified',
    //   verificationLevel: submission.verificationLevel,
    //   verifiedAt: submission.approvedAt
    // });

    return submission;
  }

  /**
   * Reject verification
   */
  async rejectVerification(submissionId, rejectionData) {
    const submission = this.pendingVerifications.get(submissionId);
    
    submission.status = 'rejected';
    submission.rejectedAt = new Date().toISOString();
    submission.rejectedBy = rejectionData.reviewer;
    submission.rejectionReason = rejectionData.reason;
    submission.canReapply = rejectionData.canReapply !== false;
    submission.reapplyAfter = rejectionData.reapplyAfter || Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

    return submission;
  }

  /**
   * Get verification status
   */
  async getVerificationStatus(userAddress) {
    // Find user's verification
    const userVerifications = Array.from(this.pendingVerifications.values())
      .filter(v => v.userAddress === userAddress)
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    const latestVerification = userVerifications[0];

    if (!latestVerification) {
      return {
        verified: false,
        status: 'not_submitted',
        level: null,
        message: 'No verification submitted'
      };
    }

    return {
      verified: latestVerification.status === 'approved',
      status: latestVerification.status,
      level: latestVerification.verificationLevel,
      submissionId: latestVerification.submissionId,
      submittedAt: latestVerification.submittedAt,
      expiresAt: latestVerification.certificate?.expiresAt,
      nation: latestVerification.nation,
      history: userVerifications.map(v => ({
        submissionId: v.submissionId,
        status: v.status,
        submittedAt: v.submittedAt,
        level: v.verificationLevel
      }))
    };
  }

  /**
   * Verify Indigenous heritage specifically
   */
  async verifyHeritage(userAddress, heritageData) {
    const {
      nation,
      clan,
      verificationMethod,
      supportingDocuments,
      elderReference
    } = heritageData;

    // Validate verification method
    const method = this.verificationMethods.get(verificationMethod);
    if (!method) {
      throw new Error('Invalid verification method');
    }

    const heritageVerification = {
      submissionId: this.generateSubmissionId(),
      userAddress,
      type: 'heritage',
      nation,
      clan,
      verificationMethod,
      methodReliability: method.reliability,
      documents: supportingDocuments,
      elderReference,
      status: 'pending_elder_review',
      submittedAt: new Date().toISOString()
    };

    this.pendingVerifications.set(heritageVerification.submissionId, heritageVerification);

    // Notify elder for review
    await this.notifyElderForReview(heritageVerification);

    return {
      success: true,
      submissionId: heritageVerification.submissionId,
      status: 'pending_elder_review',
      message: 'Heritage verification submitted for elder review'
    };
  }

  /**
   * Elder reviews heritage claim
   */
  async elderReviewHeritage(submissionId, elderAddress, reviewData) {
    const submission = this.pendingVerifications.get(submissionId);
    
    if (!submission) {
      throw new Error('Submission not found');
    }

    const { decision, confidence, notes, communityStanding } = reviewData;

    submission.elderReview = {
      elderAddress,
      decision,
      confidence,
      notes,
      communityStanding,
      reviewedAt: new Date().toISOString()
    };

    if (decision === 'confirmed') {
      submission.status = 'approved';
      submission.verificationLevel = 'heritage';
      submission.certificate = {
        certificateId: this.generateCertificateId(),
        issuedAt: new Date().toISOString(),
        type: 'heritage_verification',
        nation: submission.nation,
        verifiedBy: elderAddress
      };
    } else {
      submission.status = 'rejected';
      submission.rejectionReason = 'Elder could not confirm heritage claim';
    }

    return submission;
  }

  /**
   * Assess risk of verification
   */
  async assessRisk(userAddress, verificationData) {
    const riskFactors = [];
    let riskScore = 0;

    // Check for suspicious patterns
    if (verificationData.documents.length < 2) {
      riskFactors.push({ factor: 'insufficient_documents', weight: 10 });
      riskScore += 10;
    }

    // Check document quality
    const lowQualityDocs = verificationData.documents.filter(d => d.quality === 'low').length;
    if (lowQualityDocs > 0) {
      riskFactors.push({ factor: 'low_quality_documents', weight: lowQualityDocs * 5 });
      riskScore += lowQualityDocs * 5;
    }

    // Check for inconsistencies
    if (verificationData.personalInfo.name !== verificationData.documents[0]?.nameOnDocument) {
      riskFactors.push({ factor: 'name_mismatch', weight: 20 });
      riskScore += 20;
    }

    // Geographic risk (simplified)
    const highRiskRegions = ['XX', 'YY']; // Example region codes
    if (highRiskRegions.includes(verificationData.personalInfo.region)) {
      riskFactors.push({ factor: 'geographic_risk', weight: 15 });
      riskScore += 15;
    }

    return {
      score: Math.min(100, riskScore),
      level: riskScore < 30 ? 'low' : riskScore < 70 ? 'medium' : 'high',
      factors: riskFactors
    };
  }

  /**
   * Verify document authenticity
   */
  async verifyDocumentAuthenticity(document) {
    // In production, integrate with document verification services
    // For now, simulate verification
    
    const checks = {
      tamperingCheck: Math.random() > 0.1, // 90% pass
      formatValidation: Math.random() > 0.05, // 95% pass
      crossReference: Math.random() > 0.2, // 80% pass
      expirationCheck: true
    };

    const passedChecks = Object.values(checks).filter(v => v).length;
    const totalChecks = Object.values(checks).length;

    return {
      authentic: passedChecks === totalChecks,
      confidence: (passedChecks / totalChecks) * 100,
      checks,
      warnings: passedChecks < totalChecks ? ['Some verification checks failed'] : []
    };
  }

  /**
   * Get verification statistics
   */
  async getVerificationStats() {
    const allVerifications = Array.from(this.pendingVerifications.values());
    
    return {
      totalSubmitted: allVerifications.length,
      pending: allVerifications.filter(v => v.status === 'pending').length,
      approved: allVerifications.filter(v => v.status === 'approved').length,
      rejected: allVerifications.filter(v => v.status === 'rejected').length,
      byLevel: {
        basic: allVerifications.filter(v => v.verificationLevel === 'basic').length,
        identity: allVerifications.filter(v => v.verificationLevel === 'identity').length,
        heritage: allVerifications.filter(v => v.verificationLevel === 'heritage').length,
        elder: allVerifications.filter(v => v.verificationLevel === 'elder').length,
        master: allVerifications.filter(v => v.verificationLevel === 'master').length
      },
      byNation: this.groupByNation(allVerifications),
      averageReviewTime: '2.3 days',
      approvalRate: Math.round(
        (allVerifications.filter(v => v.status === 'approved').length / allVerifications.length) * 100
      ) || 0
    };
  }

  /**
   * Revoke verification
   */
  async revokeVerification(userAddress, revocationData) {
    const { reason, revokedBy, evidence } = revocationData;

    // In production: Update user record
    // await User.updateOne({ walletAddress: userAddress }, {
    //   verificationStatus: 'revoked',
    //   verificationRevokedAt: new Date(),
    //   verificationRevokedBy: revokedBy,
    //   verificationRevocationReason: reason
    // });

    return {
      success: true,
      userAddress,
      revoked: true,
      reason,
      revokedAt: new Date().toISOString(),
      canReapply: false
    };
  }

  // Helper methods
  generateSubmissionId() {
    return `KYC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  generateCertificateId() {
    return `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  hashData(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  getEstimatedReviewTime(verificationType) {
    const times = {
      basic: '24 hours',
      identity: '2-3 business days',
      heritage: '5-7 business days',
      elder: '7-10 business days',
      master: '10-14 business days'
    };
    return times[verificationType] || '3-5 business days';
  }

  getNextSteps(verificationType) {
    const steps = {
      basic: ['Wait for email confirmation'],
      identity: ['Document review in progress', 'May require video call'],
      heritage: ['Assigned to elder review panel', 'Community verification pending'],
      elder: ['Scheduled for elder council review', 'Artistic portfolio evaluation'],
      master: ['Master artist committee review', 'In-person evaluation may be required']
    };
    return steps[verificationType] || ['Under review'];
  }

  calculateExpiry(level) {
    const durations = {
      basic: 365, // 1 year
      identity: 730, // 2 years
      heritage: 1095, // 3 years
      elder: 1825, // 5 years
      master: 3650 // 10 years
    };
    
    const days = durations[level] || 365;
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
  }

  async notifyElderForReview(verification) {
    // In production: Send notification to elder
    console.log(`Elder notification sent for heritage verification: ${verification.submissionId}`);
  }

  groupByNation(verifications) {
    const grouped = {};
    verifications.forEach(v => {
      if (v.nation) {
        grouped[v.nation] = (grouped[v.nation] || 0) + 1;
      }
    });
    return grouped;
  }
}

module.exports = new KYCVerificationService();
