const mongoose = require('mongoose');

const LanguageHeritageListingSchema = mongoose.Schema({
    listingId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, index: true },
    summary: { type: String, default: '' },
    categoryId: { type: String, required: true, index: true },
    categoryLabel: { type: String, default: '' },
    nation: { type: String, default: '', index: true },
    keeperName: { type: String, default: '', index: true },
    format: {
        type: String,
        enum: ['audio', 'video', 'document', 'service', 'experience', 'software'],
        default: 'document',
        index: true
    },
    accessLevel: {
        type: String,
        enum: ['public', 'community', 'restricted', 'elder-approved'],
        default: 'public',
        index: true
    },
    verifiedSpeaker: { type: Boolean, default: false, index: true },
    elderApproved: { type: Boolean, default: false, index: true },
    communityControlled: { type: Boolean, default: true, index: true },
    price: { type: Number, default: 0, index: true },
    currency: { type: String, default: 'USD' },
    image: { type: String, default: '' },
    tags: { type: [String], default: [] },
    durationLabel: { type: String, default: '' },
    itemCountLabel: { type: String, default: '' },
    rating: { type: Number, default: 0, index: true },
    reviews: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'published',
        index: true
    }
}, { timestamps: true });

LanguageHeritageListingSchema.index({ title: 'text', summary: 'text', nation: 'text', keeperName: 'text', tags: 'text' });

module.exports = mongoose.model('LanguageHeritageListing-collection', LanguageHeritageListingSchema);
