const xrplClient = require('../../config/xrpl.config.js');
const xummService = require('../../services/xumm.service.js');
const NFT = require('../models/NFTcollection.model.js');
const Users = require('../models/user.model.js');
const dotenv = require('dotenv');

dotenv.config();

// Create Xumm payload for minting NFT
exports.createMintPayload = async (req, res) => {
    try {
        const {
            account,
            metadata,
            royaltyPercent,
            culturalTags,
            sevaAllocation
        } = req.body;

        if (!account || !metadata) {
            return res.status(400).send({
                status: false,
                message: 'Account and metadata are required'
            });
        }

        // Validate royalty percentage (5-30%)
        const royalty = royaltyPercent || 10;
        if (royalty < 5 || royalty > 30) {
            return res.status(400).send({
                status: false,
                message: 'Royalty percentage must be between 5% and 30%'
            });
        }

        // Prepare metadata with cultural information
        const fullMetadata = {
            ...metadata,
            attributes: [
                ...(metadata.attributes || []),
                { trait_type: 'Tribe', value: culturalTags?.tribe || 'Unknown' },
                { trait_type: 'Nation', value: culturalTags?.nation || 'Unknown' },
                { trait_type: 'Language', value: culturalTags?.language || 'Unknown' },
                { trait_type: 'Sacred Status', value: culturalTags?.sacredStatus || 'public' },
                { trait_type: 'Royalty', value: royalty },
                { trait_type: 'SEVA Allocation', value: sevaAllocation || 0 }
            ],
            cultural_info: {
                tribe: culturalTags?.tribe,
                nation: culturalTags?.nation,
                language: culturalTags?.language,
                sacred_status: culturalTags?.sacredStatus || 'public',
                traditional_knowledge_label: culturalTags?.traditionalKnowledgeLabel,
                seva_allocation: sevaAllocation || 0
            }
        };

        const payload = await xummService.createMintPayload(fullMetadata, royalty, account);

        return res.status(200).send({
            status: true,
            payload: {
                uuid: payload.uuid,
                next: payload.next,
                qr: payload.refs?.qr_png,
                websocket: payload.refs?.websocket
            }
        });
    } catch (error) {
        console.error('Create mint payload error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to create mint payload',
            error: error.message
        });
    }
};

// Verify mint transaction and save to database
exports.verifyMintTransaction = async (req, res) => {
    try {
        const { payloadUuid, walletAddress, metadata } = req.body;

        if (!payloadUuid) {
            return res.status(400).send({
                status: false,
                message: 'Payload UUID is required'
            });
        }

        const verification = await xummService.verifyUserSignature(payloadUuid);

        if (!verification.signed) {
            return res.status(400).send({
                status: false,
                message: 'Transaction not yet signed'
            });
        }

        // Get transaction details from XRPL
        const txResult = await xrplClient.getTransactionStatus(verification.txHash);

        if (txResult.meta?.TransactionResult !== 'tesSUCCESS') {
            return res.status(400).send({
                status: false,
                message: 'Transaction failed on XRPL',
                result: txResult.meta?.TransactionResult
            });
        }

        // Extract NFTokenID from transaction metadata
        const nftokenNode = txResult.meta?.AffectedNodes?.find(
            node => node.CreatedNode?.LedgerEntryType === 'NFTokenPage'
        );
        const xrplTokenId = nftokenNode?.CreatedNode?.LedgerIndex || verification.txHash;

        // Save NFT to database
        const nftData = {
            NftId: xrplTokenId,
            xrplTokenId: xrplTokenId,
            mintTransactionHash: verification.txHash,
            WalletAddress: walletAddress?.toLowerCase(),
            Jsondataurl: metadata?.jsonUrl || '',
            Imageurl: metadata?.imageUrl || '',
            ItemName: metadata?.name || '',
            Description: metadata?.description || '',
            Status: 'Mint',
            Blockchain: 'XRPL',
            Type: metadata?.type || 'image',
            CollectionName: metadata?.collectionName || '',
            royaltyPercent: metadata?.royaltyPercent || 10,
            sevaAllocation: metadata?.sevaAllocation || 0,
            culturalTags: {
                tribe: metadata?.culturalTags?.tribe,
                nation: metadata?.culturalTags?.nation,
                language: metadata?.culturalTags?.language,
                sacredStatus: metadata?.culturalTags?.sacredStatus || 'public',
                traditionalKnowledgeLabel: metadata?.culturalTags?.traditionalKnowledgeLabel
            },
            voiceStoryUrl: metadata?.voiceStoryUrl || '',
            physicalNFCId: metadata?.physicalNFCId || '',
            IsActive: 'true',
            IsBlock: false
        };

        const savedNFT = await NFT.create(nftData);

        // Update user's token list
        await Users.findOneAndUpdate(
            { WalletAddress: walletAddress?.toLowerCase() },
            { $push: { TokenId: xrplTokenId } },
            { upsert: true }
        );

        return res.status(200).send({
            status: true,
            message: 'NFT minted successfully',
            nft: savedNFT,
            transaction: {
                hash: verification.txHash,
                xrplTokenId: xrplTokenId
            }
        });
    } catch (error) {
        console.error('Verify mint transaction error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to verify mint transaction',
            error: error.message
        });
    }
};

// Get NFTs owned by an account from XRPL
exports.getAccountNFTs = async (req, res) => {
    try {
        const { address } = req.params;

        if (!address) {
            return res.status(400).send({
                status: false,
                message: 'Address is required'
            });
        }

        const nfts = await xrplClient.getAccountNFTs(address);

        // Parse NFT metadata from URIs
        const parsedNFTs = nfts.map(nft => {
            let metadata = {};
            if (nft.URI) {
                try {
                    const uriString = Buffer.from(nft.URI, 'hex').toString('utf8');
                    metadata = JSON.parse(uriString);
                } catch (e) {
                    metadata = { rawUri: nft.URI };
                }
            }

            return {
                tokenId: nft.NFTokenID,
                taxon: nft.NFTokenTaxon,
                uri: nft.URI,
                metadata: metadata,
                transferFee: nft.TransferFee,
                issuer: nft.Issuer,
                flags: nft.Flags
            };
        });

        return res.status(200).send({
            status: true,
            count: parsedNFTs.length,
            nfts: parsedNFTs
        });
    } catch (error) {
        console.error('Get account NFTs error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to fetch account NFTs',
            error: error.message
        });
    }
};

// Get transaction status
exports.getTransactionStatus = async (req, res) => {
    try {
        const { hash } = req.params;

        if (!hash) {
            return res.status(400).send({
                status: false,
                message: 'Transaction hash is required'
            });
        }

        const result = await xrplClient.getTransactionStatus(hash);

        return res.status(200).send({
            status: true,
            transaction: {
                hash: hash,
                result: result.meta?.TransactionResult,
                validated: result.validated,
                ledgerIndex: result.ledger_index,
                date: result.date
            }
        });
    } catch (error) {
        console.error('Get transaction status error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to get transaction status',
            error: error.message
        });
    }
};

// Create sell offer for NFT
exports.createSellOffer = async (req, res) => {
    try {
        const { tokenId, amount, account } = req.body;

        if (!tokenId || !amount || !account) {
            return res.status(400).send({
                status: false,
                message: 'Token ID, amount, and account are required'
            });
        }

        const payload = await xummService.createSellOfferPayload(tokenId, amount, account);

        return res.status(200).send({
            status: true,
            payload: {
                uuid: payload.uuid,
                next: payload.next,
                qr: payload.refs?.qr_png
            }
        });
    } catch (error) {
        console.error('Create sell offer error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to create sell offer',
            error: error.message
        });
    }
};

// Create buy offer for NFT
exports.createBuyOffer = async (req, res) => {
    try {
        const { tokenId, amount, owner, account } = req.body;

        if (!tokenId || !amount || !owner || !account) {
            return res.status(400).send({
                status: false,
                message: 'Token ID, amount, owner, and account are required'
            });
        }

        const payload = await xummService.createBuyOfferPayload(tokenId, amount, owner, account);

        return res.status(200).send({
            status: true,
            payload: {
                uuid: payload.uuid,
                next: payload.next,
                qr: payload.refs?.qr_png
            }
        });
    } catch (error) {
        console.error('Create buy offer error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to create buy offer',
            error: error.message
        });
    }
};

// Accept offer
exports.acceptOffer = async (req, res) => {
    try {
        const { offerId, account } = req.body;

        if (!offerId || !account) {
            return res.status(400).send({
                status: false,
                message: 'Offer ID and account are required'
            });
        }

        const payload = await xummService.createAcceptOfferPayload(offerId, account);

        return res.status(200).send({
            status: true,
            payload: {
                uuid: payload.uuid,
                next: payload.next,
                qr: payload.refs?.qr_png
            }
        });
    } catch (error) {
        console.error('Accept offer error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to create accept offer payload',
            error: error.message
        });
    }
};

// Burn NFT
exports.burnNFT = async (req, res) => {
    try {
        const { tokenId, account } = req.body;

        if (!tokenId || !account) {
            return res.status(400).send({
                status: false,
                message: 'Token ID and account are required'
            });
        }

        const payload = await xummService.createBurnPayload(tokenId, account);

        return res.status(200).send({
            status: true,
            payload: {
                uuid: payload.uuid,
                next: payload.next,
                qr: payload.refs?.qr_png
            }
        });
    } catch (error) {
        console.error('Burn NFT error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to create burn payload',
            error: error.message
        });
    }
};

// Calculate royalty fee for a given percentage
exports.calculateRoyalty = async (req, res) => {
    try {
        const { percent } = req.body;

        if (percent === undefined || percent < 5 || percent > 30) {
            return res.status(400).send({
                status: false,
                message: 'Royalty percentage must be between 5% and 30%'
            });
        }

        const transferFee = xrplClient.calculateTransferFee(percent);

        return res.status(200).send({
            status: true,
            royaltyPercent: percent,
            transferFee: transferFee,
            basisPoints: transferFee / 10
        });
    } catch (error) {
        console.error('Calculate royalty error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to calculate royalty',
            error: error.message
        });
    }
};

// Get Xumm payload status
exports.getPayloadStatus = async (req, res) => {
    try {
        const { uuid } = req.params;

        if (!uuid) {
            return res.status(400).send({
                status: false,
                message: 'Payload UUID is required'
            });
        }

        const payload = await xummService.getPayload(uuid);

        return res.status(200).send({
            status: true,
            payload: {
                uuid: payload.uuid,
                signed: payload.meta?.signed,
                expired: payload.meta?.expired,
                account: payload.response?.account,
                txHash: payload.response?.txid,
                resolved: payload.meta?.resolved
            }
        });
    } catch (error) {
        console.error('Get payload status error:', error);
        return res.status(500).send({
            status: false,
            message: 'Failed to get payload status',
            error: error.message
        });
    }
};
