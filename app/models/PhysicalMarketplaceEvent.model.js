const mongoose = require('mongoose');

const PhysicalMarketplaceEventSchema = mongoose.Schema({
    event: {
        type: String,
        required: true,
        index: true
    },
    itemId: {
        type: String,
        index: true
    },
    category: {
        type: String,
        index: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('PhysicalMarketplaceEvent-collection', PhysicalMarketplaceEventSchema);
