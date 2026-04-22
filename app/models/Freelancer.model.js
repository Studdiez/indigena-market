const mongoose = require('mongoose');

const SkillSchema = mongoose.Schema({
    category: {
        type: String,
        required: true,
        enum: [
            'weaving', 'carving', 'pottery', 'jewelry_making', 'textile_arts',
            'painting', 'sculpture', 'basket_weaving', 'beadwork', 'leatherwork',
            'language_teaching', 'storytelling', 'music', 'dance', 'ceremony',
            'traditional_knowledge', 'cultural_consulting', 'design', 'photography',
            'videography', 'writing', 'translation', 'other'
        ]
    },
    subcategory: String,
    experience: Number,  // Years
    expertiseLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'master', 'elder'],
        default: 'intermediate'
    },
    certification: String,  // NFT certificate ID
    portfolio: [String],    // NFT IDs of work samples
    description: String,
    tribalTradition: String  // Specific tradition/method
}, { _id: false });

const ServiceSchema = mongoose.Schema({
    serviceId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    category: String,
    priceRange: {
        min: Number,
        max: Number,
        currency: {
            type: String,
            default: 'XRP'
        }
    },
    fixedPrice: {
        amount: Number,
        currency: String
    },
    deliveryTime: String,  // e.g., '1 week', '2-3 days'
    availability: {
        type: String,
        enum: ['full_time', 'part_time', 'project_based', 'limited'],
        default: 'project_based'
    },
    maxBookings: {
        type: Number,
        default: 0  // 0 = unlimited
    },
    currentBookings: {
        type: Number,
        default: 0
    },
    requirements: String,  // What client needs to provide
    deliverables: [String],
    isActive: {
        type: Boolean,
        default: true
    }
}, { _id: false });

const ReviewSchema = mongoose.Schema({
    reviewer: String,
    reviewerName: String,
    projectId: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    comment: String,
    projectType: String,
    verified: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const ProjectSchema = mongoose.Schema({
    projectId: String,
    clientAddress: String,
    serviceId: String,
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'cancelled', 'disputed'],
        default: 'pending'
    },
    agreedPrice: Number,
    currency: String,
    startDate: Date,
    deadline: Date,
    completedDate: Date,
    deliverables: [String],
    milestones: [{
        description: String,
        dueDate: Date,
        completed: Boolean,
        payment: Number
    }]
}, { _id: false });

const FreelancerSchema = mongoose.Schema({
    walletAddress: {
        type: String,
        required: true,
        unique: true
    },
    profile: {
        name: String,
        displayName: String,
        bio: String,
        tagline: String,  // Short professional tagline
        avatar: String,
        bannerImage: String,
        tribalAffiliation: String,
        nation: String,
        languages: [String],
        location: String,
        timezone: String
    },
    skills: [SkillSchema],
    services: [ServiceSchema],
    reviews: [ReviewSchema],
    projects: [ProjectSchema],
    stats: {
        totalEarnings: {
            type: Number,
            default: 0
        },
        completedProjects: {
            type: Number,
            default: 0
        },
        activeProjects: {
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
        responseTime: String,  // e.g., 'within 24 hours'
        onTimeDelivery: {
            type: Number,
            default: 100  // Percentage
        }
    },
    verificationStatus: {
        type: String,
        enum: ['unverified', 'pending', 'verified', 'elder_endorsed', 'premium'],
        default: 'unverified'
    },
    verificationDetails: {
        submittedAt: Date,
        verifiedAt: Date,
        verifiedBy: String,  // Elder or admin
        documents: [String],  // IPFS hashes
        endorsement: String   // Elder endorsement statement
    },
    availability: {
        status: {
            type: String,
            enum: ['available', 'busy', 'limited', 'unavailable'],
            default: 'available'
        },
        nextAvailable: Date,
        workingHours: String
    },
    preferences: {
        minProjectValue: Number,
        preferredProjectTypes: [String],
        acceptsRushOrders: {
            type: Boolean,
            default: false
        },
        rushFeePercentage: {
            type: Number,
            default: 25
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    featuredUntil: Date,
    badges: [{
        type: String,
        enum: ['top_rated', 'rising_talent', 'elder_approved', 'community_choice', 'verified_skill']
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Freelancer-collection', FreelancerSchema);
