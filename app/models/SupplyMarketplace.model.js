const mongoose = require('mongoose');

const SupplyMarketplaceSchema = mongoose.Schema({
    listingId: { type: String, required: true, unique: true },
    
    // Seller information
    sellerAddress: { type: String, required: true },
    sellerName: String,
    sellerType: {
        type: String,
        enum: ['artist', 'elder', 'supplier', 'community_hub'],
        default: 'artist'
    },
    community: String,
    nation: String,
    
    // Product details
    name: { type: String, required: true },
    description: String,
    category: {
        type: String,
        enum: [
            'hides_prepared',
            'beads_sequins',
            'natural_dyes',
            'carving_materials',
            'weaving_materials',
            'pottery_clay',
            'jewelry_supplies',
            'tools_instruments',
            'canvas_paper',
            'frames_display',
            'packaging_materials',
            'electronics_cameras',
            'other'
        ]
    },
    
    // Product specifications
    condition: {
        type: String,
        enum: ['new', 'like_new', 'used', 'vintage', 'handmade'],
        default: 'new'
    },
    
    quantity: { type: Number, required: true },
    unit: String,
    
    // Pricing
    price: { type: Number, required: true },
    currency: { type: String, default: 'XRP' },
    pricePerUnit: Number,
    
    // Bulk pricing
    bulkPricing: [{
        minQuantity: Number,
        pricePerUnit: Number
    }],
    
    // Shipping
    shipping: {
        domesticCost: Number,
        internationalCost: Number,
        shipsFrom: String,
        estimatedDelivery: String,
        weight: Number,
        dimensions: {
            length: Number,
            width: Number,
            height: Number
        }
    },
    
    // Images
    images: [String],
    
    // Status
    status: {
        type: String,
        enum: ['available', 'reserved', 'sold', 'unavailable'],
        default: 'available'
    },
    
    // Traditional/Ethical sourcing
    traditionalSource: {
        isTraditional: { type: Boolean, default: false },
        harvestMethod: String,
        sustainablePractice: String,
        communitySourced: { type: Boolean, default: false }
    },
    
    // For tool library items
    isRental: { type: Boolean, default: false },
    rentalInfo: {
        dailyRate: Number,
        weeklyRate: Number,
        monthlyRate: Number,
        deposit: Number,
        availableFrom: Date,
        availableUntil: Date,
        conditionChecklist: [String]
    },
    
    // Sales
    totalSales: { type: Number, default: 0 },
    
    // Reviews
    reviews: [{
        reviewerAddress: String,
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        date: Date
    }],
    averageRating: { type: Number, default: 0 },
    
    // Related to specific art forms
    relatedArtForms: [String],
    
    // Elder approval (for traditional materials)
    elderApproved: { type: Boolean, default: false },
    approvedBy: [String]
}, {
    timestamps: true
});

SupplyMarketplaceSchema.index({ category: 1, status: 1 });
SupplyMarketplaceSchema.index({ sellerAddress: 1 });
SupplyMarketplaceSchema.index({ isRental: 1 });

module.exports = mongoose.model('SupplyMarketplace', SupplyMarketplaceSchema);
