const mongoose = require('mongoose');

const AccessLogSchema = mongoose.Schema({
    user: String,
    userName: String,
    accessedAt: {
        type: Date,
        default: Date.now
    },
    context: String,
    accessMethod: {
        type: String,
        enum: ['view', 'download', 'share', 'stream']
    },
    ipAddress: String,
    deviceInfo: String
}, { _id: false });

const AccessRequestSchema = mongoose.Schema({
    requestId: String,
    user: String,
    userName: String,
    requestedAt: {
        type: Date,
        default: Date.now
    },
    purpose: String,
    community: String,
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'expired'],
        default: 'pending'
    },
    reviewedBy: String,
    reviewedAt: Date,
    responseMessage: String,
    accessLevel: {
        type: String,
        enum: ['view', 'download', 'share']
    },
    expiresAt: Date
}, { _id: false });

const SacredContentSchema = mongoose.Schema({
    contentId: {
        type: String,
        required: true,
        unique: true
    },
    nftId: String,
    title: String,
    description: String,
    contentType: {
        type: String,
        enum: ['image', 'video', 'audio', 'document', 'ceremony_recording', 'oral_history', 'knowledge_archive']
    },
    creator: {
        name: String,
        walletAddress: String,
        tribalAffiliation: String
    },
    restrictionLevel: {
        type: String,
        enum: ['public', 'community', 'tribe', 'family', 'elders_only', 'restricted'],
        required: true
    },
    permittedCommunities: [String],
    permittedTribes: [String],
    requiredVerification: [{
        type: String,
        enum: ['tribal_id', 'elder_approval', 'ceremony_participation', 'community_membership', 'age_verification']
    }],
    approvers: [String],  // Elder wallet addresses who can grant access
    culturalProtocol: {
        description: String,
        appropriateUse: [String],
        prohibitedUse: [String],
        seasonalRestrictions: String,
        genderRestrictions: String,
        ageRestrictions: String
    },
    traditionalKnowledgeLabel: {
        type: String,
        enum: [
            'TK Community Use Only',
            'TK Seasonal',
            'TK Secret/Sacred',
            'TK Gender Restricted',
            'TK Elder Restricted',
            'TK Verified',
            'TK Attribution'
        ]
    },
    accessLog: [AccessLogSchema],
    accessRequests: [AccessRequestSchema],
    approvedAccess: [{
        user: String,
        grantedBy: String,
        grantedAt: Date,
        expiresAt: Date,
        accessLevel: {
            type: String,
            enum: ['view', 'download', 'share']
        }
    }],
    autoExpiry: Date,
    geoRestriction: {
        enabled: {
            type: Boolean,
            default: false
        },
        allowedRegions: [String],
        restrictedRegions: [String]
    },
    timeRestriction: {
        enabled: {
            type: Boolean,
            default: false
        },
        allowedHours: {
            start: Number,  // 0-23
            end: Number
        },
        allowedDays: [{
            type: String,
            enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        }]
    },
    ceremonyContext: {
        isCeremonyContent: {
            type: Boolean,
            default: false
        },
        ceremonyName: String,
        ceremonyDate: Date,
        participants: [String],
        requiresWitness: {
            type: Boolean,
            default: false
        }
    },
    stewardship: {
        steward: String,  // Current cultural steward
        stewardCommunity: String,
        transferHistory: [{
            from: String,
            to: String,
            date: Date,
            reason: String
        }]
    },
    warnings: {
        showCulturalWarning: {
            type: Boolean,
            default: true
        },
        warningText: String,
        requireAcknowledgment: {
            type: Boolean,
            default: true
        }
    },
    audit: {
        createdAt: {
            type: Date,
            default: Date.now
        },
        createdBy: String,
        lastReviewed: Date,
        reviewedBy: String,
        reviewNotes: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SacredContent-collection', SacredContentSchema);
