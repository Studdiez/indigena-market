const mongoose = require('mongoose');

const ProvenanceRecordSchema = mongoose.Schema({
    owner: String,
    ownerName: String,
    acquiredDate: Date,
    transactionHash: String,
    location: String,
    price: Number,
    currency: String
}, { _id: false });

const ConditionReportSchema = mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    condition: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor', 'damaged', 'restored']
    },
    description: String,
    reporter: String,
    reporterType: {
        type: String,
        enum: ['owner', 'gallery', 'conservator', 'appraiser', 'artist']
    },
    images: [String],
    documents: [String]  // Certificates, appraisals
}, { _id: false });

const PhysicalItemSchema = mongoose.Schema({
    itemId: {
        type: String,
        required: true,
        unique: true
    },
    nftId: String,  // Linked NFT
    nfcTagId: {     // ST25DV64K chip ID
        type: String,
        required: true,
        unique: true
    },
    itemType: {
        type: String,
        enum: [
            'carving_sculpture',    // 1. Carving & Sculpture
            'pottery_ceramics',     // 2. Pottery & Ceramics
            'textiles_weaving',     // 3. Textiles & Weaving
            'jewelry',              // 4. Jewelry Making
            'basketry',             // 5. Basketry
            'leatherwork',          // 6. Leatherwork & Hide Tanning
            'featherwork',          // 7. Featherwork
            'beadwork_embroidery',  // 8. Beadwork & Embroidery
            'masks_regalia',        // 9. Masks & Regalia
            'musical_instruments',  // 10. Musical Instruments
            'painting_surfaces',    // 11. Painting on Traditional Surfaces
            'quillwork',            // 12. Quillwork & Porcupine Work
            'ceremonial_sacred',    // 13. Ceremonial & Sacred Objects
            'tools_utensils',       // 14. Tools & Utensils
            'contemporary_fusion',  // 15. Contemporary Fusion
            'other'
        ],
        required: true
    },
    categoryId: String,      // matches CATEGORY_DEFINITIONS id
    subcategory: String,     // specific skill within category
    title: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: 'INDI'
    },
    listingType: {
        type: String,
        enum: ['instant', 'auction', 'offer'],
        default: 'instant'
    },
    creator: {
        name: String,
        tribalAffiliation: String,
        walletAddress: String,
        bio: String
    },
    dimensions: {
        height: Number,
        width: Number,
        depth: Number,
        unit: {
            type: String,
            enum: ['cm', 'in', 'mm'],
            default: 'cm'
        },
        weight: Number,
        weightUnit: {
            type: String,
            enum: ['kg', 'g', 'lb', 'oz'],
            default: 'kg'
        }
    },
    materials: [String],
    techniques: [String],
    yearCreated: Number,
    images: [String],
    videos: [String],
    provenance: [ProvenanceRecordSchema],
    conditionReports: [ConditionReportSchema],
    currentCondition: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor', 'damaged', 'restored']
    },
    currentLocation: {
        type: {
            type: String,
            enum: ['private_collection', 'gallery', 'museum', 'on_loan', 'storage', 'exhibition']
        },
        name: String,
        address: String,
        contact: String,
        verified: {
            type: Boolean,
            default: false
        }
    },
    galleryInfo: {
        name: String,
        location: String,
        contact: String,
        verified: {
            type: Boolean,
            default: false
        },
        verifiedAt: Date
    },
    culturalSignificance: {
        description: String,
        ceremony: String,
        story: String,
        restricted: {
            type: Boolean,
            default: false
        },
        viewingRestrictions: String
    },
    traditionalKnowledgeLabel: String,
    elderVerified: {
        type: Boolean,
        default: false
    },
    elderApprovers: [String],
    authenticity: {
        certificateUrl: String,
        verified: {
            type: Boolean,
            default: false
        },
        verifiedBy: String,
        verifiedAt: Date
    },
    insurance: {
        insured: {
            type: Boolean,
            default: false
        },
        value: Number,
        currency: String,
        policyNumber: String,
        insurer: String
    },
    shipping: {
        requiresSpecialHandling: {
            type: Boolean,
            default: false
        },
        handlingInstructions: String,
        preferredCarriers: [String]
    },
    status: {
        type: String,
        enum: ['active', 'sold', 'on_loan', 'in_storage', 'under_conservation', 'archived'],
        default: 'active'
    },
    lastVerified: Date,
    verificationHistory: [{
        date: Date,
        verifier: String,
        method: String,  // 'nfc_scan', 'manual_inspection', 'gallery_verification'
        notes: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('PhysicalItem-collection', PhysicalItemSchema);

