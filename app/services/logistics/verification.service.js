/**
 * NFC/QR Verification Service
 * Physical artwork authentication and provenance
 */

class VerificationService {
  constructor() {
    this.tags = new Map();
    this.verifications = new Map();
    this.scans = new Map();
    this.counterfeits = new Map();
  }

  /**
   * Generate NFC/QR tag for artwork
   */
  async generateTag(artworkData) {
    try {
      const {
        nftId,
        inventoryId,
        name,
        artist,
        creationDate,
        materials,
        dimensions,
        edition,
        certificateHash
      } = artworkData;

      // Generate unique tag ID
      const tagId = this.generateTagId();

      // Create verification hash
      const verificationData = {
        nftId: nftId,
        inventoryId: inventoryId,
        name: name,
        artist: artist,
        creationDate: creationDate,
        materials: materials,
        dimensions: dimensions,
        edition: edition,
        certificateHash: certificateHash,
        issuedAt: new Date().toISOString(),
        issuer: 'Indigena Authenticity System'
      };

      const verificationHash = this.generateHash(verificationData);

      const tag = {
        tagId: tagId,
        type: 'dual', // 'nfc', 'qr', 'dual'
        status: 'active',
        artwork: {
          nftId: nftId,
          inventoryId: inventoryId,
          name: name,
          artist: artist
        },
        verification: {
          hash: verificationHash,
          data: verificationData,
          algorithm: 'SHA-256'
        },
        nfc: {
          uid: this.generateNfcUid(),
          ndefData: this.generateNdefData(tagId, verificationHash),
          encrypted: true
        },
        qr: {
          url: `https://verify.indigenamarket.com/${tagId}`,
          data: this.generateQrData(tagId, verificationHash)
        },
        security: {
          tamperProof: true,
          hologram: true,
          serialNumber: this.generateSerialNumber()
        },
        createdAt: new Date().toISOString(),
        activatedAt: null,
        scanCount: 0,
        lastScan: null
      };

      this.tags.set(tagId, tag);

      return {
        success: true,
        tagId: tagId,
        nfc: {
          uid: tag.nfc.uid,
          ndefRecord: tag.nfc.ndefData
        },
        qr: {
          url: tag.qr.url,
          code: tag.qr.data
        },
        security: tag.security,
        message: 'Tag generated successfully. Apply to artwork and activate.'
      };
    } catch (error) {
      console.error('Generate tag error:', error);
      throw error;
    }
  }

  /**
   * Activate tag when applied to artwork
   */
  async activateTag(tagId, activationData) {
    try {
      const tag = this.tags.get(tagId);
      if (!tag) throw new Error('Tag not found');
      if (tag.status !== 'active') throw new Error('Tag not in active state');

      const { appliedBy, location, images } = activationData;

      tag.activatedAt = new Date().toISOString();
      tag.activation = {
        appliedBy: appliedBy,
        location: location,
        images: images || [],
        timestamp: tag.activatedAt
      };

      return {
        success: true,
        tagId: tagId,
        status: 'activated',
        activatedAt: tag.activatedAt
      };
    } catch (error) {
      console.error('Activate tag error:', error);
      throw error;
    }
  }

  /**
   * Verify artwork by scanning tag
   */
  async verify(scanData) {
    try {
      const { tagId, scanType, location, deviceInfo } = scanData;

      // Record scan
      const scan = {
        scanId: this.generateScanId(),
        tagId: tagId,
        scanType: scanType, // 'nfc', 'qr', 'manual'
        timestamp: new Date().toISOString(),
        location: location,
        device: deviceInfo,
        result: null
      };

      // Find tag
      const tag = this.tags.get(tagId);

      if (!tag) {
        // Check if this is a known counterfeit
        const counterfeit = this.counterfeits.get(tagId);
        
        scan.result = 'counterfeit';
        scan.details = counterfeit ? {
          reason: 'Known counterfeit tag',
          originalTag: counterfeit.originalTag,
          reportedAt: counterfeit.reportedAt
        } : {
          reason: 'Unknown or invalid tag'
        };

        this.scans.set(scan.scanId, scan);

        return {
          success: false,
          authentic: false,
          reason: scan.details.reason,
          warning: 'This may be a counterfeit item. Contact Indigena support.',
          scanId: scan.scanId
        };
      }

      // Update tag scan stats
      tag.scanCount++;
      tag.lastScan = scan.timestamp;

      // Verify hash integrity
      const currentHash = this.generateHash(tag.verification.data);
      const hashValid = currentHash === tag.verification.hash;

      if (!hashValid) {
        scan.result = 'tampered';
        this.scans.set(scan.scanId, scan);

        return {
          success: false,
          authentic: false,
          reason: 'Verification data has been tampered with',
          warning: 'Data integrity check failed. Item may be compromised.',
          scanId: scan.scanId
        };
      }

      scan.result = 'authentic';
      this.scans.set(scan.scanId, scan);

      // Get provenance
      const provenance = await this.getProvenance(tag.artwork.nftId);

      return {
        success: true,
        authentic: true,
        scanId: scan.scanId,
        artwork: {
          name: tag.artwork.name,
          artist: tag.artwork.artist,
          nftId: tag.artwork.nftId,
          edition: tag.verification.data.edition
        },
        verification: {
          hash: tag.verification.hash,
          algorithm: tag.verification.algorithm,
          issuedAt: tag.verification.data.issuedAt,
          issuer: tag.verification.data.issuer
        },
        provenance: provenance,
        tag: {
          activatedAt: tag.activatedAt,
          scanCount: tag.scanCount,
          security: tag.security
        }
      };
    } catch (error) {
      console.error('Verify error:', error);
      throw error;
    }
  }

  /**
   * Report counterfeit
   */
  async reportCounterfeit(reportData) {
    try {
      const { tagId, reporter, evidence, description, location } = reportData;

      const counterfeit = {
        tagId: tagId,
        reportedBy: reporter,
        reportedAt: new Date().toISOString(),
        description: description,
        evidence: evidence || [],
        location: location,
        status: 'reported', // 'reported', 'investigating', 'confirmed', 'resolved'
        investigation: null
      };

      this.counterfeits.set(tagId, counterfeit);

      // If this matches a real tag, flag it
      const realTag = this.tags.get(tagId);
      if (realTag) {
        realTag.status = 'under_investigation';
      }

      return {
        success: true,
        reportId: this.generateReportId(),
        tagId: tagId,
        status: 'reported',
        message: 'Counterfeit report submitted. Our team will investigate.'
      };
    } catch (error) {
      console.error('Report counterfeit error:', error);
      throw error;
    }
  }

  /**
   * Get provenance history
   */
  async getProvenance(nftId) {
    // In production: Fetch from blockchain and database
    return {
      nftId: nftId,
      creation: {
        date: '2024-01-15',
        artist: 'Artist Name',
        location: 'Navajo Nation'
      },
      ownership: [
        {
          owner: 'Artist Wallet',
          acquired: '2024-01-15',
          transferred: '2024-03-20',
          price: null
        },
        {
          owner: 'Collector Wallet',
          acquired: '2024-03-20',
          transferred: null,
          price: '5000 INDI'
        }
      ],
      exhibitions: [],
      appraisals: []
    };
  }

  /**
   * Batch generate tags for collection
   */
  async batchGenerateTags(collectionData) {
    try {
      const { items, artist } = collectionData;
      const tags = [];

      for (const item of items) {
        const tag = await this.generateTag({
          ...item,
          artist: artist
        });
        tags.push(tag);
      }

      return {
        success: true,
        generated: tags.length,
        tags: tags
      };
    } catch (error) {
      console.error('Batch generate error:', error);
      throw error;
    }
  }

  /**
   * Get tag statistics
   */
  async getTagStats(tagId) {
    const tag = this.tags.get(tagId);
    if (!tag) throw new Error('Tag not found');

    const scans = Array.from(this.scans.values())
      .filter(s => s.tagId === tagId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return {
      tagId: tagId,
      status: tag.status,
      totalScans: tag.scanCount,
      activatedAt: tag.activatedAt,
      lastScan: tag.lastScan,
      recentScans: scans.slice(0, 10),
      scanLocations: this.aggregateScanLocations(scans)
    };
  }

  /**
   * Transfer tag to new owner
   */
  async transferTag(tagId, transferData) {
    try {
      const tag = this.tags.get(tagId);
      if (!tag) throw new Error('Tag not found');

      const { from, to, txId, price } = transferData;

      // Record transfer in verification data
      tag.verification.data.transfers = tag.verification.data.transfers || [];
      tag.verification.data.transfers.push({
        from: from,
        to: to,
        date: new Date().toISOString(),
        txId: txId,
        price: price
      });

      // Update hash
      tag.verification.hash = this.generateHash(tag.verification.data);

      return {
        success: true,
        tagId: tagId,
        newOwner: to,
        newHash: tag.verification.hash,
        transferCount: tag.verification.data.transfers.length
      };
    } catch (error) {
      console.error('Transfer tag error:', error);
      throw error;
    }
  }

  /**
   * Deactivate tag (if artwork destroyed, etc.)
   */
  async deactivateTag(tagId, reason, authorizedBy) {
    try {
      const tag = this.tags.get(tagId);
      if (!tag) throw new Error('Tag not found');

      tag.status = 'deactivated';
      tag.deactivation = {
        reason: reason,
        authorizedBy: authorizedBy,
        timestamp: new Date().toISOString()
      };

      return {
        success: true,
        tagId: tagId,
        status: 'deactivated',
        reason: reason
      };
    } catch (error) {
      console.error('Deactivate tag error:', error);
      throw error;
    }
  }

  // Helper methods
  generateTagId() {
    return `TAG-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  generateNfcUid() {
    return Array.from({length: 7}, () => 
      Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
    ).join(':').toUpperCase();
  }

  generateSerialNumber() {
    return `IND-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Date.now().toString(36).substr(-4).toUpperCase()}`;
  }

  generateScanId() {
    return `SCN-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  generateReportId() {
    return `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  generateHash(data) {
    // In production: Use proper SHA-256
    return '0x' + Array.from({length: 64}, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  generateNdefData(tagId, hash) {
    return {
      type: 'application/vnd.indigena.tag',
      data: {
        tagId: tagId,
        hash: hash.substring(0, 16) + '...',
        verifyUrl: `https://verify.indigenamarket.com/${tagId}`
      }
    };
  }

  generateQrData(tagId, hash) {
    return JSON.stringify({
      v: '1.0',
      id: tagId,
      h: hash.substring(0, 16),
      u: `https://verify.indigenamarket.com/${tagId}`
    });
  }

  aggregateScanLocations(scans) {
    const locations = {};
    scans.forEach(scan => {
      if (scan.location) {
        const key = `${scan.location.city}, ${scan.location.country}`;
        locations[key] = (locations[key] || 0) + 1;
      }
    });
    return locations;
  }
}

module.exports = new VerificationService();
