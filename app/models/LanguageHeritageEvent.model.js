const mongoose = require('mongoose');

const LanguageHeritageEventSchema = mongoose.Schema({
    event: { type: String, required: true, index: true },
    listingId: { type: String, default: '', index: true },
    categoryId: { type: String, default: '', index: true },
    metadata: { type: Object, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('LanguageHeritageEvent-collection', LanguageHeritageEventSchema);
