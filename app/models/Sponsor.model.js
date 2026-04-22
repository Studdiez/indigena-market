const mongoose = require('mongoose');

const SponsorSchema = mongoose.Schema({
    sponsorId: { type: String, required: true, unique: true },
    
    // Sponsor information
    sponsorAddress: { type: String, required: true },
    sponsorName: String,
    sponsorEmail: String,
    
    // Apprentice being sponsored
    apprentice: {
        apprenticeId: String,
        name: String,
        age: Number,
        community: String,
        nation: String,
        craft: String,           // beadwork, carving, weaving, etc.
        mentorName: String,
        mentorAddress: String,
        bio: String,
        photoUrl: String,
        goals: String
    },
    
    // Sponsorship details
    sponsorshipType: {
        type: String,
        enum: ['monthly', 'one_time', 'full_apprenticeship'],
        default: 'monthly'
    },
    
    amount: { type: Number, required: true },
    currency: { type: String, default: 'XRP' },
    
    // Duration
    startDate: Date,
    endDate: Date,
    monthsDuration: Number,
    
    // Status
    status: {
        type: String,
        enum: ['pending', 'active', 'completed', 'cancelled'],
        default: 'pending'
    },
    
    // Progress tracking
    progressUpdates: [{
        updateId: String,
        date: Date,
        title: String,
        description: String,
        photos: [String],
        milestone: String,
        mentorNotes: String
    }],
    
    // Thank you gifts
    gifts: [{
        giftType: String,        // 'photo', 'small_artwork', 'letter', 'video'
        description: String,
        url: String,
        sentDate: Date,
        received: { type: Boolean, default: false }
    }],
    
    // Communication
    messages: [{
        from: String,            // 'sponsor' or 'apprentice'
        message: String,
        sentAt: Date,
        read: { type: Boolean, default: false }
    }],
    
    // Total contributed
    totalContributed: { type: Number, default: 0 },
    
    // Visibility
    isPublic: { type: Boolean, default: true },
    allowMessages: { type: Boolean, default: true }
}, {
    timestamps: true
});

SponsorSchema.index({ sponsorAddress: 1, status: 1 });
SponsorSchema.index({ 'apprentice.apprenticeId': 1 });

module.exports = mongoose.model('Sponsor', SponsorSchema);
