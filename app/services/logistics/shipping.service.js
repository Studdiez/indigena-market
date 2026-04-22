/**
 * Shipping Integration Service
 * Multi-carrier shipping with Indigenous community focus
 */

class ShippingService {
  constructor() {
    this.carriers = new Map();
    this.shipments = new Map();
    this.rates = new Map();
    this.pickupLocations = new Map();
    this.initializeCarriers();
    this.initializePickupLocations();
  }

  initializeCarriers() {
    // Major carriers
    this.carriers.set('fedex', {
      name: 'FedEx',
      apiEndpoint: 'https://apis.fedex.com/ship/v1',
      services: ['GROUND', 'EXPRESS', 'OVERNIGHT'],
      domestic: true,
      international: true,
      trackingUrl: 'https://www.fedex.com/apps/fedextrack/?tracknumbers='
    });

    this.carriers.set('ups', {
      name: 'UPS',
      apiEndpoint: 'https://onlinetools.ups.com/api/shipments/v1',
      services: ['GROUND', 'STANDARD', 'EXPEDITED'],
      domestic: true,
      international: true,
      trackingUrl: 'https://www.ups.com/track?tracknum='
    });

    this.carriers.set('usps', {
      name: 'USPS',
      apiEndpoint: 'https://api.usps.com/shipments/v3',
      services: ['PRIORITY', 'EXPRESS', 'PARCEL_SELECT'],
      domestic: true,
      international: true,
      trackingUrl: 'https://tools.usps.com/go/TrackConfirmAction?tLabels='
    });

    this.carriers.set('canadapost', {
      name: 'Canada Post',
      apiEndpoint: 'https://api-canadapost.postescanada.ca/ship/v1',
      services: ['REGULAR', 'EXPEDITED', 'XPRESSPOST'],
      domestic: true,
      international: true,
      trackingUrl: 'https://www.canadapost-postescanada.ca/track-reperage/en#/search?searchFor='
    });

    // Indigenous-focused carriers
    this.carriers.set('tribal_courier', {
      name: 'Tribal Courier Network',
      description: 'Community-based delivery between tribal lands',
      services: ['TRIBAL_STANDARD', 'TRIBAL_EXPRESS'],
      domestic: true,
      international: false,
      indigenousFocused: true,
      coverage: ['Navajo Nation', 'Cherokee Nation', 'Pine Ridge', 'Hopi'],
      trackingUrl: 'https://tribalcourier.indigenamarket.com/track/'
    });
  }

  initializePickupLocations() {
    // Tribal pickup/drop-off locations
    const locations = [
      {
        id: 'PU_NN_001',
        name: 'Navajo Nation Cultural Center',
        type: 'tribal_center',
        address: 'Window Rock, AZ',
        nation: 'Navajo',
        hours: 'Mon-Fri 9AM-5PM',
        services: ['pickup', 'dropoff', 'packaging']
      },
      {
        id: 'PU_CN_001',
        name: 'Cherokee Nation Welcome Center',
        type: 'tribal_center',
        address: 'Tahlequah, OK',
        nation: 'Cherokee',
        hours: 'Mon-Sat 8AM-6PM',
        services: ['pickup', 'dropoff']
      },
      {
        id: 'PU_HOPI_001',
        name: 'Hopi Cultural Center',
        type: 'tribal_center',
        address: 'Second Mesa, AZ',
        nation: 'Hopi',
        hours: 'Mon-Fri 9AM-4PM',
        services: ['pickup', 'dropoff', 'packaging']
      }
    ];

    locations.forEach(loc => {
      this.pickupLocations.set(loc.id, loc);
    });
  }

  /**
   * Calculate shipping rates
   */
  async calculateRates(packageDetails, origin, destination) {
    try {
      const { weight, dimensions, value, category } = packageDetails;
      const rates = [];

      // Calculate for each carrier
      for (const [carrierId, carrier] of this.carriers) {
        if (carrier.indigenousFocused) {
          // Check if route is covered by tribal courier
          if (this.isTribalRoute(origin, destination)) {
            const tribalRate = this.calculateTribalRate(packageDetails, origin, destination);
            rates.push({
              carrier: carrierId,
              carrierName: carrier.name,
              service: 'TRIBAL_STANDARD',
              rate: tribalRate.amount,
              currency: 'USD',
              estimatedDays: tribalRate.days,
              features: ['community_support', 'cultural_handling', 'direct_delivery'],
              indigenousFocused: true
            });
          }
          continue;
        }

        // Standard carrier rates (mock calculation)
        const baseRate = this.calculateBaseRate(weight, dimensions, origin, destination);
        const valueSurcharge = value > 1000 ? value * 0.005 : 0;
        const categoryMultiplier = this.getCategoryMultiplier(category);

        carrier.services.forEach(service => {
          const serviceMultiplier = this.getServiceMultiplier(service);
          const totalRate = (baseRate + valueSurcharge) * categoryMultiplier * serviceMultiplier;

          rates.push({
            carrier: carrierId,
            carrierName: carrier.name,
            service: service,
            rate: Math.round(totalRate * 100) / 100,
            currency: 'USD',
            estimatedDays: this.getEstimatedDays(service, origin, destination),
            features: this.getServiceFeatures(service),
            insurance: {
              included: 100,
              additionalAvailable: true
            }
          });
        });
      }

      // Sort by rate
      rates.sort((a, b) => a.rate - b.rate);

      return {
        success: true,
        origin: origin,
        destination: destination,
        package: packageDetails,
        rates: rates,
        recommended: rates[0]
      };
    } catch (error) {
      console.error('Calculate rates error:', error);
      throw error;
    }
  }

  /**
   * Create shipment
   */
  async createShipment(shipmentData) {
    try {
      const {
        orderId,
        seller,
        buyer,
        from,
        to,
        package: packageDetails,
        carrier,
        service,
        insurance,
        pickupType // 'carrier', 'tribal_center', 'scheduled'
      } = shipmentData;

      // Generate tracking number
      const trackingNumber = this.generateTrackingNumber(carrier);

      const shipment = {
        shipmentId: this.generateShipmentId(),
        orderId: orderId,
        seller: seller,
        buyer: buyer,
        from: from,
        to: to,
        package: packageDetails,
        carrier: carrier,
        service: service,
        trackingNumber: trackingNumber,
        trackingUrl: this.getTrackingUrl(carrier, trackingNumber),
        status: 'created',
        timeline: {
          createdAt: new Date().toISOString(),
          labelGeneratedAt: null,
          pickedUpAt: null,
          inTransitAt: null,
          deliveredAt: null
        },
        insurance: insurance || { amount: 0, provider: null },
        pickup: {
          type: pickupType || 'carrier',
          location: null,
          scheduledDate: null,
          instructions: null
        },
        customs: this.generateCustomsInfo(packageDetails, from, to),
        notifications: {
          buyer: true,
          seller: true
        },
        cost: shipmentData.cost || 0,
        label: null
      };

      // Generate shipping label
      shipment.label = await this.generateLabel(shipment);
      shipment.timeline.labelGeneratedAt = new Date().toISOString();

      this.shipments.set(shipment.shipmentId, shipment);

      return {
        success: true,
        shipmentId: shipment.shipmentId,
        trackingNumber: trackingNumber,
        trackingUrl: shipment.trackingUrl,
        status: shipment.status,
        label: shipment.label,
        estimatedDelivery: this.calculateEstimatedDelivery(carrier, service, from, to)
      };
    } catch (error) {
      console.error('Create shipment error:', error);
      throw error;
    }
  }

  /**
   * Schedule pickup
   */
  async schedulePickup(shipmentId, pickupDetails) {
    try {
      const shipment = this.shipments.get(shipmentId);
      if (!shipment) throw new Error('Shipment not found');

      const { type, date, location, instructions } = pickupDetails;

      shipment.pickup = {
        type: type,
        scheduledDate: date,
        location: location,
        instructions: instructions,
        status: 'scheduled'
      };

      // If tribal center pickup
      if (type === 'tribal_center') {
        const center = this.pickupLocations.get(location);
        if (!center) throw new Error('Pickup location not found');
        
        shipment.pickup.locationDetails = center;
      }

      return {
        success: true,
        shipmentId: shipmentId,
        pickup: shipment.pickup,
        message: `Pickup scheduled for ${date}`
      };
    } catch (error) {
      console.error('Schedule pickup error:', error);
      throw error;
    }
  }

  /**
   * Track shipment
   */
  async trackShipment(trackingNumber) {
    try {
      // Find shipment by tracking number
      const shipment = Array.from(this.shipments.values())
        .find(s => s.trackingNumber === trackingNumber);

      if (!shipment) {
        return {
          success: false,
          message: 'Shipment not found'
        };
      }

      // Generate tracking events (in production: fetch from carrier API)
      const events = this.generateTrackingEvents(shipment);

      return {
        success: true,
        trackingNumber: trackingNumber,
        carrier: shipment.carrier,
        status: shipment.status,
        estimatedDelivery: this.calculateEstimatedDelivery(
          shipment.carrier, 
          shipment.service, 
          shipment.from, 
          shipment.to
        ),
        events: events,
        currentLocation: events.length > 0 ? events[events.length - 1].location : null
      };
    } catch (error) {
      console.error('Track shipment error:', error);
      throw error;
    }
  }

  /**
   * Update shipment status (webhook from carrier)
   */
  async updateStatus(trackingNumber, statusData) {
    try {
      const shipment = Array.from(this.shipments.values())
        .find(s => s.trackingNumber === trackingNumber);

      if (!shipment) throw new Error('Shipment not found');

      const { status, location, timestamp, details } = statusData;

      shipment.status = status;

      // Update timeline
      switch (status) {
        case 'picked_up':
          shipment.timeline.pickedUpAt = timestamp;
          break;
        case 'in_transit':
          if (!shipment.timeline.inTransitAt) {
            shipment.timeline.inTransitAt = timestamp;
          }
          break;
        case 'delivered':
          shipment.timeline.deliveredAt = timestamp;
          shipment.status = 'delivered';
          break;
        case 'exception':
          shipment.exception = details;
          break;
      }

      return {
        success: true,
        trackingNumber: trackingNumber,
        status: status,
        location: location
      };
    } catch (error) {
      console.error('Update status error:', error);
      throw error;
    }
  }

  /**
   * Get pickup locations near address
   */
  async getPickupLocations(nation, zipCode) {
    const locations = Array.from(this.pickupLocations.values())
      .filter(loc => !nation || loc.nation === nation);

    return {
      success: true,
      locations: locations.map(loc => ({
        id: loc.id,
        name: loc.name,
        type: loc.type,
        address: loc.address,
        nation: loc.nation,
        hours: loc.hours,
        services: loc.services
      }))
    };
  }

  /**
   * Handle customs documentation for international
   */
  generateCustomsInfo(packageDetails, from, to) {
    // Check if international
    const isInternational = from.country !== to.country;
    
    if (!isInternational) return null;

    return {
      required: true,
      documents: ['commercial_invoice', 'certificate_of_origin'],
      contents: {
        description: packageDetails.description || 'Indigenous Artwork',
        category: 'artwork',
        value: packageDetails.value,
        currency: 'USD',
        origin: from.country,
        hsCode: '9701.10.00' // Paintings, drawings, pastels
      },
      duties: {
        ddp: false, // Delivered Duty Paid (seller pays)
        ddu: true   // Delivered Duty Unpaid (buyer pays)
      }
    };
  }

  // Helper methods
  calculateBaseRate(weight, dimensions, origin, destination) {
    // Simplified rate calculation
    const weightRate = weight * 0.50;
    const dimensionalWeight = (dimensions.length * dimensions.width * dimensions.height) / 166;
    const billableWeight = Math.max(weight, dimensionalWeight);
    const distance = this.estimateDistance(origin, destination);
    
    return (billableWeight * 0.30) + (distance * 0.001) + 5;
  }

  calculateTribalRate(packageDetails, origin, destination) {
    // Lower rates for tribal network
    return {
      amount: packageDetails.weight * 0.25 + 3,
      days: 3 + Math.floor(Math.random() * 2) // 3-4 days
    };
  }

  isTribalRoute(origin, destination) {
    const tribalNations = ['Navajo Nation', 'Cherokee Nation', 'Hopi', 'Pine Ridge'];
    return tribalNations.includes(origin.nation) && tribalNations.includes(destination.nation);
  }

  getCategoryMultiplier(category) {
    const multipliers = {
      'artwork': 1.2,
      'fragile': 1.3,
      'standard': 1.0,
      'oversized': 1.5
    };
    return multipliers[category] || 1.0;
  }

  getServiceMultiplier(service) {
    const multipliers = {
      'GROUND': 1.0,
      'PRIORITY': 1.2,
      'EXPRESS': 1.8,
      'OVERNIGHT': 2.5,
      'TRIBAL_STANDARD': 0.8,
      'TRIBAL_EXPRESS': 1.0
    };
    return multipliers[service] || 1.0;
  }

  getEstimatedDays(service, origin, destination) {
    const isInternational = origin.country !== destination.country;
    const baseDays = isInternational ? 7 : 3;
    
    const serviceDays = {
      'GROUND': baseDays,
      'PRIORITY': Math.max(1, baseDays - 1),
      'EXPRESS': Math.max(1, baseDays - 2),
      'OVERNIGHT': 1,
      'TRIBAL_STANDARD': 3,
      'TRIBAL_EXPRESS': 2
    };
    
    return serviceDays[service] || baseDays;
  }

  getServiceFeatures(service) {
    const features = {
      'GROUND': ['tracking', 'delivery_confirmation'],
      'PRIORITY': ['tracking', 'delivery_confirmation', 'insurance_included'],
      'EXPRESS': ['tracking', 'delivery_confirmation', 'insurance_included', 'signature_required'],
      'OVERNIGHT': ['tracking', 'delivery_confirmation', 'insurance_included', 'signature_required', 'guaranteed_delivery'],
      'TRIBAL_STANDARD': ['tracking', 'cultural_handling', 'community_delivery'],
      'TRIBAL_EXPRESS': ['tracking', 'cultural_handling', 'community_delivery', 'priority_handling']
    };
    return features[service] || ['tracking'];
  }

  generateTrackingNumber(carrier) {
    const prefixes = {
      'fedex': '1Z',
      'ups': '1Z',
      'usps': '94',
      'canadapost': '',
      'tribal_courier': 'TRIB'
    };
    const prefix = prefixes[carrier] || 'TRK';
    return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }

  generateShipmentId() {
    return `SHP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  getTrackingUrl(carrier, trackingNumber) {
    const carrierInfo = this.carriers.get(carrier);
    return carrierInfo ? `${carrierInfo.trackingUrl}${trackingNumber}` : null;
  }

  generateLabel(shipment) {
    // In production: Generate actual shipping label
    return {
      url: `/labels/${shipment.shipmentId}.pdf`,
      format: 'PDF',
      size: '4x6'
    };
  }

  generateTrackingEvents(shipment) {
    const events = [];
    const now = new Date();

    if (shipment.timeline.pickedUpAt) {
      events.push({
        timestamp: shipment.timeline.pickedUpAt,
        status: 'picked_up',
        location: shipment.from.city,
        description: 'Package picked up'
      });
    }

    if (shipment.timeline.inTransitAt) {
      events.push({
        timestamp: shipment.timeline.inTransitAt,
        status: 'in_transit',
        location: 'Regional Hub',
        description: 'Package in transit'
      });
    }

    if (shipment.timeline.deliveredAt) {
      events.push({
        timestamp: shipment.timeline.deliveredAt,
        status: 'delivered',
        location: shipment.to.city,
        description: 'Package delivered'
      });
    }

    return events;
  }

  calculateEstimatedDelivery(carrier, service, from, to) {
    const days = this.getEstimatedDays(service, from, to);
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  }

  estimateDistance(origin, destination) {
    // Simplified distance estimation
    return 1000; // Mock distance in miles
  }
}

module.exports = new ShippingService();
