const mongoose = require('mongoose');

const SevaDonationSchema = new mongoose.Schema({
  // Donation ID
  donationId: { type: String, unique: true, required: true },
  
  // Donor Info
  donorWalletAddress: { type: String, required: true },
  donorEmail: String,
  donorName: String,
  isAnonymous: { type: Boolean, default: false },
  
  // Project Info
  projectId: { type: String, required: true, index: true },
  projectName: String,
  communityName: String,
  
  // Donation Details
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  amountInUSD: Number, // For reporting consistency
  
  // Donation Type
  donationType: {
    type: String,
    enum: ['checkout', 'direct', 'subscription', 'corporate_match', 'rapid_response_fund', 'land_fund', 'innovation_fund'],
    default: 'direct'
  },
  
  // Checkout Context (if donation at checkout)
  checkoutContext: {
    nftId: String,
    nftName: String,
    artistWallet: String,
    artistName: String,
    purchaseAmount: Number,
    purchaseCurrency: String
  },
  
  // Giving Tier
  givingTier: {
    type: String,
    enum: ['supporter', 'builder', 'guardian', 'elder', 'custom'],
    default: 'custom'
  },
  
  // Payment
  paymentMethod: {
    type: String,
    enum: ['xumm', 'credit_card', 'crypto', 'bank_transfer'],
    default: 'xumm'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionHash: String, // For blockchain payments
  paymentId: String, // For external payment processors
  paidAt: Date,
  
  // Receipt
  receiptUrl: String,
  receiptSent: { type: Boolean, default: false },
  receiptSentAt: Date,
  
  // Notifications
  notifyOnMilestone: { type: Boolean, default: true },
  notifyOnCompletion: { type: Boolean, default: true },
  notificationsSent: [{
    type: { type: String, enum: ['milestone', 'completion', 'update', 'thank_you'] },
    sentAt: { type: Date, default: Date.now },
    opened: { type: Boolean, default: false }
  }],
  
  // Impact Tracking
  impactAllocated: {
    directProject: Number, // % to specific project
    rapidResponse: Number, // % to emergency fund
    landFund: Number, // % to land fund
    innovationFund: Number, // % to innovation fund
    platformFee: Number // % to platform
  },
  
  // Corporate Matching
  corporateMatch: {
    companyName: String,
    companyId: String,
    matchAmount: Number,
    matchStatus: { type: String, enum: ['pending', 'matched', 'declined'], default: 'pending' },
    matchedAt: Date
  },
  
  // Tax Receipt (for eligible donations)
  taxReceipt: {
    eligible: { type: Boolean, default: false },
    receiptNumber: String,
    issuedAt: Date,
    taxYear: Number,
    deductibleAmount: Number
  },
  
  // Refund Info
  refunded: { type: Boolean, default: false },
  refundedAt: Date,
  refundAmount: Number,
  refundReason: String,
  
  // Message from donor
  donorMessage: String,
  
  // Thank you received
  thankYouReceived: { type: Boolean, default: false },
  thankYouContent: {
    message: String,
    videoUrl: String,
    receivedAt: Date
  },
  
  // Badges earned
  badgesEarned: [{
    badgeType: String,
    badgeName: String,
    earnedAt: { type: Date, default: Date.now }
  }],
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  ipAddress: String,
  userAgent: String,
  referralSource: String // How they found the donation page
});

// Indexes
SevaDonationSchema.index({ donorWalletAddress: 1, createdAt: -1 });
SevaDonationSchema.index({ projectId: 1, paymentStatus: 1 });
SevaDonationSchema.index({ donationType: 1, createdAt: -1 });
SevaDonationSchema.index({ paymentStatus: 1, paidAt: -1 });

// Virtual for formatted amount
SevaDonationSchema.virtual('formattedAmount').get(function() {
  return `$${this.amount.toFixed(2)}`;
});

// Method to mark as paid
SevaDonationSchema.methods.markAsPaid = function(transactionHash) {
  this.paymentStatus = 'completed';
  this.paidAt = new Date();
  if (transactionHash) this.transactionHash = transactionHash;
  return this.save();
};

// Method to add badge
SevaDonationSchema.methods.addBadge = function(badgeType, badgeName) {
  if (!this.badgesEarned.find(b => b.badgeType === badgeType)) {
    this.badgesEarned.push({ badgeType, badgeName });
  }
  return this.save();
};

// Static method to get donor stats
SevaDonationSchema.statics.getDonorStats = async function(walletAddress) {
  const stats = await this.aggregate([
    { $match: { donorWalletAddress: walletAddress, paymentStatus: 'completed' } },
    {
      $group: {
        _id: null,
        totalDonated: { $sum: '$amount' },
        totalDonations: { $sum: 1 },
        projectsSupported: { $addToSet: '$projectId' },
        firstDonation: { $min: '$createdAt' },
        lastDonation: { $max: '$createdAt' }
      }
    }
  ]);
  
  if (stats.length === 0) {
    return {
      totalDonated: 0,
      totalDonations: 0,
      projectsSupported: [],
      firstDonation: null,
      lastDonation: null
    };
  }
  
  return {
    ...stats[0],
    projectsSupported: stats[0].projectsSupported.length
  };
};

// Static method to get project donations
SevaDonationSchema.statics.getProjectDonations = function(projectId, options = {}) {
  const { limit = 20, offset = 0, status = 'completed' } = options;
  return this.find({ projectId, paymentStatus: status })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);
};

// Static method to get leaderboard
SevaDonationSchema.statics.getLeaderboard = async function(limit = 10) {
  return this.aggregate([
    { $match: { paymentStatus: 'completed', isAnonymous: false } },
    {
      $group: {
        _id: '$donorWalletAddress',
        donorName: { $first: '$donorName' },
        totalDonated: { $sum: '$amount' },
        donationsCount: { $sum: 1 },
        projectsSupported: { $addToSet: '$projectId' }
      }
    },
    { $sort: { totalDonated: -1 } },
    { $limit: limit },
    {
      $project: {
        walletAddress: '$_id',
        donorName: 1,
        totalDonated: 1,
        donationsCount: 1,
        projectsCount: { $size: '$projectsSupported' }
      }
    }
  ]);
};

// Static method to get monthly stats
SevaDonationSchema.statics.getMonthlyStats = async function(months = 12) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  return this.aggregate([
    { 
      $match: { 
        paymentStatus: 'completed',
        paidAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$paidAt' },
          month: { $month: '$paidAt' }
        },
        totalDonated: { $sum: '$amount' },
        donationCount: { $sum: 1 },
        uniqueDonors: { $addToSet: '$donorWalletAddress' }
      }
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    {
      $project: {
        year: '$_id.year',
        month: '$_id.month',
        totalDonated: 1,
        donationCount: 1,
        uniqueDonors: { $size: '$uniqueDonors' }
      }
    }
  ]);
};

module.exports = mongoose.model('SevaDonation', SevaDonationSchema);
