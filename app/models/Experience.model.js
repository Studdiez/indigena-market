const mongoose = require('mongoose');

const ExperienceSchema = mongoose.Schema({
    experienceId: { type: String, required: true, unique: true },
    
    // Host information
    hostAddress: { type: String, required: true },
    hostName: String,
    community: String,
    nation: String,
    location: {
        country: String,
        region: String,
        coordinates: {
            lat: Number,
            lng: Number
        },
        nearestAirport: String,
        transportNotes: String
    },
    
    // Experience details
    title: { type: String, required: true },
    description: String,
    category: {
        type: String,
        enum: [
            'canoe_journey',
            'medicine_walk',
            'sacred_site_tour',
            'traditional_fishing',
            'hunting_experience',
            'craft_workshop',
            'storytelling_circle',
            'ceremony_participation',
            'homestay',
            'eco_lodge',
            'food_experience',
            'language_immersion',
            'art_workshop',
            'music_dance',
            'other'
        ]
    },
    
    // Duration
    duration: {
        value: Number,
        unit: { type: String, enum: ['hours', 'days', 'weeks'] }
    },
    
    // Group size
    minParticipants: { type: Number, default: 1 },
    maxParticipants: { type: Number, default: 10 },
    
    // Pricing
    pricePerPerson: { type: Number, required: true },
    currency: { type: String, default: 'XRP' },
    priceIncludes: [String],
    priceExcludes: [String],
    
    // Schedule
    availability: [{
        date: Date,
        spotsAvailable: Number,
        isBooked: { type: Boolean, default: false }
    }],
    
    recurringSchedule: {
        isRecurring: { type: Boolean, default: false },
        frequency: String,       // 'weekly', 'monthly', 'seasonal'
        daysOfWeek: [String],
        seasonStart: Date,
        seasonEnd: Date
    },
    
    // Status
    status: {
        type: String,
        enum: ['draft', 'active', 'paused', 'inactive'],
        default: 'draft'
    },
    
    // Media
    coverImage: String,
    images: [String],
    videoUrl: String,
    
    // Itinerary
    itinerary: [{
        day: Number,
        title: String,
        description: String,
        activities: [String],
        meals: {
            breakfast: Boolean,
            lunch: Boolean,
            dinner: Boolean
        },
        accommodation: String
    }],
    
    // Cultural protocols
    culturalProtocols: {
        dressCode: String,
        behavioralGuidelines: [String],
        photographyPolicy: String,
        sacredSiteRules: [String],
        requiredPreparation: String
    },
    
    // Requirements
    requirements: {
        physicalLevel: { type: String, enum: ['easy', 'moderate', 'challenging', 'extreme'] },
        ageRestriction: {
            min: Number,
            max: Number
        },
        medicalConsiderations: [String],
        requiredItems: [String],
        languages: [String]
    },
    
    // Reviews
    reviews: [{
        reviewerAddress: String,
        reviewerName: String,
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        date: Date,
        verified: { type: Boolean, default: false }
    }],
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    
    // Bookings
    totalBookings: { type: Number, default: 0 },
    
    // Virtual option
    virtualExperience: {
        available: { type: Boolean, default: false },
        price: Number,
        duration: Number,
        platform: String,        // 'zoom', 'custom'
        description: String
    },
    
    // Elder approval
    elderApproved: { type: Boolean, default: false },
    approvedBy: [String]
}, {
    timestamps: true
});

ExperienceSchema.index({ status: 1, category: 1 });
ExperienceSchema.index({ hostAddress: 1 });
ExperienceSchema.index({ 'location.country': 1, 'location.region': 1 });

module.exports = mongoose.model('Experience', ExperienceSchema);
