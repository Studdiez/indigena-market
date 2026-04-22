/**
 * Health Check Service
 * Monitor system status and dependencies
 */

class HealthCheckService {
  constructor() {
    this.checks = new Map();
    this.status = {
      status: 'healthy',
      lastCheck: null,
      uptime: process.uptime()
    };
    this.initializeChecks();
  }

  initializeChecks() {
    // Register default health checks
    this.registerCheck('api', this.checkAPI.bind(this));
    this.registerCheck('memory', this.checkMemory.bind(this));
    this.registerCheck('disk', this.checkDisk.bind(this));
    this.registerCheck('xrpl', this.checkXRPL.bind(this));
    this.registerCheck('database', this.checkDatabase.bind(this));
  }

  /**
   * Register a health check
   */
  registerCheck(name, checkFunction) {
    this.checks.set(name, {
      name: name,
      check: checkFunction,
      lastResult: null,
      lastRun: null
    });
  }

  /**
   * Run all health checks
   */
  async runAllChecks() {
    const results = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      checks: {},
      summary: {
        total: 0,
        healthy: 0,
        degraded: 0,
        unhealthy: 0
      }
    };

    for (const [name, checkConfig] of this.checks) {
      try {
        const startTime = Date.now();
        const checkResult = await checkConfig.check();
        const responseTime = Date.now() - startTime;

        const result = {
          status: checkResult.status || 'healthy',
          responseTime: responseTime + 'ms',
          message: checkResult.message || 'OK',
          details: checkResult.details || {},
          lastRun: new Date().toISOString()
        };

        checkConfig.lastResult = result;
        checkConfig.lastRun = new Date().toISOString();

        results.checks[name] = result;
        results.summary.total++;

        if (result.status === 'healthy') {
          results.summary.healthy++;
        } else if (result.status === 'degraded') {
          results.summary.degraded++;
          if (results.status === 'healthy') results.status = 'degraded';
        } else {
          results.summary.unhealthy++;
          results.status = 'unhealthy';
        }
      } catch (error) {
        results.checks[name] = {
          status: 'unhealthy',
          error: error.message,
          lastRun: new Date().toISOString()
        };
        results.summary.total++;
        results.summary.unhealthy++;
        results.status = 'unhealthy';
      }
    }

    this.status = {
      status: results.status,
      lastCheck: results.timestamp,
      uptime: process.uptime()
    };

    return results;
  }

  /**
   * Run single health check
   */
  async runCheck(name) {
    const checkConfig = this.checks.get(name);
    if (!checkConfig) {
      return {
        success: false,
        error: `Health check '${name}' not found`
      };
    }

    try {
      const startTime = Date.now();
      const result = await checkConfig.check();
      const responseTime = Date.now() - startTime;

      return {
        success: true,
        name: name,
        status: result.status || 'healthy',
        responseTime: responseTime + 'ms',
        message: result.message || 'OK',
        details: result.details || {}
      };
    } catch (error) {
      return {
        success: false,
        name: name,
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  /**
   * API health check
   */
  async checkAPI() {
    const memoryUsage = process.memoryUsage();
    
    return {
      status: 'healthy',
      message: 'API is responding',
      details: {
        uptime: Math.floor(process.uptime()) + 's',
        memory: {
          used: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
          total: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB'
        },
        nodeVersion: process.version,
        platform: process.platform
      }
    };
  }

  /**
   * Memory health check
   */
  async checkMemory() {
    const memoryUsage = process.memoryUsage();
    const heapUsedMB = memoryUsage.heapUsed / 1024 / 1024;
    const heapTotalMB = memoryUsage.heapTotal / 1024 / 1024;
    const usagePercent = (heapUsedMB / heapTotalMB) * 100;

    let status = 'healthy';
    let message = 'Memory usage normal';

    if (usagePercent > 90) {
      status = 'unhealthy';
      message = 'Critical memory usage';
    } else if (usagePercent > 75) {
      status = 'degraded';
      message = 'High memory usage';
    }

    return {
      status: status,
      message: message,
      details: {
        heapUsed: Math.round(heapUsedMB) + 'MB',
        heapTotal: Math.round(heapTotalMB) + 'MB',
        usagePercent: usagePercent.toFixed(2) + '%',
        rss: Math.round(memoryUsage.rss / 1024 / 1024) + 'MB'
      }
    };
  }

  /**
   * Disk health check (simulated)
   */
  async checkDisk() {
    // In production, this would check actual disk usage
    return {
      status: 'healthy',
      message: 'Disk space available',
      details: {
        free: '50GB',
        total: '100GB',
        usagePercent: '50%'
      }
    };
  }

  /**
   * XRPL connection check
   */
  async checkXRPL() {
    // In production, this would check actual XRPL node connection
    return {
      status: 'healthy',
      message: 'XRPL node connected',
      details: {
        network: 'testnet',
        latency: '45ms',
        lastBlock: 12345678
      }
    };
  }

  /**
   * Database health check
   */
  async checkDatabase() {
    // In production, this would check actual database connection
    return {
      status: 'healthy',
      message: 'Database connected',
      details: {
        type: 'MongoDB',
        connections: 5,
        latency: '12ms'
      }
    };
  }

  /**
   * Get system metrics
   */
  async getMetrics() {
    const memoryUsage = process.memoryUsage();
    
    return {
      success: true,
      timestamp: new Date().toISOString(),
      system: {
        uptime: process.uptime(),
        platform: process.platform,
        nodeVersion: process.version,
        pid: process.pid
      },
      memory: {
        heapUsed: memoryUsage.heapUsed,
        heapTotal: memoryUsage.heapTotal,
        rss: memoryUsage.rss,
        external: memoryUsage.external
      },
      cpu: process.cpuUsage(),
      resources: process.resourceUsage ? process.resourceUsage() : null
    };
  }

  /**
   * Get readiness status (for Kubernetes)
   */
  async getReadiness() {
    const checks = await this.runAllChecks();
    
    return {
      ready: checks.status === 'healthy',
      status: checks.status,
      timestamp: checks.timestamp,
      checks: checks.summary
    };
  }

  /**
   * Get liveness status (for Kubernetes)
   */
  async getLiveness() {
    const uptime = process.uptime();
    const isAlive = uptime > 0;

    return {
      alive: isAlive,
      uptime: uptime,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get current status
   */
  async getStatus() {
    return {
      success: true,
      status: this.status.status,
      lastCheck: this.status.lastCheck,
      uptime: Math.floor(this.status.uptime) + 's'
    };
  }

  /**
   * Get all registered checks
   */
  async getRegisteredChecks() {
    const checks = [];
    
    for (const [name, config] of this.checks) {
      checks.push({
        name: name,
        lastRun: config.lastRun,
        lastStatus: config.lastResult?.status || 'unknown'
      });
    }

    return {
      success: true,
      checks: checks
    };
  }
}

module.exports = new HealthCheckService();
