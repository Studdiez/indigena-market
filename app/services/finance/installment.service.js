/**
 * Installment Payments Service
 * Buy now, pay later with INDI
 */

const indiToken = require('./indiToken.service.js');

class InstallmentService {
  constructor() {
    this.plans = new Map();
    this.payments = new Map();
    this.creditScores = new Map();
    this.initializeCreditTiers();
  }

  initializeCreditTiers() {
    this.creditTiers = {
      bronze: {
        minScore: 0,
        maxAmount: 5000,      // 5000 INDI
        maxDuration: 3,       // 3 months
        interestRate: 0.08,   // 8% APR
        requiredStaking: 0
      },
      silver: {
        minScore: 50,
        maxAmount: 20000,     // 20000 INDI
        maxDuration: 6,       // 6 months
        interestRate: 0.06,   // 6% APR
        requiredStaking: 1000
      },
      gold: {
        minScore: 75,
        maxAmount: 50000,     // 50000 INDI
        maxDuration: 12,      // 12 months
        interestRate: 0.04,   // 4% APR
        requiredStaking: 5000
      },
      platinum: {
        minScore: 90,
        maxAmount: 100000,    // 100000 INDI
        maxDuration: 24,      // 24 months
        interestRate: 0.02,   // 2% APR
        requiredStaking: 10000
      }
    };
  }

  /**
   * Calculate credit score for user
   */
  async calculateCreditScore(address) {
    try {
      const wallet = await indiToken.getWallet(address);
      const history = await indiToken.getTransactionHistory(address, { limit: 100 });

      let score = 50; // Base score
      const factors = [];

      // Account age factor (up to 10 points)
      const accountAge = (Date.now() - new Date(wallet.wallet.createdAt)) / (1000 * 60 * 60 * 24);
      if (accountAge > 365) {
        score += 10;
        factors.push({ factor: 'account_age', impact: 10, reason: 'Account over 1 year old' });
      } else if (accountAge > 180) {
        score += 5;
        factors.push({ factor: 'account_age', impact: 5, reason: 'Account over 6 months old' });
      }

      // Transaction history (up to 15 points)
      const txCount = history.transactions.length;
      if (txCount > 50) {
        score += 15;
        factors.push({ factor: 'transaction_volume', impact: 15, reason: 'High transaction volume' });
      } else if (txCount > 20) {
        score += 10;
        factors.push({ factor: 'transaction_volume', impact: 10, reason: 'Good transaction volume' });
      } else if (txCount > 5) {
        score += 5;
        factors.push({ factor: 'transaction_volume', impact: 5, reason: 'Some transaction history' });
      }

      // Balance factor (up to 10 points)
      const balance = wallet.wallet.totalValue;
      if (balance > 50000) {
        score += 10;
        factors.push({ factor: 'balance', impact: 10, reason: 'High INDI balance' });
      } else if (balance > 10000) {
        score += 5;
        factors.push({ factor: 'balance', impact: 5, reason: 'Good INDI balance' });
      }

      // Staking factor (up to 10 points)
      if (wallet.wallet.staked > 10000) {
        score += 10;
        factors.push({ factor: 'staking', impact: 10, reason: 'Active staker' });
      } else if (wallet.wallet.staked > 1000) {
        score += 5;
        factors.push({ factor: 'staking', impact: 5, reason: 'Some staking activity' });
      }

      // Previous installment history (up to 15 points)
      const userPlans = Array.from(this.plans.values())
        .filter(p => p.buyer === address);
      
      if (userPlans.length > 0) {
        const completedPlans = userPlans.filter(p => p.status === 'completed');
        const onTimeRate = completedPlans.filter(p => p.latePayments === 0).length / completedPlans.length;
        
        if (onTimeRate === 1 && completedPlans.length > 0) {
          score += 15;
          factors.push({ factor: 'payment_history', impact: 15, reason: 'Perfect payment history' });
        } else if (onTimeRate >= 0.9) {
          score += 10;
          factors.push({ factor: 'payment_history', impact: 10, reason: 'Good payment history' });
        } else if (onTimeRate >= 0.75) {
          score += 5;
          factors.push({ factor: 'payment_history', impact: 5, reason: 'Fair payment history' });
        }
      }

      score = Math.min(100, Math.max(0, score));

      const creditProfile = {
        address: address,
        score: score,
        tier: this.getTierForScore(score),
        factors: factors,
        calculatedAt: new Date().toISOString()
      };

      this.creditScores.set(address, creditProfile);

      return creditProfile;
    } catch (error) {
      console.error('Calculate credit score error:', error);
      throw error;
    }
  }

  getTierForScore(score) {
    if (score >= 90) return 'platinum';
    if (score >= 75) return 'gold';
    if (score >= 50) return 'silver';
    return 'bronze';
  }

  /**
   * Create installment plan
   */
  async createPlan(buyer, seller, itemDetails, planConfig) {
    try {
      // Get or calculate credit score
      let creditProfile = this.creditScores.get(buyer);
      if (!creditProfile || this.isStale(creditProfile.calculatedAt)) {
        creditProfile = await this.calculateCreditScore(buyer);
      }

      const tier = this.creditTiers[creditProfile.tier];
      const { totalAmount, downPayment, duration } = planConfig;

      // Validate against tier limits
      if (totalAmount > tier.maxAmount) {
        throw new Error(`Amount exceeds ${creditProfile.tier} tier limit of ${tier.maxAmount} INDI`);
      }
      if (duration > tier.maxDuration) {
        throw new Error(`Duration exceeds ${creditProfile.tier} tier maximum of ${tier.maxDuration} months`);
      }

      // Calculate financing
      const financedAmount = totalAmount - downPayment;
      const monthlyInterest = tier.interestRate / 12;
      const monthlyPayment = this.calculateMonthlyPayment(financedAmount, monthlyInterest, duration);
      const totalInterest = (monthlyPayment * duration) - financedAmount;
      const totalCost = totalAmount + totalInterest;

      const plan = {
        planId: this.generatePlanId(),
        buyer: buyer,
        seller: seller,
        item: {
          name: itemDetails.name,
          description: itemDetails.description,
          nftId: itemDetails.nftId || null
        },
        financing: {
          totalAmount: totalAmount,
          downPayment: downPayment,
          financedAmount: financedAmount,
          duration: duration,
          interestRate: tier.interestRate,
          monthlyPayment: monthlyPayment,
          totalInterest: totalInterest,
          totalCost: totalCost
        },
        schedule: this.generateSchedule(financedAmount, monthlyPayment, duration, monthlyInterest),
        status: 'pending', // 'pending', 'active', 'completed', 'defaulted'
        payments: [],
        creditTier: creditProfile.tier,
        createdAt: new Date().toISOString(),
        activatedAt: null,
        completedAt: null,
        latePayments: 0,
        missedPayments: 0
      };

      this.plans.set(plan.planId, plan);

      return {
        success: true,
        planId: plan.planId,
        status: 'pending',
        financing: plan.financing,
        schedule: plan.schedule,
        message: 'Installment plan created. Pay down payment to activate.'
      };
    } catch (error) {
      console.error('Create plan error:', error);
      throw error;
    }
  }

  calculateMonthlyPayment(principal, monthlyRate, months) {
    if (monthlyRate === 0) return principal / months;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
           (Math.pow(1 + monthlyRate, months) - 1);
  }

  generateSchedule(financedAmount, monthlyPayment, duration, monthlyRate) {
    const schedule = [];
    let remainingBalance = financedAmount;
    const startDate = new Date();

    for (let i = 1; i <= duration; i++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;

      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i);

      schedule.push({
        installment: i,
        dueDate: dueDate.toISOString(),
        amount: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        remainingBalance: Math.max(0, remainingBalance),
        status: 'pending',
        paidAt: null,
        txId: null
      });
    }

    return schedule;
  }

  /**
   * Activate plan with down payment
   */
  async activatePlan(planId, buyer) {
    try {
      const plan = this.plans.get(planId);
      if (!plan) throw new Error('Plan not found');
      if (plan.buyer !== buyer) throw new Error('Not your plan');
      if (plan.status !== 'pending') throw new Error('Plan already activated');

      // Verify buyer has funds for down payment
      const wallet = await indiToken.getWallet(buyer);
      if (wallet.wallet.balance < plan.financing.downPayment) {
        throw new Error('Insufficient balance for down payment');
      }

      // Transfer down payment to seller
      await indiToken.transfer(buyer, plan.seller, plan.financing.downPayment, `Installment down payment ${planId}`);

      plan.status = 'active';
      plan.activatedAt = new Date().toISOString();

      return {
        success: true,
        planId: planId,
        status: 'active',
        firstPaymentDue: plan.schedule[0].dueDate,
        message: 'Installment plan activated. First payment due on scheduled date.'
      };
    } catch (error) {
      console.error('Activate plan error:', error);
      throw error;
    }
  }

  /**
   * Make installment payment
   */
  async makePayment(planId, buyer, amount) {
    try {
      const plan = this.plans.get(planId);
      if (!plan) throw new Error('Plan not found');
      if (plan.buyer !== buyer) throw new Error('Not your plan');
      if (plan.status !== 'active') throw new Error('Plan not active');

      // Find next pending installment
      const nextInstallment = plan.schedule.find(s => s.status === 'pending');
      if (!nextInstallment) {
        throw new Error('No pending installments');
      }

      // Verify payment amount
      if (amount < nextInstallment.amount) {
        throw new Error(`Minimum payment is ${nextInstallment.amount} INDI`);
      }

      // Transfer payment
      await indiToken.transfer(buyer, plan.seller, amount, `Installment payment ${planId}-${nextInstallment.installment}`);

      // Record payment
      const payment = {
        paymentId: this.generatePaymentId(),
        planId: planId,
        installment: nextInstallment.installment,
        amount: amount,
        paidAt: new Date().toISOString(),
        txId: `tx-${Date.now()}`
      };

      this.payments.set(payment.paymentId, payment);
      plan.payments.push(payment.paymentId);

      // Update installment
      nextInstallment.status = 'paid';
      nextInstallment.paidAt = payment.paidAt;
      nextInstallment.txId = payment.txId;

      // Check if plan is complete
      const remainingInstallments = plan.schedule.filter(s => s.status === 'pending').length;
      if (remainingInstallments === 0) {
        plan.status = 'completed';
        plan.completedAt = new Date().toISOString();
        
        // Reward for on-time completion
        await this.rewardCompletion(plan);
      }

      return {
        success: true,
        paymentId: payment.paymentId,
        installment: nextInstallment.installment,
        amount: amount,
        planStatus: plan.status,
        remainingPayments: remainingInstallments
      };
    } catch (error) {
      console.error('Make payment error:', error);
      throw error;
    }
  }

  /**
   * Process automatic payments for due installments
   */
  async processAutoPayments() {
    const now = new Date();
    const processed = [];

    for (const [planId, plan] of this.plans) {
      if (plan.status !== 'active') continue;

      const overdueInstallment = plan.schedule.find(s => {
        if (s.status !== 'pending') return false;
        const dueDate = new Date(s.dueDate);
        const gracePeriod = 3 * 24 * 60 * 60 * 1000; // 3 days grace
        return (now - dueDate) > gracePeriod;
      });

      if (overdueInstallment) {
        // Attempt auto-payment
        const wallet = await indiToken.getWallet(plan.buyer);
        if (wallet.wallet.balance >= overdueInstallment.amount) {
          try {
            await this.makePayment(planId, plan.buyer, overdueInstallment.amount);
            processed.push({ planId, installment: overdueInstallment.installment, result: 'paid' });
          } catch (error) {
            processed.push({ planId, installment: overdueInstallment.installment, result: 'failed', error: error.message });
          }
        } else {
          plan.latePayments++;
          processed.push({ planId, installment: overdueInstallment.installment, result: 'insufficient_funds' });
        }
      }
    }

    return { processed: processed.length, details: processed };
  }

  /**
   * Reward user for completing plan on time
   */
  async rewardCompletion(plan) {
    if (plan.latePayments === 0) {
      const reward = plan.financing.totalAmount * 0.01; // 1% reward
      await indiToken.mintTokens(plan.buyer, reward, 'installment_completion_bonus');
      
      // Boost credit score
      const profile = this.creditScores.get(plan.buyer);
      if (profile) {
        profile.score = Math.min(100, profile.score + 2);
        profile.tier = this.getTierForScore(profile.score);
      }
    }
  }

  /**
   * Get plan details
   */
  async getPlan(planId, requester) {
    const plan = this.plans.get(planId);
    if (!plan) throw new Error('Plan not found');
    if (plan.buyer !== requester && plan.seller !== requester) {
      throw new Error('Not authorized');
    }

    return {
      planId: plan.planId,
      item: plan.item,
      financing: plan.financing,
      schedule: plan.schedule,
      status: plan.status,
      progress: {
        totalInstallments: plan.schedule.length,
        paidInstallments: plan.schedule.filter(s => s.status === 'paid').length,
        remainingInstallments: plan.schedule.filter(s => s.status === 'pending').length,
        nextPayment: plan.schedule.find(s => s.status === 'pending') || null
      },
      createdAt: plan.createdAt,
      activatedAt: plan.activatedAt,
      completedAt: plan.completedAt
    };
  }

  /**
   * Get user's installment plans
   */
  async getUserPlans(address) {
    const plans = Array.from(this.plans.values())
      .filter(p => p.buyer === address)
      .map(p => ({
        planId: p.planId,
        item: p.item.name,
        totalAmount: p.financing.totalCost,
        monthlyPayment: p.financing.monthlyPayment,
        status: p.status,
        progress: `${p.schedule.filter(s => s.status === 'paid').length}/${p.schedule.length} paid`,
        nextDue: p.schedule.find(s => s.status === 'pending')?.dueDate || null
      }));

    return { plans, total: plans.length };
  }

  isStale(calculatedAt) {
    const age = Date.now() - new Date(calculatedAt);
    return age > (30 * 24 * 60 * 60 * 1000); // 30 days
  }

  generatePlanId() {
    return `INS-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  generatePaymentId() {
    return `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new InstallmentService();
