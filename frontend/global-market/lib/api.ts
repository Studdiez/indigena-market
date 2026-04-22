// API Client for Indigena Market Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper for API calls
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// NFT / Collection APIs
export const nftAPI = {
  // Get all NFTs
  getAll: () => fetchAPI('/ui/getAll'),
  
  // Get single NFT by contract address and token ID
  getById: (contractAddress: string, tokenId: string) => 
    fetchAPI('/ui/getnft', {
      method: 'POST',
      body: JSON.stringify({ contractAddress, tokenId }),
    }),
  
  // Get today's featured NFTs
  getTodayNFTs: () => fetchAPI('/ui/todaynft'),
  
  // Get top 15 collections
  getTopCollections: () => fetchAPI('/ui/Top15collections'),
  
  // Get all collections
  getAllCollections: () => fetchAPI('/ui/getAllcollection'),
  
  // Create new NFT (Creator Hub)
  create: (data: any) => fetchAPI('/ui/create-nft', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  // Update NFT price
  updatePrice: (data: any) => fetchAPI('/ui/updatenftprice', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Find NFTs in collection
  findInCollection: (collectionAddress: string) => 
    fetchAPI('/ui/FindCollectionNft', {
      method: 'POST',
      body: JSON.stringify({ collectionAddress }),
    }),
  
  // Get total amount/volume
  getTotalAmount: (data: any) => fetchAPI('/ui/TotalAmount', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Artist APIs
export const artistAPI = {
  // Get all artists
  getAll: () => fetchAPI('/ui/artists'),
  
  // Get featured artists
  getFeatured: () => fetchAPI('/ui/artists/featured'),
  
  // Get single artist
  getById: (id: string) => fetchAPI(`/ui/artists/${id}`),
  
  // Get artist's NFTs
  getNFTs: (artistId: string) => fetchAPI(`/ui/artists/${artistId}/nfts`),
};

// Seva / Donation APIs
export const sevaAPI = {
  // Get all Seva projects
  getProjects: () => fetchAPI('/seva/projects'),
  
  // Get featured project
  getFeatured: () => fetchAPI('/seva/projects/featured'),
  
  // Get single project
  getProject: (id: string) => fetchAPI(`/seva/projects/${id}`),
  
  // Create donation
  donate: (projectId: string, amount: number, data: any) => 
    fetchAPI('/seva/donations', {
      method: 'POST',
      body: JSON.stringify({ projectId, amount, ...data }),
    }),
  
  // Get donation stats
  getStats: () => fetchAPI('/seva/stats'),
  
  // Get user's impact
  getUserImpact: (userId: string) => fetchAPI(`/seva/impact/${userId}`),
};

// Wallet / Payment APIs
export const walletAPI = {
  // Get wallet balance
  getBalance: (userId: string) => fetchAPI(`/wallet/${userId}/balance`),
  
  // Get transaction history
  getTransactions: (userId: string) => fetchAPI(`/wallet/${userId}/transactions`),
  
  // Request withdrawal
  withdraw: (userId: string, amount: number, method: string) => 
    fetchAPI('/wallet/withdraw', {
      method: 'POST',
      body: JSON.stringify({ userId, amount, method }),
    }),
};

// User / Auth APIs
export const userAPI = {
  // Get current user
  getMe: () => fetchAPI('/users/me'),
  
  // Update profile
  updateProfile: (data: any) => fetchAPI('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  // Get user's listings (Creator Hub)
  getListings: () => fetchAPI('/users/listings'),
  
  // Get user's favorites
  getFavorites: () => fetchAPI('/users/favorites'),
};

// Bidding APIs
export const bidAPI = {
  // Place bid
  placeBid: (nftId: string, amount: number) => 
    fetchAPI('/bids', {
      method: 'POST',
      body: JSON.stringify({ nftId, amount }),
    }),
  
  // Get bids for NFT
  getBids: (nftId: string) => fetchAPI(`/bids/nft/${nftId}`),
  
  // Cancel bid
  cancelBid: (bidId: string) => fetchAPI(`/bids/${bidId}/cancel`, {
    method: 'POST',
  }),
};

// Offer APIs
export const offerAPI = {
  // Make offer
  makeOffer: (nftId: string, amount: number) => 
    fetchAPI('/offers', {
      method: 'POST',
      body: JSON.stringify({ nftId, amount }),
    }),
  
  // Accept offer
  acceptOffer: (offerId: string) => fetchAPI(`/offers/${offerId}/accept`, {
    method: 'POST',
  }),
  
  // Reject offer
  rejectOffer: (offerId: string) => fetchAPI(`/offers/${offerId}/reject`, {
    method: 'POST',
  }),
};

// Voice / Accessibility APIs
export const voiceAPI = {
  // Process voice command
  processCommand: (command: string, context: string) => 
    fetchAPI('/voice/command', {
      method: 'POST',
      body: JSON.stringify({ command, context }),
    }),
  
  // Get voice navigation hints
  getNavigationHints: () => fetchAPI('/voice/navigation'),
};

// Community / Hub APIs
export const hubAPI = {
  // Get nearby Digital Champions
  getChampions: (lat: number, lng: number, radius: number = 50) => 
    fetchAPI(`/hub/champions?lat=${lat}&lng=${lng}&radius=${radius}`),
  
  // Request help
  requestHelp: (championId: string, message: string) => 
    fetchAPI('/hub/help-request', {
      method: 'POST',
      body: JSON.stringify({ championId, message }),
    }),
  
  // Get community events
  getEvents: () => fetchAPI('/hub/events'),
};

// Transparency APIs
export const transparencyAPI = {
  // Get purchase breakdown
  getBreakdown: (nftId: string, price: number) => 
    fetchAPI(`/transparency/breakdown?nftId=${nftId}&price=${price}`),
  
  // Get artist earnings
  getArtistEarnings: (artistId: string) => fetchAPI(`/transparency/artist/${artistId}/earnings`),
  
  // Get community impact
  getCommunityImpact: (communityId: string) => fetchAPI(`/transparency/community/${communityId}/impact`),
};

// XRPL / Blockchain APIs
export const xrplAPI = {
  // Get wallet address for deposit
  getDepositAddress: () => fetchAPI('/xrpl/deposit-address'),
  
  // Check transaction status
  checkTransaction: (txHash: string) => fetchAPI(`/xrpl/transaction/${txHash}`),
  
  // Get NFT metadata from blockchain
  getNFTMetadata: (tokenId: string) => fetchAPI(`/xrpl/nft/${tokenId}`),
};

