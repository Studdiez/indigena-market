const { XummSdk } = require('xumm-sdk');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Xumm SDK only if credentials are available
let xumm = null;
let xummPing = null;

async function initializeXumm() {
    try {
        if (process.env.XUMM_API_KEY && process.env.XUMM_API_SECRET &&
            process.env.XUMM_API_KEY !== 'your_xumm_api_key_here') {
            xumm = new XummSdk(process.env.XUMM_API_KEY, process.env.XUMM_API_SECRET);
            
            // Test the connection
            try {
                xummPing = await xumm.ping();
                console.log('Xumm SDK initialized successfully');
                console.log('Xumm app name:', xummPing?.application?.name);
            } catch (pingError) {
                console.error('Xumm SDK ping failed:', pingError.message);
                xumm = null;
            }
        } else {
            console.warn('Xumm SDK not initialized: Missing or placeholder API credentials');
        }
    } catch (error) {
        console.error('Failed to initialize Xumm SDK:', error.message);
    }
}

initializeXumm();

class XummService {
    constructor() {
        this.sdk = xumm;
        this.ping = xummPing;
        this.initialized = false;
    }

    async waitForInitialization() {
        // Wait up to 10 seconds for initialization
        for (let i = 0; i < 20; i++) {
            if (xumm && xummPing) {
                this.sdk = xumm;
                this.ping = xummPing;
                this.initialized = true;
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        return false;
    }

    async checkInitialized() {
        if (!this.initialized) {
            const ready = await this.waitForInitialization();
            if (!ready) {
                throw new Error('Xumm SDK not initialized. Please configure XUMM_API_KEY and XUMM_API_SECRET in .env file');
            }
        }
    }

    async createMintPayload(metadata, royaltyPercent, account) {
        await this.checkInitialized();
        const transferFee = Math.round(royaltyPercent * 1000);
        
        const payload = {
            txjson: {
                TransactionType: 'NFTokenMint',
                Account: account,
                URI: this.convertStringToHex(JSON.stringify(metadata)),
                Flags: 8, // tfTransferable
                TransferFee: transferFee,
                NFTokenTaxon: 0
            },
            options: {
                submit: true,
                multisign: false,
                expire: 1440,
                return_url: {
                    app: process.env.FRONTEND_URL || 'http://localhost:3000',
                    web: process.env.FRONTEND_URL || 'http://localhost:3000'
                }
            }
        };

        console.log('Creating Xumm payload for account:', account);
        console.log('SDK instance:', this.sdk ? 'exists' : 'null');
        
        try {
            const result = await this.sdk.payload.create(payload);
            console.log('Xumm payload result:', result);
            if (!result) {
                throw new Error('Xumm payload.create returned null/undefined');
            }
            console.log('Xumm payload created:', result.uuid);
            return result;
        } catch (error) {
            console.error('Failed to create mint payload:', error.message);
            throw new Error(`Xumm payload creation failed: ${error.message}`);
        }
    }

    async createSellOfferPayload(tokenId, amount, account) {
        await this.checkInitialized();
        const payload = {
            txjson: {
                TransactionType: 'NFTokenCreateOffer',
                Account: account,
                NFTokenID: tokenId,
                Amount: amount,
                Flags: 1 // tfSellToken
            },
            options: {
                submit: true,
                multisign: false,
                expire: 1440
            }
        };

        try {
            const result = await this.sdk.payload.create(payload);
            return result;
        } catch (error) {
            console.error('Failed to create sell offer payload:', error);
            throw error;
        }
    }

    async createBuyOfferPayload(tokenId, amount, owner, account) {
        await this.checkInitialized();
        const payload = {
            txjson: {
                TransactionType: 'NFTokenCreateOffer',
                Account: account,
                NFTokenID: tokenId,
                Amount: amount,
                Owner: owner
            },
            options: {
                submit: true,
                multisign: false,
                expire: 1440
            }
        };

        try {
            const result = await this.sdk.payload.create(payload);
            return result;
        } catch (error) {
            console.error('Failed to create buy offer payload:', error);
            throw error;
        }
    }

    async createAcceptOfferPayload(offerId, account) {
        await this.checkInitialized();
        const payload = {
            txjson: {
                TransactionType: 'NFTokenAcceptOffer',
                Account: account,
                NFTokenSellOffer: offerId
            },
            options: {
                submit: true,
                multisign: false,
                expire: 1440
            }
        };

        try {
            const result = await this.sdk.payload.create(payload);
            return result;
        } catch (error) {
            console.error('Failed to create accept offer payload:', error);
            throw error;
        }
    }

    async createCancelOfferPayload(tokenOffers, account) {
        await this.checkInitialized();
        const payload = {
            txjson: {
                TransactionType: 'NFTokenCancelOffer',
                Account: account,
                NFTokenOffers: tokenOffers
            },
            options: {
                submit: true,
                multisign: false,
                expire: 1440
            }
        };

        try {
            const result = await this.sdk.payload.create(payload);
            return result;
        } catch (error) {
            console.error('Failed to create cancel offer payload:', error);
            throw error;
        }
    }

    async createBurnPayload(tokenId, account) {
        await this.checkInitialized();
        const payload = {
            txjson: {
                TransactionType: 'NFTokenBurn',
                Account: account,
                NFTokenID: tokenId
            },
            options: {
                submit: true,
                multisign: false,
                expire: 1440
            }
        };

        try {
            const result = await this.sdk.payload.create(payload);
            return result;
        } catch (error) {
            console.error('Failed to create burn payload:', error);
            throw error;
        }
    }

    async getPayload(uuid) {
        await this.checkInitialized();
        try {
            const result = await this.sdk.payload.get(uuid);
            return result;
        } catch (error) {
            console.error('Failed to get payload:', error);
            throw error;
        }
    }

    async deletePayload(uuid) {
        await this.checkInitialized();
        try {
            const result = await this.sdk.payload.delete(uuid);
            return result;
        } catch (error) {
            console.error('Failed to delete payload:', error);
            throw error;
        }
    }

    async verifyUserSignature(payloadUuid) {
        await this.checkInitialized();
        try {
            const payload = await this.getPayload(payloadUuid);
            if (payload.meta.signed) {
                return {
                    signed: true,
                    account: payload.response.account,
                    txHash: payload.response.txid,
                    txBlob: payload.response.hex
                };
            }
            return { signed: false };
        } catch (error) {
            console.error('Failed to verify signature:', error);
            throw error;
        }
    }

    convertStringToHex(str) {
        return Buffer.from(str, 'utf8').toString('hex').toUpperCase();
    }

    convertHexToString(hex) {
        return Buffer.from(hex, 'hex').toString('utf8');
    }

    async getCuratedAssets() {
        await this.checkInitialized();
        try {
            const result = await this.sdk.getCuratedAssets();
            return result;
        } catch (error) {
            console.error('Failed to get curated assets:', error);
            throw error;
        }
    }

    async verifyUserToken(userToken) {
        await this.checkInitialized();
        try {
            const result = await this.sdk.verifyUserToken(userToken);
            return result;
        } catch (error) {
            console.error('Failed to verify user token:', error);
            throw error;
        }
    }
}

module.exports = new XummService();
