const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const LanguageHeritageListing = require('../models/LanguageHeritageListing.model.js');
const LanguageHeritageEvent = require('../models/LanguageHeritageEvent.model.js');
const LanguageHeritageAccessRequest = require('../models/LanguageHeritageAccessRequest.model.js');
const LanguageHeritagePaymentIntent = require('../models/LanguageHeritagePaymentIntent.model.js');
const LanguageHeritageReceipt = require('../models/LanguageHeritageReceipt.model.js');

const DEFAULT_LIMIT = 12;
const PAYMENT_INTENT_TTL_MINUTES = Math.max(5, Number(process.env.HERITAGE_PAYMENT_INTENT_TTL_MINUTES || 20));
const USER_JWT_SECRET = String(process.env.USER_JWT_SECRET || '').trim();
const REQUIRE_HERITAGE_USER_AUTH = process.env.NODE_ENV === 'production' || process.env.REQUIRE_HERITAGE_USER_AUTH === 'true';

const SEED_LISTINGS = [
    {
        listingId: 'lh-1',
        title: 'Passamaquoddy Audio Conversation Pack',
        categoryId: 'audio-video-resources',
        categoryLabel: 'Audio & Video Language Resources',
        summary: 'Natural dialogues between fluent speakers with slowed-learning tracks and transcripts.',
        nation: 'Passamaquoddy',
        keeperName: 'Elder Collective Media Team',
        format: 'audio',
        accessLevel: 'community',
        verifiedSpeaker: true,
        elderApproved: true,
        communityControlled: true,
        price: 39,
        currency: 'USD',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&h=700&fit=crop',
        tags: ['audio', 'conversation', 'transcript'],
        durationLabel: '6 hours',
        itemCountLabel: '48 tracks',
        rating: 4.9,
        reviews: 128,
        status: 'published'
    },
    {
        listingId: 'lh-2',
        title: 'Elder Storytelling Night Archive',
        categoryId: 'oral-history-storytelling',
        categoryLabel: 'Oral History & Storytelling',
        summary: 'Curated seasonal stories with cultural context notes and intergenerational access mode.',
        nation: 'Yolngu',
        keeperName: 'Gumatj Story Circle',
        format: 'video',
        accessLevel: 'community',
        verifiedSpeaker: true,
        elderApproved: true,
        communityControlled: true,
        price: 65,
        currency: 'USD',
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&h=700&fit=crop',
        tags: ['stories', 'video', 'elder'],
        durationLabel: '8 sessions',
        itemCountLabel: '24 stories',
        rating: 4.8,
        reviews: 73,
        status: 'published'
    },
    {
        listingId: 'lh-3',
        title: 'Community Place Name Atlas',
        categoryId: 'heritage-sites-land-knowledge',
        categoryLabel: 'Cultural Heritage Sites & Land-Based Knowledge',
        summary: 'Interactive map bundle with language pronunciations and community-approved site context.',
        nation: 'Noongar',
        keeperName: 'Boodja Mapping Unit',
        format: 'document',
        accessLevel: 'restricted',
        verifiedSpeaker: true,
        elderApproved: true,
        communityControlled: true,
        price: 120,
        currency: 'USD',
        image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&h=700&fit=crop',
        tags: ['map', 'place names', 'land'],
        itemCountLabel: '112 place names',
        rating: 4.9,
        reviews: 41,
        status: 'published'
    },
    {
        listingId: 'lh-4',
        title: 'Language Teacher Training Cohort',
        categoryId: 'training-capacity',
        categoryLabel: 'Training & Capacity Building',
        summary: '12-week cohort covering immersion pedagogy, assessment tools, and lesson workflows.',
        nation: 'Anishinaabe',
        keeperName: 'Knowledge Weavers Network',
        format: 'service',
        accessLevel: 'public',
        verifiedSpeaker: true,
        elderApproved: false,
        communityControlled: true,
        price: 950,
        currency: 'USD',
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=700&fit=crop',
        tags: ['teacher', 'training', 'immersion'],
        durationLabel: '12 weeks',
        rating: 4.7,
        reviews: 57,
        status: 'published'
    },
    {
        listingId: 'lh-5',
        title: 'Syllabics Keyboard + Font Bundle',
        categoryId: 'language-technology',
        categoryLabel: 'Language Technology & Tools',
        summary: 'Unicode-ready keyboard layouts and fonts for Indigenous script publishing workflows.',
        nation: 'Cree',
        keeperName: 'Native Script Lab',
        format: 'software',
        accessLevel: 'public',
        verifiedSpeaker: false,
        elderApproved: false,
        communityControlled: true,
        price: 49,
        currency: 'USD',
        image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&h=700&fit=crop',
        tags: ['keyboard', 'font', 'software'],
        itemCountLabel: '4 layouts',
        rating: 4.6,
        reviews: 32,
        status: 'published'
    },
    {
        listingId: 'lh-6',
        title: 'Family Immersion Weekend Pass',
        categoryId: 'community-immersion',
        categoryLabel: 'Community Immersion Experiences',
        summary: 'On-country weekend with language circles, song sessions, and family learning tracks.',
        nation: 'Maori',
        keeperName: 'Te Reo Whanau Retreat',
        format: 'experience',
        accessLevel: 'community',
        verifiedSpeaker: true,
        elderApproved: true,
        communityControlled: true,
        price: 480,
        currency: 'USD',
        image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=700&fit=crop',
        tags: ['immersion', 'family', 'retreat'],
        durationLabel: '2 days',
        rating: 4.9,
        reviews: 64,
        status: 'published'
    }
];

const DICTIONARY_ENTRIES = {
    dine: {
        entryId: 'dine',
        term: 'diné',
        language: 'Navajo',
        pronunciation: 'dee-neh',
        partOfSpeech: 'noun',
        definitions: ['person, people', 'the Navajo people'],
        examples: ['Diné bizaad - Navajo language', 'Diné asdzání - Navajo woman'],
        culturalNote: 'The word diné means people and expresses identity, kinship, and origin.'
    },
    aloha: {
        entryId: 'aloha',
        term: 'aloha',
        language: 'Maori / Polynesian Context',
        pronunciation: 'a-lo-ha',
        partOfSpeech: 'noun',
        definitions: ['love, compassion, greeting'],
        examples: ['Aloha e hoa - Hello friend'],
        culturalNote: 'Aloha carries relational values beyond a greeting and can encode protocol and care.'
    },
    tansi: {
        entryId: 'tansi',
        term: 'tansi',
        language: 'Cree',
        pronunciation: 'tan-see',
        partOfSpeech: 'interjection',
        definitions: ['hello', 'greetings'],
        examples: ['Tansi nitotem - Hello my relative'],
        culturalNote: 'Used as a greeting with social warmth and relational grounding.'
    }
};

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
    if (!REQUIRE_HERITAGE_USER_AUTH && bodyWallet) return bodyWallet;
    return '';
}

function toInt(value, fallback) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
    return Math.floor(parsed);
}

function mapListing(doc) {
    return {
        id: doc.listingId,
        title: doc.title,
        categoryId: doc.categoryId,
        categoryLabel: doc.categoryLabel,
        summary: doc.summary,
        nation: doc.nation,
        keeperName: doc.keeperName,
        format: doc.format,
        accessLevel: doc.accessLevel,
        verifiedSpeaker: Boolean(doc.verifiedSpeaker),
        elderApproved: Boolean(doc.elderApproved),
        communityControlled: Boolean(doc.communityControlled),
        price: Number(doc.price || 0),
        currency: doc.currency || 'USD',
        image: doc.image,
        tags: Array.isArray(doc.tags) ? doc.tags : [],
        durationLabel: doc.durationLabel || undefined,
        itemCountLabel: doc.itemCountLabel || undefined,
        rating: Number(doc.rating || 0),
        reviews: Number(doc.reviews || 0),
        createdAt: doc.createdAt
    };
}

function parseAcknowledgements(input) {
    if (!Array.isArray(input)) return [];
    return input
        .map((v) => String(v || '').trim())
        .filter(Boolean)
        .slice(0, 12);
}

async function ensureSeedData() {
    if (process.env.NODE_ENV === 'production' && process.env.FORCE_PILLAR7_SEED !== 'true') return;
    if (process.env.DISABLE_PILLAR7_AUTO_SEED === 'true') return;
    const count = await LanguageHeritageListing.countDocuments({});
    if (count > 0) return;
    try {
        await LanguageHeritageListing.insertMany(SEED_LISTINGS, { ordered: false });
    } catch {
        // Ignore duplicate race on first bootstrap.
    }
}

function buildSort(sort) {
    switch (String(sort || 'featured')) {
        case 'price-low':
            return { price: 1, createdAt: -1 };
        case 'price-high':
            return { price: -1, createdAt: -1 };
        case 'newest':
            return { createdAt: -1 };
        case 'featured':
        default:
            return { verifiedSpeaker: -1, elderApproved: -1, rating: -1, createdAt: -1 };
    }
}

function hasListingAccess(listing, wallet, approvedAccessSet) {
    const level = String(listing.accessLevel || 'public');
    if (level === 'public') return true;
    if (!wallet) return false;
    if (level === 'community') return true;
    return approvedAccessSet.has(String(listing.listingId || ''));
}

async function findListingOr404(res, listingId) {
    const listing = await LanguageHeritageListing.findOne({ listingId: String(listingId || '').trim(), status: 'published' });
    if (!listing) {
        res.status(404).send({ status: false, message: 'Listing not found' });
        return null;
    }
    return listing;
}

exports.getListings = async (req, res) => {
    try {
        await ensureSeedData();

        const actorWallet = resolveAuthenticatedWallet(req);
        const q = String(req.query.q || '').trim();
        const categoryId = String(req.query.categoryId || '').trim();
        const accessLevel = String(req.query.accessLevel || '').trim();
        const format = String(req.query.format || '').trim();
        const minPrice = Number(req.query.minPrice);
        const maxPrice = Number(req.query.maxPrice);
        const page = toInt(req.query.page, 1);
        const limit = Math.min(60, toInt(req.query.limit, DEFAULT_LIMIT));

        if (!actorWallet && ['community', 'restricted', 'elder-approved'].includes(accessLevel)) {
            return res.status(401).send({ status: false, message: 'Wallet authentication required for non-public access' });
        }

        const filters = { status: 'published' };

        if (categoryId && categoryId !== 'all') filters.categoryId = categoryId;
        if (accessLevel && accessLevel !== 'all') filters.accessLevel = accessLevel;
        if (format && format !== 'all') filters.format = format;
        if (Number.isFinite(minPrice) || Number.isFinite(maxPrice)) {
            filters.price = {};
            if (Number.isFinite(minPrice)) filters.price.$gte = minPrice;
            if (Number.isFinite(maxPrice)) filters.price.$lte = maxPrice;
        }
        if (q) {
            filters.$or = [
                { title: { $regex: q, $options: 'i' } },
                { summary: { $regex: q, $options: 'i' } },
                { nation: { $regex: q, $options: 'i' } },
                { keeperName: { $regex: q, $options: 'i' } },
                { tags: { $elemMatch: { $regex: q, $options: 'i' } } }
            ];
        }

        if (!actorWallet && (!accessLevel || accessLevel === 'all')) {
            filters.accessLevel = 'public';
        }

        const docs = await LanguageHeritageListing.find(filters)
            .sort(buildSort(req.query.sort))
            .lean();

        let approvedSet = new Set();
        if (actorWallet) {
            const approved = await LanguageHeritageAccessRequest.find({
                walletAddress: actorWallet,
                status: 'approved'
            }).select('listingId');
            approvedSet = new Set(approved.map((row) => String(row.listingId || '')));
        }

        const visible = docs.filter((doc) => hasListingAccess(doc, actorWallet, approvedSet));
        const total = visible.length;
        const pages = Math.max(1, Math.ceil(total / limit));
        const start = (page - 1) * limit;
        const items = visible.slice(start, start + limit).map(mapListing);

        res.status(200).json({
            success: true,
            page,
            pages,
            total,
            items
        });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
};

exports.requestAccess = async (req, res) => {
    try {
        const actorWallet = resolveAuthenticatedWallet(req, 'walletAddress');
        if (!actorWallet) {
            return res.status(401).send({ status: false, message: 'Wallet authentication required' });
        }

        const listing = await findListingOr404(res, req.params.listingId || req.body?.listingId);
        if (!listing) return;

        if (String(listing.accessLevel) === 'public') {
            return res.status(200).send({
                status: true,
                message: 'Listing is public; no access request required',
                request: {
                    listingId: listing.listingId,
                    walletAddress: actorWallet,
                    status: 'approved'
                }
            });
        }

        const consentAccepted = req.body?.consentAccepted === true;
        if (!consentAccepted) {
            return res.status(400).send({ status: false, message: 'Protocol consent is required' });
        }

        const note = String(req.body?.note || '').trim().slice(0, 500);
        const acknowledgements = parseAcknowledgements(req.body?.acknowledgements);
        const status = String(listing.accessLevel) === 'community' ? 'approved' : 'pending';

        const requestId = `lhar_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const record = await LanguageHeritageAccessRequest.findOneAndUpdate(
            { listingId: listing.listingId, walletAddress: actorWallet },
            {
                $setOnInsert: { requestId, createdAt: new Date() },
                $set: {
                    listingId: listing.listingId,
                    walletAddress: actorWallet,
                    status,
                    note,
                    metadata: { acknowledgements, consentAccepted: true },
                    updatedAt: new Date()
                }
            },
            { upsert: true, new: true }
        );

        return res.status(200).send({
            status: true,
            message: status === 'approved' ? 'Access granted' : 'Access request submitted',
            request: {
                requestId: record.requestId,
                listingId: record.listingId,
                walletAddress: record.walletAddress,
                status: record.status,
                createdAt: record.createdAt,
                updatedAt: record.updatedAt
            }
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to request access' });
    }
};

exports.createPaymentIntent = async (req, res) => {
    try {
        const actorWallet = resolveAuthenticatedWallet(req, 'walletAddress');
        if (!actorWallet) {
            return res.status(401).send({ status: false, message: 'Wallet authentication required' });
        }

        const listing = await findListingOr404(res, req.params.listingId || req.body?.listingId);
        if (!listing) return;

        const consentAccepted = req.body?.consentAccepted === true;
        if (!consentAccepted) {
            return res.status(400).send({ status: false, message: 'Protocol consent is required before payment' });
        }
        const acknowledgements = parseAcknowledgements(req.body?.acknowledgements);

        const approved = await LanguageHeritageAccessRequest.findOne({
            listingId: listing.listingId,
            walletAddress: actorWallet,
            status: 'approved'
        });
        if (!hasListingAccess(listing, actorWallet, new Set(approved ? [listing.listingId] : []))) {
            return res.status(403).send({ status: false, message: 'Access not approved for this listing' });
        }

        const amount = Math.max(0, Number(listing.price || 0));
        const currency = String(listing.currency || 'USD').trim() || 'USD';
        if (amount <= 0) {
            return res.status(400).send({ status: false, message: 'Listing is free; payment intent not required' });
        }

        const intentId = `lhpay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const clientSecret = `lhcs_${crypto.randomBytes(12).toString('hex')}`;
        const expiresAt = new Date(Date.now() + PAYMENT_INTENT_TTL_MINUTES * 60 * 1000);

        const intent = await LanguageHeritagePaymentIntent.create({
            intentId,
            listingId: listing.listingId,
            walletAddress: actorWallet,
            amount,
            currency,
            clientSecret,
            status: 'requires_confirmation',
            expiresAt,
            metadata: { title: listing.title, consentAccepted: true, acknowledgements }
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
        const actorWallet = resolveAuthenticatedWallet(req, 'walletAddress');
        if (!actorWallet) {
            return res.status(401).send({ status: false, message: 'Wallet authentication required' });
        }

        const listing = await findListingOr404(res, req.params.listingId || req.body?.listingId);
        if (!listing) return;

        const consentAccepted = req.body?.consentAccepted === true;
        if (!consentAccepted) {
            return res.status(400).send({ status: false, message: 'Protocol consent is required before confirmation' });
        }
        const acknowledgements = parseAcknowledgements(req.body?.acknowledgements);

        const intentId = String(req.body?.intentId || '').trim();
        const clientSecret = String(req.body?.clientSecret || '').trim();
        if (!intentId || !clientSecret) {
            return res.status(400).send({ status: false, message: 'intentId and clientSecret are required' });
        }

        const intent = await LanguageHeritagePaymentIntent.findOne({
            intentId,
            listingId: listing.listingId,
            walletAddress: actorWallet,
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

        let receipt = await LanguageHeritageReceipt.findOne({
            listingId: listing.listingId,
            walletAddress: actorWallet,
            status: 'issued'
        });

        if (!receipt) {
            receipt = await LanguageHeritageReceipt.create({
                receiptId: `lhrec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                listingId: listing.listingId,
                walletAddress: actorWallet,
                amount: Number(intent.amount || 0),
                currency: intent.currency || 'USD',
                status: 'issued',
                metadata: {
                    listingTitle: listing.title,
                    paymentIntentId: intent.intentId,
                    consentAccepted: true,
                    acknowledgements
                }
            });
        }

        intent.status = 'confirmed';
        intent.confirmedAt = new Date();
        intent.receiptId = receipt.receiptId;
        await intent.save();

        return res.status(200).send({
            status: true,
            message: 'Payment confirmed and receipt issued',
            receipt: {
                receiptId: receipt.receiptId,
                listingId: receipt.listingId,
                amount: receipt.amount,
                currency: receipt.currency,
                createdAt: receipt.createdAt
            }
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to confirm payment' });
    }
};

exports.getMyReceipts = async (req, res) => {
    try {
        const actorWallet = resolveAuthenticatedWallet(req);
        if (!actorWallet) {
            return res.status(401).send({ status: false, message: 'Wallet authentication required' });
        }

        const limit = Math.max(1, Math.min(100, parseInt(String(req.query?.limit || '50'), 10) || 50));
        const receipts = await LanguageHeritageReceipt.find({ walletAddress: actorWallet })
            .sort({ createdAt: -1 })
            .limit(limit);

        return res.status(200).send({ status: true, count: receipts.length, receipts });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to load receipts' });
    }
};

exports.getMyAccessRequests = async (req, res) => {
    try {
        const actorWallet = resolveAuthenticatedWallet(req);
        if (!actorWallet) {
            return res.status(401).send({ status: false, message: 'Wallet authentication required' });
        }

        const limit = Math.max(1, Math.min(100, parseInt(String(req.query?.limit || '50'), 10) || 50));
        const rows = await LanguageHeritageAccessRequest.find({ walletAddress: actorWallet })
            .sort({ createdAt: -1 })
            .limit(limit);

        return res.status(200).send({ status: true, count: rows.length, requests: rows });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to load access requests' });
    }
};

exports.getAccessRequestQueue = async (req, res) => {
    try {
        const status = String(req.query?.status || 'pending').trim();
        const limit = Math.max(1, Math.min(200, parseInt(String(req.query?.limit || '100'), 10) || 100));
        const filters = {};
        if (status && status !== 'all') filters.status = status;

        const rows = await LanguageHeritageAccessRequest.find(filters)
            .sort({ createdAt: -1 })
            .limit(limit);

        return res.status(200).send({ status: true, count: rows.length, requests: rows });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to load access request queue' });
    }
};

exports.decideAccessRequest = async (req, res) => {
    try {
        const requestId = String(req.params.requestId || '').trim();
        const decision = String(req.body?.decision || '').trim().toLowerCase();
        if (!requestId) return res.status(400).send({ status: false, message: 'requestId is required' });
        if (!['approved', 'rejected'].includes(decision)) {
            return res.status(400).send({ status: false, message: 'decision must be approved or rejected' });
        }

        const row = await LanguageHeritageAccessRequest.findOne({ requestId });
        if (!row) return res.status(404).send({ status: false, message: 'Access request not found' });

        row.status = decision;
        row.note = String(req.body?.note || row.note || '').trim().slice(0, 500);
        row.reviewedBy = String(req.adminWallet || '').trim().toLowerCase();
        row.reviewedAt = new Date();
        await row.save();

        return res.status(200).send({
            status: true,
            message: `Access request ${decision}`,
            request: row
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to decide access request' });
    }
};

exports.trackEvent = async (req, res) => {
    try {
        const event = String(req.body?.event || '').trim();
        if (!event) {
            return res.status(400).json({ success: false, message: 'event is required' });
        }

        const actorWallet = resolveAuthenticatedWallet(req, 'walletAddress');

        if (REQUIRE_HERITAGE_USER_AUTH && !actorWallet) {
            return res.status(401).json({ success: false, message: 'Wallet authentication required' });
        }

        await LanguageHeritageEvent.create({
            event,
            listingId: String(req.body?.listingId || ''),
            categoryId: String(req.body?.categoryId || ''),
            metadata: {
                ...(req.body?.metadata && typeof req.body.metadata === 'object' ? req.body.metadata : {}),
                walletAddress: actorWallet || ''
            }
        });

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getOverview = async (_req, res) => {
    try {
        await ensureSeedData();
        const [total, communityControlled, elderApproved] = await Promise.all([
            LanguageHeritageListing.countDocuments({ status: 'published' }),
            LanguageHeritageListing.countDocuments({ status: 'published', communityControlled: true }),
            LanguageHeritageListing.countDocuments({ status: 'published', elderApproved: true })
        ]);

        res.status(200).json({
            success: true,
            metrics: {
                totalListings: total,
                communityControlled,
                elderApproved
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getLanguagesDirectory = async (req, res) => {
    try {
        await ensureSeedData();
        const q = String(req.query?.q || '').trim().toLowerCase();
        const docs = await LanguageHeritageListing.aggregate([
            { $match: { status: 'published' } },
            {
                $group: {
                    _id: '$nation',
                    totalItems: { $sum: 1 },
                    avgRating: { $avg: '$rating' },
                    categories: { $addToSet: '$categoryId' }
                }
            },
            { $sort: { totalItems: -1, _id: 1 } }
        ]);

        const items = docs
            .map((row) => ({
                languageId: String(row._id || '').trim().toLowerCase().replace(/\s+/g, '-'),
                name: String(row._id || 'Unknown'),
                totalItems: Number(row.totalItems || 0),
                avgRating: Number((row.avgRating || 0).toFixed(2)),
                categories: Array.isArray(row.categories) ? row.categories : []
            }))
            .filter((row) => !q || row.name.toLowerCase().includes(q) || row.languageId.includes(q));

        return res.status(200).send({ status: true, count: items.length, items });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to load language directory' });
    }
};

exports.getCommunityProfile = async (req, res) => {
    try {
        await ensureSeedData();
        const communityId = String(req.params.communityId || '').trim().toLowerCase();
        if (!communityId) return res.status(400).send({ status: false, message: 'communityId is required' });

        const all = await LanguageHeritageListing.find({ status: 'published' }).lean();
        const byCommunity = all.filter((row) => {
            const nation = String(row.nation || '').trim().toLowerCase();
            const slug = nation.replace(/\s+/g, '-');
            return slug === communityId || nation.includes(communityId.replace(/-/g, ' '));
        });
        if (byCommunity.length === 0) {
            return res.status(404).send({ status: false, message: 'Community not found' });
        }

        const nation = String(byCommunity[0].nation || 'Community');
        const categoryCounts = {};
        byCommunity.forEach((row) => {
            const key = String(row.categoryId || 'other');
            categoryCounts[key] = (categoryCounts[key] || 0) + 1;
        });
        const featured = byCommunity
            .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
            .slice(0, 6)
            .map(mapListing);

        return res.status(200).send({
            status: true,
            profile: {
                communityId,
                nation,
                totalItems: byCommunity.length,
                categoryCounts,
                featured
            }
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to load community profile' });
    }
};

exports.getDictionaryEntry = async (req, res) => {
    try {
        const entryId = String(req.params.entryId || '').trim().toLowerCase();
        if (!entryId) return res.status(400).send({ status: false, message: 'entryId is required' });
        const entry = DICTIONARY_ENTRIES[entryId];
        if (!entry) return res.status(404).send({ status: false, message: 'Dictionary entry not found' });
        return res.status(200).send({ status: true, entry });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to load dictionary entry' });
    }
};

exports.getRecordingDetail = async (req, res) => {
    try {
        const listing = await findListingOr404(res, req.params.recordingId);
        if (!listing) return;
        return res.status(200).send({
            status: true,
            recording: {
                ...mapListing(listing),
                transcriptPreview: `${String(listing.summary || '')} ...`,
                subtitles: ['English'],
                waveformReady: ['audio', 'video'].includes(String(listing.format || ''))
            }
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to load recording detail' });
    }
};

exports.getToolDetail = async (req, res) => {
    try {
        const listing = await findListingOr404(res, req.params.toolId);
        if (!listing) return;
        return res.status(200).send({
            status: true,
            tool: {
                ...mapListing(listing),
                pricingTiers: [
                    { label: 'Monthly', amount: Number(listing.price || 0), period: 'month' },
                    { label: 'Yearly', amount: Number(listing.price || 0) * 10, period: 'year' }
                ],
                screenshots: [listing.image].filter(Boolean)
            }
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'Failed to load tool detail' });
    }
};
