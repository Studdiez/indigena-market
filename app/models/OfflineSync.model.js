const mongoose = require('mongoose');

const PendingUploadSchema = mongoose.Schema({
    uploadId: { type: String, required: true, unique: true },
    creatorAddress: { type: String, required: true },
    facilitatorAddress: String,      // Community hub facilitator if applicable
    
    // Upload type
    uploadType: {
        type: String,
        enum: ['nft_listing', 'physical_item', 'course', 'profile_update', 'voice_memo'],
        required: true
    },
    
    // Status tracking
    status: {
        type: String,
        enum: ['pending', 'uploading', 'completed', 'failed', 'cancelled'],
        default: 'pending'
    },
    
    // Local storage references (before sync)
    localData: {
        imagePaths: [String],        // Local file paths on device
        voiceMemoPath: String,
        metadataJson: mongoose.Schema.Types.Mixed,
        capturedAt: Date,
        deviceId: String             // For tracking which device
    },
    
    // NFT listing data (if applicable)
    nftData: {
        itemName: String,
        description: String,
        type: String,
        price: String,
        currency: { type: String, default: 'XRP' },
        royaltyPercent: { type: Number, default: 10 },
        culturalTags: mongoose.Schema.Types.Mixed,
        voiceStory: {
            originalLanguage: String,
            duration: Number,
            transcript: String
        }
    },
    
    // Sync tracking
    syncAttempts: [{
        attemptedAt: Date,
        status: String,
        errorMessage: String,
        networkType: String         // 'wifi', 'cellular', 'offline'
    }],
    
    // Final upload results
    uploadResult: {
        nftId: String,
        transactionHash: String,
        xrplTokenId: String,
        ipfsHash: String,
        uploadedAt: Date
    },
    
    // Auto-expiry for old pending uploads
    expiresAt: Date,
    
    // User notifications
    notifyOnComplete: { type: Boolean, default: true },
    notificationSent: { type: Boolean, default: false }
}, {
    timestamps: true
});

// Index for efficient queries
PendingUploadSchema.index({ creatorAddress: 1, status: 1 });
PendingUploadSchema.index({ status: 1, createdAt: 1 });
PendingUploadSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

module.exports = mongoose.model('OfflineSync', PendingUploadSchema);
