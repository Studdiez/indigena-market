const mongoose = require('mongoose');

const ParameterSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['string', 'number', 'percentage', 'currency', 'address', 'boolean'],
        required: true
    },
    required: {
        type: Boolean,
        default: true
    },
    description: String,
    examples: [String]  // Example values for this parameter
});

const VoiceCommandSchema = mongoose.Schema({
    commandId: {
        type: String,
        required: true,
        unique: true
    },
    intent: {
        type: String,
        required: true,
        enum: [
            'mint_nft',
            'search_nft',
            'search_artist',
            'view_collection',
            'place_bid',
            'buy_nft',
            'donate_seva',
            'allocate_seva',
            'view_dashboard',
            'edit_profile',
            'create_collection',
            'add_favorite',
            'remove_favorite',
            'view_activity',
            'help',
            'navigate',
            'filter_by_tribe',
            'filter_by_nation',
            'filter_by_price',
            'sort_results',
            'enroll_course',
            'hire_freelancer',
            'request_access',
            'cancel',
            'confirm'
        ]
    },
    language: {
        type: String,
        required: true,
        enum: [
            'english',
            'maori',
            'aboriginal_english',
            'samoan',
            'tongan',
            'fijian',
            'hawaiian',
            'navajo',
            'cherokee',
            'inuktitut'
        ]
    },
    phrases: [{
        type: String,
        required: true
    }],
    parameters: [ParameterSchema],
    action: {
        type: String,
        required: true  // API endpoint or function name
    },
    httpMethod: {
        type: String,
        enum: ['GET', 'POST', 'PUT', 'DELETE'],
        default: 'POST'
    },
    elderMode: {
        type: Boolean,
        default: false  // Available in simplified elder UI
    },
    requiresAuth: {
        type: Boolean,
        default: true
    },
    description: String,
    category: {
        type: String,
        enum: ['nft', 'marketplace', 'seva', 'profile', 'navigation', 'help', 'course', 'freelancer'],
        required: true
    },
    confirmationRequired: {
        type: Boolean,
        default: false  // Ask for confirmation before executing
    },
    successMessage: String,  // Message to speak back on success
    errorMessage: String,    // Message to speak back on error
    isActive: {
        type: Boolean,
        default: true
    },
    usageCount: {
        type: Number,
        default: 0  // Track how often this command is used
    },
    accuracyScore: {
        type: Number,
        default: 0.95  // Voice recognition accuracy (0-1)
    }
}, {
    timestamps: true
});

// Index for quick lookup by language and intent
VoiceCommandSchema.index({ language: 1, intent: 1 });
VoiceCommandSchema.index({ language: 1, elderMode: 1 });

module.exports = mongoose.model('VoiceCommand-collection', VoiceCommandSchema);
