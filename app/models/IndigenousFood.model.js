const mongoose = require('mongoose');

const IndigenousFoodSchema = mongoose.Schema({
    productId: { type: String, required: true, unique: true },
    
    // Producer information
    producerAddress: { type: String, required: true },
    producerName: String,
    community: String,
    nation: String,
    
    // Product details
    name: { type: String, required: true },
    description: String,
    category: {
        type: String,
        enum: [
            'wild_rice',
            'traditional_tea',
            'herbs_medicinal',
            'dried_meats',
            'smoked_fish',
            'berries_fruit',
            'honey',
            'maple_products',
            'seeds',
            'mushrooms',
            'seaweed',
            'traditional_preserves',
            'baked_goods',
            'other'
        ]
    },
    
    // Harvest information
    harvestInfo: {
        harvestDate: Date,
        harvestLocation: String,
        harvestMethod: String,
        sustainablePractice: String,
        season: String
    },
    
    // Traditional knowledge
    traditionalKnowledge: {
        traditionalName: String,
        traditionalUses: [String],
        preparationMethods: [String],
        culturalSignificance: String,
        stories: String
    },
    
    // Product specifications
    weight: {
        value: Number,
        unit: String
    },
    packaging: String,
    shelfLife: String,
    storageInstructions: String,
    
    // Pricing
    price: { type: Number, required: true },
    currency: { type: String, default: 'XRP' },
    quantityAvailable: { type: Number, required: true },
    
    // Shipping
    shipping: {
        domesticAvailable: { type: Boolean, default: true },
        internationalAvailable: { type: Boolean, default: false },
        shippingCost: Number,
        shipsFrom: String,
        estimatedDelivery: String
    },
    
    // Images
    images: [String],
    
    // Certifications
    certifications: [{
        type: String,
        enum: ['organic', 'wild_crafted', 'fair_trade', 'traditional_harvest', 'elder_approved']
    }],
    
    // Status
    status: {
        type: String,
        enum: ['available', 'seasonal', 'out_of_stock', 'discontinued'],
        default: 'available'
    },
    
    // Seasonal availability
    seasonalAvailability: {
        isSeasonal: { type: Boolean, default: false },
        availableFrom: Date,
        availableUntil: Date
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
    
    // Elder approval
    elderApproved: { type: Boolean, default: false },
    approvedBy: [String]
}, {
    timestamps: true
});

IndigenousFoodSchema.index({ category: 1, status: 1 });
IndigenousFoodSchema.index({ producerAddress: 1 });
IndigenousFoodSchema.index({ nation: 1 });

module.exports = mongoose.model('IndigenousFood', IndigenousFoodSchema);
