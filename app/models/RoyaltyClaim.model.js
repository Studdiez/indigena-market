const mongoose = require('mongoose');

const RoyaltyClaimSchema = new mongoose.Schema({
  // Claim Reference
  claimId: { type: String, required: true, unique: true, index: true },
  
  // Artist Information
  artistAddress: { type: String, required: true, index: true },
  artistName: { type: String },
  
  // Claim Period
  periodStart: { type: Date, required: true },
  periodEnd: { type: Date, required: true },
  
  // Earnings Included
  earnings: [{
    earningId: { type: mongoose.Schema.Types.ObjectId, ref: 'RoyaltyEarning' },
    nftId: { type: String },
    nftName: { type: String },
    salePrice: { type: Number },
    royaltyAmount: { type: Number },
    saleDate: { type: Date }
  }],
  
  // Claim Summary
  summary: {
    totalEarnings: { type: Number, required: true },
    totalTransactions: { type: Number, default: 0 },
    primarySales: { type: Number, default: 0 },
    secondarySales: { type: Number, default: 0 },
    platformFees: { type: Number, default: 0 },
    netAmount: { type: Number, required: true }
  },
  
  // Payout Method
  payoutMethod: {
    type: { 
      type: String, 
      enum: ['xrp_wallet', 'bank_transfer', 'mobile_money', 'community_hub'],
      required: true 
    },
    walletAddress: { type: String },
    bankDetails: {
      accountName: String,
      accountNumber: String,
      bankName: String,
      swiftCode: String
    },
    mobileMoney: {
      provider: String,
      phoneNumber: String
    },
    hubLocation: {
      hubId: String,
      hubName: String
    }
  },
  
  // Claim Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  
  // Processing Details
  processing: {
    initiatedAt: { type: Date },
    processedAt: { type: Date },
    transactionHash: { type: String },
    processedBy: { type: String },
    notes: { type: String }
  },
  
  // Auto-Claim Settings
  autoClaim: {
    enabled: { type: Boolean, default: false },
    threshold: { type: Number, default: 100 }, // Auto-claim when earnings reach this amount
    schedule: { 
      type: String, 
      enum: ['daily', 'weekly', 'monthly', 'threshold'],
      default: 'threshold'
    }
  },
  
  // Multi-Currency Support
  currency: {
    primary: { type: String, default: 'XRP' },
    conversionRate: { type: Number, default: 1 },
    convertedAmount: { type: Number }
  }
}, {
  timestamps: true
});

// Generate claim ID before saving
RoyaltyClaimSchema.pre('save', async function(next) {
  if (!this.claimId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.claimId = `CLM-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model('RoyaltyClaim', RoyaltyClaimSchema);
