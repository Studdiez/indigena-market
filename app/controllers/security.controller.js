/**
 * Security Controller
 * Provides endpoints for:
 * - KYC/Identity Verification
 * - Elder Digital Signatures
 * - Blockchain Audit Trails
 * - GDPR Compliance
 * - Fraud Detection
 */

const kycService = require('../services/security/kycVerification.service.js');
const elderSignature = require('../services/security/elderSignature.service.js');
const auditTrail = require('../services/security/auditTrail.service.js');
const gdprService = require('../services/security/gdprCompliance.service.js');
const fraudDetection = require('../services/security/fraudDetection.service.js');

// ==================== KYC/IDENTITY VERIFICATION ====================

exports.submitVerification = async (req, res) => {
  try {
    const { address } = req.params;
    const verificationData = req.body;

    const result = await kycService.submitVerification(address, verificationData);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Submit verification error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.reviewVerification = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const reviewData = req.body;

    const result = await kycService.reviewVerification(submissionId, reviewData);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Review verification error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getVerificationStatus = async (req, res) => {
  try {
    const { address } = req.params;

    const status = await kycService.getVerificationStatus(address);

    res.status(200).json({
      success: true,
      ...status
    });
  } catch (error) {
    console.error('Get verification status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitHeritageVerification = async (req, res) => {
  try {
    const { address } = req.params;
    const heritageData = req.body;

    const result = await kycService.verifyHeritage(address, heritageData);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Heritage verification error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.elderReviewHeritage = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { elderAddress } = req.params;
    const reviewData = req.body;

    const result = await kycService.elderReviewHeritage(submissionId, elderAddress, reviewData);

    res.status(200).json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Elder review error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getVerificationStats = async (req, res) => {
  try {
    const stats = await kycService.getVerificationStats();

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get verification stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.revokeVerification = async (req, res) => {
  try {
    const { address } = req.params;
    const revocationData = req.body;

    const result = await kycService.revokeVerification(address, revocationData);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Revoke verification error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ELDER DIGITAL SIGNATURES ====================

exports.requestElderApproval = async (req, res) => {
  try {
    const requestData = req.body;

    const result = await elderSignature.requestApproval(requestData);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Request elder approval error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.elderSign = async (req, res) => {
  try {
    const { approvalId } = req.params;
    const { elderAddress } = req.params;
    const signData = req.body;

    const result = await elderSignature.elderSign(approvalId, elderAddress, signData);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Elder sign error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.requestMultiElderApproval = async (req, res) => {
  try {
    const requestData = req.body;

    const result = await elderSignature.requestMultiElderApproval(requestData);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Multi-elder approval error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.checkMultiSignatureStatus = async (req, res) => {
  try {
    const { approvalId } = req.params;

    const result = await elderSignature.checkMultiSignatureStatus(approvalId);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Check multi-signature error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getApprovalStatus = async (req, res) => {
  try {
    const { approvalId } = req.params;

    const result = await elderSignature.getApprovalStatus(approvalId);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get approval status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyContentIntegrity = async (req, res) => {
  try {
    const { approvalId } = req.params;
    const currentContent = req.body;

    const result = await elderSignature.verifyContentIntegrity(approvalId, currentContent);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Verify content integrity error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getElderProfile = async (req, res) => {
  try {
    const { elderAddress } = req.params;

    const profile = await elderSignature.getElderProfile(elderAddress);

    res.status(200).json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Get elder profile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.listElders = async (req, res) => {
  try {
    const filters = req.query;

    const elders = await elderSignature.listElders(filters);

    res.status(200).json({
      success: true,
      elders
    });
  } catch (error) {
    console.error('List elders error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getApprovalStats = async (req, res) => {
  try {
    const stats = await elderSignature.getApprovalStats();

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get approval stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== BLOCKCHAIN AUDIT TRAIL ====================

exports.logEvent = async (req, res) => {
  try {
    const eventData = req.body;

    const result = await auditTrail.logEvent(eventData);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Log event error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAuditTrail = async (req, res) => {
  try {
    const { resourceType, resourceId } = req.params;
    const options = req.query;

    const result = await auditTrail.getAuditTrail(resourceType, resourceId, options);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get audit trail error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserAuditTrail = async (req, res) => {
  try {
    const { address } = req.params;
    const options = req.query;

    const result = await auditTrail.getUserAuditTrail(address, options);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get user audit trail error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyLog = async (req, res) => {
  try {
    const { logId } = req.params;

    const result = await auditTrail.verifyLog(logId);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Verify log error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createSnapshot = async (req, res) => {
  try {
    const snapshotData = req.body;

    const result = await auditTrail.createSnapshot(snapshotData);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Create snapshot error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.generateComplianceReport = async (req, res) => {
  try {
    const reportOptions = req.body;

    const result = await auditTrail.generateComplianceReport(reportOptions);

    res.status(200).json({
      success: true,
      report: result
    });
  } catch (error) {
    console.error('Generate compliance report error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.searchAuditLogs = async (req, res) => {
  try {
    const searchCriteria = req.body;

    const result = await auditTrail.searchAuditLogs(searchCriteria);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Search audit logs error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.archiveOldLogs = async (req, res) => {
  try {
    const result = await auditTrail.archiveOldLogs();

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Archive logs error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== GDPR COMPLIANCE ====================

exports.recordConsent = async (req, res) => {
  try {
    const { address } = req.params;
    const consentData = req.body;

    const result = await gdprService.recordConsent(address, consentData);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Record consent error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.withdrawConsent = async (req, res) => {
  try {
    const { address } = req.params;
    const withdrawalData = req.body;

    const result = await gdprService.withdrawConsent(address, withdrawalData);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Withdraw consent error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getConsentStatus = async (req, res) => {
  try {
    const { address } = req.params;

    const result = await gdprService.getConsentStatus(address);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get consent status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.handleDataAccessRequest = async (req, res) => {
  try {
    const { address } = req.params;

    const result = await gdprService.handleDataAccessRequest(address);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Data access request error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.handleDataPortabilityRequest = async (req, res) => {
  try {
    const { address } = req.params;
    const { format = 'json' } = req.query;

    const result = await gdprService.handleDataPortabilityRequest(address, format);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Data portability error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.handleDataDeletionRequest = async (req, res) => {
  try {
    const { address } = req.params;
    const deletionData = req.body;

    const result = await gdprService.handleDataDeletionRequest(address, deletionData);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Data deletion error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.handleDataRectification = async (req, res) => {
  try {
    const { address } = req.params;
    const rectificationData = req.body;

    const result = await gdprService.handleDataRectification(address, rectificationData);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Data rectification error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.recordProcessingActivity = async (req, res) => {
  try {
    const activityData = req.body;

    const result = await gdprService.recordProcessingActivity(activityData);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Record processing activity error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.checkProcessingLawful = async (req, res) => {
  try {
    const { address } = req.params;
    const { processingType, dataCategory } = req.body;

    const result = await gdprService.isProcessingLawful(address, processingType, dataCategory);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Check processing lawful error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.generatePrivacyReport = async (req, res) => {
  try {
    const report = await gdprService.generatePrivacyReport();

    res.status(200).json({
      success: true,
      report
    });
  } catch (error) {
    console.error('Generate privacy report error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.handleDataBreach = async (req, res) => {
  try {
    const breachData = req.body;

    const result = await gdprService.handleDataBreach(breachData);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Handle data breach error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== FRAUD DETECTION ====================

exports.analyzeTransaction = async (req, res) => {
  try {
    const transactionData = req.body;

    const result = await fraudDetection.analyzeTransaction(transactionData);

    res.status(200).json({
      success: true,
      analysis: result
    });
  } catch (error) {
    console.error('Analyze transaction error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.analyzeAccount = async (req, res) => {
  try {
    const { address } = req.params;

    const result = await fraudDetection.analyzeAccount(address);

    res.status(200).json({
      success: true,
      analysis: result
    });
  } catch (error) {
    console.error('Analyze account error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.analyzeContent = async (req, res) => {
  try {
    const contentData = req.body;

    const result = await fraudDetection.analyzeContent(contentData);

    res.status(200).json({
      success: true,
      analysis: result
    });
  } catch (error) {
    console.error('Analyze content error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.monitorSuspiciousActivity = async (req, res) => {
  try {
    const result = await fraudDetection.monitorSuspiciousActivity();

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Monitor suspicious activity error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.reportSuspiciousActivity = async (req, res) => {
  try {
    const reportData = req.body;

    const result = await fraudDetection.reportSuspiciousActivity(reportData);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Report suspicious activity error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFraudStatistics = async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;

    const result = await fraudDetection.getFraudStatistics(timeframe);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get fraud statistics error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserRiskScore = async (req, res) => {
  try {
    const { address } = req.params;

    const result = await fraudDetection.analyzeAccount(address);

    res.status(200).json({
      success: true,
      userAddress: address,
      riskScore: result.riskScore,
      riskLevel: result.riskLevel,
      flags: result.flags
    });
  } catch (error) {
    console.error('Get user risk score error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== COMBINED SECURITY ====================

exports.getSecurityOverview = async (req, res) => {
  try {
    const [
      verificationStats,
      fraudStats,
      privacyReport
    ] = await Promise.all([
      kycService.getVerificationStats(),
      fraudDetection.getFraudStatistics('30d'),
      gdprService.generatePrivacyReport()
    ]);

    res.status(200).json({
      success: true,
      overview: {
        verification: verificationStats,
        fraud: fraudStats,
        privacy: privacyReport,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Security overview error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
