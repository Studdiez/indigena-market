const User = require('../models/user.model.js');
const SEVA = require('../models/SEVA.model.js');
const { v4: uuidv4 } = require('uuid');

/**
 * Disbursement Controller
 * Manages multi-channel payouts: mobile money, bank transfers, community credit unions
 */

// Payout method types
const PAYOUT_METHODS = {
    MOBILE_MONEY: 'mobile_money',
    BANK_TRANSFER: 'bank_transfer',
    CREDIT_UNION: 'credit_union',
    CRYPTO_WALLET: 'crypto_wallet',
    COMMUNITY_POOL: 'community_pool'
};

// Get user's payout settings
exports.getPayoutSettings = async (req, res) => {
    try {
        const { address } = req.params;

        const user = await User.findOne({ walletAddress: address })
            .select('walletAddress payoutSettings preferredPayoutMethod');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            walletAddress: user.walletAddress,
            preferredMethod: user.preferredPayoutMethod || PAYOUT_METHODS.CRYPTO_WALLET,
            payoutSettings: user.payoutSettings || {}
        });
    } catch (error) {
        console.error('Get payout settings error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update payout settings
exports.updatePayoutSettings = async (req, res) => {
    try {
        const { address } = req.params;
        const { 
            preferredMethod,
            mobileMoney,
            bankAccount,
            creditUnion,
            cryptoWallet
        } = req.body;

        const updateData = {
            preferredPayoutMethod: preferredMethod,
            payoutSettings: {
                mobileMoney: mobileMoney || {},
                bankAccount: bankAccount || {},
                creditUnion: creditUnion || {},
                cryptoWallet: cryptoWallet || { address: address }
            }
        };

        const user = await User.findOneAndUpdate(
            { walletAddress: address },
            updateData,
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            message: 'Payout settings updated',
            settings: user.payoutSettings
        });
    } catch (error) {
        console.error('Update payout settings error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Request a payout
exports.requestPayout = async (req, res) => {
    try {
        const { address } = req.params;
        const { amount, method, currency = 'USD' } = req.body;

        const user = await User.findOne({ walletAddress: address });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Get user's SEVA/earnings balance
        const sevaRecord = await SEVA.findOne({ walletAddress: address });
        const availableBalance = sevaRecord ? sevaRecord.totalEarned - sevaRecord.totalAllocated : 0;

        if (amount > availableBalance) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient balance',
                available: availableBalance,
                requested: amount
            });
        }

        const payoutMethod = method || user.preferredPayoutMethod || PAYOUT_METHODS.CRYPTO_WALLET;
        const payoutId = uuidv4();

        // Create payout request
        const payoutRequest = {
            payoutId,
            walletAddress: address,
            amount,
            currency,
            method: payoutMethod,
            status: 'pending',
            requestedAt: new Date(),
            payoutDetails: getPayoutDetails(user, payoutMethod),
            estimatedArrival: calculateArrivalTime(payoutMethod)
        };

        // Store payout request (in production, this would be a separate model)
        if (!user.payoutHistory) user.payoutHistory = [];
        user.payoutHistory.push(payoutRequest);
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Payout request submitted',
            payoutId,
            amount,
            currency,
            method: payoutMethod,
            status: 'pending',
            estimatedArrival: payoutRequest.estimatedArrival
        });
    } catch (error) {
        console.error('Request payout error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get payout history
exports.getPayoutHistory = async (req, res) => {
    try {
        const { address } = req.params;
        const { status, limit = 20 } = req.query;

        const user = await User.findOne({ walletAddress: address })
            .select('payoutHistory');

        if (!user || !user.payoutHistory) {
            return res.status(200).json({ success: true, payouts: [] });
        }

        let payouts = user.payoutHistory;
        if (status) {
            payouts = payouts.filter(p => p.status === status);
        }

        payouts = payouts
            .sort((a, b) => b.requestedAt - a.requestedAt)
            .slice(0, parseInt(limit));

        res.status(200).json({
            success: true,
            count: payouts.length,
            payouts
        });
    } catch (error) {
        console.error('Get payout history error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get available payout methods by region
exports.getPayoutMethods = async (req, res) => {
    try {
        const { region, country } = req.query;

        // Define available methods by region
        const methodsByRegion = {
            'africa': [
                { id: PAYOUT_METHODS.MOBILE_MONEY, name: 'Mobile Money', providers: ['M-Pesa', 'MTN Mobile Money', 'Airtel Money'], instant: true },
                { id: PAYOUT_METHODS.BANK_TRANSFER, name: 'Bank Transfer', providers: ['Standard Bank', 'Ecobank'], instant: false },
                { id: PAYOUT_METHODS.CRYPTO_WALLET, name: 'Crypto Wallet (XRP)', providers: ['Xumm', 'Ledger'], instant: true }
            ],
            'asia_pacific': [
                { id: PAYOUT_METHODS.MOBILE_MONEY, name: 'Mobile Money', providers: ['GCash', 'Paytm', 'Alipay'], instant: true },
                { id: PAYOUT_METHODS.BANK_TRANSFER, name: 'Bank Transfer', providers: ['Various'], instant: false },
                { id: PAYOUT_METHODS.CRYPTO_WALLET, name: 'Crypto Wallet (XRP)', providers: ['Xumm', 'Ledger'], instant: true }
            ],
            'latin_america': [
                { id: PAYOUT_METHODS.MOBILE_MONEY, name: 'Mobile Money', providers: ['Mercado Pago', 'OXXO'], instant: true },
                { id: PAYOUT_METHODS.BANK_TRANSFER, name: 'Bank Transfer', providers: ['Various'], instant: false },
                { id: PAYOUT_METHODS.CREDIT_UNION, name: 'Community Credit Union', providers: ['Local Cooperatives'], instant: false },
                { id: PAYOUT_METHODS.CRYPTO_WALLET, name: 'Crypto Wallet (XRP)', providers: ['Xumm', 'Ledger'], instant: true }
            ],
            'north_america': [
                { id: PAYOUT_METHODS.BANK_TRANSFER, name: 'Bank Transfer (ACH/Wire)', providers: ['Various'], instant: false },
                { id: PAYOUT_METHODS.CREDIT_UNION, name: 'Credit Union', providers: ['NCUA Insured'], instant: false },
                { id: PAYOUT_METHODS.CRYPTO_WALLET, name: 'Crypto Wallet (XRP)', providers: ['Xumm', 'Ledger'], instant: true }
            ],
            'europe': [
                { id: PAYOUT_METHODS.BANK_TRANSFER, name: 'SEPA Transfer', providers: ['Various'], instant: true },
                { id: PAYOUT_METHODS.CRYPTO_WALLET, name: 'Crypto Wallet (XRP)', providers: ['Xumm', 'Ledger'], instant: true }
            ],
            'default': [
                { id: PAYOUT_METHODS.CRYPTO_WALLET, name: 'Crypto Wallet (XRP)', providers: ['Xumm', 'Ledger'], instant: true },
                { id: PAYOUT_METHODS.BANK_TRANSFER, name: 'International Wire', providers: ['SWIFT'], instant: false }
            ]
        };

        const methods = methodsByRegion[region] || methodsByRegion['default'];

        res.status(200).json({
            success: true,
            region: region || 'default',
            country: country || null,
            methods
        });
    } catch (error) {
        console.error('Get payout methods error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get payout stats for a user
exports.getPayoutStats = async (req, res) => {
    try {
        const { address } = req.params;

        const user = await User.findOne({ walletAddress: address })
            .select('payoutHistory');

        const sevaRecord = await SEVA.findOne({ walletAddress: address });

        if (!user || !user.payoutHistory) {
            return res.status(200).json({
                success: true,
                stats: {
                    totalPayouts: 0,
                    totalAmount: 0,
                    pendingAmount: 0,
                    availableBalance: sevaRecord ? sevaRecord.totalEarned : 0
                }
            });
        }

        const payouts = user.payoutHistory;
        const completed = payouts.filter(p => p.status === 'completed');
        const pending = payouts.filter(p => p.status === 'pending');

        res.status(200).json({
            success: true,
            stats: {
                totalPayouts: completed.length,
                totalAmount: completed.reduce((sum, p) => sum + p.amount, 0),
                pendingAmount: pending.reduce((sum, p) => sum + p.amount, 0),
                availableBalance: sevaRecord ? sevaRecord.totalEarned - sevaRecord.totalAllocated : 0,
                byMethod: groupByMethod(completed)
            }
        });
    } catch (error) {
        console.error('Get payout stats error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Helper functions
function getPayoutDetails(user, method) {
    const settings = user.payoutSettings || {};
    
    switch (method) {
        case PAYOUT_METHODS.MOBILE_MONEY:
            return settings.mobileMoney || {};
        case PAYOUT_METHODS.BANK_TRANSFER:
            return settings.bankAccount || {};
        case PAYOUT_METHODS.CREDIT_UNION:
            return settings.creditUnion || {};
        case PAYOUT_METHODS.CRYPTO_WALLET:
            return { address: user.walletAddress };
        default:
            return {};
    }
}

function calculateArrivalTime(method) {
    const now = new Date();
    switch (method) {
        case PAYOUT_METHODS.MOBILE_MONEY:
        case PAYOUT_METHODS.CRYPTO_WALLET:
            return new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
        case PAYOUT_METHODS.BANK_TRANSFER:
        case PAYOUT_METHODS.CREDIT_UNION:
            return new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
        default:
            return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
}

function groupByMethod(payouts) {
    return payouts.reduce((acc, payout) => {
        const method = payout.method;
        if (!acc[method]) acc[method] = { count: 0, total: 0 };
        acc[method].count++;
        acc[method].total += payout.amount;
        return acc;
    }, {});
}

exports.PAYOUT_METHODS = PAYOUT_METHODS;

