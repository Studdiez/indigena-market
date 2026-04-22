const xrplClient = require('../config/xrpl.config.js');
const dotenv = require('dotenv');

dotenv.config();

class XRPLService {
    constructor() {
        this.ipfsGateway = process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs/';
        this.arweaveGateway = process.env.ARWEAVE_GATEWAY || 'https://arweave.net/';
    }

    // Parse XLS-20d metadata from NFT URI
    parseNFTMetadata(uri) {
        if (!uri) return null;

        try {
            // Handle hex-encoded URIs
            let metadataString;
            if (this.isHex(uri)) {
                metadataString = Buffer.from(uri, 'hex').toString('utf8');
            } else {
                metadataString = uri;
            }

            // Try to parse as JSON
            const metadata = JSON.parse(metadataString);
            return metadata;
        } catch (error) {
            console.error('Error parsing NFT metadata:', error);
            return { rawUri: uri };
        }
    }

    // Check if string is hex
    isHex(str) {
        return /^[0-9A-Fa-f]+$/.test(str) && str.length % 2 === 0;
    }

    // Convert royalty percentage to XRPL TransferFee (basis points)
    calculateTransferFee(royaltyPercent) {
        // XRPL TransferFee is in basis points (1/100 of 1%)
        // 1% = 1000, 10% = 10000, etc.
        return Math.round(royaltyPercent * 1000);
    }

    // Convert TransferFee back to percentage
    parseTransferFee(transferFee) {
        return transferFee / 1000;
    }

    // Build metadata object for XLS-20d NFT
    buildMetadata({
        name,
        description,
        image,
        attributes = [],
        culturalTags = {},
        externalUrl,
        animationUrl,
        properties = {}
    }) {
        const metadata = {
            name,
            description,
            image,
            attributes: [
                ...attributes,
                { trait_type: 'Tribe', value: culturalTags.tribe || 'Unknown' },
                { trait_type: 'Nation', value: culturalTags.nation || 'Unknown' },
                { trait_type: 'Language', value: culturalTags.language || 'Unknown' },
                { trait_type: 'Sacred Status', value: culturalTags.sacredStatus || 'public' }
            ],
            properties: {
                ...properties,
                cultural_info: {
                    tribe: culturalTags.tribe,
                    nation: culturalTags.nation,
                    language: culturalTags.language,
                    sacred_status: culturalTags.sacredStatus,
                    traditional_knowledge_label: culturalTags.traditionalKnowledgeLabel,
                    seva_allocation: culturalTags.sevaAllocation || 0
                }
            }
        };

        if (externalUrl) metadata.external_url = externalUrl;
        if (animationUrl) metadata.animation_url = animationUrl;

        return metadata;
    }

    // Resolve IPFS/Arweave URL to HTTP gateway URL
    resolveUrl(url) {
        if (!url) return null;

        // IPFS
        if (url.startsWith('ipfs://')) {
            return url.replace('ipfs://', this.ipfsGateway);
        }

        // Arweave
        if (url.startsWith('arweave://')) {
            return url.replace('arweave://', this.arweaveGateway);
        }

        return url;
    }

    // Convert URL to storage protocol format
    toStorageUrl(url, protocol = 'ipfs') {
        if (!url) return null;

        if (protocol === 'ipfs') {
            if (url.includes('/ipfs/')) {
                const hash = url.split('/ipfs/')[1];
                return `ipfs://${hash}`;
            }
        } else if (protocol === 'arweave') {
            if (url.includes('arweave.net/')) {
                const hash = url.split('arweave.net/')[1];
                return `arweave://${hash}`;
            }
        }

        return url;
    }

    // Validate XRPL address
    isValidAddress(address) {
        // Basic r-address validation
        return /^r[1-9A-HJ-NP-Za-km-z]{25,34}$/.test(address);
    }

    // Validate NFT metadata
    validateMetadata(metadata) {
        const errors = [];

        if (!metadata.name) errors.push('Name is required');
        if (!metadata.description) errors.push('Description is required');
        if (!metadata.image) errors.push('Image URL is required');

        // Validate cultural tags if present
        if (metadata.culturalTags) {
            const validSacredStatuses = ['public', 'restricted', 'sacred'];
            if (metadata.culturalTags.sacredStatus && 
                !validSacredStatuses.includes(metadata.culturalTags.sacredStatus)) {
                errors.push('Invalid sacred status');
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    // Extract NFTokenID from transaction result
    extractNFTokenID(txResult) {
        if (!txResult?.meta?.AffectedNodes) return null;

        for (const node of txResult.meta.AffectedNodes) {
            // Look for CreatedNode with NFTokenPage
            if (node.CreatedNode?.LedgerEntryType === 'NFTokenPage') {
                return node.CreatedNode.LedgerIndex;
            }
            
            // Look for ModifiedNode with NFTokenPage
            if (node.ModifiedNode?.LedgerEntryType === 'NFTokenPage') {
                // The NFTokenID should be in the FinalFields or PreviousFields
                const finalTokens = node.ModifiedNode.FinalFields?.NFTokens || [];
                const previousTokens = node.ModifiedNode.PreviousFields?.NFTokens || [];
                
                // Find the new token
                const newToken = finalTokens.find(ft => 
                    !previousTokens.some(pt => pt.NFToken.NFTokenID === ft.NFToken.NFTokenID)
                );
                
                if (newToken) {
                    return newToken.NFToken.NFTokenID;
                }
            }
        }

        return null;
    }

    // Format NFT for API response
    formatNFTForResponse(nft, metadata = null) {
        return {
            tokenId: nft.NFTokenID,
            taxon: nft.NFTokenTaxon,
            uri: nft.URI,
            transferFee: this.parseTransferFee(nft.TransferFee || 0),
            issuer: nft.Issuer,
            flags: {
                burnable: !!(nft.Flags & 0x00000001),
                onlyXRP: !!(nft.Flags & 0x00000002),
                transferable: !!(nft.Flags & 0x00000008)
            },
            metadata: metadata,
            serial: nft.nft_serial
        };
    }

    // Parse flags from NFToken
    parseFlags(flags) {
        return {
            burnable: !!(flags & 0x00000001),
            onlyXRP: !!(flags & 0x00000002),
            trustLine: !!(flags & 0x00000004),
            transferable: !!(flags & 0x00000008)
        };
    }

    // Calculate SEVA amount from sale
    calculateSEVA(saleAmount, sevaAllocationPercent) {
        // SEVA is calculated as a percentage of the sale amount
        // sevaAllocationPercent is 0-100
        return (saleAmount * sevaAllocationPercent) / 100;
    }

    // Generate metadata hash for verification
    generateMetadataHash(metadata) {
        const crypto = require('crypto');
        const sortedMetadata = this.sortObjectKeys(metadata);
        const jsonString = JSON.stringify(sortedMetadata);
        return crypto.createHash('sha256').update(jsonString).digest('hex');
    }

    // Sort object keys recursively for consistent hashing
    sortObjectKeys(obj) {
        if (Array.isArray(obj)) {
            return obj.map(item => this.sortObjectKeys(item));
        } else if (obj !== null && typeof obj === 'object') {
            return Object.keys(obj).sort().reduce((acc, key) => {
                acc[key] = this.sortObjectKeys(obj[key]);
                return acc;
            }, {});
        }
        return obj;
    }

    // Check if NFT has restricted/sacred content
    isRestrictedContent(metadata) {
        const sacredStatus = metadata?.properties?.cultural_info?.sacred_status ||
                           metadata?.culturalTags?.sacredStatus;
        return sacredStatus === 'restricted' || sacredStatus === 'sacred';
    }

    // Get cultural metadata from NFT
    extractCulturalMetadata(metadata) {
        const culturalInfo = metadata?.properties?.cultural_info || {};
        
        return {
            tribe: culturalInfo.tribe || metadata?.attributes?.find(a => a.trait_type === 'Tribe')?.value,
            nation: culturalInfo.nation || metadata?.attributes?.find(a => a.trait_type === 'Nation')?.value,
            language: culturalInfo.language || metadata?.attributes?.find(a => a.trait_type === 'Language')?.value,
            sacredStatus: culturalInfo.sacred_status || 'public',
            traditionalKnowledgeLabel: culturalInfo.traditional_knowledge_label,
            sevaAllocation: culturalInfo.seva_allocation || 0
        };
    }

    // Validate royalty percentage (Indigena: 5-30%)
    validateRoyaltyPercent(percent) {
        return percent >= 5 && percent <= 30;
    }

    // Get recommended royalty based on artist tier
    getRecommendedRoyalty(artistTier) {
        const royalties = {
            'Earth Guardian': 5,
            'Sky Creator': 10,
            'Cosmic Wisdom': 15,
            'Visionary': 20
        };
        return royalties[artistTier] || 10;
    }
}

module.exports = new XRPLService();
