const mongoose = require('mongoose');

const ElderApprovalSchema = mongoose.Schema({
    elderAddress: String,
    elderName: String,
    approvedAt: Date,
    approvalType: {
        type: String,
        enum: ['content', 'sacred', 'commercial', 'educational']
    },
    notes: String
}, { _id: false });

const UsageRightsSchema = mongoose.Schema({
    commercial: { type: Boolean, default: false },
    educational: { type: Boolean, default: true },
    ceremonial: { type: Boolean, default: false },
    derivative: { type: Boolean, default: false },
    personal: { type: Boolean, default: true }
}, { _id: false });

const NoteSchema = mongoose.Schema({
    NftId:String,
    Jsondataurl:String,
    Price:String,
    Status:String,
    AuctionEndDate:Date,
    Imageurl:String,
    ItemName:String,
    UserName:String,
    WalletAddress:String,
    ProfileUrl:String,
    Properties:Array,
    Stats:Array,
    Levels:Array,
    Blockchain:String,
    Type:{
        type: String,
        enum: [
            'digital_art',      // Original
            'music',            // Audio files
            'video',            // Video content
            'course',           // Learning materials
            'physical_art',     // NFC-linked physical
            'handicraft',       // Traditional crafts
            'performance',      // Dance, ceremony recordings
            'story',            // Oral traditions
            'knowledge',        // Traditional knowledge
            'freelance_portfolio', // Skill certifications
            'textile',          // Weaving, fabrics
            'carving',          // Wood, stone, bone carvings
            'jewelry',          // Traditional jewelry
            'pottery',          // Ceramics
            'instrument',       // Musical instruments
            'regalia',          // Ceremonial items
            'photography',      // Digital photos
            'mixed_media',      // Mixed media art
            'generative',       // AI/generative art
            'document'          // PDFs, documents
        ],
        default: 'digital_art'
    },
    FloorPrice:String,
    Description:String,
    CollectionName:String,
    Royality:String,
    Pinatahash:String,
    IsActive:String,
    IsBlock:Boolean,
    // XRPL-specific fields
    xrplTokenId: String,
    mintTransactionHash: String,
    // Enhanced cultural metadata fields (Phase 2)
    culturalTags: {
        tribe: String,
        nation: String,
        language: String,
        sacredStatus: { 
            type: String, 
            enum: ['public', 'community', 'restricted', 'sacred'], 
            default: 'public' 
        },
        traditionalKnowledgeLabel: String,
        tkLabelVersion: String,
        communityProtocol: String,
        elderApprovers: [ElderApprovalSchema],
        consentDate: Date,
        usageRights: UsageRightsSchema,
        ceremonyContext: {
            isCeremonyContent: { type: Boolean, default: false },
            ceremonyName: String,
            ceremonyDate: Date,
            seasonal: String,
            genderSpecific: String
        }
    },
    royaltyPercent: { type: Number, min: 5, max: 30, default: 10 },
    sevaAllocation: { type: Number, min: 0, max: 100, default: 0 },
    voiceStoryUrl: String,
    voiceStory: {
        originalUrl: String,           // Original voice memo in creator's language
        originalLanguage: String,      // ISO code of spoken language
        duration: Number,              // Duration in seconds
        transcript: String,            // Transcribed text (original language)
        translations: [{
            language: String,          // Target language code
            translatedText: String,    // Translated transcript
            audioUrl: String,          // Synthesized voice in target language
            translatorName: String,    // Community volunteer or service
            translatedAt: Date
        }]
    },
    physicalNFCId: String,
    elderApproved: { type: Boolean, default: false },
    communityConsentVerified: { type: Boolean, default: false },
    // Content-specific fields (Phase 2)
    contentDetails: {
        duration: Number,           // For audio/video in seconds
        fileFormat: String,
        fileSize: Number,
        resolution: String,         // For images/video
        audioQuality: String,       // For music
        pageCount: Number,          // For documents
        language: String,
        subtitles: [String],        // Available subtitle languages
        transcriptUrl: String       // For audio/video
    },
    // Linked content (Phase 2)
    linkedContent: {
        courseId: String,           // If part of a course
        physicalItemId: String,     // If linked to physical item
        freelancerId: String,       // If portfolio piece
        seriesNumber: Number,       // If part of series
        totalInSeries: Number
    },
    // Accessibility (Phase 2)
    accessibility: {
        audioDescription: String,   // For visually impaired
        altText: String,            // Image description
        signLanguageVideo: String,  // Sign language interpretation
        largePrintVersion: String,  // For documents
        simplifiedVersion: String   // Elder-friendly version
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('NFT-collection', NoteSchema);