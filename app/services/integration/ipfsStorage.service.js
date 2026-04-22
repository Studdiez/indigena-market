/**
 * IPFS Storage Service
 * Decentralized file storage for artwork and media
 */

class IpfsStorageService {
  constructor() {
    this.gateway = 'https://gateway.pinata.cloud/ipfs/';
    this.backupGateway = 'https://ipfs.io/ipfs/';
    this.pins = new Map();
    this.storageStats = {
      totalPinned: 0,
      totalSize: 0
    };
  }

  /**
   * Upload file to IPFS
   */
  async uploadFile(user, fileData) {
    try {
      const { content, filename, contentType, metadata = {} } = fileData;

      // In production: Use Pinata, NFT.Storage, or custom IPFS node
      // Mock CID generation
      const cid = this.generateCID();

      const pin = {
        pinId: this.generatePinId(),
        user: user,
        cid: cid,
        filename: filename,
        contentType: contentType,
        size: content.length || 0,
        metadata: {
          ...metadata,
          uploadedAt: new Date().toISOString(),
          originalName: filename
        },
        gateways: [
          `${this.gateway}${cid}`,
          `${this.backupGateway}${cid}`
        ],
        status: 'pinned',
        replication: {
          copies: 3,
          regions: ['us-east', 'eu-west', 'asia-pacific']
        },
        createdAt: new Date().toISOString()
      };

      this.pins.set(pin.pinId, pin);
      this.storageStats.totalPinned++;
      this.storageStats.totalSize += pin.size;

      return {
        success: true,
        pinId: pin.pinId,
        cid: cid,
        url: pin.gateways[0],
        size: pin.size,
        status: 'pinned'
      };
    } catch (error) {
      console.error('Upload file error:', error);
      throw error;
    }
  }

  /**
   * Upload NFT metadata
   */
  async uploadNFTMetadata(user, metadata) {
    try {
      const nftMetadata = {
        name: metadata.name,
        description: metadata.description,
        image: metadata.imageUrl,
        attributes: metadata.attributes || [],
        properties: {
          ...metadata.properties,
          creator: user,
          createdAt: new Date().toISOString()
        }
      };

      // Add cultural metadata if provided
      if (metadata.cultural) {
        nftMetadata.properties.cultural = {
          nation: metadata.cultural.nation,
          significance: metadata.cultural.significance,
          story: metadata.cultural.story,
          protocols: metadata.cultural.protocols || []
        };
      }

      // Add license info
      nftMetadata.properties.license = metadata.license || {
        type: 'all_rights_reserved',
        commercialUse: false,
        attributionRequired: true
      };

      const content = JSON.stringify(nftMetadata);
      const result = await this.uploadFile(user, {
        content: content,
        filename: `metadata-${Date.now()}.json`,
        contentType: 'application/json',
        metadata: { type: 'nft_metadata', nftName: metadata.name }
      });

      return {
        success: true,
        metadataUrl: result.url,
        cid: result.cid,
        metadata: nftMetadata
      };
    } catch (error) {
      console.error('Upload NFT metadata error:', error);
      throw error;
    }
  }

  /**
   * Upload batch of files
   */
  async uploadBatch(user, files) {
    try {
      const results = [];

      for (const file of files) {
        const result = await this.uploadFile(user, file);
        results.push(result);
      }

      return {
        success: true,
        uploaded: results.length,
        files: results
      };
    } catch (error) {
      console.error('Upload batch error:', error);
      throw error;
    }
  }

  /**
   * Get file from IPFS
   */
  async getFile(cid) {
    try {
      // Find pin by CID
      const pin = Array.from(this.pins.values()).find(p => p.cid === cid);

      if (!pin) {
        return {
          success: false,
          message: 'File not found in storage'
        };
      }

      return {
        success: true,
        cid: cid,
        url: pin.gateways[0],
        backupUrl: pin.gateways[1],
        filename: pin.filename,
        contentType: pin.contentType,
        size: pin.size,
        metadata: pin.metadata
      };
    } catch (error) {
      console.error('Get file error:', error);
      throw error;
    }
  }

  /**
   * Pin existing CID (ensure persistence)
   */
  async pinCID(user, cid, metadata = {}) {
    try {
      const pin = {
        pinId: this.generatePinId(),
        user: user,
        cid: cid,
        filename: metadata.filename || 'unknown',
        contentType: metadata.contentType || 'application/octet-stream',
        size: metadata.size || 0,
        metadata: metadata,
        gateways: [
          `${this.gateway}${cid}`,
          `${this.backupGateway}${cid}`
        ],
        status: 'pinned',
        replication: {
          copies: 3,
          regions: ['us-east', 'eu-west', 'asia-pacific']
        },
        createdAt: new Date().toISOString()
      };

      this.pins.set(pin.pinId, pin);
      this.storageStats.totalPinned++;

      return {
        success: true,
        pinId: pin.pinId,
        cid: cid,
        status: 'pinned'
      };
    } catch (error) {
      console.error('Pin CID error:', error);
      throw error;
    }
  }

  /**
   * Unpin file (remove from persistent storage)
   */
  async unpinFile(user, pinId) {
    try {
      const pin = this.pins.get(pinId);
      if (!pin) throw new Error('Pin not found');
      if (pin.user !== user) throw new Error('Not authorized');

      pin.status = 'unpinned';
      pin.unpinnedAt = new Date().toISOString();
      this.storageStats.totalPinned--;
      this.storageStats.totalSize -= pin.size;

      return {
        success: true,
        pinId: pinId,
        cid: pin.cid,
        status: 'unpinned'
      };
    } catch (error) {
      console.error('Unpin file error:', error);
      throw error;
    }
  }

  /**
   * Get user's storage usage
   */
  async getStorageUsage(user) {
    const userPins = Array.from(this.pins.values())
      .filter(p => p.user === user);

    const totalSize = userPins.reduce((sum, p) => sum + p.size, 0);

    return {
      success: true,
      user: user,
      totalFiles: userPins.length,
      totalSize: totalSize,
      totalSizeFormatted: this.formatBytes(totalSize),
      pins: userPins.map(p => ({
        pinId: p.pinId,
        cid: p.cid,
        filename: p.filename,
        size: p.size,
        status: p.status,
        createdAt: p.createdAt
      }))
    };
  }

  /**
   * Verify file integrity
   */
  async verifyIntegrity(cid) {
    try {
      // In production: Verify CID hash matches content
      const pin = Array.from(this.pins.values()).find(p => p.cid === cid);

      if (!pin) {
        return {
          success: false,
          verified: false,
          message: 'CID not found'
        };
      }

      return {
        success: true,
        cid: cid,
        verified: true,
        available: true,
        gateways: pin.gateways,
        replication: pin.replication
      };
    } catch (error) {
      console.error('Verify integrity error:', error);
      throw error;
    }
  }

  /**
   * Generate storage report
   */
  async generateReport() {
    const byContentType = {};
    const byUser = {};

    for (const pin of this.pins.values()) {
      // By content type
      byContentType[pin.contentType] = (byContentType[pin.contentType] || 0) + 1;

      // By user
      byUser[pin.user] = (byUser[pin.user] || 0) + pin.size;
    }

    return {
      success: true,
      summary: {
        totalFiles: this.storageStats.totalPinned,
        totalSize: this.storageStats.totalSize,
        totalSizeFormatted: this.formatBytes(this.storageStats.totalSize),
        activeUsers: Object.keys(byUser).length
      },
      breakdown: {
        byContentType: byContentType,
        byUser: byUser
      }
    };
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  generateCID() {
    // Mock CID generation (in production: actual IPFS hash)
    return 'Qm' + Array.from({length: 44}, () => 
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 62)]
    ).join('');
  }

  generatePinId() {
    return `PIN-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new IpfsStorageService();
