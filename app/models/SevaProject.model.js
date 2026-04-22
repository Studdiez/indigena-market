const mongoose = require('mongoose');

const BudgetItemSchema = new mongoose.Schema({
  item: { type: String, required: true },
  amount: { type: Number, required: true },
  description: String
});

const UpdateSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  title: String,
  description: String,
  photos: [String],
  videoUrl: String,
  milestone: String
});

const SevaProjectSchema = new mongoose.Schema({
  // Basic Info
  projectId: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  shortDescription: { type: String, maxLength: 200 },
  
  // Community Info
  communityName: { type: String, required: true },
  nation: { type: String, required: true },
  region: String,
  country: { type: String, required: true },
  
  // Project Type & Category
  projectType: { 
    type: String, 
    enum: ['education', 'land', 'infrastructure', 'culture', 'emergency', 'water', 'solar', 'health'],
    required: true 
  },
  category: {
    type: String,
    enum: ['school', 'scholarship', 'land_purchase', 'conservation', 'business_hub', 'water_system', 
           'solar_power', 'archive', 'elder_support', 'ceremony', 'medical', 'legal_defense', 'disaster_relief'],
    required: true
  },
  
  // Verification Tier
  verificationTier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  },
  
  // Financial Goals
  targetAmount: { type: Number, required: true },
  raisedAmount: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  
  // Budget Breakdown
  budgetItems: [BudgetItemSchema],
  
  // Timeline
  startDate: Date,
  targetCompletionDate: Date,
  actualCompletionDate: Date,
  
  // Status
  status: {
    type: String,
    enum: ['pending_review', 'approved', 'active', 'funded', 'in_progress', 'completed', 'cancelled'],
    default: 'pending_review'
  },
  
  // Media
  coverImage: String,
  photos: [String],
  videoUrl: String,
  videoThumbnail: String,
  
  // Community Leader
  leaderName: String,
  leaderTitle: String,
  leaderStatement: String,
  leaderPhoto: String,
  
  // Contact & Verification
  contactEmail: String,
  contactPhone: String,
  verifiedBy: [{
    verifierId: String,
    verifierName: String,
    verifierType: { type: String, enum: ['artist', 'organization', 'champion', 'council'] },
    verifiedAt: { type: Date, default: Date.now }
  }],
  
  // Impact Metrics
  impactMetrics: {
    childrenBenefited: Number,
    acresConserved: Number,
    peopleWithWaterAccess: Number,
    studentsEnrolled: Number,
    businessesSupported: Number,
    eldersSupported: Number,
    customMetrics: [{
      label: String,
      value: Number,
      unit: String
    }]
  },
  
  // Updates & Transparency
  updates: [UpdateSchema],
  receipts: [{
    description: String,
    amount: Number,
    date: Date,
    receiptUrl: String,
    category: String
  }],
  
  // Donor Engagement
  totalDonors: { type: Number, default: 0 },
  donorIds: [{ type: String }], // wallet addresses
  notifyDonorsOnMilestone: { type: Boolean, default: true },
  
  // Thank You Content
  thankYouVideoUrl: String,
  thankYouMessage: String,
  completionPhotos: [String],
  completionReport: String,
  
  // Featured & Priority
  isFeatured: { type: Boolean, default: false },
  featuredOrder: { type: Number, default: 0 },
  isUrgent: { type: Boolean, default: false },
  
  // Advisory Council
  reviewedBy: String, // council member ID
  reviewNotes: String,
  reviewDate: Date,
  
  // Related Artist/Community
  relatedArtistWallet: String, // if linked to an artist
  relatedNFTIds: [String],
  
  // Geographic for mapping
  coordinates: {
    lat: Number,
    lng: Number
  },
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  submittedBy: String, // Digital Champion or community member
  submittedAt: { type: Date, default: Date.now }
});

// Indexes
SevaProjectSchema.index({ status: 1, isFeatured: 1 });
SevaProjectSchema.index({ projectType: 1, category: 1 });
SevaProjectSchema.index({ country: 1, region: 1 });
SevaProjectSchema.index({ verificationTier: 1 });
SevaProjectSchema.index({ raisedAmount: 1, targetAmount: 1 });

// Virtual for progress percentage
SevaProjectSchema.virtual('progressPercentage').get(function() {
  return Math.min(100, Math.round((this.raisedAmount / this.targetAmount) * 100));
});

// Virtual for amount remaining
SevaProjectSchema.virtual('amountRemaining').get(function() {
  return Math.max(0, this.targetAmount - this.raisedAmount);
});

// Method to add donation
SevaProjectSchema.methods.addDonation = function(amount, donorId) {
  this.raisedAmount += amount;
  this.totalDonors += 1;
  if (donorId && !this.donorIds.includes(donorId)) {
    this.donorIds.push(donorId);
  }
  
  // Auto-update status if fully funded
  if (this.raisedAmount >= this.targetAmount && this.status === 'active') {
    this.status = 'funded';
  }
  
  return this.save();
};

// Static method to get featured projects
SevaProjectSchema.statics.getFeatured = function(limit = 6) {
  return this.find({ 
    isFeatured: true, 
    status: { $in: ['active', 'funded', 'in_progress'] }
  })
  .sort({ featuredOrder: 1, createdAt: -1 })
  .limit(limit);
};

// Static method to get projects by region
SevaProjectSchema.statics.getByRegion = function(country, region) {
  const query = { country };
  if (region) query.region = region;
  return this.find(query).sort({ createdAt: -1 });
};

// Static method to get impact stats
SevaProjectSchema.statics.getImpactStats = async function() {
  const stats = await this.aggregate([
    { $match: { status: 'completed' } },
    {
      $group: {
        _id: null,
        totalProjects: { $sum: 1 },
        totalRaised: { $sum: '$raisedAmount' },
        totalChildrenBenefited: { $sum: '$impactMetrics.childrenBenefited' },
        totalAcresConserved: { $sum: '$impactMetrics.acresConserved' },
        totalPeopleWithWater: { $sum: '$impactMetrics.peopleWithWaterAccess' },
        totalStudents: { $sum: '$impactMetrics.studentsEnrolled' }
      }
    }
  ]);
  return stats[0] || {};
};

module.exports = mongoose.model('SevaProject', SevaProjectSchema);
