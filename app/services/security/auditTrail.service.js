/**
 * Blockchain Audit Trail Service
 * Immutable record of all transactions and activities
 */

const crypto = require('crypto');

class AuditTrailService {
  constructor() {
    this.auditLogs = new Map();
    this.blockchainAnchors = new Map();
    this.eventTypes = new Set([
      'nft_mint',
      'nft_sale',
      'nft_transfer',
      'bid_placed',
      'bid_cancelled',
      'offer_made',
      'offer_accepted',
      'royalty_paid',
      'seva_contribution',
      'user_registered',
      'verification_submitted',
      'verification_approved',
      'content_flagged',
      'dispute_opened',
      'dispute_resolved',
      'payout_processed',
      'settings_changed'
    ]);
    this.retentionPeriod = 7 * 365 * 24 * 60 * 60 * 1000; // 7 years in milliseconds
  }

  /**
   * Log an event to the audit trail
   */
  async logEvent(eventData) {
    try {
      const {
        eventType,
        actor,
        resource,
        details,
        ipAddress,
        userAgent,
        transactionHash = null
      } = eventData;

      // Validate event type
      if (!this.eventTypes.has(eventType)) {
        throw new Error(`Invalid event type: ${eventType}`);
      }

      const timestamp = new Date().toISOString();
      const logId = this.generateLogId();

      // Create audit log entry
      const auditLog = {
        logId,
        eventType,
        actor: {
          address: actor,
          type: this.determineActorType(actor)
        },
        resource: {
          type: resource.type,
          id: resource.id,
          owner: resource.owner
        },
        details: this.sanitizeDetails(details),
        metadata: {
          timestamp,
          ipAddress: this.hashData(ipAddress),
          userAgent: this.hashData(userAgent),
          sessionId: details.sessionId || null
        },
        integrity: {
          previousHash: await this.getPreviousHash(),
          dataHash: null // Will be calculated
        },
        blockchain: {
          anchored: false,
          anchorHash: null,
          anchorTimestamp: null
        }
      };

      // Calculate hash for integrity
      auditLog.integrity.dataHash = this.calculateLogHash(auditLog);

      // Store log
      this.auditLogs.set(logId, auditLog);

      // If transaction hash provided, link to blockchain
      if (transactionHash) {
        await this.linkToBlockchain(logId, transactionHash);
      }

      // Periodically anchor to blockchain
      await this.maybeAnchorToBlockchain();

      return {
        success: true,
        logId,
        timestamp,
        eventType,
        integrityHash: auditLog.integrity.dataHash
      };
    } catch (error) {
      console.error('Audit log error:', error);
      throw error;
    }
  }

  /**
   * Get audit trail for a specific resource
   */
  async getAuditTrail(resourceType, resourceId, options = {}) {
    try {
      const {
        startDate,
        endDate,
        eventTypes = [],
        limit = 100,
        offset = 0,
        includeDetails = true
      } = options;

      // Filter logs
      let logs = Array.from(this.auditLogs.values()).filter(log => 
        log.resource.type === resourceType && 
        log.resource.id === resourceId
      );

      // Apply date filters
      if (startDate) {
        logs = logs.filter(log => log.metadata.timestamp >= startDate);
      }
      if (endDate) {
        logs = logs.filter(log => log.metadata.timestamp <= endDate);
      }

      // Apply event type filter
      if (eventTypes.length > 0) {
        logs = logs.filter(log => eventTypes.includes(log.eventType));
      }

      // Sort by timestamp (newest first)
      logs.sort((a, b) => new Date(b.metadata.timestamp) - new Date(a.metadata.timestamp));

      // Paginate
      const total = logs.length;
      logs = logs.slice(offset, offset + limit);

      // Verify integrity of each log
      const verifiedLogs = logs.map(log => ({
        ...log,
        integrity: {
          ...log.integrity,
          verified: this.verifyLogIntegrity(log)
        }
      }));

      return {
        success: true,
        resourceType,
        resourceId,
        total,
        limit,
        offset,
        logs: includeDetails ? verifiedLogs : verifiedLogs.map(l => ({
          logId: l.logId,
          eventType: l.eventType,
          actor: l.actor,
          timestamp: l.metadata.timestamp,
          integrity: l.integrity
        }))
      };
    } catch (error) {
      console.error('Get audit trail error:', error);
      throw error;
    }
  }

  /**
   * Get audit trail for a user
   */
  async getUserAuditTrail(userAddress, options = {}) {
    try {
      const {
        startDate,
        endDate,
        limit = 100,
        offset = 0
      } = options;

      let logs = Array.from(this.auditLogs.values()).filter(log => 
        log.actor.address === userAddress || 
        log.resource.owner === userAddress
      );

      if (startDate) {
        logs = logs.filter(log => log.metadata.timestamp >= startDate);
      }
      if (endDate) {
        logs = logs.filter(log => log.metadata.timestamp <= endDate);
      }

      logs.sort((a, b) => new Date(b.metadata.timestamp) - new Date(a.metadata.timestamp));

      const total = logs.length;
      logs = logs.slice(offset, offset + limit);

      return {
        success: true,
        userAddress,
        total,
        limit,
        offset,
        logs: logs.map(log => ({
          logId: log.logId,
          eventType: log.eventType,
          resource: log.resource,
          timestamp: log.metadata.timestamp,
          blockchainAnchored: log.blockchain.anchored
        }))
      };
    } catch (error) {
      console.error('Get user audit trail error:', error);
      throw error;
    }
  }

  /**
   * Verify integrity of a specific log
   */
  async verifyLog(logId) {
    try {
      const log = this.auditLogs.get(logId);
      if (!log) {
        throw new Error('Log not found');
      }

      const calculatedHash = this.calculateLogHash(log);
      const integrityVerified = calculatedHash === log.integrity.dataHash;

      // Verify blockchain anchor if exists
      let blockchainVerified = false;
      if (log.blockchain.anchorHash) {
        blockchainVerified = await this.verifyBlockchainAnchor(log);
      }

      return {
        success: true,
        logId,
        integrityVerified,
        blockchainVerified,
        details: {
          storedHash: log.integrity.dataHash,
          calculatedHash,
          anchorHash: log.blockchain.anchorHash,
          anchoredAt: log.blockchain.anchorTimestamp
        }
      };
    } catch (error) {
      console.error('Verify log error:', error);
      throw error;
    }
  }

  /**
   * Create tamper-proof snapshot
   */
  async createSnapshot(snapshotData) {
    try {
      const {
        name,
        description,
        resourceTypes = [],
        startDate,
        endDate
      } = snapshotData;

      const timestamp = new Date().toISOString();
      const snapshotId = this.generateSnapshotId();

      // Collect relevant logs
      let logs = Array.from(this.auditLogs.values());
      
      if (resourceTypes.length > 0) {
        logs = logs.filter(log => resourceTypes.includes(log.resource.type));
      }
      
      if (startDate) {
        logs = logs.filter(log => log.metadata.timestamp >= startDate);
      }
      if (endDate) {
        logs = logs.filter(log => log.metadata.timestamp <= endDate);
      }

      // Create Merkle tree of logs
      const merkleRoot = this.createMerkleRoot(logs);

      const snapshot = {
        snapshotId,
        name,
        description,
        createdAt: timestamp,
        parameters: {
          resourceTypes,
          startDate,
          endDate,
          logCount: logs.length
        },
        integrity: {
          merkleRoot,
          snapshotHash: this.hashData(JSON.stringify(logs))
        },
        blockchain: {
          anchored: false,
          anchorHash: null
        }
      };

      // Anchor to blockchain
      const anchorResult = await this.anchorToBlockchain(snapshot);
      snapshot.blockchain = anchorResult;

      return {
        success: true,
        snapshot,
        downloadUrl: `/api/audit/snapshots/${snapshotId}/download`
      };
    } catch (error) {
      console.error('Create snapshot error:', error);
      throw error;
    }
  }

  /**
   * Generate compliance report
   */
  async generateComplianceReport(reportOptions) {
    try {
      const {
        reportType,
        startDate,
        endDate,
        filters = {}
      } = reportOptions;

      let logs = Array.from(this.auditLogs.values()).filter(log => {
        const logDate = new Date(log.metadata.timestamp);
        return logDate >= new Date(startDate) && logDate <= new Date(endDate);
      });

      // Apply filters
      if (filters.eventTypes) {
        logs = logs.filter(log => filters.eventTypes.includes(log.eventType));
      }
      if (filters.actorType) {
        logs = logs.filter(log => log.actor.type === filters.actorType);
      }

      const report = {
        reportId: this.generateReportId(),
        reportType,
        generatedAt: new Date().toISOString(),
        period: { startDate, endDate },
        summary: {
          totalEvents: logs.length,
          byEventType: this.groupByEventType(logs),
          byActorType: this.groupByActorType(logs),
          byResourceType: this.groupByResourceType(logs),
          blockchainAnchored: logs.filter(l => l.blockchain.anchored).length
        },
        integrity: {
          reportHash: this.hashData(JSON.stringify(logs)),
          allLogsVerified: logs.every(log => this.verifyLogIntegrity(log))
        },
        logs: logs.map(log => ({
          logId: log.logId,
          eventType: log.eventType,
          timestamp: log.metadata.timestamp,
          actor: log.actor,
          resource: log.resource,
          blockchainAnchored: log.blockchain.anchored
        }))
      };

      return report;
    } catch (error) {
      console.error('Generate compliance report error:', error);
      throw error;
    }
  }

  /**
   * Search audit logs
   */
  async searchAuditLogs(searchCriteria) {
    try {
      const {
        query,
        eventTypes = [],
        actors = [],
        resources = [],
        dateRange = {},
        limit = 50
      } = searchCriteria;

      let logs = Array.from(this.auditLogs.values());

      // Apply filters
      if (query) {
        const lowerQuery = query.toLowerCase();
        logs = logs.filter(log => 
          log.logId.toLowerCase().includes(lowerQuery) ||
          log.eventType.toLowerCase().includes(lowerQuery) ||
          JSON.stringify(log.details).toLowerCase().includes(lowerQuery)
        );
      }

      if (eventTypes.length > 0) {
        logs = logs.filter(log => eventTypes.includes(log.eventType));
      }

      if (actors.length > 0) {
        logs = logs.filter(log => actors.includes(log.actor.address));
      }

      if (resources.length > 0) {
        logs = logs.filter(log => resources.includes(log.resource.id));
      }

      if (dateRange.start) {
        logs = logs.filter(log => log.metadata.timestamp >= dateRange.start);
      }
      if (dateRange.end) {
        logs = logs.filter(log => log.metadata.timestamp <= dateRange.end);
      }

      logs.sort((a, b) => new Date(b.metadata.timestamp) - new Date(a.metadata.timestamp));

      return {
        success: true,
        total: logs.length,
        limit,
        logs: logs.slice(0, limit)
      };
    } catch (error) {
      console.error('Search audit logs error:', error);
      throw error;
    }
  }

  /**
   * Archive old logs
   */
  async archiveOldLogs() {
    try {
      const cutoffDate = new Date(Date.now() - this.retentionPeriod);
      const logsToArchive = [];
      const logsToKeep = [];

      for (const [logId, log] of this.auditLogs) {
        if (new Date(log.metadata.timestamp) < cutoffDate) {
          logsToArchive.push(log);
        } else {
          logsToKeep.push(log);
        }
      }

      // In production: Move to cold storage
      // For now, just mark as archived
      logsToArchive.forEach(log => {
        log.archived = true;
        log.archivedAt = new Date().toISOString();
      });

      return {
        success: true,
        archived: logsToArchive.length,
        retained: logsToKeep.length,
        cutoffDate: cutoffDate.toISOString()
      };
    } catch (error) {
      console.error('Archive logs error:', error);
      throw error;
    }
  }

  // Helper methods
  generateLogId() {
    return `AUD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  generateSnapshotId() {
    return `SNP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  generateReportId() {
    return `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  hashData(data) {
    if (!data) return null;
    return crypto.createHash('sha256').update(String(data)).digest('hex');
  }

  calculateLogHash(log) {
    const dataToHash = {
      eventType: log.eventType,
      actor: log.actor,
      resource: log.resource,
      details: log.details,
      timestamp: log.metadata.timestamp,
      previousHash: log.integrity.previousHash
    };
    return this.hashData(JSON.stringify(dataToHash));
  }

  async getPreviousHash() {
    const logs = Array.from(this.auditLogs.values());
    if (logs.length === 0) return 'genesis';
    
    const lastLog = logs[logs.length - 1];
    return lastLog.integrity.dataHash;
  }

  verifyLogIntegrity(log) {
    const calculatedHash = this.calculateLogHash(log);
    return calculatedHash === log.integrity.dataHash;
  }

  determineActorType(address) {
    // In production: Check against user database
    if (address.startsWith('rElder')) return 'elder';
    if (address.startsWith('rAdmin')) return 'admin';
    return 'user';
  }

  sanitizeDetails(details) {
    // Remove sensitive data
    const sensitive = ['password', 'ssn', 'privateKey', 'secret'];
    const sanitized = { ...details };
    
    sensitive.forEach(key => {
      if (sanitized[key]) {
        sanitized[key] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  async linkToBlockchain(logId, transactionHash) {
    const log = this.auditLogs.get(logId);
    if (log) {
      log.blockchain.transactionHash = transactionHash;
      log.blockchain.anchored = true;
      log.blockchain.anchorTimestamp = new Date().toISOString();
    }
  }

  async maybeAnchorToBlockchain() {
    // Anchor every 100 logs or daily
    const unanchored = Array.from(this.auditLogs.values()).filter(l => !l.blockchain.anchored);
    
    if (unanchored.length >= 100) {
      await this.anchorBatchToBlockchain(unanchored);
    }
  }

  async anchorBatchToBlockchain(logs) {
    // In production: Create blockchain transaction
    const merkleRoot = this.createMerkleRoot(logs);
    
    logs.forEach(log => {
      log.blockchain.anchored = true;
      log.blockchain.anchorHash = merkleRoot;
      log.blockchain.anchorTimestamp = new Date().toISOString();
    });

    console.log(`Anchored ${logs.length} logs to blockchain`);
  }

  async anchorToBlockchain(data) {
    // In production: Create actual blockchain transaction
    const anchorHash = this.hashData(JSON.stringify(data));
    
    return {
      anchored: true,
      anchorHash,
      anchorTimestamp: new Date().toISOString(),
      transactionHash: `tx-${Date.now()}`
    };
  }

  async verifyBlockchainAnchor(log) {
    // In production: Verify against blockchain
    return log.blockchain.anchored;
  }

  createMerkleRoot(logs) {
    if (logs.length === 0) return this.hashData('empty');
    if (logs.length === 1) return logs[0].integrity.dataHash;

    const hashes = logs.map(l => l.integrity.dataHash);
    
    while (hashes.length > 1) {
      const newLevel = [];
      for (let i = 0; i < hashes.length; i += 2) {
        const left = hashes[i];
        const right = hashes[i + 1] || left;
        newLevel.push(this.hashData(left + right));
      }
      hashes.length = 0;
      hashes.push(...newLevel);
    }

    return hashes[0];
  }

  groupByEventType(logs) {
    const grouped = {};
    logs.forEach(log => {
      grouped[log.eventType] = (grouped[log.eventType] || 0) + 1;
    });
    return grouped;
  }

  groupByActorType(logs) {
    const grouped = {};
    logs.forEach(log => {
      grouped[log.actor.type] = (grouped[log.actor.type] || 0) + 1;
    });
    return grouped;
  }

  groupByResourceType(logs) {
    const grouped = {};
    logs.forEach(log => {
      grouped[log.resource.type] = (grouped[log.resource.type] || 0) + 1;
    });
    return grouped;
  }
}

module.exports = new AuditTrailService();
