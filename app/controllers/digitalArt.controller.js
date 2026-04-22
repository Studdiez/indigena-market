const { DigitalArtCreator, DigitalArtListing, DigitalArtEvent, SKILL_CATEGORIES } = require('../models/DigitalArt.model');

// =============================================
// DIGITAL ARTS CATEGORY DEFINITIONS
// =============================================

const CATEGORY_DEFINITIONS = [
  {
    id: 'digital_painting',
    name: 'Digital Painting & Illustration',
    icon: '🎨',
    description: 'Original artwork created using digital tools like Procreate, Photoshop, and tablets',
    subcategories: [
      { name: 'Digital Paintings', rateRange: { min: 100, max: 2000, unit: 'piece' }, targetClients: ['Private collectors', 'Galleries', 'Print-on-demand'] },
      { name: 'Commissioned Illustrations', rateRange: { min: 50, max: 500, unit: 'piece' }, targetClients: ['Authors', 'Publishers', 'Brands'] },
      { name: 'Custom Portraits', rateRange: { min: 150, max: 800, unit: 'piece' }, targetClients: ['Individuals', 'Families'] },
      { name: 'Children\'s Book Illustration', rateRange: { min: 500, max: 5000, unit: 'project' }, targetClients: ['Authors', 'Publishers'] },
      { name: 'Editorial Illustration', rateRange: { min: 200, max: 1000, unit: 'piece' }, targetClients: ['Publications', 'Online media'] },
      { name: 'Concept Art', rateRange: { min: 300, max: 2000, unit: 'piece' }, targetClients: ['Production companies', 'Studios'] },
      { name: 'Graphic Recording', rateRange: { min: 500, max: 2000, unit: 'day' }, targetClients: ['Conferences', 'Corporate events'] },
      { name: 'NFT Collections', rateRange: { min: 1000, max: 50000, unit: 'project' }, targetClients: ['Collectors', 'Crypto art platforms'] }
    ]
  },
  {
    id: '3d_modeling',
    name: '3D Modeling & Sculpture',
    icon: '🗿',
    description: '3D characters, environments, and digital sculptures for games, film, and VR',
    subcategories: [
      { name: '3D Character Modeling', rateRange: { min: 500, max: 5000, unit: 'piece' }, targetClients: ['Game studios', 'Film production'] },
      { name: 'Cultural Artifact Scanning', rateRange: { min: 200, max: 1000, unit: 'piece' }, targetClients: ['Museums', 'Cultural centers'] },
      { name: '3D Environment Design', rateRange: { min: 1000, max: 10000, unit: 'project' }, targetClients: ['Game developers', 'VR creators'] },
      { name: 'Digital Sculpture', rateRange: { min: 300, max: 3000, unit: 'piece' }, targetClients: ['Galleries', 'Collectors'] },
      { name: '3D Printable Art', rateRange: { min: 100, max: 1000, unit: 'piece' }, targetClients: ['Individuals', 'Manufacturers'] },
      { name: 'Metaverse Architecture', rateRange: { min: 2000, max: 20000, unit: 'project' }, targetClients: ['Metaverse platforms', 'Brands'] },
      { name: 'AR Filter/Effect Creation', rateRange: { min: 200, max: 1000, unit: 'piece' }, targetClients: ['Brands', 'Individuals'] }
    ]
  },
  {
    id: 'animation',
    name: 'Animation & Motion Graphics',
    icon: '🎬',
    description: '2D/3D animation, motion graphics, and visual storytelling',
    subcategories: [
      { name: '2D Animation', rateRange: { min: 1000, max: 10000, unit: 'minute' }, targetClients: ['Filmmakers', 'Educators', 'Brands'] },
      { name: '3D Animation', rateRange: { min: 2000, max: 20000, unit: 'minute' }, targetClients: ['Studios', 'Production companies'] },
      { name: 'Motion Graphics', rateRange: { min: 300, max: 2000, unit: 'project' }, targetClients: ['Brands', 'Content creators'] },
      { name: 'Stop Motion Animation', rateRange: { min: 1500, max: 15000, unit: 'project' }, targetClients: ['Filmmakers', 'Advertisers'] },
      { name: 'Whiteboard Animation', rateRange: { min: 500, max: 3000, unit: 'project' }, targetClients: ['Educators', 'Nonprofits'] },
      { name: 'Animated GIF Creation', rateRange: { min: 50, max: 500, unit: 'project' }, targetClients: ['Brands', 'Individuals'] },
      { name: 'Title Sequence Design', rateRange: { min: 2000, max: 10000, unit: 'project' }, targetClients: ['Production companies'] }
    ]
  },
  {
    id: 'film_video',
    name: 'Film, Video & Documentary',
    icon: '🎥',
    description: 'Documentary filmmaking, video production, and cinematography',
    subcategories: [
      { name: 'Documentary Filmmaking', rateRange: { min: 10000, max: 100000, unit: 'project' }, targetClients: ['Production companies', 'NGOs'] },
      { name: 'Short Film Production', rateRange: { min: 5000, max: 50000, unit: 'project' }, targetClients: ['Festivals', 'Online platforms'] },
      { name: 'Video Editing', rateRange: { min: 50, max: 200, unit: 'hour' }, targetClients: ['Filmmakers', 'Content creators'] },
      { name: 'Color Grading', rateRange: { min: 75, max: 250, unit: 'hour' }, targetClients: ['Post-production houses'] },
      { name: 'Sound Design', rateRange: { min: 50, max: 150, unit: 'hour' }, targetClients: ['Filmmakers', 'Podcasters'] },
      { name: 'Drone Cinematography', rateRange: { min: 200, max: 1000, unit: 'session' }, targetClients: ['Tourism', 'Real estate', 'Film'] },
      { name: 'Music Video Production', rateRange: { min: 2000, max: 20000, unit: 'project' }, targetClients: ['Musicians', 'Labels'] },
      { name: 'Archival Footage Restoration', rateRange: { min: 100, max: 500, unit: 'hour' }, targetClients: ['Archives', 'Families'] }
    ]
  },
  {
    id: 'photography',
    name: 'Photography & Digital Imaging',
    icon: '📷',
    description: 'Fine art photography, portraits, and digital image processing',
    subcategories: [
      { name: 'Fine Art Photography', rateRange: { min: 200, max: 2000, unit: 'piece' }, targetClients: ['Galleries', 'Collectors'] },
      { name: 'Portrait Photography', rateRange: { min: 150, max: 500, unit: 'session' }, targetClients: ['Individuals', 'Families', 'Brands'] },
      { name: 'Event Photography', rateRange: { min: 200, max: 1000, unit: 'session' }, targetClients: ['Organizations', 'Communities'] },
      { name: 'Product Photography', rateRange: { min: 50, max: 200, unit: 'piece' }, targetClients: ['Artists', 'Businesses'] },
      { name: 'Cultural Documentation', rateRange: { min: 300, max: 1000, unit: 'day' }, targetClients: ['Archives', 'Communities'] },
      { name: 'Photo Restoration', rateRange: { min: 50, max: 200, unit: 'piece' }, targetClients: ['Individuals', 'Archives'] },
      { name: 'Digital Compositing', rateRange: { min: 100, max: 500, unit: 'piece' }, targetClients: ['Advertising', 'Creative projects'] },
      { name: 'Stock Photography', rateRange: { min: 10, max: 100, unit: 'royalty' }, targetClients: ['Stock platforms', 'Brands'] }
    ]
  },
  {
    id: 'graphic_design',
    name: 'Graphic Design & Branding',
    icon: '✏️',
    description: 'Logo design, brand identity, print design, and packaging',
    subcategories: [
      { name: 'Logo Design', rateRange: { min: 300, max: 2000, unit: 'project' }, targetClients: ['Indigenous businesses', 'Organizations'] },
      { name: 'Brand Identity Packages', rateRange: { min: 1000, max: 10000, unit: 'project' }, targetClients: ['Companies', 'Organizations'] },
      { name: 'Print Design', rateRange: { min: 200, max: 2000, unit: 'project' }, targetClients: ['Businesses', 'Events'] },
      { name: 'Packaging Design', rateRange: { min: 500, max: 5000, unit: 'project' }, targetClients: ['Product companies'] },
      { name: 'Social Media Graphics', rateRange: { min: 50, max: 300, unit: 'piece' }, targetClients: ['Brands', 'Influencers'] },
      { name: 'Infographic Design', rateRange: { min: 300, max: 2000, unit: 'project' }, targetClients: ['NGOs', 'Researchers'] },
      { name: 'Presentation Design', rateRange: { min: 500, max: 3000, unit: 'project' }, targetClients: ['Consultants', 'Executives'] },
      { name: 'Environmental Graphics', rateRange: { min: 1000, max: 10000, unit: 'project' }, targetClients: ['Offices', 'Cultural centers'] }
    ]
  },
  {
    id: 'web_ux',
    name: 'Web & UX Design',
    icon: '🌐',
    description: 'Website design, e-commerce, UX/UI, and mobile app design',
    subcategories: [
      { name: 'Website Design', rateRange: { min: 2000, max: 20000, unit: 'project' }, targetClients: ['Artists', 'Organizations', 'Businesses'] },
      { name: 'E-commerce Design', rateRange: { min: 3000, max: 15000, unit: 'project' }, targetClients: ['Artists', 'Galleries'] },
      { name: 'UX/UI Design', rateRange: { min: 50, max: 150, unit: 'hour' }, targetClients: ['Tech companies', 'Startups'] },
      { name: 'Landing Page Design', rateRange: { min: 500, max: 3000, unit: 'project' }, targetClients: ['Marketing campaigns'] },
      { name: 'Email Newsletter Design', rateRange: { min: 300, max: 2000, unit: 'project' }, targetClients: ['Organizations', 'Brands'] },
      { name: 'Mobile App Design', rateRange: { min: 5000, max: 50000, unit: 'project' }, targetClients: ['App developers'] },
      { name: 'Interactive Storytelling', rateRange: { min: 5000, max: 30000, unit: 'project' }, targetClients: ['Museums', 'Educators'] }
    ]
  },
  {
    id: 'game_design',
    name: 'Game Design & Development',
    icon: '🎮',
    description: 'Game art, design, storytelling, and educational game development',
    subcategories: [
      { name: 'Game Art', rateRange: { min: 500, max: 5000, unit: 'piece' }, targetClients: ['Game studios'] },
      { name: 'Game Design', rateRange: { min: 50, max: 150, unit: 'hour' }, targetClients: ['Developers', 'Studios'] },
      { name: 'Indigenous Storytelling in Games', rateRange: { min: 75, max: 200, unit: 'hour' }, targetClients: ['Game companies'] },
      { name: 'Sound Design for Games', rateRange: { min: 50, max: 150, unit: 'hour' }, targetClients: ['Game developers'] },
      { name: 'Game Writing', rateRange: { min: 0.1, max: 1, unit: 'word' }, targetClients: ['Game studios'] },
      { name: 'Educational Game Development', rateRange: { min: 10000, max: 100000, unit: 'project' }, targetClients: ['Schools', 'Language programs'] },
      { name: 'VR/AR Game Experiences', rateRange: { min: 20000, max: 200000, unit: 'project' }, targetClients: ['VR studios', 'Brands'] }
    ]
  },
  {
    id: 'vr_ar',
    name: 'Virtual & Augmented Reality',
    icon: '🥽',
    description: 'VR experiences, AR apps, 360° video, and virtual gallery tours',
    subcategories: [
      { name: 'VR Experience Design', rateRange: { min: 10000, max: 100000, unit: 'project' }, targetClients: ['Museums', 'Tourism'] },
      { name: 'AR App Development', rateRange: { min: 5000, max: 50000, unit: 'project' }, targetClients: ['Brands', 'Educators'] },
      { name: '360° Video Production', rateRange: { min: 1000, max: 10000, unit: 'project' }, targetClients: ['Tourism', 'Real estate'] },
      { name: 'Virtual Gallery Tours', rateRange: { min: 2000, max: 20000, unit: 'project' }, targetClients: ['Galleries', 'Museums'] },
      { name: 'AR Art Placement', rateRange: { min: 500, max: 5000, unit: 'piece' }, targetClients: ['Collectors', 'Brands'] },
      { name: 'Cultural Site Reconstruction', rateRange: { min: 10000, max: 100000, unit: 'project' }, targetClients: ['Heritage organizations'] },
      { name: 'VR Training Simulations', rateRange: { min: 20000, max: 200000, unit: 'project' }, targetClients: ['Educational institutions'] }
    ]
  },
  {
    id: 'digital_fashion',
    name: 'Digital Fashion & Textile Design',
    icon: '👗',
    description: 'Digital textiles, virtual fashion, and cultural pattern licensing',
    subcategories: [
      { name: 'Digital Textile Design', rateRange: { min: 100, max: 1000, unit: 'piece' }, targetClients: ['Fashion brands', 'Textile companies'] },
      { name: 'Virtual Fashion Design', rateRange: { min: 200, max: 2000, unit: 'piece' }, targetClients: ['Metaverse platforms', 'Games'] },
      { name: '3D Garment Visualization', rateRange: { min: 150, max: 500, unit: 'piece' }, targetClients: ['Fashion brands'] },
      { name: 'Digital Print Design', rateRange: { min: 50, max: 500, unit: 'piece' }, targetClients: ['Print shops', 'POD platforms'] },
      { name: 'Fashion Illustration', rateRange: { min: 100, max: 500, unit: 'piece' }, targetClients: ['Designers', 'Brands'] },
      { name: 'Cultural Pattern Licensing', rateRange: { min: 500, max: 5000, unit: 'royalty' }, targetClients: ['Fashion houses', 'Manufacturers'] },
      { name: 'Digital Mood Boards', rateRange: { min: 200, max: 1000, unit: 'project' }, targetClients: ['Fashion designers'] }
    ]
  },
  {
    id: 'music_audio',
    name: 'Music & Audio Production',
    icon: '🎵',
    description: 'Music production, composition, sound healing, field recording, and podcast production',
    subcategories: [
      { name: 'Music Production', rateRange: { min: 50, max: 150, unit: 'hour' }, targetClients: ['Musicians', 'Labels'] },
      { name: 'Composition', rateRange: { min: 500, max: 10000, unit: 'project' }, targetClients: ['Media producers', 'Film', 'Games'] },
      { name: 'Sound Healing Recordings', rateRange: { min: 100, max: 1000, unit: 'track' }, targetClients: ['Wellness apps', 'Individuals'] },
      { name: 'Field Recording', rateRange: { min: 200, max: 1000, unit: 'day' }, targetClients: ['Researchers', 'Musicians'] },
      { name: 'Podcast Production', rateRange: { min: 100, max: 500, unit: 'episode' }, targetClients: ['Podcasters', 'Organizations'] },
      { name: 'Audio Storytelling', rateRange: { min: 500, max: 5000, unit: 'project' }, targetClients: ['Museums', 'Storytellers'] },
      { name: 'Traditional Music Digitization', rateRange: { min: 1000, max: 20000, unit: 'project' }, targetClients: ['Archives', 'Communities'] },
      { name: 'Beat Making', rateRange: { min: 50, max: 500, unit: 'piece' }, targetClients: ['Musicians', 'Content creators'] }
    ]
  },
  {
    id: 'digital_archive',
    name: 'Digital Archive & Preservation',
    icon: '🗄️',
    description: 'Digitization, metadata, oral history recording, and preservation consulting',
    subcategories: [
      { name: 'Digitization Services', rateRange: { min: 1, max: 10, unit: 'piece' }, targetClients: ['Archives', 'Families'] },
      { name: 'Metadata Creation', rateRange: { min: 30, max: 60, unit: 'hour' }, targetClients: ['Museums', 'Libraries'] },
      { name: 'Digital Asset Management', rateRange: { min: 40, max: 80, unit: 'hour' }, targetClients: ['Organizations', 'Communities'] },
      { name: 'Oral History Recording', rateRange: { min: 50, max: 100, unit: 'hour' }, targetClients: ['Communities', 'Researchers'] },
      { name: 'Archival Website Development', rateRange: { min: 10000, max: 50000, unit: 'project' }, targetClients: ['Museums', 'Cultural centers'] },
      { name: 'Preservation Consulting', rateRange: { min: 100, max: 200, unit: 'hour' }, targetClients: ['Institutions'] },
      { name: 'Language Documentation', rateRange: { min: 40, max: 80, unit: 'hour' }, targetClients: ['Language programs'] }
    ]
  },
  {
    id: 'nft_blockchain',
    name: 'NFT & Blockchain Art',
    icon: '⛓️',
    description: 'NFT creation, smart contracts, digital wampum, metaverse galleries, and DAO governance',
    subcategories: [
      { name: 'NFT Art Creation', rateRange: { min: 500, max: 10000, unit: 'piece' }, targetClients: ['Collectors', 'Platforms'] },
      { name: 'Collection Curation', rateRange: { min: 2000, max: 20000, unit: 'project' }, targetClients: ['Galleries', 'Platforms'] },
      { name: 'Smart Contract Development', rateRange: { min: 1000, max: 10000, unit: 'project' }, targetClients: ['Artists', 'Platforms'] },
      { name: 'Digital Wampum / Token Design', rateRange: { min: 2000, max: 20000, unit: 'project' }, targetClients: ['Communities', 'DAOs'] },
      { name: 'Provenance Documentation', rateRange: { min: 500, max: 5000, unit: 'project' }, targetClients: ['Communities', 'Museums'] },
      { name: 'Metaverse Gallery Curation', rateRange: { min: 1000, max: 10000, unit: 'project' }, targetClients: ['Artists', 'Galleries'] },
      { name: 'DAO Art Governance', rateRange: { min: 50, max: 150, unit: 'hour' }, targetClients: ['DAOs', 'Collectives'] }
    ]
  },
  {
    id: 'ai_generative',
    name: 'AI & Generative Art',
    icon: '🤖',
    description: 'AI art, generative programming, culturally-ethical AI training, and interactive installations',
    subcategories: [
      { name: 'AI Art Creation', rateRange: { min: 100, max: 1000, unit: 'piece' }, targetClients: ['Collectors', 'Brands'] },
      { name: 'Generative Art Programming', rateRange: { min: 1000, max: 10000, unit: 'project' }, targetClients: ['Galleries', 'Tech platforms'] },
      { name: 'AI Training with Cultural Data', rateRange: { min: 5000, max: 50000, unit: 'project' }, targetClients: ['Researchers', 'Institutions'] },
      { name: 'Prompt Engineering', rateRange: { min: 50, max: 200, unit: 'project' }, targetClients: ['Content creators'] },
      { name: 'Interactive AI Installations', rateRange: { min: 10000, max: 100000, unit: 'project' }, targetClients: ['Museums', 'Events'] },
      { name: 'Cultural AI Ethics Consulting', rateRange: { min: 150, max: 300, unit: 'hour' }, targetClients: ['Tech companies'] }
    ]
  },
  {
    id: 'educational_content',
    name: 'Educational Digital Content',
    icon: '🎓',
    description: 'Digital curriculum, interactive learning modules, educational video, and language apps',
    subcategories: [
      { name: 'Digital Curriculum Development', rateRange: { min: 40, max: 100, unit: 'hour' }, targetClients: ['Schools', 'Districts'] },
      { name: 'Interactive Learning Modules', rateRange: { min: 2000, max: 20000, unit: 'project' }, targetClients: ['EdTech companies'] },
      { name: 'Educational Video Production', rateRange: { min: 1000, max: 10000, unit: 'project' }, targetClients: ['Educators', 'Platforms'] },
      { name: 'Virtual Classroom Facilitation', rateRange: { min: 50, max: 150, unit: 'hour' }, targetClients: ['Students worldwide'] },
      { name: 'Digital Workshop Creation', rateRange: { min: 500, max: 5000, unit: 'project' }, targetClients: ['Lifelong learners'] },
      { name: 'Language Learning Apps', rateRange: { min: 10000, max: 100000, unit: 'project' }, targetClients: ['Language programs'] },
      { name: 'Elder Video Documentation', rateRange: { min: 300, max: 1000, unit: 'day' }, targetClients: ['Communities', 'Archives'] }
    ]
  },
  {
    id: 'social_media',
    name: 'Social Media & Content Creation',
    icon: '📱',
    description: 'Social media management, content creation, influencer partnerships, and live streaming',
    subcategories: [
      { name: 'Social Media Management', rateRange: { min: 30, max: 60, unit: 'hour' }, targetClients: ['Organizations', 'Artists'] },
      { name: 'Content Creation (Reels/TikTok)', rateRange: { min: 50, max: 300, unit: 'piece' }, targetClients: ['Brands', 'Artists'] },
      { name: 'Influencer Partnerships', rateRange: { min: 500, max: 5000, unit: 'project' }, targetClients: ['Brands'] },
      { name: 'Live Streaming', rateRange: { min: 100, max: 500, unit: 'session' }, targetClients: ['Platforms', 'Audiences'] },
      { name: 'Community Management', rateRange: { min: 25, max: 40, unit: 'hour' }, targetClients: ['Brands', 'Organizations'] },
      { name: 'Analytics & Reporting', rateRange: { min: 40, max: 80, unit: 'hour' }, targetClients: ['Organizations'] },
      { name: 'Content Strategy', rateRange: { min: 75, max: 150, unit: 'hour' }, targetClients: ['Brands', 'Organizations'] }
    ]
  },
  {
    id: 'licensing_ip',
    name: 'Licensing & IP Management',
    icon: '⚖️',
    description: 'Art licensing, IP rights consulting, licensing negotiations, and cultural protocol development',
    subcategories: [
      { name: 'Art Licensing', rateRange: { min: 500, max: 10000, unit: 'royalty' }, targetClients: ['Brands', 'Manufacturers'] },
      { name: 'IP Rights Consulting', rateRange: { min: 100, max: 250, unit: 'hour' }, targetClients: ['Artists', 'Communities'] },
      { name: 'Licensing Agreement Negotiation', rateRange: { min: 150, max: 300, unit: 'hour' }, targetClients: ['Artists', 'Galleries'] },
      { name: 'Digital Rights Management', rateRange: { min: 75, max: 150, unit: 'hour' }, targetClients: ['Organizations'] },
      { name: 'Cultural Protocol Development', rateRange: { min: 1000, max: 10000, unit: 'project' }, targetClients: ['Communities', 'Institutions'] },
      { name: 'Provenance Verification', rateRange: { min: 100, max: 500, unit: 'piece' }, targetClients: ['Collectors', 'Platforms'] }
    ]
  }
];

// =============================================
// CATEGORY CONTROLLERS
// =============================================

// Get all categories with subcategories
exports.getCategories = async (req, res) => {
  try {
    const categories = CATEGORY_DEFINITIONS.map(cat => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      description: cat.description,
      subcategoryCount: cat.subcategories.length
    }));

    res.status(200).json({
      success: true,
      data: categories,
      total: categories.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single category with full details
exports.getCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = CATEGORY_DEFINITIONS.find(c => c.id === categoryId);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Get stats from database
    const creatorCount = await DigitalArtCreator.countDocuments({
      'skillCategories.category': categoryId
    });
    const listingCount = await DigitalArtListing.countDocuments({
      category: categoryId,
      status: 'active'
    });

    res.status(200).json({
      success: true,
      data: {
        ...category,
        stats: {
          totalCreators: creatorCount,
          totalListings: listingCount
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get subcategories for a category
exports.getSubcategories = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = CATEGORY_DEFINITIONS.find(c => c.id === categoryId);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({
      success: true,
      data: category.subcategories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================
// CREATOR CONTROLLERS
// =============================================

// Create creator profile
exports.createCreator = async (req, res) => {
  try {
    const { walletAddress, profile, skillCategories } = req.body;

    let creator = await DigitalArtCreator.findOne({ walletAddress });
    if (creator) {
      return res.status(400).json({ success: false, message: 'Creator profile already exists' });
    }

    creator = new DigitalArtCreator({
      walletAddress,
      profile,
      skillCategories
    });

    await creator.save();

    res.status(201).json({
      success: true,
      data: creator
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get creator profile
exports.getCreator = async (req, res) => {
  try {
    const { address } = req.params;

    const creator = await DigitalArtCreator.findOne({ walletAddress: address });
    if (!creator) {
      return res.status(404).json({ success: false, message: 'Creator not found' });
    }

    res.status(200).json({
      success: true,
      data: creator
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all creators with filtering
exports.getAllCreators = async (req, res) => {
  try {
    const {
      category,
      subcategory,
      nation,
      minRating,
      verificationStatus,
      availability,
      page = 1,
      limit = 20,
      sort = 'createdAt',
      cursor
    } = req.query;

    const query = { isActive: true };

    if (category) query['skillCategories.category'] = category;
    if (subcategory) query['skillCategories.subcategories.name'] = subcategory;
    if (nation) query['profile.nation'] = nation;
    if (verificationStatus) query.verificationStatus = verificationStatus;
    if (availability) query['availability.status'] = availability;
    if (minRating) query['stats.averageRating'] = { $gte: parseFloat(minRating) };

    
    const fallbackSkip = (parseInt(page) - 1) * parseInt(limit);
    const cursorSkip = cursor ? parseInt(Buffer.from(String(cursor), 'base64').toString('utf8'), 10) : NaN;
    const skip = Number.isFinite(cursorSkip) ? cursorSkip : fallbackSkip;

    const creators = await DigitalArtCreator.find(query)
      .sort({ [sort]: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await DigitalArtCreator.countDocuments(query);

    res.status(200).json({
      success: true,
      data: creators,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
        nextCursor: skip + listings.length < total ? Buffer.from(String(skip + listings.length)).toString('base64') : null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update creator profile
exports.updateCreator = async (req, res) => {
  try {
    const { address } = req.params;
    const updates = req.body;

    const creator = await DigitalArtCreator.findOneAndUpdate(
      { walletAddress: address },
      { $set: updates },
      { new: true }
    );

    if (!creator) {
      return res.status(404).json({ success: false, message: 'Creator not found' });
    }

    res.status(200).json({
      success: true,
      data: creator
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add portfolio item
exports.addPortfolioItem = async (req, res) => {
  try {
    const { address } = req.params;
    const portfolioItem = req.body;

    const creator = await DigitalArtCreator.findOne({ walletAddress: address });
    if (!creator) {
      return res.status(404).json({ success: false, message: 'Creator not found' });
    }

    creator.portfolio.push(portfolioItem);
    await creator.save();

    res.status(201).json({
      success: true,
      data: creator.portfolio[creator.portfolio.length - 1]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================
// LISTING CONTROLLERS
// =============================================

// Create listing
exports.createListing = async (req, res) => {
  try {
    const listingData = req.body;

    const listing = new DigitalArtListing({
      listingId: `DA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...listingData,
      status: 'draft'
    });

    await listing.save();

    res.status(201).json({
      success: true,
      data: listing
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get listing
exports.getListing = async (req, res) => {
  try {
    const { listingId } = req.params;

    const listing = await DigitalArtListing.findOne({ listingId });
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    // Increment views
    listing.stats.views += 1;
    await listing.save();

    res.status(200).json({
      success: true,
      data: listing
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all listings with filtering
exports.getAllListings = async (req, res) => {
  try {
    const {
      category,
      subcategory,
      listingType,
      minPrice,
      maxPrice,
      nation,
      status = 'active',
      page = 1,
      limit = 24,
      sort = 'createdAt'
    } = req.query;

    const query = { status };

    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (listingType) query.listingType = listingType;
    if (nation) query['culturalMetadata.nation'] = nation;
    if (minPrice || maxPrice) {
      query['pricing.basePrice.amount'] = {};
      if (minPrice) query['pricing.basePrice.amount'].$gte = parseFloat(minPrice);
      if (maxPrice) query['pricing.basePrice.amount'].$lte = parseFloat(maxPrice);
    }

    const cursor = req.query.cursor;
    const fallbackSkip = (parseInt(page) - 1) * parseInt(limit);
    const cursorSkip = cursor ? parseInt(Buffer.from(String(cursor), 'base64').toString('utf8'), 10) : NaN;
    const skip = Number.isFinite(cursorSkip) ? cursorSkip : fallbackSkip;

    const listings = await DigitalArtListing.find(query)
      .sort({ [sort]: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await DigitalArtListing.countDocuments(query);

    res.status(200).json({
      success: true,
      data: listings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
        nextCursor: skip + listings.length < total ? Buffer.from(String(skip + listings.length)).toString('base64') : null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update listing
exports.updateListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const updates = req.body;

    const listing = await DigitalArtListing.findOneAndUpdate(
      { listingId },
      { $set: updates },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    res.status(200).json({
      success: true,
      data: listing
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete listing
exports.deleteListing = async (req, res) => {
  try {
    const { listingId } = req.params;

    const listing = await DigitalArtListing.findOneAndDelete({ listingId });

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================
// SEARCH & DISCOVERY
// =============================================

// Search listings and creators
exports.search = async (req, res) => {
  try {
    const { q, type = 'all', page = 1, limit = 20 } = req.query;

    const searchQuery = { $text: { $search: q } };
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const results = {};

    if (type === 'all' || type === 'listings') {
      results.listings = await DigitalArtListing.find({
        ...searchQuery,
        status: 'active'
      })
        .skip(skip)
        .limit(parseInt(limit));
      results.listingCount = await DigitalArtListing.countDocuments({
        ...searchQuery,
        status: 'active'
      });
    }

    if (type === 'all' || type === 'creators') {
      results.creators = await DigitalArtCreator.find({
        ...searchQuery,
        isActive: true
      })
        .skip(skip)
        .limit(parseInt(limit));
      results.creatorCount = await DigitalArtCreator.countDocuments({
        ...searchQuery,
        isActive: true
      });
    }

    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get featured listings
exports.getFeaturedListings = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const listings = await DigitalArtListing.find({
      status: 'active',
      $or: [
        { isFeatured: true, featuredUntil: { $gte: new Date() } },
        { 'verificationStatus': 'platinum' }
      ]
    })
      .sort({ 'stats.views': -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: listings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get trending listings
exports.getTrendingListings = async (req, res) => {
  try {
    const { category, limit = 10 } = req.query;

    const query = { status: 'active' };
    if (category) query.category = category;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const listings = await DigitalArtListing.find(query)
      .sort({
        'stats.views': -1,
        'stats.favorites': -1,
        'stats.sales': -1
      })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: listings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================
// STATS & ANALYTICS
// =============================================

// Get category statistics
exports.getCategoryStats = async (req, res) => {
  try {
    const stats = await Promise.all(
      CATEGORY_DEFINITIONS.map(async (cat) => {
        const creatorCount = await DigitalArtCreator.countDocuments({
          'skillCategories.category': cat.id
        });
        const listingCount = await DigitalArtListing.countDocuments({
          category: cat.id,
          status: 'active'
        });
        const salesData = await DigitalArtListing.aggregate([
          { $match: { category: cat.id } },
          { $group: { _id: null, totalSales: { $sum: '$stats.sales' }, totalRevenue: { $sum: '$stats.totalRevenue' } } }
        ]);

        return {
          id: cat.id,
          name: cat.name,
          icon: cat.icon,
          creatorCount,
          listingCount,
          totalSales: salesData[0]?.totalSales || 0,
          totalRevenue: salesData[0]?.totalRevenue || 0
        };
      })
    );

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get marketplace overview
exports.getMarketplaceOverview = async (req, res) => {
  try {
    const [
      totalCreators,
      totalListings,
      activeListings,
      verifiedCreators,
      totalSales,
      totalRevenue
    ] = await Promise.all([
      DigitalArtCreator.countDocuments({ isActive: true }),
      DigitalArtListing.countDocuments(),
      DigitalArtListing.countDocuments({ status: 'active' }),
      DigitalArtCreator.countDocuments({ verificationStatus: { $in: ['verified', 'elder_endorsed', 'platinum'] } }),
      DigitalArtListing.aggregate([
        { $group: { _id: null, total: { $sum: '$stats.sales' } } }
      ]),
      DigitalArtListing.aggregate([
        { $group: { _id: null, total: { $sum: '$stats.totalRevenue' } } }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCreators,
        totalListings,
        activeListings,
        verifiedCreators,
        totalSales: totalSales[0]?.total || 0,
        totalRevenue: totalRevenue[0]?.total || 0,
        categoryCount: CATEGORY_DEFINITIONS.length,
        subcategoryCount: CATEGORY_DEFINITIONS.reduce((acc, cat) => acc + cat.subcategories.length, 0)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================
// REVENUE PROJECTIONS
// =============================================

// Get Year 5 revenue projections for Digital Arts (17 categories)
exports.getRevenueProjections = async (req, res) => {
  try {
    const projections = {
      skillCategory: 'Digital Arts',
      totalCategories: 17,
      totalSubcategories: CATEGORY_DEFINITIONS.reduce((acc, cat) => acc + cat.subcategories.length, 0),
      year5Projections: {
        artists: 22000,
        avgAnnualEarnings: 9200,
        platformFee: 6,
        transactionRevenue: 12144000, // 22,000 * $9,200 * 0.06
        subscriptions: {
          creator:       { users: 10000, monthly: 9.99,  annual: 1198800 },
          professional:  { users: 5000,  monthly: 24.99, annual: 1499400 },
          studio:        { users: 800,   monthly: 49.99, annual: 479904  }
        },
        premiumPlacements: 620000,
        licensingRevenue:  450000
      },
      totalYear5Revenue: 16392104,
      categoryBreakdown: [
        { id: 'digital_painting',    name: 'Digital Painting & Illustration',   artists: 4500,  avgEarnings: 8000,  platformRevenue: 2160000 },
        { id: '3d_modeling',         name: '3D Modeling & Sculpture',           artists: 1500,  avgEarnings: 12000, platformRevenue: 1080000 },
        { id: 'animation',           name: 'Animation & Motion Graphics',       artists: 1200,  avgEarnings: 15000, platformRevenue: 1080000 },
        { id: 'film_video',          name: 'Film, Video & Documentary',         artists: 800,   avgEarnings: 10000, platformRevenue: 480000  },
        { id: 'photography',         name: 'Photography & Digital Imaging',     artists: 2000,  avgEarnings: 7000,  platformRevenue: 840000  },
        { id: 'graphic_design',      name: 'Graphic Design & Branding',        artists: 3000,  avgEarnings: 8500,  platformRevenue: 1530000 },
        { id: 'web_ux',              name: 'Web & UX Design',                  artists: 1500,  avgEarnings: 12000, platformRevenue: 1080000 },
        { id: 'game_design',         name: 'Game Design & Development',        artists: 600,   avgEarnings: 20000, platformRevenue: 720000  },
        { id: 'vr_ar',               name: 'Virtual & Augmented Reality',      artists: 400,   avgEarnings: 25000, platformRevenue: 600000  },
        { id: 'digital_fashion',     name: 'Digital Fashion & Textile Design', artists: 500,   avgEarnings: 9000,  platformRevenue: 270000  },
        { id: 'music_audio',         name: 'Music & Audio Production',         artists: 1200,  avgEarnings: 7000,  platformRevenue: 504000  },
        { id: 'digital_archive',     name: 'Digital Archive & Preservation',   artists: 800,   avgEarnings: 6000,  platformRevenue: 288000  },
        { id: 'nft_blockchain',      name: 'NFT & Blockchain Art',             artists: 1000,  avgEarnings: 18000, platformRevenue: 1080000 },
        { id: 'ai_generative',       name: 'AI & Generative Art',              artists: 500,   avgEarnings: 15000, platformRevenue: 450000  },
        { id: 'educational_content', name: 'Educational Digital Content',      artists: 1200,  avgEarnings: 8000,  platformRevenue: 576000  },
        { id: 'social_media',        name: 'Social Media & Content Creation',  artists: 800,   avgEarnings: 5000,  platformRevenue: 240000  },
        { id: 'licensing_ip',        name: 'Licensing & IP Management',        artists: 300,   avgEarnings: 12000, platformRevenue: 216000  }
      ],
      revenueStreams: {
        transactionFees:    { label: 'Transaction Fees (6%)',       year5: 12144000 },
        subscriptions:      { label: 'Creator Subscriptions',       year5: 3178104  },
        premiumPlacements:  { label: 'Sponsored / Featured Slots',  year5: 620000   },
        licensingRevenue:   { label: 'Platform Licensing Revenue',  year5: 450000   }
      }
    };

    res.status(200).json({
      success: true,
      data: projections
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.buyListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { buyerAddress = 'demo-wallet' } = req.body || {};

    const listing = await DigitalArtListing.findOneAndUpdate(
      { listingId, status: 'active' },
      {
        $inc: { 'stats.sales': 1 },
        $set: { status: 'sold' },
        $push: { 'marketplaceEvents.watchers': { walletAddress: buyerAddress, createdAt: new Date() } }
      },
      { new: true }
    );

    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });

    res.status(200).json({ success: true, data: listing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.bidOnListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { bidderAddress = 'demo-wallet', amount } = req.body || {};
    if (!amount || Number(amount) <= 0) return res.status(400).json({ success: false, message: 'Invalid bid amount' });

    const listing = await DigitalArtListing.findOneAndUpdate(
      { listingId, status: 'active' },
      {
        $set: { 'pricing.startingBid': Number(amount), listingType: 'auction' },
        $push: { 'marketplaceEvents.bids': { bidderAddress, amount: Number(amount), createdAt: new Date() } }
      },
      { new: true }
    );

    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    res.status(200).json({ success: true, data: listing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.makeOffer = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { buyerAddress = 'demo-wallet', amount, message = '' } = req.body || {};
    if (!amount || Number(amount) <= 0) return res.status(400).json({ success: false, message: 'Invalid offer amount' });

    const listing = await DigitalArtListing.findOneAndUpdate(
      { listingId, status: 'active' },
      { $push: { 'marketplaceEvents.offers': { buyerAddress, amount: Number(amount), message, createdAt: new Date() } } },
      { new: true }
    );

    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    res.status(200).json({ success: true, data: listing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleWatchlist = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { watcherAddress = 'demo-wallet' } = req.body || {};

    const listing = await DigitalArtListing.findOne({ listingId, status: 'active' });
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });

    const watchers = listing.marketplaceEvents?.watchers || [];
    const exists = watchers.some((w) => w.walletAddress === watcherAddress);

    const update = exists
      ? { $pull: { 'marketplaceEvents.watchers': { walletAddress: watcherAddress } }, $inc: { 'stats.favorites': -1 } }
      : { $push: { 'marketplaceEvents.watchers': { walletAddress: watcherAddress, createdAt: new Date() } }, $inc: { 'stats.favorites': 1 } };

    const updated = await DigitalArtListing.findOneAndUpdate({ listingId }, update, { new: true });
    res.status(200).json({ success: true, data: updated, watching: !exists });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.shareListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { platform = 'link' } = req.body || {};
    const listing = await DigitalArtListing.findOneAndUpdate(
      { listingId, status: 'active' },
      { $push: { 'marketplaceEvents.shares': { platform, createdAt: new Date() } } },
      { new: true }
    );
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    res.status(200).json({ success: true, data: listing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.reportListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { reason = 'policy', details = '' } = req.body || {};

    const listing = await DigitalArtListing.findOneAndUpdate(
      { listingId },
      {
        $push: {
          'marketplaceEvents.reports': { reason, details, createdAt: new Date() },
          moderationQueue: { submittedBy: 'system', reason, notes: details, status: 'open', submittedAt: new Date() }
        },
        $set: { 'compliance.moderationStatus': 'pending' }
      },
      { new: true }
    );

    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    res.status(200).json({ success: true, data: listing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.submitModeration = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { submittedBy = 'moderator', reason = 'manual_review', notes = '' } = req.body || {};

    const listing = await DigitalArtListing.findOneAndUpdate(
      { listingId },
      {
        $push: { moderationQueue: { submittedBy, reason, notes, status: 'open', submittedAt: new Date() } },
        $set: { 'compliance.moderationStatus': 'pending' }
      },
      { new: true }
    );

    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    res.status(200).json({ success: true, data: listing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getModerationQueue = async (req, res) => {
  try {
    const queue = await DigitalArtListing.find({ 'compliance.moderationStatus': 'pending' })
      .select('listingId title creatorAddress compliance moderationQueue')
      .sort({ updatedAt: -1 })
      .limit(200);

    res.status(200).json({ success: true, data: queue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.decideModeration = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { decision, note = '' } = req.body || {};
    if (!['approved', 'rejected'].includes(decision)) return res.status(400).json({ success: false, message: 'Invalid decision' });

    const listing = await DigitalArtListing.findOneAndUpdate(
      { listingId },
      {
        $set: { 'compliance.moderationStatus': decision },
        $push: { moderationQueue: { submittedBy: 'moderator', reason: decision, notes: note, status: decision, reviewedAt: new Date() } }
      },
      { new: true }
    );

    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    res.status(200).json({ success: true, data: listing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyCreatorRequest = async (req, res) => {
  try {
    const { address } = req.params;
    const creator = await DigitalArtCreator.findOneAndUpdate(
      { walletAddress: address },
      { $set: { verificationStatus: 'pending' } },
      { new: true }
    );
    if (!creator) return res.status(404).json({ success: false, message: 'Creator not found' });
    res.status(200).json({ success: true, data: creator });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyCreatorDecision = async (req, res) => {
  try {
    const { address } = req.params;
    const { decision } = req.body || {};
    if (!['verified', 'rejected'].includes(decision)) return res.status(400).json({ success: false, message: 'Invalid decision' });

    const creator = await DigitalArtCreator.findOneAndUpdate(
      { walletAddress: address },
      { $set: { verificationStatus: decision } },
      { new: true }
    );

    if (!creator) return res.status(404).json({ success: false, message: 'Creator not found' });
    await DigitalArtListing.updateMany({ creatorAddress: address }, { $set: { 'compliance.creatorVerificationStatus': decision } });

    res.status(200).json({ success: true, data: creator });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.trackEvent = async (req, res) => {
  try {
    const payload = req.body || {};
    const doc = await DigitalArtEvent.create({
      event: payload.event || 'unknown',
      listingId: payload.listingId,
      category: payload.category,
      metadata: payload.metadata || {}
    });
    res.status(200).json({ success: true, data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDemandHeatmap = async (req, res) => {
  try {
    const listingAgg = await DigitalArtListing.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$category',
          listings: { $sum: 1 },
          views: { $sum: '$stats.views' },
          favorites: { $sum: '$stats.favorites' },
          sales: { $sum: '$stats.sales' }
        }
      },
      { $sort: { views: -1 } }
    ]);

    res.status(200).json({ success: true, data: listingAgg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
