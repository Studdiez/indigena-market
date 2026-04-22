const mongoose = require('mongoose');

// Digital Arts Skills Categories (17 categories)
const SKILL_CATEGORIES = [
    'digital_painting',      // Digital Painting & Illustration
    '3d_modeling',           // 3D Modeling & Sculpture
    'animation',             // Animation & Motion Graphics
    'film_video',            // Film, Video & Documentary
    'photography',           // Photography & Digital Imaging
    'graphic_design',        // Graphic Design & Branding
    'web_ux',                // Web & UX Design
    'game_design',           // Game Design & Development
    'vr_ar',                 // Virtual & Augmented Reality
    'digital_fashion',       // Digital Fashion & Textile Design
    'music_audio',           // Music & Audio Production
    'digital_archive',       // Digital Archive & Preservation
    'nft_blockchain',        // NFT & Blockchain Art
    'ai_generative',         // AI & Generative Art
    'educational_content',   // Educational Digital Content
    'social_media',          // Social Media & Content Creation
    'licensing_ip'           // Licensing & IP Management
];

// Skill Subcategory Schema
const SkillSubcategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    targetClients: [String],
    rateRange: {
        min: Number,
        max: Number,
        unit: {
            type: String,
            enum: ['hour', 'project', 'piece', 'minute', 'session', 'day', 'word', 'royalty'],
            default: 'project'
        },
        currency: {
            type: String,
            default: 'INDI'
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { _id: false });

// Skill Category Schema
const SkillCategorySchema = mongoose.Schema({
    category: {
        type: String,
        required: true,
        enum: SKILL_CATEGORIES
    },
    displayName: String,
    description: String,
    icon: String,
    subcategories: [SkillSubcategorySchema],
    totalProjects: {
        type: Number,
        default: 0
    },
    totalCreators: {
        type: Number,
        default: 0
    }
}, { _id: false });

// Portfolio Item Schema
const PortfolioItemSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    imageUrl: String,
    videoUrl: String,
    audioUrl: String,
    projectUrl: String,
    category: String,
    subcategory: String,
    tags: [String],
    completionDate: Date,
    clientName: String,
    projectValue: Number,
    isFeatured: {
        type: Boolean,
        default: false
    }
}, { _id: false });

// Commission Rate Schema
const CommissionRateSchema = mongoose.Schema({
    category: String,
    subcategory: String,
    basePrice: {
        amount: Number,
        currency: String
    },
    turnaroundDays: Number,
    revisions: {
        type: Number,
        default: 2
    },
    rushAvailable: {
        type: Boolean,
        default: true
    },
    rushFeePercent: {
        type: Number,
        default: 25
    },
    depositPercent: {
        type: Number,
        default: 50
    }
}, { _id: false });

// NFT Integration Schema
const NFTIntegrationSchema = mongoose.Schema({
    hasNFTVersion: {
        type: Boolean,
        default: false
    },
    nftId: String,
    collectionName: String,
    mintStatus: {
        type: String,
        enum: ['not_minted', 'pending', 'minted', 'failed'],
        default: 'not_minted'
    },
    royaltyPercent: {
        type: Number,
        default: 10
    },
    editionType: {
        type: String,
        enum: ['unique', 'limited', 'open'],
        default: 'unique'
    },
    totalEditions: Number,
    availableEditions: Number
}, { _id: false });

// Collaboration Schema
const CollaborationSchema = mongoose.Schema({
    collaboratorAddress: String,
    collaboratorName: String,
    role: String,
    revenueShare: Number
}, { _id: false });

// Main Digital Art Creator Schema
const DigitalArtCreatorSchema = mongoose.Schema({
    walletAddress: {
        type: String,
        required: true,
        unique: true
    },
    profile: {
        name: String,
        displayName: String,
        bio: String,
        tagline: String,
        avatar: String,
        bannerImage: String,
        tribalAffiliation: String,
        nation: String,
        languages: [String],
        location: String,
        timezone: String,
        website: String,
        socialLinks: {
            twitter: String,
            instagram: String,
            behance: String,
            dribbble: String,
            artstation: String,
            youtube: String,
            tiktok: String
        }
    },
    skillCategories: [SkillCategorySchema],
    portfolio: [PortfolioItemSchema],
    commissionRates: [CommissionRateSchema],
    nftIntegration: NFTIntegrationSchema,
    collaborations: [CollaborationSchema],
    stats: {
        totalProjects: {
            type: Number,
            default: 0
        },
        totalEarnings: {
            type: Number,
            default: 0
        },
        averageRating: {
            type: Number,
            default: 0
        },
        totalReviews: {
            type: Number,
            default: 0
        },
        totalViews: {
            type: Number,
            default: 0
        },
        totalFavorites: {
            type: Number,
            default: 0
        },
        repeatClients: {
            type: Number,
            default: 0
        },
        responseTime: String
    },
    verificationStatus: {
        type: String,
        enum: ['unverified', 'pending', 'verified', 'elder_endorsed', 'platinum'],
        default: 'unverified'
    },
    verificationDetails: {
        submittedAt: Date,
        verifiedAt: Date,
        verifiedBy: String,
        documents: [String],
        endorsement: String,
        badges: [{
            type: String,
            enum: ['top_seller', 'featured', 'rising_star', 'community_favorite', 'elder_approved', 'platinum_seller']
        }]
    },
    availability: {
        status: {
            type: String,
            enum: ['available', 'busy', 'limited', 'unavailable', 'commissions_closed'],
            default: 'available'
        },
        slotsAvailable: {
            type: Number,
            default: 5
        },
        currentQueue: {
            type: Number,
            default: 0
        },
        nextAvailable: Date,
        averageTurnaround: String
    },
    preferences: {
        minProjectValue: Number,
        preferredProjectTypes: [String],
        acceptsRushOrders: {
            type: Boolean,
            default: true
        },
        requiresDeposit: {
            type: Boolean,
            default: true
        },
        allowsCommercial: {
            type: Boolean,
            default: true
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    featuredUntil: Date,
    subscriptionTier: {
        type: String,
        enum: ['free', 'creator', 'professional', 'studio'],
        default: 'free'
    }
}, {
    timestamps: true
});

// Digital Art Listing Schema
const DigitalArtListingSchema = mongoose.Schema({
    listingId: {
        type: String,
        required: true,
        unique: true
    },
    creatorAddress: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    category: {
        type: String,
        required: true,
        enum: SKILL_CATEGORIES
    },
    subcategory: String,
    listingType: {
        type: String,
        enum: ['commission', 'instant', 'auction', 'licensing', 'custom'],
        default: 'instant'
    },
    // Pricing
    pricing: {
        basePrice: {
            amount: Number,
            currency: {
                type: String,
                default: 'INDI'
            }
        },
        startingBid: Number,
        buyNowPrice: Number,
        licenseType: {
            type: String,
            enum: ['personal', 'commercial', 'exclusive', 'royalty_free']
        },
        licenseTerms: String
    },
    // Content
    content: {
        images: [String],
        videos: [String],
        audioFiles: [String],
        documents: [String],
        previewUrl: String,
        deliverableFormats: [String],
        resolution: String,
        dimensions: String,
        fileSize: Number,
        duration: Number // For video/audio in seconds
    },
    // Cultural Metadata
    culturalMetadata: {
        tribe: String,
        nation: String,
        language: String,
        sacredStatus: {
            type: String,
            enum: ['public', 'community', 'restricted', 'sacred'],
            default: 'public'
        },
        traditionalKnowledgeLabel: String,
        communityProtocol: String,
        storyContext: String
    },
    // Commission Details (if listingType is commission)
    commissionDetails: {
        turnaroundDays: Number,
        revisions: Number,
        requirements: String,
        deliverables: [String],
        processSteps: [String]
    },
    // Licensing Details (if listingType is licensing)
    licensingDetails: {
        usageRights: {
            commercial: { type: Boolean, default: false },
            editorial: { type: Boolean, default: true },
            print: { type: Boolean, default: false },
            digital: { type: Boolean, default: true },
            merchandise: { type: Boolean, default: false },
            exclusive: { type: Boolean, default: false }
        },
        territory: {
            type: String,
            enum: ['worldwide', 'regional', 'national'],
            default: 'worldwide'
        },
        duration: String,
        royaltyPercent: Number
    },
    // NFT Integration
    nftDetails: {
        isNFT: {
            type: Boolean,
            default: false
        },
        nftId: String,
        collectionId: String,
        editionNumber: Number,
        totalEditions: Number,
        royaltyPercent: {
            type: Number,
            default: 10
        }
    },
    compliance: {
        creatorVerificationStatus: {
            type: String,
            enum: ['pending', 'verified', 'rejected'],
            default: 'pending'
        },
        provenanceLevel: {
            type: String,
            enum: ['none', 'basic', 'verified'],
            default: 'none'
        },
        rightsFlags: {
            personalUse: { type: Boolean, default: true },
            commercialUse: { type: Boolean, default: false },
            derivativeUse: { type: Boolean, default: false },
            attributionRequired: { type: Boolean, default: true }
        },
        moderationStatus: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        }
    },
    provenanceMetadata: {
        source: String,
        recordedBy: String,
        recordedAt: Date,
        chainTxId: String,
        certificateUrl: String
    },
    moderationQueue: [{
        submittedBy: String,
        reason: String,
        notes: String,
        status: { type: String, enum: ['open', 'approved', 'rejected'], default: 'open' },
        submittedAt: { type: Date, default: Date.now },
        reviewedAt: Date
    }],
    marketplaceEvents: {
        bids: [{ bidderAddress: String, amount: Number, createdAt: { type: Date, default: Date.now } }],
        offers: [{ buyerAddress: String, amount: Number, message: String, createdAt: { type: Date, default: Date.now } }],
        watchers: [{ walletAddress: String, createdAt: { type: Date, default: Date.now } }],
        shares: [{ platform: String, createdAt: { type: Date, default: Date.now } }],
        reports: [{ reason: String, details: String, createdAt: { type: Date, default: Date.now } }]
    },
    // Stats
    stats: {
        views: {
            type: Number,
            default: 0
        },
        favorites: {
            type: Number,
            default: 0
        },
        sales: {
            type: Number,
            default: 0
        },
        totalRevenue: {
            type: Number,
            default: 0
        }
    },
    // Status
    status: {
        type: String,
        enum: ['draft', 'pending_review', 'active', 'paused', 'sold', 'expired', 'archived'],
        default: 'draft'
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    featuredUntil: Date,
    tags: [String],
    // SEO
    seoTitle: String,
    seoDescription: String,
    slug: String
}, {
    timestamps: true
});

// Indexes
DigitalArtCreatorSchema.index({ 'skillCategories.category': 1 });
DigitalArtCreatorSchema.index({ 'verificationStatus': 1 });
DigitalArtCreatorSchema.index({ 'availability.status': 1 });
DigitalArtCreatorSchema.index({ nation: 1 });

DigitalArtListingSchema.index({ category: 1 });
DigitalArtListingSchema.index({ listingType: 1 });
DigitalArtListingSchema.index({ creatorAddress: 1 });
DigitalArtListingSchema.index({ status: 1 });
DigitalArtListingSchema.index({ 'pricing.basePrice.amount': 1 });

const DigitalArtEventSchema = mongoose.Schema({
    event: { type: String, required: true },
    listingId: String,
    category: String,
    metadata: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = {
    DigitalArtCreator: mongoose.model('DigitalArt-Creator', DigitalArtCreatorSchema),
    DigitalArtListing: mongoose.model('DigitalArt-Listing', DigitalArtListingSchema),
    DigitalArtEvent: mongoose.model('DigitalArt-Event', DigitalArtEventSchema),
    SKILL_CATEGORIES
};