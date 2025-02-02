const getEnvironment = () => {
  return import.meta.env.MODE || 'development';
};

const getApiUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    console.warn(`API URL not found for environment: ${getEnvironment()}`);
    return 'http://localhost:8000'; // fallback for development
  }
  return apiUrl;
};

export const config = {
  environment: getEnvironment(),
  apiUrl: getApiUrl(),
  isDevelopment: getEnvironment() === 'development',
  isProduction: getEnvironment() === 'production',
} as const;

export const apiEndpoints = {
  auth: {
    login: `${config.apiUrl}/api/auth/login` as const,
    signup: `${config.apiUrl}/api/auth/signup` as const,
    resetPassword: `${config.apiUrl}/api/auth/reset-password` as const,
    forgotPassword: `${config.apiUrl}/api/auth/forgot-password` as const,
    verify: `${config.apiUrl}/api/auth/verify` as const,
  },
  users: {
    me: `${config.apiUrl}/api/users/me` as const,
  },
  companies: {
    list: `${config.apiUrl}/api/companies`,
    create: `${config.apiUrl}/api/companies`,
    products: (companyId: string) => `${config.apiUrl}/api/companies/${companyId}/products`,
    leads: {
      list: (companyId: string) => `${config.apiUrl}/api/companies/${companyId}/leads`,
      upload: (companyId: string) => `${config.apiUrl}/api/companies/${companyId}/leads/upload`,
    },
    calls: {
      start: (companyId: string) => `${config.apiUrl}/api/companies/${companyId}/calls/start`,
      list: (companyId: string) => `${config.apiUrl}/api/companies/${companyId}/calls`,
    },
    emailCampaigns: {
      list: (companyId: string) => `${config.apiUrl}/api/companies/${companyId}/campaigns`,
    },
    emails: {
      list: (companyId: string) => `${config.apiUrl}/api/companies/${companyId}/emails`,
    },
    accountCredentials: (companyId: string) => `${config.apiUrl}/api/companies/${companyId}/account-credentials`,
  },
  calls: {
    details: (callId: string) => `${config.apiUrl}/api/calls/${callId}`,
    webhook: `${config.apiUrl}/api/calls/webhook`,
  },
  campaigns: {
    run: (campaignId: string) => `${config.apiUrl}/api/campaigns/${campaignId}/run`,
  },
  generate: {
    campaign: `${config.apiUrl}/api/generate-campaign`,
  },
} as const; 