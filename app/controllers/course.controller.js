const Course = require('../models/Course.model.js');
const jwt = require('jsonwebtoken');
const CourseWatchlist = require('../models/CourseWatchlist.model.js');
const CourseReport = require('../models/CourseReport.model.js');
const CourseShare = require('../models/CourseShare.model.js');
const CourseEnrollmentReceipt = require('../models/CourseEnrollmentReceipt.model.js');
const CoursePaymentIntent = require('../models/CoursePaymentIntent.model.js');
const Users = require('../models/user.model.js');

// ── 12 Category Definitions ─────────────────────────────────────────────────
const CATEGORY_DEFINITIONS = [
    {
        id: 'traditional_arts', name: 'Traditional Art Courses', icon: '🎨',
        description: 'Learn painting, carving, weaving, beadwork, pottery, and other physical traditional art forms from Indigenous masters.',
        subcategories: [
            { name: 'Traditional Painting Techniques', rateRange: { min: 100, max: 500,  unit: 'per course' }, targetStudents: ['Art Students', 'Enthusiasts'] },
            { name: 'Carving Fundamentals',            rateRange: { min: 150, max: 600,  unit: 'per course' }, targetStudents: ['Aspiring Carvers'] },
            { name: 'Basket Weaving Mastery',          rateRange: { min: 100, max: 400,  unit: 'per course' }, targetStudents: ['Crafters', 'Artists'] },
            { name: 'Pottery & Ceramics',              rateRange: { min: 150, max: 500,  unit: 'per course' }, targetStudents: ['Ceramics Students'] },
            { name: 'Textile Weaving',                 rateRange: { min: 200, max: 600,  unit: 'per course' }, targetStudents: ['Fiber Artists'] },
            { name: 'Beadwork Techniques',             rateRange: { min: 80,  max: 300,  unit: 'per course' }, targetStudents: ['Jewelry Makers', 'Artists'] },
            { name: 'Jewelry Making',                  rateRange: { min: 200, max: 700,  unit: 'per course' }, targetStudents: ['Jewelry Designers'] },
            { name: 'Featherwork Arts',                rateRange: { min: 150, max: 500,  unit: 'per course' }, targetStudents: ['Artists', 'Cultural Practitioners'] },
            { name: 'Hide Tanning',                    rateRange: { min: 200, max: 600,  unit: 'per course' }, targetStudents: ['Traditional Craftspeople'] },
            { name: 'Quillwork',                       rateRange: { min: 150, max: 500,  unit: 'per course' }, targetStudents: ['Traditional Artists'] },
        ]
    },
    {
        id: 'language_learning', name: 'Language Learning Courses', icon: '🗣️',
        description: 'Learn and preserve Indigenous languages — from beginner vocabulary through advanced fluency, storytelling, and ceremonial language.',
        subcategories: [
            { name: 'Beginning Indigenous Language', rateRange: { min: 100, max: 400,  unit: 'per course' }, targetStudents: ['Language Learners'] },
            { name: 'Intermediate Conversation',     rateRange: { min: 150, max: 500,  unit: 'per course' }, targetStudents: ['Continuing Learners'] },
            { name: 'Advanced Fluency',              rateRange: { min: 200, max: 600,  unit: 'per course' }, targetStudents: ['Advanced Students'] },
            { name: "Children's Language Programs",  rateRange: { min: 50,  max: 200,  unit: 'per course' }, targetStudents: ['Families', 'Educators'] },
            { name: 'Language Through Art',          rateRange: { min: 150, max: 450,  unit: 'per course' }, targetStudents: ['Holistic Learners'] },
            { name: 'Elder-Led Oral Traditions',     rateRange: { min: 200, max: 600,  unit: 'per course' }, targetStudents: ['Language Preservationists'] },
            { name: 'Writing Systems',               rateRange: { min: 100, max: 400,  unit: 'per course' }, targetStudents: ['Literacy Students'] },
            { name: 'Ceremonial Language',           rateRange: { min: 250, max: 700,  unit: 'per course' }, targetStudents: ['Cultural Practitioners'] },
        ]
    },
    {
        id: 'cultural_knowledge', name: 'Cultural Knowledge Courses', icon: '🏛️',
        description: 'Traditional ecological knowledge, medicinal plants, food systems, ceremonial protocols, oral history, and cosmology.',
        subcategories: [
            { name: 'Traditional Ecological Knowledge', rateRange: { min: 150, max: 500,  unit: 'per course' }, targetStudents: ['Environmentalists', 'Students'] },
            { name: 'Medicinal Plants',                 rateRange: { min: 200, max: 600,  unit: 'per course' }, targetStudents: ['Herbalists', 'Health Practitioners'] },
            { name: 'Traditional Food Systems',         rateRange: { min: 150, max: 500,  unit: 'per course' }, targetStudents: ['Food Enthusiasts', 'Chefs'] },
            { name: 'Ceremonial Protocols',             rateRange: { min: 250, max: 700,  unit: 'per course' }, targetStudents: ['Cultural Practitioners'] },
            { name: 'Oral History & Storytelling',      rateRange: { min: 150, max: 500,  unit: 'per course' }, targetStudents: ['Storytellers', 'Historians'] },
            { name: 'Genealogy & Family History',       rateRange: { min: 200, max: 600,  unit: 'per course' }, targetStudents: ['Individuals', 'Families'] },
            { name: 'Seasonal Calendars',               rateRange: { min: 100, max: 400,  unit: 'per course' }, targetStudents: ['Educators', 'Cultural Enthusiasts'] },
            { name: 'Constellations & Star Knowledge',  rateRange: { min: 150, max: 450,  unit: 'per course' }, targetStudents: ['Stargazers', 'Cultural Learners'] },
        ]
    },
    {
        id: 'contemporary_art_design', name: 'Contemporary Art & Design Courses', icon: '🖌️',
        description: 'Modern Indigenous painting, digital art, fashion design, photography, and portfolio development.',
        subcategories: [
            { name: 'Contemporary Indigenous Painting',       rateRange: { min: 200, max: 600,  unit: 'per course' }, targetStudents: ['Artists'] },
            { name: 'Digital Art for Indigenous Artists',     rateRange: { min: 150, max: 500,  unit: 'per course' }, targetStudents: ['Digital Artists'] },
            { name: 'Fashion Design with Cultural Elements',  rateRange: { min: 250, max: 700,  unit: 'per course' }, targetStudents: ['Fashion Designers'] },
            { name: 'Printmaking',                            rateRange: { min: 200, max: 600,  unit: 'per course' }, targetStudents: ['Printmakers'] },
            { name: 'Photography for Artists',                rateRange: { min: 150, max: 450,  unit: 'per course' }, targetStudents: ['Artists'] },
            { name: 'Portfolio Development',                  rateRange: { min: 200, max: 500,  unit: 'per course' }, targetStudents: ['Emerging Artists'] },
            { name: 'Artist Statement Writing',               rateRange: { min: 100, max: 300,  unit: 'per course' }, targetStudents: ['Artists'] },
            { name: 'Exhibition Preparation',                 rateRange: { min: 150, max: 400,  unit: 'per course' }, targetStudents: ['Artists'] },
        ]
    },
    {
        id: 'performing_arts', name: 'Performing Arts Courses', icon: '🥁',
        description: 'Traditional dance, drumming, singing, flute making, storytelling performance, and ceremonial music.',
        subcategories: [
            { name: 'Traditional Dance',               rateRange: { min: 150, max: 500,  unit: 'per course' }, targetStudents: ['Dancers'] },
            { name: 'Drumming',                        rateRange: { min: 100, max: 400,  unit: 'per course' }, targetStudents: ['Musicians'] },
            { name: 'Singing & Chanting',              rateRange: { min: 150, max: 450,  unit: 'per course' }, targetStudents: ['Singers'] },
            { name: 'Flute Making & Playing',          rateRange: { min: 200, max: 600,  unit: 'per course' }, targetStudents: ['Musicians'] },
            { name: 'Storytelling Performance',        rateRange: { min: 150, max: 500,  unit: 'per course' }, targetStudents: ['Performers', 'Educators'] },
            { name: 'Ceremonial Music',                rateRange: { min: 250, max: 700,  unit: 'per course' }, targetStudents: ['Cultural Practitioners'] },
            { name: 'Contemporary Indigenous Music',   rateRange: { min: 200, max: 600,  unit: 'per course' }, targetStudents: ['Musicians'] },
            { name: 'Powwow Dance Styles',             rateRange: { min: 150, max: 500,  unit: 'per course' }, targetStudents: ['Dancers'] },
        ]
    },
    {
        id: 'business_entrepreneurship', name: 'Business & Entrepreneurship', icon: '💼',
        description: 'Starting an art business, pricing, e-commerce, marketing, IP licensing, grant writing, and financial management.',
        subcategories: [
            { name: 'Starting an Art Business',         rateRange: { min: 100, max: 400,  unit: 'per course' }, targetStudents: ['Emerging Artists'] },
            { name: 'Pricing Your Work',                rateRange: { min: 80,  max: 300,  unit: 'per course' }, targetStudents: ['Artists'] },
            { name: 'E-commerce for Artists',           rateRange: { min: 150, max: 500,  unit: 'per course' }, targetStudents: ['Artists'] },
            { name: 'Marketing & Social Media',         rateRange: { min: 100, max: 400,  unit: 'per course' }, targetStudents: ['Artists'] },
            { name: 'Licensing & Intellectual Property',rateRange: { min: 200, max: 600,  unit: 'per course' }, targetStudents: ['Artists', 'Communities'] },
            { name: 'Gallery Representation',           rateRange: { min: 150, max: 450,  unit: 'per course' }, targetStudents: ['Artists'] },
            { name: 'Financial Management',             rateRange: { min: 100, max: 400,  unit: 'per course' }, targetStudents: ['Artists'] },
            { name: 'Grant Writing',                    rateRange: { min: 200, max: 500,  unit: 'per course' }, targetStudents: ['Artists', 'Organizations'] },
        ]
    },
    {
        id: 'curatorial_museum', name: 'Curatorial & Museum Studies', icon: '🏺',
        description: 'Curating Indigenous art, museum protocols, repatriation, exhibition writing, and Indigenous museology.',
        subcategories: [
            { name: 'Curating Indigenous Art',     rateRange: { min: 250, max: 700,  unit: 'per course' }, targetStudents: ['Curators', 'Gallery Staff'] },
            { name: 'Museum Protocols',            rateRange: { min: 200, max: 600,  unit: 'per course' }, targetStudents: ['Museum Professionals'] },
            { name: 'Repatriation Processes',      rateRange: { min: 250, max: 700,  unit: 'per course' }, targetStudents: ['Museum Staff', 'Communities'] },
            { name: 'Exhibition Writing',          rateRange: { min: 150, max: 500,  unit: 'per course' }, targetStudents: ['Curators', 'Writers'] },
            { name: 'Collection Management',       rateRange: { min: 200, max: 600,  unit: 'per course' }, targetStudents: ['Museum Staff'] },
            { name: 'Cultural Consultation',       rateRange: { min: 250, max: 700,  unit: 'per course' }, targetStudents: ['Museum Professionals'] },
            { name: 'Indigenous Museology',        rateRange: { min: 200, max: 600,  unit: 'per course' }, targetStudents: ['Students', 'Professionals'] },
        ]
    },
    {
        id: 'academic_university', name: 'Academic & University-Level', icon: '🎓',
        description: 'University-level courses on Indigenous studies, history, politics, research methodologies, treaty studies, and decolonization.',
        subcategories: [
            { name: 'Indigenous Studies',                  rateRange: { min: 500, max: 2000, unit: 'per course' }, targetStudents: ['University Students'] },
            { name: 'Indigenous History',                  rateRange: { min: 400, max: 1500, unit: 'per course' }, targetStudents: ['Students', 'Lifelong Learners'] },
            { name: 'Indigenous Politics',                 rateRange: { min: 400, max: 1500, unit: 'per course' }, targetStudents: ['Students', 'Activists'] },
            { name: 'Indigenous Research Methodologies',   rateRange: { min: 500, max: 2000, unit: 'per course' }, targetStudents: ['Graduate Students', 'Researchers'] },
            { name: 'Treaty Studies',                      rateRange: { min: 500, max: 2000, unit: 'per course' }, targetStudents: ['Students', 'Legal Professionals'] },
            { name: 'Indigenous Literature',               rateRange: { min: 300, max: 1000, unit: 'per course' }, targetStudents: ['Literature Students'] },
            { name: 'Indigenous Philosophy',               rateRange: { min: 400, max: 1500, unit: 'per course' }, targetStudents: ['Philosophy Students'] },
            { name: 'Decolonization Studies',              rateRange: { min: 400, max: 1500, unit: 'per course' }, targetStudents: ['Students', 'Activists'] },
        ]
    },
    {
        id: 'teacher_education', name: 'Teacher Education & Curriculum', icon: '📋',
        description: 'Indigenous pedagogy, curriculum development, land-based education, Elder engagement, and culturally appropriate assessment.',
        subcategories: [
            { name: 'Indigenous Pedagogy',                  rateRange: { min: 200, max: 600,  unit: 'per course' }, targetStudents: ['Educators'] },
            { name: 'Curriculum Development',               rateRange: { min: 250, max: 700,  unit: 'per course' }, targetStudents: ['Teachers', 'Curriculum Developers'] },
            { name: 'Classroom Cultural Inclusion',         rateRange: { min: 150, max: 500,  unit: 'per course' }, targetStudents: ['K-12 Teachers'] },
            { name: 'Language Teaching Methods',            rateRange: { min: 200, max: 600,  unit: 'per course' }, targetStudents: ['Language Instructors'] },
            { name: 'Elder Engagement in Schools',          rateRange: { min: 200, max: 500,  unit: 'per course' }, targetStudents: ['School Administrators'] },
            { name: 'Land-Based Education',                 rateRange: { min: 200, max: 600,  unit: 'per course' }, targetStudents: ['Educators'] },
            { name: 'Assessment in Indigenous Education',   rateRange: { min: 200, max: 500,  unit: 'per course' }, targetStudents: ['Education Professionals'] },
            { name: 'Indigenous Early Childhood Education', rateRange: { min: 150, max: 500,  unit: 'per course' }, targetStudents: ['Early Childhood Educators'] },
        ]
    },
    {
        id: 'health_wellness', name: 'Health & Wellness Courses', icon: '🌿',
        description: 'Traditional healing practices, plant medicine, mental wellness, ceremony-based healing, and community health approaches.',
        subcategories: [
            { name: 'Traditional Healing Practices',    rateRange: { min: 200, max: 600,  unit: 'per course' }, targetStudents: ['Health Practitioners', 'Individuals'] },
            { name: 'Plant Medicine & Herbalism',        rateRange: { min: 200, max: 600,  unit: 'per course' }, targetStudents: ['Herbalists', 'Wellness Seekers'] },
            { name: 'Indigenous Mental Wellness',        rateRange: { min: 150, max: 500,  unit: 'per course' }, targetStudents: ['Counselors', 'Community Members'] },
            { name: 'Community-Based Health',            rateRange: { min: 200, max: 500,  unit: 'per course' }, targetStudents: ['Health Workers'] },
            { name: 'Mindfulness & Ceremony',            rateRange: { min: 150, max: 450,  unit: 'per course' }, targetStudents: ['Wellness Seekers'] },
            { name: 'Nutrition from the Land',           rateRange: { min: 100, max: 400,  unit: 'per course' }, targetStudents: ['Nutritionists', 'Chefs', 'Families'] },
            { name: 'Trauma-Informed Practices',         rateRange: { min: 200, max: 600,  unit: 'per course' }, targetStudents: ['Counselors', 'Educators'] },
            { name: 'Elders\' Health Knowledge',          rateRange: { min: 250, max: 700,  unit: 'per course' }, targetStudents: ['Health Students', 'Communities'] },
        ]
    },
    {
        id: 'environmental_land', name: 'Environmental & Land-Based', icon: '🌲',
        description: 'Conservation science, climate adaptation, fire management, water stewardship, land-based survival, and Indigenous environmental law.',
        subcategories: [
            { name: 'Land-Based Survival Skills',          rateRange: { min: 150, max: 500,  unit: 'per course' }, targetStudents: ['Outdoors Enthusiasts', 'Students'] },
            { name: 'Traditional Fire Management',         rateRange: { min: 200, max: 600,  unit: 'per course' }, targetStudents: ['Land Managers', 'Ecologists'] },
            { name: 'Water & Watershed Stewardship',       rateRange: { min: 150, max: 500,  unit: 'per course' }, targetStudents: ['Environmentalists', 'Community Members'] },
            { name: 'Indigenous Conservation Science',     rateRange: { min: 200, max: 700,  unit: 'per course' }, targetStudents: ['Scientists', 'Students'] },
            { name: 'Climate Adaptation Knowledge',        rateRange: { min: 200, max: 600,  unit: 'per course' }, targetStudents: ['Planners', 'Community Leaders'] },
            { name: 'Wildlife & Habitat Knowledge',        rateRange: { min: 150, max: 500,  unit: 'per course' }, targetStudents: ['Naturalists', 'Students'] },
            { name: 'Indigenous Environmental Law',        rateRange: { min: 300, max: 800,  unit: 'per course' }, targetStudents: ['Law Students', 'Activists'] },
            { name: 'Seed Saving & Plant Cultivation',     rateRange: { min: 100, max: 400,  unit: 'per course' }, targetStudents: ['Gardeners', 'Farmers'] },
        ]
    },
    {
        id: 'digital_technology', name: 'Digital Technology for Indigenous Peoples', icon: '💻',
        description: 'Digital archiving, NFT creation, language app development, social media for communities, and Indigenous data sovereignty.',
        subcategories: [
            { name: 'Digital Archiving & Preservation',    rateRange: { min: 150, max: 500,  unit: 'per course' }, targetStudents: ['Archivists', 'Cultural Workers'] },
            { name: 'NFT Creation for Artists',            rateRange: { min: 150, max: 500,  unit: 'per course' }, targetStudents: ['Digital Artists'] },
            { name: 'Language App Development',            rateRange: { min: 300, max: 800,  unit: 'per course' }, targetStudents: ['Developers', 'Language Workers'] },
            { name: 'Social Media for Communities',        rateRange: { min: 100, max: 400,  unit: 'per course' }, targetStudents: ['Community Leaders', 'Communications Staff'] },
            { name: 'Indigenous Data Sovereignty',         rateRange: { min: 250, max: 700,  unit: 'per course' }, targetStudents: ['Data Professionals', 'Researchers'] },
            { name: 'Podcasting & Audio Storytelling',     rateRange: { min: 100, max: 400,  unit: 'per course' }, targetStudents: ['Storytellers', 'Communicators'] },
            { name: 'Website Building for Artists',        rateRange: { min: 150, max: 500,  unit: 'per course' }, targetStudents: ['Artists', 'Small Businesses'] },
            { name: 'AI Ethics for Indigenous Data',       rateRange: { min: 200, max: 600,  unit: 'per course' }, targetStudents: ['Tech Workers', 'Researchers'] },
        ]
    },

    {
        id: 'language_teacher_training', name: 'Language Teacher Training', icon: '🗣️',
        description: 'Methods, curriculum, assessment, immersion, and language technology training for language educators.',
        accessLevel: 'public',
        subcategories: [
            { name: 'Language Teaching Methods',          rateRange: { min: 200, max: 600, unit: 'per course' }, targetStudents: ['Language Teachers'] },
            { name: 'Curriculum Development for Languages',rateRange: { min: 250, max: 700, unit: 'per course' }, targetStudents: ['Program Coordinators'] },
            { name: 'Language Assessment',                 rateRange: { min: 200, max: 500, unit: 'per course' }, targetStudents: ['Language Teachers'] },
            { name: 'Immersion Techniques',               rateRange: { min: 200, max: 600, unit: 'per course' }, targetStudents: ['Language Teachers'] },
            { name: 'Materials Development',              rateRange: { min: 150, max: 500, unit: 'per course' }, targetStudents: ['Language Workers'] },
            { name: 'Language Technology',                rateRange: { min: 150, max: 500, unit: 'per course' }, targetStudents: ['Tech-savvy Teachers'] },
            { name: 'Master-Apprentice Method',           rateRange: { min: 250, max: 600, unit: 'per course' }, targetStudents: ['Language Teams'] },
            { name: 'Language Nest Training',             rateRange: { min: 200, max: 600, unit: 'per course' }, targetStudents: ['Language Nest Staff'] },
        ]
    },
    {
        id: 'youth_family', name: 'Youth & Family Courses', icon: '👨‍👩‍👧',
        description: 'Family-first cultural education, youth leadership, and intergenerational learning.',
        accessLevel: 'public',
        subcategories: [
            { name: 'Indigenous Crafts for Kids',     rateRange: { min: 30,  max: 100, unit: 'per course' }, targetStudents: ['Children', 'Families'] },
            { name: 'Stories with Elders',            rateRange: { min: 20,  max: 80,  unit: 'per course' }, targetStudents: ['Families'] },
            { name: 'Family Language Learning',       rateRange: { min: 50,  max: 200, unit: 'per course' }, targetStudents: ['Families'] },
            { name: 'Youth Cultural Camps (Online)',  rateRange: { min: 100, max: 400, unit: 'per course' }, targetStudents: ['Teenagers'] },
            { name: 'Coming of Age Preparation',      rateRange: { min: 200, max: 600, unit: 'per course' }, targetStudents: ['Families', 'Youth'] },
            { name: 'Intergenerational Learning',     rateRange: { min: 150, max: 500, unit: 'per course' }, targetStudents: ['Communities'] },
            { name: "Children's Songs & Games",      rateRange: { min: 30,  max: 100, unit: 'per course' }, targetStudents: ['Young Children'] },
            { name: 'Youth Leadership',               rateRange: { min: 100, max: 400, unit: 'per course' }, targetStudents: ['Teenagers'] },
        ]
    },
    {
        id: 'cultural_tourism', name: 'Cultural Tourism Training', icon: '🧭',
        description: 'Tour guiding, interpretation, hosting, and tourism business development rooted in protocol.',
        accessLevel: 'public',
        subcategories: [
            { name: 'Tour Guide Training',                rateRange: { min: 200, max: 500, unit: 'per course' }, targetStudents: ['Tourism Operators'] },
            { name: 'Cultural Interpretation',            rateRange: { min: 150, max: 450, unit: 'per course' }, targetStudents: ['Guides'] },
            { name: 'Starting a Tourism Business',        rateRange: { min: 200, max: 600, unit: 'per course' }, targetStudents: ['Entrepreneurs'] },
            { name: 'Hosting Visitors',                   rateRange: { min: 150, max: 400, unit: 'per course' }, targetStudents: ['Homestay Operators'] },
            { name: 'Storytelling for Tourism',           rateRange: { min: 150, max: 500, unit: 'per course' }, targetStudents: ['Guides'] },
            { name: 'Cultural Safety for Visitors',       rateRange: { min: 100, max: 300, unit: 'per course' }, targetStudents: ['Tourism Businesses'] },
            { name: 'Marketing Cultural Experiences',     rateRange: { min: 150, max: 500, unit: 'per course' }, targetStudents: ['Operators'] },
            { name: 'Partnerships with Travel Companies',rateRange: { min: 200, max: 500, unit: 'per course' }, targetStudents: ['Business Owners'] },
        ]
    },
    {
        id: 'advocacy_organizing', name: 'Advocacy & Community Organizing', icon: '📣',
        description: 'Community mobilization, policy strategy, public communication, and coalition action.',
        accessLevel: 'public',
        subcategories: [
            { name: 'Community Organizing',             rateRange: { min: 150, max: 500, unit: 'per course' }, targetStudents: ['Activists'] },
            { name: 'Advocacy Campaign Development',    rateRange: { min: 200, max: 600, unit: 'per course' }, targetStudents: ['Organizations'] },
            { name: 'Media Relations',                  rateRange: { min: 150, max: 450, unit: 'per course' }, targetStudents: ['Advocates'] },
            { name: 'Public Speaking',                  rateRange: { min: 150, max: 500, unit: 'per course' }, targetStudents: ['Advocates'] },
            { name: 'Policy Analysis',                  rateRange: { min: 250, max: 700, unit: 'per course' }, targetStudents: ['Policy Workers'] },
            { name: 'Lobbying Government',              rateRange: { min: 200, max: 600, unit: 'per course' }, targetStudents: ['Organizations'] },
            { name: 'Coalition Building',               rateRange: { min: 150, max: 500, unit: 'per course' }, targetStudents: ['Activists'] },
            { name: 'Digital Advocacy',                 rateRange: { min: 150, max: 400, unit: 'per course' }, targetStudents: ['Advocates'] },
        ]
    },
    {
        id: 'sacred_ceremonial', name: 'Sacred & Ceremonial Knowledge', icon: '🔥',
        description: 'Protocol-governed ceremonial teachings offered only with Elder/community authority.',
        accessLevel: 'elder-approved',
        subcategories: [
            { name: 'Ceremonial Preparation',      rateRange: { min: 0, max: 0, unit: 'by arrangement' }, targetStudents: ['Cultural Practitioners'] },
            { name: 'Sacred Song Teaching',        rateRange: { min: 0, max: 0, unit: 'by arrangement' }, targetStudents: ['Community Members'] },
            { name: 'Protocol Training',           rateRange: { min: 0, max: 0, unit: 'by arrangement' }, targetStudents: ['Cultural Participants'] },
            { name: 'Pipe Teachings',              rateRange: { min: 0, max: 0, unit: 'by arrangement' }, targetStudents: ['Spiritual Practitioners'] },
            { name: 'Sweat Lodge Teachings',       rateRange: { min: 0, max: 0, unit: 'by arrangement' }, targetStudents: ['Spiritual Seekers'] },
            { name: 'Medicine Bundle Care',        rateRange: { min: 0, max: 0, unit: 'by arrangement' }, targetStudents: ['Bundle Keepers'] },
            { name: 'Naming Ceremony Protocols',   rateRange: { min: 0, max: 0, unit: 'by arrangement' }, targetStudents: ['Families'] },
            { name: 'Coming of Age Ceremonies',    rateRange: { min: 0, max: 0, unit: 'by arrangement' }, targetStudents: ['Communities'] },
        ]
    },
    {
        id: 'professional_development', name: 'Professional Development', icon: '📈',
        description: 'Leadership, governance, nonprofit operations, project delivery, and strategy for Indigenous organizations.',
        accessLevel: 'public',
        subcategories: [
            { name: 'Indigenous Leadership',                          rateRange: { min: 300, max: 800, unit: 'per course' }, targetStudents: ['Professionals'] },
            { name: 'Board Governance for Indigenous Organizations',  rateRange: { min: 250, max: 700, unit: 'per course' }, targetStudents: ['Board Members'] },
            { name: 'Nonprofit Management',                           rateRange: { min: 300, max: 800, unit: 'per course' }, targetStudents: ['Executive Directors'] },
            { name: 'Project Management',                             rateRange: { min: 200, max: 600, unit: 'per course' }, targetStudents: ['Project Coordinators'] },
            { name: 'Grant Management',                               rateRange: { min: 200, max: 500, unit: 'per course' }, targetStudents: ['Grant Managers'] },
            { name: 'Human Resources in Indigenous Contexts',         rateRange: { min: 250, max: 600, unit: 'per course' }, targetStudents: ['HR Professionals'] },
            { name: 'Conflict Resolution',                            rateRange: { min: 200, max: 600, unit: 'per course' }, targetStudents: ['Mediators', 'Leaders'] },
            { name: 'Strategic Planning',                             rateRange: { min: 300, max: 800, unit: 'per course' }, targetStudents: ['Boards', 'Leadership'] },
        ]
    },
    {
        id: 'online_workshops', name: 'Online Workshops & Short Format', icon: '💬',
        description: 'Short-form, high-access sessions for quick skills transfer and community engagement.',
        accessLevel: 'public',
        subcategories: [
            { name: '2-Hour Beading Workshop', rateRange: { min: 30, max: 60,  unit: 'per workshop' }, targetStudents: ['Hobbyists'] },
            { name: 'Intro to Carving',        rateRange: { min: 50, max: 100, unit: 'per workshop' }, targetStudents: ['Beginners'] },
            { name: 'Language Snack',          rateRange: { min: 10, max: 25,  unit: 'per workshop' }, targetStudents: ['Casual Learners'] },
            { name: 'Cooking Class',           rateRange: { min: 40, max: 80,  unit: 'per workshop' }, targetStudents: ['Food Enthusiasts'] },
            { name: 'Dance Workshop',          rateRange: { min: 40, max: 80,  unit: 'per workshop' }, targetStudents: ['Enthusiasts'] },
            { name: 'Storytelling Hour',       rateRange: { min: 15, max: 30,  unit: 'per workshop' }, targetStudents: ['Families'] },
            { name: 'Plant Walk (Virtual)',    rateRange: { min: 30, max: 60,  unit: 'per workshop' }, targetStudents: ['Nature Learners'] },
            { name: 'Q&A with Artist',         rateRange: { min: 20, max: 50,  unit: 'per workshop' }, targetStudents: ['Art Enthusiasts'] },
        ]
    },
    {
        id: 'certificate_programs', name: 'Certificate Programs & Bundles', icon: '🏅',
        description: 'Long-form credential pathways and bundles for professional outcomes and recognition.',
        accessLevel: 'public',
        subcategories: [
            { name: 'Indigenous Arts Certificate',                         rateRange: { min: 1000, max: 3000, unit: 'per program' }, targetStudents: ['Serious Artists'] },
            { name: 'Language Fluency Certificate',                        rateRange: { min: 800,  max: 2500, unit: 'per program' }, targetStudents: ['Dedicated Learners'] },
            { name: 'Cultural Tourism Certificate',                        rateRange: { min: 1000, max: 2500, unit: 'per program' }, targetStudents: ['Tourism Operators'] },
            { name: 'Traditional Ecological Knowledge Certificate',        rateRange: { min: 1200, max: 3000, unit: 'per program' }, targetStudents: ['Environmental Professionals'] },
            { name: 'Indigenous Education Certificate',                    rateRange: { min: 1000, max: 2500, unit: 'per program' }, targetStudents: ['Educators'] },
            { name: 'Curatorial Studies Certificate',                      rateRange: { min: 1500, max: 3500, unit: 'per program' }, targetStudents: ['Curators'] },
            { name: 'Master-Apprentice Program',                           rateRange: { min: 2000, max: 5000, unit: 'per program' }, targetStudents: ['Language Learners'] },
            { name: 'Elder Teaching Certificate',                          rateRange: { min: 0,    max: 0,    unit: 'by arrangement' }, targetStudents: ['Authorized Cultural Teachers'] },
        ]
    },
];

// Revenue projections
const REVENUE_PROJECTIONS = {
    totalCategories: 20,
    year5Projections: {
        instructors: 20400,
        avgAnnualEarnings: 8400,
        platformFee: 10,
        transactionRevenue: 10080000,
        subscriptions: {
            learner:      { users: 15000, monthly: 9.99,  annual: 1798200  },
            educator:     { users: 4000,  monthly: 19.99, annual: 959520   },
            institution:  { users: 300,   monthly: 99.99, annual: 359964   },
        }
    },
    totalYear5Revenue: 37100000
};

const USER_JWT_SECRET = String(process.env.USER_JWT_SECRET || '').trim();
const REQUIRE_COURSE_USER_AUTH = process.env.NODE_ENV === 'production' || process.env.REQUIRE_COURSE_USER_AUTH === 'true';
const MIN_PROGRESS_FOR_RATING = Math.max(0, Number(process.env.COURSE_MIN_PROGRESS_FOR_RATING || 0));
const REVIEW_MIN_INTERVAL_MS = Math.max(0, Number(process.env.COURSE_REVIEW_MIN_INTERVAL_HOURS || 24)) * 60 * 60 * 1000;
const PAYMENT_INTENT_TTL_MINUTES = Math.max(5, Number(process.env.COURSE_PAYMENT_INTENT_TTL_MINUTES || 20));

function normalizeWallet(value) {
    return String(value || '').trim().toLowerCase();
}

function extractBearerToken(req) {
    const raw = String(req.headers.authorization || '').trim();
    if (!raw.toLowerCase().startsWith('bearer ')) return '';
    return raw.slice(7).trim();
}

function resolveAuthenticatedWallet(req, bodyFieldName = '') {
    const token = extractBearerToken(req);
    if (token && USER_JWT_SECRET) {
        try {
            const payload = jwt.verify(token, USER_JWT_SECRET);
            const wallet = normalizeWallet(payload?.wallet || payload?.address || payload?.sub || '');
            if (wallet) return wallet;
        } catch {
            return '';
        }
    }

    const headerWallet = normalizeWallet(req.headers['x-wallet-address'] || '');
    if (headerWallet) return headerWallet;

    const bodyWallet = bodyFieldName ? normalizeWallet(req.body?.[bodyFieldName]) : '';
    if (!REQUIRE_COURSE_USER_AUTH && bodyWallet) return bodyWallet;
    return '';
}

function parseNumber(value, fallback = null) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function buildCourseSort(sortKey) {
    if (sortKey === 'newest') return { createdAt: -1 };
    if (sortKey === 'price-low') return { 'pricing.amount': 1, createdAt: -1 };
    if (sortKey === 'price-high') return { 'pricing.amount': -1, createdAt: -1 };
    if (sortKey === 'rating') return { averageRating: -1, createdAt: -1 };
    return { enrollmentCount: -1, averageRating: -1, createdAt: -1 };
}

function resolveCourseIdParam(req) {
    return String(req.params.courseId || req.body?.courseId || '').trim();
}

function parseAdminAllowlist() {
    const raw = String(process.env.ADMIN_WALLET_ALLOWLIST || '').trim();
    const list = raw
        .split(',')
        .map((v) => normalizeWallet(v))
        .filter(Boolean);
    if (list.length === 0) return ['demo-admin-wallet'];
    return list;
}

function resolveAdminWallet(req) {
    return normalizeWallet(
        req.headers['x-admin-wallet'] ||
        req.headers['x-wallet-address'] ||
        req.body?.adminWallet ||
        req.query?.adminWallet ||
        ''
    );
}

function isAdminWallet(wallet) {
    if (!wallet) return false;
    return parseAdminAllowlist().includes(normalizeWallet(wallet));
}

async function finalizeEnrollment(course, normalizedStudent, options = {}) {
    const existingEnrollment = course.enrollments.some((e) => e.studentAddress === normalizedStudent);
    if (existingEnrollment) {
        const existingReceipt = await CourseEnrollmentReceipt.findOne({
            courseId: course.courseId,
            studentAddress: normalizedStudent,
            status: 'issued'
        }).sort({ createdAt: -1 });
        return { alreadyEnrolled: true, receipt: existingReceipt };
    }

    if (course.maxStudents > 0 && course.enrollments.length >= course.maxStudents) {
        const error = new Error('Course is full');
        error.code = 'COURSE_FULL';
        throw error;
    }

    course.enrollments.push({ studentAddress: normalizedStudent, enrolledAt: new Date() });
    await course.save();

    const amount = Math.max(0, Number(course.pricing?.amount || 0));
    const currency = String(course.pricing?.currency || 'INDI').trim() || 'INDI';
    const receiptId = `rcpt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const receipt = await CourseEnrollmentReceipt.create({
        receiptId,
        courseId: course.courseId,
        studentAddress: normalizedStudent,
        amount,
        currency,
        status: 'issued',
        metadata: {
            courseTitle: course.title,
            pricingType: course.pricing?.type || 'free',
            paymentIntentId: options.paymentIntentId || ''
        }
    });

    if (options.paymentIntentId) {
        await CoursePaymentIntent.findOneAndUpdate(
            { intentId: options.paymentIntentId },
            { $set: { status: 'confirmed', confirmedAt: new Date(), receiptId } }
        );
    }

    return { alreadyEnrolled: false, receipt };
}

// ── Category Endpoints ────────────────────────────────────────────────────────
exports.getCategories = (req, res) => {
    return res.status(200).send({
        status: true,
        total: CATEGORY_DEFINITIONS.length,
        categories: CATEGORY_DEFINITIONS.map(c => ({
            id: c.id, name: c.name, icon: c.icon,
            description: c.description,
            subcategoryCount: c.subcategories.length, accessLevel: c.accessLevel || 'public', rateRange: c.subcategories[0]?.rateRange || null
        }))
    });
};

exports.getCategory = (req, res) => {
    const cat = CATEGORY_DEFINITIONS.find(c => c.id === req.params.categoryId);
    if (!cat) return res.status(404).send({ status: false, message: 'Category not found' });
    return res.status(200).send({ status: true, category: cat });
};

exports.getCategorySubcategories = (req, res) => {
    const cat = CATEGORY_DEFINITIONS.find(c => c.id === req.params.categoryId);
    if (!cat) return res.status(404).send({ status: false, message: 'Category not found' });
    return res.status(200).send({ status: true, categoryId: cat.id, subcategories: cat.subcategories });
};

// ── Course CRUD ───────────────────────────────────────────────────────────────
exports.createCourse = async (req, res) => {
    try {
        const {
            creatorAddress, title, description, language,
            category, categoryId, subcategory, modules,
            pricing, culturalContext, skillLevel,
            thumbnailUrl, previewVideoUrl, tags, prerequisites, estimatedDuration
        } = req.body;

        const actorWallet = resolveAuthenticatedWallet(req, 'creatorAddress');
        if (!actorWallet) {
            return res.status(401).send({ status: false, message: 'Wallet authentication required' });
        }

        if (!creatorAddress || !title || !description || !language || !category) {
            return res.status(400).send({ status: false, message: 'Missing required fields' });
        }
        if (normalizeWallet(creatorAddress) !== actorWallet) {
            return res.status(403).send({ status: false, message: 'Creator wallet mismatch' });
        }

        const courseId = 'course_' + Date.now();

        const course = await Course.create({
            courseId,
            creatorAddress: actorWallet,
            title, description, language,
            category, categoryId, subcategory,
            skillLevel: skillLevel || 'all_levels',
            culturalContext: culturalContext || {},
            modules: modules || [],
            pricing: pricing || { type: 'free', amount: 0, currency: 'INDI' },
            thumbnailUrl, previewVideoUrl,
            tags: tags || [],
            prerequisites: prerequisites || [],
            estimatedDuration: estimatedDuration || 0,
            status: 'draft'
        });

        return res.status(201).send({
            status: true,
            message: 'Course created successfully',
            course: { courseId: course.courseId, title: course.title, status: course.status }
        });
    } catch (error) {
        console.error('Create course error:', error);
        return res.status(500).send({ status: false, message: 'Failed to create course' });
    }
};

exports.getCourse = async (req, res) => {
    try {
        const course = await Course.findOne({ courseId: req.params.courseId });
        if (!course) return res.status(404).send({ status: false, message: 'Course not found' });
        if (course.status !== 'published') {
            const actorWallet = resolveAuthenticatedWallet(req);
            const adminWallet = resolveAdminWallet(req);
            const actorIsCreator = actorWallet && normalizeWallet(course.creatorAddress) === actorWallet;
            const actorIsAdmin = isAdminWallet(adminWallet) || isAdminWallet(actorWallet);
            if (!actorIsCreator && !actorIsAdmin) {
                return res.status(404).send({ status: false, message: 'Course not found' });
            }
        }
        return res.status(200).send({ status: true, course });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to get course' });
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const {
            categoryId,
            level,
            status = 'published',
            page = 1,
            limit = 24,
            search,
            sort = 'popular',
            minPrice,
            maxPrice,
            durationMinWeeks,
            durationMaxWeeks
        } = req.query;
        const requestedStatus = String(status || 'published').trim();
        const actorWallet = resolveAuthenticatedWallet(req);
        const adminWallet = resolveAdminWallet(req);
        const actorIsAdmin = isAdminWallet(adminWallet) || isAdminWallet(actorWallet);
        const filter = {};
        if (requestedStatus === 'published') {
            filter.status = 'published';
        } else {
            if (!actorWallet && !actorIsAdmin) {
                return res.status(403).send({ status: false, message: 'Non-published course visibility requires authentication' });
            }
            filter.status = requestedStatus;
            if (!actorIsAdmin) {
                filter.creatorAddress = actorWallet;
            }
        }
        if (categoryId) filter.categoryId = categoryId;
        if (level) filter.skillLevel = level;
        if (search) filter.$text = { $search: search };
        const minPriceNumber = parseNumber(minPrice);
        const maxPriceNumber = parseNumber(maxPrice);
        if (minPriceNumber !== null || maxPriceNumber !== null) {
            filter['pricing.amount'] = {};
            if (minPriceNumber !== null) filter['pricing.amount'].$gte = minPriceNumber;
            if (maxPriceNumber !== null) filter['pricing.amount'].$lte = maxPriceNumber;
        }

        const minWeeks = parseNumber(durationMinWeeks);
        const maxWeeks = parseNumber(durationMaxWeeks);
        if (minWeeks !== null || maxWeeks !== null) {
            const durationFilter = {};
            if (minWeeks !== null) durationFilter.$gte = Math.round(minWeeks * 60 * 4);
            if (maxWeeks !== null) durationFilter.$lte = Math.round(maxWeeks * 60 * 4);
            filter.estimatedDuration = durationFilter;
        }

        const pageNumber = Math.max(1, parseInt(page, 10) || 1);
        const limitNumber = Math.max(1, Math.min(60, parseInt(limit, 10) || 24));
        const pipeline = [
            { $match: filter },
            { $addFields: { enrollmentCount: { $size: { $ifNull: ['$enrollments', []] } } } },
            { $sort: buildCourseSort(sort) },
            { $skip: (pageNumber - 1) * limitNumber },
            { $limit: limitNumber },
            { $project: { enrollments: 0 } }
        ];

        const [courses, total] = await Promise.all([
            Course.aggregate(pipeline),
            Course.countDocuments(filter)
        ]);
        return res.status(200).send({ status: true, total, page: pageNumber, courses });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to get courses' });
    }
};

exports.getCoursesByCreator = async (req, res) => {
    try {
        const courses = await Course.find({ creatorAddress: req.params.address.toLowerCase() });
        return res.status(200).send({ status: true, count: courses.length, courses });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to get courses' });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const actorWallet = resolveAuthenticatedWallet(req, 'creatorAddress');
        if (!actorWallet) {
            return res.status(401).send({ status: false, message: 'Wallet authentication required' });
        }
        const existing = await Course.findOne({ courseId: req.params.courseId });
        if (!existing) return res.status(404).send({ status: false, message: 'Course not found' });
        if (normalizeWallet(existing.creatorAddress) !== actorWallet) {
            return res.status(403).send({ status: false, message: 'Only course creator can update this course' });
        }
        const course = await Course.findOneAndUpdate(
            { courseId: req.params.courseId },
            { $set: { ...req.body, creatorAddress: existing.creatorAddress } },
            { new: true }
        );
        if (!course) return res.status(404).send({ status: false, message: 'Course not found' });
        return res.status(200).send({ status: true, course });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to update course' });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const actorWallet = resolveAuthenticatedWallet(req);
        if (!actorWallet) {
            return res.status(401).send({ status: false, message: 'Wallet authentication required' });
        }
        const existing = await Course.findOne({ courseId: req.params.courseId });
        if (!existing) return res.status(404).send({ status: false, message: 'Course not found' });
        if (normalizeWallet(existing.creatorAddress) !== actorWallet) {
            return res.status(403).send({ status: false, message: 'Only course creator can delete this course' });
        }
        const course = await Course.findOneAndDelete({ courseId: req.params.courseId });
        if (!course) return res.status(404).send({ status: false, message: 'Course not found' });
        return res.status(200).send({ status: true, message: 'Course deleted' });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to delete course' });
    }
};

// ── Enrollment ────────────────────────────────────────────────────────────────
exports.enrollInCourse = async (req, res) => {
    try {
        const { courseId, studentAddress } = req.body;
        const actorWallet = resolveAuthenticatedWallet(req, 'studentAddress');
        if (!actorWallet) {
            return res.status(401).send({ status: false, message: 'Wallet authentication required' });
        }
        const normalizedStudent = normalizeWallet(studentAddress || actorWallet);
        if (!normalizedStudent) {
            return res.status(400).send({ status: false, message: 'Student wallet is required' });
        }
        const course = await Course.findOne({ courseId });
        if (!course) return res.status(404).send({ status: false, message: 'Course not found' });

        const amount = Math.max(0, Number(course.pricing?.amount || 0));
        const paymentIntentId = String(req.body?.paymentIntentId || '').trim();
        if (amount > 0) {
            if (!paymentIntentId) {
                return res.status(402).send({ status: false, message: 'Payment confirmation required for paid courses' });
            }
            const paymentIntent = await CoursePaymentIntent.findOne({
                intentId: paymentIntentId,
                courseId: course.courseId,
                studentAddress: normalizedStudent,
                status: 'confirmed'
            });
            if (!paymentIntent) {
                return res.status(402).send({ status: false, message: 'Valid confirmed payment intent is required' });
            }
        }
        const result = await finalizeEnrollment(course, normalizedStudent, {
            paymentIntentId: paymentIntentId || undefined
        });
        if (result.alreadyEnrolled) return res.status(400).send({ status: false, message: 'Already enrolled' });
        const receipt = result.receipt;

        return res.status(200).send({
            status: true,
            message: 'Enrolled successfully',
            receipt: {
                receiptId: receipt.receiptId,
                courseId: receipt.courseId,
                amount: receipt.amount,
                currency: receipt.currency,
                createdAt: receipt.createdAt
            }
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to enroll' });
    }
};

exports.completeModule = async (req, res) => {
    try {
        const { courseId, studentAddress, moduleId } = req.body;
        const actorWallet = resolveAuthenticatedWallet(req, 'studentAddress');
        if (!actorWallet) {
            return res.status(401).send({ status: false, message: 'Wallet authentication required' });
        }
        const normalizedStudent = normalizeWallet(studentAddress || actorWallet);
        const course = await Course.findOne({ courseId });
        if (!course) return res.status(404).send({ status: false, message: 'Course not found' });

        const enrollment = course.enrollments.find(e => e.studentAddress === normalizedStudent);
        if (!enrollment) return res.status(400).send({ status: false, message: 'Not enrolled' });

        if (!enrollment.progress.completedModules.includes(moduleId)) {
            enrollment.progress.completedModules.push(moduleId);
            enrollment.progress.percentComplete = Math.round(
                (enrollment.progress.completedModules.length / course.modules.length) * 100
            );
            enrollment.progress.lastAccessed = new Date();

            if (enrollment.progress.percentComplete === 100) {
                enrollment.completed = true;
                enrollment.completedAt = new Date();
            }
            await course.save();
        }

        return res.status(200).send({
            status: true,
            progress: enrollment.progress,
            completed: enrollment.completed
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to complete module' });
    }
};

exports.generateCertificate = async (req, res) => {
    try {
        const { courseId, studentAddress } = req.body;
        const actorWallet = resolveAuthenticatedWallet(req, 'studentAddress');
        if (!actorWallet) {
            return res.status(401).send({ status: false, message: 'Wallet authentication required' });
        }
        const normalizedStudent = normalizeWallet(studentAddress || actorWallet);
        const course = await Course.findOne({ courseId });
        if (!course) return res.status(404).send({ status: false, message: 'Course not found' });

        const enrollment = course.enrollments.find(e => e.studentAddress === normalizedStudent);
        if (!enrollment?.completed) return res.status(400).send({ status: false, message: 'Course not completed' });

        const certificateNftId = 'cert_' + Date.now() + '_' + normalizedStudent.slice(0, 8);
        enrollment.certificateNftId = certificateNftId;
        await course.save();

        return res.status(200).send({ status: true, certificateNftId, message: 'Certificate issued' });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to generate certificate' });
    }
};

exports.addRating = async (req, res) => {
    try {
        const { courseId, studentAddress, rating, review } = req.body;
        const actorWallet = resolveAuthenticatedWallet(req, 'studentAddress');
        if (!actorWallet) {
            return res.status(401).send({ status: false, message: 'Wallet authentication required' });
        }
        const normalizedStudent = normalizeWallet(studentAddress || actorWallet);
        if (!rating || rating < 1 || rating > 5) return res.status(400).send({ status: false, message: 'Rating must be 1-5' });

        const course = await Course.findOne({ courseId });
        if (!course) return res.status(404).send({ status: false, message: 'Course not found' });
        const enrollment = course.enrollments.find((e) => e.studentAddress === normalizedStudent);
        if (!enrollment) {
            return res.status(403).send({ status: false, message: 'Only enrolled learners can rate this course' });
        }
        const percentComplete = Number(enrollment.progress?.percentComplete || 0);
        if (percentComplete < MIN_PROGRESS_FOR_RATING) {
            return res.status(403).send({
                status: false,
                message: `Minimum ${MIN_PROGRESS_FOR_RATING}% progress required before rating`
            });
        }
        const verifiedCompletion = Boolean(enrollment.completed || percentComplete >= 100);

        const existingIdx = course.ratings.findIndex(r => r.studentAddress === normalizedStudent);
        if (existingIdx >= 0) {
            const previousTimestamp = new Date(course.ratings[existingIdx]?.timestamp || 0).getTime();
            if (REVIEW_MIN_INTERVAL_MS > 0 && previousTimestamp > 0 && Date.now() - previousTimestamp < REVIEW_MIN_INTERVAL_MS) {
                return res.status(429).send({
                    status: false,
                    message: 'Review update limit reached. Please wait before editing your review again.'
                });
            }
            course.ratings[existingIdx] = {
                studentAddress: normalizedStudent,
                rating,
                review,
                verifiedCompletion,
                timestamp: new Date()
            };
        } else {
            course.ratings.push({ studentAddress: normalizedStudent, rating, review, verifiedCompletion });
        }

        course.averageRating = course.ratings.reduce((sum, r) => sum + r.rating, 0) / course.ratings.length;
        await course.save();

        return res.status(200).send({ status: true, averageRating: course.averageRating });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to add rating' });
    }
};

// ── Discovery ─────────────────────────────────────────────────────────────────
exports.search = async (req, res) => {
    try {
        const { q, categoryId, level, sort = 'popular', minPrice, maxPrice, durationMinWeeks, durationMaxWeeks } = req.query;
        const filter = { status: 'published' };
        if (categoryId) filter.categoryId = categoryId;
        if (level) filter.skillLevel = level;
        if (q) filter.$text = { $search: q };
        const minPriceNumber = parseNumber(minPrice);
        const maxPriceNumber = parseNumber(maxPrice);
        if (minPriceNumber !== null || maxPriceNumber !== null) {
            filter['pricing.amount'] = {};
            if (minPriceNumber !== null) filter['pricing.amount'].$gte = minPriceNumber;
            if (maxPriceNumber !== null) filter['pricing.amount'].$lte = maxPriceNumber;
        }
        const minWeeks = parseNumber(durationMinWeeks);
        const maxWeeks = parseNumber(durationMaxWeeks);
        if (minWeeks !== null || maxWeeks !== null) {
            const durationFilter = {};
            if (minWeeks !== null) durationFilter.$gte = Math.round(minWeeks * 60 * 4);
            if (maxWeeks !== null) durationFilter.$lte = Math.round(maxWeeks * 60 * 4);
            filter.estimatedDuration = durationFilter;
        }
        const pipeline = [
            { $match: filter },
            { $addFields: { enrollmentCount: { $size: { $ifNull: ['$enrollments', []] } } } },
            { $sort: buildCourseSort(sort) },
            { $limit: 50 },
            { $project: { enrollments: 0 } }
        ];
        const courses = await Course.aggregate(pipeline);
        return res.status(200).send({ status: true, count: courses.length, courses });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Search failed' });
    }
};

exports.getFeaturedCourses = async (req, res) => {
    try {
        const courses = await Course.aggregate([
            { $match: { status: 'published' } },
            { $addFields: { enrollmentCount: { $size: { $ifNull: ['$enrollments', []] } } } },
            { $sort: { averageRating: -1, enrollmentCount: -1, createdAt: -1 } },
            { $limit: 12 },
            { $project: { enrollments: 0 } }
        ]);
        return res.status(200).send({ status: true, courses });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to get featured courses' });
    }
};

// ── Stats ─────────────────────────────────────────────────────────────────────
exports.getCategoryStats = async (req, res) => {
    try {
        const stats = await Course.aggregate([
            { $match: { status: 'published' } },
            { $group: { _id: '$categoryId', count: { $sum: 1 }, avgRating: { $avg: '$averageRating' } } },
            { $sort: { count: -1 } }
        ]);
        return res.status(200).send({ status: true, stats });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to get stats' });
    }
};

exports.getMarketplaceOverview = (req, res) => {
    return res.status(200).send({
        status: true,
        overview: {
            totalCategories: CATEGORY_DEFINITIONS.length,
            categories: CATEGORY_DEFINITIONS.map(c => ({ id: c.id, name: c.name, icon: c.icon, subcategoryCount: c.subcategories.length }))
        }
    });
};

exports.getRevenueProjections = (req, res) => {
    return res.status(200).send({ status: true, projections: REVENUE_PROJECTIONS });
};

exports.getPublicProfile = async (req, res) => {
    try {
        const address = normalizeWallet(req.params.address || req.query?.address || '');
        if (!address) {
            return res.status(400).send({ status: false, message: 'Address is required' });
        }
        const user = await Users.findOne({ WalletAddress: address })
            .select('WalletAddress UserName FirstName LastName PrifileUrl tribalAffiliation artistTier')
            .lean();
        if (!user) {
            return res.status(404).send({ status: false, message: 'Profile not found' });
        }
        const fullName = `${String(user.FirstName || '').trim()} ${String(user.LastName || '').trim()}`.trim();
        const displayName = String(user.UserName || '').trim() || fullName || `Member ${address.slice(-4).toUpperCase()}`;
        return res.status(200).send({
            status: true,
            profile: {
                walletAddress: address,
                displayName,
                avatarUrl: String(user.PrifileUrl || '').trim(),
                tribalAffiliation: String(user.tribalAffiliation || '').trim(),
                artistTier: String(user.artistTier || '').trim()
            }
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to fetch public profile' });
    }
};

exports.toggleWatchlist = async (req, res) => {
    try {
        const actorWallet = resolveAuthenticatedWallet(req, 'watcherAddress');
        if (!actorWallet) {
            return res.status(401).send({ status: false, message: 'Wallet authentication required' });
        }
        const courseId = resolveCourseIdParam(req);
        if (!courseId) return res.status(400).send({ status: false, message: 'courseId is required' });
        const course = await Course.findOne({ courseId });
        if (!course) return res.status(404).send({ status: false, message: 'Course not found' });

        const key = { courseId: course.courseId, watcherAddress: actorWallet };
        const existing = await CourseWatchlist.findOne(key);
        const willBeActive = !(existing && existing.active);
        await CourseWatchlist.findOneAndUpdate(
            key,
            { $set: { active: willBeActive } },
            { upsert: true, new: true }
        );
        return res.status(200).send({ status: true, message: 'Watchlist updated', data: { active: willBeActive } });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to update watchlist' });
    }
};

exports.shareCourse = async (req, res) => {
    try {
        const actorWallet = resolveAuthenticatedWallet(req, 'sharerAddress');
        if (!actorWallet) {
            return res.status(401).send({ status: false, message: 'Wallet authentication required' });
        }
        const courseId = resolveCourseIdParam(req);
        if (!courseId) return res.status(400).send({ status: false, message: 'courseId is required' });
        const course = await Course.findOne({ courseId });
        if (!course) return res.status(404).send({ status: false, message: 'Course not found' });

        const platform = String(req.body?.platform || 'native').trim() || 'native';
        const shareUrl = String(req.body?.shareUrl || `/courses/${course.courseId}`).trim() || `/courses/${course.courseId}`;
        await CourseShare.create({
            courseId: course.courseId,
            sharerAddress: actorWallet,
            platform,
            shareUrl
        });
        return res.status(200).send({ status: true, message: 'Share tracked', data: { shareUrl } });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to share course' });
    }
};

exports.reportCourse = async (req, res) => {
    try {
        const actorWallet = resolveAuthenticatedWallet(req, 'reporterAddress');
        if (!actorWallet) {
            return res.status(401).send({ status: false, message: 'Wallet authentication required' });
        }
        const courseId = resolveCourseIdParam(req);
        if (!courseId) return res.status(400).send({ status: false, message: 'courseId is required' });
        const course = await Course.findOne({ courseId });
        if (!course) return res.status(404).send({ status: false, message: 'Course not found' });

        const reason = String(req.body?.reason || '').trim();
        const details = String(req.body?.details || '').trim();
        if (!reason) return res.status(400).send({ status: false, message: 'reason is required' });

        const report = await CourseReport.create({
            courseId: course.courseId,
            reporterAddress: actorWallet,
            reason,
            details,
            status: 'open'
        });
        return res.status(200).send({
            status: true,
            message: 'Report submitted',
            data: { reportId: String(report._id), status: report.status }
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to submit report' });
    }
};

exports.getMyReceipts = async (req, res) => {
    try {
        const actorWallet = resolveAuthenticatedWallet(req);
        if (!actorWallet) {
            return res.status(401).send({ status: false, message: 'Wallet authentication required' });
        }
        const limit = Math.max(1, Math.min(100, parseInt(String(req.query?.limit || '50'), 10) || 50));
        const receipts = await CourseEnrollmentReceipt.find({ studentAddress: actorWallet })
            .sort({ createdAt: -1 })
            .limit(limit);
        return res.status(200).send({ status: true, count: receipts.length, receipts });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to load receipts' });
    }
};

exports.submitCourseForReview = async (req, res) => {
    try {
        const actorWallet = resolveAuthenticatedWallet(req, 'creatorAddress');
        if (!actorWallet) {
            return res.status(401).send({ status: false, message: 'Wallet authentication required' });
        }
        const courseId = resolveCourseIdParam(req);
        const course = await Course.findOne({ courseId });
        if (!course) return res.status(404).send({ status: false, message: 'Course not found' });
        if (normalizeWallet(course.creatorAddress) !== actorWallet) {
            return res.status(403).send({ status: false, message: 'Only course creator can submit for review' });
        }
        course.status = 'under_review';
        await course.save();
        return res.status(200).send({ status: true, message: 'Course submitted for review', courseId: course.courseId, workflowStatus: course.status });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to submit course for review' });
    }
};

exports.publishCourse = async (req, res) => {
    try {
        const actorWallet = resolveAuthenticatedWallet(req, 'creatorAddress');
        const adminWallet = resolveAdminWallet(req);
        const actorIsAdmin = isAdminWallet(adminWallet) || isAdminWallet(actorWallet);
        const courseId = resolveCourseIdParam(req);
        const course = await Course.findOne({ courseId });
        if (!course) return res.status(404).send({ status: false, message: 'Course not found' });
        const actorIsCreator = actorWallet && normalizeWallet(course.creatorAddress) === actorWallet;
        if (!actorIsCreator && !actorIsAdmin) {
            return res.status(403).send({ status: false, message: 'Creator or admin wallet required to publish' });
        }
        course.status = 'published';
        await course.save();
        return res.status(200).send({
            status: true,
            message: 'Course published',
            courseId: course.courseId,
            workflowStatus: course.status
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to publish course' });
    }
};

exports.createPaymentIntent = async (req, res) => {
    try {
        const actorWallet = resolveAuthenticatedWallet(req, 'studentAddress');
        if (!actorWallet) {
            return res.status(401).send({ status: false, message: 'Wallet authentication required' });
        }
        const courseId = resolveCourseIdParam(req);
        const course = await Course.findOne({ courseId });
        if (!course) return res.status(404).send({ status: false, message: 'Course not found' });
        const amount = Math.max(0, Number(course.pricing?.amount || 0));
        const currency = String(course.pricing?.currency || 'INDI').trim() || 'INDI';
        if (amount <= 0) {
            return res.status(400).send({ status: false, message: 'Course is free; payment intent is not required' });
        }

        const intentId = `cpay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const clientSecret = `cs_${Math.random().toString(36).slice(2)}${Date.now()}`;
        const expiresAt = new Date(Date.now() + PAYMENT_INTENT_TTL_MINUTES * 60 * 1000);
        const intent = await CoursePaymentIntent.create({
            intentId,
            courseId: course.courseId,
            studentAddress: actorWallet,
            amount,
            currency,
            clientSecret,
            status: 'requires_confirmation',
            expiresAt,
            metadata: {
                courseTitle: course.title
            }
        });
        return res.status(200).send({
            status: true,
            paymentIntent: {
                intentId: intent.intentId,
                clientSecret: intent.clientSecret,
                amount: intent.amount,
                currency: intent.currency,
                expiresAt: intent.expiresAt
            }
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to create payment intent' });
    }
};

exports.confirmPayment = async (req, res) => {
    try {
        const actorWallet = resolveAuthenticatedWallet(req, 'studentAddress');
        if (!actorWallet) {
            return res.status(401).send({ status: false, message: 'Wallet authentication required' });
        }
        const courseId = resolveCourseIdParam(req);
        const intentId = String(req.body?.intentId || '').trim();
        const clientSecret = String(req.body?.clientSecret || '').trim();
        if (!intentId || !clientSecret) {
            return res.status(400).send({ status: false, message: 'intentId and clientSecret are required' });
        }
        const course = await Course.findOne({ courseId });
        if (!course) return res.status(404).send({ status: false, message: 'Course not found' });

        const intent = await CoursePaymentIntent.findOne({
            intentId,
            courseId: course.courseId,
            studentAddress: actorWallet,
            status: 'requires_confirmation'
        });
        if (!intent) return res.status(404).send({ status: false, message: 'Payment intent not found' });
        if (String(intent.clientSecret) !== clientSecret) {
            return res.status(403).send({ status: false, message: 'Invalid payment confirmation secret' });
        }
        if (intent.expiresAt && intent.expiresAt.getTime() < Date.now()) {
            intent.status = 'expired';
            await intent.save();
            return res.status(400).send({ status: false, message: 'Payment intent expired' });
        }

        const result = await finalizeEnrollment(course, actorWallet, { paymentIntentId: intent.intentId });
        if (result.alreadyEnrolled) {
            return res.status(200).send({
                status: true,
                message: 'Already enrolled',
                receipt: result.receipt ? {
                    receiptId: result.receipt.receiptId,
                    courseId: result.receipt.courseId,
                    amount: result.receipt.amount,
                    currency: result.receipt.currency,
                    createdAt: result.receipt.createdAt
                } : null
            });
        }
        return res.status(200).send({
            status: true,
            message: 'Payment confirmed and enrollment finalized',
            receipt: {
                receiptId: result.receipt.receiptId,
                courseId: result.receipt.courseId,
                amount: result.receipt.amount,
                currency: result.receipt.currency,
                createdAt: result.receipt.createdAt
            }
        });
    } catch (error) {
        if (error?.code === 'COURSE_FULL') {
            return res.status(400).send({ status: false, message: 'Course is full' });
        }
        return res.status(500).send({ status: false, message: 'Failed to confirm payment' });
    }
};

exports.getMyEnrollments = async (req, res) => {
    try {
        const actorWallet = resolveAuthenticatedWallet(req);
        if (!actorWallet) {
            return res.status(401).send({ status: false, message: 'Wallet authentication required' });
        }
        const courses = await Course.find({
            enrollments: { $elemMatch: { studentAddress: actorWallet } }
        }).sort({ updatedAt: -1 });
        const mapped = courses.map((course) => {
            const enrollment = course.enrollments.find((e) => e.studentAddress === actorWallet);
            return {
                courseId: course.courseId,
                title: course.title,
                categoryId: course.categoryId,
                creatorAddress: course.creatorAddress,
                thumbnailUrl: course.thumbnailUrl || '',
                status: course.status,
                progress: enrollment?.progress || { completedModules: [], percentComplete: 0, resumePositionSec: 0 },
                completed: Boolean(enrollment?.completed),
                enrolledAt: enrollment?.enrolledAt || null,
                completedAt: enrollment?.completedAt || null,
                certificateNftId: enrollment?.certificateNftId || ''
            };
        });
        return res.status(200).send({ status: true, count: mapped.length, enrollments: mapped });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to load enrollments' });
    }
};

exports.getCourseProgress = async (req, res) => {
    try {
        const actorWallet = resolveAuthenticatedWallet(req);
        if (!actorWallet) {
            return res.status(401).send({ status: false, message: 'Wallet authentication required' });
        }
        const courseId = resolveCourseIdParam(req);
        const course = await Course.findOne({ courseId });
        if (!course) return res.status(404).send({ status: false, message: 'Course not found' });
        const enrollment = course.enrollments.find((e) => e.studentAddress === actorWallet);
        if (!enrollment) return res.status(404).send({ status: false, message: 'Enrollment not found' });
        return res.status(200).send({
            status: true,
            progress: enrollment.progress || { completedModules: [], percentComplete: 0, resumePositionSec: 0 },
            completed: Boolean(enrollment.completed)
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to load course progress' });
    }
};

exports.syncCourseProgress = async (req, res) => {
    try {
        const actorWallet = resolveAuthenticatedWallet(req, 'studentAddress');
        if (!actorWallet) {
            return res.status(401).send({ status: false, message: 'Wallet authentication required' });
        }
        const courseId = resolveCourseIdParam(req);
        const { currentLessonId, resumePositionSec, completedModuleId } = req.body || {};
        const course = await Course.findOne({ courseId });
        if (!course) return res.status(404).send({ status: false, message: 'Course not found' });
        const enrollment = course.enrollments.find((e) => e.studentAddress === actorWallet);
        if (!enrollment) return res.status(404).send({ status: false, message: 'Enrollment not found' });

        if (!enrollment.progress) enrollment.progress = { completedModules: [], percentComplete: 0 };
        if (typeof currentLessonId === 'string' && currentLessonId.trim()) {
            enrollment.progress.currentLessonId = currentLessonId.trim();
        }
        if (Number.isFinite(Number(resumePositionSec))) {
            enrollment.progress.resumePositionSec = Math.max(0, Number(resumePositionSec));
        }
        if (typeof completedModuleId === 'string' && completedModuleId.trim()) {
            const moduleId = completedModuleId.trim();
            if (!enrollment.progress.completedModules.includes(moduleId)) {
                enrollment.progress.completedModules.push(moduleId);
            }
        }
        enrollment.progress.lastAccessed = new Date();
        const totalModules = Math.max(1, Array.isArray(course.modules) ? course.modules.length : 1);
        enrollment.progress.percentComplete = Math.min(100, Math.round((enrollment.progress.completedModules.length / totalModules) * 100));
        if (enrollment.progress.percentComplete === 100) {
            enrollment.completed = true;
            enrollment.completedAt = new Date();
        }
        await course.save();
        return res.status(200).send({
            status: true,
            progress: enrollment.progress,
            completed: Boolean(enrollment.completed)
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to sync progress' });
    }
};
