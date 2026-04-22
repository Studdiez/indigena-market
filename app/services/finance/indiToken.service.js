/**
 * INDI Token Service
 * Native platform currency for Indigena Market
 * Built on XRP Ledger with custom token functionality
 */

class IndiTokenService {
  constructor() {
    this.tokenCode = 'INDI';
    this.issuerAddress = process.env.INDI_ISSUER_ADDRESS;
    this.decimals = 6;
    this.totalSupply = 1000000000; // 1 billion INDI
    this.circulatingSupply = 0;
    this.burnedSupply = 0;
    this.wallets = new Map();
    this.transactions = new Map();
    this.stakingPositions = new Map();
    this.rewards = new Map();
    this.initializeToken();
  }

  async initializeToken() {
    // Token distribution breakdown
    this.tokenomics = {
      totalSupply: this.totalSupply,
      distribution: {
        communityRewards: 300000000,    // 30% - Artist rewards, staking
        ecosystemGrowth: 200000000,     // 20% - Partnerships, grants
        teamAndAdvisors: 150000000,     // 15% - Vested over 4 years
        liquidityPools: 150000000,      // 15% - DEX liquidity
        treasury: 150000000,            // 15% - Platform development
        publicSale: 50000000            // 5% - Initial token sale
      },
      vesting: {
        teamAndAdvisors: {
          cliff: 12, // months
          duration: 48 // months
        }
      }
    };

    // Platform fee structure (paid in INDI)
    this.feeStructure = {
      marketplace: {
        listing: 10,           // 10 INDI to list NFT
        sale: 0.025,           // 2.5% of sale price
        royalty: 0.10          // 10% royalty to original artist
      },
      escrow: {
        creation: 5,           // 5 INDI to create escrow
        release: 0.01,         // 1% escrow fee
        dispute: 50            // 50 INDI to dispute
      },
      mentorship: {
        session: 50,           // 50 INDI per session
        program: 500           // 500 INDI for full program
      },
      events: {
        creation: 100,         // 100 INDI to create event
        ticket: 2              // 2 INDI per ticket sold
      },
      staking: {
        minimum: 1000,         // Minimum 1000 INDI to stake
        lockPeriods: [30, 90, 180, 365], // Days
        apy: [0.05, 0.08, 0.12, 0.18]   // APY for each lock period
      }
    };

    console.log('INDI Token initialized:', {
      code: this.tokenCode,
      totalSupply: this.totalSupply,
      decimals: this.decimals
    });
  }

  /**
   * Create new INDI wallet for user
   */
  async createWallet(userAddress) {
    try {
      const wallet = {
        address: userAddress,
        balance: 0,
        staked: 0,
        rewards: 0,
        transactions: [],
        createdAt: new Date().toISOString(),
        trustLine: false,
        kycVerified: false
      };

      this.wallets.set(userAddress, wallet);

      // Send welcome bonus (if applicable)
      await this.mintTokens(userAddress, 100, 'welcome_bonus');

      return {
        success: true,
        address: userAddress,
        balance: 100,
        message: 'INDI wallet created with 100 INDI welcome bonus'
      };
    } catch (error) {
      console.error('Create wallet error:', error);
      throw error;
    }
  }

  /**
   * Get wallet balance and info
   */
  async getWallet(address) {
    const wallet = this.wallets.get(address);
    if (!wallet) {
      return await this.createWallet(address);
    }

    return {
      success: true,
      wallet: {
        address: wallet.address,
        balance: wallet.balance,
        staked: wallet.staked,
        rewards: wallet.rewards,
        totalValue: wallet.balance + wallet.staked + wallet.rewards,
        trustLine: wallet.trustLine,
        kycVerified: wallet.kycVerified,
        createdAt: wallet.createdAt
      }
    };
  }

  /**
   * Mint new INDI tokens
   */
  async mintTokens(recipient, amount, reason) {
    try {
      const wallet = this.wallets.get(recipient);
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      const transaction = {
        txId: this.generateTxId(),
        type: 'mint',
        from: 'treasury',
        to: recipient,
        amount: amount,
        reason: reason,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };

      wallet.balance += amount;
      wallet.transactions.push(transaction.txId);
      this.transactions.set(transaction.txId, transaction);
      this.circulatingSupply += amount;

      return {
        success: true,
        txId: transaction.txId,
        amount: amount,
        newBalance: wallet.balance
      };
    } catch (error) {
      console.error('Mint tokens error:', error);
      throw error;
    }
  }

  /**
   * Transfer INDI between users
   */
  async transfer(from, to, amount, memo = '') {
    try {
      const fromWallet = this.wallets.get(from);
      const toWallet = this.wallets.get(to);

      if (!fromWallet) throw new Error('Sender wallet not found');
      if (!toWallet) throw new Error('Recipient wallet not found');
      if (fromWallet.balance < amount) throw new Error('Insufficient balance');

      const transaction = {
        txId: this.generateTxId(),
        type: 'transfer',
        from: from,
        to: to,
        amount: amount,
        memo: memo,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };

      fromWallet.balance -= amount;
      toWallet.balance += amount;
      fromWallet.transactions.push(transaction.txId);
      toWallet.transactions.push(transaction.txId);
      this.transactions.set(transaction.txId, transaction);

      return {
        success: true,
        txId: transaction.txId,
        amount: amount,
        fromBalance: fromWallet.balance,
        toBalance: toWallet.balance
      };
    } catch (error) {
      console.error('Transfer error:', error);
      throw error;
    }
  }

  /**
   * Burn INDI tokens (deflationary mechanism)
   */
  async burnTokens(address, amount, reason) {
    try {
      const wallet = this.wallets.get(address);
      if (!wallet) throw new Error('Wallet not found');
      if (wallet.balance < amount) throw new Error('Insufficient balance');

      const transaction = {
        txId: this.generateTxId(),
        type: 'burn',
        from: address,
        to: 'burn_address',
        amount: amount,
        reason: reason,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };

      wallet.balance -= amount;
      wallet.transactions.push(transaction.txId);
      this.transactions.set(transaction.txId, transaction);
      this.burnedSupply += amount;
      this.circulatingSupply -= amount;

      return {
        success: true,
        txId: transaction.txId,
        amount: amount,
        newBalance: wallet.balance,
        totalBurned: this.burnedSupply
      };
    } catch (error) {
      console.error('Burn tokens error:', error);
      throw error;
    }
  }

  /**
   * Stake INDI tokens
   */
  async stakeTokens(address, amount, lockPeriodDays) {
    try {
      const wallet = this.wallets.get(address);
      if (!wallet) throw new Error('Wallet not found');
      if (wallet.balance < amount) throw new Error('Insufficient balance');
      if (amount < this.feeStructure.staking.minimum) {
        throw new Error(`Minimum stake is ${this.feeStructure.staking.minimum} INDI`);
      }

      const apyIndex = this.feeStructure.staking.lockPeriods.indexOf(lockPeriodDays);
      if (apyIndex === -1) throw new Error('Invalid lock period');

      const apy = this.feeStructure.staking.apy[apyIndex];
      const unlockDate = new Date(Date.now() + lockPeriodDays * 24 * 60 * 60 * 1000);

      const stake = {
        stakeId: this.generateTxId(),
        address: address,
        amount: amount,
        lockPeriod: lockPeriodDays,
        apy: apy,
        stakedAt: new Date().toISOString(),
        unlockDate: unlockDate.toISOString(),
        status: 'active',
        rewards: 0,
        lastRewardCalculation: new Date().toISOString()
      };

      wallet.balance -= amount;
      wallet.staked += amount;
      this.stakingPositions.set(stake.stakeId, stake);

      return {
        success: true,
        stakeId: stake.stakeId,
        amount: amount,
        apy: apy,
        unlockDate: stake.unlockDate,
        balance: wallet.balance,
        staked: wallet.staked
      };
    } catch (error) {
      console.error('Stake tokens error:', error);
      throw error;
    }
  }

  /**
   * Unstake INDI tokens
   */
  async unstakeTokens(address, stakeId) {
    try {
      const stake = this.stakingPositions.get(stakeId);
      if (!stake) throw new Error('Stake not found');
      if (stake.address !== address) throw new Error('Not your stake');
      if (new Date(stake.unlockDate) > new Date()) {
        throw new Error('Stake is still locked');
      }

      const wallet = this.wallets.get(address);
      const totalReturn = stake.amount + stake.rewards;

      wallet.balance += totalReturn;
      wallet.staked -= stake.amount;
      wallet.rewards += stake.rewards;
      stake.status = 'completed';

      return {
        success: true,
        stakeId: stakeId,
        principalReturned: stake.amount,
        rewards: stake.rewards,
        totalReturned: totalReturn,
        newBalance: wallet.balance
      };
    } catch (error) {
      console.error('Unstake tokens error:', error);
      throw error;
    }
  }

  /**
   * Calculate and distribute staking rewards
   */
  async calculateRewards() {
    const now = new Date();
    const rewardsDistributed = [];

    for (const [stakeId, stake] of this.stakingPositions) {
      if (stake.status !== 'active') continue;

      const lastCalc = new Date(stake.lastRewardCalculation);
      const daysSinceCalc = (now - lastCalc) / (1000 * 60 * 60 * 24);

      if (daysSinceCalc >= 1) {
        const dailyRate = stake.apy / 365;
        const reward = stake.amount * dailyRate * daysSinceCalc;
        stake.rewards += reward;
        stake.lastRewardCalculation = now.toISOString();

        rewardsDistributed.push({
          stakeId: stakeId,
          address: stake.address,
          reward: reward,
          totalRewards: stake.rewards
        });
      }
    }

    return {
      success: true,
      rewardsDistributed: rewardsDistributed.length,
      details: rewardsDistributed
    };
  }

  /**
   * Get transaction history
   */
  async getTransactionHistory(address, options = {}) {
    const wallet = this.wallets.get(address);
    if (!wallet) throw new Error('Wallet not found');

    const { page = 1, limit = 20, type } = options;

    let txs = wallet.transactions
      .map(txId => this.transactions.get(txId))
      .filter(tx => tx);

    if (type) {
      txs = txs.filter(tx => tx.type === type);
    }

    txs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const total = txs.length;
    const start = (page - 1) * limit;
    txs = txs.slice(start, start + limit);

    return {
      address: address,
      transactions: txs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    };
  }

  /**
   * Get platform fee for specific action
   */
  getPlatformFee(action, amount = 0) {
    const fees = this.feeStructure;
    let fee = 0;

    switch (action) {
      case 'listing':
        fee = fees.marketplace.listing;
        break;
      case 'sale':
        fee = amount * fees.marketplace.sale;
        break;
      case 'escrow_create':
        fee = fees.escrow.creation;
        break;
      case 'escrow_release':
        fee = amount * fees.escrow.release;
        break;
      case 'mentorship_session':
        fee = fees.mentorship.session;
        break;
      case 'event_creation':
        fee = fees.events.creation;
        break;
      case 'event_ticket':
        fee = fees.events.ticket;
        break;
      default:
        fee = 0;
    }

    return Math.round(fee * 1000000) / 1000000; // Round to 6 decimals
  }

  /**
   * Get tokenomics info
   */
  async getTokenomics() {
    return {
      token: {
        code: this.tokenCode,
        name: 'Indigena Token',
        decimals: this.decimals,
        totalSupply: this.totalSupply,
        circulatingSupply: this.circulatingSupply,
        burnedSupply: this.burnedSupply,
        marketCap: this.circulatingSupply * await this.getTokenPrice()
      },
      distribution: this.tokenomics.distribution,
      feeStructure: this.feeStructure,
      staking: {
        totalStaked: Array.from(this.stakingPositions.values())
          .filter(s => s.status === 'active')
          .reduce((sum, s) => sum + s.amount, 0),
        activeStakes: Array.from(this.stakingPositions.values())
          .filter(s => s.status === 'active').length,
        apyOptions: this.feeStructure.staking.lockPeriods.map((period, i) => ({
          days: period,
          apy: this.feeStructure.staking.apy[i]
        }))
      }
    };
  }

  /**
   * Get current INDI price (mock - would integrate with DEX in production)
   */
  async getTokenPrice() {
    // In production: fetch from XRPL DEX or external price feed
    return 0.15; // $0.15 USD per INDI (mock price)
  }

  generateTxId() {
    return `INDI-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new IndiTokenService();

