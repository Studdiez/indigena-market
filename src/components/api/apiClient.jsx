/**
 * Indigena Market - Custom Backend API Client
 * Base URL: http://localhost:5000/api
 *
 * NOTE: For production, update BASE_URL to your deployed backend URL.
 */

const BASE_URL = "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response.json();
}

// ─── NFT & Collections ───────────────────────────────────────────────────────

export const nftApi = {
  getAll: () => request("/getAll"),
  getToday: () => request("/todaynft"),
  get: (data) => request("/getnft", { method: "POST", body: JSON.stringify(data) }),
  create: (data) => request("/create-nft", { method: "POST", body: JSON.stringify(data) }),
  updatePrice: (data) => request("/updatenftprice", { method: "PUT", body: JSON.stringify(data) }),
};

export const collectionApi = {
  getAll: () => request("/getAllcollection"),
  get: (data) => request("/getcollections", { method: "POST", body: JSON.stringify(data) }),
  create: (data) => request("/createCollection", { method: "POST", body: JSON.stringify(data) }),
  top15: () => request("/Top15collections"),
  top7: () => request("/Top7Collection"),
};

// ─── Bidding & Offers ────────────────────────────────────────────────────────

export const biddingApi = {
  createBid: (data) => request("/createbid", { method: "POST", body: JSON.stringify(data) }),
  getMaxBid: (data) => request("/maxbid", { method: "POST", body: JSON.stringify(data) }),
  createOffer: (data) => request("/createOffer", { method: "POST", body: JSON.stringify(data) }),
  getOffers: (data) => request("/getOffer", { method: "POST", body: JSON.stringify(data) }),
  updateOffer: (data) => request("/updateOffer", { method: "PUT", body: JSON.stringify(data) }),
};

// ─── XRPL Blockchain ─────────────────────────────────────────────────────────

export const xrplApi = {
  mint: (data) => request("/xrpl/mint", { method: "POST", body: JSON.stringify(data) }),
  verifyMint: (data) => request("/xrpl/verify-mint", { method: "POST", body: JSON.stringify(data) }),
  getAccountNFTs: (address) => request(`/xrpl/nfts/${address}`),
  getTransaction: (hash) => request(`/xrpl/transaction/${hash}`),
  createSellOffer: (data) => request("/xrpl/sell-offer", { method: "POST", body: JSON.stringify(data) }),
  createBuyOffer: (data) => request("/xrpl/buy-offer", { method: "POST", body: JSON.stringify(data) }),
  acceptOffer: (data) => request("/xrpl/accept-offer", { method: "POST", body: JSON.stringify(data) }),
  burn: (data) => request("/xrpl/burn", { method: "POST", body: JSON.stringify(data) }),
};

// ─── SEVA ────────────────────────────────────────────────────────────────────

export const sevaApi = {
  getDashboard: (address) => request(`/seva/dashboard/${address}`),
  allocate: (data) => request("/seva/allocate", { method: "POST", body: JSON.stringify(data) }),
  donate: (data) => request("/seva/donate", { method: "POST", body: JSON.stringify(data) }),
  getCauses: () => request("/seva/causes"),
  getProjects: () => request("/seva/projects"),
  createProject: (data) => request("/seva/projects", { method: "POST", body: JSON.stringify(data) }),
  createDonation: (data) => request("/seva/donations", { method: "POST", body: JSON.stringify(data) }),
  getImpact: (walletAddress) => request(`/seva/impact/${walletAddress}`),
};

// ─── Ecosystem (10 Pillars) ──────────────────────────────────────────────────

export const ecosystemApi = {
  sponsorships: {
    get: () => request("/ecosystem/sponsorships"),
    create: (data) => request("/ecosystem/sponsorships", { method: "POST", body: JSON.stringify(data) }),
  },
  crowdfunding: {
    get: () => request("/ecosystem/crowdfunding"),
    create: (data) => request("/ecosystem/crowdfunding", { method: "POST", body: JSON.stringify(data) }),
  },
  experiences: {
    get: () => request("/ecosystem/experiences"),
    create: (data) => request("/ecosystem/experiences", { method: "POST", body: JSON.stringify(data) }),
  },
  archive: {
    get: () => request("/ecosystem/archive"),
    create: (data) => request("/ecosystem/archive", { method: "POST", body: JSON.stringify(data) }),
  },
  food: {
    get: () => request("/ecosystem/food"),
    create: (data) => request("/ecosystem/food", { method: "POST", body: JSON.stringify(data) }),
  },
  legal: {
    get: () => request("/ecosystem/legal"),
    create: (data) => request("/ecosystem/legal", { method: "POST", body: JSON.stringify(data) }),
  },
  supplies: {
    get: () => request("/ecosystem/supplies"),
    create: (data) => request("/ecosystem/supplies", { method: "POST", body: JSON.stringify(data) }),
  },
};

// ─── Physical Items (NFC) ─────────────────────────────────────────────────────

export const physicalApi = {
  register: (data) => request("/physical/register", { method: "POST", body: JSON.stringify(data) }),
  getByNFC: (nfcTagId) => request(`/physical/${nfcTagId}`),
  verify: (data) => request("/physical/verify", { method: "POST", body: JSON.stringify(data) }),
  transfer: (data) => request("/physical/transfer", { method: "POST", body: JSON.stringify(data) }),
};

// ─── Courses ──────────────────────────────────────────────────────────────────

export const coursesApi = {
  getAll: () => request("/courses"),
  get: (courseId) => request(`/courses/${courseId}`),
  create: (data) => request("/courses", { method: "POST", body: JSON.stringify(data) }),
  enroll: (data) => request("/courses/enroll", { method: "POST", body: JSON.stringify(data) }),
  complete: (data) => request("/courses/complete", { method: "POST", body: JSON.stringify(data) }),
};

// ─── Freelancers ──────────────────────────────────────────────────────────────

export const freelancersApi = {
  getAll: () => request("/freelancers"),
  get: (address) => request(`/freelancers/${address}`),
  create: (data) => request("/freelancers", { method: "POST", body: JSON.stringify(data) }),
  getBySkill: (category) => request(`/freelancers/skills/${category}`),
};

// ─── Voice & Accessibility ────────────────────────────────────────────────────

export const voiceApi = {
  processCommand: (data) => request("/voice/command", { method: "POST", body: JSON.stringify(data) }),
  getSupportedLanguages: () => request("/voice/languages"),
};

export const accessibilityApi = {
  getSettings: (address) => request(`/accessibility/settings/${address}`),
  toggleElderMode: (data) => request("/accessibility/elder-mode", { method: "POST", body: JSON.stringify(data) }),
};

// ─── Transparency & Revenue ───────────────────────────────────────────────────

export const transparencyApi = {
  getPurchaseBreakdown: (nftId) => request(`/transparency/breakdown/${nftId}`),
  getArtistImpact: (address) => request(`/transparency/artist/${address}`),
};

export const revenueApi = {
  calculate: (data) => request("/revenue/calculate", { method: "POST", body: JSON.stringify(data) }),
  getArtistEarnings: (address) => request(`/revenue/artist/${address}`),
};

// ─── Community Hub (Offline) ──────────────────────────────────────────────────

export const hubApi = {
  upload: (data) => request("/hub/upload", { method: "POST", body: JSON.stringify(data) }),
  sync: (uploadId, data) => request(`/hub/sync/${uploadId}`, { method: "POST", body: JSON.stringify(data) }),
  batchSync: (data) => request("/hub/batch-sync", { method: "POST", body: JSON.stringify(data) }),
};