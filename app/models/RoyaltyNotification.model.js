const mongoose = require('mongoose');

const RoyaltyNotificationSchema = new mongoose.Schema({
  // Recipient
  artistAddress: { type: String, required: true, index: true },
  artistName: { type: String },
  
  // Notification Type
  type: {
    type: String,
    enum: [
      'royalty_earned',
      'royalty_claimed',
      'royalty_paid',
      'threshold_reached',
      'weekly_summary',
      'monthly_summary',
      'milestone_reached',
      'secondary_sale',
      'payout_failed',
      'payout_retry'
    ],
    required: true
  },
  
  // Notification Content
  title: { type: String, required: true },
  message: { type: String, required: true },
  
  // Related Data
  relatedData: {
    nftId: { type: String },
    nftName: { type: String },
    earningId: { type: mongoose.Schema.Types.ObjectId, ref: 'RoyaltyEarning' },
    claimId: { type: String },
    amount: { type: Number },
    transactionHash: { type: String },
    buyerAddress: { type: String },
    salePrice: { type: Number }
  },
  
  // Delivery Channels
  channels: {
    inApp: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: false }
  },
  
  // Delivery Status
  deliveryStatus: {
    inApp: { delivered: { type: Boolean, default: false }, deliveredAt: { type: Date } },
    email: { delivered: { type: Boolean, default: false }, deliveredAt: { type: Date }, error: { type: String } },
    sms: { delivered: { type: Boolean, default: false }, deliveredAt: { type: Date }, error: { type: String } },
    push: { delivered: { type: Boolean, default: false }, deliveredAt: { type: Date }, error: { type: String } }
  },
  
  // User Interaction
  read: { type: Boolean, default: false },
  readAt: { type: Date },
  clicked: { type: Boolean, default: false },
  clickedAt: { type: Date },
  
  // Priority
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  
  // Expiration
  expiresAt: { type: Date },
  
  // Action Required
  actionRequired: { type: Boolean, default: false },
  actionType: { type: String }, // e.g., 'claim_royalties', 'update_payout_method'
  actionCompleted: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Index for fetching unread notifications
RoyaltyNotificationSchema.index({ artistAddress: 1, read: 1, createdAt: -1 });

// Index for notification type queries
RoyaltyNotificationSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model('RoyaltyNotification', RoyaltyNotificationSchema);
