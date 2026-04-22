/**
 * Crypto-to-Fiat Bridge Service
 * Convert INDI to fiat and vice versa
 */

const indiToken = require('./indiToken.service.js');

class FiatBridgeService {
  constructor() {
    this.exchanges = new Map();
    this.conversions = new Map();
    this.banks = new Map();
    this.supportedCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'MXN'];
    this.initializeExchanges();
  }

  initializeExchanges() {
    // Mock exchange integrations
    this.exchanges.set('xrpl_dex', {
      name: 'XRPL DEX',
      type: 'decentralized',
      tradingPairs: ['INDI/XRP', 'INDI/USD'],
      fees: { maker: 0.001, taker: 0.002 },
      status: 'active'
    });

    this.exchanges.set('bitstamp', {
      name: 'Bitstamp',
      type: 'centralized',
      tradingPairs: ['XRP/USD', 'XRP/EUR'],
      fees: { deposit: 0, withdrawal: 0.0009, trade: 0.005 },
      status: 'active'
    });

    // Supported fiat on/off ramps
    this.onRamps = {
      'stripe': {
        name: 'Stripe',
        supported: ['USD', 'EUR', 'GBP', 'CAD'],
        fees: { percentage: 0.029, fixed: 0.30 },
        minAmount: 10,
        maxAmount: 10000
      },
      'paypal': {
        name: 'PayPal',
        supported: ['USD', 'EUR', 'GBP', 'CAD', 'MXN'],
        fees: { percentage: 0.034, fixed: 0.30 },
        minAmount: 5,
        maxAmount: 10000
      },
      'bank_transfer': {
        name: 'Bank Transfer (ACH/SEPA)',
        supported: ['USD', 'EUR', 'GBP', 'CAD'],
        fees: { percentage: 0, fixed: 0 },
        minAmount: 100,
        maxAmount: 100000
      }
    };
  }

  /**
   * Get current exchange rates
   */
  async getExchangeRates() {
    try {
      const indiPrice = await indiToken.getTokenPrice();
      const xrpPrice = 0.62; // Mock XRP price in USD

      const rates = {
        INDI: {
          USD: indiPrice,
          EUR: indiPrice * 0.92,
          GBP: indiPrice * 0.79,
          CAD: indiPrice * 1.35,
          MXN: indiPrice * 17.15,
          XRP: indiPrice / xrpPrice
        },
        XRP: {
          USD: xrpPrice,
          EUR: xrpPrice * 0.92,
          GBP: xrpPrice * 0.79,
          CAD: xrpPrice * 1.35,
          MXN: xrpPrice * 17.15
        },
        timestamp: new Date().toISOString()
      };

      return { success: true, rates };
    } catch (error) {
      console.error('Get exchange rates error:', error);
      throw error;
    }
  }

  /**
   * Calculate conversion with fees
   */
  async calculateConversion(from, to, amount, method = 'market') {
    try {
      const rates = await this.getExchangeRates();
      
      let rate;
      if (from === 'INDI') {
        rate = rates.rates.INDI[to];
      } else if (to === 'INDI') {
        rate = 1 / rates.rates.INDI[from];
      } else {
        // Both fiat - convert through USD
        const fromToUsd = from === 'USD' ? 1 : 1 / rates.rates.INDI[from] * rates.rates.INDI.USD;
        const usdToTo = to === 'USD' ? 1 : rates.rates.INDI[to] / rates.rates.INDI.USD;
        rate = fromToUsd * usdToTo;
      }

      const grossAmount = amount * rate;
      
      // Calculate fees
      let fees = { platform: 0, network: 0, provider: 0 };
      
      if (from === 'INDI' || to === 'INDI') {
        // Platform fee: 1%
        fees.platform = grossAmount * 0.01;
        
        // Network fee (gas)
        fees.network = from === 'INDI' ? 0.000012 : 0.00001; // XRP drops
        
        // Provider fee for fiat on/off ramp
        if (method !== 'market') {
          const ramp = this.onRamps[method];
          if (ramp) {
            fees.provider = (grossAmount * ramp.fees.percentage) + ramp.fees.fixed;
          }
        }
      }

      const totalFees = fees.platform + fees.network + fees.provider;
      const netAmount = grossAmount - totalFees;

      return {
        success: true,
        from: from,
        to: to,
        amount: amount,
        rate: rate,
        grossAmount: grossAmount,
        fees: fees,
        totalFees: totalFees,
        netAmount: netAmount,
        method: method,
        valid: this.validateConversion(from, to, amount, method)
      };
    } catch (error) {
      console.error('Calculate conversion error:', error);
      throw error;
    }
  }

  validateConversion(from, to, amount, method) {
    // Check if currencies are supported
    if (from !== 'INDI' && !this.supportedCurrencies.includes(from)) {
      return { valid: false, reason: 'Unsupported source currency' };
    }
    if (to !== 'INDI' && !this.supportedCurrencies.includes(to)) {
      return { valid: false, reason: 'Unsupported target currency' };
    }

    // Check on-ramp limits if applicable
    if (method !== 'market') {
      const ramp = this.onRamps[method];
      if (ramp) {
        if (amount < ramp.minAmount) {
          return { valid: false, reason: `Minimum amount is ${ramp.minAmount} ${from}` };
        }
        if (amount > ramp.maxAmount) {
          return { valid: false, reason: `Maximum amount is ${ramp.maxAmount} ${from}` };
        }
        if (!ramp.supported.includes(to)) {
          return { valid: false, reason: `${method} does not support ${to}` };
        }
      }
    }

    return { valid: true };
  }

  /**
   * Create conversion request (INDI to Fiat)
   */
  async createSellRequest(userAddress, amount, targetCurrency, method, bankDetails) {
    try {
      // Verify user has sufficient INDI
      const wallet = await indiToken.getWallet(userAddress);
      if (wallet.wallet.balance < amount) {
        throw new Error('Insufficient INDI balance');
      }

      // Calculate conversion
      const calculation = await this.calculateConversion('INDI', targetCurrency, amount, method);
      if (!calculation.valid.valid) {
        throw new Error(calculation.valid.reason);
      }

      const conversion = {
        conversionId: this.generateConversionId(),
        type: 'sell', // INDI to fiat
        userAddress: userAddress,
        from: {
          currency: 'INDI',
          amount: amount
        },
        to: {
          currency: targetCurrency,
          amount: calculation.netAmount
        },
        rate: calculation.rate,
        fees: calculation.fees,
        method: method,
        bankDetails: {
          accountHolder: bankDetails.accountHolder,
          bankName: bankDetails.bankName,
          accountNumber: this.maskAccountNumber(bankDetails.accountNumber),
          routingNumber: this.maskAccountNumber(bankDetails.routingNumber),
          country: bankDetails.country
        },
        status: 'pending', // 'pending', 'processing', 'completed', 'failed'
        timeline: {
          createdAt: new Date().toISOString(),
          processingAt: null,
          completedAt: null
        },
        estimatedArrival: this.calculateArrivalDate(method)
      };

      // Lock INDI
      await indiToken.transfer(userAddress, 'conversion_hold', amount, `Sell conversion ${conversion.conversionId}`);

      this.conversions.set(conversion.conversionId, conversion);

      return {
        success: true,
        conversionId: conversion.conversionId,
        status: 'pending',
        youSend: `${amount} INDI`,
        youReceive: `${calculation.netAmount.toFixed(2)} ${targetCurrency}`,
        fees: calculation.totalFees,
        estimatedArrival: conversion.estimatedArrival,
        message: 'Conversion request created. Processing will begin shortly.'
      };
    } catch (error) {
      console.error('Create sell request error:', error);
      throw error;
    }
  }

  /**
   * Create conversion request (Fiat to INDI)
   */
  async createBuyRequest(userAddress, fiatAmount, fiatCurrency, method, paymentDetails) {
    try {
      // Calculate conversion
      const calculation = await this.calculateConversion(fiatCurrency, 'INDI', fiatAmount, method);
      if (!calculation.valid.valid) {
        throw new Error(calculation.valid.reason);
      }

      const conversion = {
        conversionId: this.generateConversionId(),
        type: 'buy', // fiat to INDI
        userAddress: userAddress,
        from: {
          currency: fiatCurrency,
          amount: fiatAmount
        },
        to: {
          currency: 'INDI',
          amount: calculation.netAmount
        },
        rate: calculation.rate,
        fees: calculation.fees,
        method: method,
        paymentDetails: {
          method: method,
          status: 'awaiting_payment'
        },
        status: 'awaiting_payment',
        timeline: {
          createdAt: new Date().toISOString(),
          paidAt: null,
          processingAt: null,
          completedAt: null
        },
        paymentInstructions: this.getPaymentInstructions(method, fiatAmount, fiatCurrency)
      };

      this.conversions.set(conversion.conversionId, conversion);

      return {
        success: true,
        conversionId: conversion.conversionId,
        status: 'awaiting_payment',
        youSend: `${fiatAmount} ${fiatCurrency}`,
        youReceive: `${calculation.netAmount.toFixed(6)} INDI`,
        fees: calculation.totalFees,
        paymentInstructions: conversion.paymentInstructions,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 min expiry
      };
    } catch (error) {
      console.error('Create buy request error:', error);
      throw error;
    }
  }

  /**
   * Confirm fiat payment received (for buy orders)
   */
  async confirmPayment(conversionId, paymentProof) {
    try {
      const conversion = this.conversions.get(conversionId);
      if (!conversion) throw new Error('Conversion not found');
      if (conversion.status !== 'awaiting_payment') {
        throw new Error('Conversion not awaiting payment');
      }

      conversion.status = 'processing';
      conversion.timeline.processingAt = new Date().toISOString();
      conversion.paymentDetails.paymentProof = paymentProof;
      conversion.paymentDetails.status = 'confirmed';

      // Mint INDI to user
      await indiToken.mintTokens(
        conversion.userAddress,
        conversion.to.amount,
        `Fiat purchase ${conversionId}`
      );

      conversion.status = 'completed';
      conversion.timeline.completedAt = new Date().toISOString();

      return {
        success: true,
        conversionId: conversionId,
        status: 'completed',
        indiReceived: conversion.to.amount,
        txId: `tx-${Date.now()}`
      };
    } catch (error) {
      console.error('Confirm payment error:', error);
      throw error;
    }
  }

  /**
   * Process sell order (send fiat to bank)
   */
  async processSellOrder(conversionId) {
    try {
      const conversion = this.conversions.get(conversionId);
      if (!conversion) throw new Error('Conversion not found');
      if (conversion.status !== 'pending') {
        throw new Error('Conversion not in pending state');
      }

      conversion.status = 'processing';
      conversion.timeline.processingAt = new Date().toISOString();

      // Burn the INDI
      await indiToken.burnTokens('conversion_hold', conversion.from.amount, `Fiat sale ${conversionId}`);

      // In production: Initiate bank transfer via payment provider
      // await this.initiateBankTransfer(conversion);

      conversion.status = 'completed';
      conversion.timeline.completedAt = new Date().toISOString();

      return {
        success: true,
        conversionId: conversionId,
        status: 'completed',
        fiatSent: `${conversion.to.amount} ${conversion.to.currency}`,
        bankReference: `REF-${Date.now()}`
      };
    } catch (error) {
      console.error('Process sell order error:', error);
      throw error;
    }
  }

  /**
   * Get conversion status
   */
  async getConversion(conversionId, userAddress) {
    const conversion = this.conversions.get(conversionId);
    if (!conversion) throw new Error('Conversion not found');
    if (conversion.userAddress !== userAddress) {
      throw new Error('Not authorized');
    }

    return {
      conversionId: conversion.conversionId,
      type: conversion.type,
      from: conversion.from,
      to: conversion.to,
      rate: conversion.rate,
      fees: conversion.fees,
      status: conversion.status,
      method: conversion.method,
      timeline: conversion.timeline,
      estimatedArrival: conversion.estimatedArrival
    };
  }

  /**
   * Get user's conversion history
   */
  async getUserConversions(userAddress) {
    const conversions = Array.from(this.conversions.values())
      .filter(c => c.userAddress === userAddress)
      .map(c => ({
        conversionId: c.conversionId,
        type: c.type,
        from: `${c.from.amount} ${c.from.currency}`,
        to: `${c.to.amount} ${c.to.currency}`,
        status: c.status,
        createdAt: c.timeline.createdAt
      }));

    return { conversions, total: conversions.length };
  }

  /**
   * Get supported payment methods
   */
  async getPaymentMethods(currency) {
    const methods = [];

    for (const [key, ramp] of Object.entries(this.onRamps)) {
      if (ramp.supported.includes(currency)) {
        methods.push({
          id: key,
          name: ramp.name,
          fees: ramp.fees,
          limits: { min: ramp.minAmount, max: ramp.maxAmount },
          processingTime: key === 'bank_transfer' ? '1-3 business days' : 'Instant'
        });
      }
    }

    return methods;
  }

  getPaymentInstructions(method, amount, currency) {
    switch (method) {
      case 'stripe':
        return {
          type: 'card',
          instructions: 'Complete payment using the secure Stripe checkout',
          checkoutUrl: `https://checkout.stripe.com/indigena/${this.generateConversionId()}`
        };
      case 'paypal':
        return {
          type: 'paypal',
          instructions: 'Send payment to payments@indigenamarket.com',
          paypalEmail: 'payments@indigenamarket.com',
          amount: amount,
          currency: currency,
          note: 'INDI Token Purchase'
        };
      case 'bank_transfer':
        return {
          type: 'bank_transfer',
          instructions: 'Transfer to the following account:',
          accountDetails: {
            bankName: 'Indigena Trust Bank',
            accountName: 'Indigena Market Inc.',
            accountNumber: '****1234',
            routingNumber: '****5678',
            reference: `INDI-${Date.now()}`
          }
        };
      default:
        return { type: 'unknown', instructions: 'Contact support' };
    }
  }

  calculateArrivalDate(method) {
    const now = new Date();
    switch (method) {
      case 'stripe':
      case 'paypal':
        now.setDate(now.getDate() + 1);
        break;
      case 'bank_transfer':
        now.setDate(now.getDate() + 3);
        break;
      default:
        now.setDate(now.getDate() + 1);
    }
    return now.toISOString();
  }

  maskAccountNumber(number) {
    if (!number || number.length < 4) return '****';
    return '*'.repeat(number.length - 4) + number.slice(-4);
  }

  generateConversionId() {
    return `CNV-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
}

module.exports = new FiatBridgeService();
