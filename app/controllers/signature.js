require('dotenv').config()
const { Sign } = require('crypto');
const ethers = require('ethers');

// Initialize wallet only if private key exists
let wallet = null;
if (process.env.WALLET_PRIVATE_KEY) {
    try {
        wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY);
    } catch (error) {
        console.warn('Failed to initialize wallet:', error.message);
    }
}

async function signTransaction(seller,buyer,nftAddress,inEth,_ordertype,amount,tokenId,qty,timestamp,Blockchain) {
    
    if (!wallet) {
        throw new Error('Wallet not initialized. WALLET_PRIVATE_KEY may be missing or invalid.');
    }

    const domain = {
        name: "NFT_MARKET_PLACE",
        version: "1",
        chainId: Blockchain=="Ethereum"?1:Blockchain=="BSC SmartChain"?56:137, //put the chain id
        verifyingContract: Blockchain=="Ethereum"?process.env.NFT_TRADE_ETH:Blockchain=="BSC SmartChain"?process.env.NFT_TRADE_BNB:process.env.NFT_TRADE_MATIC //contract address
    }
    const types ={

        whitelisted: [
            {name: 'seller', type: 'address'},
            {name: 'buyer', type: 'address'},
            {name: 'nftAddress', type: 'address'},
            {name: 'inEth', type: 'bool'},
          {name: 'amount', type: 'uint256'},
            {name: 'tokenId', type: 'uint256'},
            {name: 'qty', type: 'uint256'},
            {name: 'timestamp', type: 'uint256'}
        ]
    }

    const value = {
        seller: seller,
        buyer: buyer,
        nftAddress: nftAddress,
        inEth: inEth,
       amount: amount,
        tokenId: tokenId,
        qty: qty,
        timestamp: timestamp
    };
    const sign = await wallet._signTypedData(domain,types,value)
    console.log([seller,buyer,nftAddress,inEth,amount,tokenId,qty,timestamp,sign]);
    return sign
}

module.exports = { signTransaction };

