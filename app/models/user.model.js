

const mongoose = require('mongoose');

const AccessibilitySchema = mongoose.Schema({
    elderMode: {
        type: Boolean,
        default: false
    },
    largeText: {
        type: Boolean,
        default: false
    },
    highContrast: {
        type: Boolean,
        default: false
    },
    voiceNavigation: {
        type: Boolean,
        default: false
    },
    screenReader: {
        type: Boolean,
        default: false
    },
    preferredInput: {
        type: String,
        enum: ['voice', 'touch', 'both'],
        default: 'touch'
    },
    reducedMotion: {
        type: Boolean,
        default: false
    },
    simplifiedUI: {
        type: Boolean,
        default: false
    }
}, { _id: false });

const ElderVerificationSchema = mongoose.Schema({
    isElder: {
        type: Boolean,
        default: false
    },
    verificationStatus: {
        type: String,
        enum: ['unverified', 'pending', 'verified'],
        default: 'unverified'
    },
    verifiedBy: String,  // Wallet address of verifying elder
    verificationDate: Date,
    community: String,
    role: String  // 'elder', 'knowledge_keeper', 'cultural_advisor'
}, { _id: false });

const NoteSchema = mongoose.Schema({
    WalletAddress:String,
    TokenId:Array,
    UserName:String,
    PrifileUrl:String,
    FirstName:String,
    LastName:String,
    BannerImage:String,
    About:String,
    Email:String,
    PhoneNumber:String,
    Country:String,
    FaceBook:String,
    Twitter:String,
    Other:String,
    IsBlock:Boolean,
    IsAdmin:Boolean,
    // Indigenous artist profile fields
    tribalAffiliation: String,
    artistTier: { 
        type: String, 
        enum: ['Earth Guardian', 'Sky Creator', 'Cosmic Wisdom', 'Visionary'],
        default: 'Earth Guardian'
    },
    xummWalletAddress: String,
    isVerifiedArtist: { type: Boolean, default: false },
    preferredLanguage: { type: String, default: 'english' },
    // SEVA impact tracking
    totalSEVAEarned: { type: Number, default: 0 },
    totalSEVADonated: { type: Number, default: 0 },
    landProtected: { type: Number, default: 0 },
    languageLessonsFunded: { type: Number, default: 0 },
    // Accessibility settings (Phase 2)
    accessibility: {
        type: AccessibilitySchema,
        default: () => ({})
    },
    // Elder verification (Phase 2)
    elderVerification: {
        type: ElderVerificationSchema,
        default: () => ({})
    },
    // Sacred content access permissions (Phase 2)
    sacredContentAccess: [{
        contentId: String,
        grantedBy: String,  // Elder who granted access
        grantedAt: Date,
        expiresAt: Date,
        accessLevel: {
            type: String,
            enum: ['view', 'download', 'share']
        }
    }],
    // Voice command preferences (Phase 2)
    voicePreferences: {
        enabled: { type: Boolean, default: false },
        language: { type: String, default: 'english' },
        confirmationRequired: { type: Boolean, default: true },
        audioFeedback: { type: Boolean, default: true }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User-collection', NoteSchema);