const mongoose = require('mongoose');

const RoyaltyBeneficiarySchema = new mongoose.Schema({
  // NFT Reference
  nftId: { type: String, required: true, index: true },
  
  // Primary Artist
  primaryArtistAddress: { type: String, required: true },
  primaryArtistName: { type: String },
  
  // Beneficiaries (can be multiple)
  beneficiaries: [{
    walletAddress: { type: String, required: true },
    name: { type: String },
    relationship: { type: String }, // e.g., 'collaborator', 'family', 'community_fund'
    percentage: { type: Number, required: true, min: 0, max: 100 },
    isActive: { type: Boolean, default: true }
  }],
  
  // Total must equal 100%
  totalPercentage: { type: Number, default: 100 },
  
  // Community Fund Allocation
  communityFundAllocation: {
    enabled: { type: Boolean, default: false },
    percentage: { type: Number, default: 0 },
    fundName: { type: String },
    fundAddress: { type: String }
  },
  
  // Split Rules
  splitRules: {
    autoDistribute: { type: Boolean, default: true },
    minimumPayout: { type: Number, default: 10 }, // Minimum XRP to trigger payout
    payoutSchedule: { 
      type: String, 
      enum: ['immediate', 'weekly', 'monthly', 'threshold'],
      default: 'immediate'
    }
  },
  
  // Status
  isActive: { type: Boolean, default: true },
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: String },
  
  // Verification
  verifiedByElders: { type: Boolean, default: false },
  verificationDate: { type: Date }
}, {
  timestamps: true
});

// Ensure total percentage equals 100
RoyaltyBeneficiarySchema.pre('save', function(next) {
  const total = this.beneficiaries.reduce((sum, b) => sum + b.percentage, 0);
  if (this.communityFundAllocation.enabled) {
    total += this.communityFundAllocation.percentage;
  }
  
  if (total !== 100) {
    return next(new Error('Total beneficiary percentage must equal 100%'));
  }
  
  this.totalPercentage = total;
  next();
});

module.exports = mongoose.model('RoyaltyBeneficiary', RoyaltyBeneficiarySchema);
