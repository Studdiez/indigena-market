const mongoose = require('mongoose');

const CulturalTourismEventSchema = mongoose.Schema({
    event: { type: String, required: true, index: true },
    experienceId: { type: String, default: '', index: true },
    kind: { type: String, default: '', index: true },
    metadata: { type: Object, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('CulturalTourismEvent-collection', CulturalTourismEventSchema);
