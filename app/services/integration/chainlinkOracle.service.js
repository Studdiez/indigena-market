/**
 * Chainlink Oracle Service
 * Price feeds and external data for smart contracts
 */

class ChainlinkOracleService {
  constructor() {
    this.priceFeeds = new Map();
    this.dataRequests = new Map();
    this.automationJobs = new Map();
    this.initializeFeeds();
  }

  initializeFeeds() {
    // Initialize price feeds
    const feeds = [
      { pair: 'XRP/USD', decimals: 8, heartbeat: 3600 },
      { pair: 'INDI/USD', decimals: 8, heartbeat: 3600 },
      { pair: 'BTC/USD', decimals: 8, heartbeat: 3600 },
      { pair: 'ETH/USD', decimals: 8, heartbeat: 3600 },
      { pair: 'EUR/USD', decimals: 8, heartbeat: 86400 }
    ];

    feeds.forEach(feed => {
      this.priceFeeds.set(feed.pair, {
        ...feed,
        currentPrice: this.generateMockPrice(feed.pair),
        lastUpdate: new Date().toISOString(),
        roundId: 1
      });
    });
  }

  generateMockPrice(pair) {
    const basePrices = {
      'XRP/USD': 0.62,
      'INDI/USD': 0.15,
      'BTC/USD': 67500,
      'ETH/USD': 3550,
      'EUR/USD': 1.08
    };

    const base = basePrices[pair] || 1.0;
    const variance = 0.02; // 2% variance
    return base * (1 + (Math.random() - 0.5) * variance);
  }

  /**
   * Get latest price feed
   */
  async getLatestPrice(pair) {
    try {
      const feed = this.priceFeeds.get(pair);
      if (!feed) {
        throw new Error(`Price feed not found for ${pair}`);
      }

      // Update price (simulate real-time updates)
      feed.currentPrice = this.generateMockPrice(pair);
      feed.lastUpdate = new Date().toISOString();
      feed.roundId++;

      return {
        success: true,
        pair: pair,
        price: feed.currentPrice,
        decimals: feed.decimals,
        roundId: feed.roundId,
        timestamp: feed.lastUpdate,
        answeredInRound: feed.roundId
      };
    } catch (error) {
      console.error('Get latest price error:', error);
      throw error;
    }
  }

  /**
   * Get multiple price feeds
   */
  async getMultiplePrices(pairs) {
    try {
      const results = {};

      for (const pair of pairs) {
        const price = await this.getLatestPrice(pair);
        results[pair] = price;
      }

      return {
        success: true,
        prices: results,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Get multiple prices error:', error);
      throw error;
    }
  }

  /**
   * Get price history
   */
  async getPriceHistory(pair, options = {}) {
    try {
      const { hours = 24, interval = '1h' } = options;
      const history = [];

      const basePrice = this.generateMockPrice(pair);
      const now = new Date();

      for (let i = hours; i >= 0; i--) {
        const time = new Date(now - i * 3600 * 1000);
        const variance = (Math.random() - 0.5) * 0.05;
        
        history.push({
          timestamp: time.toISOString(),
          price: basePrice * (1 + variance),
          roundId: 1000000 + i
        });
      }

      return {
        success: true,
        pair: pair,
        history: history,
        change24h: ((history[history.length - 1].price - history[0].price) / history[0].price) * 100
      };
    } catch (error) {
      console.error('Get price history error:', error);
      throw error;
    }
  }

  /**
   * Request external data (Any API)
   */
  async requestExternalData(requestData) {
    try {
      const { jobId, url, path, payment } = requestData;

      const request = {
        requestId: this.generateRequestId(),
        jobId: jobId,
        status: 'pending',
        request: {
          url: url,
          path: path,
          payment: payment
        },
        result: null,
        createdAt: new Date().toISOString(),
        fulfilledAt: null
      };

      this.dataRequests.set(request.requestId, request);

      // Simulate oracle fulfillment
      setTimeout(() => {
        this.fulfillRequest(request.requestId, {
          value: Math.random() * 1000,
          timestamp: new Date().toISOString()
        });
      }, 5000);

      return {
        success: true,
        requestId: request.requestId,
        status: 'pending',
        estimatedFulfillment: '5-10 seconds'
      };
    } catch (error) {
      console.error('Request external data error:', error);
      throw error;
    }
  }

  /**
   * Fulfill data request
   */
  async fulfillRequest(requestId, result) {
    const request = this.dataRequests.get(requestId);
    if (!request) return;

    request.status = 'fulfilled';
    request.result = result;
    request.fulfilledAt = new Date().toISOString();

    return {
      success: true,
      requestId: requestId,
      result: result
    };
  }

  /**
   * Get request status
   */
  async getRequestStatus(requestId) {
    const request = this.dataRequests.get(requestId);
    if (!request) {
      throw new Error('Request not found');
    }

    return {
      success: true,
      requestId: requestId,
      status: request.status,
      result: request.result,
      createdAt: request.createdAt,
      fulfilledAt: request.fulfilledAt
    };
  }

  /**
   * Register automation job (Chainlink Keepers)
   */
  async registerAutomation(jobData) {
    try {
      const job = {
        jobId: this.generateJobId(),
        name: jobData.name,
        contractAddress: jobData.contractAddress,
        functionSelector: jobData.functionSelector,
        checkData: jobData.checkData || '0x',
        schedule: {
          cron: jobData.cron || '0 * * * *', // Default: hourly
          gasLimit: jobData.gasLimit || 200000
        },
        payment: {
          linkAmount: jobData.linkAmount || 1,
          currency: 'LINK'
        },
        status: 'active',
        executions: [],
        createdAt: new Date().toISOString()
      };

      this.automationJobs.set(job.jobId, job);

      return {
        success: true,
        jobId: job.jobId,
        status: job.status,
        nextExecution: this.calculateNextExecution(job.schedule.cron)
      };
    } catch (error) {
      console.error('Register automation error:', error);
      throw error;
    }
  }

  /**
   * Execute automation job
   */
  async executeAutomation(jobId) {
    const job = this.automationJobs.get(jobId);
    if (!job) throw new Error('Job not found');

    const execution = {
      executionId: this.generateExecutionId(),
      jobId: jobId,
      timestamp: new Date().toISOString(),
      txHash: `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      gasUsed: Math.floor(Math.random() * 100000) + 50000,
      success: true
    };

    job.executions.push(execution);

    return {
      success: true,
      executionId: execution.executionId,
      txHash: execution.txHash,
      timestamp: execution.timestamp
    };
  }

  /**
   * Get automation job status
   */
  async getAutomationStatus(jobId) {
    const job = this.automationJobs.get(jobId);
    if (!job) throw new Error('Job not found');

    return {
      success: true,
      jobId: jobId,
      name: job.name,
      status: job.status,
      executions: job.executions.length,
      lastExecution: job.executions[job.executions.length - 1] || null,
      nextExecution: this.calculateNextExecution(job.schedule.cron)
    };
  }

  /**
   * Verify price feed (for smart contract validation)
   */
  async verifyPrice(pair, expectedPrice, tolerance = 0.01) {
    try {
      const latest = await this.getLatestPrice(pair);
      const difference = Math.abs(latest.price - expectedPrice) / expectedPrice;
      const valid = difference <= tolerance;

      return {
        success: true,
        pair: pair,
        valid: valid,
        expectedPrice: expectedPrice,
        actualPrice: latest.price,
        difference: difference * 100,
        tolerance: tolerance * 100,
        timestamp: latest.timestamp
      };
    } catch (error) {
      console.error('Verify price error:', error);
      throw error;
    }
  }

  calculateNextExecution(cron) {
    // Simplified: return 1 hour from now
    const next = new Date();
    next.setHours(next.getHours() + 1);
    return next.toISOString();
  }

  generateRequestId() {
    return `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  generateJobId() {
    return `JOB-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  generateExecutionId() {
    return `EXE-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new ChainlinkOracleService();
