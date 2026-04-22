const mongoose = require('mongoose');

const ModuleSchema = mongoose.Schema({
    moduleId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    contentType: {
        type: String,
        enum: ['video', 'audio', 'text', 'interactive', 'pdf', 'quiz'],
        required: true
    },
    contentUrl: String,
    duration: Number,  // in minutes
    order: {
        type: Number,
        required: true
    },
    isPreview: {
        type: Boolean,
        default: false
    },
    culturalContext: {
        ceremony: String,
        season: String,
        significance: String
    }
}, { _id: false });

const EnrollmentSchema = mongoose.Schema({
    studentAddress: String,
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    progress: {
        completedModules: [String],
        percentComplete: {
            type: Number,
            default: 0
        },
        lastAccessed: Date,
        currentLessonId: String,
        resumePositionSec: {
            type: Number,
            default: 0
        }
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: Date,
    certificateNftId: String
});

const CourseSchema = mongoose.Schema({
    courseId: {
        type: String,
        required: true,
        unique: true
    },
    creatorAddress: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    culturalContext: {
        tribe: String,
        nation: String,
        traditionalKnowledgeLabel: String,
        elderApproved: {
            type: Boolean,
            default: false
        },
        approvers: [String]  // Elder wallet addresses
    },
    category: {
        type: String,
        enum: [
            'traditional_arts',           // 1. Traditional Art Courses
            'language_learning',          // 2. Language Learning Courses
            'cultural_knowledge',         // 3. Cultural Knowledge Courses
            'contemporary_art_design',    // 4. Contemporary Art & Design Courses
            'performing_arts',            // 5. Performing Arts Courses
            'business_entrepreneurship',  // 6. Business & Entrepreneurship Courses
            'curatorial_museum',          // 7. Curatorial & Museum Studies
            'academic_university',        // 8. Academic & University-Level Courses
            'teacher_education',          // 9. Teacher Education & Curriculum Development
            'health_wellness',            // 10. Health & Wellness Courses
            'environmental_land',         // 11. Environmental & Land-Based Courses
            'digital_technology',         // 12. Digital Technology for Indigenous Peoples
            'other'
        ],
        required: true
    },
    categoryId: String,      // matches CATEGORY_DEFINITIONS id
    subcategory: String,     // specific course topic within category
    skillLevel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'all_levels'],
        default: 'all_levels'
    },
    modules: [ModuleSchema],
    thumbnailUrl: String,
    previewVideoUrl: String,
    pricing: {
        type: {
            type: String,
            enum: ['free', 'one_time', 'subscription'],
            default: 'free'
        },
        amount: {
            type: Number,
            default: 0
        },
        currency: {
            type: String,
            default: 'XRP'
        },
        subscriptionPeriod: String  // 'monthly', 'yearly' if type is subscription
    },
    nftCertificate: {
        enabled: {
            type: Boolean,
            default: false
        },
        templateId: String,
        metadata: {
            imageUrl: String,
            attributes: [{
                trait_type: String,
                value: String
            }]
        }
    },
    enrollments: [EnrollmentSchema],
    maxStudents: {
        type: Number,
        default: 0  // 0 = unlimited
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived', 'under_review'],
        default: 'draft'
    },
    ratings: [{
        studentAddress: String,
        rating: Number,
        review: String,
        verifiedCompletion: {
            type: Boolean,
            default: false
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    averageRating: {
        type: Number,
        default: 0
    },
    tags: [String],
    prerequisites: [String],  // Course IDs
    estimatedDuration: Number  // Total minutes
}, {
    timestamps: true
});

module.exports = mongoose.model('Course-collection', CourseSchema);
