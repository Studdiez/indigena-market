const mongoose = require('mongoose');

const RoyaltyEarningSchema = new mongoose.Schema({
  // NFT Information
  nftId: { type: String, required: true, index: true },
  nftName: { type: String },
  
  // Artist Information
  artistAddress: { type: String, required: true, index: true },
  artistName: { type: String },
  
  // Sale Information
  saleType: { 
    type: String, 
    enum: ['primary', 'secondary'], 
    required: true 
  },
  salePrice: { type: Number, required: true },
  saleCurrency: { type: String, default: 'XRP' },
  
  // Royalty Details
  royaltyPercent: { type: Number, required: true },
  royaltyAmount: { type: Number, required: true },
  
  // Transaction Details
  transactionHash: { type: String, index: true },
  buyerAddress: { type: String },
  sellerAddress: { type: String },
  
  // Platform Information
  platform: { type: String, default: 'Indigena Market' },
  platformFee: { type: Number, default: 0 },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'claimed', 'paid'],
    default: 'pending'
  },
  
  // Timestamps
  saleDate: { type: Date, default: Date.now },
  confirmedAt: { type: Date },
  claimedAt: { type: Date },
  paidAt: { type: Date },
  
  // Metadata
  metadata: {
    collectionName: String,
    category: String,
    buyerType: { type: String, enum: ['community', 'public', 'enterprise'] }
  }
}, {
  timestamps: true
});

// Indexes for analytics
RoyaltyEarningSchema.index({ artistAddress: 1, saleDate: -1 });
RoyaltyEarningSchema.index({ nftId: 1, saleDate: -1 });
RoyaltyEarningSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('RoyaltyEarning', RoyaltyEarningSchema);
