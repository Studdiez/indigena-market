const mongoose = require('mongoose');

const RoyaltyTierSchema = new mongoose.Schema({
  // NFT Reference
  nftId: { type: String, required: true, index: true },
  
  // Tier Type
  tierType: {
    type: String,
    enum: ['price_based', 'time_based', 'volume_based', 'loyalty_based'],
    required: true
  },
  
  // Price-Based Tiers
  priceTiers: [{
    minPrice: { type: Number },
    maxPrice: { type: Number },
    royaltyPercent: { type: Number, min: 5, max: 30 },
    label: { type: String } // e.g., 'Standard', 'Premium', 'Collector'
  }],
  
  // Time-Based Decay
  timeDecay: {
    enabled: { type: Boolean, default: false },
    initialPercent: { type: Number, default: 15 },
    finalPercent: { type: Number, default: 5 },
    decayPeriod: { type: Number, default: 365 }, // days
    decayCurve: { 
      type: String, 
      enum: ['linear', 'exponential', 'step'],
      default: 'linear'
    }
  },
  
  // Volume-Based (higher volume = lower royalty)
  volumeTiers: [{
    minVolume: { type: Number }, // number of sales
    royaltyPercent: { type: Number, min: 5, max: 30 }
  }],
  
  // Loyalty-Based (community members get discount)
  loyaltyDiscounts: {
    enabled: { type: Boolean, default: false },
    communityMemberDiscount: { type: Number, default: 50 }, // % off royalty
    elderDiscount: { type: Number, default: 75 },
    repeatBuyerDiscount: { type: Number, default: 25 }
  },
  
  // Minimum/Maximum Rules
  limits: {
    minimumRoyalty: { type: Number, default: 5 }, // XRP amount
    maximumRoyalty: { type: Number }, // Cap per transaction
    globalMinimumPercent: { type: Number, default: 5 },
    globalMaximumPercent: { type: Number, default: 30 }
  },
  
  // Active Status
  isActive: { type: Boolean, default: true },
  effectiveFrom: { type: Date, default: Date.now },
  effectiveUntil: { type: Date },
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Method to calculate royalty for a given sale
RoyaltyTierSchema.methods.calculateRoyalty = function(salePrice, saleDate, buyerType, volumeCount) {
  let royaltyPercent = 10; // default
  
  // Price-based tier
  if (this.tierType === 'price_based' && this.priceTiers.length > 0) {
    const tier = this.priceTiers.find(t => 
      salePrice >= t.minPrice && 
      (!t.maxPrice || salePrice <= t.maxPrice)
    );
    if (tier) royaltyPercent = tier.royaltyPercent;
  }
  
  // Time-based decay
  if (this.tierType === 'time_based' && this.timeDecay.enabled) {
    const daysSinceMint = Math.floor((saleDate - this.effectiveFrom) / (1000 * 60 * 60 * 24));
    const decayProgress = Math.min(daysSinceMint / this.timeDecay.decayPeriod, 1);
    
    if (this.timeDecay.decayCurve === 'linear') {
      royaltyPercent = this.timeDecay.initialPercent - 
        (decayProgress * (this.timeDecay.initialPercent - this.timeDecay.finalPercent));
    } else if (this.timeDecay.decayCurve === 'exponential') {
      royaltyPercent = this.timeDecay.finalPercent + 
        (this.timeDecay.initialPercent - this.timeDecay.finalPercent) * Math.exp(-3 * decayProgress);
    }
  }
  
  // Volume-based
  if (this.tierType === 'volume_based' && this.volumeTiers.length > 0) {
    const tier = this.volumeTiers.find(t => volumeCount >= t.minVolume);
    if (tier) royaltyPercent = tier.royaltyPercent;
  }
  
  // Apply loyalty discounts
  if (this.loyaltyDiscounts.enabled) {
    let discount = 0;
    if (buyerType === 'community') discount = this.loyaltyDiscounts.communityMemberDiscount;
    else if (buyerType === 'elder') discount = this.loyaltyDiscounts.elderDiscount;
    else if (buyerType === 'repeat') discount = this.loyaltyDiscounts.repeatBuyerDiscount;
    
    royaltyPercent = royaltyPercent * (1 - discount / 100);
  }
  
  // Apply limits
  royaltyPercent = Math.max(royaltyPercent, this.limits.globalMinimumPercent);
  royaltyPercent = Math.min(royaltyPercent, this.limits.globalMaximumPercent);
  
  let royaltyAmount = (salePrice * royaltyPercent) / 100;
  
  // Apply min/max amount limits
  if (royaltyAmount < this.limits.minimumRoyalty) {
    royaltyAmount = this.limits.minimumRoyalty;
  }
  if (this.limits.maximumRoyalty && royaltyAmount > this.limits.maximumRoyalty) {
    royaltyAmount = this.limits.maximumRoyalty;
  }
  
  return {
    royaltyPercent: Math.round(royaltyPercent * 100) / 100,
    royaltyAmount: Math.round(royaltyAmount * 1000000) / 1000000,
    tierApplied: this.tierType
  };
};

module.exports = mongoose.model('RoyaltyTier', RoyaltyTierSchema);
