const mongoose = require('mongoose');

const LanguageArchiveSchema = mongoose.Schema({
    archiveId: { type: String, required: true, unique: true },
    
    // Language information
    languageName: { type: String, required: true },
    languageCode: String,
    nation: String,
    region: String,
    
    // Archive item details
    title: { type: String, required: true },
    description: String,
    contentType: {
        type: String,
        enum: ['song', 'story', 'prayer', 'conversation', 'lesson', 'dictionary', 'grammar', 'history', 'other']
    },
    
    // Media
    audioUrl: String,
    videoUrl: String,
    transcript: String,
    translation: String,
    images: [String],
    documents: [String],
    
    // Cultural context
    culturalContext: {
        occasion: String,
        season: String,
        appropriateAudience: [String],
        restrictions: String
    },
    
    // Contributors
    speakers: [{
        name: String,
        bio: String,
        isElder: { type: Boolean, default: false }
    }],
    
    // Access level
    accessLevel: {
        type: String,
        enum: ['public', 'community', 'language_learners', 'elders_only'],
        default: 'public'
    },
    
    // Subscription tier
    subscriptionTier: {
        type: String,
        enum: ['free', 'guardian', 'scholar'],
        default: 'free'
    },
    
    // Metadata
    duration: Number,
    dateRecorded: Date,
    locationRecorded: String,
    
    // Usage stats
    viewCount: { type: Number, default: 0 },
    downloadCount: { type: Number, default: 0 },
    
    // Transcription status
    transcriptionStatus: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'reviewed'],
        default: 'pending'
    },
    
    // Related items
    relatedItems: [String],
    
    // Tags
    tags: [String],
    
    // Elder approval
    elderApproved: { type: Boolean, default: false },
    approvedBy: [String]
}, {
    timestamps: true
});

LanguageArchiveSchema.index({ languageName: 1, contentType: 1 });
LanguageArchiveSchema.index({ accessLevel: 1, subscriptionTier: 1 });

module.exports = mongoose.model('LanguageArchive', LanguageArchiveSchema);
