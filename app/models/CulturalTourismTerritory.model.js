const mongoose = require('mongoose');

const CulturalTourismTerritorySchema = mongoose.Schema({
    territoryId: { type: String, required: true, unique: true, index: true },
    territoryName: { type: String, required: true },
    nation: { type: String, default: '' },
    region: { type: String, default: '', index: true },
    experiences: { type: Number, default: 0 },
    protocolsRequired: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('CulturalTourismTerritory-collection', CulturalTourismTerritorySchema);
