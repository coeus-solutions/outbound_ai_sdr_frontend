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
    login: `${config.apiUrl}/api/auth/login`,
    signup: `${config.apiUrl}/api/auth/signup`,
    resetPassword: `${config.apiUrl}/api/auth/reset-password`,
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
      list: (companyId: string) => `${config.apiUrl}/api/companies/${companyId}/email-campaigns`,
    },
  },
  calls: {
    details: (callId: string) => `${config.apiUrl}/api/calls/${callId}`,
    webhook: `${config.apiUrl}/api/calls/webhook`,
  },
  emailCampaigns: {
    run: (campaignId: string) => `${config.apiUrl}/api/email-campaigns/${campaignId}/run`,
  },
  generate: {
    campaign: `${config.apiUrl}/api/generate-campaign`,
  },
} as const; 