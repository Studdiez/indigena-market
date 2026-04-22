const PhysicalItem = require('../models/PhysicalItem.model.js');
const PhysicalMarketplaceEvent = require('../models/PhysicalMarketplaceEvent.model.js');
const PhysicalOrder = require('../models/PhysicalOrder.model.js');
const PhysicalOffer = require('../models/PhysicalOffer.model.js');
const PhysicalWatchlist = require('../models/PhysicalWatchlist.model.js');
const PhysicalReport = require('../models/PhysicalReport.model.js');

const CATEGORY_DEFINITIONS = [
    { id: 'carving_sculpture', name: 'Carving & Sculpture', icon: '\u{1F5FF}', description: 'Traditional carving and sculpture.', subcategories: [{ name: 'Wood Carving' }, { name: 'Stone Carving' }] },
    { id: 'pottery_ceramics', name: 'Pottery & Ceramics', icon: '\u{1F3FA}', description: 'Hand-built and fired pottery.', subcategories: [{ name: 'Coil Pottery' }, { name: 'Pit Firing' }] },
    { id: 'textiles_weaving', name: 'Textiles & Weaving', icon: '\u{1F9F6}', description: 'Loomed textile and weaving arts.', subcategories: [{ name: 'Rug Weaving' }, { name: 'Basket Weaving' }] },
    { id: 'jewelry', name: 'Jewelry Making', icon: '\u{1F48D}', description: 'Wearable handcrafted jewelry.', subcategories: [{ name: 'Beadwork Jewelry' }, { name: 'Silver Smithing' }] },
    { id: 'beadwork_embroidery', name: 'Beadwork & Embroidery', icon: '\u{1FAA1}', description: 'Beadwork and stitched detail.', subcategories: [{ name: 'Loom Beadwork' }, { name: 'Applique' }] },
    { id: 'masks_regalia', name: 'Masks & Regalia', icon: '\u{1F3AD}', description: 'Ceremonial and performance regalia.', subcategories: [{ name: 'Dance Regalia' }, { name: 'Headdresses' }] },
    { id: 'contemporary_fusion', name: 'Contemporary Fusion', icon: '\u{1FAB6}', description: 'Modern/traditional blended works.', subcategories: [{ name: 'Mixed Media' }, { name: 'Installation' }] }
];

const REVENUE_PROJECTIONS = {
    totalCategories: CATEGORY_DEFINITIONS.length,
    year5Projections: {
        makers: 18000,
        avgAnnualEarnings: 11200,
        platformFee: 8,
        transactionRevenue: 16128000
    },
    totalYear5Revenue: 18285660
};

async function pushPhysicalEvent(event) {
    await PhysicalMarketplaceEvent.create({
        event: event.event,
        itemId: event.itemId || undefined,
        category: event.category || undefined,
        metadata: event.metadata || {}
    });
}

function resolveItemQuery(itemId) {
    if (!itemId) return null;
    return { $or: [{ itemId }, { _id: itemId }] };
}

exports.getCategories = (req, res) => {
    return res.status(200).send({
        status: true,
        total: CATEGORY_DEFINITIONS.length,
        categories: CATEGORY_DEFINITIONS.map((c) => ({
            id: c.id,
            name: c.name,
            icon: c.icon,
            description: c.description,
            subcategoryCount: c.subcategories.length
        }))
    });
};

exports.getCategory = (req, res) => {
    const cat = CATEGORY_DEFINITIONS.find((c) => c.id === req.params.categoryId);
    if (!cat) return res.status(404).send({ status: false, message: 'Category not found' });
    return res.status(200).send({ status: true, category: cat });
};

exports.getSubcategories = (req, res) => {
    const cat = CATEGORY_DEFINITIONS.find((c) => c.id === req.params.categoryId);
    if (!cat) return res.status(404).send({ status: false, message: 'Category not found' });
    return res.status(200).send({ status: true, categoryId: cat.id, subcategories: cat.subcategories });
};

exports.registerPhysicalItem = async (req, res) => {
    try {
        const {
            nfcTagId, categoryId, subcategory, itemType,
            title, description, creator, dimensions, materials, techniques, images,
            price, currency, listingType
        } = req.body;

        if (!title) return res.status(400).send({ status: false, message: 'Title is required' });

        const item = await PhysicalItem.create({
            itemId: `phys_${Date.now()}`,
            nfcTagId: nfcTagId || `nfc_${Date.now()}`,
            categoryId,
            subcategory,
            itemType: itemType || categoryId || 'other',
            title,
            description,
            creator,
            dimensions,
            materials,
            techniques,
            images,
            price: Number(price || 0),
            currency: currency || 'INDI',
            listingType: listingType || 'instant',
            provenance: creator?.walletAddress ? [{ owner: creator.walletAddress, ownerName: creator?.name, acquiredDate: new Date() }] : []
        });

        return res.status(201).send({ status: true, message: 'Physical item registered successfully', item });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to register physical item' });
    }
};

exports.getItemById = async (req, res) => {
    try {
        const item = await PhysicalItem.findOne(resolveItemQuery(req.params.itemId));
        if (!item) return res.status(404).send({ status: false, message: 'Item not found' });
        return res.status(200).send({ status: true, item });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to get item' });
    }
};

exports.getItemByNFC = async (req, res) => {
    try {
        const item = await PhysicalItem.findOne({ nfcTagId: req.params.nfcTagId });
        if (!item) return res.status(404).send({ status: false, message: 'Item not found' });
        item.lastVerified = new Date();
        await item.save();
        return res.status(200).send({ status: true, item });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to get item' });
    }
};

exports.getAllItems = async (req, res) => {
    try {
        const { categoryId, nation, minPrice, maxPrice, listingType, q, sort = 'newest', page = 1, limit = 24 } = req.query;
        const pageNum = Math.max(1, Number(page) || 1);
        const limitNum = Math.min(100, Math.max(1, Number(limit) || 24));

        const filter = {};
        if (categoryId) filter.categoryId = categoryId;
        if (listingType) filter.listingType = listingType;
        if (nation) filter['creator.tribalAffiliation'] = new RegExp(`^${nation}$`, 'i');
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (q && String(q).trim()) {
            const searchRegex = new RegExp(String(q).trim(), 'i');
            filter.$or = [{ title: searchRegex }, { description: searchRegex }, { subcategory: searchRegex }, { 'creator.name': searchRegex }, { materials: searchRegex }];
        }

        const sortMap = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            'price-low': { price: 1, createdAt: -1 },
            'price-high': { price: -1, createdAt: -1 },
            popular: { createdAt: -1 }
        };

        const items = await PhysicalItem.find(filter).sort(sortMap[sort] || sortMap.newest).skip((pageNum - 1) * limitNum).limit(limitNum);
        const total = await PhysicalItem.countDocuments(filter);

        return res.status(200).send({ status: true, total, page: pageNum, pages: Math.max(1, Math.ceil(total / limitNum)), items });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to get items' });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const item = await PhysicalItem.findOneAndUpdate(resolveItemQuery(req.params.itemId), { $set: req.body }, { new: true });
        if (!item) return res.status(404).send({ status: false, message: 'Item not found' });
        return res.status(200).send({ status: true, item });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to update item' });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const item = await PhysicalItem.findOneAndDelete(resolveItemQuery(req.params.itemId));
        if (!item) return res.status(404).send({ status: false, message: 'Item not found' });
        return res.status(200).send({ status: true, message: 'Item deleted' });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to delete item' });
    }
};

exports.getItemsByCreator = async (req, res) => {
    try {
        const items = await PhysicalItem.find({ 'creator.walletAddress': req.params.address.toLowerCase() });
        return res.status(200).send({ status: true, count: items.length, items });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to get items' });
    }
};

exports.getItemsByOwner = async (req, res) => {
    try {
        const items = await PhysicalItem.find({ 'provenance.owner': req.params.address.toLowerCase() });
        return res.status(200).send({ status: true, count: items.length, items });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to get items' });
    }
};

exports.transferOwnership = async (req, res) => {
    try {
        const { itemId, toAddress, price, currency, location } = req.body;
        const item = await PhysicalItem.findOne(resolveItemQuery(itemId));
        if (!item) return res.status(404).send({ status: false, message: 'Item not found' });
        item.provenance.push({ owner: toAddress, acquiredDate: new Date(), location, price, currency });
        await item.save();
        return res.status(200).send({ status: true, message: 'Ownership transferred', provenance: item.provenance });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to transfer ownership' });
    }
};

exports.addConditionReport = async (req, res) => {
    try {
        const { itemId, condition, description, reporter, reporterType, images } = req.body;
        const item = await PhysicalItem.findOne(resolveItemQuery(itemId));
        if (!item) return res.status(404).send({ status: false, message: 'Item not found' });
        item.conditionReports.push({ condition, description, reporter, reporterType, images });
        item.currentCondition = condition;
        await item.save();
        return res.status(200).send({ status: true, message: 'Condition report added' });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to add condition report' });
    }
};

exports.verifyItem = async (req, res) => {
    try {
        const { itemId, verifier, galleryInfo, notes } = req.body;
        const item = await PhysicalItem.findOne(resolveItemQuery(itemId));
        if (!item) return res.status(404).send({ status: false, message: 'Item not found' });
        item.galleryInfo = { ...galleryInfo, verified: true, verifiedAt: new Date() };
        item.verificationHistory.push({ date: new Date(), verifier, method: 'gallery_verification', notes });
        await item.save();
        return res.status(200).send({ status: true, message: 'Item verified successfully' });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to verify item' });
    }
};

exports.search = exports.getAllItems;

exports.getFeaturedItems = async (req, res) => {
    try {
        const items = await PhysicalItem.find({ status: 'active' }).sort({ createdAt: -1 }).limit(12);
        return res.status(200).send({ status: true, items });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to get featured items' });
    }
};

exports.getCategoryStats = async (req, res) => {
    try {
        const stats = await PhysicalItem.aggregate([{ $group: { _id: '$categoryId', count: { $sum: 1 } } }, { $sort: { count: -1 } }]);
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
            categories: CATEGORY_DEFINITIONS.map((c) => ({ id: c.id, name: c.name, icon: c.icon, subcategoryCount: c.subcategories.length }))
        }
    });
};

exports.getRevenueProjections = (req, res) => {
    return res.status(200).send({ status: true, projections: REVENUE_PROJECTIONS });
};

exports.buyItem = async (req, res) => {
    try {
        const { buyerAddress, price, currency } = req.body;
        const item = await PhysicalItem.findOne(resolveItemQuery(req.params.itemId));
        if (!item) return res.status(404).send({ status: false, message: 'Item not found' });

        const buyer = String(buyerAddress || '').toLowerCase();
        if (!buyer || buyer === 'demo-wallet') {
            return res.status(400).send({ status: false, message: 'buyerAddress is required' });
        }
        const resolvedPrice = Number(price || item.price || 0);

        item.status = 'sold';
        item.provenance.push({
            owner: buyer,
            acquiredDate: new Date(),
            price: resolvedPrice,
            currency: currency || item.currency || 'INDI'
        });
        await item.save();

        await PhysicalOrder.create({
            itemId: item.itemId || req.params.itemId,
            buyerAddress: buyer,
            sellerAddress: item.creator?.walletAddress || '',
            amount: resolvedPrice,
            currency: currency || item.currency || 'INDI',
            status: 'completed',
            metadata: { listingType: item.listingType || 'instant' }
        });

        await pushPhysicalEvent({
            event: 'buy',
            itemId: item.itemId,
            category: item.categoryId,
            metadata: { buyerAddress: buyer, amount: resolvedPrice }
        });

        return res.status(200).send({ status: true, message: 'Purchase completed', data: { itemId: item.itemId } });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to complete purchase' });
    }
};

exports.makeOffer = async (req, res) => {
    try {
        const { buyerAddress, amount = 0, message = '' } = req.body;
        const item = await PhysicalItem.findOne(resolveItemQuery(req.params.itemId));
        if (!item) return res.status(404).send({ status: false, message: 'Item not found' });

        const buyer = String(buyerAddress || '').toLowerCase();
        if (!buyer || buyer === 'demo-wallet') {
            return res.status(400).send({ status: false, message: 'buyerAddress is required' });
        }
        const resolvedAmount = Number(amount || 0);

        item.verificationHistory.push({
            date: new Date(),
            verifier: buyer,
            method: 'offer',
            notes: `${resolvedAmount}${message ? ` | ${message}` : ''}`
        });
        await item.save();

        await PhysicalOffer.create({
            itemId: item.itemId || req.params.itemId,
            buyerAddress: buyer,
            amount: resolvedAmount,
            currency: item.currency || 'INDI',
            message,
            status: 'pending'
        });

        await pushPhysicalEvent({
            event: 'offer',
            itemId: item.itemId,
            category: item.categoryId,
            metadata: { buyerAddress: buyer, amount: resolvedAmount }
        });

        return res.status(200).send({ status: true, message: 'Offer submitted', data: { itemId: item.itemId, amount: resolvedAmount } });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to submit offer' });
    }
};

exports.toggleWatchlist = async (req, res) => {
    try {
        const { watcherAddress } = req.body;
        const item = await PhysicalItem.findOne(resolveItemQuery(req.params.itemId));
        if (!item) return res.status(404).send({ status: false, message: 'Item not found' });

        const watcher = String(watcherAddress || '').toLowerCase();
        if (!watcher || watcher === 'demo-wallet') {
            return res.status(400).send({ status: false, message: 'watcherAddress is required' });
        }
        const key = { itemId: item.itemId || req.params.itemId, watcherAddress: watcher };
        const existing = await PhysicalWatchlist.findOne(key);
        const willBeActive = !(existing && existing.active);

        await PhysicalWatchlist.findOneAndUpdate(
            key,
            { $set: { active: willBeActive } },
            { upsert: true, new: true }
        );

        await pushPhysicalEvent({
            event: 'watchlist_toggle',
            itemId: item.itemId,
            category: item.categoryId,
            metadata: { watcherAddress: watcher, active: willBeActive }
        });

        return res.status(200).send({ status: true, message: 'Watchlist updated', data: { active: willBeActive } });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to update watchlist' });
    }
};

exports.shareItem = async (req, res) => {
    try {
        const { platform = 'native' } = req.body;
        const item = await PhysicalItem.findOne(resolveItemQuery(req.params.itemId));
        if (!item) return res.status(404).send({ status: false, message: 'Item not found' });

        await pushPhysicalEvent({ event: 'share', itemId: item.itemId, category: item.categoryId, metadata: { platform } });
        return res.status(200).send({ status: true, message: 'Share tracked' });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to share item' });
    }
};

exports.reportItem = async (req, res) => {
    try {
        const { reason = 'unspecified', details = '', reporterAddress = '' } = req.body;
        const item = await PhysicalItem.findOne(resolveItemQuery(req.params.itemId));
        if (!item) return res.status(404).send({ status: false, message: 'Item not found' });

        const reporter = reporterAddress ? String(reporterAddress).toLowerCase() : '';

        item.verificationHistory.push({
            date: new Date(),
            verifier: 'moderation-queue',
            method: 'report',
            notes: `${reason}${details ? ` | ${details}` : ''}`
        });
        await item.save();

        await PhysicalReport.create({
            itemId: item.itemId || req.params.itemId,
            reporterAddress: reporter,
            reason,
            details,
            status: 'open'
        });

        await pushPhysicalEvent({
            event: 'report',
            itemId: item.itemId,
            category: item.categoryId,
            metadata: { reason, reporterAddress: reporter }
        });

        return res.status(200).send({ status: true, message: 'Report submitted' });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to submit report' });
    }
};

exports.trackEvent = async (req, res) => {
    try {
        const { event, itemId, category, metadata } = req.body;
        if (!event) return res.status(400).send({ status: false, message: 'event is required' });

        await pushPhysicalEvent({ event, itemId, category, metadata: metadata || {} });
        return res.status(200).send({ status: true, message: 'Event tracked' });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to track event' });
    }
};

exports.getDemandHeatmap = async (req, res) => {
    try {
        const grouped = await PhysicalMarketplaceEvent.aggregate([
            {
                $group: {
                    _id: '$category',
                    events: { $push: '$event' }
                }
            }
        ]);

        const data = grouped.map((row) => {
            const bucket = {
                category: row._id || 'uncategorized',
                search: 0,
                view: 0,
                watchlist: 0,
                buy: 0,
                offer: 0,
                share: 0,
                report: 0
            };

            for (const evt of row.events) {
                if (evt === 'search') bucket.search += 1;
                else if (evt === 'view') bucket.view += 1;
                else if (evt === 'watchlist_toggle') bucket.watchlist += 1;
                else if (evt === 'buy') bucket.buy += 1;
                else if (evt === 'offer') bucket.offer += 1;
                else if (evt === 'share') bucket.share += 1;
                else if (evt === 'report') bucket.report += 1;
            }
            return bucket;
        });

        return res.status(200).send({
            status: true,
            data,
            totalEvents: data.reduce((sum, row) => sum + row.search + row.view + row.watchlist + row.buy + row.offer + row.share + row.report, 0)
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to build heatmap' });
    }
};






exports.getModerationQueue = async (req, res) => {
    try {
        const { status = 'open', page = 1, limit = 50 } = req.query;
        const pageNum = Math.max(1, Number(page) || 1);
        const limitNum = Math.min(100, Math.max(1, Number(limit) || 50));

        const filter = {};
        if (status && status !== 'all') filter.status = status;

        const reports = await PhysicalReport.find(filter)
            .sort({ createdAt: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .lean();

        const total = await PhysicalReport.countDocuments(filter);
        return res.status(200).send({
            status: true,
            data: {
                reports,
                page: pageNum,
                pages: Math.max(1, Math.ceil(total / limitNum)),
                total
            }
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to load physical moderation queue' });
    }
};

exports.decideModeration = async (req, res) => {
    try {
        const { reportId } = req.params;
        const { decision, moderator = 'admin', notes = '' } = req.body;
        const actingModerator = req.adminWallet || moderator;

        if (!['resolve', 'dismiss', 'review'].includes(decision)) {
            return res.status(400).send({ status: false, message: 'decision must be resolve, dismiss, or review' });
        }

        const nextStatus = decision === 'resolve' ? 'resolved' : decision === 'dismiss' ? 'dismissed' : 'under_review';

        const report = await PhysicalReport.findByIdAndUpdate(
            reportId,
            {
                $set: {
                    status: nextStatus,
                    moderation: {
                        moderator: actingModerator,
                        decision,
                        notes,
                        decidedAt: new Date()
                    }
                }
            },
            { new: true }
        );

        if (!report) return res.status(404).send({ status: false, message: 'Report not found' });

        await pushPhysicalEvent({
            event: 'moderation_decision',
            itemId: report.itemId,
            category: undefined,
            metadata: { reportId: report._id.toString(), decision, moderator: actingModerator }
        });

        return res.status(200).send({ status: true, message: 'Moderation decision recorded', data: report });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to apply moderation decision' });
    }
};



