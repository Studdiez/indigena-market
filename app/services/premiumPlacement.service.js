/**
 * Premium Placement Service
 * Manages featured listings, homepage placements, and promotional spots
 */

const { v4: uuidv4 } = require('uuid');

class PremiumPlacementService {
  constructor() {
    this.placements = new Map();
    this.activePlacements = new Map();
    this.placementTypes = new Map();
    this.initializePlacementTypes();
  }

  initializePlacementTypes() {
    // Homepage Placements
    this.placementTypes.set('homepage_hero', {
      id: 'homepage_hero',
      name: 'Hero Section',
      price: 500,
      period: 'weekly',
      description: 'Featured in main hero carousel',
      maxSlots: 5,
      priority: 1
    });

    this.placementTypes.set('homepage_collections', {
      id: 'homepage_collections',
      name: 'Featured Collections',
      price: 300,
      period: 'weekly',
      description: 'Featured collections carousel',
      maxSlots: 8,
      priority: 2
    });

    this.placementTypes.set('homepage_artist_spotlight', {
      id: 'homepage_artist_spotlight',
      name: 'Artist Spotlight',
      price: 400,
      period: 'weekly',
      description: 'Dedicated artist feature section',
      maxSlots: 3,
      priority: 2
    });

    this.placementTypes.set('homepage_auctions', {
      id: 'homepage_auctions',
      name: 'Live Auctions',
      price: 200,
      period: 'weekly',
      description: 'Featured in live auctions section',
      maxSlots: 6,
      priority: 3
    });

    this.placementTypes.set('homepage_events', {
      id: 'homepage_events',
      name: 'Event Promotion',
      price: 150,
      period: 'weekly',
      description: 'Featured in events section',
      maxSlots: 4,
      priority: 3
    });

    this.placementTypes.set('homepage_sticky_banner', {
      id: 'homepage_sticky_banner',
      name: 'Sticky Banner',
      price: 100,
      period: 'weekly',
      description: 'Top sticky banner rotation',
      maxSlots: 10,
      priority: 4
    });

    this.placementTypes.set('homepage_newsletter', {
      id: 'homepage_newsletter',
      name: 'Newsletter Partner',
      price: 250,
      period: 'monthly',
      description: 'Featured in monthly newsletter',
      maxSlots: 5,
      priority: 2
    });

    // Pillar-Specific Featured Listings
    this.placementTypes.set('pillar_featured_digital_arts', {
      id: 'pillar_featured_digital_arts',
      name: 'Digital Arts Featured',
      price: 50,
      period: 'weekly',
      description: 'Featured in Digital Arts marketplace',
      pillar: 'digital_arts',
      maxSlots: 12,
      priority: 3
    });

    this.placementTypes.set('pillar_featured_courses', {
      id: 'pillar_featured_courses',
      name: 'Courses Featured',
      price: 40,
      period: 'weekly',
      description: 'Featured in Courses marketplace',
      pillar: 'courses',
      maxSlots: 10,
      priority: 3
    });

    this.placementTypes.set('pillar_featured_physical', {
      id: 'pillar_featured_physical',
      name: 'Physical Items Featured',
      price: 35,
      period: 'weekly',
      description: 'Featured in Physical Items marketplace',
      pillar: 'physical_items',
      maxSlots: 10,
      priority: 3
    });

    this.placementTypes.set('pillar_featured_freelancing', {
      id: 'pillar_featured_freelancing',
      name: 'Freelancing Featured',
      price: 40,
      period: 'weekly',
      description: 'Featured in Freelancing marketplace',
      pillar: 'freelancing',
      maxSlots: 8,
      priority: 3
    });

    this.placementTypes.set('pillar_featured_tourism', {
      id: 'pillar_featured_tourism',
      name: 'Tourism Featured',
      price: 60,
      period: 'weekly',
      description: 'Featured in Cultural Tourism marketplace',
      pillar: 'cultural_tourism',
      maxSlots: 6,
      priority: 3
    });

    // Search & Discovery
    this.placementTypes.set('search_promoted', {
      id: 'search_promoted',
      name: 'Promoted Search Result',
      price: 25,
      period: 'weekly',
      description: 'Priority placement in search results',
      maxSlots: 20,
      priority: 4
    });

    this.placementTypes.set('category_featured', {
      id: 'category_featured',
      name: 'Category Featured',
      price: 30,
      period: 'weekly',
      description: 'Featured in category browse',
      maxSlots: 15,
      priority: 4
    });

    // ===== DIGITAL ARTS MARKETPLACE - NEW PLACEMENTS =====

    this.placementTypes.set('da_hero_banner', {
      id: 'da_hero_banner',
      name: 'Digital Arts Hero Banner',
      price: 200,
      period: 'weekly',
      description: 'Full-width hero banner directly below the Wallet bar â€” the first thing every visitor sees on the Digital Arts marketplace',
      pillar: 'digital_arts',
      page: 'digital_arts_marketplace',
      section: 'hero_banner',
      position: 1,
      maxSlots: 1,
      priority: 1,
      badge: 'Hero Banner Â· Sponsored'
    });

    this.placementTypes.set('da_trending_boost', {
      id: 'da_trending_boost',
      name: 'Trending Collections #1 Boost',
      price: 150,
      period: 'weekly',
      description: 'Pin your collection at the #1 spot in Trending Collections (full-width feature card)',
      pillar: 'digital_arts',
      page: 'digital_arts_marketplace',
      section: 'trending_collections',
      position: 1,
      maxSlots: 1,
      priority: 1,
      badge: '#1 Featured Â· Sponsored'
    });

    this.placementTypes.set('da_sponsored_grid', {
      id: 'da_sponsored_grid',
      name: 'Sponsored Grid Card',
      price: 100,
      period: 'weekly',
      description: 'Native sponsored artwork card injected every 8 items in the main Digital Arts explore grid',
      pillar: 'digital_arts',
      page: 'digital_arts_marketplace',
      section: 'explore_grid',
      position: 'every_8',
      maxSlots: 3,
      priority: 2,
      badge: 'Sponsored'
    });

    this.placementTypes.set('da_new_arrivals_pin', {
      id: 'da_new_arrivals_pin',
      name: 'New Arrivals Pinned Card',
      price: 75,
      period: 'weekly',
      description: 'Full-width pinned artwork banner above the Explore Digital Arts grid',
      pillar: 'digital_arts',
      page: 'digital_arts_marketplace',
      section: 'new_arrivals',
      position: 1,
      maxSlots: 1,
      priority: 2,
      badge: 'Pinned Â· Sponsored'
    });

    this.placementTypes.set('da_collection_launch', {
      id: 'da_collection_launch',
      name: 'Collection Launch Badge',
      price: 50,
      period: 'per_launch',
      durationDays: 7,
      description: 'Dismissable New Collection launch banner with live countdown shown after Limited Drops (7-day badge)',
      pillar: 'digital_arts',
      page: 'digital_arts_marketplace',
      section: 'collection_launch',
      maxSlots: 2,
      priority: 3,
      badge: 'New Collection Launch Â· Sponsored'
    });

    this.placementTypes.set('da_artist_spotlight', {
      id: 'da_artist_spotlight',
      name: 'Digital Arts Artist Spotlight',
      price: 120,
      period: 'weekly',
      description: 'Featured artist profile card with cover image, avatar, bio, stats, and 3 featured artworks',
      pillar: 'digital_arts',
      page: 'digital_arts_marketplace',
      section: 'artist_spotlight',
      maxSlots: 1,
      priority: 1,
      badge: 'â­ Artist Spotlight Â· Sponsored'
    });

    // ===== COURSES MARKETPLACE - NEW PLACEMENTS =====

    this.placementTypes.set('courses_promoted_card', {
      id: 'courses_promoted_card',
      name: 'Promoted Course Card',
      price: 75,
      period: 'weekly',
      description: 'Sponsored course card placed at the top of the Courses marketplace grid',
      pillar: 'courses',
      page: 'courses_marketplace',
      section: 'course_grid',
      maxSlots: 3,
      priority: 2,
      badge: 'Sponsored'
    });

    this.placementTypes.set('courses_category_featured', {
      id: 'courses_category_featured',
      name: 'Category Featured Course',
      price: 150,
      period: 'weekly',
      description: 'Pin your course as the featured listing in a specific category',
      pillar: 'courses',
      page: 'courses_marketplace',
      section: 'category_page',
      maxSlots: 1,
      priority: 1,
      badge: 'Featured in Category'
    });

    this.placementTypes.set('courses_sidebar_ad', {
      id: 'courses_sidebar_ad',
      name: 'Course Sidebar Ad',
      price: 100,
      period: 'weekly',
      description: 'Banner ad in the sidebar on course detail pages',
      pillar: 'courses',
      page: 'course_detail',
      section: 'sidebar',
      maxSlots: 2,
      priority: 3,
      badge: 'Sponsored'
    });

    this.placementTypes.set('courses_instructor_spotlight', {
      id: 'courses_instructor_spotlight',
      name: 'Instructor Spotlight',
      price: 300,
      period: 'weekly',
      description: 'Featured instructor profile card with bio, rating, and top courses (200-400 INDI/week tier)',
      pillar: 'courses',
      page: 'courses_marketplace',
      section: 'instructor_spotlight',
      maxSlots: 1,
      priority: 1,
      badge: 'Featured Instructor Â· Sponsored'
    });

    this.placementTypes.set('courses_search_promoted', {
      id: 'courses_search_promoted',
      name: 'Search Promoted Course',
      price: 75,
      period: 'weekly',
      description: 'Course appears first in search results for selected keywords',
      pillar: 'courses',
      page: 'courses_search',
      section: 'search_results',
      maxSlots: 3,
      priority: 2,
      badge: 'Sponsored'
    });

    this.placementTypes.set('courses_bundle_promo', {
      id: 'courses_bundle_promo',
      name: 'Featured Bundle Promotion',
      price: 250,
      period: 'weekly',
      description: 'Feature a course bundle in a dedicated promoted bundle section',
      pillar: 'courses',
      page: 'courses_marketplace',
      section: 'featured_bundles',
      maxSlots: 2,
      priority: 2,
      badge: 'Featured Bundle Â· Sponsored'
    });

    // ===== TRENDING PAGE =====

    this.placementTypes.set('trending_pinned_item', {
      id: 'trending_pinned_item',
      name: 'Trending Page Pinned Item',
      price: 120,
      period: 'weekly',
      description: 'Pin your artwork/collection at the top of the Trending page across all categories',
      page: 'trending',
      section: 'trending_grid',
      position: 1,
      maxSlots: 2,
      priority: 1,
      badge: 'ðŸ”¥ Trending Â· Sponsored'
    });

    this.placementTypes.set('trending_category_boost', {
      id: 'trending_category_boost',
      name: 'Trending Category Boost',
      price: 80,
      period: 'weekly',
      description: 'Appear #1 in a specific trending category filter (e.g. Art, Music, Culture)',
      page: 'trending',
      section: 'category_tabs',
      maxSlots: 3,
      priority: 2,
      badge: 'Boosted Â· Sponsored'
    });

    this.placementTypes.set('trending_banner_strip', {
      id: 'trending_banner_strip',
      name: 'Trending Page Banner Strip',
      price: 60,
      period: 'weekly',
      description: 'Horizontal banner strip shown at the top of the Trending page',
      page: 'trending',
      section: 'banner_strip',
      maxSlots: 1,
      priority: 2,
      badge: 'Sponsored'
    });

    // ===== COMMUNITY PAGE =====

    this.placementTypes.set('community_featured_event', {
      id: 'community_featured_event',
      name: 'Featured Community Event',
      price: 100,
      period: 'per_event',
      description: 'Pin your event at the top of the Community Events section with a Featured label',
      page: 'community',
      section: 'events',
      maxSlots: 2,
      priority: 1,
      badge: 'â­ Featured Event Â· Sponsored'
    });

    this.placementTypes.set('community_story_spotlight', {
      id: 'community_story_spotlight',
      name: 'Community Story Spotlight',
      price: 80,
      period: 'weekly',
      description: 'Feature a story or cultural content in the Community Story Spotlight section',
      page: 'community',
      section: 'story_spotlight',
      maxSlots: 1,
      priority: 2,
      badge: 'Spotlight Â· Sponsored'
    });

    this.placementTypes.set('community_forum_pinned', {
      id: 'community_forum_pinned',
      name: 'Pinned Forum Topic',
      price: 50,
      period: 'weekly',
      description: 'Keep a forum topic pinned at the top of the Community Forum for the week',
      page: 'community',
      section: 'forums',
      maxSlots: 2,
      priority: 3,
      badge: 'Pinned Â· Sponsored'
    });

    this.placementTypes.set('community_sidebar_banner', {
      id: 'community_sidebar_banner',
      name: 'Community Sidebar Banner',
      price: 40,
      period: 'weekly',
      description: 'Small sponsored banner in the Community page sidebar or sticky panel',
      page: 'community',
      section: 'sidebar',
      maxSlots: 3,
      priority: 4,
      badge: 'Sponsored'
    });

    // ===== CULTURAL TOURISM MARKETPLACE =====
    this.placementTypes.set('tour_hero_banner', {
      id: 'tour_hero_banner',
      name: 'Tourism Hero Banner',
      price: 300,
      period: 'weekly',
      description: 'Top hero banner placement on Cultural Tourism marketplace',
      pillar: 'cultural_tourism',
      page: 'cultural_tourism_marketplace',
      section: 'hero_banner',
      position: 1,
      maxSlots: 1,
      priority: 1,
      badge: 'Hero Banner · Sponsored',
      creativeDefaults: {
        headline: 'Experience Native Culture',
        subheadline: 'Guided Tours and Workshops',
        cta: 'Book Experience',
        image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&h=700&fit=crop'
      }
    });

    this.placementTypes.set('tour_operator_spotlight', {
      id: 'tour_operator_spotlight',
      name: 'Operator Spotlight',
      price: 250,
      period: 'weekly',
      description: 'Featured operator spotlight strip with direct booking CTA',
      pillar: 'cultural_tourism',
      page: 'cultural_tourism_marketplace',
      section: 'operator_spotlight',
      maxSlots: 1,
      priority: 1,
      badge: 'Spotlight · Sponsored',
      creativeDefaults: {
        headline: 'Operator Spotlight',
        subheadline: 'Featured operator story with direct booking CTA.',
        cta: 'Feature Operator',
        image: 'https://images.unsplash.com/photo-1516298773066-c48f8e9bd92b?w=1600&h=700&fit=crop'
      }
    });

    this.placementTypes.set('tour_sponsored_card', {
      id: 'tour_sponsored_card',
      name: 'Sponsored Experience Card',
      price: 180,
      period: 'weekly',
      description: 'Native sponsored card injected in experience discovery grid',
      pillar: 'cultural_tourism',
      page: 'cultural_tourism_marketplace',
      section: 'experience_grid',
      position: 'native_insert',
      maxSlots: 3,
      priority: 2,
      badge: 'Sponsored',
      creativeDefaults: {
        headline: 'Sponsored Experience',
        subheadline: 'Native placement in the discovery feed.',
        cta: 'Sponsor Card',
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&h=700&fit=crop'
      }
    });

    this.placementTypes.set('tour_region_boost', {
      id: 'tour_region_boost',
      name: 'Region Boost',
      price: 100,
      period: 'weekly',
      description: 'Priority ranking and visual boost for selected region',
      pillar: 'cultural_tourism',
      page: 'cultural_tourism_marketplace',
      section: 'region_results',
      maxSlots: 2,
      priority: 2,
      badge: 'Boosted · Sponsored',
      creativeDefaults: {
        headline: 'Region Boost',
        subheadline: 'Priority ranking in selected destination results.',
        cta: 'Boost Region',
        image: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=1200&h=700&fit=crop'
      }
    });

    this.placementTypes.set('tour_newsletter_feature', {
      id: 'tour_newsletter_feature',
      name: 'Newsletter Feature',
      price: 350,
      period: 'per_send',
      description: 'Sponsored placement in tourism newsletter campaign',
      pillar: 'cultural_tourism',
      page: 'cultural_tourism_marketplace',
      section: 'newsletter',
      maxSlots: 2,
      priority: 3,
      badge: 'Newsletter · Sponsored',
      creativeDefaults: {
        headline: 'Newsletter Feature',
        subheadline: 'Direct placement in tourism campaign email.',
        cta: 'Book Newsletter',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=700&fit=crop'
      }
    });

    this.placementTypes.set('tour_seasonal_takeover', {
      id: 'tour_seasonal_takeover',
      name: 'Seasonal Campaign Takeover',
      price: 220,
      period: 'weekly',
      description: 'Seasonal takeover promotion for festivals and high-season demand',
      pillar: 'cultural_tourism',
      page: 'cultural_tourism_marketplace',
      section: 'seasonal_campaign',
      maxSlots: 1,
      priority: 2,
      badge: 'Seasonal · Sponsored',
      creativeDefaults: {
        headline: 'Seasonal Campaign Takeover',
        subheadline: 'High-season promotion package for events and tours.',
        cta: 'Book Seasonal',
        image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=700&fit=crop'
      }
    });

    // ===== LANGUAGE & HERITAGE MARKETPLACE - PILLAR 7 =====

    this.placementTypes.set('heritage_featured_banner', {
      id: 'heritage_featured_banner',
      name: 'Featured Heritage Banner',
      price: 280,
      period: 'week',
      description: 'Top hero campaign placement on Language & Heritage marketplace.',
      pillar: 'language_heritage',
      page: 'language_heritage_marketplace',
      section: 'hero_banner',
      maxSlots: 2,
      priority: 1,
      badge: 'Hero Banner · Sponsored',
      creativeDefaults: {
        headline: 'Language Revitalization Season',
        subheadline: 'Place your campaign in the top heritage hero across discovery views.',
        cta: 'Reserve Banner',
        image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=600&fit=crop'
      }
    });

    this.placementTypes.set('heritage_speaker_spotlight', {
      id: 'heritage_speaker_spotlight',
      name: 'Speaker Spotlight',
      price: 220,
      period: 'week',
      description: 'Feature a recognized elder or verified speaker profile.',
      pillar: 'language_heritage',
      page: 'language_heritage_marketplace',
      section: 'speaker_spotlight',
      maxSlots: 2,
      priority: 2,
      badge: 'Speaker Spotlight · Sponsored',
      creativeDefaults: {
        headline: 'Verified Speaker Spotlight',
        subheadline: 'Promote elder-led language voices and community teaching offers.',
        cta: 'Book Spotlight',
        image: 'https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=1200&h=600&fit=crop'
      }
    });

    this.placementTypes.set('heritage_sponsored_card', {
      id: 'heritage_sponsored_card',
      name: 'Sponsored Archive Card',
      price: 150,
      period: 'week',
      description: 'Native sponsored listing inserted in archive discovery feed.',
      pillar: 'language_heritage',
      page: 'language_heritage_marketplace',
      section: 'archive_feed',
      maxSlots: 4,
      priority: 3,
      badge: 'Sponsored',
      creativeDefaults: {
        headline: 'Sponsored Archive Placement',
        subheadline: 'Priority card placement in archive and language resource feed.',
        cta: 'Sponsor Card',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&h=600&fit=crop'
      }
    });

    this.placementTypes.set('heritage_category_boost', {
      id: 'heritage_category_boost',
      name: 'Category Priority Boost',
      price: 90,
      period: 'week',
      description: 'Priority ranking inside one Language & Heritage category.',
      pillar: 'language_heritage',
      page: 'language_heritage_marketplace',
      section: 'category_results',
      maxSlots: 4,
      priority: 3,
      badge: 'Boost · Sponsored',
      creativeDefaults: {
        headline: 'Category Priority Boost',
        subheadline: 'Lift your listing inside selected category results.',
        cta: 'Boost Category',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=600&fit=crop'
      }
    });

    this.placementTypes.set('heritage_newsletter_feature', {
      id: 'heritage_newsletter_feature',
      name: 'Newsletter Language Feature',
      price: 300,
      period: 'send',
      description: 'Dedicated placement in language learner and institution newsletter.',
      pillar: 'language_heritage',
      page: 'language_heritage_marketplace',
      section: 'newsletter',
      maxSlots: 1,
      priority: 2,
      badge: 'Newsletter · Sponsored',
      creativeDefaults: {
        headline: 'Newsletter Language Feature',
        subheadline: 'Get featured in the heritage newsletter with direct action CTA.',
        cta: 'Book Newsletter',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=600&fit=crop'
      }
    });

    this.placementTypes.set('heritage_institution_partner', {
      id: 'heritage_institution_partner',
      name: 'Institution Partner Strip',
      price: 180,
      period: 'week',
      description: 'Rotating strip for museums, universities, and archive partners.',
      pillar: 'language_heritage',
      page: 'language_heritage_marketplace',
      section: 'institution_partner',
      maxSlots: 2,
      priority: 3,
      badge: 'Partner · Sponsored',
      creativeDefaults: {
        headline: 'Institution Partner Strip',
        subheadline: 'Showcase trusted archive and research partners in a premium strip.',
        cta: 'Join Partners',
        image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200&h=600&fit=crop'
      }
    });

    this.placementTypes.set('heritage_seasonal_takeover', {
      id: 'heritage_seasonal_takeover',
      name: 'Seasonal Revival Takeover',
      price: 240,
      period: 'week',
      description: 'Seasonal full-width campaign for language revitalization pushes.',
      pillar: 'language_heritage',
      page: 'language_heritage_marketplace',
      section: 'seasonal_campaign',
      maxSlots: 1,
      priority: 2,
      badge: 'Seasonal · Sponsored',
      creativeDefaults: {
        headline: 'Seasonal Revival Takeover',
        subheadline: 'Launch a full-width revival campaign tied to seasonal language initiatives.',
        cta: 'Book Takeover',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&h=600&fit=crop'
      }
    });
  }

  // Get all placement types
  getAllPlacementTypes() {
    return Array.from(this.placementTypes.values());
  }

  // Get placement types by pillar
  getPlacementTypesByPillar(pillar) {
    return this.getAllPlacementTypes().filter(type => type.pillar === pillar);
  }

  // Get placement type by ID
  getPlacementType(typeId) {
    return this.placementTypes.get(typeId);
  }

  // Calculate placement price with discounts
  calculatePrice(typeId, duration = 1, options = {}) {
    const type = this.placementTypes.get(typeId);
    if (!type) return null;

    const { paymentMethod = 'card', bundleDiscount = 0 } = options;
    
    // Base price for duration
    let basePrice = type.price * duration;
    
    // Duration discounts
    if (duration >= 4) basePrice *= 0.9; // 10% off for 4+ weeks
    if (duration >= 12) basePrice *= 0.8; // 20% off for 3+ months
    
    // Payment method discounts
    const paymentDiscounts = {
      card: 0,
      indi: 15,
      staked: 25
    };
    
    const paymentDiscount = paymentDiscounts[paymentMethod] || 0;
    
    // Apply discounts
    const totalDiscount = paymentDiscount + bundleDiscount;
    const finalPrice = basePrice * (1 - totalDiscount / 100);
    
    return {
      basePrice: Math.round(basePrice * 100) / 100,
      duration,
      paymentDiscount,
      bundleDiscount,
      totalDiscount,
      discountAmount: Math.round(basePrice * totalDiscount / 100 * 100) / 100,
      finalPrice: Math.round(finalPrice * 100) / 100,
      period: type.period
    };
  }

  // Book a placement
  async bookPlacement(userId, typeId, entityId, options = {}) {
    const type = this.placementTypes.get(typeId);
    if (!type) {
      throw new Error('Invalid placement type');
    }

    const { duration = 1, startDate = new Date(), paymentMethod = 'card', creative = null } = options;
    
    // Calculate pricing
    const pricing = this.calculatePrice(typeId, duration, { paymentMethod });
    
    // Check availability
    const availability = await this.checkAvailability(typeId, startDate, duration);
    if (!availability.available) {
      throw new Error('No slots available for selected dates');
    }
    
    // Create placement
    const placement = {
      id: uuidv4(),
      userId,
      typeId,
      typeName: type.name,
      entityId, // NFT ID, Course ID, etc.
      status: 'pending_payment',
      billingState: 'invoiced',
      pricing,
      startDate: startDate.toISOString(),
      endDate: this.calculateEndDate(startDate, duration, type.period).toISOString(),
      creative: creative || type.creativeDefaults || {},
      createdAt: new Date().toISOString()
    };

    this.placements.set(placement.id, placement);
    
    return placement;
  }

  // Confirm placement after payment
  async confirmPlacement(placementId, paymentDetails) {
    const placement = this.placements.get(placementId);
    if (!placement) {
      throw new Error('Placement not found');
    }

    placement.status = 'active';
    placement.billingState = 'paid';
    placement.paymentDetails = paymentDetails;
    placement.activatedAt = new Date().toISOString();
    
    // Add to active placements
    if (!this.activePlacements.has(placement.typeId)) {
      this.activePlacements.set(placement.typeId, []);
    }
    this.activePlacements.get(placement.typeId).push(placement);
    
    return placement;
  }

  // Check availability
  async checkAvailability(typeId, startDate, duration) {
    const type = this.placementTypes.get(typeId);
    if (!type) return { available: false };

    const endDate = this.calculateEndDate(startDate, duration, type.period);
    
    // Get active placements for this type
    const active = this.activePlacements.get(typeId) || [];
    
    // Count overlapping placements
    const overlapping = active.filter(p => {
      const pStart = new Date(p.startDate);
      const pEnd = new Date(p.endDate);
      return (startDate < pEnd && endDate > pStart);
    });

    const available = overlapping.length < type.maxSlots;
    const slotsAvailable = type.maxSlots - overlapping.length;

    return {
      available,
      slotsAvailable,
      maxSlots: type.maxSlots,
      requestedDuration: duration
    };
  }

  // Get active placements for display
  getActivePlacements(typeId) {
    const now = new Date();
    const active = this.activePlacements.get(typeId) || [];
    
    return active.filter(p => {
      const endDate = new Date(p.endDate);
      return p.status === 'active' && endDate > now;
    }).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  }

  getDisplayPlacements(typeId) {
    const type = this.getPlacementType(typeId);
    if (!type) return [];
    const active = this.getActivePlacements(typeId);
    if (active.length > 0) {
      return active.map((p) => ({
        ...p,
        creative: p.creative || type.creativeDefaults || {},
        billingState: p.status === 'active' ? 'paid' : p.status
      }));
    }
    return [
      {
        id: `preview-${typeId}`,
        typeId,
        status: 'preview',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
        creative: type.creativeDefaults || {},
        billingState: 'preview',
        preview: true
      }
    ];
  }

  // Get user's placements
  getUserPlacements(userId) {
    return Array.from(this.placements.values())
      .filter(p => p.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Calculate package deal
  calculatePackage(placements) {
    const totalBasePrice = placements.reduce((sum, p) => {
      const pricing = this.calculatePrice(p.typeId, p.duration);
      return sum + pricing.basePrice;
    }, 0);

    // Bundle discounts
    let bundleDiscount = 0;
    if (placements.length >= 2) bundleDiscount = 10;
    if (placements.length >= 4) bundleDiscount = 20;
    if (placements.length >= 6) bundleDiscount = 30;

    const discountAmount = totalBasePrice * (bundleDiscount / 100);
    const finalPrice = totalBasePrice - discountAmount;

    return {
      placements,
      totalBasePrice: Math.round(totalBasePrice * 100) / 100,
      bundleDiscount,
      discountAmount: Math.round(discountAmount * 100) / 100,
      finalPrice: Math.round(finalPrice * 100) / 100,
      savings: Math.round(discountAmount * 100) / 100
    };
  }

  // Calculate end date
  calculateEndDate(startDate, duration, period) {
    const end = new Date(startDate);
    if (period === 'weekly') {
      end.setDate(end.getDate() + (duration * 7));
    } else if (period === 'monthly') {
      end.setMonth(end.getMonth() + duration);
    } else {
      end.setDate(end.getDate() + duration);
    }
    return end;
  }

  // Cancel placement
  async cancelPlacement(placementId) {
    const placement = this.placements.get(placementId);
    if (!placement) {
      throw new Error('Placement not found');
    }

    placement.status = 'cancelled';
    placement.cancelledAt = new Date().toISOString();

    // Remove from active placements
    const active = this.activePlacements.get(placement.typeId) || [];
    const index = active.findIndex(p => p.id === placementId);
    if (index > -1) {
      active.splice(index, 1);
    }

    return placement;
  }
}

module.exports = new PremiumPlacementService();

