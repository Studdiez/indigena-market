/**
 * Treasury Management Service
 * DAO treasury with multi-sig and budget allocation
 */

class TreasuryService {
  constructor() {
    this.balances = new Map();
    this.transactions = new Map();
    this.budgets = new Map();
    this.allocations = new Map();
    this.approvals = new Map();
    this.initializeTreasury();
  }

  initializeTreasury() {
    // Initialize DAO treasury
    this.balances.set('dao_treasury', {
      INDI: 100000000, // 100M INDI initial
      XRP: 500000,     // 500K XRP
      totalUSD: 16500000 // $16.5M initial
    });

    // Initialize budget categories
    this.budgets.set('development', { allocated: 0, spent: 0, remaining: 0 });
    this.budgets.set('marketing', { allocated: 0, spent: 0, remaining: 0 });
    this.budgets.set('community', { allocated: 0, spent: 0, remaining: 0 });
    this.budgets.set('grants', { allocated: 0, spent: 0, remaining: 0 });
    this.budgets.set('operations', { allocated: 0, spent: 0, remaining: 0 });
    this.budgets.set('reserve', { allocated: 0, spent: 0, remaining: 0 });
  }

  /**
   * Get treasury balance
   */
  async getBalance() {
    const balance = this.balances.get('dao_treasury');
    return {
      success: true,
      treasury: 'dao_treasury',
      balances: balance,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Create spending proposal
   */
  async createSpendingProposal(proposer, proposalData) {
    try {
      const { amount, currency, recipient, category, description, justification } = proposalData;

      // Minimum 3 signatures required for any spending
      const requiredSignatures = this.calculateRequiredSignatures(amount, currency);

      const proposal = {
        proposalId: this.generateId('SPEND'),
        type: 'spending',
        proposer: proposer,
        amount: amount,
        currency: currency,
        recipient: recipient,
        category: category,
        description: description,
        justification: justification,
        status: 'pending',
        requiredSignatures: requiredSignatures,
        signatures: [],
        signedBy: [],
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      };

      this.approvals.set(proposal.proposalId, proposal);

      return {
        success: true,
        proposalId: proposal.proposalId,
        requiredSignatures: requiredSignatures,
        status: 'pending'
      };
    } catch (error) {
      console.error('Create spending proposal error:', error);
      throw error;
    }
  }

  /**
   * Calculate required signatures based on amount
   */
  calculateRequiredSignatures(amount, currency) {
    const usdValue = this.convertToUSD(amount, currency);

    if (usdValue < 1000) return 2;
    if (usdValue < 10000) return 3;
    if (usdValue < 100000) return 5;
    if (usdValue < 1000000) return 7;
    return 10; // Large amounts need more signatures
  }

  /**
   * Convert to USD for threshold calculations
   */
  convertToUSD(amount, currency) {
    const rates = { INDI: 0.15, XRP: 0.62 };
    return amount * (rates[currency] || 1);
  }

  /**
   * Sign spending proposal
   */
  async signProposal(signer, proposalId) {
    try {
      const proposal = this.approvals.get(proposalId);
      if (!proposal) throw new Error('Proposal not found');
      if (proposal.status !== 'pending') throw new Error('Proposal not pending');
      if (proposal.signedBy.includes(signer)) {
        throw new Error('Already signed');
      }

      proposal.signatures.push({
        signer: signer,
        timestamp: new Date().toISOString()
      });
      proposal.signedBy.push(signer);

      // Check if enough signatures
      if (proposal.signatures.length >= proposal.requiredSignatures) {
        proposal.status = 'approved';
        proposal.approvedAt = new Date().toISOString();

        // Execute the spend
        await this.executeSpend(proposal);
      }

      return {
        success: true,
        proposalId: proposalId,
        signatures: proposal.signatures.length,
        required: proposal.requiredSignatures,
        status: proposal.status
      };
    } catch (error) {
      console.error('Sign proposal error:', error);
      throw error;
    }
  }

  /**
   * Execute approved spend
   */
  async executeSpend(proposal) {
    const treasury = this.balances.get('dao_treasury');

    // Deduct from treasury
    if (treasury[proposal.currency] >= proposal.amount) {
      treasury[proposal.currency] -= proposal.amount;
    } else {
      throw new Error('Insufficient treasury balance');
    }

    // Record transaction
    const transaction = {
      txId: this.generateId('TX'),
      type: 'outgoing',
      proposalId: proposal.proposalId,
      amount: proposal.amount,
      currency: proposal.currency,
      recipient: proposal.recipient,
      category: proposal.category,
      description: proposal.description,
      signatures: proposal.signatures.map(s => s.signer),
      executedAt: new Date().toISOString(),
      status: 'completed'
    };

    this.transactions.set(transaction.txId, transaction);

    // Update budget
    const budget = this.budgets.get(proposal.category);
    if (budget) {
      budget.spent += this.convertToUSD(proposal.amount, proposal.currency);
      budget.remaining = budget.allocated - budget.spent;
    }

    proposal.status = 'executed';
    proposal.executedAt = transaction.executedAt;
    proposal.transactionId = transaction.txId;

    return transaction;
  }

  /**
   * Allocate budget to category
   */
  async allocateBudget(proposer, allocationData) {
    try {
      const { category, amount, period, description } = allocationData;

      const allocation = {
        allocationId: this.generateId('ALLOC'),
        category: category,
        amount: amount,
        currency: 'INDI',
        period: period,
        description: description,
        proposer: proposer,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      this.allocations.set(allocation.allocationId, allocation);

      return {
        success: true,
        allocationId: allocation.allocationId,
        category: category,
        amount: amount,
        status: 'pending'
      };
    } catch (error) {
      console.error('Allocate budget error:', error);
      throw error;
    }
  }

  /**
   * Approve budget allocation
   */
  async approveAllocation(allocationId) {
    const allocation = this.allocations.get(allocationId);
    if (!allocation) throw new Error('Allocation not found');

    allocation.status = 'approved';
    allocation.approvedAt = new Date().toISOString();

    // Update budget
    const budget = this.budgets.get(allocation.category);
    if (budget) {
      budget.allocated += this.convertToUSD(allocation.amount, allocation.currency);
      budget.remaining = budget.allocated - budget.spent;
    }

    return {
      success: true,
      allocationId: allocationId,
      status: 'approved'
    };
  }

  /**
   * Get budget status
   */
  async getBudgetStatus() {
    const budgets = {};
    for (const [category, data] of this.budgets) {
      budgets[category] = {
        ...data,
        utilization: data.allocated > 0 ? (data.spent / data.allocated * 100).toFixed(2) : 0
      };
    }

    return {
      success: true,
      budgets: budgets,
      totalAllocated: Object.values(budgets).reduce((sum, b) => sum + b.allocated, 0),
      totalSpent: Object.values(budgets).reduce((sum, b) => sum + b.spent, 0)
    };
  }

  /**
   * Get transaction history
   */
  async getTransactionHistory(options = {}) {
    const { category, type, limit = 50, offset = 0 } = options;

    let txs = Array.from(this.transactions.values());

    if (category) txs = txs.filter(t => t.category === category);
    if (type) txs = txs.filter(t => t.type === type);

    txs.sort((a, b) => new Date(b.executedAt) - new Date(a.executedAt));

    const total = txs.length;
    txs = txs.slice(offset, offset + limit);

    return {
      success: true,
      transactions: txs,
      pagination: { total, limit, offset }
    };
  }

  /**
   * Get pending proposals
   */
  async getPendingProposals() {
    const pending = Array.from(this.approvals.values())
      .filter(p => p.status === 'pending')
      .map(p => ({
        proposalId: p.proposalId,
        type: p.type,
        amount: p.amount,
        currency: p.currency,
        recipient: p.recipient,
        category: p.category,
        description: p.description,
        signatures: p.signatures.length,
        requiredSignatures: p.requiredSignatures,
        createdAt: p.createdAt,
        expiresAt: p.expiresAt
      }));

    return {
      success: true,
      proposals: pending
    };
  }

  /**
   * Deposit to treasury
   */
  async deposit(from, amount, currency, source) {
    const treasury = this.balances.get('dao_treasury');
    treasury[currency] = (treasury[currency] || 0) + amount;

    const transaction = {
      txId: this.generateId('TX'),
      type: 'incoming',
      from: from,
      amount: amount,
      currency: currency,
      source: source,
      executedAt: new Date().toISOString(),
      status: 'completed'
    };

    this.transactions.set(transaction.txId, transaction);

    return {
      success: true,
      transactionId: transaction.txId,
      newBalance: treasury[currency]
    };
  }

  generateId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new TreasuryService();
