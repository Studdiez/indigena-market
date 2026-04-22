/**
 * Premium Placement Controller
 * API endpoints for featured listings and promotional placements
 */

const premiumPlacementService = require('../services/premiumPlacement.service.js');

// Get all placement types
exports.getPlacementTypes = async (req, res) => {
    try {
        const { pillar } = req.query;
        
        let types;
        if (pillar) {
            types = premiumPlacementService.getPlacementTypesByPillar(pillar);
        } else {
            types = premiumPlacementService.getAllPlacementTypes();
        }
        
        res.status(200).json({
            success: true,
            count: types.length,
            types
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single placement type
exports.getPlacementType = async (req, res) => {
    try {
        const { typeId } = req.params;
        const type = premiumPlacementService.getPlacementType(typeId);
        
        if (!type) {
            return res.status(404).json({
                success: false,
                message: 'Placement type not found'
            });
        }
        
        res.status(200).json({
            success: true,
            type
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Calculate placement price
exports.calculatePrice = async (req, res) => {
    try {
        const { typeId } = req.params;
        const { duration, paymentMethod } = req.body;
        
        const pricing = premiumPlacementService.calculatePrice(
            typeId,
            duration || 1,
            { paymentMethod }
        );
        
        if (!pricing) {
            return res.status(404).json({
                success: false,
                message: 'Placement type not found'
            });
        }
        
        res.status(200).json({
            success: true,
            pricing
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Check availability
exports.checkAvailability = async (req, res) => {
    try {
        const { typeId } = req.params;
        const { startDate, duration } = req.query;
        
        const availability = await premiumPlacementService.checkAvailability(
            typeId,
            new Date(startDate || Date.now()),
            parseInt(duration) || 1
        );
        
        res.status(200).json({
            success: true,
            availability
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Book a placement
exports.bookPlacement = async (req, res) => {
    try {
        const { typeId } = req.params;
        const userId = req.user?.id || req.body?.userId || 'demo-user';
        const { entityId, duration, startDate, paymentMethod, creative } = req.body;
        
        const placement = await premiumPlacementService.bookPlacement(
            userId,
            typeId,
            entityId,
            { duration, startDate: new Date(startDate), paymentMethod, creative }
        );
        
        res.status(201).json({
            success: true,
            message: 'Placement booked successfully. Awaiting payment.',
            placement
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Confirm placement (after payment)
exports.confirmPlacement = async (req, res) => {
    try {
        const { placementId } = req.params;
        const { paymentDetails } = req.body;
        
        const placement = await premiumPlacementService.confirmPlacement(
            placementId,
            paymentDetails
        );
        
        res.status(200).json({
            success: true,
            message: 'Placement confirmed and activated',
            placement
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get active placements (for display)
exports.getActivePlacements = async (req, res) => {
    try {
        const { typeId } = req.params;
        const placements = premiumPlacementService.getActivePlacements(typeId);
        
        res.status(200).json({
            success: true,
            count: placements.length,
            placements
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get my placements
exports.getMyPlacements = async (req, res) => {
    try {
        const userId = req.user?.id || req.query?.userId || req.headers['x-user-id'] || 'demo-user';
        const placements = premiumPlacementService.getUserPlacements(userId);
        
        res.status(200).json({
            success: true,
            count: placements.length,
            placements
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Calculate package deal
exports.calculatePackage = async (req, res) => {
    try {
        const { placements } = req.body;
        
        const packageDeal = premiumPlacementService.calculatePackage(placements);
        
        res.status(200).json({
            success: true,
            package: packageDeal
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cancel placement
exports.cancelPlacement = async (req, res) => {
    try {
        const { placementId } = req.params;
        const userId = req.user?.id || req.body?.userId || req.headers['x-user-id'] || 'demo-user';
        
        const placement = await premiumPlacementService.cancelPlacement(placementId);
        
        // Verify ownership
        if (placement.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Placement cancelled',
            placement
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get homepage placements (public endpoint)
exports.getHomepagePlacements = async (req, res) => {
    try {
        const placementTypes = [
            'homepage_hero',
            'homepage_collections',
            'homepage_artist_spotlight',
            'homepage_auctions',
            'homepage_events'
        ];
        
        const placements = {};
        for (const typeId of placementTypes) {
            placements[typeId] = premiumPlacementService.getActivePlacements(typeId);
        }
        
        res.status(200).json({
            success: true,
            placements
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get pillar featured listings (public endpoint)
exports.getPillarFeatured = async (req, res) => {
    try {
        const { pillar } = req.params;
        const typeId = `pillar_featured_${pillar}`;
        
        const placements = premiumPlacementService.getActivePlacements(typeId);
        
        res.status(200).json({
            success: true,
            pillar,
            count: placements.length,
            placements
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Digital Arts marketplace placements (public endpoint)
exports.getDigitalArtsPlacements = async (req, res) => {
    try {
        const placementTypes = [
            'da_hero_banner',
            'da_trending_boost',
            'da_sponsored_grid',
            'da_new_arrivals_pin',
            'da_collection_launch',
            'da_artist_spotlight',
            'pillar_featured_digital_arts'
        ];

        const placements = {};
        const summary = [];

        for (const typeId of placementTypes) {
            const active = premiumPlacementService.getActivePlacements(typeId);
            placements[typeId] = active;
            const typeInfo = premiumPlacementService.getPlacementType(typeId);
            if (typeInfo) {
                summary.push({
                    typeId,
                    name: typeInfo.name,
                    price: typeInfo.price,
                    period: typeInfo.period,
                    slotsUsed: active.length,
                    maxSlots: typeInfo.maxSlots,
                    available: active.length < typeInfo.maxSlots
                });
            }
        }

        res.status(200).json({
            success: true,
            page: 'digital_arts_marketplace',
            summary,
            placements
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Courses marketplace placements (public endpoint)
exports.getCoursesPlacements = async (req, res) => {
    try {
        const placementTypes = [
            'courses_promoted_card',
            'courses_category_featured',
            'courses_sidebar_ad',
            'courses_instructor_spotlight',
            'courses_search_promoted',
            'courses_bundle_promo',
            'pillar_featured_courses'
        ];

        const placements = {};
        const summary = [];

        for (const typeId of placementTypes) {
            const active = premiumPlacementService.getActivePlacements(typeId);
            placements[typeId] = active;
            const typeInfo = premiumPlacementService.getPlacementType(typeId);
            if (typeInfo) {
                summary.push({
                    typeId,
                    name: typeInfo.name,
                    price: typeInfo.price,
                    period: typeInfo.period,
                    slotsUsed: active.length,
                    maxSlots: typeInfo.maxSlots,
                    available: active.length < typeInfo.maxSlots
                });
            }
        }

        res.status(200).json({
            success: true,
            page: 'courses_marketplace',
            summary,
            placements
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Trending page placements (public endpoint)
exports.getTrendingPlacements = async (req, res) => {
    try {
        const placementTypes = [
            'trending_pinned_item',
            'trending_category_boost',
            'trending_banner_strip'
        ];

        const placements = {};
        const summary = [];

        for (const typeId of placementTypes) {
            const active = premiumPlacementService.getActivePlacements(typeId);
            placements[typeId] = active;
            const typeInfo = premiumPlacementService.getPlacementType(typeId);
            if (typeInfo) {
                summary.push({
                    typeId,
                    name: typeInfo.name,
                    price: typeInfo.price,
                    period: typeInfo.period,
                    slotsUsed: active.length,
                    maxSlots: typeInfo.maxSlots,
                    available: active.length < typeInfo.maxSlots
                });
            }
        }

        res.status(200).json({
            success: true,
            page: 'trending',
            summary,
            placements
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Community page placements (public endpoint)
exports.getCommunityPlacements = async (req, res) => {
    try {
        const placementTypes = [
            'community_featured_event',
            'community_story_spotlight',
            'community_forum_pinned',
            'community_sidebar_banner'
        ];

        const placements = {};
        const summary = [];

        for (const typeId of placementTypes) {
            const active = premiumPlacementService.getActivePlacements(typeId);
            placements[typeId] = active;
            const typeInfo = premiumPlacementService.getPlacementType(typeId);
            if (typeInfo) {
                summary.push({
                    typeId,
                    name: typeInfo.name,
                    price: typeInfo.price,
                    period: typeInfo.period,
                    slotsUsed: active.length,
                    maxSlots: typeInfo.maxSlots,
                    available: active.length < typeInfo.maxSlots
                });
            }
        }

        res.status(200).json({
            success: true,
            page: 'community',
            summary,
            placements
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Cultural Tourism marketplace placements (public endpoint)
exports.getCulturalTourismPlacements = async (req, res) => {
    try {
        const placementTypes = [
            'tour_hero_banner',
            'tour_operator_spotlight',
            'tour_sponsored_card',
            'tour_region_boost',
            'tour_newsletter_feature',
            'tour_seasonal_takeover',
            'pillar_featured_tourism'
        ];

        const placements = {};
        const summary = [];

        for (const typeId of placementTypes) {
            const active = premiumPlacementService.getActivePlacements(typeId);
            const display = premiumPlacementService.getDisplayPlacements(typeId);
            placements[typeId] = display;
            const typeInfo = premiumPlacementService.getPlacementType(typeId);
            if (typeInfo) {
                summary.push({
                    typeId,
                    name: typeInfo.name,
                    price: typeInfo.price,
                    period: typeInfo.period,
                    slotsUsed: active.length,
                    maxSlots: typeInfo.maxSlots,
                    available: active.length < typeInfo.maxSlots,
                    badge: typeInfo.badge || '',
                    creativeDefaults: typeInfo.creativeDefaults || {}
                });
            }
        }

        res.status(200).json({
            success: true,
            page: 'cultural_tourism_marketplace',
            summary,
            placements
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Language & Heritage marketplace placements (public endpoint)
exports.getLanguageHeritagePlacements = async (req, res) => {
    try {
        const placementTypes = [
            'heritage_featured_banner',
            'heritage_speaker_spotlight',
            'heritage_sponsored_card',
            'heritage_category_boost',
            'heritage_newsletter_feature',
            'heritage_institution_partner',
            'heritage_seasonal_takeover'
        ];

        const placements = {};
        const summary = [];

        for (const typeId of placementTypes) {
            const active = premiumPlacementService.getActivePlacements(typeId);
            const display = premiumPlacementService.getDisplayPlacements(typeId);
            placements[typeId] = display;
            const typeInfo = premiumPlacementService.getPlacementType(typeId);
            if (typeInfo) {
                summary.push({
                    typeId,
                    name: typeInfo.name,
                    price: typeInfo.price,
                    period: typeInfo.period,
                    slotsUsed: active.length,
                    maxSlots: typeInfo.maxSlots,
                    available: active.length < typeInfo.maxSlots,
                    badge: typeInfo.badge || '',
                    creativeDefaults: typeInfo.creativeDefaults || {}
                });
            }
        }

        res.status(200).json({
            success: true,
            page: 'language_heritage_marketplace',
            summary,
            placements
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all page placements overview (admin/revenue dashboard)
exports.getAllPagePlacements = async (req, res) => {
    try {
        const allTypes = premiumPlacementService.getAllPlacementTypes();
        const overview = allTypes.map(type => {
            const active = premiumPlacementService.getActivePlacements(type.id);
            const weeklyRevenue = type.period === 'weekly' ? type.price * active.length : 0;
            return {
                typeId: type.id,
                name: type.name,
                page: type.page || 'homepage',
                section: type.section || 'general',
                pillar: type.pillar || null,
                price: type.price,
                period: type.period,
                maxSlots: type.maxSlots,
                activeSlots: active.length,
                fillRate: Math.round((active.length / type.maxSlots) * 100),
                weeklyRevenue,
                badge: type.badge || null
            };
        });

        const totalWeeklyRevenue = overview.reduce((sum, t) => sum + t.weeklyRevenue, 0);
        const totalActiveSlots = overview.reduce((sum, t) => sum + t.activeSlots, 0);
        const totalSlots = overview.reduce((sum, t) => sum + t.maxSlots, 0);

        res.status(200).json({
            success: true,
            totalPlacementTypes: overview.length,
            totalActiveSlots,
            totalSlots,
            overallFillRate: Math.round((totalActiveSlots / totalSlots) * 100),
            estimatedWeeklyRevenue: totalWeeklyRevenue,
            estimatedMonthlyRevenue: Math.round(totalWeeklyRevenue * 4.33),
            estimatedAnnualRevenue: Math.round(totalWeeklyRevenue * 52),
            placements: overview
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
