const { Client } = require('xrpl');
const dotenv = require('dotenv');

dotenv.config();

const XRPL_NETWORK = process.env.XRPL_NETWORK || 'testnet';
const XRPL_WS_URL = process.env.XRPL_WS_URL || 'wss://s.altnet.rippletest.net:51233';

class XRPLClient {
    constructor() {
        this.client = new Client(XRPL_WS_URL);
        this.isConnected = false;
    }

    async connect() {
        if (!this.isConnected) {
            try {
                await this.client.connect();
                this.isConnected = true;
                console.log(`Connected to XRPL ${XRPL_NETWORK}`);
            } catch (error) {
                console.error('Failed to connect to XRPL:', error);
                throw error;
            }
        }
        return this.client;
    }

    async disconnect() {
        if (this.isConnected) {
            await this.client.disconnect();
            this.isConnected = false;
            console.log('Disconnected from XRPL');
        }
    }

    getClient() {
        return this.client;
    }

    async submitTransaction(transaction, wallet) {
        try {
            await this.connect();
            const prepared = await this.client.autofill(transaction);
            const signed = wallet.sign(prepared);
            const result = await this.client.submitAndWait(signed.tx_blob);
            return result;
        } catch (error) {
            console.error('Transaction submission failed:', error);
            throw error;
        }
    }

    async getAccountNFTs(address) {
        try {
            await this.connect();
            const response = await this.client.request({
                command: 'account_nfts',
                account: address,
                ledger_index: 'validated'
            });
            return response.result.account_nfts;
        } catch (error) {
            console.error('Failed to fetch account NFTs:', error);
            throw error;
        }
    }

    async getTransactionStatus(txHash) {
        try {
            await this.connect();
            const response = await this.client.request({
                command: 'tx',
                transaction: txHash
            });
            return response.result;
        } catch (error) {
            console.error('Failed to get transaction status:', error);
            throw error;
        }
    }

    async getAccountInfo(address) {
        try {
            await this.connect();
            const response = await this.client.request({
                command: 'account_info',
                account: address,
                ledger_index: 'validated'
            });
            return response.result.account_data;
        } catch (error) {
            console.error('Failed to get account info:', error);
            throw error;
        }
    }

    calculateTransferFee(royaltyPercent) {
        return Math.round(royaltyPercent * 1000);
    }

    parseNFTokenID(tokenId) {
        return tokenId;
    }
}

const xrplClient = new XRPLClient();

module.exports = xrplClient;
