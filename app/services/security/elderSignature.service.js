/**
 * Elder Digital Signature Service
 * Special approval workflows for sacred content and heritage verification
 */

const crypto = require('crypto');

class ElderSignatureService {
  constructor() {
    this.elders = new Map(); // Registered elders
    this.pendingApprovals = new Map();
    this.approvalHistory = new Map();
    this.sacredContentTypes = new Set([
      'ceremonial_item',
      'sacred_symbol',
      'religious_artifact',
      'traditional_medicine',
      'spiritual_artwork',
      'restricted_knowledge'
    ]);
    this.initializeElders();
  }

  initializeElders() {
    // Mock registered elders - in production, this comes from database
    const mockElders = [
      {
        address: 'rElder1NavajoXXXXXXXXXXXXXXXXXXX',
        name: 'Grandmother Sarah Begay',
        nation: 'Navajo',
        clans: ['Towering House', 'Red Running Into Water'],
        role: 'Hataałii',
        expertise: ['weaving', 'sandpainting', 'healing'],
        verifiedSince: '2023-01-15',
        approvalsGiven: 45,
        status: 'active'
      },
      {
        address: 'rElder2CherokeeXXXXXXXXXXXXXXXXX',
        name: 'Chief William Crow',
        nation: 'Cherokee',
        clans: ['Wolf', 'Blue'],
        role: 'Beloved Man',
        expertise: ['pottery', 'language', 'history'],
        verifiedSince: '2023-02-20',
        approvalsGiven: 32,
        status: 'active'
      },
      {
        address: 'rElder3HopiXXXXXXXXXXXXXXXXXXXX',
        name: 'Loren Kootswatewa',
        nation: 'Hopi',
        clans: ['Bear', 'Spider'],
        role: 'Kikmongwi',
        expertise: ['kachina', 'pottery', 'agriculture'],
        verifiedSince: '2023-03-10',
        approvalsGiven: 28,
        status: 'active'
      }
    ];

    mockElders.forEach(elder => {
      this.elders.set(elder.address, elder);
    });
  }

  /**
   * Request elder approval for content
   */
  async requestApproval(requestData) {
    try {
      const {
        contentId,
        contentType,
        contentData,
        artistAddress,
        requestedElder,
        reason,
        urgency = 'normal'
      } = requestData;

      // Validate content type
      if (!this.sacredContentTypes.has(contentType)) {
        return {
          success: false,
          message: 'Content type does not require elder approval'
        };
      }

      // Check if elder is available
      const elder = this.elders.get(requestedElder);
      if (!elder || elder.status !== 'active') {
        // Find alternative elder from same nation
        const alternativeElder = this.findAlternativeElder(contentData.nation);
        if (!alternativeElder) {
          throw new Error('No qualified elder available for this content');
        }
        requestData.requestedElder = alternativeElder.address;
      }

      const approvalRequest = {
        approvalId: this.generateApprovalId(),
        contentId,
        contentType,
        contentData: {
          ...contentData,
          // Store hash of content for verification
          contentHash: this.hashContent(contentData)
        },
        artistAddress,
        requestedElder: requestData.requestedElder,
        reason,
        urgency,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        reviewDeadline: this.calculateDeadline(urgency),
        signatures: [],
        history: []
      };

      this.pendingApprovals.set(approvalRequest.approvalId, approvalRequest);

      // Notify elder
      await this.notifyElder(approvalRequest);

      return {
        success: true,
        approvalId: approvalRequest.approvalId,
        status: 'pending',
        assignedElder: requestData.requestedElder,
        estimatedResponse: this.getEstimatedResponse(urgency),
        message: 'Elder approval requested'
      };
    } catch (error) {
      console.error('Request approval error:', error);
      throw error;
    }
  }

  /**
   * Elder reviews and signs approval
   */
  async elderSign(approvalId, elderAddress, signData) {
    try {
      const approval = this.pendingApprovals.get(approvalId);
      if (!approval) {
        throw new Error('Approval request not found');
      }

      // Verify elder is authorized
      if (approval.requestedElder !== elderAddress) {
        throw new Error('Unauthorized elder');
      }

      const elder = this.elders.get(elderAddress);
      if (!elder) {
        throw new Error('Elder not found');
      }

      const { decision, notes, conditions, digitalSignature } = signData;

      // Validate signature
      const isValidSignature = await this.verifyElderSignature(
        elderAddress,
        approval.contentData.contentHash,
        digitalSignature
      );

      if (!isValidSignature) {
        throw new Error('Invalid digital signature');
      }

      const signature = {
        elderAddress,
        elderName: elder.name,
        elderNation: elder.nation,
        decision,
        notes,
        conditions: conditions || [],
        signatureHash: digitalSignature,
        signedAt: new Date().toISOString()
      };

      approval.signatures.push(signature);
      approval.history.push({
        action: 'signed',
        by: elderAddress,
        decision,
        timestamp: new Date().toISOString()
      });

      // Update approval status
      if (decision === 'approved') {
        approval.status = 'approved';
        approval.approvedAt = new Date().toISOString();
        
        // Update elder stats
        elder.approvalsGiven++;
        
        // Store in history
        this.addToHistory(approval);
      } else if (decision === 'rejected') {
        approval.status = 'rejected';
        approval.rejectedAt = new Date().toISOString();
        approval.rejectionReason = notes;
      } else if (decision === 'requires_additional_review') {
        approval.status = 'additional_review_required';
        // Request second elder opinion
        await this.requestSecondOpinion(approval);
      }

      // Notify artist
      await this.notifyArtist(approval);

      return {
        success: true,
        approvalId,
        status: approval.status,
        decision,
        signedBy: elder.name,
        signedAt: signature.signedAt
      };
    } catch (error) {
      console.error('Elder sign error:', error);
      throw error;
    }
  }

  /**
   * Multi-signature approval (requires multiple elders)
   */
  async requestMultiElderApproval(requestData) {
    const {
      contentId,
      contentType,
      contentData,
      artistAddress,
      requiredSignatures = 2,
      nations = []
    } = requestData;

    // Find qualified elders from specified nations
    const qualifiedElders = this.findQualifiedElders(nations, contentType);
    
    if (qualifiedElders.length < requiredSignatures) {
      throw new Error(`Not enough qualified elders. Required: ${requiredSignatures}, Available: ${qualifiedElders.length}`);
    }

    const multiApproval = {
      approvalId: this.generateApprovalId(),
      contentId,
      contentType,
      contentData,
      artistAddress,
      requiredSignatures,
      assignedElders: qualifiedElders.slice(0, requiredSignatures + 1), // +1 for backup
      signatures: [],
      status: 'pending_multi',
      submittedAt: new Date().toISOString(),
      reviewDeadline: this.calculateDeadline('high')
    };

    this.pendingApprovals.set(multiApproval.approvalId, multiApproval);

    // Notify all assigned elders
    for (const elder of multiApproval.assignedElders) {
      await this.notifyElder({
        ...multiApproval,
        requestedElder: elder.address
      });
    }

    return {
      success: true,
      approvalId: multiApproval.approvalId,
      status: 'pending_multi',
      requiredSignatures,
      assignedElders: multiApproval.assignedElders.map(e => ({
        address: e.address,
        name: e.name,
        nation: e.nation
      }))
    };
  }

  /**
   * Check multi-signature status
   */
  async checkMultiSignatureStatus(approvalId) {
    const approval = this.pendingApprovals.get(approvalId);
    if (!approval) {
      throw new Error('Approval not found');
    }

    const approvedSignatures = approval.signatures.filter(s => s.decision === 'approved').length;
    const rejectedSignatures = approval.signatures.filter(s => s.decision === 'rejected').length;

    let status = approval.status;
    
    if (approvedSignatures >= approval.requiredSignatures) {
      status = 'approved';
      approval.status = 'approved';
      approval.approvedAt = new Date().toISOString();
    } else if (rejectedSignatures > (approval.assignedElders.length - approval.requiredSignatures)) {
      status = 'rejected';
      approval.status = 'rejected';
    }

    return {
      approvalId,
      status,
      requiredSignatures: approval.requiredSignatures,
      currentSignatures: {
        approved: approvedSignatures,
        rejected: rejectedSignatures,
        pending: approval.assignedElders.length - approval.signatures.length
      },
      signatures: approval.signatures.map(s => ({
        elder: s.elderName,
        nation: s.elderNation,
        decision: s.decision,
        signedAt: s.signedAt
      }))
    };
  }

  /**
   * Get approval status
   */
  async getApprovalStatus(approvalId) {
    const approval = this.pendingApprovals.get(approvalId);
    if (!approval) {
      // Check history
      const historyApproval = this.approvalHistory.get(approvalId);
      if (historyApproval) {
        return {
          approvalId,
          status: historyApproval.status,
          completed: true,
          result: historyApproval
        };
      }
      throw new Error('Approval not found');
    }

    return {
      approvalId,
      status: approval.status,
      contentType: approval.contentType,
      submittedAt: approval.submittedAt,
      reviewDeadline: approval.reviewDeadline,
      signatures: approval.signatures,
      completed: ['approved', 'rejected'].includes(approval.status)
    };
  }

  /**
   * Verify content hasn't been altered after approval
   */
  async verifyContentIntegrity(approvalId, currentContent) {
    const approval = this.approvalHistory.get(approvalId) || this.pendingApprovals.get(approvalId);
    if (!approval) {
      throw new Error('Approval not found');
    }

    const currentHash = this.hashContent(currentContent);
    const originalHash = approval.contentData.contentHash;

    return {
      approvalId,
      integrityVerified: currentHash === originalHash,
      originalHash,
      currentHash,
      approvedAt: approval.approvedAt,
      approvedBy: approval.signatures.map(s => s.elderName)
    };
  }

  /**
   * Get elder profile
   */
  async getElderProfile(elderAddress) {
    const elder = this.elders.get(elderAddress);
    if (!elder) {
      throw new Error('Elder not found');
    }

    return {
      address: elder.address,
      name: elder.name,
      nation: elder.nation,
      clans: elder.clans,
      role: elder.role,
      expertise: elder.expertise,
      verifiedSince: elder.verifiedSince,
      approvalsGiven: elder.approvalsGiven,
      status: elder.status,
      currentPendingApprovals: this.getElderPendingCount(elderAddress)
    };
  }

  /**
   * List all registered elders
   */
  async listElders(filters = {}) {
    const { nation, expertise, status = 'active' } = filters;
    
    let elders = Array.from(this.elders.values());
    
    if (nation) {
      elders = elders.filter(e => e.nation.toLowerCase() === nation.toLowerCase());
    }
    
    if (expertise) {
      elders = elders.filter(e => e.expertise.includes(expertise));
    }
    
    if (status) {
      elders = elders.filter(e => e.status === status);
    }

    return elders.map(e => ({
      address: e.address,
      name: e.name,
      nation: e.nation,
      role: e.role,
      expertise: e.expertise,
      status: e.status
    }));
  }

  /**
   * Get approval statistics
   */
  async getApprovalStats() {
    const allApprovals = Array.from(this.pendingApprovals.values());
    const allHistory = Array.from(this.approvalHistory.values());
    const all = [...allApprovals, ...allHistory];

    return {
      totalRequests: all.length,
      pending: allApprovals.filter(a => a.status === 'pending' || a.status === 'pending_multi').length,
      approved: all.filter(a => a.status === 'approved').length,
      rejected: all.filter(a => a.status === 'rejected').length,
      byContentType: this.groupByContentType(all),
      byNation: this.groupByNation(all),
      averageResponseTime: '3.2 days',
      elderUtilization: this.calculateElderUtilization()
    };
  }

  // Helper methods
  generateApprovalId() {
    return `ELD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  hashContent(content) {
    return crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex');
  }

  calculateDeadline(urgency) {
    const hours = {
      low: 168,      // 7 days
      normal: 72,    // 3 days
      high: 24,      // 1 day
      urgent: 4      // 4 hours
    };
    
    return new Date(Date.now() + (hours[urgency] || 72) * 60 * 60 * 1000).toISOString();
  }

  getEstimatedResponse(urgency) {
    const times = {
      low: '5-7 days',
      normal: '2-3 days',
      high: '24 hours',
      urgent: '4 hours'
    };
    return times[urgency] || '2-3 days';
  }

  findAlternativeElder(nation) {
    for (const [address, elder] of this.elders) {
      if (elder.nation.toLowerCase() === nation?.toLowerCase() && elder.status === 'active') {
        return elder;
      }
    }
    return null;
  }

  findQualifiedElders(nations, contentType) {
    const qualified = [];
    for (const [address, elder] of this.elders) {
      if (elder.status !== 'active') continue;
      if (nations.length > 0 && !nations.includes(elder.nation)) continue;
      qualified.push(elder);
    }
    return qualified;
  }

  async verifyElderSignature(elderAddress, contentHash, signature) {
    // In production: Verify cryptographic signature
    return true;
  }

  async notifyElder(approval) {
    console.log(`Elder ${approval.requestedElder} notified for approval: ${approval.approvalId}`);
  }

  async notifyArtist(approval) {
    console.log(`Artist ${approval.artistAddress} notified of approval status: ${approval.status}`);
  }

  async requestSecondOpinion(approval) {
    console.log(`Second opinion requested for: ${approval.approvalId}`);
  }

  addToHistory(approval) {
    this.approvalHistory.set(approval.approvalId, approval);
    this.pendingApprovals.delete(approval.approvalId);
  }

  getElderPendingCount(elderAddress) {
    return Array.from(this.pendingApprovals.values())
      .filter(a => a.requestedElder === elderAddress && a.status === 'pending')
      .length;
  }

  groupByContentType(approvals) {
    const grouped = {};
    approvals.forEach(a => {
      grouped[a.contentType] = (grouped[a.contentType] || 0) + 1;
    });
    return grouped;
  }

  groupByNation(approvals) {
    const grouped = {};
    approvals.forEach(a => {
      const nation = a.contentData?.nation || 'Unknown';
      grouped[nation] = (grouped[nation] || 0) + 1;
    });
    return grouped;
  }

  calculateElderUtilization() {
    const utilization = {};
    for (const [address, elder] of this.elders) {
      utilization[elder.name] = {
        pending: this.getElderPendingCount(address),
        total: elder.approvalsGiven
      };
    }
    return utilization;
  }
}

module.exports = new ElderSignatureService();
