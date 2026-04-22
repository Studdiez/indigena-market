const API_BASE_URL = 'http://localhost:5000/api';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

export async function apiClient(endpoint: string, options: ApiOptions = {}) {
  const { method = 'GET', body, headers = {} } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
}

// NFT APIs
export const nftAPI = {
  create: (data: any) => apiClient('/ui/createnft', { method: 'POST', body: data }),
  getByWallet: (walletAddress: string) => apiClient(`/ui/getnfts/${walletAddress}`),
  getById: (id: string) => apiClient(`/ui/getnft/${id}`),
};

// User APIs
export const userAPI = {
  create: (data: any) => apiClient('/ui/createuser', { method: 'POST', body: data }),
  getByWallet: (walletAddress: string) => apiClient(`/ui/getuser/${walletAddress}`),
  update: (walletAddress: string, data: any) => 
    apiClient(`/ui/updateuser/${walletAddress}`, { method: 'PUT', body: data }),
};

// Offline Sync APIs
export const syncAPI = {
  queue: (data: any) => apiClient('/hub/queue', { method: 'POST', body: data }),
  sync: (walletAddress: string) => apiClient(`/hub/sync/${walletAddress}`, { method: 'POST' }),
  getStatus: (walletAddress: string) => apiClient(`/hub/status/${walletAddress}`),
};

// Voice Translation APIs
export const voiceAPI = {
  translate: (data: any) => apiClient('/hub/translate', { method: 'POST', body: data }),
  getLanguages: () => apiClient('/hub/languages'),
};

// Wallet/Disbursement APIs
export const walletAPI = {
  getBalance: (walletAddress: string) => apiClient(`/hub/balance/${walletAddress}`),
  requestPayout: (data: any) => apiClient('/hub/payout', { method: 'POST', body: data }),
  getPayoutMethods: (walletAddress: string) => apiClient(`/hub/payout-methods/${walletAddress}`),
};

// SEVA APIs
export const sevaAPI = {
  getImpact: (walletAddress: string) => apiClient(`/seva/impact/${walletAddress}`),
  getCauses: () => apiClient('/seva/causes'),
};
