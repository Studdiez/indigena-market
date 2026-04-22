const CulturalTourismExperience = require('../models/CulturalTourismExperience.model.js');
const CulturalTourismBooking = require('../models/CulturalTourismBooking.model.js');
const CulturalTourismTerritory = require('../models/CulturalTourismTerritory.model.js');
const CulturalTourismModeration = require('../models/CulturalTourismModeration.model.js');
const CulturalTourismEvent = require('../models/CulturalTourismEvent.model.js');
const CulturalTourismReview = require('../models/CulturalTourismReview.model.js');
const CulturalTourismUserActionNonce = require('../models/CulturalTourismUserActionNonce.model.js');
const CulturalTourismAuthChallenge = require('../models/CulturalTourismAuthChallenge.model.js');
const CulturalTourismAuthSession = require('../models/CulturalTourismAuthSession.model.js');
const CulturalTourismOperator = require('../models/CulturalTourismOperator.model.js');
const CulturalTourismSlotLock = require('../models/CulturalTourismSlotLock.model.js');
const CulturalTourismPaymentEvent = require('../models/CulturalTourismPaymentEvent.model.js');
const CulturalTourismCommsJob = require('../models/CulturalTourismCommsJob.model.js');
const CulturalTourismAdminAction = require('../models/CulturalTourismAdminAction.model.js');
const tourismPaymentService = require('../services/pillars/culturalTourismPayment.service.js');
const premiumPlacementService = require('../services/premiumPlacement.service.js');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { ethers } = require('ethers');

const DEFAULT_PAGE_LIMIT = 12;
const SLOT_LOCK_TTL_MS = Math.max(5000, Number(process.env.TOURISM_SLOT_LOCK_TTL_MS || 15000));
const PAYMENT_HOLD_MINUTES = Math.max(5, Number(process.env.TOURISM_PAYMENT_HOLD_MINUTES || 20));
const ADMIN_ACTION_SECRET = String(process.env.ADMIN_ACTION_SECRET || '').trim();
const USER_ACTION_SECRET = String(process.env.USER_ACTION_SECRET || '').trim();
const USER_JWT_SECRET = String(process.env.USER_JWT_SECRET || '').trim();
const REQUIRE_SIGNED_USER_ACTIONS = process.env.NODE_ENV === 'production' || process.env.REQUIRE_SIGNED_USER_ACTIONS === 'true';
const REQUIRE_JWT_USER_AUTH = process.env.NODE_ENV === 'production' || process.env.REQUIRE_JWT_USER_AUTH === 'true';
const USER_ACTION_MAX_SKEW_MS = Math.max(30000, Number(process.env.USER_ACTION_MAX_SKEW_MS || 5 * 60 * 1000));
const AUTH_CHALLENGE_TTL_MS = Math.max(60000, Number(process.env.AUTH_CHALLENGE_TTL_MS || 10 * 60 * 1000));
const AUTH_ACCESS_TOKEN_TTL_SECONDS = Math.max(60, Number(process.env.AUTH_ACCESS_TOKEN_TTL_SECONDS || 15 * 60));
const AUTH_REFRESH_TOKEN_TTL_SECONDS = Math.max(300, Number(process.env.AUTH_REFRESH_TOKEN_TTL_SECONDS || 30 * 24 * 60 * 60));

const SEED_EXPERIENCES = [
    {
        experienceId: 'tour-001',
        title: 'Yolngu Sunrise Cultural Walk',
        kind: 'guided-tours',
        nation: 'Yolngu',
        community: 'Gove Peninsula Collective',
        region: 'Arnhem Land, AU',
        coordinates: { lat: -12.1871, lng: 136.7820 },
        summary: 'Dawn walk through coastal country with seasonal knowledge and visitor protocols.',
        image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1200&h=800&fit=crop',
        priceFrom: 120,
        currency: 'USD',
        durationLabel: 'Half Day',
        groupSize: 'Up to 12',
        rating: 4.9,
        reviews: 184,
        verificationTier: 'Gold',
        elderApproved: true,
        sacredContent: false,
        virtual: false,
        availableNextDate: '2026-03-15',
        protocols: [
            { id: 'p-photo', label: 'No photography at marked sites', required: true },
            { id: 'p-dress', label: 'Modest clothing required', required: true }
        ],
        sessions: [
            { sessionId: 'morning-0900', label: 'Morning Session (09:00)', startTime: '09:00', endTime: '12:00', capacity: 12, active: true, virtual: false },
            { sessionId: 'sunset-1600', label: 'Sunset Session (16:00)', startTime: '16:00', endTime: '19:00', capacity: 12, active: true, virtual: false }
        ],
        consentChecklist: ['No photography at marked sites', 'Respect guided protocol boundaries'],
        mediaRestrictions: { photoAllowed: false, audioAllowed: true, videoAllowed: false },
        tags: ['land-based', 'storytelling', 'sunrise'],
        featured: true,
        createdByWallet: 'demo-operator-wallet',
        status: 'active'
    },
    {
        experienceId: 'tour-002',
        title: 'Maori Kai and Hangi Workshop',
        kind: 'culinary',
        nation: 'Maori',
        community: 'Rotorua Kai Circle',
        region: 'Rotorua, NZ',
        coordinates: { lat: -38.1368, lng: 176.2497 },
        summary: 'Hands-on traditional food preparation with cultural context and shared feast.',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop',
        priceFrom: 95,
        currency: 'USD',
        durationLabel: 'Full Day',
        groupSize: 'Up to 18',
        rating: 4.8,
        reviews: 133,
        verificationTier: 'Silver',
        elderApproved: false,
        sacredContent: false,
        virtual: false,
        availableNextDate: '2026-03-18',
        protocols: [{ id: 'p-food', label: 'Respect food blessing sequence', required: true }],
        sessions: [
            { sessionId: 'midday-1200', label: 'Midday Session (12:00)', startTime: '12:00', endTime: '16:00', capacity: 18, active: true, virtual: false }
        ],
        consentChecklist: ['Respect food blessing sequence'],
        mediaRestrictions: { photoAllowed: true, audioAllowed: true, videoAllowed: true },
        tags: ['food', 'workshop', 'family-friendly'],
        featured: true,
        createdByWallet: 'demo-operator-wallet',
        status: 'active'
    },
    {
        experienceId: 'tour-003',
        title: 'Lakota Star Knowledge Night',
        kind: 'specialty',
        nation: 'Lakota',
        community: 'Black Hills Star Council',
        region: 'South Dakota, US',
        coordinates: { lat: 44.4169, lng: -103.7088 },
        summary: 'Night sky session connecting constellations with oral history and seasonal teachings.',
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=800&fit=crop',
        priceFrom: 80,
        currency: 'USD',
        durationLabel: 'Half Day',
        groupSize: 'Up to 20',
        rating: 4.9,
        reviews: 201,
        verificationTier: 'Platinum',
        elderApproved: true,
        sacredContent: true,
        virtual: true,
        availableNextDate: '2026-03-20',
        protocols: [
            { id: 'p-recording', label: 'No audio recording of stories', required: true },
            { id: 'p-arrival', label: 'Arrive 20 minutes before start', required: true }
        ],
        sessions: [
            { sessionId: 'live-stream', label: 'Live Stream Access', startTime: '20:00', endTime: '22:00', capacity: 40, active: true, virtual: true },
            { sessionId: 'replay-qa', label: 'Replay + Live Q&A', startTime: '22:00', endTime: '23:00', capacity: 60, active: true, virtual: true }
        ],
        consentChecklist: ['No audio recording of stories', 'No video capture during sacred storytelling'],
        mediaRestrictions: { photoAllowed: true, audioAllowed: false, videoAllowed: false },
        tags: ['astrotourism', 'virtual option', 'elder-led'],
        featured: true,
        createdByWallet: 'demo-operator-wallet',
        status: 'active'
    }
];

const SEED_TERRITORIES = [
    { territoryId: 't-001', territoryName: 'Yolngu Sea Country', nation: 'Yolngu', region: 'Arnhem Land, AU', experiences: 18, protocolsRequired: true },
    { territoryId: 't-002', territoryName: 'Te Arawa Cultural District', nation: 'Maori', region: 'Rotorua, NZ', experiences: 25, protocolsRequired: true },
    { territoryId: 't-003', territoryName: 'Black Hills Star Territory', nation: 'Lakota', region: 'South Dakota, US', experiences: 12, protocolsRequired: true },
    { territoryId: 't-004', territoryName: 'Nunavut Ice-Water Corridors', nation: 'Inuit', region: 'Nunavut, CA', experiences: 9, protocolsRequired: false }
];

const SEED_MODERATION = [
    {
        moderationId: 'mod-001',
        listingId: 'tour-003',
        listingTitle: 'Lakota Star Knowledge Night',
        issueType: 'protocol',
        reason: 'Guest reported unauthorized recording attempt during session.',
        status: 'open',
        priority: 'p1',
        queue: 'legal_protocol',
        slaDueAt: new Date(Date.now() + 24 * 60 * 60000)
    },
    {
        moderationId: 'mod-002',
        listingId: 'tour-001',
        listingTitle: 'Yolngu Sunrise Cultural Walk',
        issueType: 'authenticity',
        reason: 'Verification document requires annual renewal.',
        status: 'under_review',
        priority: 'p2',
        queue: 'trust_safety',
        slaDueAt: new Date(Date.now() + 48 * 60 * 60000)
    }
];

async function ensureSeedData() {
    const expCount = await CulturalTourismExperience.countDocuments({});
    if (expCount === 0) {
        await CulturalTourismExperience.insertMany(SEED_EXPERIENCES);
    }

    const territoryCount = await CulturalTourismTerritory.countDocuments({});
    if (territoryCount === 0) {
        await CulturalTourismTerritory.insertMany(SEED_TERRITORIES);
    }

    const moderationCount = await CulturalTourismModeration.countDocuments({});
    if (moderationCount === 0) {
        await CulturalTourismModeration.insertMany(SEED_MODERATION);
    }

    const docsMissingLocation = await CulturalTourismExperience.find({
        $or: [
            { location: { $exists: false } },
            { 'location.coordinates': { $exists: false } }
        ],
        'coordinates.lat': { $ne: null },
        'coordinates.lng': { $ne: null }
    }).limit(500);
    if (docsMissingLocation.length > 0) {
        for (const doc of docsMissingLocation) {
            await doc.save();
        }
    }
}

function parsePageValue(raw, fallback) {
    const parsed = Number(raw);
    if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
    return Math.floor(parsed);
}

function encodeCursor(payload) {
    return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
}

function decodeCursor(raw) {
    if (!raw) return null;
    try {
        const text = Buffer.from(String(raw), 'base64url').toString('utf8');
        const parsed = JSON.parse(text);
        if (!parsed || typeof parsed !== 'object') return null;
        return parsed;
    } catch {
        return null;
    }
}

function mapExperience(doc) {
    return {
        id: doc.experienceId,
        title: doc.title,
        kind: doc.kind,
        nation: doc.nation,
        community: doc.community,
        region: doc.region,
        coordinates: doc.coordinates || { lat: null, lng: null },
        summary: doc.summary,
        image: doc.image,
        priceFrom: Number(doc.priceFrom || 0),
        currency: doc.currency || 'USD',
        durationLabel: doc.durationLabel,
        groupSize: doc.groupSize,
        maxCapacity: Number(doc.maxCapacity || 0),
        rating: Number(doc.rating || 0),
        reviews: Number(doc.reviews || 0),
        verificationTier: doc.verificationTier,
        elderApproved: Boolean(doc.elderApproved),
        sacredContent: Boolean(doc.sacredContent),
        virtual: Boolean(doc.virtual),
        availableNextDate: doc.availableNextDate,
        blackoutDates: Array.isArray(doc.blackoutDates) ? doc.blackoutDates : [],
        protocols: doc.protocols || [],
        sessions: mapSessions(doc),
        consentChecklist: Array.isArray(doc.consentChecklist) ? doc.consentChecklist : [],
        mediaRestrictions: mapMediaRestrictions(doc.mediaRestrictions || {}),
        tags: doc.tags || [],
        featured: Boolean(doc.featured),
        createdAt: doc.createdAt
    };
}

function parseCapacityFromGroupSize(groupSize) {
    const text = String(groupSize || '');
    const nums = text.match(/\d+/g) || [];
    if (!nums.length) return 10;
    const values = nums.map((n) => Number(n)).filter((n) => Number.isFinite(n) && n > 0);
    if (!values.length) return 10;
    return Math.max(...values);
}

function normalizeIsoDate(dateText) {
    const date = String(dateText || '').trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : '';
}

function isPastDate(dateText) {
    const now = new Date();
    const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const requestedUtc = new Date(`${dateText}T00:00:00.000Z`);
    if (Number.isNaN(requestedUtc.getTime())) return true;
    return requestedUtc < todayUtc;
}

function normalizeWallet(value) {
    return String(value || '').trim().toLowerCase();
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeSessionId(value) {
    const raw = String(value || '').trim().toLowerCase();
    return raw || 'default';
}

function getSlotLockKey(experienceId, date, sessionId = 'default') {
    return `${String(experienceId || '').trim()}::${String(date || '').trim()}::${normalizeSessionId(sessionId)}`;
}

function parseNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
}

function haversineDistanceKm(aLat, aLng, bLat, bLng) {
    const toRad = (x) => (Number(x) * Math.PI) / 180;
    const dLat = toRad(parseNumber(bLat) - parseNumber(aLat));
    const dLng = toRad(parseNumber(bLng) - parseNumber(aLng));
    const lat1 = toRad(aLat);
    const lat2 = toRad(bLat);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return 6371 * (2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)));
}

function mapMediaRestrictions(input = {}) {
    return {
        photoAllowed: input.photoAllowed !== false,
        audioAllowed: input.audioAllowed !== false,
        videoAllowed: input.videoAllowed !== false
    };
}

function normalizeSessionEntry(input = {}, fallbackCapacity = 0) {
    const sessionId = normalizeSessionId(input.sessionId || input.id || input.label || 'default');
    const label = String(input.label || input.sessionLabel || sessionId).trim() || sessionId;
    const capacityRaw = Number(input.capacity);
    const capacity = Number.isFinite(capacityRaw) && capacityRaw > 0
        ? Math.floor(capacityRaw)
        : Math.max(1, Number(fallbackCapacity || 0));
    return {
        sessionId,
        label,
        startTime: String(input.startTime || '').trim(),
        endTime: String(input.endTime || '').trim(),
        capacity,
        active: input.active !== false,
        virtual: input.virtual === true
    };
}

function normalizeSessionsInput(list, fallbackCapacity = 0) {
    if (!Array.isArray(list) || list.length === 0) return [];
    const seen = new Set();
    const out = [];
    list.forEach((entry) => {
        const session = normalizeSessionEntry(entry, fallbackCapacity);
        if (seen.has(session.sessionId)) return;
        seen.add(session.sessionId);
        out.push(session);
    });
    return out;
}

function buildDefaultSession(item) {
    const fallbackCapacity = Number(item?.maxCapacity || 0) > 0
        ? Number(item.maxCapacity)
        : parseCapacityFromGroupSize(item?.groupSize || '');
    return {
        sessionId: 'default',
        label: item?.virtual ? 'Live Stream Access' : 'General Admission',
        startTime: '',
        endTime: '',
        capacity: Math.max(1, fallbackCapacity),
        active: true,
        virtual: Boolean(item?.virtual)
    };
}

function mapSessions(item) {
    const normalized = normalizeSessionsInput(item?.sessions || [], item?.maxCapacity || 0);
    if (normalized.length > 0) return normalized;
    return [buildDefaultSession(item)];
}

function findSessionForExperience(item, requestedSessionId = 'default') {
    const sessions = mapSessions(item);
    const normalized = normalizeSessionId(requestedSessionId);
    const activeTarget = sessions.find((x) => x.sessionId === normalized && x.active !== false);
    if (activeTarget) return activeTarget;
    const activeDefault = sessions.find((x) => x.active !== false) || sessions[0];
    return activeDefault || buildDefaultSession(item);
}

function mapReview(doc) {
    return {
        reviewId: doc.reviewId,
        bookingId: doc.bookingId,
        experienceId: doc.experienceId,
        rating: Number(doc.rating || 0),
        comment: String(doc.comment || ''),
        createdAt: doc.createdAt
    };
}

async function refreshExperienceReviewStats(experienceId) {
    const rows = await CulturalTourismReview.aggregate([
        { $match: { experienceId: String(experienceId || '') } },
        {
            $group: {
                _id: '$experienceId',
                count: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);
    const nextCount = Number(rows?.[0]?.count || 0);
    const nextRating = nextCount > 0 ? Number(rows[0].avgRating || 0) : 0;
    await CulturalTourismExperience.updateOne(
        { experienceId: String(experienceId || '') },
        {
            $set: {
                reviews: nextCount,
                rating: Number(nextRating.toFixed(2))
            }
        }
    );
}

function buildProtocolSnapshot(item) {
    const baseProtocols = Array.isArray(item.protocols) ? item.protocols : [];
    const requiredConsent = Array.isArray(item.consentChecklist) ? item.consentChecklist : [];
    const normalizedConsent = requiredConsent.map((x) => String(x || '').trim()).filter(Boolean);
    const protoLabels = baseProtocols.map((p) => String(p.label || '').trim()).filter(Boolean);
    return Array.from(new Set([...protoLabels, ...normalizedConsent]));
}

function parseAcknowledgements(value) {
    if (Array.isArray(value)) return value.map((x) => String(x || '').trim()).filter(Boolean);
    if (!value) return [];
    return String(value)
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean);
}

function requiresSignedAction() {
    return ADMIN_ACTION_SECRET.length > 0 || process.env.NODE_ENV === 'production';
}

function verifyAdminActionSignature(req, action, targetId = '') {
    if (!requiresSignedAction()) return { ok: true, signed: false, timestamp: '' };
    if (ADMIN_ACTION_SECRET.length === 0) {
        return { ok: false, message: 'Admin signing secret is required in production' };
    }
    const timestamp = String(req.headers['x-admin-action-timestamp'] || '').trim();
    const signature = String(req.headers['x-admin-action-signature'] || '').trim().toLowerCase();
    const bodyText = JSON.stringify(req.body || {});
    if (!timestamp || !signature) {
        return { ok: false, message: 'Missing signed admin action headers' };
    }
    const expected = crypto
        .createHmac('sha256', ADMIN_ACTION_SECRET)
        .update(`${timestamp}:${action}:${targetId}:${bodyText}`)
        .digest('hex')
        .toLowerCase();
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
        return { ok: false, message: 'Invalid admin action signature' };
    }
    return { ok: true, signed: true, timestamp };
}

function computeFareBreakdown(unitPrice, guests) {
    const safeUnitPrice = Math.max(0, Number(unitPrice || 0));
    const safeGuests = Math.max(1, Number(guests || 1));
    const baseFare = Number((safeUnitPrice * safeGuests).toFixed(2));
    const serviceFee = Number((baseFare * 0.06).toFixed(2));
    const taxAmount = Number((baseFare * 0.03).toFixed(2));
    const totalAmount = Number((baseFare + serviceFee + taxAmount).toFixed(2));
    return { baseFare, serviceFee, taxAmount, totalAmount };
}

function extractBearerToken(req) {
    const raw = String(req.headers.authorization || '').trim();
    if (!raw.toLowerCase().startsWith('bearer ')) return '';
    return raw.slice(7).trim();
}

function hashToken(value) {
    return crypto.createHash('sha256').update(String(value || '')).digest('hex');
}

function generateRandomToken(bytes = 32) {
    return crypto.randomBytes(bytes).toString('hex');
}

function issueAccessToken(wallet, email = '') {
    if (!USER_JWT_SECRET) return '';
    return jwt.sign(
        {
            sub: String(wallet || ''),
            wallet: String(wallet || ''),
            email: String(email || '')
        },
        USER_JWT_SECRET,
        { expiresIn: AUTH_ACCESS_TOKEN_TTL_SECONDS }
    );
}

async function issueUserSession(wallet, email = '') {
    const sessionId = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const refreshToken = generateRandomToken(48);
    const refreshTokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + AUTH_REFRESH_TOKEN_TTL_SECONDS * 1000);
    await CulturalTourismAuthSession.create({
        sessionId,
        wallet: normalizeWallet(wallet),
        refreshTokenHash,
        expiresAt,
        revokedAt: null,
        lastUsedAt: new Date()
    });
    return {
        accessToken: issueAccessToken(wallet, email),
        refreshToken,
        sessionId,
        expiresIn: AUTH_ACCESS_TOKEN_TTL_SECONDS
    };
}

async function markUserActionNonce(wallet, action, targetId, nonce, timestamp) {
    const normalizedWallet = normalizeWallet(wallet);
    const normalizedNonce = String(nonce || '').trim().toLowerCase();
    if (!normalizedWallet || !normalizedNonce) return false;
    const nonceKey = `${normalizedWallet}:${normalizedNonce}`;
    try {
        await CulturalTourismUserActionNonce.create({
            nonceKey,
            wallet: normalizedWallet,
            action: String(action || ''),
            targetId: String(targetId || ''),
            timestamp: Number(timestamp || Date.now()),
            expiresAt: new Date(Date.now() + USER_ACTION_MAX_SKEW_MS)
        });
        return true;
    } catch (error) {
        if (error && error.code === 11000) return false;
        throw error;
    }
}

async function verifyUserActionAuth(req, action, targetId = '') {
    const token = extractBearerToken(req);
    if (token && USER_JWT_SECRET) {
        try {
            const payload = jwt.verify(token, USER_JWT_SECRET);
            const wallet = normalizeWallet(payload?.wallet || payload?.address || payload?.sub || '');
            const email = String(payload?.email || '').trim().toLowerCase();
            if (!wallet && !email) {
                return { ok: false, message: 'JWT token missing wallet/email claim' };
            }
            return { ok: true, mode: 'jwt', wallet, email };
        } catch {
            return { ok: false, message: 'Invalid user JWT token' };
        }
    }
    if (REQUIRE_JWT_USER_AUTH) {
        return { ok: false, message: 'JWT authentication is required' };
    }

    const wallet = normalizeWallet(req.headers['x-wallet-address'] || req.body?.wallet || req.body?.travelerWallet || '');
    const email = String(req.body?.travelerEmail || req.query?.email || '').trim().toLowerCase();
    if (!wallet && !email) {
        return { ok: false, message: 'User wallet or email is required' };
    }

    const timestamp = String(req.headers['x-user-action-timestamp'] || '').trim();
    const nonce = String(req.headers['x-user-action-nonce'] || '').trim().toLowerCase();
    const signature = String(req.headers['x-user-action-signature'] || '').trim().toLowerCase();
    if (!timestamp || !signature) {
        if (REQUIRE_SIGNED_USER_ACTIONS) {
            return { ok: false, message: 'Missing signed user action headers' };
        }
        return { ok: true, mode: 'unsigned', wallet, email };
    }
    const tsNum = Number(timestamp);
    if (!Number.isFinite(tsNum)) {
        return { ok: false, message: 'Invalid user action timestamp' };
    }
    if (Math.abs(Date.now() - tsNum) > USER_ACTION_MAX_SKEW_MS) {
        return { ok: false, message: 'User action timestamp expired' };
    }
    if (!nonce) {
        return { ok: false, message: 'Missing user action nonce' };
    }

    if (!USER_ACTION_SECRET) {
        return REQUIRE_SIGNED_USER_ACTIONS
            ? { ok: false, message: 'User action signing secret is not configured' }
            : { ok: true, mode: 'unsigned', wallet, email };
    }

    const bodyText = JSON.stringify(req.body || {});
    const expected = crypto
        .createHmac('sha256', USER_ACTION_SECRET)
        .update(`${timestamp}:${nonce}:${action}:${targetId}:${wallet}:${bodyText}`)
        .digest('hex')
        .toLowerCase();
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
        return { ok: false, message: 'Invalid signed user action' };
    }
    const accepted = await markUserActionNonce(wallet, action, targetId, nonce, tsNum);
    if (!accepted) {
        return { ok: false, message: 'User action nonce already used' };
    }
    return { ok: true, mode: 'signature', wallet, email };
}

async function recordAdminAction({ adminWallet, action, targetType, targetId, signed, signatureTimestamp, metadata }) {
    await CulturalTourismAdminAction.create({
        actionId: `admin-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        adminWallet: normalizeWallet(adminWallet),
        action,
        targetType,
        targetId,
        signed: Boolean(signed),
        signatureTimestamp: String(signatureTimestamp || ''),
        metadata: metadata || {}
    });
}

function getBookingHoldExpiry() {
    return new Date(Date.now() + PAYMENT_HOLD_MINUTES * 60000);
}

async function expireStalePendingBookings() {
    const now = new Date();
    await CulturalTourismBooking.updateMany(
        {
            status: 'pending',
            paymentStatus: { $in: ['requires_payment', 'requires_confirmation', 'failed'] },
            paymentDueAt: { $ne: null, $lt: now }
        },
        {
            $set: {
                status: 'cancelled',
                cancellationReason: 'Payment hold expired',
                cancelledAt: now
            }
        }
    );
}

async function queueCommsJob({ booking, experience, type, minutesOffset, channel, recipient, payload }) {
    const scheduledFor = new Date(Date.now() + minutesOffset * 60000);
    await CulturalTourismCommsJob.create({
        jobId: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        bookingId: booking.bookingId,
        experienceId: booking.experienceId,
        channel,
        type,
        recipient,
        scheduledFor,
        payload: {
            bookingId: booking.bookingId,
            experienceTitle: booking.experienceTitle,
            date: booking.date,
            protocols: booking.protocolSnapshot || [],
            restrictions: booking.mediaRestrictions || mapMediaRestrictions(experience?.mediaRestrictions || {}),
            ...(payload || {})
        }
    });
}

async function acquireSlotLock(experienceId, date, owner, sessionId = 'default') {
    const normalizedSessionId = normalizeSessionId(sessionId);
    const lockKey = getSlotLockKey(experienceId, date, normalizedSessionId);
    const maxAttempts = 20;
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        try {
            const now = new Date();
            const expiresAt = new Date(now.getTime() + SLOT_LOCK_TTL_MS);

            const locked = await CulturalTourismSlotLock.findOneAndUpdate(
                {
                    lockKey,
                    $or: [{ expiresAt: { $lte: now } }, { owner }]
                },
                {
                    $set: {
                        lockKey,
                        experienceId,
                        date,
                        sessionId: normalizedSessionId,
                        owner,
                        expiresAt
                    }
                },
                {
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true
                }
            );

            if (locked && locked.owner === owner) {
                return lockKey;
            }
        } catch (error) {
            if (!error || error.code !== 11000) {
                throw error;
            }
        }

        await sleep(50 + attempt * 10);
    }
    return '';
}

async function releaseSlotLock(lockKey, owner) {
    if (!lockKey) return;
    await CulturalTourismSlotLock.deleteOne({ lockKey, owner });
}

function mapPaymentStatusToBookingStatus(paymentStatus) {
    if (paymentStatus === 'captured') return 'confirmed';
    if (paymentStatus === 'failed') return 'pending';
    if (paymentStatus === 'refunded') return 'cancelled';
    return 'pending';
}

function mapBooking(doc) {
    return {
        bookingId: doc.bookingId,
        experienceId: doc.experienceId,
        experienceTitle: doc.experienceTitle,
        date: doc.date,
        sessionId: doc.sessionId || 'default',
        sessionLabel: doc.sessionLabel || '',
        guests: doc.guests,
        baseFare: Number(doc.baseFare || 0),
        serviceFee: Number(doc.serviceFee || 0),
        taxAmount: Number(doc.taxAmount || 0),
        totalAmount: doc.totalAmount,
        currency: doc.currency,
        status: doc.status,
        paymentStatus: doc.paymentStatus || 'requires_payment',
        paymentIntentId: doc.paymentIntentId || '',
        paymentProvider: doc.paymentProvider || '',
        paymentReference: doc.paymentReference || '',
        receiptId: doc.receiptId || '',
        paymentDueAt: doc.paymentDueAt || null,
        protocolSnapshot: Array.isArray(doc.protocolSnapshot) ? doc.protocolSnapshot : [],
        mediaRestrictions: mapMediaRestrictions(doc.mediaRestrictions || {}),
        ticketId: doc.ticketId || '',
        fareBreakdown: {
            baseFare: Number(doc.baseFare || 0),
            serviceFee: Number(doc.serviceFee || 0),
            taxAmount: Number(doc.taxAmount || 0),
            totalAmount: Number(doc.totalAmount || 0)
        },
        createdAt: doc.createdAt
    };
}

async function getAvailabilitySnapshot(item, date, excludeBookingId = '', sessionId = 'default') {
    await expireStalePendingBookings();
    const normalizedDate = normalizeIsoDate(date);
    const session = findSessionForExperience(item, sessionId);
    const capacity = Number(session?.capacity || 0) > 0
        ? Number(session.capacity)
        : Number(item.maxCapacity || 0) > 0
            ? Number(item.maxCapacity)
            : parseCapacityFromGroupSize(item.groupSize);
    const isBlackout = (item.blackoutDates || []).includes(normalizedDate);
    if (isBlackout) {
        return {
            date: normalizedDate,
            capacity,
            bookedGuests: capacity,
            remaining: 0,
            soldOut: true,
            blackout: true
        };
    }

    const match = {
        experienceId: item.experienceId,
        date: normalizedDate,
        sessionId: normalizeSessionId(sessionId),
        $or: [
            { status: 'confirmed' },
            {
                status: 'pending',
                paymentStatus: { $in: ['requires_payment', 'requires_confirmation', 'captured'] },
                paymentDueAt: { $gte: new Date() }
            }
        ]
    };
    if (excludeBookingId) {
        match.bookingId = { $ne: String(excludeBookingId) };
    }

    const rows = await CulturalTourismBooking.aggregate([
        { $match: match },
        { $group: { _id: null, guests: { $sum: '$guests' } } }
    ]);

    const bookedGuests = Number(rows?.[0]?.guests || 0);
    const remaining = Math.max(0, capacity - bookedGuests);
    return {
        date: normalizedDate,
        capacity,
        bookedGuests,
        remaining,
        soldOut: remaining <= 0,
        blackout: false
    };
}

async function getBookingAggregateByDate(experienceId, sessionId, startDate, days, excludeBookingId = '') {
    const start = normalizeIsoDate(startDate);
    const parsedDays = Math.max(1, Number(days || 1));
    const startUtc = new Date(`${start}T00:00:00.000Z`);
    const endUtc = new Date(startUtc.getTime() + parsedDays * 86400000);
    const end = endUtc.toISOString().slice(0, 10);

    const match = {
        experienceId: String(experienceId || ''),
        sessionId: normalizeSessionId(sessionId),
        date: { $gte: start, $lt: end },
        $or: [
            { status: 'confirmed' },
            {
                status: 'pending',
                paymentStatus: { $in: ['requires_payment', 'requires_confirmation', 'captured'] },
                paymentDueAt: { $gte: new Date() }
            }
        ]
    };
    if (excludeBookingId) {
        match.bookingId = { $ne: String(excludeBookingId) };
    }

    const rows = await CulturalTourismBooking.aggregate([
        { $match: match },
        { $group: { _id: '$date', guests: { $sum: '$guests' } } }
    ]);
    const map = new Map();
    rows.forEach((row) => {
        map.set(String(row._id), Number(row.guests || 0));
    });
    return map;
}

function buildExperienceFilter(query) {
    const {
        q = '',
        kind = 'all',
        region = '',
        minPrice,
        maxPrice,
        duration = 'any',
        verifiedOnly,
        virtualOnly
    } = query || {};

    const filter = { status: { $ne: 'archived' } };
    if (kind !== 'all') filter.kind = kind;
    if (region) filter.region = new RegExp(String(region), 'i');
    if (verifiedOnly === 'true') filter.verificationTier = { $in: ['Silver', 'Gold', 'Platinum'] };
    if (virtualOnly === 'true') filter.virtual = true;

    if (duration !== 'any') {
        if (duration === 'half-day') filter.durationLabel = /half/i;
        if (duration === 'full-day') filter.durationLabel = /full/i;
        if (duration === 'multi-day') filter.durationLabel = /multi/i;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        filter.priceFrom = {};
        if (minPrice !== undefined && minPrice !== '') filter.priceFrom.$gte = Number(minPrice);
        if (maxPrice !== undefined && maxPrice !== '') filter.priceFrom.$lte = Number(maxPrice);
    }

    if (String(q || '').trim()) {
        const regex = new RegExp(String(q).trim(), 'i');
        filter.$or = [
            { title: regex },
            { summary: regex },
            { nation: regex },
            { community: regex },
            { region: regex },
            { tags: regex }
        ];
    }

    return filter;
}

function buildRelevanceStages() {
    const eventsCollection = CulturalTourismEvent.collection?.name || 'culturaltourismevent-collections';
    return [
        {
            $lookup: {
                from: eventsCollection,
                let: { expId: '$experienceId' },
                pipeline: [
                    { $match: { $expr: { $eq: ['$experienceId', '$$expId'] } } },
                    {
                        $group: {
                            _id: '$experienceId',
                            score: {
                                $sum: {
                                    $switch: {
                                        branches: [
                                            { case: { $eq: ['$event', 'tourism_booking_completed'] }, then: 10 },
                                            { case: { $eq: ['$event', 'tourism_booking_started'] }, then: 4 },
                                            { case: { $eq: ['$event', 'tourism_view'] }, then: 2 },
                                            { case: { $eq: ['$event', 'tourism_search'] }, then: 1 }
                                        ],
                                        default: 0
                                    }
                                }
                            }
                        }
                    }
                ],
                as: 'engagement'
            }
        },
        {
            $addFields: {
                relevanceScore: {
                    $ifNull: [{ $arrayElemAt: ['$engagement.score', 0] }, 0]
                }
            }
        }
    ];
}

exports.getExperiences = async (req, res) => {
    try {
        await ensureSeedData();

        const {
            sort = 'featured',
            page = 1,
            limit = DEFAULT_PAGE_LIMIT,
            lat,
            lng,
            radiusKm,
            cluster
        } = req.query;

        const currentPage = parsePageValue(page, 1);
        const pageSize = parsePageValue(limit, DEFAULT_PAGE_LIMIT);
        const filter = buildExperienceFilter(req.query);
        const latNum = Number(lat);
        const lngNum = Number(lng);
        const hasGeo = Number.isFinite(latNum) && Number.isFinite(lngNum);
        const radius = Math.max(1, Number(radiusKm || 150));

        const sortMap = {
            'price-low': { priceFrom: 1, createdAt: -1, experienceId: -1 },
            'price-high': { priceFrom: -1, createdAt: -1, experienceId: -1 },
            rating: { rating: -1, reviews: -1, createdAt: -1, experienceId: -1 },
            newest: { createdAt: -1, experienceId: -1 },
            featured: { featured: -1, rating: -1, createdAt: -1, experienceId: -1 },
            relevance: { relevanceScore: -1, rating: -1, reviews: -1, createdAt: -1, experienceId: -1 }
        };

        let items = [];
        let total = 0;
        if (hasGeo) {
            const pipeline = [
                {
                    $geoNear: {
                        near: { type: 'Point', coordinates: [lngNum, latNum] },
                        distanceField: 'distanceMeters',
                        spherical: true,
                        maxDistance: radius * 1000,
                        query: filter
                    }
                }
            ];
            if (sort === 'relevance') {
                pipeline.push(...buildRelevanceStages());
            }
            pipeline.push({ $sort: sortMap[sort] || sortMap.featured });
            pipeline.push({
                $facet: {
                    items: [{ $skip: (currentPage - 1) * pageSize }, { $limit: pageSize }],
                    meta: [{ $count: 'total' }]
                }
            });
            const agg = await CulturalTourismExperience.aggregate(pipeline);
            items = agg?.[0]?.items || [];
            total = Number(agg?.[0]?.meta?.[0]?.total || 0);
        } else {
            if (sort === 'relevance') {
                const pipeline = [
                    { $match: filter },
                    ...buildRelevanceStages(),
                    { $sort: sortMap.relevance },
                    {
                        $facet: {
                            items: [{ $skip: (currentPage - 1) * pageSize }, { $limit: pageSize }],
                            meta: [{ $count: 'total' }]
                        }
                    }
                ];
                const agg = await CulturalTourismExperience.aggregate(pipeline);
                items = agg?.[0]?.items || [];
                total = Number(agg?.[0]?.meta?.[0]?.total || 0);
            } else {
                const [itemsRaw, count] = await Promise.all([
                    CulturalTourismExperience.find(filter)
                        .sort(sortMap[sort] || sortMap.featured)
                        .skip((currentPage - 1) * pageSize)
                        .limit(pageSize),
                    CulturalTourismExperience.countDocuments(filter)
                ]);
                items = itemsRaw;
                total = Number(count || 0);
            }
        }

        const pages = Math.max(1, Math.ceil(Math.max(0, total) / pageSize));

        if (String(cluster || '').toLowerCase() === 'true' && hasGeo) {
            const mapped = items.map(mapExperience);
            const bucket = new Map();
            mapped.forEach((x) => {
                const cLat = Number(x?.coordinates?.lat);
                const cLng = Number(x?.coordinates?.lng);
                if (!Number.isFinite(cLat) || !Number.isFinite(cLng)) return;
                const key = `${Math.round(cLat)}:${Math.round(cLng)}`;
                const current = bucket.get(key) || { count: 0, lat: 0, lng: 0, samples: [] };
                current.count += 1;
                current.lat += cLat;
                current.lng += cLng;
                if (current.samples.length < 3) current.samples.push({ id: x.id, title: x.title, kind: x.kind });
                bucket.set(key, current);
            });
            const clusters = Array.from(bucket.values()).map((c) => ({
                count: c.count,
                center: { lat: c.lat / c.count, lng: c.lng / c.count },
                samples: c.samples
            }));
            return res.status(200).send({
                status: true,
                data: {
                    items: mapped,
                    total,
                    page: currentPage,
                    pages,
                    clusters
                }
            });
        }

        return res.status(200).send({
            status: true,
            data: {
                items: items.map(mapExperience),
                total,
                page: currentPage,
                pages
            }
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed to fetch experiences' });
    }
};

exports.getExperiencesCursor = async (req, res) => {
    try {
        await ensureSeedData();
        const sort = String(req.query.sort || 'newest').trim();
        const limit = Math.min(100, parsePageValue(req.query.limit, DEFAULT_PAGE_LIMIT));
        const cursor = decodeCursor(req.query.cursor);
        const filter = buildExperienceFilter(req.query);
        const latNum = Number(req.query.lat);
        const lngNum = Number(req.query.lng);
        const hasGeo = Number.isFinite(latNum) && Number.isFinite(lngNum);
        const radius = Math.max(1, Number(req.query.radiusKm || 150));

        if (sort === 'relevance') {
            const offset = Math.max(0, Number(cursor?.offset || 0));
            const pipeline = [];
            if (hasGeo) {
                pipeline.push({
                    $geoNear: {
                        near: { type: 'Point', coordinates: [lngNum, latNum] },
                        distanceField: 'distanceMeters',
                        spherical: true,
                        maxDistance: radius * 1000,
                        query: filter
                    }
                });
            } else {
                pipeline.push({ $match: filter });
            }
            pipeline.push(...buildRelevanceStages());
            pipeline.push({ $sort: { relevanceScore: -1, rating: -1, reviews: -1, createdAt: -1, experienceId: -1 } });
            pipeline.push({ $skip: offset });
            pipeline.push({ $limit: limit + 1 });
            const docs = await CulturalTourismExperience.aggregate(pipeline);
            const hasMore = docs.length > limit;
            const pageItems = hasMore ? docs.slice(0, limit) : docs;
            const nextCursor = hasMore ? encodeCursor({ offset: offset + limit }) : null;
            return res.status(200).send({
                status: true,
                data: {
                    items: pageItems.map(mapExperience),
                    nextCursor,
                    hasMore
                }
            });
        }

        const cursorMatch = cursor && cursor.createdAt && cursor.experienceId
            ? {
                $or: [
                    { createdAt: { $lt: new Date(cursor.createdAt) } },
                    { createdAt: new Date(cursor.createdAt), experienceId: { $lt: String(cursor.experienceId) } }
                ]
            }
            : null;

        let docs = [];
        if (hasGeo) {
            const pipeline = [
                {
                    $geoNear: {
                        near: { type: 'Point', coordinates: [lngNum, latNum] },
                        distanceField: 'distanceMeters',
                        spherical: true,
                        maxDistance: radius * 1000,
                        query: filter
                    }
                }
            ];
            if (cursorMatch) pipeline.push({ $match: cursorMatch });
            pipeline.push({ $sort: { createdAt: -1, experienceId: -1 } });
            pipeline.push({ $limit: limit + 1 });
            docs = await CulturalTourismExperience.aggregate(pipeline);
        } else {
            const mergedFilter = cursorMatch ? { $and: [filter, cursorMatch] } : filter;
            docs = await CulturalTourismExperience.find(mergedFilter)
                .sort({ createdAt: -1, experienceId: -1 })
                .limit(limit + 1);
        }

        const hasMore = docs.length > limit;
        const pageItems = hasMore ? docs.slice(0, limit) : docs;
        const last = pageItems[pageItems.length - 1];
        const nextCursor = hasMore && last
            ? encodeCursor({ createdAt: last.createdAt, experienceId: last.experienceId })
            : null;

        return res.status(200).send({
            status: true,
            data: {
                items: pageItems.map(mapExperience),
                nextCursor,
                hasMore
            }
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed to fetch cursor page' });
    }
};

exports.getExperienceById = async (req, res) => {
    try {
        await ensureSeedData();
        const item = await CulturalTourismExperience.findOne({ experienceId: req.params.experienceId });
        if (!item) return res.status(404).send({ status: false, message: 'Experience not found' });
        return res.status(200).send({ status: true, data: mapExperience(item) });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed to fetch experience' });
    }
};

exports.upsertExperience = async (req, res) => {
    try {
        const {
            title,
            kind,
            region,
            nation,
            summary,
            priceFrom,
            durationLabel,
            groupSize,
            maxCapacity,
            availableNextDate,
            blackoutDates,
            sessions,
            consentChecklist,
            mediaRestrictions,
            coordinates,
            virtual = false,
            sacredContent = false,
            wallet
        } = req.body || {};

        if (!title || !kind || !region || !nation || !summary || !priceFrom || !durationLabel) {
            return res.status(400).send({ status: false, message: 'Missing required listing fields' });
        }

        const doc = await CulturalTourismExperience.create({
            experienceId: `tour-${Date.now()}`,
            title,
            kind,
            nation,
            community: 'Community Managed',
            region,
            coordinates: {
                lat: Number.isFinite(Number(coordinates?.lat)) ? Number(coordinates.lat) : null,
                lng: Number.isFinite(Number(coordinates?.lng)) ? Number(coordinates.lng) : null
            },
            summary,
            image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=800&fit=crop',
            priceFrom: Number(priceFrom),
            currency: 'USD',
            durationLabel,
            groupSize: String(groupSize || 'Up to 12'),
            maxCapacity: Math.max(0, Number(maxCapacity || 0)),
            sessions: normalizeSessionsInput(sessions, Math.max(1, Number(maxCapacity || 0))),
            rating: 0,
            reviews: 0,
            verificationTier: 'Bronze',
            elderApproved: false,
            sacredContent: Boolean(sacredContent),
            virtual: Boolean(virtual),
            availableNextDate: String(availableNextDate || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)),
            blackoutDates: Array.isArray(blackoutDates) ? blackoutDates.map((d) => normalizeIsoDate(d)).filter(Boolean) : [],
            protocols: [{ id: 'p-general', label: 'Respect host instructions and protocols', required: true }],
            consentChecklist: Array.isArray(consentChecklist) ? consentChecklist.map((x) => String(x || '').trim()).filter(Boolean) : [],
            mediaRestrictions: mapMediaRestrictions(mediaRestrictions || {}),
            tags: ['new listing'],
            featured: false,
            status: 'active',
            createdByWallet: String(wallet || 'demo-operator-wallet').toLowerCase()
        });

        return res.status(201).send({ status: true, message: 'Experience created', data: mapExperience(doc) });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed to create experience' });
    }
};

exports.createBooking = async (req, res) => {
    try {
        const auth = await verifyUserActionAuth(req, 'create_booking', 'new');
        if (!auth.ok) {
            return res.status(401).send({ status: false, message: auth.message });
        }
        const {
            experienceId,
            date,
            sessionId = 'default',
            sessionLabel = '',
            guests,
            travelerName,
            travelerEmail,
            travelerWallet,
            protocolAccepted,
            protocolAcknowledgements = [],
            notes = '',
            idempotencyKey = ''
        } = req.body || {};

        if (!experienceId || !date || !guests || !travelerName || !travelerEmail) {
            return res.status(400).send({ status: false, message: 'Missing booking fields' });
        }
        if (auth.email && auth.email !== String(travelerEmail || '').trim().toLowerCase()) {
            return res.status(403).send({ status: false, message: 'Traveler email does not match authenticated identity' });
        }

        const dateText = normalizeIsoDate(date);
        const normalizedSessionId = normalizeSessionId(sessionId);
        if (!dateText) {
            return res.status(400).send({ status: false, message: 'Invalid booking date format. Use YYYY-MM-DD.' });
        }

        const ackList = parseAcknowledgements(protocolAcknowledgements);
        if (!protocolAccepted && ackList.length === 0) {
            return res.status(400).send({ status: false, message: 'Protocol acknowledgement is required' });
        }

        const normalizedIdempotencyKey = String(req.headers['x-idempotency-key'] || idempotencyKey || '').trim();
        if (normalizedIdempotencyKey) {
            const existingByKey = await CulturalTourismBooking.findOne({ idempotencyKey: normalizedIdempotencyKey });
            if (existingByKey) {
                return res.status(200).send({
                    status: true,
                    data: mapBooking(existingByKey),
                    idempotentReplay: true
                });
            }
        }

        const travelerWalletKey = normalizeWallet(travelerWallet || auth.wallet || '');
        const abuseWindowStart = new Date(Date.now() - 10 * 60000);
        const abuseFilter = travelerWalletKey
            ? { travelerWallet: travelerWalletKey, createdAt: { $gte: abuseWindowStart } }
            : { travelerEmail: String(travelerEmail || '').toLowerCase(), createdAt: { $gte: abuseWindowStart } };
        const recentAttempts = await CulturalTourismBooking.countDocuments(abuseFilter);
        if (recentAttempts >= 8) {
            return res.status(429).send({
                status: false,
                message: 'Too many booking attempts in a short period. Please wait and try again.'
            });
        }

        const item = await CulturalTourismExperience.findOne({ experienceId });
        if (!item) {
            return res.status(404).send({ status: false, message: 'Experience not found' });
        }

        if (isPastDate(dateText)) {
            return res.status(400).send({ status: false, message: 'Booking date must be today or later.' });
        }
        if (item.status !== 'active') {
            return res.status(409).send({ status: false, message: 'Experience is not accepting bookings right now.' });
        }
        const selectedSession = findSessionForExperience(item, normalizedSessionId);
        if (selectedSession.active === false) {
            return res.status(409).send({ status: false, message: 'Selected session is not currently bookable.' });
        }
        if (normalizeSessionId(selectedSession.sessionId) !== normalizedSessionId) {
            return res.status(400).send({ status: false, message: 'Selected session does not exist for this experience.' });
        }

        const requestedGuests = Math.max(1, Number(guests));
        const protocolSnapshot = buildProtocolSnapshot(item);
        const requiredConsent = (item.consentChecklist || []).map((x) => String(x || '').trim()).filter(Boolean);
        const missingConsent = requiredConsent.filter((entry) => !ackList.includes(entry));
        if (requiredConsent.length && missingConsent.length) {
            return res.status(400).send({
                status: false,
                message: 'Missing mandatory protocol consents',
                data: { missingConsent }
            });
        }
        const lockOwner = `create:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
        const lockKey = await acquireSlotLock(item.experienceId, dateText, lockOwner, normalizedSessionId);
        if (!lockKey) {
            return res.status(409).send({ status: false, message: 'Slot is busy. Please retry in a moment.' });
        }

        let booking;
        try {
            const availability = await getAvailabilitySnapshot(item, dateText, '', normalizedSessionId);
            if (availability.blackout) {
                return res.status(409).send({
                    status: false,
                    message: `This experience is unavailable on ${dateText} due to operator blackout dates.`
                });
            }
            if (requestedGuests > availability.remaining) {
                return res.status(409).send({
                    status: false,
                    message: availability.remaining > 0
                        ? `Only ${availability.remaining} seats remaining for ${dateText}.`
                        : `Sold out for ${dateText}.`
                });
            }
            const fare = computeFareBreakdown(item.priceFrom, requestedGuests);

            booking = await CulturalTourismBooking.create({
                bookingId: `bk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                experienceId: item.experienceId,
                experienceTitle: item.title,
                date: dateText,
                sessionId: normalizedSessionId,
                sessionLabel: String(sessionLabel || selectedSession.label || ''),
                guests: requestedGuests,
                baseFare: fare.baseFare,
                serviceFee: fare.serviceFee,
                taxAmount: fare.taxAmount,
                totalAmount: fare.totalAmount,
                currency: 'USD',
                status: 'pending',
                paymentStatus: 'requires_payment',
                travelerWallet: travelerWalletKey,
                travelerName,
                travelerEmail,
                notes,
                protocolAccepted: true,
                protocolAcknowledgements: ackList,
                protocolSnapshot,
                mediaRestrictions: mapMediaRestrictions(item.mediaRestrictions || {}),
                idempotencyKey: normalizedIdempotencyKey
            });
        } finally {
            await releaseSlotLock(lockKey, lockOwner);
        }

        try {
            const paymentIntent = await tourismPaymentService.createPaymentIntent({
                bookingId: booking.bookingId,
                amount: booking.totalAmount,
                currency: booking.currency,
                idempotencyKey: normalizedIdempotencyKey ? `${normalizedIdempotencyKey}:intent` : '',
                metadata: {
                    experienceId: booking.experienceId,
                    date: booking.date
                }
            });
            booking.paymentProvider = paymentIntent.provider;
            booking.paymentIntentId = paymentIntent.paymentIntentId;
            booking.paymentStatus = paymentIntent.status === 'succeeded' ? 'captured' : 'requires_confirmation';
            booking.status = mapPaymentStatusToBookingStatus(booking.paymentStatus);
            booking.paymentDueAt = booking.paymentStatus === 'captured' ? null : getBookingHoldExpiry();
            await booking.save();
        } catch {
            booking.paymentProvider = tourismPaymentService.getProvider();
            booking.paymentStatus = 'requires_payment';
            booking.status = 'pending';
            booking.paymentDueAt = getBookingHoldExpiry();
            await booking.save();
        }

        await queueCommsJob({
            booking,
            experience: item,
            type: 'pre_trip_briefing',
            minutesOffset: 5,
            channel: 'email',
            recipient: travelerEmail,
            payload: { travelerName }
        });

        return res.status(201).send({
            status: true,
            data: mapBooking(booking)
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed to create booking' });
    }
};

exports.getExperienceAvailability = async (req, res) => {
    try {
        await ensureSeedData();
        const experienceId = String(req.params.experienceId || '');
        const date = normalizeIsoDate(req.query.date || '');
        const sessionId = normalizeSessionId(req.query.sessionId || 'default');
        const guests = Math.max(1, Number(req.query.guests || 1));

        if (!experienceId) {
            return res.status(400).send({ status: false, message: 'Experience ID is required' });
        }
        if (!date) {
            return res.status(400).send({ status: false, message: 'Date must be in YYYY-MM-DD format' });
        }

        const item = await CulturalTourismExperience.findOne({ experienceId });
        if (!item) {
            return res.status(404).send({ status: false, message: 'Experience not found' });
        }
        const selectedSession = findSessionForExperience(item, sessionId);
        if (normalizeSessionId(selectedSession.sessionId) !== sessionId) {
            return res.status(400).send({ status: false, message: 'Selected session does not exist for this experience.' });
        }

        const snapshot = await getAvailabilitySnapshot(item, date, '', sessionId);
        const fare = computeFareBreakdown(item.priceFrom, guests);
        return res.status(200).send({
            status: true,
            data: {
                ...snapshot,
                sessionId,
                sessionLabel: selectedSession.label,
                requestedGuests: guests,
                canBook: !snapshot.blackout && guests <= snapshot.remaining,
                nextAvailableDate: item.availableNextDate || date,
                fareBreakdown: fare
            }
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed to fetch availability' });
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const auth = await verifyUserActionAuth(req, 'get_my_bookings', 'self');
        if (!auth.ok) {
            return res.status(401).send({ status: false, message: auth.message });
        }
        const keyWallet = normalizeWallet(auth.wallet || '');
        const keyEmail = String(auth.email || '').toLowerCase();
        const filter = keyWallet ? { travelerWallet: keyWallet } : keyEmail ? { travelerEmail: keyEmail } : null;
        if (!filter) {
            return res.status(401).send({ status: false, message: 'Authenticated wallet or email is required' });
        }
        const docs = await CulturalTourismBooking.find(filter).sort({ createdAt: -1 }).limit(200);

        const rows = docs.map(mapBooking);

        return res.status(200).send({ status: true, data: rows });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed to fetch bookings' });
    }
};

exports.getTerritories = async (req, res) => {
    try {
        await ensureSeedData();
        const docs = await CulturalTourismTerritory.find({}).sort({ territoryName: 1 });
        return res.status(200).send({
            status: true,
            data: docs.map((t) => ({
                id: t.territoryId,
                territoryName: t.territoryName,
                nation: t.nation,
                region: t.region,
                experiences: t.experiences,
                protocolsRequired: t.protocolsRequired
            }))
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed to fetch territories' });
    }
};

exports.getHeatmap = async (req, res) => {
    const base = {
        lodging: 0,
        'guided-tours': 0,
        workshops: 0,
        performances: 0,
        festivals: 0,
        wellness: 0,
        culinary: 0,
        adventure: 0,
        virtual: 0,
        'arts-crafts': 0,
        voluntourism: 0,
        transport: 0,
        specialty: 0
    };
    try {
        const rows = await CulturalTourismEvent.aggregate([
            { $match: { event: { $in: ['tourism_search', 'tourism_view', 'tourism_booking_started', 'tourism_booking_completed'] } } },
            { $group: { _id: '$kind', count: { $sum: 1 } } }
        ]);

        rows.forEach((r) => {
            if (r._id && Object.prototype.hasOwnProperty.call(base, r._id)) {
                base[r._id] = Number(r.count || 0);
            }
        });

        const total = Object.values(base).reduce((sum, value) => sum + Number(value), 0);
        const normalized = {};
        Object.entries(base).forEach(([k, v]) => {
            normalized[k] = total > 0 ? Math.round((Number(v) / total) * 100) : 0;
        });

        return res.status(200).send({ status: true, data: normalized });
    } catch (error) {
        return res.status(200).send({ status: true, data: base, degraded: true });
    }
};

exports.trackEvent = async (req, res) => {
    try {
        const payload = req.body || {};
        await CulturalTourismEvent.create({
            event: payload.event,
            experienceId: payload.experienceId || '',
            kind: payload.kind || '',
            metadata: payload.metadata || {}
        });
        return res.status(200).send({ status: true, message: 'Event tracked' });
    } catch {
        return res.status(200).send({ status: true, message: 'Event accepted (degraded)', degraded: true });
    }
};

exports.getModerationQueue = async (req, res) => {
    try {
        await ensureSeedData();
        const status = req.query.status || 'all';
        const filter = status === 'all' ? {} : { status };
        const now = new Date();
        await CulturalTourismModeration.updateMany(
            {
                status: { $in: ['open', 'under_review'] },
                slaDueAt: { $ne: null, $lt: now },
                escalationLevel: { $lt: 1 }
            },
            {
                $set: {
                    escalationLevel: 1,
                    escalatedAt: now
                },
                $push: {
                    auditTrail: {
                        at: now,
                        by: 'system',
                        action: 'sla_escalated',
                        note: 'Escalated after SLA breach'
                    }
                }
            }
        );
        const rows = await CulturalTourismModeration.find(filter).sort({ createdAt: -1 }).limit(200);
        return res.status(200).send({
            status: true,
            data: rows.map((x) => ({
                id: x.moderationId,
                listingId: x.listingId,
                listingTitle: x.listingTitle,
                issueType: x.issueType,
                reason: x.reason,
                status: x.status,
                priority: x.priority || 'p2',
                queue: x.queue || 'trust_safety',
                slaDueAt: x.slaDueAt || null,
                escalationLevel: Number(x.escalationLevel || 0),
                createdAt: x.createdAt
            }))
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed to fetch moderation queue' });
    }
};

exports.decideModeration = async (req, res) => {
    try {
        const signatureCheck = verifyAdminActionSignature(req, 'moderation_decision', String(req.params.itemId || ''));
        if (!signatureCheck.ok) {
            return res.status(401).send({ status: false, message: signatureCheck.message });
        }
        const { decision } = req.body || {};
        if (!['resolve', 'dismiss', 'review'].includes(decision)) {
            return res.status(400).send({ status: false, message: 'Invalid decision' });
        }

        const status = decision === 'resolve' ? 'resolved' : decision === 'dismiss' ? 'dismissed' : 'under_review';
        const updated = await CulturalTourismModeration.findOneAndUpdate(
            { moderationId: req.params.itemId },
            {
                $set: {
                    status,
                    moderator: req.adminWallet || '',
                    notes: req.body?.notes || ''
                },
                $push: {
                    auditTrail: {
                        at: new Date(),
                        by: req.adminWallet || '',
                        action: `decision:${decision}`,
                        note: String(req.body?.notes || '')
                    }
                }
            },
            { new: true }
        );

        if (!updated) return res.status(404).send({ status: false, message: 'Moderation item not found' });

        await recordAdminAction({
            adminWallet: req.adminWallet,
            action: 'moderation_decision',
            targetType: 'moderation_item',
            targetId: updated.moderationId,
            signed: signatureCheck.signed,
            signatureTimestamp: signatureCheck.timestamp,
            metadata: {
                decision,
                queue: updated.queue || 'trust_safety',
                priority: updated.priority || 'p2'
            }
        });

        return res.status(200).send({
            status: true,
            data: {
                id: updated.moderationId,
                listingId: updated.listingId,
                listingTitle: updated.listingTitle,
                issueType: updated.issueType,
                reason: updated.reason,
                status: updated.status,
                priority: updated.priority || 'p2',
                queue: updated.queue || 'trust_safety',
                slaDueAt: updated.slaDueAt || null,
                escalationLevel: Number(updated.escalationLevel || 0),
                createdAt: updated.createdAt
            }
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed to update moderation item' });
    }
};

exports.getOperatorProfile = async (req, res) => {
    try {
        const wallet = String(req.params.wallet || 'demo-operator-wallet').toLowerCase();
        const operatorExperienceIds = await CulturalTourismExperience.find({
            createdByWallet: wallet,
            status: { $ne: 'archived' }
        }).select('experienceId');
        const experienceIdList = operatorExperienceIds.map((x) => x.experienceId);

        const [profileDoc, activeListings, monthlyBookings] = await Promise.all([
            CulturalTourismOperator.findOne({ wallet }),
            CulturalTourismExperience.countDocuments({ createdByWallet: wallet, status: { $ne: 'archived' } }),
            CulturalTourismBooking.countDocuments({
                experienceId: { $in: experienceIdList },
                status: { $in: ['confirmed', 'pending'] },
                createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
            })
        ]);

        let profile = profileDoc;
        if (!profile) {
            profile = await CulturalTourismOperator.create({
                wallet,
                operatorName: 'Demo Cultural Collective',
                nation: 'Multi-Nation',
                verificationTier: 'Gold',
                activeListings,
                monthlyBookings,
                payoutPending: 2840,
                trust: {
                    identityStatus: 'pending',
                    insuranceStatus: 'pending',
                    alerts: []
                }
            });
        } else {
            profile.activeListings = activeListings;
            profile.monthlyBookings = monthlyBookings;
            await profile.save();
        }

        return res.status(200).send({
            status: true,
            data: {
                wallet: profile.wallet,
                operatorName: profile.operatorName,
                nation: profile.nation,
                verificationTier: profile.verificationTier,
                activeListings: profile.activeListings,
                monthlyBookings: profile.monthlyBookings,
                payoutPending: profile.payoutPending,
                trust: profile.trust || {}
            }
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed to fetch operator profile' });
    }
};

exports.getOperatorListings = async (req, res) => {
    try {
        const wallet = String(req.params.wallet || '').trim().toLowerCase();
        if (!wallet) {
            return res.status(400).send({ status: false, message: 'Operator wallet is required' });
        }

        const limit = Math.min(200, parsePageValue(req.query.limit, 50));
        const docs = await CulturalTourismExperience.find({
            createdByWallet: wallet,
            status: { $ne: 'archived' }
        })
            .sort({ createdAt: -1 })
            .limit(limit);

        return res.status(200).send({
            status: true,
            data: docs.map(mapExperience)
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed to fetch operator listings' });
    }
};

exports.getOperatorBookingInbox = async (req, res) => {
    try {
        const wallet = normalizeWallet(req.params.wallet);
        if (!wallet) {
            return res.status(400).send({ status: false, message: 'Operator wallet is required' });
        }
        const limit = Math.min(500, parsePageValue(req.query.limit, 200));
        const experiences = await CulturalTourismExperience.find({ createdByWallet: wallet }).select('experienceId');
        const ids = experiences.map((x) => x.experienceId);
        if (ids.length === 0) return res.status(200).send({ status: true, data: [] });

        const docs = await CulturalTourismBooking.find({ experienceId: { $in: ids } })
            .sort({ date: 1, createdAt: -1 })
            .limit(limit);
        return res.status(200).send({ status: true, data: docs.map(mapBooking) });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed to fetch operator booking inbox' });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const bookingId = String(req.params.bookingId || '').trim();
        const auth = await verifyUserActionAuth(req, 'cancel_booking', bookingId);
        if (!auth.ok) {
            return res.status(401).send({ status: false, message: auth.message });
        }
        const requesterWallet = normalizeWallet(auth.wallet || '');
        const requesterEmail = String(auth.email || '').trim().toLowerCase();
        if (!bookingId) return res.status(400).send({ status: false, message: 'Booking ID is required' });

        const booking = await CulturalTourismBooking.findOne({ bookingId });
        if (!booking) return res.status(404).send({ status: false, message: 'Booking not found' });

        const isOwnerWallet = requesterWallet && booking.travelerWallet === requesterWallet;
        const isOwnerEmail = requesterEmail && String(booking.travelerEmail || '').toLowerCase() === requesterEmail;
        if (!isOwnerWallet && !isOwnerEmail && !req.adminWallet) {
            return res.status(403).send({ status: false, message: 'You do not have permission to cancel this booking' });
        }

        if (booking.status === 'cancelled') {
            return res.status(200).send({ status: true, data: mapBooking(booking) });
        }

        booking.status = 'cancelled';
        if (booking.paymentStatus === 'captured') {
            booking.paymentStatus = 'refunded';
            booking.refundedAt = new Date();
            booking.refundReason = String(req.body?.reason || 'Traveler cancellation');
            booking.refundedByWallet = requesterWallet;
            await CulturalTourismPaymentEvent.create({
                eventId: `refund-${booking.bookingId}-${Date.now()}`,
                bookingId: booking.bookingId,
                paymentIntentId: booking.paymentIntentId || '',
                provider: booking.paymentProvider || tourismPaymentService.getProvider(),
                eventType: 'refund_requested',
                payload: {
                    bookingId: booking.bookingId,
                    reason: booking.refundReason
                },
                processed: true,
                processedAt: new Date()
            });
        }
        booking.cancellationReason = String(req.body?.reason || '');
        booking.cancelledAt = new Date();
        booking.cancelledByWallet = requesterWallet;
        await booking.save();

        return res.status(200).send({ status: true, data: mapBooking(booking) });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed to cancel booking' });
    }
};

exports.rescheduleBooking = async (req, res) => {
    try {
        const bookingId = String(req.params.bookingId || '').trim();
        const newDate = normalizeIsoDate(req.body?.newDate || '');
        const newGuests = req.body?.guests !== undefined ? Math.max(1, Number(req.body.guests)) : undefined;
        const auth = await verifyUserActionAuth(req, 'reschedule_booking', bookingId);
        if (!auth.ok) {
            return res.status(401).send({ status: false, message: auth.message });
        }
        const requesterWallet = normalizeWallet(auth.wallet || '');
        const requesterEmail = String(auth.email || '').trim().toLowerCase();

        if (!bookingId || !newDate) {
            return res.status(400).send({ status: false, message: 'Booking ID and newDate are required' });
        }
        if (isPastDate(newDate)) {
            return res.status(400).send({ status: false, message: 'Reschedule date must be today or later.' });
        }

        const booking = await CulturalTourismBooking.findOne({ bookingId });
        if (!booking) return res.status(404).send({ status: false, message: 'Booking not found' });
        if (booking.status === 'cancelled') {
            return res.status(409).send({ status: false, message: 'Cancelled bookings cannot be rescheduled' });
        }
        const newSessionId = normalizeSessionId(req.body?.sessionId || req.body?.newSessionId || booking.sessionId || 'default');
        const newSessionLabel = String(req.body?.sessionLabel || req.body?.newSessionLabel || booking.sessionLabel || '');

        const isOwnerWallet = requesterWallet && booking.travelerWallet === requesterWallet;
        const isOwnerEmail = requesterEmail && String(booking.travelerEmail || '').toLowerCase() === requesterEmail;
        if (!isOwnerWallet && !isOwnerEmail && !req.adminWallet) {
            return res.status(403).send({ status: false, message: 'You do not have permission to reschedule this booking' });
        }

        const item = await CulturalTourismExperience.findOne({ experienceId: booking.experienceId });
        if (!item) return res.status(404).send({ status: false, message: 'Experience not found' });
        if (item.status !== 'active') {
            return res.status(409).send({ status: false, message: 'Experience is not accepting bookings right now.' });
        }
        const selectedSession = findSessionForExperience(item, newSessionId);
        if (selectedSession.active === false) {
            return res.status(409).send({ status: false, message: 'Selected session is not currently bookable.' });
        }
        if (normalizeSessionId(selectedSession.sessionId) !== newSessionId) {
            return res.status(400).send({ status: false, message: 'Selected session does not exist for this experience.' });
        }

        const effectiveGuests = newGuests !== undefined ? newGuests : Number(booking.guests || 1);
        const lockOwner = `reschedule:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
        const lockKey = await acquireSlotLock(item.experienceId, newDate, lockOwner, newSessionId);
        if (!lockKey) {
            return res.status(409).send({ status: false, message: 'Slot is busy. Please retry in a moment.' });
        }

        try {
            const availability = await getAvailabilitySnapshot(item, newDate, booking.bookingId, newSessionId);
            if (availability.blackout) {
                return res.status(409).send({ status: false, message: `This experience is unavailable on ${newDate}.` });
            }
            if (effectiveGuests > availability.remaining) {
                return res.status(409).send({
                    status: false,
                    message: availability.remaining > 0
                        ? `Only ${availability.remaining} seats remaining for ${newDate}.`
                        : `Sold out for ${newDate}.`
                });
            }

            booking.rescheduledFromDate = booking.date;
            booking.rescheduledAt = new Date();
            booking.rescheduledByWallet = requesterWallet;
            booking.date = newDate;
            booking.sessionId = newSessionId;
            booking.sessionLabel = newSessionLabel || selectedSession.label || '';
            booking.guests = effectiveGuests;
            const fare = computeFareBreakdown(item.priceFrom, effectiveGuests);
            booking.baseFare = fare.baseFare;
            booking.serviceFee = fare.serviceFee;
            booking.taxAmount = fare.taxAmount;
            booking.totalAmount = fare.totalAmount;
            booking.status = mapPaymentStatusToBookingStatus(booking.paymentStatus);
            await booking.save();
        } finally {
            await releaseSlotLock(lockKey, lockOwner);
        }

        return res.status(200).send({ status: true, data: mapBooking(booking) });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed to reschedule booking' });
    }
};

exports.getExperienceCalendar = async (req, res) => {
    try {
        await ensureSeedData();
        const experienceId = String(req.params.experienceId || '').trim();
        const start = normalizeIsoDate(req.query.start || '') || new Date().toISOString().slice(0, 10);
        const days = Math.min(90, parsePageValue(req.query.days, 30));
        const sessionId = normalizeSessionId(req.query.sessionId || 'default');
        if (!experienceId) return res.status(400).send({ status: false, message: 'Experience ID is required' });

        const item = await CulturalTourismExperience.findOne({ experienceId });
        if (!item) return res.status(404).send({ status: false, message: 'Experience not found' });
        const selectedSession = findSessionForExperience(item, sessionId);
        if (normalizeSessionId(selectedSession.sessionId) !== sessionId) {
            return res.status(400).send({ status: false, message: 'Selected session does not exist for this experience.' });
        }

        const capacity = Number(selectedSession.capacity || 0) > 0
            ? Number(selectedSession.capacity)
            : Number(item.maxCapacity || 0) > 0
                ? Number(item.maxCapacity)
                : parseCapacityFromGroupSize(item.groupSize);
        const blackoutSet = new Set((item.blackoutDates || []).map((x) => normalizeIsoDate(x)).filter(Boolean));
        const aggregateMap = await getBookingAggregateByDate(item.experienceId, sessionId, start, days);
        const values = [];
        let current = new Date(`${start}T00:00:00.000Z`);
        for (let i = 0; i < days; i += 1) {
            const date = current.toISOString().slice(0, 10);
            const blackout = blackoutSet.has(date);
            const bookedGuests = blackout ? capacity : Number(aggregateMap.get(date) || 0);
            const remaining = blackout ? 0 : Math.max(0, capacity - bookedGuests);
            values.push({
                date,
                capacity,
                bookedGuests,
                remaining,
                soldOut: blackout || remaining <= 0,
                blackout
            });
            current = new Date(current.getTime() + 86400000);
        }

        return res.status(200).send({
            status: true,
            data: {
                experienceId: item.experienceId,
                start,
                days,
                sessionId,
                sessionLabel: selectedSession.label,
                calendar: values
            }
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed to fetch calendar availability' });
    }
};

exports.updateExperienceBlackouts = async (req, res) => {
    try {
        const experienceId = String(req.params.experienceId || '').trim();
        const requesterWallet = normalizeWallet(req.headers['x-wallet-address'] || req.body?.wallet || '');
        if (!experienceId || !requesterWallet) {
            return res.status(400).send({ status: false, message: 'Experience ID and wallet are required' });
        }

        const item = await CulturalTourismExperience.findOne({ experienceId });
        if (!item) return res.status(404).send({ status: false, message: 'Experience not found' });
        if (item.createdByWallet !== requesterWallet && requesterWallet !== normalizeWallet(req.adminWallet || '')) {
            return res.status(403).send({ status: false, message: 'Only the owning operator can update blackouts' });
        }

        const addDates = Array.isArray(req.body?.addDates) ? req.body.addDates : [];
        const removeDates = Array.isArray(req.body?.removeDates) ? req.body.removeDates : [];
        const existing = new Set((item.blackoutDates || []).map((d) => normalizeIsoDate(d)).filter(Boolean));

        addDates.map((d) => normalizeIsoDate(d)).filter(Boolean).forEach((d) => existing.add(d));
        removeDates.map((d) => normalizeIsoDate(d)).filter(Boolean).forEach((d) => existing.delete(d));

        item.blackoutDates = Array.from(existing).sort();
        await item.save();

        return res.status(200).send({
            status: true,
            data: {
                experienceId: item.experienceId,
                blackoutDates: item.blackoutDates
            }
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed to update blackout dates' });
    }
};

exports.upsertExperienceSessions = async (req, res) => {
    try {
        const experienceId = String(req.params.experienceId || '').trim();
        const requesterWallet = normalizeWallet(req.headers['x-wallet-address'] || req.body?.wallet || '');
        const sessions = normalizeSessionsInput(req.body?.sessions || [], 0);
        if (!experienceId || !requesterWallet) {
            return res.status(400).send({ status: false, message: 'Experience ID and wallet are required' });
        }
        if (sessions.length === 0) {
            return res.status(400).send({ status: false, message: 'At least one valid session is required' });
        }

        const item = await CulturalTourismExperience.findOne({ experienceId });
        if (!item) return res.status(404).send({ status: false, message: 'Experience not found' });
        if (item.createdByWallet !== requesterWallet && requesterWallet !== normalizeWallet(req.adminWallet || '')) {
            return res.status(403).send({ status: false, message: 'Only the owning operator can update sessions' });
        }

        const fallbackCapacity = Number(item.maxCapacity || 0) > 0
            ? Number(item.maxCapacity)
            : parseCapacityFromGroupSize(item.groupSize);
        item.sessions = normalizeSessionsInput(sessions, fallbackCapacity);
        await item.save();

        return res.status(200).send({
            status: true,
            data: {
                experienceId: item.experienceId,
                sessions: mapSessions(item)
            }
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed to update sessions' });
    }
};

exports.submitBookingReview = async (req, res) => {
    try {
        const bookingId = String(req.params.bookingId || '').trim();
        const auth = await verifyUserActionAuth(req, 'submit_booking_review', bookingId);
        if (!auth.ok) {
            return res.status(401).send({ status: false, message: auth.message });
        }
        const requesterWallet = normalizeWallet(auth.wallet || '');
        const requesterEmail = String(auth.email || '').trim().toLowerCase();
        const rating = Math.max(1, Math.min(5, Number(req.body?.rating || 0)));
        const comment = String(req.body?.comment || '').trim();
        if (!bookingId) return res.status(400).send({ status: false, message: 'Booking ID is required' });
        if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
            return res.status(400).send({ status: false, message: 'Rating must be between 1 and 5' });
        }

        const booking = await CulturalTourismBooking.findOne({ bookingId });
        if (!booking) return res.status(404).send({ status: false, message: 'Booking not found' });

        const isOwnerWallet = requesterWallet && booking.travelerWallet === requesterWallet;
        const isOwnerEmail = requesterEmail && String(booking.travelerEmail || '').toLowerCase() === requesterEmail;
        if (!isOwnerWallet && !isOwnerEmail && !req.adminWallet) {
            return res.status(403).send({ status: false, message: 'You do not have permission to review this booking' });
        }
        if (booking.status !== 'confirmed' || booking.paymentStatus !== 'captured') {
            return res.status(409).send({ status: false, message: 'Only confirmed tickets can be reviewed' });
        }

        const existing = await CulturalTourismReview.findOne({ bookingId: booking.bookingId });
        if (existing) {
            existing.rating = rating;
            existing.comment = comment;
            await existing.save();
            await refreshExperienceReviewStats(booking.experienceId);
            return res.status(200).send({ status: true, data: mapReview(existing), updated: true });
        }

        const review = await CulturalTourismReview.create({
            reviewId: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            bookingId: booking.bookingId,
            experienceId: booking.experienceId,
            travelerWallet: booking.travelerWallet || requesterWallet,
            travelerEmail: booking.travelerEmail || requesterEmail,
            rating,
            comment
        });
        await refreshExperienceReviewStats(booking.experienceId);

        await CulturalTourismEvent.create({
            event: 'tourism_booking_completed',
            experienceId: booking.experienceId,
            kind: '',
            metadata: {
                bookingId: booking.bookingId,
                reviewId: review.reviewId,
                reviewRating: rating,
                reviewCommentLength: comment.length,
                reviewCaptured: true
            }
        });

        return res.status(201).send({ status: true, data: mapReview(review) });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed to submit review' });
    }
};

exports.getExperienceReviews = async (req, res) => {
    try {
        const experienceId = String(req.params.experienceId || '').trim();
        const limit = Math.min(100, parsePageValue(req.query.limit, 20));
        if (!experienceId) {
            return res.status(400).send({ status: false, message: 'Experience ID is required' });
        }
        const rows = await CulturalTourismReview.find({ experienceId }).sort({ createdAt: -1 }).limit(limit);
        return res.status(200).send({ status: true, data: rows.map(mapReview) });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed to fetch reviews' });
    }
};

exports.requestAuthChallenge = async (req, res) => {
    try {
        if (!USER_JWT_SECRET) {
            return res.status(503).send({ status: false, message: 'User JWT secret is not configured' });
        }
        const wallet = normalizeWallet(req.body?.wallet || '');
        if (!wallet) {
            return res.status(400).send({ status: false, message: 'Wallet address is required' });
        }
        const challengeId = `chal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const nonce = generateRandomToken(16);
        const issuedAt = new Date().toISOString();
        const expiresAt = new Date(Date.now() + AUTH_CHALLENGE_TTL_MS);
        const domain = String(req.headers.host || req.hostname || 'indigena.app').trim();
        const origin = String(req.headers.origin || '').trim();
        const uri = origin || `https://${domain}`;
        const chainId = Number(req.body?.chainId || req.query?.chainId || 1);
        const statement = 'Sign in to Indigena Cultural Tourism.';
        const message =
            `${domain} wants you to sign in with your Ethereum account:\n` +
            `${wallet}\n\n` +
            `${statement}\n\n` +
            `URI: ${uri}\n` +
            `Version: 1\n` +
            `Chain ID: ${Number.isFinite(chainId) ? chainId : 1}\n` +
            `Nonce: ${nonce}\n` +
            `Issued At: ${issuedAt}\n` +
            `Expiration Time: ${expiresAt.toISOString()}`;
        await CulturalTourismAuthChallenge.create({
            challengeId,
            wallet,
            nonce,
            message,
            expiresAt,
            usedAt: null
        });
        return res.status(200).send({
            status: true,
            data: {
                challengeId,
                wallet,
                nonce,
                message,
                expiresAt: expiresAt.toISOString()
            }
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed to create auth challenge' });
    }
};

exports.verifyAuthChallenge = async (req, res) => {
    try {
        if (!USER_JWT_SECRET) {
            return res.status(503).send({ status: false, message: 'User JWT secret is not configured' });
        }
        const wallet = normalizeWallet(req.body?.wallet || '');
        const challengeId = String(req.body?.challengeId || '').trim();
        const signature = String(req.body?.signature || '').trim();
        const email = String(req.body?.email || '').trim().toLowerCase();
        if (!wallet || !challengeId || !signature) {
            return res.status(400).send({ status: false, message: 'wallet, challengeId, and signature are required' });
        }
        const challenge = await CulturalTourismAuthChallenge.findOne({ challengeId, wallet });
        if (!challenge) {
            return res.status(404).send({ status: false, message: 'Auth challenge not found' });
        }
        if (challenge.usedAt) {
            return res.status(409).send({ status: false, message: 'Auth challenge already used' });
        }
        if (challenge.expiresAt < new Date()) {
            return res.status(409).send({ status: false, message: 'Auth challenge expired' });
        }

        const recovered = normalizeWallet(ethers.utils.verifyMessage(challenge.message, signature));
        if (!recovered || recovered !== wallet) {
            return res.status(401).send({ status: false, message: 'Invalid signature for challenge' });
        }

        challenge.usedAt = new Date();
        await challenge.save();

        const session = await issueUserSession(wallet, email);
        return res.status(200).send({
            status: true,
            data: {
                wallet,
                email,
                accessToken: session.accessToken,
                refreshToken: session.refreshToken,
                sessionId: session.sessionId,
                expiresIn: session.expiresIn
            }
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed auth challenge verification' });
    }
};

exports.refreshUserSession = async (req, res) => {
    try {
        if (!USER_JWT_SECRET) {
            return res.status(503).send({ status: false, message: 'User JWT secret is not configured' });
        }
        const refreshToken = String(req.body?.refreshToken || '').trim();
        if (!refreshToken) {
            return res.status(400).send({ status: false, message: 'refreshToken is required' });
        }
        const refreshTokenHash = hashToken(refreshToken);
        const session = await CulturalTourismAuthSession.findOne({ refreshTokenHash });
        if (!session || session.revokedAt || session.expiresAt < new Date()) {
            return res.status(401).send({ status: false, message: 'Invalid refresh token' });
        }
        const nextRefreshToken = generateRandomToken(48);
        const nextRefreshTokenHash = hashToken(nextRefreshToken);
        const nextExpiry = new Date(Date.now() + AUTH_REFRESH_TOKEN_TTL_SECONDS * 1000);
        session.refreshTokenHash = nextRefreshTokenHash;
        session.expiresAt = nextExpiry;
        session.lastUsedAt = new Date();
        await session.save();
        const accessToken = issueAccessToken(session.wallet, '');
        return res.status(200).send({
            status: true,
            data: {
                accessToken,
                refreshToken: nextRefreshToken,
                sessionId: session.sessionId,
                expiresIn: AUTH_ACCESS_TOKEN_TTL_SECONDS
            }
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed to refresh session' });
    }
};

exports.logoutUserSession = async (req, res) => {
    try {
        const refreshToken = String(req.body?.refreshToken || '').trim();
        if (!refreshToken) {
            return res.status(400).send({ status: false, message: 'refreshToken is required' });
        }
        const refreshTokenHash = hashToken(refreshToken);
        await CulturalTourismAuthSession.updateOne(
            { refreshTokenHash, revokedAt: null },
            { $set: { revokedAt: new Date() } }
        );
        return res.status(200).send({ status: true, message: 'Session revoked' });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed to revoke session' });
    }
};

exports.createBookingPaymentIntent = async (req, res) => {
    try {
        const bookingId = String(req.params.bookingId || '').trim();
        if (!bookingId) return res.status(400).send({ status: false, message: 'Booking ID is required' });
        const auth = await verifyUserActionAuth(req, 'create_payment_intent', bookingId);
        if (!auth.ok) {
            return res.status(401).send({ status: false, message: auth.message });
        }

        const booking = await CulturalTourismBooking.findOne({ bookingId });
        if (!booking) return res.status(404).send({ status: false, message: 'Booking not found' });
        if (booking.status === 'cancelled') return res.status(409).send({ status: false, message: 'Cancelled bookings cannot be paid' });
        const isOwnerWallet = auth.wallet && booking.travelerWallet === normalizeWallet(auth.wallet);
        const isOwnerEmail = auth.email && String(booking.travelerEmail || '').toLowerCase() === String(auth.email).toLowerCase();
        if (!isOwnerWallet && !isOwnerEmail && !req.adminWallet) {
            return res.status(403).send({ status: false, message: 'You do not have permission to pay this booking' });
        }

        if (booking.paymentStatus === 'captured') {
            return res.status(200).send({
                status: true,
                data: {
                    bookingId: booking.bookingId,
                    paymentIntentId: booking.paymentIntentId,
                    amount: booking.totalAmount,
                    currency: booking.currency,
                    paymentProvider: booking.paymentProvider || tourismPaymentService.getProvider(),
                    paymentStatus: booking.paymentStatus
                }
            });
        }

        const requestKey = String(req.headers['x-idempotency-key'] || req.body?.idempotencyKey || '').trim();
        const paymentIntent = await tourismPaymentService.createPaymentIntent({
            bookingId: booking.bookingId,
            amount: booking.totalAmount,
            currency: booking.currency,
            idempotencyKey: requestKey ? `${requestKey}:intent` : '',
            metadata: {
                experienceId: booking.experienceId,
                date: booking.date
            }
        });

        booking.paymentIntentId = paymentIntent.paymentIntentId;
        booking.paymentProvider = paymentIntent.provider;
        booking.paymentStatus = paymentIntent.status === 'succeeded' ? 'captured' : 'requires_confirmation';
        booking.status = mapPaymentStatusToBookingStatus(booking.paymentStatus);
        booking.paymentDueAt = booking.paymentStatus === 'captured' ? null : getBookingHoldExpiry();
        if (booking.paymentStatus === 'captured') {
            booking.paymentCapturedAt = new Date();
            booking.paymentReference = booking.paymentReference || paymentIntent.paymentIntentId;
            booking.receiptId = booking.receiptId || `rcpt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        }
        await booking.save();

        return res.status(200).send({
            status: true,
            data: {
                bookingId: booking.bookingId,
                paymentIntentId: booking.paymentIntentId,
                amount: booking.totalAmount,
                currency: booking.currency,
                paymentProvider: booking.paymentProvider || tourismPaymentService.getProvider(),
                paymentStatus: booking.paymentStatus
            }
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed to create payment intent' });
    }
};

exports.confirmBookingPayment = async (req, res) => {
    try {
        const bookingId = String(req.params.bookingId || '').trim();
        const { paymentReference = '', idempotencyKey = '' } = req.body || {};
        if (!bookingId) return res.status(400).send({ status: false, message: 'Booking ID is required' });
        const auth = await verifyUserActionAuth(req, 'confirm_payment', bookingId);
        if (!auth.ok) {
            return res.status(401).send({ status: false, message: auth.message });
        }

        const booking = await CulturalTourismBooking.findOne({ bookingId });
        if (!booking) return res.status(404).send({ status: false, message: 'Booking not found' });
        if (booking.status === 'cancelled') return res.status(409).send({ status: false, message: 'Cancelled bookings cannot be confirmed' });
        const isOwnerWallet = auth.wallet && booking.travelerWallet === normalizeWallet(auth.wallet);
        const isOwnerEmail = auth.email && String(booking.travelerEmail || '').toLowerCase() === String(auth.email).toLowerCase();
        if (!isOwnerWallet && !isOwnerEmail && !req.adminWallet) {
            return res.status(403).send({ status: false, message: 'You do not have permission to confirm this booking payment' });
        }
        if (booking.paymentStatus === 'captured') {
            return res.status(200).send({ status: true, data: mapBooking(booking), idempotentReplay: true });
        }
        if (!booking.paymentIntentId) {
            return res.status(409).send({ status: false, message: 'Payment intent not initialized' });
        }

        const reqKey = String(req.headers['x-idempotency-key'] || idempotencyKey || '').trim();
        const providerResult = await tourismPaymentService.confirmPayment({
            paymentIntentId: booking.paymentIntentId,
            idempotencyKey: reqKey ? `${reqKey}:confirm` : ''
        });

        booking.paymentProvider = providerResult.provider || booking.paymentProvider || tourismPaymentService.getProvider();
        booking.paymentStatus = providerResult.captured ? 'captured' : 'requires_confirmation';
        booking.paymentCapturedAt = providerResult.captured ? new Date() : null;
        booking.paymentDueAt = providerResult.captured ? null : getBookingHoldExpiry();
        booking.paymentReference = String(paymentReference || providerResult.paymentReference || booking.paymentReference || `pay-${Date.now()}`);
        if (providerResult.captured && !booking.receiptId) {
            booking.receiptId = `rcpt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
            booking.ticketId = `tix-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        }
        booking.status = mapPaymentStatusToBookingStatus(booking.paymentStatus);
        await booking.save();

        if (providerResult.captured) {
            const item = await CulturalTourismExperience.findOne({ experienceId: booking.experienceId });
            await queueCommsJob({
                booking,
                experience: item,
                type: 'booking_reminder_24h',
                minutesOffset: 60,
                channel: 'email',
                recipient: booking.travelerEmail,
                payload: { ticketId: booking.ticketId }
            });
            await queueCommsJob({
                booking,
                experience: item,
                type: 'post_trip_review_nudge',
                minutesOffset: 60 * 24 * 3,
                channel: 'email',
                recipient: booking.travelerEmail,
                payload: {}
            });
        }

        return res.status(200).send({ status: true, data: mapBooking(booking) });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed to confirm payment' });
    }
};

exports.handlePaymentWebhook = async (req, res) => {
    try {
        if (!tourismPaymentService.verifyWebhookSignature(req.headers, req.body || {})) {
            return res.status(401).send({ status: false, message: 'Invalid webhook signature' });
        }

        const payload = req.body || {};
        const eventId = String(payload.eventId || '').trim();
        if (!eventId) return res.status(400).send({ status: false, message: 'eventId is required' });

        const existingEvent = await CulturalTourismPaymentEvent.findOne({ eventId });
        if (existingEvent) {
            return res.status(200).send({ status: true, message: 'Already processed', duplicate: true });
        }

        const paymentIntentId = String(payload.paymentIntentId || '').trim();
        const bookingId = String(payload.bookingId || '').trim();
        const eventType = String(payload.eventType || '').trim();
        const paymentStatusRaw = String(payload.paymentStatus || '').trim().toLowerCase();

        const booking = bookingId
            ? await CulturalTourismBooking.findOne({ bookingId })
            : await CulturalTourismBooking.findOne({ paymentIntentId });

        if (!booking) {
            await CulturalTourismPaymentEvent.create({
                eventId,
                bookingId,
                paymentIntentId,
                provider: String(payload.provider || tourismPaymentService.getProvider()),
                eventType,
                payload,
                processed: false,
                nextRetryAt: new Date(Date.now() + 5 * 60000),
                lastError: 'Booking not found for payment event'
            });
            return res.status(202).send({ status: true, message: 'Event stored without matching booking' });
        }

        if (paymentStatusRaw === 'captured' || paymentStatusRaw === 'succeeded') {
            booking.paymentStatus = 'captured';
            booking.status = 'confirmed';
            booking.paymentCapturedAt = new Date();
            booking.paymentDueAt = null;
            booking.paymentReference = String(payload.paymentReference || booking.paymentReference || paymentIntentId || `pay-${Date.now()}`);
            if (!booking.receiptId) booking.receiptId = `rcpt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
            if (!booking.ticketId) booking.ticketId = `tix-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        } else if (paymentStatusRaw === 'failed') {
            booking.paymentStatus = 'failed';
            booking.status = 'pending';
            booking.paymentDueAt = getBookingHoldExpiry();
        } else if (paymentStatusRaw === 'refunded') {
            booking.paymentStatus = 'refunded';
            booking.status = 'cancelled';
            booking.refundedAt = new Date();
        }
        if (paymentIntentId) {
            booking.paymentIntentId = paymentIntentId;
        }
        if (payload.provider) {
            booking.paymentProvider = String(payload.provider);
        }
        await booking.save();

        await CulturalTourismPaymentEvent.create({
            eventId,
            bookingId: booking.bookingId,
            paymentIntentId: paymentIntentId || booking.paymentIntentId,
            provider: String(payload.provider || booking.paymentProvider || tourismPaymentService.getProvider()),
            eventType,
            payload,
            processed: true,
            processedAt: new Date()
        });

        return res.status(200).send({ status: true, data: mapBooking(booking) });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed to process payment webhook' });
    }
};

exports.processPaymentRetryQueue = async (_req, res) => {
    try {
        const now = new Date();
        const events = await CulturalTourismPaymentEvent.find({
            processed: false,
            nextRetryAt: { $ne: null, $lte: now }
        }).sort({ nextRetryAt: 1 }).limit(100);

        let processed = 0;
        let failed = 0;
        for (const ev of events) {
            try {
                const booking = ev.bookingId
                    ? await CulturalTourismBooking.findOne({ bookingId: ev.bookingId })
                    : await CulturalTourismBooking.findOne({ paymentIntentId: ev.paymentIntentId });
                if (!booking) {
                    ev.retryCount = Number(ev.retryCount || 0) + 1;
                    ev.lastError = 'Booking still missing';
                    ev.nextRetryAt = new Date(Date.now() + Math.min(60, ev.retryCount * 5) * 60000);
                    await ev.save();
                    failed += 1;
                    continue;
                }

                if (ev.payload && String(ev.payload.paymentStatus || '').toLowerCase() === 'succeeded') {
                    booking.status = 'confirmed';
                    booking.paymentStatus = 'captured';
                    booking.paymentCapturedAt = new Date();
                    booking.paymentDueAt = null;
                    if (!booking.ticketId) booking.ticketId = `tix-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
                    await booking.save();
                }

                ev.processed = true;
                ev.processedAt = new Date();
                ev.lastError = '';
                await ev.save();
                processed += 1;
            } catch (error) {
                ev.retryCount = Number(ev.retryCount || 0) + 1;
                ev.lastError = String(error?.message || 'Retry failed');
                ev.nextRetryAt = new Date(Date.now() + Math.min(60, ev.retryCount * 5) * 60000);
                await ev.save();
                failed += 1;
            }
        }

        return res.status(200).send({ status: true, data: { processed, failed, queued: events.length } });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed payment retry queue processing' });
    }
};

exports.reconcilePayments = async (_req, res) => {
    try {
        const stalePending = await CulturalTourismBooking.find({
            status: 'pending',
            paymentStatus: { $in: ['requires_payment', 'requires_confirmation', 'failed'] },
            paymentDueAt: { $ne: null, $lt: new Date() }
        }).limit(500);
        let expired = 0;
        for (const booking of stalePending) {
            booking.status = 'cancelled';
            booking.cancellationReason = 'Payment reconciliation timeout';
            booking.cancelledAt = new Date();
            await booking.save();
            expired += 1;
        }

        const orphanEvents = await CulturalTourismPaymentEvent.countDocuments({
            processed: false,
            nextRetryAt: { $ne: null, $lte: new Date() }
        });

        return res.status(200).send({
            status: true,
            data: {
                expiredBookings: expired,
                orphanPaymentEventsReadyForRetry: orphanEvents
            }
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed payment reconciliation' });
    }
};

exports.refundBooking = async (req, res) => {
    try {
        const signatureCheck = verifyAdminActionSignature(req, 'booking_refund', String(req.params.bookingId || ''));
        if (!signatureCheck.ok) return res.status(401).send({ status: false, message: signatureCheck.message });
        const bookingId = String(req.params.bookingId || '').trim();
        const reason = String(req.body?.reason || 'Admin initiated refund');
        if (!bookingId) return res.status(400).send({ status: false, message: 'Booking ID is required' });

        const booking = await CulturalTourismBooking.findOne({ bookingId });
        if (!booking) return res.status(404).send({ status: false, message: 'Booking not found' });
        if (booking.paymentStatus !== 'captured') {
            return res.status(409).send({ status: false, message: 'Only captured payments can be refunded' });
        }

        booking.status = 'cancelled';
        booking.paymentStatus = 'refunded';
        booking.refundedAt = new Date();
        booking.refundReason = reason;
        booking.refundedByWallet = normalizeWallet(req.adminWallet || '');
        booking.cancelledAt = booking.refundedAt;
        booking.cancellationReason = reason;
        await booking.save();

        await CulturalTourismPaymentEvent.create({
            eventId: `refund-${booking.bookingId}-${Date.now()}`,
            bookingId: booking.bookingId,
            paymentIntentId: booking.paymentIntentId || '',
            provider: booking.paymentProvider || tourismPaymentService.getProvider(),
            eventType: 'refund_completed',
            payload: { reason, bookingId: booking.bookingId },
            processed: true,
            processedAt: new Date()
        });

        await recordAdminAction({
            adminWallet: req.adminWallet,
            action: 'booking_refund',
            targetType: 'booking',
            targetId: booking.bookingId,
            signed: signatureCheck.signed,
            signatureTimestamp: signatureCheck.timestamp,
            metadata: { reason }
        });

        return res.status(200).send({ status: true, data: mapBooking(booking) });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed booking refund' });
    }
};

exports.getBookingTicket = async (req, res) => {
    try {
        const bookingId = String(req.params.bookingId || '').trim();
        if (!bookingId) return res.status(400).send({ status: false, message: 'Booking ID is required' });
        const auth = await verifyUserActionAuth(req, 'get_booking_ticket', bookingId);
        if (!auth.ok) {
            return res.status(401).send({ status: false, message: auth.message });
        }
        const booking = await CulturalTourismBooking.findOne({ bookingId });
        if (!booking) return res.status(404).send({ status: false, message: 'Booking not found' });
        const isOwnerWallet = auth.wallet && booking.travelerWallet === normalizeWallet(auth.wallet);
        const isOwnerEmail = auth.email && String(booking.travelerEmail || '').toLowerCase() === String(auth.email).toLowerCase();
        if (!isOwnerWallet && !isOwnerEmail && !req.adminWallet) {
            return res.status(403).send({ status: false, message: 'You do not have permission to access this ticket' });
        }
        if (booking.status !== 'confirmed' || booking.paymentStatus !== 'captured') {
            return res.status(409).send({ status: false, message: 'Ticket unavailable until payment is captured' });
        }
        if (!booking.ticketId) {
            booking.ticketId = `tix-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
            await booking.save();
        }
        return res.status(200).send({
            status: true,
            data: {
                ticketId: booking.ticketId,
                bookingId: booking.bookingId,
                experienceId: booking.experienceId,
                experienceTitle: booking.experienceTitle,
                date: booking.date,
                guests: booking.guests,
                protocolSnapshot: booking.protocolSnapshot || [],
                restrictions: booking.mediaRestrictions || mapMediaRestrictions({}),
                notes: booking.notes || ''
            }
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed to generate booking ticket' });
    }
};

exports.processCommsQueue = async (_req, res) => {
    try {
        const due = await CulturalTourismCommsJob.find({
            status: 'queued',
            scheduledFor: { $lte: new Date() }
        }).sort({ scheduledFor: 1 }).limit(250);
        let sent = 0;
        let failed = 0;
        for (const job of due) {
            try {
                if (!job.recipient) throw new Error('Missing recipient');
                job.status = 'sent';
                job.sentAt = new Date();
                job.attempts = Number(job.attempts || 0) + 1;
                await job.save();

                if (job.type === 'pre_trip_briefing') {
                    await CulturalTourismBooking.updateOne(
                        { bookingId: job.bookingId },
                        { $set: { preTripBriefSentAt: new Date() } }
                    );
                }
                if (job.type === 'post_trip_review_nudge') {
                    await CulturalTourismBooking.updateOne(
                        { bookingId: job.bookingId },
                        { $set: { reviewPromptSentAt: new Date() } }
                    );
                }
                sent += 1;
            } catch (error) {
                job.status = 'failed';
                job.attempts = Number(job.attempts || 0) + 1;
                job.lastError = String(error?.message || 'Failed to send');
                await job.save();
                failed += 1;
            }
        }
        return res.status(200).send({ status: true, data: { sent, failed, total: due.length } });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed processing comms queue' });
    }
};

exports.upsertOperatorTrust = async (req, res) => {
    try {
        const wallet = normalizeWallet(req.params.wallet || req.body?.wallet || '');
        if (!wallet) return res.status(400).send({ status: false, message: 'Operator wallet is required' });
        const operator = await CulturalTourismOperator.findOne({ wallet }) || await CulturalTourismOperator.create({ wallet });
        const trust = operator.trust || {};

        const permits = Array.isArray(req.body?.permits) ? req.body.permits : [];
        trust.kycDocumentUrl = String(req.body?.kycDocumentUrl || trust.kycDocumentUrl || '');
        trust.identityStatus = trust.kycDocumentUrl ? 'pending' : (trust.identityStatus || 'missing');
        trust.kycSubmittedAt = trust.kycDocumentUrl ? new Date() : trust.kycSubmittedAt || null;

        trust.insuranceDocUrl = String(req.body?.insuranceDocUrl || trust.insuranceDocUrl || '');
        trust.insuranceExpiry = req.body?.insuranceExpiry ? new Date(req.body.insuranceExpiry) : trust.insuranceExpiry || null;
        trust.insuranceStatus = trust.insuranceDocUrl ? 'pending' : (trust.insuranceStatus || 'missing');

        trust.permits = permits.map((p) => ({
            permitId: String(p.permitId || `permit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`),
            label: String(p.label || 'Permit'),
            expiry: p.expiry ? new Date(p.expiry) : null,
            status: 'pending'
        }));

        operator.trust = trust;
        await operator.save();
        return res.status(200).send({ status: true, data: { wallet: operator.wallet, trust: operator.trust } });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed operator trust update' });
    }
};

exports.verifyOperatorTrust = async (req, res) => {
    try {
        const signatureCheck = verifyAdminActionSignature(req, 'operator_trust_verify', String(req.params.wallet || ''));
        if (!signatureCheck.ok) return res.status(401).send({ status: false, message: signatureCheck.message });
        const wallet = normalizeWallet(req.params.wallet || '');
        const operator = await CulturalTourismOperator.findOne({ wallet });
        if (!operator) return res.status(404).send({ status: false, message: 'Operator not found' });

        const trust = operator.trust || {};
        const decision = String(req.body?.decision || 'verify').toLowerCase();
        const insuranceStatus = trust.insuranceExpiry && trust.insuranceExpiry < new Date() ? 'expired' : 'verified';
        if (decision === 'reject') {
            trust.identityStatus = 'rejected';
            trust.insuranceStatus = 'rejected';
            trust.permits = (trust.permits || []).map((p) => ({ ...p, status: 'rejected' }));
        } else {
            trust.identityStatus = 'verified';
            trust.kycVerifiedAt = new Date();
            trust.insuranceStatus = insuranceStatus;
            trust.permits = (trust.permits || []).map((p) => ({
                ...p,
                status: p.expiry && new Date(p.expiry) < new Date() ? 'expired' : 'verified'
            }));
        }
        operator.trust = trust;
        await operator.save();

        await recordAdminAction({
            adminWallet: req.adminWallet,
            action: 'operator_trust_verify',
            targetType: 'operator',
            targetId: wallet,
            signed: signatureCheck.signed,
            signatureTimestamp: signatureCheck.timestamp,
            metadata: { decision }
        });

        return res.status(200).send({ status: true, data: { wallet: operator.wallet, trust: operator.trust } });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed operator trust verification' });
    }
};

exports.getOperatorTrustAlerts = async (req, res) => {
    try {
        const days = Math.max(1, Math.min(365, parsePageValue(req.query.days, 30)));
        const cutoff = new Date(Date.now() + days * 86400000);
        const operators = await CulturalTourismOperator.find({});
        const alerts = [];
        operators.forEach((operator) => {
            const trust = operator.trust || {};
            if (trust.insuranceExpiry && new Date(trust.insuranceExpiry) <= cutoff) {
                alerts.push({
                    wallet: operator.wallet,
                    type: 'insurance_expiry',
                    expiry: trust.insuranceExpiry
                });
            }
            (trust.permits || []).forEach((p) => {
                if (p.expiry && new Date(p.expiry) <= cutoff) {
                    alerts.push({
                        wallet: operator.wallet,
                        type: 'permit_expiry',
                        permitId: p.permitId,
                        label: p.label,
                        expiry: p.expiry
                    });
                }
            });
        });
        return res.status(200).send({ status: true, data: alerts });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed trust alerts lookup' });
    }
};

exports.exportModerationAudit = async (req, res) => {
    try {
        const signatureCheck = verifyAdminActionSignature(req, 'moderation_export', 'all');
        if (!signatureCheck.ok) return res.status(401).send({ status: false, message: signatureCheck.message });
        const format = String(req.query.format || 'json').toLowerCase();
        const rows = await CulturalTourismModeration.find({}).sort({ createdAt: -1 }).limit(2000);
        const mapped = rows.map((x) => ({
            moderationId: x.moderationId,
            listingId: x.listingId,
            listingTitle: x.listingTitle,
            issueType: x.issueType,
            status: x.status,
            priority: x.priority || 'p2',
            queue: x.queue || 'trust_safety',
            slaDueAt: x.slaDueAt || '',
            escalatedAt: x.escalatedAt || '',
            escalationLevel: Number(x.escalationLevel || 0),
            moderator: x.moderator || '',
            createdAt: x.createdAt
        }));
        await recordAdminAction({
            adminWallet: req.adminWallet,
            action: 'moderation_export',
            targetType: 'moderation_queue',
            targetId: 'all',
            signed: signatureCheck.signed,
            signatureTimestamp: signatureCheck.timestamp,
            metadata: { format, count: mapped.length }
        });
        if (format === 'csv') {
            const headers = Object.keys(mapped[0] || {});
            const lines = [headers.join(',')].concat(
                mapped.map((row) => headers.map((h) => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(','))
            );
            return res.status(200).send({ status: true, data: lines.join('\n') });
        }
        return res.status(200).send({ status: true, data: mapped });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed moderation export' });
    }
};

exports.getOpsDashboard = async (_req, res) => {
    try {
        const [totalBookings, confirmedBookings, pendingBookings, paymentFailures, openModeration, commsQueued] = await Promise.all([
            CulturalTourismBooking.countDocuments({}),
            CulturalTourismBooking.countDocuments({ status: 'confirmed' }),
            CulturalTourismBooking.countDocuments({ status: 'pending' }),
            CulturalTourismBooking.countDocuments({ paymentStatus: 'failed' }),
            CulturalTourismModeration.countDocuments({ status: { $in: ['open', 'under_review'] } }),
            CulturalTourismCommsJob.countDocuments({ status: 'queued' })
        ]);
        const conversion = totalBookings > 0 ? Number((confirmedBookings / totalBookings).toFixed(4)) : 0;
        const alerts = [];
        if (paymentFailures > 20) alerts.push('payment_failures_high');
        if (openModeration > 50) alerts.push('moderation_backlog_high');
        if (pendingBookings > confirmedBookings) alerts.push('booking_funnel_stuck');
        return res.status(200).send({
            status: true,
            data: {
                totalBookings,
                confirmedBookings,
                pendingBookings,
                paymentFailures,
                openModeration,
                commsQueued,
                conversion,
                alerts
            }
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed ops dashboard' });
    }
};

exports.getBookingFunnelMetrics = async (_req, res) => {
    try {
        const [searches, views, starts, completed] = await Promise.all([
            CulturalTourismEvent.countDocuments({ event: 'tourism_search' }),
            CulturalTourismEvent.countDocuments({ event: 'tourism_view' }),
            CulturalTourismEvent.countDocuments({ event: 'tourism_booking_started' }),
            CulturalTourismEvent.countDocuments({ event: 'tourism_booking_completed' })
        ]);
        const safeRate = (a, b) => (b > 0 ? Number((a / b).toFixed(4)) : 0);
        return res.status(200).send({
            status: true,
            data: {
                searches,
                views,
                starts,
                completed,
                viewRate: safeRate(views, searches),
                startRate: safeRate(starts, views),
                completionRate: safeRate(completed, starts)
            }
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed funnel metrics' });
    }
};

exports.runSyntheticChecks = async (_req, res) => {
    try {
        const checks = [];
        const exp = await CulturalTourismExperience.findOne({ status: 'active' });
        checks.push({ id: 'experience_list', ok: Boolean(exp), detail: exp ? 'At least one active listing' : 'No active listings' });
        const readiness = {
            paymentProvider: tourismPaymentService.getProvider(),
            placementHero: Boolean(premiumPlacementService.getPlacementType('tour_hero_banner'))
        };
        checks.push({
            id: 'payment_provider',
            ok: Boolean(readiness.paymentProvider),
            detail: readiness.paymentProvider
        });
        checks.push({
            id: 'premium_type_loaded',
            ok: readiness.placementHero,
            detail: readiness.placementHero ? 'tour_hero_banner loaded' : 'tour_hero_banner missing'
        });
        const ok = checks.every((c) => c.ok);
        return res.status(ok ? 200 : 503).send({ status: ok, data: { checks } });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed synthetic checks' });
    }
};

exports.getTourismReadiness = async (_req, res) => {
    try {
        const requiredTypes = [
            'tour_hero_banner',
            'tour_operator_spotlight',
            'tour_sponsored_card',
            'tour_region_boost',
            'tour_newsletter_feature',
            'tour_seasonal_takeover'
        ];
        const placementCoverage = requiredTypes.map((typeId) => ({
            typeId,
            exists: Boolean(premiumPlacementService.getPlacementType(typeId))
        }));
        const placementTypesLoaded = placementCoverage.filter((x) => x.exists).length;
        const commsQueueReady = true;
        const signedAdminActions = requiresSignedAction();

        return res.status(200).send({
            status: true,
            data: {
                dbReady: true,
                paymentProvider: tourismPaymentService.getProvider(),
                placementTypesLoaded,
                placementCoverage,
                commsQueueReady,
                signedAdminActions
            }
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message || 'Failed readiness check' });
    }
};
