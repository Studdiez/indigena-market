/**
 * Escrow Service
 * Secure INDI token escrow for marketplace transactions
 */

const indiToken = require('./indiToken.service.js');

class EscrowService {
  constructor() {
    this.escrows = new Map();
    this.disputes = new Map();
    this.arbitrators = new Map();
    this.initializeArbitrators();
  }

  initializeArbitrators() {
    // Platform-approved arbitrators (elders, trusted community members)
    const arbitrators = [
      {
        address: 'rArbitrator1XXXXXXXXXXXXXXXXXXXX',
        name: 'Elder Council Representative',
        reputation: 100,
        casesHandled: 0,
        fee: 0.02 // 2% of escrow amount
      },
      {
        address: 'rArbitrator2XXXXXXXXXXXXXXXXXXXX',
        name: 'Community Moderator',
        reputation: 95,
        casesHandled: 0,
        fee: 0.015
      }
    ];

    arbitrators.forEach(a => {
      this.arbitrators.set(a.address, a);
    });
  }

  /**
   * Create new escrow
   */
  async createEscrow(buyer, seller, amount, terms) {
    try {
      // Verify buyer has sufficient INDI
      const buyerWallet = await indiToken.getWallet(buyer);
      const fee = indiToken.getPlatformFee('escrow_create');
      const totalRequired = amount + fee;

      if (buyerWallet.wallet.balance < totalRequired) {
        throw new Error(`Insufficient INDI balance. Required: ${totalRequired} INDI`);
      }

      const escrow = {
        escrowId: this.generateEscrowId(),
        buyer: buyer,
        seller: seller,
        amount: amount,
        fee: fee,
        status: 'funded', // 'funded', 'delivered', 'completed', 'disputed', 'refunded', 'cancelled'
        terms: {
          description: terms.description,
          deliveryDeadline: terms.deliveryDeadline,
          inspectionPeriod: terms.inspectionPeriod || 7, // days
          conditions: terms.conditions || []
        },
        timeline: {
          createdAt: new Date().toISOString(),
          fundedAt: new Date().toISOString(),
          deliveredAt: null,
          completedAt: null,
          disputedAt: null
        },
        dispute: null,
        releases: {
          buyerApproved: false,
          sellerApproved: false,
          autoReleaseDate: null
        }
      };

      // Lock buyer's INDI
      await indiToken.transfer(buyer, 'escrow_hold', amount + fee, `Escrow ${escrow.escrowId}`);

      this.escrows.set(escrow.escrowId, escrow);

      return {
        success: true,
        escrowId: escrow.escrowId,
        status: escrow.status,
        amount: amount,
        fee: fee,
        message: 'Escrow created and funded successfully'
      };
    } catch (error) {
      console.error('Create escrow error:', error);
      throw error;
    }
  }

  /**
   * Mark item as delivered
   */
  async markDelivered(escrowId, seller) {
    try {
      const escrow = this.escrows.get(escrowId);
      if (!escrow) throw new Error('Escrow not found');
      if (escrow.seller !== seller) throw new Error('Not the seller');
      if (escrow.status !== 'funded') throw new Error('Escrow not in funded state');

      escrow.status = 'delivered';
      escrow.timeline.deliveredAt = new Date().toISOString();
      escrow.releases.autoReleaseDate = new Date(
        Date.now() + escrow.terms.inspectionPeriod * 24 * 60 * 60 * 1000
      ).toISOString();

      return {
        success: true,
        escrowId: escrowId,
        status: 'delivered',
        inspectionDeadline: escrow.releases.autoReleaseDate,
        message: 'Item marked as delivered. Buyer has inspection period to approve or dispute.'
      };
    } catch (error) {
      console.error('Mark delivered error:', error);
      throw error;
    }
  }

  /**
   * Buyer approves and releases funds
   */
  async releaseFunds(escrowId, buyer) {
    try {
      const escrow = this.escrows.get(escrowId);
      if (!escrow) throw new Error('Escrow not found');
      if (escrow.buyer !== buyer) throw new Error('Not the buyer');
      if (escrow.status !== 'delivered') throw new Error('Item not yet delivered');

      // Calculate fees
      const releaseFee = indiToken.getPlatformFee('escrow_release', escrow.amount);
      const sellerAmount = escrow.amount - releaseFee;

      // Transfer to seller
      await indiToken.transfer('escrow_hold', escrow.seller, sellerAmount, `Escrow release ${escrowId}`);
      
      // Burn platform fee
      await indiToken.burnTokens('escrow_hold', releaseFee, 'escrow_platform_fee');

      escrow.status = 'completed';
      escrow.timeline.completedAt = new Date().toISOString();
      escrow.releases.buyerApproved = true;

      return {
        success: true,
        escrowId: escrowId,
        status: 'completed',
        sellerReceived: sellerAmount,
        platformFee: releaseFee,
        message: 'Funds released to seller successfully'
      };
    } catch (error) {
      console.error('Release funds error:', error);
      throw error;
    }
  }

  /**
   * Auto-release after inspection period
   */
  async autoRelease(escrowId) {
    try {
      const escrow = this.escrows.get(escrowId);
      if (!escrow) throw new Error('Escrow not found');
      if (escrow.status !== 'delivered') return { skipped: true };

      const autoReleaseDate = new Date(escrow.releases.autoReleaseDate);
      if (autoReleaseDate > new Date()) {
        return { skipped: true, releaseDate: escrow.releases.autoReleaseDate };
      }

      // Auto-release funds
      const releaseFee = indiToken.getPlatformFee('escrow_release', escrow.amount);
      const sellerAmount = escrow.amount - releaseFee;

      await indiToken.transfer('escrow_hold', escrow.seller, sellerAmount, `Escrow auto-release ${escrowId}`);
      await indiToken.burnTokens('escrow_hold', releaseFee, 'escrow_platform_fee');

      escrow.status = 'completed';
      escrow.timeline.completedAt = new Date().toISOString();
      escrow.releases.autoReleased = true;

      return {
        success: true,
        escrowId: escrowId,
        status: 'completed',
        autoReleased: true,
        sellerReceived: sellerAmount
      };
    } catch (error) {
      console.error('Auto release error:', error);
      throw error;
    }
  }

  /**
   * Raise dispute
   */
  async raiseDispute(escrowId, raisedBy, disputeData) {
    try {
      const escrow = this.escrows.get(escrowId);
      if (!escrow) throw new Error('Escrow not found');
      if (escrow.buyer !== raisedBy && escrow.seller !== raisedBy) {
        throw new Error('Not a party to this escrow');
      }
      if (escrow.status !== 'delivered') {
        throw new Error('Can only dispute delivered items');
      }

      const disputeFee = indiToken.getPlatformFee('dispute');
      
      // Check if user has enough for dispute fee
      const wallet = await indiToken.getWallet(raisedBy);
      if (wallet.wallet.balance < disputeFee) {
        throw new Error(`Insufficient balance for dispute fee: ${disputeFee} INDI`);
      }

      // Charge dispute fee
      await indiToken.burnTokens(raisedBy, disputeFee, 'dispute_fee');

      const dispute = {
        disputeId: this.generateDisputeId(),
        escrowId: escrowId,
        raisedBy: raisedBy,
        reason: disputeData.reason,
        description: disputeData.description,
        evidence: disputeData.evidence || [],
        status: 'open', // 'open', 'under_review', 'resolved'
        arbitrator: null,
        resolution: null,
        createdAt: new Date().toISOString(),
        resolvedAt: null
      };

      escrow.status = 'disputed';
      escrow.timeline.disputedAt = dispute.createdAt;
      escrow.dispute = dispute.disputeId;

      this.disputes.set(dispute.disputeId, dispute);

      // Assign arbitrator
      await this.assignArbitrator(dispute.disputeId);

      return {
        success: true,
        disputeId: dispute.disputeId,
        escrowId: escrowId,
        status: 'disputed',
        disputeFee: disputeFee,
        message: 'Dispute raised successfully. An arbitrator will review the case.'
      };
    } catch (error) {
      console.error('Raise dispute error:', error);
      throw error;
    }
  }

  /**
   * Assign arbitrator to dispute
   */
  async assignArbitrator(disputeId) {
    const dispute = this.disputes.get(disputeId);
    if (!dispute) throw new Error('Dispute not found');

    // Find available arbitrator with lowest caseload
    let selectedArbitrator = null;
    let lowestCases = Infinity;

    for (const [address, arbitrator] of this.arbitrators) {
      if (arbitrator.casesHandled < lowestCases) {
        lowestCases = arbitrator.casesHandled;
        selectedArbitrator = address;
      }
    }

    if (selectedArbitrator) {
      dispute.arbitrator = selectedArbitrator;
      dispute.status = 'under_review';
      this.arbitrators.get(selectedArbitrator).casesHandled++;
    }

    return { arbitrator: selectedArbitrator };
  }

  /**
   * Resolve dispute
   */
  async resolveDispute(disputeId, arbitrator, resolution) {
    try {
      const dispute = this.disputes.get(disputeId);
      if (!dispute) throw new Error('Dispute not found');
      if (dispute.arbitrator !== arbitrator) throw new Error('Not assigned arbitrator');

      const escrow = this.escrows.get(dispute.escrowId);

      // Calculate distribution
      const arbitratorFee = escrow.amount * this.arbitrators.get(arbitrator).fee;
      let buyerRefund = 0;
      let sellerPayout = 0;

      switch (resolution.outcome) {
        case 'buyer_wins':
          buyerRefund = escrow.amount - arbitratorFee;
          break;
        case 'seller_wins':
          sellerPayout = escrow.amount - arbitratorFee;
          break;
        case 'split':
          buyerRefund = (escrow.amount * resolution.buyerPercent / 100) - (arbitratorFee / 2);
          sellerPayout = (escrow.amount * resolution.sellerPercent / 100) - (arbitratorFee / 2);
          break;
        default:
          throw new Error('Invalid resolution outcome');
      }

      // Execute transfers
      if (buyerRefund > 0) {
        await indiToken.transfer('escrow_hold', escrow.buyer, buyerRefund, `Dispute refund ${disputeId}`);
      }
      if (sellerPayout > 0) {
        await indiToken.transfer('escrow_hold', escrow.seller, sellerPayout, `Dispute payout ${disputeId}`);
      }
      await indiToken.transfer('escrow_hold', arbitrator, arbitratorFee, `Arbitrator fee ${disputeId}`);

      dispute.status = 'resolved';
      dispute.resolution = {
        outcome: resolution.outcome,
        buyerRefund: buyerRefund,
        sellerPayout: sellerPayout,
        arbitratorFee: arbitratorFee,
        reasoning: resolution.reasoning,
        resolvedAt: new Date().toISOString()
      };
      dispute.resolvedAt = dispute.resolution.resolvedAt;

      escrow.status = 'resolved';
      escrow.timeline.completedAt = dispute.resolvedAt;

      return {
        success: true,
        disputeId: disputeId,
        outcome: resolution.outcome,
        buyerRefund: buyerRefund,
        sellerPayout: sellerPayout,
        arbitratorFee: arbitratorFee
      };
    } catch (error) {
      console.error('Resolve dispute error:', error);
      throw error;
    }
  }

  /**
   * Cancel escrow (only if not yet delivered)
   */
  async cancelEscrow(escrowId, requester) {
    try {
      const escrow = this.escrows.get(escrowId);
      if (!escrow) throw new Error('Escrow not found');
      if (escrow.buyer !== requester) throw new Error('Only buyer can cancel');
      if (escrow.status !== 'funded') {
        throw new Error('Can only cancel unfunded escrows');
      }

      // Refund buyer
      await indiToken.transfer('escrow_hold', escrow.buyer, escrow.amount + escrow.fee, `Escrow cancelled ${escrowId}`);

      escrow.status = 'cancelled';
      escrow.timeline.completedAt = new Date().toISOString();

      return {
        success: true,
        escrowId: escrowId,
        status: 'cancelled',
        refunded: escrow.amount + escrow.fee
      };
    } catch (error) {
      console.error('Cancel escrow error:', error);
      throw error;
    }
  }

  /**
   * Get escrow details
   */
  async getEscrow(escrowId, requester) {
    const escrow = this.escrows.get(escrowId);
    if (!escrow) throw new Error('Escrow not found');

    // Only parties can view
    if (escrow.buyer !== requester && escrow.seller !== requester) {
      throw new Error('Not authorized');
    }

    const dispute = escrow.dispute ? this.disputes.get(escrow.dispute) : null;

    return {
      escrowId: escrow.escrowId,
      buyer: escrow.buyer,
      seller: escrow.seller,
      amount: escrow.amount,
      fee: escrow.fee,
      status: escrow.status,
      terms: escrow.terms,
      timeline: escrow.timeline,
      releases: escrow.releases,
      dispute: dispute ? {
        disputeId: dispute.disputeId,
        status: dispute.status,
        raisedBy: dispute.raisedBy,
        reason: dispute.reason
      } : null
    };
  }

  /**
   * Get user's escrows
   */
  async getUserEscrows(address) {
    const escrows = Array.from(this.escrows.values())
      .filter(e => e.buyer === address || e.seller === address)
      .map(e => ({
        escrowId: e.escrowId,
        role: e.buyer === address ? 'buyer' : 'seller',
        counterparty: e.buyer === address ? e.seller : e.buyer,
        amount: e.amount,
        status: e.status,
        createdAt: e.timeline.createdAt
      }));

    return { escrows, total: escrows.length };
  }

  generateEscrowId() {
    return `ESC-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  generateDisputeId() {
    return `DSP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new EscrowService();
