/**
 * API Versioning Service
 * Manage API versions and deprecation
 */

class APIVersioningService {
  constructor() {
    this.versions = new Map();
    this.currentVersion = 'v1';
    this.initializeVersions();
  }

  initializeVersions() {
    // Register API versions
    this.registerVersion('v1', {
      status: 'stable',
      released: '2024-01-01',
      deprecated: false,
      sunsetDate: null,
      changes: ['Initial API release'],
      basePath: '/api/v1'
    });

    this.registerVersion('v2', {
      status: 'beta',
      released: null,
      deprecated: false,
      sunsetDate: null,
      changes: ['Coming soon'],
      basePath: '/api/v2'
    });
  }

  /**
   * Register an API version
   */
  registerVersion(version, config) {
    this.versions.set(version, {
      version: version,
      ...config
    });
  }

  /**
   * Get version info
   */
  async getVersion(version) {
    const info = this.versions.get(version);
    
    if (!info) {
      return {
        success: false,
        error: `Version '${version}' not found`
      };
    }

    return {
      success: true,
      version: info
    };
  }

  /**
   * Get all versions
   */
  async getAllVersions() {
    const versions = [];
    
    for (const [name, info] of this.versions) {
      versions.push(info);
    }

    return {
      success: true,
      current: this.currentVersion,
      versions: versions
    };
  }

  /**
   * Check if version is supported
   */
  async isSupported(version) {
    const info = this.versions.get(version);
    
    if (!info) {
      return { supported: false, reason: 'version_not_found' };
    }

    if (info.deprecated && info.sunsetDate) {
      const sunset = new Date(info.sunsetDate);
      if (new Date() > sunset) {
        return { supported: false, reason: 'version_sunset' };
      }
      return { 
        supported: true, 
        deprecated: true, 
        sunsetDate: info.sunsetDate 
      };
    }

    return { supported: true, deprecated: false };
  }

  /**
   * Middleware for version handling
   */
  middleware() {
    return async (req, res, next) => {
      try {
        // Extract version from URL path
        const versionMatch = req.path.match(/^\/api\/(v\d+)/);
        
        if (versionMatch) {
          const version = versionMatch[1];
          const support = await this.isSupported(version);

          if (!support.supported) {
            return res.status(410).json({
              success: false,
              error: 'API version not supported',
              message: `Version ${version} is no longer supported. Please use /api/${this.currentVersion}/`,
              currentVersion: this.currentVersion
            });
          }

          if (support.deprecated) {
            res.set('Deprecation', 'true');
            res.set('Sunset', support.sunsetDate);
          }

          // Add version info to request
          req.apiVersion = version;
        }

        // Add API version headers to response
        res.set('API-Version', req.apiVersion || this.currentVersion);
        
        next();
      } catch (error) {
        console.error('API versioning middleware error:', error);
        next();
      }
    };
  }

  /**
   * Version negotiation middleware
   * Supports version via header, query param, or URL
   */
  negotiateVersion() {
    return async (req, res, next) => {
      try {
        let version = this.currentVersion;

        // Check Accept-Version header
        if (req.headers['accept-version']) {
          version = req.headers['accept-version'];
        }
        // Check query parameter
        else if (req.query.apiVersion) {
          version = req.query.apiVersion;
        }
        // Check URL path
        else if (req.path.match(/^\/api\/(v\d+)/)) {
          version = req.path.match(/^\/api\/(v\d+)/)[1];
        }

        // Validate version
        const support = await this.isSupported(version);
        
        if (!support.supported) {
          return res.status(400).json({
            success: false,
            error: 'Invalid API version',
            requestedVersion: version,
            currentVersion: this.currentVersion
          });
        }

        req.apiVersion = version;
        res.set('API-Version', version);

        if (support.deprecated) {
          res.set('Deprecation', 'true');
          res.set('Sunset', support.sunsetDate);
        }

        next();
      } catch (error) {
        console.error('Version negotiation error:', error);
        next();
      }
    };
  }

  /**
   * Get changelog for version
   */
  async getChangelog(version) {
    const info = this.versions.get(version);
    
    if (!info) {
      return {
        success: false,
        error: `Version '${version}' not found`
      };
    }

    return {
      success: true,
      version: version,
      released: info.released,
      changes: info.changes,
      deprecated: info.deprecated,
      sunsetDate: info.sunsetDate
    };
  }

  /**
   * Deprecate a version
   */
  async deprecateVersion(version, sunsetDate) {
    const info = this.versions.get(version);
    
    if (!info) {
      return {
        success: false,
        error: `Version '${version}' not found`
      };
    }

    info.deprecated = true;
    info.sunsetDate = sunsetDate;
    info.status = 'deprecated';

    return {
      success: true,
      version: version,
      deprecated: true,
      sunsetDate: sunsetDate
    };
  }

  /**
   * Create new version
   */
  async createVersion(version, config) {
    if (this.versions.has(version)) {
      return {
        success: false,
        error: `Version '${version}' already exists`
      };
    }

    this.registerVersion(version, {
      status: 'draft',
      released: null,
      deprecated: false,
      sunsetDate: null,
      changes: [],
      basePath: `/api/${version}`,
      ...config
    });

    return {
      success: true,
      version: version,
      message: `Version ${version} created`
    };
  }

  /**
   * Release a version
   */
  async releaseVersion(version) {
    const info = this.versions.get(version);
    
    if (!info) {
      return {
        success: false,
        error: `Version '${version}' not found`
      };
    }

    info.status = 'stable';
    info.released = new Date().toISOString().split('T')[0];

    return {
      success: true,
      version: version,
      released: info.released
    };
  }

  /**
   * Get migration guide between versions
   */
  async getMigrationGuide(fromVersion, toVersion) {
    const from = this.versions.get(fromVersion);
    const to = this.versions.get(toVersion);

    if (!from || !to) {
      return {
        success: false,
        error: 'One or both versions not found'
      };
    }

    // In production, this would contain actual migration steps
    return {
      success: true,
      from: fromVersion,
      to: toVersion,
      breakingChanges: [],
      newFeatures: to.changes || [],
      deprecatedFeatures: from.deprecated ? from.changes : [],
      migrationSteps: [
        'Update API base URL',
        'Review breaking changes',
        'Test all integrations',
        'Update client libraries'
      ]
    };
  }
}

module.exports = new APIVersioningService();
