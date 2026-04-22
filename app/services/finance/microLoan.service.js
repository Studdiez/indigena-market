/**
 * Micro-Loan Service
 * Small business loans for artists with INDI collateral
 */

const indiToken = require('./indiToken.service.js');

class MicroLoanService {
  constructor() {
    this.loans = new Map();
    this.loanPrograms = new Map();
    this.repayments = new Map();
    this.creditScores = new Map();
    this.initializeLoanPrograms();
  }

  initializeLoanPrograms() {
    // Artist-focused micro-loan programs
    this.loanPrograms.set('starter', {
      id: 'starter',
      name: 'Artist Starter Loan',
      description: 'Small loan for emerging artists to purchase supplies',
      minAmount: 500,
      maxAmount: 5000,
      duration: [6, 12], // months
      interestRate: 0.06, // 6% APR
      collateralRequired: 0.25, // 25% collateral
      requirements: {
        minCreditScore: 0,
        minAccountAge: 30, // days
        minTransactions: 5
      }
    });

    this.loanPrograms.set('growth', {
      id: 'growth',
      name: 'Artist Growth Loan',
      description: 'Medium loan for expanding art business',
      minAmount: 5000,
      maxAmount: 25000,
      duration: [12, 24],
      interestRate: 0.05,
      collateralRequired: 0.30,
      requirements: {
        minCreditScore: 50,
        minAccountAge: 90,
        minTransactions: 20,
        minSalesVolume: 10000 // INDI
      }
    });

    this.loanPrograms.set('master', {
      id: 'master',
      name: 'Master Artist Loan',
      description: 'Large loan for established artists',
      minAmount: 25000,
      maxAmount: 100000,
      duration: [24, 36],
      interestRate: 0.04,
      collateralRequired: 0.35,
      requirements: {
        minCreditScore: 75,
        minAccountAge: 180,
        minTransactions: 50,
        minSalesVolume: 50000,
        elderEndorsed: true
      }
    });

    this.loanPrograms.set('community', {
      id: 'community',
      name: 'Community Development Loan',
      description: 'Loan for community art projects',
      minAmount: 1000,
      maxAmount: 50000,
      duration: [12, 24],
      interestRate: 0.03, // Subsidized rate
      collateralRequired: 0.20,
      requirements: {
        minCreditScore: 40,
        communityProject: true,
        elderEndorsed: true
      }
    });
  }

  /**
   * Calculate credit score for loans
   */
  async calculateCreditScore(address) {
    try {
      const wallet = await indiToken.getWallet(address);
      const history = await indiToken.getTransactionHistory(address, { limit: 100 });
      
      // Check existing loans
      const existingLoans = Array.from(this.loans.values())
        .filter(l => l.borrower === address);
      
      let score = 50; // Base score
      let factors = [];

      // Account age
      const accountAge = (Date.now() - new Date(wallet.wallet.createdAt)) / (1000 * 60 * 60 * 24);
      if (accountAge > 365) {
        score += 15;
        factors.push({ factor: 'account_age', impact: 15 });
      } else if (accountAge > 180) {
        score += 10;
        factors.push({ factor: 'account_age', impact: 10 });
      }

      // Transaction history
      const txCount = history.transactions.length;
      if (txCount > 50) {
        score += 15;
        factors.push({ factor: 'transaction_history', impact: 15 });
      } else if (txCount > 20) {
        score += 10;
        factors.push({ factor: 'transaction_history', impact: 10 });
      }

      // Balance/staking
      if (wallet.wallet.staked > 10000) {
        score += 15;
        factors.push({ factor: 'staking', impact: 15 });
      } else if (wallet.wallet.balance > 5000) {
        score += 10;
        factors.push({ factor: 'balance', impact: 10 });
      }

      // Previous loan performance
      if (existingLoans.length > 0) {
        const completedLoans = existingLoans.filter(l => l.status === 'completed');
        const onTimeRate = completedLoans.filter(l => l.latePayments === 0).length / completedLoans.length;
        
        if (completedLoans.length > 0) {
          if (onTimeRate === 1) {
            score += 20;
            factors.push({ factor: 'perfect_repayment', impact: 20 });
          } else if (onTimeRate >= 0.9) {
            score += 10;
            factors.push({ factor: 'good_repayment', impact: 10 });
          }
        }

        // Penalty for active defaults
        const activeDefaults = existingLoans.filter(l => l.status === 'defaulted').length;
        if (activeDefaults > 0) {
          score -= 30 * activeDefaults;
          factors.push({ factor: 'active_defaults', impact: -30 * activeDefaults });
        }
      }

      score = Math.min(100, Math.max(0, score));

      const creditProfile = {
        address: address,
        score: score,
        tier: this.getCreditTier(score),
        factors: factors,
        existingLoans: existingLoans.filter(l => l.status === 'active').length,
        calculatedAt: new Date().toISOString()
      };

      this.creditScores.set(address, creditProfile);

      return creditProfile;
    } catch (error) {
      console.error('Calculate credit score error:', error);
      throw error;
    }
  }

  getCreditTier(score) {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'fair';
    if (score >= 30) return 'poor';
    return 'very_poor';
  }

  /**
   * Check loan eligibility
   */
  async checkEligibility(address, programId) {
    try {
      const program = this.loanPrograms.get(programId);
      if (!program) throw new Error('Loan program not found');

      const creditProfile = await this.calculateCreditScore(address);
      const wallet = await indiToken.getWallet(address);
      const history = await indiToken.getTransactionHistory(address, { limit: 100 });

      const eligibility = {
        eligible: true,
        reasons: [],
        maxAmount: program.maxAmount,
        interestRate: program.interestRate,
        requirements: {}
      };

      // Check credit score
      if (creditProfile.score < program.requirements.minCreditScore) {
        eligibility.eligible = false;
        eligibility.reasons.push(`Credit score ${creditProfile.score} below minimum ${program.requirements.minCreditScore}`);
      }

      // Check account age
      const accountAge = (Date.now() - new Date(wallet.wallet.createdAt)) / (1000 * 60 * 60 * 24);
      if (accountAge < program.requirements.minAccountAge) {
        eligibility.eligible = false;
        eligibility.reasons.push(`Account age ${Math.floor(accountAge)} days below minimum ${program.requirements.minAccountAge}`);
      }

      // Check transaction count
      if (history.transactions.length < program.requirements.minTransactions) {
        eligibility.eligible = false;
        eligibility.reasons.push(`Transaction count ${history.transactions.length} below minimum ${program.requirements.minTransactions}`);
      }

      // Check sales volume if required
      if (program.requirements.minSalesVolume) {
        // Calculate from transaction history
        const salesVolume = history.transactions
          .filter(t => t.type === 'receive')
          .reduce((sum, t) => sum + t.amount, 0);
        
        if (salesVolume < program.requirements.minSalesVolume) {
          eligibility.eligible = false;
          eligibility.reasons.push(`Sales volume ${salesVolume} below minimum ${program.requirements.minSalesVolume}`);
        }
      }

      // Check existing loans
      const activeLoans = Array.from(this.loans.values())
        .filter(l => l.borrower === address && l.status === 'active').length;
      
      if (activeLoans >= 2) {
        eligibility.eligible = false;
        eligibility.reasons.push('Maximum number of active loans reached');
      }

      // Calculate max amount based on credit score
      if (eligibility.eligible) {
        const creditMultiplier = creditProfile.score / 100;
        eligibility.maxAmount = Math.min(
          program.maxAmount,
          program.maxAmount * creditMultiplier + (wallet.wallet.staked * 0.5)
        );
      }

      return {
        success: true,
        eligible: eligibility.eligible,
        program: programId,
        creditScore: creditProfile.score,
        creditTier: creditProfile.tier,
        maxAmount: eligibility.eligible ? eligibility.maxAmount : 0,
        interestRate: program.interestRate,
        reasons: eligibility.reasons,
        requirements: program.requirements
      };
    } catch (error) {
      console.error('Check eligibility error:', error);
      throw error;
    }
  }

  /**
   * Apply for loan
   */
  async applyForLoan(borrower, programId, loanDetails) {
    try {
      // Check eligibility first
      const eligibility = await this.checkEligibility(borrower, programId);
      if (!eligibility.eligible) {
        return {
          success: false,
          message: 'Not eligible for this loan program',
          reasons: eligibility.reasons
        };
      }

      const program = this.loanPrograms.get(programId);
      const { amount, duration, purpose, collateralAmount } = loanDetails;

      // Validate amount
      if (amount < program.minAmount || amount > eligibility.maxAmount) {
        throw new Error(`Loan amount must be between ${program.minAmount} and ${eligibility.maxAmount} INDI`);
      }

      // Validate duration
      if (!program.duration.includes(duration)) {
        throw new Error(`Duration must be one of: ${program.duration.join(', ')} months`);
      }

      // Verify collateral
      const requiredCollateral = amount * program.collateralRequired;
      if (collateralAmount < requiredCollateral) {
        throw new Error(`Collateral must be at least ${requiredCollateral} INDI (${program.collateralRequired * 100}%)`);
      }

      // Check borrower has collateral
      const wallet = await indiToken.getWallet(borrower);
      if (wallet.wallet.balance < collateralAmount) {
        throw new Error('Insufficient balance for collateral');
      }

      // Calculate loan terms
      const monthlyRate = program.interestRate / 12;
      const monthlyPayment = this.calculateMonthlyPayment(amount, monthlyRate, duration);
      const totalInterest = (monthlyPayment * duration) - amount;
      const totalRepayment = amount + totalInterest;

      const loan = {
        loanId: this.generateLoanId(),
        borrower: borrower,
        program: programId,
        amount: amount,
        duration: duration,
        interestRate: program.interestRate,
        monthlyPayment: monthlyPayment,
        totalInterest: totalInterest,
        totalRepayment: totalRepayment,
        collateral: {
          amount: collateralAmount,
          locked: false
        },
        purpose: purpose,
        status: 'pending', // 'pending', 'approved', 'active', 'completed', 'defaulted'
        schedule: this.generateSchedule(amount, monthlyPayment, duration, monthlyRate),
        payments: [],
        createdAt: new Date().toISOString(),
        approvedAt: null,
        activatedAt: null,
        completedAt: null,
        latePayments: 0,
        missedPayments: 0
      };

      this.loans.set(loan.loanId, loan);

      return {
        success: true,
        loanId: loan.loanId,
        status: 'pending',
        amount: amount,
        monthlyPayment: monthlyPayment,
        totalRepayment: totalRepayment,
        duration: duration,
        collateralRequired: requiredCollateral,
        message: 'Loan application submitted for review'
      };
    } catch (error) {
      console.error('Apply for loan error:', error);
      throw error;
    }
  }

  calculateMonthlyPayment(principal, monthlyRate, months) {
    if (monthlyRate === 0) return principal / months;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
           (Math.pow(1 + monthlyRate, months) - 1);
  }

  generateSchedule(amount, monthlyPayment, duration, monthlyRate) {
    const schedule = [];
    let remainingBalance = amount;
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
   * Approve loan (admin/underwriter)
   */
  async approveLoan(loanId, approver) {
    try {
      const loan = this.loans.get(loanId);
      if (!loan) throw new Error('Loan not found');
      if (loan.status !== 'pending') throw new Error('Loan not in pending status');

      // Lock collateral
      await indiToken.transfer(loan.borrower, 'loan_collateral', loan.collateral.amount, `Loan collateral ${loanId}`);
      loan.collateral.locked = true;

      // Fund the loan
      await indiToken.mintTokens(loan.borrower, loan.amount, `Loan disbursement ${loanId}`);

      loan.status = 'active';
      loan.approvedAt = new Date().toISOString();
      loan.activatedAt = new Date().toISOString();
      loan.approvedBy = approver;

      return {
        success: true,
        loanId: loanId,
        status: 'active',
        amountDisbursed: loan.amount,
        collateralLocked: loan.collateral.amount,
        firstPaymentDue: loan.schedule[0].dueDate
      };
    } catch (error) {
      console.error('Approve loan error:', error);
      throw error;
    }
  }

  /**
   * Make loan payment
   */
  async makePayment(loanId, borrower, amount) {
    try {
      const loan = this.loans.get(loanId);
      if (!loan) throw new Error('Loan not found');
      if (loan.borrower !== borrower) throw new Error('Not your loan');
      if (loan.status !== 'active') throw new Error('Loan not active');

      // Find next pending installment
      const nextInstallment = loan.schedule.find(s => s.status === 'pending');
      if (!nextInstallment) {
        throw new Error('No pending installments');
      }

      // Verify payment amount
      if (amount < nextInstallment.amount) {
        throw new Error(`Minimum payment is ${nextInstallment.amount} INDI`);
      }

      // Transfer payment
      await indiToken.transfer(borrower, 'loan_repayments', amount, `Loan payment ${loanId}-${nextInstallment.installment}`);

      // Record payment
      const payment = {
        paymentId: this.generatePaymentId(),
        loanId: loanId,
        installment: nextInstallment.installment,
        amount: amount,
        paidAt: new Date().toISOString(),
        txId: `tx-${Date.now()}`
      };

      this.repayments.set(payment.paymentId, payment);
      loan.payments.push(payment.paymentId);

      // Update installment
      nextInstallment.status = 'paid';
      nextInstallment.paidAt = payment.paidAt;
      nextInstallment.txId = payment.txId;

      // Check if loan is complete
      const remainingInstallments = loan.schedule.filter(s => s.status === 'pending').length;
      if (remainingInstallments === 0) {
        await this.completeLoan(loanId);
      }

      return {
        success: true,
        paymentId: payment.paymentId,
        installment: nextInstallment.installment,
        amount: amount,
        loanStatus: loan.status,
        remainingPayments: remainingInstallments
      };
    } catch (error) {
      console.error('Make payment error:', error);
      throw error;
    }
  }

  /**
   * Complete loan
   */
  async completeLoan(loanId) {
    const loan = this.loans.get(loanId);
    if (!loan) throw new Error('Loan not found');

    // Return collateral
    await indiToken.transfer('loan_collateral', loan.borrower, loan.collateral.amount, `Collateral return ${loanId}`);

    loan.status = 'completed';
    loan.completedAt = new Date().toISOString();

    // Credit score boost for on-time completion
    if (loan.latePayments === 0) {
      const profile = this.creditScores.get(loan.borrower);
      if (profile) {
        profile.score = Math.min(100, profile.score + 5);
      }
    }

    return {
      success: true,
      loanId: loanId,
      status: 'completed',
      collateralReturned: loan.collateral.amount
    };
  }

  /**
   * Process overdue loans
   */
  async processOverdueLoans() {
    const now = new Date();
    const processed = [];

    for (const [loanId, loan] of this.loans) {
      if (loan.status !== 'active') continue;

      const overdueInstallment = loan.schedule.find(s => {
        if (s.status !== 'pending') return false;
        const dueDate = new Date(s.dueDate);
        const gracePeriod = 15 * 24 * 60 * 60 * 1000; // 15 days grace
        return (now - dueDate) > gracePeriod;
      });

      if (overdueInstallment) {
        loan.latePayments++;
        
        // Check for default (90 days past due)
        const daysPastDue = (now - new Date(overdueInstallment.dueDate)) / (1000 * 60 * 60 * 24);
        
        if (daysPastDue > 90) {
          await this.defaultLoan(loanId);
          processed.push({ loanId, action: 'defaulted', daysPastDue });
        } else {
          processed.push({ loanId, action: 'late_fee', installment: overdueInstallment.installment });
        }
      }
    }

    return { processed: processed.length, details: processed };
  }

  /**
   * Default loan
   */
  async defaultLoan(loanId) {
    const loan = this.loans.get(loanId);
    if (!loan) throw new Error('Loan not found');

    loan.status = 'defaulted';
    loan.defaultedAt = new Date().toISOString();

    // Liquidate collateral
    const remainingBalance = loan.schedule
      .filter(s => s.status === 'pending')
      .reduce((sum, s) => sum + s.amount, 0);

    const collateralValue = loan.collateral.amount;
    
    if (collateralValue >= remainingBalance) {
      // Full recovery
      await indiToken.burnTokens('loan_collateral', remainingBalance, `Loan default recovery ${loanId}`);
      const surplus = collateralValue - remainingBalance;
      if (surplus > 0) {
        await indiToken.transfer('loan_collateral', loan.borrower, surplus, `Collateral surplus ${loanId}`);
      }
    } else {
      // Partial recovery
      await indiToken.burnTokens('loan_collateral', collateralValue, `Loan partial recovery ${loanId}`);
      loan.recoveryShortfall = remainingBalance - collateralValue;
    }

    // Severe credit score penalty
    const profile = this.creditScores.get(loan.borrower);
    if (profile) {
      profile.score = Math.max(0, profile.score - 30);
    }

    return {
      success: true,
      loanId: loanId,
      status: 'defaulted',
      collateralLiquidated: collateralValue,
      recoveryShortfall: loan.recoveryShortfall || 0
    };
  }

  /**
   * Get loan details
   */
  async getLoan(loanId, requester) {
    const loan = this.loans.get(loanId);
    if (!loan) throw new Error('Loan not found');
    if (loan.borrower !== requester) {
      throw new Error('Not authorized');
    }

    return {
      loanId: loan.loanId,
      program: loan.program,
      amount: loan.amount,
      interestRate: loan.interestRate,
      monthlyPayment: loan.monthlyPayment,
      totalRepayment: loan.totalRepayment,
      collateral: loan.collateral,
      status: loan.status,
      schedule: loan.schedule,
      progress: {
        totalInstallments: loan.schedule.length,
        paidInstallments: loan.schedule.filter(s => s.status === 'paid').length,
        remainingInstallments: loan.schedule.filter(s => s.status === 'pending').length,
        nextPayment: loan.schedule.find(s => s.status === 'pending') || null
      },
      createdAt: loan.createdAt,
      activatedAt: loan.activatedAt,
      completedAt: loan.completedAt
    };
  }

  /**
   * Get user's loans
   */
  async getUserLoans(address) {
    const loans = Array.from(this.loans.values())
      .filter(l => l.borrower === address)
      .map(l => ({
        loanId: l.loanId,
        program: l.program,
        amount: l.amount,
        monthlyPayment: l.monthlyPayment,
        status: l.status,
        progress: `${l.schedule.filter(s => s.status === 'paid').length}/${l.schedule.length}`,
        nextDue: l.schedule.find(s => s.status === 'pending')?.dueDate || null
      }));

    return { loans, total: loans.length };
  }

  /**
   * Get loan programs
   */
  async getLoanPrograms() {
    return Array.from(this.loanPrograms.values()).map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      minAmount: p.minAmount,
      maxAmount: p.maxAmount,
      duration: p.duration,
      interestRate: p.interestRate,
      collateralRequired: p.collateralRequired
    }));
  }

  generateLoanId() {
    return `LOAN-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  generatePaymentId() {
    return `LPAY-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new MicroLoanService();
