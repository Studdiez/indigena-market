const uictrl = require('../controllers/ui.controller.js');
const bidctrl = require('../controllers/bid.controller.js');
const collectionctrl = require('../controllers/collection.controller.js');
const xrplctrl = require('../controllers/xrpl.controller.js');
const sevactrl = require('../controllers/seva.controller.js');
const voicectrl = require('../controllers/voice.controller.js');
const accessibilityctrl = require('../controllers/accessibility.controller.js');
const coursectrl = require('../controllers/course.controller.js');
const physicalctrl = require('../controllers/physicalItem.controller.js');
const freelancerctrl = require('../controllers/freelancer.controller.js');
const sacredctrl = require('../controllers/sacredContent.controller.js');
const hubctrl = require('../controllers/hub.controller.js');
const disbursementctrl = require('../controllers/disbursement.controller.js');
const transparencyctrl = require('../controllers/transparency.controller.js');
const ecosystemctrl = require('../controllers/ecosystem.controller.js');
const revenuctrl = require('../controllers/revenue.controller.js');
const subscriptionctrl = require('../controllers/subscription.controller.js');
const premiumPlacementctrl = require('../controllers/premiumPlacement.controller.js');
const digitalArtctrl = require('../controllers/digitalArt.controller.js');
const culturalTourismctrl = require('../controllers/culturalTourism.controller.js');
const languageHeritctrl = require('../controllers/languageHeritage.controller.js');
const { requireAdminWallet } = require('../middlewares/adminWalletGate.js');
const { createRateLimiter } = require('../middlewares/rateLimiter.js');

const express = require('express');

const router = express.Router();
const tourismMutationLimiter = createRateLimiter({
    windowMs: Number(process.env.TOURISM_MUTATION_WINDOW_MS || 60000),
    maxRequests: Number(process.env.TOURISM_MUTATION_MAX_REQUESTS || 120),
    prefix: 'tourism-mutations',
    redisUrl: process.env.REDIS_URL
});
const coursesMutationLimiter = createRateLimiter({
    windowMs: Number(process.env.COURSES_MUTATION_WINDOW_MS || 60000),
    maxRequests: Number(process.env.COURSES_MUTATION_MAX_REQUESTS || 90),
    prefix: 'courses-mutations',
    redisUrl: process.env.REDIS_URL
});
const heritageMutationLimiter = createRateLimiter({
    windowMs: Number(process.env.HERITAGE_MUTATION_WINDOW_MS || 60000),
    maxRequests: Number(process.env.HERITAGE_MUTATION_MAX_REQUESTS || 90),
    prefix: 'heritage-mutations',
    redisUrl: process.env.REDIS_URL
});
const heritageEventLimiter = createRateLimiter({
    windowMs: Number(process.env.HERITAGE_EVENT_WINDOW_MS || 60000),
    maxRequests: Number(process.env.HERITAGE_EVENT_MAX_REQUESTS || 120),
    prefix: 'heritage-events',
    redisUrl: process.env.REDIS_URL
});
router.get('/', (req, res) => {
    res.send("API is up and running...").status(200);
});

// Existing NFT routes
router.post('/create-nft', uictrl.createnft);
router.post('/getnft', uictrl.getnft);
router.put('/updatenftprice', uictrl.updatenftprice);
router.get('/todaynft', uictrl.Todaynft);
router.get('/getAll', uictrl.getAll);
router.post('/createbid', bidctrl.createbid);
router.post('/maxbid', bidctrl.maxbit);
router.post('/FindCollectionNft', uictrl.FindCollectionNft);

// Collection routes  
router.post('/createCollection',collectionctrl.createcollection);
router.post('/getcollections',collectionctrl.getcollections);
router.put('/editprofile',uictrl.editprofile);
router.post('/TotalAmount',uictrl.TotalAmount);
router.get('/Top15collections',uictrl.Top15collections);
router.get('/getAllcollection',collectionctrl.getAllcollection);
router.post('/FindNft',uictrl.FindNft);
router.post('/GetViews',uictrl.GetViews);
router.post('/GetPropertiesnft',uictrl.GetPropertiesnft);
router.post('/getActivity',uictrl.getActivity);
router.post('/getAllActivity',uictrl.getAllActivity);
router.post('/createActivity',uictrl.createActivity);
router.post('/checkdublicate',uictrl.checkdublicate);

router.post('/checkcollection',collectionctrl.checkcollection);
router.post('/checkname',uictrl.checkname);
router.post('/SearchgetAll',uictrl.SearchgetAll);
router.post('/statAllcollection',collectionctrl.statAllcollection);
router.put('/updateCollection',collectionctrl.updateCollection);
router.post('/checkUserStatus',uictrl.checkUserStatus);  
router.post('/getsignature',uictrl.getsignature);  
router.post('/AddFavourites',uictrl.AddFavourites);  
router.post('/getFavourites',uictrl.getFavourites);  
router.get('/ExipredNft',uictrl.ExipredNft); 
router.get('/TodayMintednft',uictrl.TodayMintednft);
router.post('/createOffer',bidctrl.createOffer); 
router.post('/getOffer',bidctrl.getOffer);
router.put('/updateOffer',bidctrl.updateOffer);
router.get('/getFavouritesNFT',uictrl.getFavouritesNFT);
router.get('/Homesearch',uictrl.Homesearch);
router.get('/Top7Collection',collectionctrl.Top7Collection);
router.post('/Likednfts',uictrl.Likednfts);
router.post('/Searchcollection',collectionctrl.Searchcollection);

// XRPL Routes
router.post('/xrpl/mint', xrplctrl.createMintPayload);
router.post('/xrpl/verify-mint', xrplctrl.verifyMintTransaction);
router.get('/xrpl/nfts/:address', xrplctrl.getAccountNFTs);
router.get('/xrpl/transaction/:hash', xrplctrl.getTransactionStatus);
router.get('/xrpl/payload/:uuid', xrplctrl.getPayloadStatus);
router.post('/xrpl/sell-offer', xrplctrl.createSellOffer);
router.post('/xrpl/buy-offer', xrplctrl.createBuyOffer);
router.post('/xrpl/accept-offer', xrplctrl.acceptOffer);
router.post('/xrpl/burn', xrplctrl.burnNFT);
router.post('/xrpl/calculate-royalty', xrplctrl.calculateRoyalty);

// SEVA Routes
router.get('/seva/dashboard/:address', sevactrl.getDashboard);
router.post('/seva/allocate', sevactrl.allocateSEVA);
router.post('/seva/donate', sevactrl.donateSEVA);
router.get('/seva/causes', sevactrl.getCulturalCauses);
router.get('/seva/causes/:causeId', sevactrl.getCulturalCause);
router.post('/seva/record-earnings', sevactrl.recordSEVAEarnings);
router.get('/seva/history/:address', sevactrl.getAllocationHistory);
router.get('/seva/stats', sevactrl.getPlatformStats);

// Voice Command Routes
router.post('/voice/command', voicectrl.processVoiceCommand);
router.get('/voice/languages', voicectrl.getSupportedLanguages);
router.get('/voice/commands/:language', voicectrl.getCommandsByLanguage);
router.post('/voice/feedback', voicectrl.submitFeedback);
router.post('/voice/seed', voicectrl.seedDefaultCommands);

// Accessibility Routes
router.post('/accessibility/settings', accessibilityctrl.updateSettings);
router.get('/accessibility/settings/:address', accessibilityctrl.getSettings);
router.post('/accessibility/elder-mode', accessibilityctrl.toggleElderMode);
router.post('/accessibility/verify-elder', accessibilityctrl.verifyElder);
router.post('/accessibility/sacred-access', accessibilityctrl.validateSacredContentAccess);

// ==================== COURSES PILLAR 3 (Knowledge Economy) ====================
// Category Discovery
router.get('/courses/categories', coursectrl.getCategories);
router.get('/courses/categories/:categoryId', coursectrl.getCategory);
router.get('/courses/categories/:categoryId/subcategories', coursectrl.getCategorySubcategories);
// Course CRUD
router.post('/courses/create', coursectrl.createCourse);
router.get('/courses', coursectrl.getAllCourses);
router.get('/courses/creator/:address', coursectrl.getCoursesByCreator);
router.get('/courses/:courseId', coursectrl.getCourse);
router.put('/courses/:courseId', coursectrl.updateCourse);
router.delete('/courses/:courseId', coursectrl.deleteCourse);
// Enrollment & Progress
router.post('/courses/enroll', coursesMutationLimiter, coursectrl.enrollInCourse);
router.post('/courses/:courseId/payment-intent', coursesMutationLimiter, coursectrl.createPaymentIntent);
router.post('/courses/:courseId/payment-confirm', coursesMutationLimiter, coursectrl.confirmPayment);
router.post('/courses/complete', coursesMutationLimiter, coursectrl.completeModule);
router.post('/courses/certificate', coursesMutationLimiter, coursectrl.generateCertificate);
router.post('/courses/rating', coursesMutationLimiter, coursectrl.addRating);
router.get('/courses/enrollments/me', coursectrl.getMyEnrollments);
router.get('/courses/:courseId/progress', coursectrl.getCourseProgress);
router.post('/courses/:courseId/progress', coursesMutationLimiter, coursectrl.syncCourseProgress);
router.post('/courses/:courseId/watchlist', coursesMutationLimiter, coursectrl.toggleWatchlist);
router.post('/courses/:courseId/share', coursesMutationLimiter, coursectrl.shareCourse);
router.post('/courses/:courseId/report', coursesMutationLimiter, coursectrl.reportCourse);
router.post('/courses/:courseId/submit', coursesMutationLimiter, coursectrl.submitCourseForReview);
router.post('/courses/:courseId/publish', coursesMutationLimiter, coursectrl.publishCourse);
router.get('/courses/receipts/me', coursectrl.getMyReceipts);
// Discovery & Stats
router.get('/courses/search', coursectrl.search);
router.get('/courses/featured', coursectrl.getFeaturedCourses);
router.get('/courses/stats/categories', coursectrl.getCategoryStats);
router.get('/courses/stats/overview', coursectrl.getMarketplaceOverview);
router.get('/courses/revenue-projections', coursectrl.getRevenueProjections);
router.get('/courses/profiles/:address', coursectrl.getPublicProfile);

// Physical Item Routes (legacy NFC)
router.post('/physical/register', physicalctrl.registerPhysicalItem);
router.get('/physical/nfc/:nfcTagId', physicalctrl.getItemByNFC);
router.post('/physical/condition-report', physicalctrl.addConditionReport);
router.post('/physical/transfer', physicalctrl.transferOwnership);
router.get('/physical/creator/:address', physicalctrl.getItemsByCreator);
router.put('/physical/:itemId', physicalctrl.updateItem);

// ==================== PHYSICAL ITEMS MARKETPLACE (Pillar 2) ====================
// Categories
router.get('/physical-items/categories', physicalctrl.getCategories);
router.get('/physical-items/categories/:categoryId', physicalctrl.getCategory);
router.get('/physical-items/categories/:categoryId/subcategories', physicalctrl.getSubcategories);
// Items
router.post('/physical-items/items', physicalctrl.registerPhysicalItem);
router.get('/physical-items/items/:itemId', physicalctrl.getItemById);
router.get('/physical-items/items', physicalctrl.getAllItems);
router.post('/physical-items/items/:itemId/buy', physicalctrl.buyItem);
router.post('/physical-items/items/:itemId/offers', physicalctrl.makeOffer);
router.post('/physical-items/items/:itemId/watchlist', physicalctrl.toggleWatchlist);
router.post('/physical-items/items/:itemId/share', physicalctrl.shareItem);
router.post('/physical-items/items/:itemId/report', physicalctrl.reportItem);
router.get('/physical-items/moderation/queue', requireAdminWallet, physicalctrl.getModerationQueue);
router.post('/physical-items/moderation/reports/:reportId/decision', requireAdminWallet, physicalctrl.decideModeration);
router.put('/physical-items/items/:itemId', physicalctrl.updateItem);
router.delete('/physical-items/items/:itemId', physicalctrl.deleteItem);
// Maker / Owner
router.get('/physical-items/maker/:address', physicalctrl.getItemsByCreator);
router.get('/physical-items/owner/:address', physicalctrl.getItemsByOwner);
// Provenance
router.post('/physical-items/transfer', physicalctrl.transferOwnership);
router.post('/physical-items/condition-report', physicalctrl.addConditionReport);
router.post('/physical-items/verify', physicalctrl.verifyItem);
// Discovery
router.get('/physical-items/search', physicalctrl.search);
router.get('/physical-items/featured', physicalctrl.getFeaturedItems);
// Stats
router.get('/physical-items/stats/categories', physicalctrl.getCategoryStats);
router.get('/physical-items/stats/overview', physicalctrl.getMarketplaceOverview);
router.post('/physical-items/analytics/event', physicalctrl.trackEvent);
router.get('/physical-items/analytics/heatmap', physicalctrl.getDemandHeatmap);
router.get('/physical-items/revenue-projections', physicalctrl.getRevenueProjections);

// Freelancer Routes
router.post('/freelancers/create', freelancerctrl.createProfile);
router.get('/freelancers/:address', freelancerctrl.getProfile);
router.get('/freelancers', freelancerctrl.getAllFreelancers);
router.get('/freelancers/skills/:category', freelancerctrl.getFreelancersBySkill);
router.post('/freelancers/skills', freelancerctrl.addSkill);
router.post('/freelancers/services', freelancerctrl.addService);
router.post('/freelancers/reviews', freelancerctrl.addReview);
router.get('/freelancers/marketplace/services', freelancerctrl.getMarketplaceServices);
router.post('/freelancers/marketplace/services/:serviceId/book', freelancerctrl.bookService);
router.post('/freelancers/marketplace/services/:serviceId/shortlist', freelancerctrl.shortlistService);
router.post('/freelancers/marketplace/services/:serviceId/share', freelancerctrl.shareService);
router.post('/freelancers/marketplace/services/:serviceId/report', freelancerctrl.reportService);
router.get('/freelancers/moderation/queue', requireAdminWallet, freelancerctrl.getModerationQueue);
router.post('/freelancers/moderation/reports/:reportId/decision', requireAdminWallet, freelancerctrl.decideModeration);
router.post('/freelancers/analytics/event', freelancerctrl.trackEvent);
router.get('/freelancers/analytics/heatmap', freelancerctrl.getDemandHeatmap);
router.post('/freelancers/verify', freelancerctrl.verifyFreelancer);
router.put('/freelancers/:address', freelancerctrl.updateProfile);

// ==================== DIGITAL ARTS MARKETPLACE ====================
// Categories
router.get('/digital-arts/categories', digitalArtctrl.getCategories);
router.get('/digital-arts/categories/:categoryId', digitalArtctrl.getCategory);
router.get('/digital-arts/categories/:categoryId/subcategories', digitalArtctrl.getSubcategories);

// Creators
router.post('/digital-arts/creators', digitalArtctrl.createCreator);
router.get('/digital-arts/creators/:address', digitalArtctrl.getCreator);
router.get('/digital-arts/creators', digitalArtctrl.getAllCreators);
router.put('/digital-arts/creators/:address', digitalArtctrl.updateCreator);
router.post('/digital-arts/creators/:address/portfolio', digitalArtctrl.addPortfolioItem);

// Listings
router.post('/digital-arts/listings', digitalArtctrl.createListing);
router.get('/digital-arts/listings/:listingId', digitalArtctrl.getListing);
router.get('/digital-arts/listings', digitalArtctrl.getAllListings);
router.put('/digital-arts/listings/:listingId', digitalArtctrl.updateListing);
router.delete('/digital-arts/listings/:listingId', digitalArtctrl.deleteListing);
router.post('/digital-arts/listings/:listingId/buy', digitalArtctrl.buyListing);
router.post('/digital-arts/listings/:listingId/bid', digitalArtctrl.bidOnListing);
router.post('/digital-arts/listings/:listingId/offers', digitalArtctrl.makeOffer);
router.post('/digital-arts/listings/:listingId/watchlist', digitalArtctrl.toggleWatchlist);
router.post('/digital-arts/listings/:listingId/share', digitalArtctrl.shareListing);
router.post('/digital-arts/listings/:listingId/report', digitalArtctrl.reportListing);
router.post('/digital-arts/listings/:listingId/moderation/submit', digitalArtctrl.submitModeration);
router.post('/digital-arts/listings/:listingId/moderation/decision', digitalArtctrl.decideModeration);

// Discovery
router.get('/digital-arts/search', digitalArtctrl.search);
router.get('/digital-arts/featured', digitalArtctrl.getFeaturedListings);
router.get('/digital-arts/trending', digitalArtctrl.getTrendingListings);
router.get('/digital-arts/moderation/queue', digitalArtctrl.getModerationQueue);
router.post('/digital-arts/creators/:address/verify-request', digitalArtctrl.verifyCreatorRequest);
router.post('/digital-arts/creators/:address/verify-decision', digitalArtctrl.verifyCreatorDecision);
router.post('/digital-arts/analytics/event', digitalArtctrl.trackEvent);
router.get('/digital-arts/analytics/heatmap', digitalArtctrl.getDemandHeatmap);

// ==================== CULTURAL TOURISM MARKETPLACE (Pillar 6) ====================
// Auth
router.post('/cultural-tourism/auth/challenge', tourismMutationLimiter, culturalTourismctrl.requestAuthChallenge);
router.post('/cultural-tourism/auth/verify', tourismMutationLimiter, culturalTourismctrl.verifyAuthChallenge);
router.post('/cultural-tourism/auth/refresh', tourismMutationLimiter, culturalTourismctrl.refreshUserSession);
router.post('/cultural-tourism/auth/logout', tourismMutationLimiter, culturalTourismctrl.logoutUserSession);
// Experiences
router.get('/cultural-tourism/experiences', culturalTourismctrl.getExperiences);
router.get('/cultural-tourism/experiences/cursor', culturalTourismctrl.getExperiencesCursor);
router.get('/cultural-tourism/experiences/:experienceId/availability', culturalTourismctrl.getExperienceAvailability);
router.get('/cultural-tourism/experiences/:experienceId/calendar', culturalTourismctrl.getExperienceCalendar);
router.get('/cultural-tourism/experiences/:experienceId/reviews', culturalTourismctrl.getExperienceReviews);
router.get('/cultural-tourism/experiences/:experienceId', culturalTourismctrl.getExperienceById);
router.post('/cultural-tourism/experiences', tourismMutationLimiter, culturalTourismctrl.upsertExperience);
router.post('/cultural-tourism/experiences/:experienceId/blackouts', tourismMutationLimiter, culturalTourismctrl.updateExperienceBlackouts);
router.post('/cultural-tourism/experiences/:experienceId/sessions', tourismMutationLimiter, culturalTourismctrl.upsertExperienceSessions);
// Bookings
router.post('/cultural-tourism/bookings', tourismMutationLimiter, culturalTourismctrl.createBooking);
router.get('/cultural-tourism/bookings/me', culturalTourismctrl.getMyBookings);
router.post('/cultural-tourism/bookings/:bookingId/cancel', tourismMutationLimiter, culturalTourismctrl.cancelBooking);
router.post('/cultural-tourism/bookings/:bookingId/reschedule', tourismMutationLimiter, culturalTourismctrl.rescheduleBooking);
router.post('/cultural-tourism/bookings/:bookingId/payment-intent', tourismMutationLimiter, culturalTourismctrl.createBookingPaymentIntent);
router.post('/cultural-tourism/bookings/:bookingId/payment-confirm', tourismMutationLimiter, culturalTourismctrl.confirmBookingPayment);
router.post('/cultural-tourism/bookings/:bookingId/reviews', tourismMutationLimiter, culturalTourismctrl.submitBookingReview);
router.get('/cultural-tourism/bookings/:bookingId/ticket', culturalTourismctrl.getBookingTicket);
router.post('/cultural-tourism/bookings/:bookingId/refund', requireAdminWallet, culturalTourismctrl.refundBooking);
router.post('/cultural-tourism/payments/webhook', tourismMutationLimiter, culturalTourismctrl.handlePaymentWebhook);
router.post('/cultural-tourism/payments/reconcile', requireAdminWallet, culturalTourismctrl.reconcilePayments);
router.post('/cultural-tourism/payments/retry-queue', requireAdminWallet, culturalTourismctrl.processPaymentRetryQueue);
router.post('/cultural-tourism/comms/process', requireAdminWallet, culturalTourismctrl.processCommsQueue);
router.get('/cultural-tourism/readyz', culturalTourismctrl.getTourismReadiness);
// Territories and demand
router.get('/cultural-tourism/territories', culturalTourismctrl.getTerritories);
router.get('/cultural-tourism/analytics/heatmap', culturalTourismctrl.getHeatmap);
router.post('/cultural-tourism/analytics/event', culturalTourismctrl.trackEvent);
router.get('/cultural-tourism/analytics/funnel', culturalTourismctrl.getBookingFunnelMetrics);
// Moderation and governance
router.get('/cultural-tourism/moderation', culturalTourismctrl.getModerationQueue);
router.post('/cultural-tourism/moderation/:itemId/decision', requireAdminWallet, culturalTourismctrl.decideModeration);
router.get('/cultural-tourism/moderation/export', requireAdminWallet, culturalTourismctrl.exportModerationAudit);
// Operators
router.get('/cultural-tourism/operators/:wallet', culturalTourismctrl.getOperatorProfile);
router.get('/cultural-tourism/operators/:wallet/listings', culturalTourismctrl.getOperatorListings);
router.get('/cultural-tourism/operators/:wallet/bookings', culturalTourismctrl.getOperatorBookingInbox);
router.post('/cultural-tourism/operators/:wallet/trust', tourismMutationLimiter, culturalTourismctrl.upsertOperatorTrust);
router.post('/cultural-tourism/operators/:wallet/trust/verify', requireAdminWallet, culturalTourismctrl.verifyOperatorTrust);
router.get('/cultural-tourism/operators/trust/alerts', requireAdminWallet, culturalTourismctrl.getOperatorTrustAlerts);
router.get('/cultural-tourism/ops/dashboard', requireAdminWallet, culturalTourismctrl.getOpsDashboard);
router.get('/cultural-tourism/ops/synthetic-check', requireAdminWallet, culturalTourismctrl.runSyntheticChecks);

// Stats & Analytics
router.get('/digital-arts/stats/categories', digitalArtctrl.getCategoryStats);
router.get('/digital-arts/stats/overview', digitalArtctrl.getMarketplaceOverview);
router.get('/digital-arts/revenue-projections', digitalArtctrl.getRevenueProjections);

// Sacred Content Routes
router.post('/sacred/access-request', sacredctrl.requestAccess);
router.get('/sacred/verify-access/:contentId', sacredctrl.verifyAccess);
router.post('/sacred/log-access', sacredctrl.logAccess);
router.post('/sacred/register', sacredctrl.registerSacredContent);
router.get('/sacred/:contentId', sacredctrl.getSacredContent);
router.post('/sacred/elder-approval', sacredctrl.elderApproval);
router.get('/sacred/user/:address', sacredctrl.getUserAccessList);

// Community Hub Routes (Offline-First)
router.post('/hub/upload', hubctrl.registerPendingUpload);
router.get('/hub/uploads/:address', hubctrl.getPendingUploads);
router.post('/hub/sync/:uploadId', hubctrl.syncUpload);
router.post('/hub/batch-sync', hubctrl.batchSync);
router.get('/hub/dashboard/:facilitatorAddress', hubctrl.getHubDashboard);
router.post('/hub/cancel/:uploadId', hubctrl.cancelUpload);

// Disbursement Routes (Multi-Channel Payouts)
router.get('/disbursement/settings/:address', disbursementctrl.getPayoutSettings);
router.post('/disbursement/settings/:address', disbursementctrl.updatePayoutSettings);
router.post('/disbursement/request/:address', disbursementctrl.requestPayout);
router.get('/disbursement/history/:address', disbursementctrl.getPayoutHistory);
router.get('/disbursement/methods', disbursementctrl.getPayoutMethods);
router.get('/disbursement/stats/:address', disbursementctrl.getPayoutStats);

// Transparency Routes (Radical Transparency)
router.get('/transparency/breakdown/:nftId', transparencyctrl.getPurchaseBreakdown);
router.get('/transparency/artist/:address', transparencyctrl.getArtistImpact);
router.get('/transparency/platform', transparencyctrl.getPlatformTransparency);
router.get('/transparency/gift-back', transparencyctrl.getGiftBackOptions);
router.get('/transparency/verify/:txHash', transparencyctrl.verifyTransaction);

// Translation Routes (Voice Memo Pipeline)
router.post('/translation/request/:nftId', async (req, res) => {
    const translationService = require('../services/translation.service.js');
    try {
        const result = await translationService.requestTranslation(
            req.params.nftId,
            req.body.targetLanguage,
            req.body.requesterAddress
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/translation/submit/:nftId', async (req, res) => {
    const translationService = require('../services/translation.service.js');
    try {
        const result = await translationService.submitTranslation(
            req.params.nftId,
            req.body.targetLanguage,
            req.body.translatedText,
            req.body.translatorInfo
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/translation/:nftId', async (req, res) => {
    const translationService = require('../services/translation.service.js');
    try {
        const result = await translationService.getTranslations(req.params.nftId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/translation/pending/requests', async (req, res) => {
    const translationService = require('../services/translation.service.js');
    try {
        const result = await translationService.getPendingTranslations(req.query);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/translation/languages', async (req, res) => {
    const translationService = require('../services/translation.service.js');
    res.status(200).json(translationService.getSupportedLanguages());
});

// ==================== ECOSYSTEM ROUTES (10 Economic Pillars) ====================

// Pillar 5: Giving & Stewardship
router.post('/ecosystem/sponsorships', ecosystemctrl.createSponsorship);
router.get('/ecosystem/sponsorships', ecosystemctrl.getSponsorships);
router.post('/ecosystem/crowdfunding', ecosystemctrl.createCrowdfunding);
router.get('/ecosystem/crowdfunding', ecosystemctrl.getCrowdfunding);
router.post('/ecosystem/crowdfunding/:campaignId/contribute', ecosystemctrl.contributeToCampaign);

// Pillar 6: Cultural Tourism
router.post('/ecosystem/experiences', ecosystemctrl.createExperience);
router.get('/ecosystem/experiences', ecosystemctrl.getExperiences);

// Pillar 7: Language & Heritage
router.post('/ecosystem/archive', ecosystemctrl.createArchiveItem);
router.get('/ecosystem/archive', ecosystemctrl.getArchiveItems);

// Pillar 8: Land & Food
router.post('/ecosystem/food', ecosystemctrl.createFoodProduct);
router.get('/ecosystem/food', ecosystemctrl.getFoodProducts);

// Pillar 9: Advocacy & Legal
router.post('/ecosystem/legal', ecosystemctrl.createLegalCase);
router.get('/ecosystem/legal', ecosystemctrl.getLegalCases);
router.post('/ecosystem/legal/:caseId/contribute', ecosystemctrl.contributeToLegal);

// Pillar 10: Materials & Tools
router.post('/ecosystem/supplies', ecosystemctrl.createSupplyListing);
router.get('/ecosystem/supplies', ecosystemctrl.getSupplyListings);

// Ecosystem Overview
router.get('/ecosystem/overview', ecosystemctrl.getEcosystemOverview);

// ==================== REVENUE STREAMS ====================

// Revenue Stream #1: Firekeeper Fee (Transaction Fees)
router.post('/revenue/calculate', revenuctrl.calculateFees);
router.post('/revenue/process', revenuctrl.processTransaction);
router.get('/revenue/dashboard', revenuctrl.getRevenueDashboard);
router.get('/revenue/artist/:address', revenuctrl.getArtistEarnings);
router.get('/revenue/fees', revenuctrl.getFeeStructure);

// Revenue Stream #2: Circle of Support (Subscriptions)
router.get('/subscriptions/plans', subscriptionctrl.getPlans);
router.get('/subscriptions/plans/:planId', subscriptionctrl.getPlan);
router.post('/subscriptions/plans/:planId/calculate', subscriptionctrl.calculatePrice);
router.post('/subscriptions/plans/:planId/subscribe', subscriptionctrl.createSubscription);
router.get('/subscriptions/my-subscriptions', subscriptionctrl.getMySubscriptions);
router.get('/subscriptions/my-fee-rate', subscriptionctrl.getMyFeeRate);
router.get('/subscriptions/buyer-fees-status', subscriptionctrl.getBuyerFeesStatus);
router.get('/subscriptions/check-feature/:feature', subscriptionctrl.checkFeature);
router.post('/subscriptions/:subscriptionId/cancel', subscriptionctrl.cancelSubscription);

// Premium Placements & Featured Listings
router.get('/placements/types', premiumPlacementctrl.getPlacementTypes);
router.get('/placements/types/:typeId', premiumPlacementctrl.getPlacementType);
router.post('/placements/types/:typeId/calculate', premiumPlacementctrl.calculatePrice);
router.get('/placements/types/:typeId/availability', premiumPlacementctrl.checkAvailability);
router.post('/placements/types/:typeId/book', premiumPlacementctrl.bookPlacement);
router.post('/placements/:placementId/confirm', premiumPlacementctrl.confirmPlacement);
router.get('/placements/active/:typeId', premiumPlacementctrl.getActivePlacements);
router.get('/placements/my-placements', premiumPlacementctrl.getMyPlacements);
router.post('/placements/calculate-package', premiumPlacementctrl.calculatePackage);
router.post('/placements/:placementId/cancel', premiumPlacementctrl.cancelPlacement);
router.get('/placements/homepage', premiumPlacementctrl.getHomepagePlacements);
router.get('/placements/pillar/:pillar', premiumPlacementctrl.getPillarFeatured);

// Page-Specific Premium Placement Endpoints
router.get('/placements/page/digital-arts', premiumPlacementctrl.getDigitalArtsPlacements);
router.get('/placements/page/courses', premiumPlacementctrl.getCoursesPlacements);
router.get('/placements/page/cultural-tourism', premiumPlacementctrl.getCulturalTourismPlacements);
router.get('/placements/page/language-heritage', premiumPlacementctrl.getLanguageHeritagePlacements);
router.get('/placements/page/trending', premiumPlacementctrl.getTrendingPlacements);
router.get('/placements/page/community', premiumPlacementctrl.getCommunityPlacements);
router.get('/placements/overview', premiumPlacementctrl.getAllPagePlacements);

// ==================== LANGUAGE & HERITAGE MARKETPLACE (Pillar 7) ====================
router.get('/language-heritage/listings', languageHeritctrl.getListings);
router.get('/language-heritage/languages', languageHeritctrl.getLanguagesDirectory);
router.get('/language-heritage/communities/:communityId', languageHeritctrl.getCommunityProfile);
router.get('/language-heritage/dictionary/:entryId', languageHeritctrl.getDictionaryEntry);
router.get('/language-heritage/recordings/:recordingId', languageHeritctrl.getRecordingDetail);
router.get('/language-heritage/tools/:toolId', languageHeritctrl.getToolDetail);
router.post('/language-heritage/events', heritageEventLimiter, languageHeritctrl.trackEvent);
router.get('/language-heritage/overview', languageHeritctrl.getOverview);
router.post('/language-heritage/listings/:listingId/access-request', heritageMutationLimiter, languageHeritctrl.requestAccess);
router.post('/language-heritage/listings/:listingId/payment-intent', heritageMutationLimiter, languageHeritctrl.createPaymentIntent);
router.post('/language-heritage/listings/:listingId/payment-confirm', heritageMutationLimiter, languageHeritctrl.confirmPayment);
router.get('/language-heritage/receipts/me', languageHeritctrl.getMyReceipts);
router.get('/language-heritage/access-requests/me', languageHeritctrl.getMyAccessRequests);
router.get('/language-heritage/access-requests/queue', requireAdminWallet, languageHeritctrl.getAccessRequestQueue);
router.post('/language-heritage/access-requests/:requestId/decision', requireAdminWallet, heritageMutationLimiter, languageHeritctrl.decideAccessRequest);

// SEVA Feature - Community Projects & Donations
const seva2ctrl = require('../controllers/seva2.controller');

// Project Management
router.post('/seva/projects', seva2ctrl.submitProject);
router.get('/seva/projects', seva2ctrl.getProjects);
router.get('/seva/projects/featured', seva2ctrl.getFeaturedProjects);
router.get('/seva/projects/:projectId', seva2ctrl.getProject);
router.put('/seva/projects/:projectId', seva2ctrl.updateProject);
router.post('/seva/projects/:projectId/approve', seva2ctrl.approveProject);
router.post('/seva/projects/:projectId/updates', seva2ctrl.addProjectUpdate);
router.post('/seva/projects/:projectId/complete', seva2ctrl.completeProject);

// Donations
router.post('/seva/donations', seva2ctrl.createDonation);
router.get('/seva/donations/:donationId', seva2ctrl.getDonation);
router.post('/seva/donations/:donationId/process', seva2ctrl.processDonation);

// Checkout Integration
router.get('/seva/checkout-prompt', seva2ctrl.getCheckoutPrompt);

// User Impact Dashboard
router.get('/seva/impact/:walletAddress', seva2ctrl.getUserImpact);

// Stats & Analytics
router.get('/seva/stats', seva2ctrl.getSevaStats);
router.get('/seva/leaderboard', seva2ctrl.getLeaderboard);
router.get('/seva/stats/monthly', seva2ctrl.getMonthlyStats);

// Corporate Matching
router.post('/seva/donations/:donationId/corporate-match', seva2ctrl.submitCorporateMatch);
router.post('/seva/donations/:donationId/corporate-match/approve', seva2ctrl.approveCorporateMatch);

// ==================== ADVANCED ROYALTY SYSTEM ====================
const royaltyctrl = require('../controllers/royalty.controller.js');

// Royalty Analytics
router.get('/royalty/analytics/:address', royaltyctrl.getRoyaltyAnalytics);
router.get('/royalty/leaderboard', royaltyctrl.getRoyaltyLeaderboard);

// Multi-Beneficiary Royalties
router.post('/royalty/beneficiaries/:nftId', royaltyctrl.setBeneficiaries);
router.get('/royalty/beneficiaries/:nftId', royaltyctrl.getBeneficiaries);
router.post('/royalty/distribute/:earningId', royaltyctrl.distributeRoyalty);

// Tiered Royalty System
router.post('/royalty/tier/:nftId', royaltyctrl.setRoyaltyTier);
router.post('/royalty/calculate-tiered/:nftId', royaltyctrl.calculateTieredRoyalty);

// Royalty Claims & Payouts
router.get('/royalty/claimable/:address', royaltyctrl.getClaimableEarnings);
router.post('/royalty/claim/:address', royaltyctrl.createClaim);
router.get('/royalty/claims/:address', royaltyctrl.getClaimHistory);

// Smart Royalty Rules
router.post('/royalty/smart-rules/:nftId', royaltyctrl.applySmartRules);

// Royalty Notifications
router.get('/royalty/notifications/:address', royaltyctrl.getNotifications);
router.put('/royalty/notifications/:notificationId/read', royaltyctrl.markNotificationRead);

// Cross-Platform Tracking
router.post('/royalty/external', royaltyctrl.recordExternalRoyalty);
router.get('/royalty/aggregated/:address', royaltyctrl.getAggregatedRoyalties);

// ==================== AI & MACHINE LEARNING ====================
const aictrl = require('../controllers/ai.controller.js');

// Art Authentication
router.post('/ai/authenticate/:nftId', aictrl.authenticateArtwork);
router.get('/ai/authenticate/patterns', aictrl.getAuthenticPatterns);
router.post('/ai/authenticate/patterns', aictrl.registerAuthenticPattern);

// Smart Pricing
router.post('/ai/pricing/:nftId', aictrl.getPricingRecommendation);
router.post('/ai/pricing/batch', aictrl.getBatchPricing);
router.get('/ai/market-analysis/:category', aictrl.getMarketAnalysis);
router.post('/ai/market-data/update', aictrl.updateMarketData);

// Voice Transcription
router.post('/ai/transcribe', aictrl.transcribeAudio);
router.post('/ai/translate', aictrl.translateTranscription);
router.post('/ai/generate-tags', aictrl.generateTagsFromAudio);
router.get('/ai/languages', aictrl.getSupportedLanguages);
router.post('/ai/transcribe/batch', aictrl.batchTranscribe);

// Content Moderation
router.post('/ai/moderate', aictrl.moderateContent);
router.get('/ai/moderation/guidelines', aictrl.getModerationGuidelines);
router.post('/ai/moderate/batch', aictrl.batchModerate);

// Combined AI Analysis
router.post('/ai/analyze/:nftId', aictrl.analyzeArtworkComplete);

// ==================== ADVANCED ANALYTICS & REPORTING ====================
const analyticsctrl = require('../controllers/analytics.controller.js');

// Real-time Dashboard
router.get('/analytics/realtime', analyticsctrl.getRealtimeStats);
router.get('/analytics/market-overview', analyticsctrl.getMarketOverview);
router.get('/analytics/sales-feed', analyticsctrl.getSalesFeed);

// Predictive Analytics
router.get('/analytics/forecast/market', analyticsctrl.forecastMarketTrends);
router.post('/analytics/predict/price/:nftId', analyticsctrl.predictPrice);
router.get('/analytics/predict/demand/:category/:nation', analyticsctrl.predictDemand);
router.get('/analytics/trends/emerging', analyticsctrl.identifyEmergingTrends);
router.get('/analytics/forecast/seasonal', analyticsctrl.getSeasonalForecast);

// Artist Career Tracking
router.get('/analytics/career/:address', analyticsctrl.getCareerDashboard);
router.get('/analytics/leaderboard', analyticsctrl.getArtistLeaderboard);
router.get('/analytics/achievements/:address', analyticsctrl.getArtistAchievements);
router.get('/analytics/trajectory/:address', analyticsctrl.getArtistGrowthTrajectory);

// Market Intelligence
router.get('/analytics/market-intelligence', analyticsctrl.getMarketIntelligenceReport);
router.get('/analytics/competitors', analyticsctrl.getCompetitorAnalysis);
router.get('/analytics/pricing-trends', analyticsctrl.getPricingTrends);
router.get('/analytics/opportunities', analyticsctrl.getMarketOpportunities);
router.post('/analytics/pricing-intelligence/:nftId', analyticsctrl.getPricingIntelligence);
router.get('/analytics/alerts', analyticsctrl.getMarketAlerts);

// Cultural Impact
router.get('/analytics/cultural-impact', analyticsctrl.getCulturalImpactReport);
router.get('/analytics/impact/realtime', analyticsctrl.getRealtimeImpact);
router.get('/analytics/impact/nation/:nation', analyticsctrl.getImpactByNation);
router.get('/analytics/preservation', analyticsctrl.getPreservationEfforts);
router.get('/analytics/language-impact', analyticsctrl.getLanguageImpact);

// Combined Analytics
router.get('/analytics/comprehensive/:address', analyticsctrl.getComprehensiveAnalytics);
router.get('/analytics/dashboard-summary', analyticsctrl.getDashboardSummary);

// ==================== SECURITY & COMPLIANCE ====================
const securityctrl = require('../controllers/security.controller.js');

// KYC/Identity Verification
router.post('/security/verification/:address', securityctrl.submitVerification);
router.post('/security/verification/:submissionId/review', securityctrl.reviewVerification);
router.get('/security/verification/:address/status', securityctrl.getVerificationStatus);
router.post('/security/verification/:address/heritage', securityctrl.submitHeritageVerification);
router.post('/security/verification/:submissionId/elder/:elderAddress/review', securityctrl.elderReviewHeritage);
router.get('/security/verification/stats', securityctrl.getVerificationStats);
router.post('/security/verification/:address/revoke', securityctrl.revokeVerification);

// Elder Digital Signatures
router.post('/security/elder/approval', securityctrl.requestElderApproval);
router.post('/security/elder/approval/:approvalId/sign/:elderAddress', securityctrl.elderSign);
router.post('/security/elder/approval/multi', securityctrl.requestMultiElderApproval);
router.get('/security/elder/approval/:approvalId/multi-status', securityctrl.checkMultiSignatureStatus);
router.get('/security/elder/approval/:approvalId/status', securityctrl.getApprovalStatus);
router.post('/security/elder/approval/:approvalId/verify', securityctrl.verifyContentIntegrity);
router.get('/security/elder/:elderAddress/profile', securityctrl.getElderProfile);
router.get('/security/elders', securityctrl.listElders);
router.get('/security/elder/stats', securityctrl.getApprovalStats);

// Blockchain Audit Trail
router.post('/security/audit/log', securityctrl.logEvent);
router.get('/security/audit/:resourceType/:resourceId', securityctrl.getAuditTrail);
router.get('/security/audit/user/:address', securityctrl.getUserAuditTrail);
router.get('/security/audit/verify/:logId', securityctrl.verifyLog);
router.post('/security/audit/snapshot', securityctrl.createSnapshot);
router.post('/security/audit/compliance-report', securityctrl.generateComplianceReport);
router.post('/security/audit/search', securityctrl.searchAuditLogs);
router.post('/security/audit/archive', securityctrl.archiveOldLogs);

// GDPR Compliance
router.post('/security/consent/:address', securityctrl.recordConsent);
router.post('/security/consent/:address/withdraw', securityctrl.withdrawConsent);
router.get('/security/consent/:address/status', securityctrl.getConsentStatus);
router.get('/security/gdpr/data-access/:address', securityctrl.handleDataAccessRequest);
router.get('/security/gdpr/data-portability/:address', securityctrl.handleDataPortabilityRequest);
router.post('/security/gdpr/data-deletion/:address', securityctrl.handleDataDeletionRequest);
router.post('/security/gdpr/data-rectification/:address', securityctrl.handleDataRectification);
router.post('/security/gdpr/processing-activity', securityctrl.recordProcessingActivity);
router.post('/security/gdpr/lawful-check/:address', securityctrl.checkProcessingLawful);
router.get('/security/gdpr/privacy-report', securityctrl.generatePrivacyReport);
router.post('/security/gdpr/data-breach', securityctrl.handleDataBreach);

// Fraud Detection
router.post('/security/fraud/transaction', securityctrl.analyzeTransaction);
router.get('/security/fraud/account/:address', securityctrl.analyzeAccount);
router.post('/security/fraud/content', securityctrl.analyzeContent);
router.get('/security/fraud/monitor', securityctrl.monitorSuspiciousActivity);
router.post('/security/fraud/report', securityctrl.reportSuspiciousActivity);
router.get('/security/fraud/statistics', securityctrl.getFraudStatistics);
router.get('/security/fraud/risk-score/:address', securityctrl.getUserRiskScore);

// Security Overview
router.get('/security/overview', securityctrl.getSecurityOverview);

// ==================== COMMUNITY & SOCIAL ====================
const communityctrl = require('../controllers/community.controller.js');

// Mentorship
router.post('/community/mentors/register', communityctrl.registerMentor);
router.post('/community/mentorship/apply/:address', communityctrl.applyForMentorship);
router.post('/community/mentorship/match/:applicationId', communityctrl.createMatch);
router.post('/community/mentorship/session/:matchId', communityctrl.scheduleSession);
router.post('/community/mentorship/session/:matchId/:sessionId/complete', communityctrl.completeSession);
router.get('/community/mentorship/dashboard/:address', communityctrl.getMentorshipDashboard);
router.get('/community/mentors', communityctrl.getAvailableMentors);
router.post('/community/mentorship/end/:matchId', communityctrl.endMentorship);
router.get('/community/mentorship/stats', communityctrl.getMentorshipStats);

// Forums
router.get('/community/forums', communityctrl.getAllForums);
router.get('/community/forums/:forumId', communityctrl.getForum);
router.post('/community/forums/:forumId/topics', communityctrl.createTopic);
router.get('/community/topics/:topicId', communityctrl.getTopic);
router.post('/community/topics/:topicId/reply', communityctrl.createReply);
router.get('/community/forums/search', communityctrl.searchForums);

// Events
router.post('/community/events', communityctrl.createEvent);
router.post('/community/events/:eventId/publish', communityctrl.publishEvent);
router.get('/community/events/:eventId', communityctrl.getEvent);
router.get('/community/events', communityctrl.getEvents);
router.post('/community/events/:eventId/register', communityctrl.registerForEvent);
router.post('/community/events/:eventId/checkin/:registrationId', communityctrl.checkIn);
router.get('/community/events/registrations/:address', communityctrl.getUserRegistrations);

// Collaboration
router.post('/community/workspaces', communityctrl.createWorkspace);
router.post('/community/workspaces/:workspaceId/invite', communityctrl.inviteMember);
router.post('/community/workspaces/invitations/:invitationId/accept', communityctrl.acceptInvitation);
router.post('/community/workspaces/:workspaceId/assets', communityctrl.addAsset);
router.post('/community/workspaces/:workspaceId/tasks', communityctrl.createTask);
router.get('/community/workspaces/:workspaceId', communityctrl.getWorkspace);
router.get('/community/workspaces/user/:address', communityctrl.getUserWorkspaces);

// Storytelling
router.post('/community/stories', communityctrl.createStory);
router.post('/community/stories/:storyId/recordings', communityctrl.addRecording);
router.post('/community/stories/:storyId/translations', communityctrl.addTranslation);
router.post('/community/stories/:storyId/translations/:translationId/verify', communityctrl.verifyTranslation);
router.get('/community/stories/:storyId', communityctrl.getStory);
router.get('/community/stories', communityctrl.getStories);
router.post('/community/story-collections', communityctrl.createCollection);
router.post('/community/story-collections/:collectionId/stories/:storyId', communityctrl.addToCollection);
router.get('/community/story-collections/:collectionId', communityctrl.getCollection);
router.get('/community/stories/search', communityctrl.searchStories);

// ==================== FINANCIAL SERVICES ====================
const financectrl = require('../controllers/finance.controller.js');

// INDI Token
router.post('/finance/wallet', financectrl.createWallet);
router.get('/finance/wallet/:address', financectrl.getWallet);
router.post('/finance/transfer', financectrl.transfer);
router.post('/finance/stake', financectrl.stakeTokens);
router.post('/finance/unstake', financectrl.unstakeTokens);
router.get('/finance/history/:address', financectrl.getTransactionHistory);
router.get('/finance/tokenomics', financectrl.getTokenomics);
router.get('/finance/fee', financectrl.getPlatformFee);

// Escrow
router.post('/finance/escrow', financectrl.createEscrow);
router.post('/finance/escrow/:escrowId/delivered', financectrl.markDelivered);
router.post('/finance/escrow/:escrowId/release', financectrl.releaseEscrow);
router.post('/finance/escrow/:escrowId/dispute', financectrl.raiseDispute);
router.post('/finance/disputes/:disputeId/resolve', financectrl.resolveDispute);
router.post('/finance/escrow/:escrowId/cancel', financectrl.cancelEscrow);
router.get('/finance/escrow/:escrowId', financectrl.getEscrow);
router.get('/finance/escrows/:address', financectrl.getUserEscrows);

// Installments
router.get('/finance/credit-score/:address', financectrl.calculateCreditScore);
router.post('/finance/installments', financectrl.createInstallmentPlan);
router.post('/finance/installments/:planId/activate', financectrl.activateInstallmentPlan);
router.post('/finance/installments/:planId/payment', financectrl.makeInstallmentPayment);
router.get('/finance/installments/:planId', financectrl.getInstallmentPlan);
router.get('/finance/installments/user/:address', financectrl.getUserInstallmentPlans);

// Fiat Bridge
router.get('/finance/rates', financectrl.getExchangeRates);
router.get('/finance/convert', financectrl.calculateConversion);
router.post('/finance/sell', financectrl.createSellRequest);
router.post('/finance/buy', financectrl.createBuyRequest);
router.post('/finance/conversions/:conversionId/confirm', financectrl.confirmFiatPayment);
router.get('/finance/conversions/:conversionId', financectrl.getConversion);
router.get('/finance/conversions/user/:address', financectrl.getUserConversions);
router.get('/finance/payment-methods', financectrl.getPaymentMethods);

// Tax Reporting
router.post('/finance/tax/record', financectrl.recordTaxTransaction);
router.post('/finance/tax/report', financectrl.generateTaxReport);
router.get('/finance/tax/report/:userAddress/:year', financectrl.getTaxReport);
router.get('/finance/tax/export/:userAddress/:year/:format', financectrl.exportTaxReport);
router.get('/finance/tax/jurisdictions', financectrl.getTaxJurisdictions);
router.get('/finance/tax/optimize/:userAddress/:year', financectrl.getTaxOptimization);

// Micro-Loans
router.get('/finance/loan-programs', financectrl.getLoanPrograms);
router.get('/finance/loan-eligibility/:address/:programId', financectrl.checkLoanEligibility);
router.post('/finance/loans/apply', financectrl.applyForLoan);
router.post('/finance/loans/:loanId/approve', financectrl.approveLoan);
router.post('/finance/loans/:loanId/payment', financectrl.makeLoanPayment);
router.get('/finance/loans/:loanId', financectrl.getLoan);
router.get('/finance/loans/user/:address', financectrl.getUserLoans);

// ==================== LOGISTICS & OPERATIONS ====================
const logisticsctrl = require('../controllers/logistics.controller.js');

// Shipping
router.post('/logistics/shipping/rates', logisticsctrl.calculateShippingRates);
router.post('/logistics/shipping', logisticsctrl.createShipment);
router.post('/logistics/shipping/:shipmentId/pickup', logisticsctrl.schedulePickup);
router.get('/logistics/shipping/track/:trackingNumber', logisticsctrl.trackShipment);
router.post('/logistics/shipping/:trackingNumber/status', logisticsctrl.updateShipmentStatus);
router.get('/logistics/pickup-locations', logisticsctrl.getPickupLocations);

// Insurance
router.post('/logistics/insurance/quote', logisticsctrl.getInsuranceQuote);
router.post('/logistics/insurance/policy', logisticsctrl.purchasePolicy);
router.post('/logistics/insurance/:policyId/activate', logisticsctrl.activatePolicy);
router.post('/logistics/insurance/:policyId/claim', logisticsctrl.fileClaim);
router.post('/logistics/insurance/claims/:claimId/review', logisticsctrl.reviewClaim);
router.post('/logistics/insurance/claims/:claimId/payout', logisticsctrl.processPayout);
router.get('/logistics/insurance/:policyId', logisticsctrl.getPolicy);
router.get('/logistics/insurance/policies/:address', logisticsctrl.getUserPolicies);
router.post('/logistics/insurance/:policyId/extend', logisticsctrl.extendPolicy);
router.post('/logistics/insurance/:policyId/cancel', logisticsctrl.cancelPolicy);

// Inventory
router.post('/logistics/inventory', logisticsctrl.addInventoryItem);
router.post('/logistics/inventory/:inventoryId/move', logisticsctrl.moveInventoryItem);
router.post('/logistics/inventory/:inventoryId/condition', logisticsctrl.updateCondition);
router.post('/logistics/inventory/:inventoryId/appraisal', logisticsctrl.updateAppraisal);
router.get('/logistics/inventory/:inventoryId', logisticsctrl.getInventoryItem);
router.get('/logistics/inventory/owner/:address', logisticsctrl.getOwnerInventory);
router.get('/logistics/inventory/warehouse/:warehouseId', logisticsctrl.getWarehouseInventory);
router.get('/logistics/warehouses', logisticsctrl.getWarehouses);
router.post('/logistics/inventory/:inventoryId/sold', logisticsctrl.markSold);
router.get('/logistics/inventory/:inventoryId/movements', logisticsctrl.getMovementHistory);

// Verification
router.post('/logistics/verification/tags', logisticsctrl.generateTag);
router.post('/logistics/verification/tags/:tagId/activate', logisticsctrl.activateTag);
router.post('/logistics/verification/verify', logisticsctrl.verifyArtwork);
router.post('/logistics/verification/counterfeit', logisticsctrl.reportCounterfeit);
router.post('/logistics/verification/tags/batch', logisticsctrl.batchGenerateTags);
router.get('/logistics/verification/tags/:tagId/stats', logisticsctrl.getTagStats);
router.post('/logistics/verification/tags/:tagId/transfer', logisticsctrl.transferTag);
router.post('/logistics/verification/tags/:tagId/deactivate', logisticsctrl.deactivateTag);

// Warehouse
router.post('/logistics/warehouse/work-orders', logisticsctrl.createWorkOrder);
router.post('/logistics/warehouse/work-orders/:workOrderId/assign', logisticsctrl.assignWorkOrder);
router.post('/logistics/warehouse/work-orders/:workOrderId/start', logisticsctrl.startWorkOrder);
router.post('/logistics/warehouse/work-orders/:workOrderId/tasks/:taskIndex/complete', logisticsctrl.completeTask);
router.post('/logistics/warehouse/work-orders/:workOrderId/inspection', logisticsctrl.recordInspection);
router.get('/logistics/warehouse/work-orders/:workOrderId', logisticsctrl.getWorkOrder);
router.get('/logistics/warehouse/work-orders', logisticsctrl.getPendingWorkOrders);
router.post('/logistics/warehouse/staff', logisticsctrl.registerStaff);
router.get('/logistics/warehouse/:warehouseId/dashboard', logisticsctrl.getWarehouseDashboard);

// ==================== 10 PILLARS MARKETPLACES ====================
const pillarsctrl = require('../controllers/pillars.controller.js');

// PILLAR 1: DIGITAL ARTS
router.post('/pillars/digital-arts', pillarsctrl.createDigitalArtListing);
router.post('/pillars/digital-arts/:listingId/mint', pillarsctrl.mintDigitalArtNFT);
router.get('/pillars/digital-arts', pillarsctrl.getDigitalArtListings);

// PILLAR 2: PHYSICAL ITEMS
router.post('/pillars/physical-items', pillarsctrl.createPhysicalProduct);
router.post('/pillars/physical-items/orders', pillarsctrl.createPhysicalOrder);
router.get('/pillars/physical-items', pillarsctrl.getPhysicalProducts);

// PILLAR 3: COURSES
router.post('/pillars/courses', pillarsctrl.createCourse);
router.post('/pillars/courses/:courseId/enroll', pillarsctrl.enrollInCourse);
router.post('/pillars/enrollments/:enrollmentId/lessons', pillarsctrl.completeLesson);
router.get('/pillars/courses', pillarsctrl.getCourses);

// PILLAR 4: FREELANCING
router.post('/pillars/freelancing/profiles', pillarsctrl.createFreelancerProfile);
router.post('/pillars/freelancing/gigs', pillarsctrl.createGig);
router.post('/pillars/freelancing/contracts', pillarsctrl.createContract);
router.post('/pillars/freelancing/contracts/:contractId/fund', pillarsctrl.fundEscrow);
router.post('/pillars/freelancing/contracts/:contractId/complete', pillarsctrl.completeContract);
router.post('/pillars/freelancing/contracts/:contractId/review', pillarsctrl.submitReview);
router.get('/pillars/freelancing/gigs', pillarsctrl.getGigs);
router.get('/pillars/freelancing/professionals', pillarsctrl.getFreelancers);

// PILLAR 5: SEVA (GIVING)
router.post('/pillars/seva/campaigns', pillarsctrl.createCampaign);
router.post('/pillars/seva/campaigns/:campaignId/donate', pillarsctrl.donate);
router.post('/pillars/seva/sponsorships', pillarsctrl.createSponsorship);
router.post('/pillars/seva/honorariums', pillarsctrl.createHonorarium);
router.get('/pillars/seva/campaigns', pillarsctrl.getCampaigns);
router.get('/pillars/seva/donations/:address', pillarsctrl.getDonationHistory);

// PILLAR 6: CULTURAL TOURISM
router.post('/pillars/tourism/experiences', pillarsctrl.createExperience);
router.post('/pillars/tourism/accommodations', pillarsctrl.createAccommodation);
router.post('/pillars/tourism/festivals', pillarsctrl.createFestival);
router.post('/pillars/tourism/experiences/:experienceId/book', pillarsctrl.bookExperience);
router.post('/pillars/tourism/accommodations/:accommodationId/book', pillarsctrl.bookAccommodation);
router.post('/pillars/tourism/festivals/:festivalId/tickets', pillarsctrl.buyFestivalTicket);
router.get('/pillars/tourism/experiences', pillarsctrl.getExperiences);

// PILLAR 7: LANGUAGE & HERITAGE
router.post('/pillars/language/archives', pillarsctrl.createArchive);
router.post('/pillars/language/archives/:archiveId/subscribe', pillarsctrl.subscribeToArchive);
router.post('/pillars/language/tools', pillarsctrl.createLanguageTool);
router.post('/pillars/language/translations', pillarsctrl.requestTranslation);
router.get('/pillars/language/archives', pillarsctrl.getArchives);
router.get('/pillars/language/tools', pillarsctrl.getLanguageTools);

// PILLAR 8: LAND & FOOD
router.post('/pillars/land-food/products', pillarsctrl.createLandFoodProduct);
router.post('/pillars/land-food/seeds', pillarsctrl.createSeedListing);
router.post('/pillars/land-food/stewardship', pillarsctrl.createStewardshipProject);
router.post('/pillars/land-food/stewardship/:projectId/contribute', pillarsctrl.contributeToStewardship);
router.post('/pillars/land-food/orders', pillarsctrl.createLandFoodOrder);
router.get('/pillars/land-food/products', pillarsctrl.getLandFoodProducts);
router.get('/pillars/land-food/seeds', pillarsctrl.getSeeds);
router.get('/pillars/land-food/stewardship', pillarsctrl.getStewardshipProjects);

// PILLAR 9: ADVOCACY & LEGAL
router.post('/pillars/advocacy/cases', pillarsctrl.createDefenseCase);
router.post('/pillars/advocacy/cases/:caseId/contribute', pillarsctrl.contributeToDefense);
router.post('/pillars/advocacy/professionals', pillarsctrl.registerLegalProfessional);
router.post('/pillars/advocacy/alerts', pillarsctrl.createPolicyAlert);
router.post('/pillars/advocacy/assistance', pillarsctrl.requestLegalAssistance);
router.get('/pillars/advocacy/cases', pillarsctrl.getDefenseCases);
router.get('/pillars/advocacy/professionals', pillarsctrl.getLegalProfessionals);
router.get('/pillars/advocacy/alerts', pillarsctrl.getPolicyAlerts);

// PILLAR 10: MATERIALS & TOOLS
router.post('/pillars/materials/products', pillarsctrl.createMaterialsProduct);
router.post('/pillars/materials/tool-library', pillarsctrl.addToolToLibrary);
router.post('/pillars/materials/tool-library/:toolId/rent', pillarsctrl.rentTool);
router.post('/pillars/materials/bulk-orders', pillarsctrl.createBulkOrder);
router.get('/pillars/materials/products', pillarsctrl.getMaterialsProducts);
router.get('/pillars/materials/tool-library', pillarsctrl.getToolLibrary);

// ==================== PHASE 9: INTEGRATION ECOSYSTEM ====================
const integrationctrl = require('../controllers/integration.controller.js');

// XRPL DEX Integration
router.get('/integration/dex/price', integrationctrl.getIndiPrice);
router.get('/integration/dex/orderbook', integrationctrl.getOrderBook);
router.post('/integration/dex/orders', integrationctrl.placeLimitOrder);
router.post('/integration/dex/swap', integrationctrl.executeSwap);
router.post('/integration/dex/liquidity/add', integrationctrl.addLiquidity);
router.post('/integration/dex/liquidity/remove', integrationctrl.removeLiquidity);
router.get('/integration/dex/liquidity/:user', integrationctrl.getLiquidityPosition);
router.get('/integration/dex/trades/:user', integrationctrl.getTradeHistory);
router.post('/integration/dex/orders/:orderId/cancel', integrationctrl.cancelOrder);

// IPFS Storage Integration
router.post('/integration/ipfs/upload', integrationctrl.uploadFile);
router.post('/integration/ipfs/upload-metadata', integrationctrl.uploadNFTMetadata);
router.post('/integration/ipfs/upload-batch', integrationctrl.uploadBatch);
router.get('/integration/ipfs/:cid', integrationctrl.getFile);
router.post('/integration/ipfs/pin', integrationctrl.pinCID);
router.post('/integration/ipfs/unpin/:pinId', integrationctrl.unpinFile);
router.get('/integration/ipfs/usage/:user', integrationctrl.getStorageUsage);
router.get('/integration/ipfs/verify/:cid', integrationctrl.verifyIntegrity);
router.get('/integration/ipfs/report', integrationctrl.getStorageReport);

// Chainlink Oracle Integration
router.get('/integration/oracle/price/:pair', integrationctrl.getLatestPrice);
router.post('/integration/oracle/prices', integrationctrl.getMultiplePrices);
router.get('/integration/oracle/history/:pair', integrationctrl.getPriceHistory);
router.post('/integration/oracle/request', integrationctrl.requestExternalData);
router.get('/integration/oracle/request/:requestId', integrationctrl.getRequestStatus);
router.post('/integration/oracle/automation', integrationctrl.registerAutomation);
router.get('/integration/oracle/automation/:jobId', integrationctrl.getAutomationStatus);
router.post('/integration/oracle/verify/:pair', integrationctrl.verifyPrice);

// Fiat Payment Integration
router.post('/integration/payments/stripe', integrationctrl.createStripePayment);
router.post('/integration/payments/stripe/:paymentIntentId/confirm', integrationctrl.confirmStripePayment);
router.post('/integration/payments/paypal', integrationctrl.createPayPalOrder);
router.post('/integration/payments/paypal/:orderId/capture', integrationctrl.capturePayPalPayment);
router.post('/integration/payments/payout', integrationctrl.processPayout);
router.post('/integration/payments/subscriptions', integrationctrl.createSubscription);
router.post('/integration/payments/subscriptions/:subscriptionId/cancel', integrationctrl.cancelSubscription);
router.post('/integration/payments/webhook/:provider', integrationctrl.handleWebhook);
router.get('/integration/payments/history/:user', integrationctrl.getFiatTransactionHistory);

// Social Media API Integration
router.post('/integration/social/connect', integrationctrl.connectSocialAccount);
router.post('/integration/social/disconnect/:connectionId', integrationctrl.disconnectSocialAccount);
router.post('/integration/social/share', integrationctrl.shareToSocial);
router.post('/integration/social/schedule', integrationctrl.schedulePost);
router.get('/integration/social/scheduled/:user', integrationctrl.getScheduledPosts);
router.post('/integration/social/cancel/:scheduleId', integrationctrl.cancelScheduledPost);
router.get('/integration/social/analytics/:user', integrationctrl.getSocialAnalytics);
router.post('/integration/social/cross-post', integrationctrl.crossPost);
router.get('/integration/social/accounts/:user', integrationctrl.getConnectedAccounts);

// ==================== PHASE 10: GOVERNANCE & DAO ====================
const governancectrl = require('../controllers/governance.controller.js');

// DAO Membership
router.post('/governance/join', governancectrl.joinDAO);
router.post('/governance/delegate', governancectrl.delegateVotingPower);
router.post('/governance/delegate/revoke', governancectrl.revokeDelegation);
router.post('/governance/roles/assign', governancectrl.assignRole);
router.get('/governance/members/:address', governancectrl.getMember);
router.get('/governance/members', governancectrl.getAllMembers);
router.post('/governance/leave', governancectrl.leaveDAO);

// Voting System
router.post('/governance/votes', governancectrl.createVote);
router.post('/governance/votes/cast', governancectrl.castVote);
router.post('/governance/votes/cast-ranked', governancectrl.castRankedVote);
router.get('/governance/votes/:voteId/results', governancectrl.getVoteResults);
router.post('/governance/votes/:voteId/finalize', governancectrl.finalizeVote);
router.get('/governance/votes/active', governancectrl.getActiveVotes);
router.get('/governance/votes/:voteId/voter/:voter', governancectrl.getVoterVote);

// Treasury
router.get('/governance/treasury/balance', governancectrl.getTreasuryBalance);
router.post('/governance/treasury/spending', governancectrl.createSpendingProposal);
router.post('/governance/treasury/proposals/:proposalId/sign', governancectrl.signProposal);
router.post('/governance/treasury/allocate', governancectrl.allocateBudget);
router.post('/governance/treasury/allocations/:allocationId/approve', governancectrl.approveAllocation);
router.get('/governance/treasury/budget', governancectrl.getBudgetStatus);
router.get('/governance/treasury/transactions', governancectrl.getTreasuryTransactions);
router.get('/governance/treasury/pending', governancectrl.getPendingProposals);
router.post('/governance/treasury/deposit', governancectrl.depositToTreasury);

// Proposals
router.post('/governance/proposals', governancectrl.createProposal);
router.post('/governance/proposals/:proposalId/discuss', governancectrl.submitForDiscussion);
router.post('/governance/proposals/:proposalId/vote', governancectrl.startVoting);
router.post('/governance/proposals/:proposalId/cancel', governancectrl.cancelProposal);
router.post('/governance/proposals/:proposalId/execute', governancectrl.executeProposal);
router.post('/governance/proposals/:proposalId/comments', governancectrl.addComment);
router.get('/governance/proposals/:proposalId', governancectrl.getProposal);
router.get('/governance/proposals', governancectrl.getProposals);
router.get('/governance/proposal-types', governancectrl.getProposalTypes);

// Governance Dashboard
router.get('/governance/dashboard', governancectrl.getGovernanceDashboard);

// ==================== ENHANCEMENTS: NOTIFICATIONS, SEARCH, MESSAGING, MOBILE, ADMIN ====================
const enhancementctrl = require('../controllers/enhancement.controller.js');

// Notifications
router.post('/notifications', enhancementctrl.createNotification);
router.post('/notifications/push-token', enhancementctrl.registerPushToken);
router.post('/notifications/preferences', enhancementctrl.updateNotificationPreferences);
router.get('/notifications/:user', enhancementctrl.getNotifications);
router.post('/notifications/:notificationId/read', enhancementctrl.markNotificationRead);
router.post('/notifications/read-all', enhancementctrl.markAllNotificationsRead);
router.delete('/notifications/:notificationId', enhancementctrl.deleteNotification);
router.post('/notifications/subscribe', enhancementctrl.subscribeToChannel);
router.post('/notifications/unsubscribe/:subscriptionId', enhancementctrl.unsubscribe);
router.post('/notifications/bulk', enhancementctrl.sendBulkNotifications);

// Search Engine
router.post('/search', enhancementctrl.search);
router.post('/search/index', enhancementctrl.indexItem);
router.get('/search/recommendations/:user', enhancementctrl.getRecommendations);
router.get('/search/trending', enhancementctrl.getTrending);
router.get('/search/suggestions', enhancementctrl.getSearchSuggestions);

// Messaging
router.post('/messages/conversations', enhancementctrl.getOrCreateConversation);
router.post('/messages/send', enhancementctrl.sendMessage);
router.get('/messages/:conversationId/:user', enhancementctrl.getMessages);
router.get('/messages/conversations/:user', enhancementctrl.getConversations);
router.put('/messages/:messageId', enhancementctrl.editMessage);
router.delete('/messages/:messageId', enhancementctrl.deleteMessage);
router.post('/messages/:conversationId/read', enhancementctrl.markConversationRead);
router.post('/messages/:conversationId/archive', enhancementctrl.archiveConversation);
router.post('/messages/:conversationId/unarchive', enhancementctrl.unarchiveConversation);
router.post('/messages/:conversationId/typing', enhancementctrl.setTyping);
router.get('/messages/:conversationId/typing/:user', enhancementctrl.getTyping);
router.post('/messages/block', enhancementctrl.blockUser);
router.post('/messages/unblock', enhancementctrl.unblockUser);
router.get('/messages/blocked/:user', enhancementctrl.getBlockedUsers);

// Mobile Optimization
router.get('/mobile/feed/:user', enhancementctrl.getMobileFeed);
router.post('/mobile/sync', enhancementctrl.syncOfflineChanges);
router.get('/mobile/offline/:user', enhancementctrl.getOfflinePackage);
router.post('/mobile/push-token', enhancementctrl.registerMobilePushToken);
router.get('/mobile/config', enhancementctrl.getAppConfig);

// Admin Dashboard
router.get('/admin/overview', requireAdminWallet, enhancementctrl.getPlatformOverview);
router.get('/admin/users', requireAdminWallet, enhancementctrl.getAdminUsers);
router.get('/admin/users/:address', requireAdminWallet, enhancementctrl.getAdminUserDetails);
router.post('/admin/users/:address/status', requireAdminWallet, enhancementctrl.updateUserStatus);
router.get('/admin/moderation', requireAdminWallet, enhancementctrl.getModerationQueue);
router.post('/admin/moderation/:contentId', requireAdminWallet, enhancementctrl.moderateContent);
router.get('/admin/analytics', requireAdminWallet, enhancementctrl.getAnalytics);
router.get('/admin/health', requireAdminWallet, enhancementctrl.getSystemHealth);
router.get('/admin/config', requireAdminWallet, enhancementctrl.getConfiguration);
router.post('/admin/config', requireAdminWallet, enhancementctrl.updateConfiguration);
router.get('/admin/audit', requireAdminWallet, enhancementctrl.getAuditLog);

// ==================== OPTION 3: ADVANCED FEATURES ====================
const advancedctrl = require('../controllers/advanced.controller.js');

// Gamification
router.post('/gamification/badges/award', advancedctrl.awardBadge);
router.post('/gamification/achievements/track', advancedctrl.trackAchievement);
router.get('/gamification/profile/:user', advancedctrl.getGamificationProfile);
router.get('/gamification/leaderboard', advancedctrl.getLeaderboard);
router.get('/gamification/badges', advancedctrl.getAvailableBadges);
router.get('/gamification/achievements', advancedctrl.getAvailableAchievements);
router.post('/gamification/points', advancedctrl.addPoints);

// Referral Program
router.post('/referrals/code', advancedctrl.generateReferralCode);
router.post('/referrals/track', advancedctrl.trackReferral);
router.post('/referrals/convert', advancedctrl.convertReferral);
router.get('/referrals/stats/:user', advancedctrl.getReferralStats);
router.get('/referrals/rewards/:user', advancedctrl.getReferralRewards);
router.get('/referrals/top', advancedctrl.getTopReferrers);
router.post('/referrals/campaigns', advancedctrl.createReferralCampaign);

// Bulk Operations
router.post('/bulk/mint', advancedctrl.createBulkMint);
router.post('/bulk/mint/:operationId/execute', advancedctrl.executeBulkMint);
router.post('/bulk/transfer', advancedctrl.createBulkTransfer);
router.post('/bulk/transfer/:operationId/execute', advancedctrl.executeBulkTransfer);
router.post('/bulk/listing', advancedctrl.createBulkListing);
router.post('/bulk/price-update', advancedctrl.createBulkPriceUpdate);
router.get('/bulk/operations/:operationId', advancedctrl.getOperationStatus);
router.get('/bulk/operations/:operationId/details', advancedctrl.getOperationDetails);
router.post('/bulk/operations/:operationId/cancel', advancedctrl.cancelOperation);
router.get('/bulk/operations/user/:user', advancedctrl.getUserOperations);

// Auctions
router.post('/auctions', advancedctrl.createAuction);
router.post('/auctions/:auctionId/start', advancedctrl.startAuction);
router.post('/auctions/:auctionId/bid', advancedctrl.placeBid);
router.post('/auctions/:auctionId/buy-now', advancedctrl.buyNow);
router.post('/auctions/:auctionId/end', advancedctrl.endAuction);
router.get('/auctions/:auctionId', advancedctrl.getAuction);
router.get('/auctions', advancedctrl.getActiveAuctions);
router.post('/auctions/:auctionId/watch', advancedctrl.addToWatchlist);
router.post('/auctions/:auctionId/unwatch', advancedctrl.removeFromWatchlist);
router.get('/auctions/watchlist/:user', advancedctrl.getWatchlist);
router.get('/auctions/bids/:user', advancedctrl.getUserBids);
router.post('/auctions/:auctionId/cancel', advancedctrl.cancelAuction);

// Subscription Boxes
router.get('/subscription-boxes', advancedctrl.getAvailableBoxes);
router.post('/subscription-boxes/subscribe', advancedctrl.createBoxSubscription);
router.post('/subscription-boxes/curate', advancedctrl.curateBox);
router.post('/subscription-boxes/curations/:curationId/approve', advancedctrl.approveCuration);
router.post('/subscription-boxes/ship', advancedctrl.processShipment);
router.get('/subscription-boxes/subscriptions/:user', advancedctrl.getUserSubscriptions);
router.get('/subscription-boxes/shipments/:user', advancedctrl.getShipmentHistory);
router.post('/subscription-boxes/:subscriptionId/skip', advancedctrl.skipDelivery);
router.post('/subscription-boxes/:subscriptionId/pause', advancedctrl.pauseSubscription);
router.post('/subscription-boxes/:subscriptionId/resume', advancedctrl.resumeSubscription);
router.post('/subscription-boxes/:subscriptionId/cancel', advancedctrl.cancelBoxSubscription);
router.post('/subscription-boxes/:subscriptionId/address', advancedctrl.updateShippingAddress);

// ==================== REVENUE MODEL (14 STREAMS) ====================
const revenuestreamsctrl = require('../controllers/revenueStreams.controller.js');

// Revenue Transactions
router.post('/revenue/transactions', revenuestreamsctrl.recordTransaction);
router.post('/revenue/calculate-fees', revenuestreamsctrl.calculateFees);

// Revenue Dashboard
router.get('/revenue/dashboard', revenuestreamsctrl.getRevenueDashboard);
router.get('/revenue/pillars/:pillar', revenuestreamsctrl.getPillarRevenue);
router.get('/revenue/streams', revenuestreamsctrl.getAllRevenueStreams);
router.get('/revenue/streams/:streamId', revenuestreamsctrl.getRevenueStream);

// Revenue Projections
router.get('/revenue/projections', revenuestreamsctrl.getRevenueProjections);
router.get('/revenue/year5-projection', revenuestreamsctrl.getYear5Projection);
router.get('/revenue/pillar-breakdown', revenuestreamsctrl.getPillarRevenueBreakdown);

// Individual Stream Configs
router.get('/revenue/config/transaction-fees', revenuestreamsctrl.getTransactionFeesConfig);
router.get('/revenue/config/subscriptions', revenuestreamsctrl.getSubscriptionTiers);
router.get('/revenue/config/seva', revenuestreamsctrl.getSevaServicesConfig);
router.get('/revenue/config/premium-features', revenuestreamsctrl.getPremiumFeatures);
router.get('/revenue/config/b2b', revenuestreamsctrl.getB2BServices);
router.get('/revenue/config/logistics', revenuestreamsctrl.getLogisticsServices);
router.get('/revenue/config/data-insights', revenuestreamsctrl.getDataProducts);
router.get('/revenue/config/advertising', revenuestreamsctrl.getAdvertisingOptions);
router.get('/revenue/config/ticketing', revenuestreamsctrl.getTicketingEvents);
router.get('/revenue/config/financial', revenuestreamsctrl.getFinancialServices);
router.get('/revenue/config/archive', revenuestreamsctrl.getArchiveTiers);
router.get('/revenue/config/certification', revenuestreamsctrl.getCertificationServices);
router.get('/revenue/config/commissions', revenuestreamsctrl.getCommissionServices);
router.get('/revenue/config/physical-ventures', revenuestreamsctrl.getPhysicalProducts);

// ==================== REVENUE INTEGRATION (Automated Collection) ====================
const revenueintctrl = require('../controllers/revenueIntegration.controller.js');

// Process Revenue from All 14 Streams
router.post('/revenue/process/nft-sale', revenueintctrl.processNFTSale);
router.post('/revenue/process/subscription', revenueintctrl.processSubscriptionPayment);
router.post('/revenue/process/donation', revenueintctrl.processSevaDonation);
router.post('/revenue/process/premium', revenueintctrl.processPremiumFeature);
router.post('/revenue/process/b2b', revenueintctrl.processB2BService);
router.post('/revenue/process/logistics', revenueintctrl.processLogisticsService);
router.post('/revenue/process/data-insights', revenueintctrl.processDataInsights);
router.post('/revenue/process/advertising', revenueintctrl.processAdvertising);
router.post('/revenue/process/ticketing', revenueintctrl.processEventTicketing);
router.post('/revenue/process/archive', revenueintctrl.processArchiveAccess);
router.post('/revenue/process/certification', revenueintctrl.processCertification);
router.post('/revenue/process/commission', revenueintctrl.processCommission);
router.post('/revenue/process/physical', revenueintctrl.processPhysicalVenture);

// Daily Revenue & Automation
router.get('/revenue/daily', revenueintctrl.getDailyRevenue);
router.post('/revenue/auto-collect', revenueintctrl.autoCollectRevenue);

// ==================== PRODUCTION READINESS ====================
const productionctrl = require('../controllers/production.controller.js');

// Rate Limiting
router.post('/rate-limit/check', productionctrl.checkRateLimit);
router.get('/rate-limit/usage/:identifier', productionctrl.getRateLimitUsage);
router.post('/rate-limit/ban', productionctrl.banIdentifier);
router.post('/rate-limit/unban', productionctrl.unbanIdentifier);
router.post('/rate-limit/whitelist', productionctrl.whitelistIdentifier);
router.get('/rate-limit/banned', productionctrl.getBannedList);
router.get('/rate-limit/whitelist', productionctrl.getWhitelist);
router.post('/rate-limit/cleanup', productionctrl.cleanupRateLimits);

// Caching
router.get('/cache/:key', productionctrl.cacheGet);
router.post('/cache', productionctrl.cacheSet);
router.delete('/cache/:key', productionctrl.cacheDelete);
router.post('/cache/flush', productionctrl.cacheFlush);
router.get('/cache/stats', productionctrl.cacheStats);
router.get('/cache/keys', productionctrl.cacheKeys);

// Health Checks
router.get('/health', productionctrl.healthCheck);
router.get('/health/:name', productionctrl.healthCheckSingle);
router.get('/health/status', productionctrl.healthStatus);
router.get('/health/metrics', productionctrl.healthMetrics);
router.get('/ready', productionctrl.readinessCheck);
router.get('/live', productionctrl.livenessCheck);
router.get('/health/checks', productionctrl.registeredChecks);

// API Versioning
router.get('/versions', productionctrl.getVersions);
router.get('/versions/:version', productionctrl.getVersion);
router.get('/versions/:version/changelog', productionctrl.getChangelog);
router.get('/versions/migration-guide', productionctrl.getMigrationGuide);

// Webhooks
router.post('/webhooks', productionctrl.registerWebhook);
router.get('/webhooks', productionctrl.listWebhooks);
router.get('/webhooks/event-types', productionctrl.getWebhookEventTypes);
router.get('/webhooks/:webhookId', productionctrl.getWebhook);
router.put('/webhooks/:webhookId', productionctrl.updateWebhook);
router.delete('/webhooks/:webhookId', productionctrl.deleteWebhook);
router.post('/webhooks/:webhookId/test', productionctrl.testWebhook);
router.post('/webhooks/send', productionctrl.sendWebhookEvent);
router.get('/webhooks/:webhookId/deliveries', productionctrl.getWebhookDeliveries);

module.exports = router;





