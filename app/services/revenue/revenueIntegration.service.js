/**
 * Revenue Integration Service
 * Automatically collects revenue from all platform activities
 */

const revenueModel = require('./revenueModel.service.js');

class RevenueIntegrationService {
  constructor() {
    this.processedTransactions = new Set();
  }

  /**
   * Process NFT sale and collect revenue
   */
  async processNFTSale(saleData) {
    try {
      const { seller, buyer, nftId, amount, currency, pillar = 'digital_arts' } = saleData;

      // Calculate fees
      const feeCalculation = await revenueModel.calculateFees(pillar, amount, {
        escrow: saleData.escrow || false,
        instantPayout: saleData.instantPayout || false
      });

      // Record transaction fee revenue
      const transactionResult = await revenueModel.recordTransaction({
        streamId: 'transaction_fees',
        pillar: pillar,
        amount: amount,
        currency: currency,
        source: 'nft_sale',
        metadata: {
          nftId: nftId,
          seller: seller,
          buyer: buyer,
          feeAmount: feeCalculation.breakdown.platformFee,
          artistReceives: feeCalculation.breakdown.artistReceives
        }
      });

      // Record additional fees if applicable
      if (feeCalculation.breakdown.additionalFees > 0) {
        if (saleData.escrow) {
          await revenueModel.recordTransaction({
            streamId: 'financial_services',
            pillar: pillar,
            amount: amount,
            currency: currency,
            source: 'escrow',
            metadata: { nftId, seller, buyer }
          });
        }

        if (saleData.instantPayout) {
          await revenueModel.recordTransaction({
            streamId: 'financial_services',
            pillar: pillar,
            amount: amount,
            currency: currency,
            source: 'instant_payout',
            metadata: { nftId, seller }
          });
        }
      }

      return {
        success: true,
        transactionId: transactionResult.transactionId,
        fees: feeCalculation.breakdown,
        revenueRecorded: transactionResult.platformRevenue
      };
    } catch (error) {
      console.error('Process NFT sale error:', error);
      throw error;
    }
  }

  /**
   * Process subscription payment
   */
  async processSubscriptionPayment(subscriptionData) {
    try {
      const { user, tier, amount, currency = 'INDI', period } = subscriptionData;

      const result = await revenueModel.recordTransaction({
        streamId: 'subscriptions',
        pillar: 'platform_wide',
        amount: amount,
        currency: currency,
        source: tier,
        metadata: {
          user: user,
          tier: tier,
          period: period,
          subscriptionType: 'circle_of_support'
        }
      });

      return {
        success: true,
        transactionId: result.transactionId,
        tier: tier,
        revenue: result.platformRevenue
      };
    } catch (error) {
      console.error('Process subscription payment error:', error);
      throw error;
    }
  }

  /**
   * Process Seva donation
   */
  async processSevaDonation(donationData) {
    try {
      const { donor, campaignId, amount, currency = 'INDI', type = 'checkout_donations' } = donationData;

      const stream = await revenueModel.getRevenueStream('seva_services');
      const feeRate = stream.stream.fees[type] || 5;
      const platformFee = amount * (feeRate / 100);

      const result = await revenueModel.recordTransaction({
        streamId: 'seva_services',
        pillar: 'seva',
        amount: amount,
        currency: currency,
        source: type,
        metadata: {
          donor: donor,
          campaignId: campaignId,
          feeRate: feeRate,
          platformFee: platformFee,
          causeReceives: amount - platformFee
        }
      });

      return {
        success: true,
        transactionId: result.transactionId,
        platformFee: platformFee,
        causeReceives: amount - platformFee
      };
    } catch (error) {
      console.error('Process Seva donation error:', error);
      throw error;
    }
  }

  /**
   * Process premium feature purchase
   */
  async processPremiumFeature(purchaseData) {
    try {
      const { user, feature, amount, currency = 'INDI' } = purchaseData;

      const result = await revenueModel.recordTransaction({
        streamId: 'premium_features',
        pillar: 'platform_wide',
        amount: amount,
        currency: currency,
        source: feature,
        metadata: {
          user: user,
          feature: feature,
          purchaseDate: new Date().toISOString()
        }
      });

      return {
        success: true,
        transactionId: result.transactionId,
        feature: feature,
        revenue: result.platformRevenue
      };
    } catch (error) {
      console.error('Process premium feature error:', error);
      throw error;
    }
  }

  /**
   * Process B2B service
   */
  async processB2BService(serviceData) {
    try {
      const { client, service, amount, currency = 'INDI' } = serviceData;

      const stream = await revenueModel.getRevenueStream('b2b_enterprise');
      const feeRate = stream.stream.services[service] || 15;
      
      let platformFee;
      if (typeof feeRate === 'number') {
        platformFee = amount * (feeRate / 100);
      } else {
        platformFee = feeRate; // Flat fee
      }

      const result = await revenueModel.recordTransaction({
        streamId: 'b2b_enterprise',
        pillar: 'platform_wide',
        amount: amount,
        currency: currency,
        source: service,
        metadata: {
          client: client,
          service: service,
          feeRate: feeRate,
          platformFee: platformFee
        }
      });

      return {
        success: true,
        transactionId: result.transactionId,
        platformFee: platformFee
      };
    } catch (error) {
      console.error('Process B2B service error:', error);
      throw error;
    }
  }

  /**
   * Process logistics service
   */
  async processLogisticsService(serviceData) {
    try {
      const { user, service, amount, currency = 'INDI', itemCount = 1 } = serviceData;

      const stream = await revenueModel.getRevenueStream('logistics');
      const feeConfig = stream.stream.services[service];
      
      let platformFee;
      if (typeof feeConfig === 'object') {
        platformFee = feeConfig.price;
      } else if (service === 'nfc_tags') {
        platformFee = feeConfig * itemCount;
      } else {
        platformFee = amount * (feeConfig / 100);
      }

      const result = await revenueModel.recordTransaction({
        streamId: 'logistics',
        pillar: 'physical_items',
        amount: amount,
        currency: currency,
        source: service,
        metadata: {
          user: user,
          service: service,
          itemCount: itemCount,
          platformFee: platformFee
        }
      });

      return {
        success: true,
        transactionId: result.transactionId,
        platformFee: platformFee
      };
    } catch (error) {
      console.error('Process logistics service error:', error);
      throw error;
    }
  }

  /**
   * Process data insights purchase
   */
  async processDataInsightsPurchase(purchaseData) {
    try {
      const { client, product, amount, currency = 'INDI' } = purchaseData;

      const result = await revenueModel.recordTransaction({
        streamId: 'data_insights',
        pillar: 'platform_wide',
        amount: amount,
        currency: currency,
        source: product,
        metadata: {
          client: client,
          product: product,
          purchaseType: 'data_insights'
        }
      });

      return {
        success: true,
        transactionId: result.transactionId,
        revenue: result.platformRevenue
      };
    } catch (error) {
      console.error('Process data insights error:', error);
      throw error;
    }
  }

  /**
   * Process advertising purchase
   */
  async processAdvertisingPurchase(purchaseData) {
    try {
      const { advertiser, option, amount, currency = 'INDI', duration } = purchaseData;

      const result = await revenueModel.recordTransaction({
        streamId: 'advertising',
        pillar: 'platform_wide',
        amount: amount,
        currency: currency,
        source: option,
        metadata: {
          advertiser: advertiser,
          option: option,
          duration: duration,
          startDate: new Date().toISOString()
        }
      });

      return {
        success: true,
        transactionId: result.transactionId,
        advertiser: advertiser,
        revenue: result.platformRevenue
      };
    } catch (error) {
      console.error('Process advertising error:', error);
      throw error;
    }
  }

  /**
   * Process event ticketing
   */
  async processEventTicketing(ticketData) {
    try {
      const { eventId, buyer, amount, currency = 'INDI', eventType } = ticketData;

      const stream = await revenueModel.getRevenueStream('ticketing');
      const feeRate = stream.stream.events[eventType] || 10;
      const platformFee = amount * (feeRate / 100);

      const result = await revenueModel.recordTransaction({
        streamId: 'ticketing',
        pillar: 'cultural_tourism',
        amount: amount,
        currency: currency,
        source: eventType,
        metadata: {
          eventId: eventId,
          buyer: buyer,
          feeRate: feeRate,
          platformFee: platformFee
        }
      });

      return {
        success: true,
        transactionId: result.transactionId,
        platformFee: platformFee
      };
    } catch (error) {
      console.error('Process event ticketing error:', error);
      throw error;
    }
  }

  /**
   * Process archive access subscription
   */
  async processArchiveAccess(subscriptionData) {
    try {
      const { user, tier, amount, currency = 'INDI' } = subscriptionData;

      const result = await revenueModel.recordTransaction({
        streamId: 'archive_access',
        pillar: 'language_heritage',
        amount: amount,
        currency: currency,
        source: tier,
        metadata: {
          user: user,
          tier: tier,
          accessType: 'archive_subscription'
        }
      });

      return {
        success: true,
        transactionId: result.transactionId,
        tier: tier,
        revenue: result.platformRevenue
      };
    } catch (error) {
      console.error('Process archive access error:', error);
      throw error;
    }
  }

  /**
   * Process certification service
   */
  async processCertification(serviceData) {
    try {
      const { user, service, amount, currency = 'INDI' } = serviceData;

      const result = await revenueModel.recordTransaction({
        streamId: 'certification',
        pillar: 'platform_wide',
        amount: amount,
        currency: currency,
        source: service,
        metadata: {
          user: user,
          service: service,
          certificationType: service
        }
      });

      return {
        success: true,
        transactionId: result.transactionId,
        service: service,
        revenue: result.platformRevenue
      };
    } catch (error) {
      console.error('Process certification error:', error);
      throw error;
    }
  }

  /**
   * Process commission service
   */
  async processCommission(serviceData) {
    try {
      const { client, artist, service, amount, currency = 'INDI' } = serviceData;

      const stream = await revenueModel.getRevenueStream('commissions');
      const feeRate = stream.stream.services[service] || 15;
      const platformFee = amount * (feeRate / 100);

      const result = await revenueModel.recordTransaction({
        streamId: 'commissions',
        pillar: 'platform_wide',
        amount: amount,
        currency: currency,
        source: service,
        metadata: {
          client: client,
          artist: artist,
          service: service,
          feeRate: feeRate,
          platformFee: platformFee
        }
      });

      return {
        success: true,
        transactionId: result.transactionId,
        platformFee: platformFee
      };
    } catch (error) {
      console.error('Process commission error:', error);
      throw error;
    }
  }

  /**
   * Process physical venture sale
   */
  async processPhysicalVenture(saleData) {
    try {
      const { buyer, product, amount, currency = 'INDI' } = saleData;

      const stream = await revenueModel.getRevenueStream('physical_ventures');
      const feeRate = stream.stream.products[product] || 5;
      const platformFee = amount * (feeRate / 100);

      const result = await revenueModel.recordTransaction({
        streamId: 'physical_ventures',
        pillar: 'land_food',
        amount: amount,
        currency: currency,
        source: product,
        metadata: {
          buyer: buyer,
          product: product,
          feeRate: feeRate,
          platformFee: platformFee
        }
      });

      return {
        success: true,
        transactionId: result.transactionId,
        platformFee: platformFee
      };
    } catch (error) {
      console.error('Process physical venture error:', error);
      throw error;
    }
  }

  /**
   * Get daily revenue summary
   */
  async getDailyRevenueSummary(date = new Date()) {
    try {
      const dateStr = date.toISOString().split('T')[0];
      
      const transactions = Array.from(revenueModel.transactions.values())
        .filter(t => t.timestamp.startsWith(dateStr));

      const summary = {
        date: dateStr,
        totalRevenue: 0,
        byStream: {},
        byPillar: {},
        transactionCount: transactions.length
      };

      for (const t of transactions) {
        summary.totalRevenue += t.platformRevenue;
        summary.byStream[t.streamId] = (summary.byStream[t.streamId] || 0) + t.platformRevenue;
        summary.byPillar[t.pillar] = (summary.byPillar[t.pillar] || 0) + t.platformRevenue;
      }

      return {
        success: true,
        summary: summary
      };
    } catch (error) {
      console.error('Get daily revenue summary error:', error);
      throw error;
    }
  }
}

module.exports = new RevenueIntegrationService();
