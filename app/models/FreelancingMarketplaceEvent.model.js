const mongoose = require('mongoose');

const FreelancingMarketplaceEventSchema = mongoose.Schema({
    event: { type: String, required: true, index: true },
    serviceId: { type: String, index: true },
    category: { type: String, index: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('FreelancingMarketplaceEvent-collection', FreelancingMarketplaceEventSchema);
