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
    inviteToken: (token: string) => `${config.apiUrl}/api/auth/invite-token/${token}` as const,
    invitePassword: `${config.apiUrl}/api/auth/invite-password` as const,
  },
  users: {
    me: `${config.apiUrl}/api/users/me` as const,
  },
  companies: {
    list: (showStats?: boolean) => {
      const url = `${config.apiUrl}/api/companies`;
      return showStats ? `${url}?show_stats=true` : url;
    },
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
    campaignRuns: {
      list: (companyId: string) => `${config.apiUrl}/api/companies/${companyId}/campaign-runs`,
    },
    accountCredentials: (companyId: string) => `${config.apiUrl}/api/companies/${companyId}/account-credentials`,
    voiceAgentSettings: (companyId: string) => `${config.apiUrl}/api/companies/${companyId}/voice_agent_settings`,
    invite: (companyId: string) => `${config.apiUrl}/api/companies/${companyId}/invite`,
    users: (companyId: string) => `${config.apiUrl}/api/companies/${companyId}/users`,
    doNotEmail: {
      upload: (companyId: string) => `${config.apiUrl}/api/companies/${companyId}/do-not-email/upload`,
      list: (companyId: string) => `${config.apiUrl}/api/companies/${companyId}/do-not-email`,
    },
  },
  calls: {
    details: (callId: string) => `${config.apiUrl}/api/calls/${callId}`,
    webhook: `${config.apiUrl}/api/calls/webhook`,
  },
  campaigns: {
    run: (campaignId: string) => `${config.apiUrl}/api/campaigns/${campaignId}/run`,
    testRun: (campaignId: string) => `${config.apiUrl}/api/campaigns/${campaignId}/test-run`,
    emailQueues: {
      list: (campaignRunId: string) => `${config.apiUrl}/api/campaigns/${campaignRunId}/email-queues`,
    },
    retry: (campaignRunId: string) => `${config.apiUrl}/api/campaign-runs/${campaignRunId}/retry`,
  },
  generate: {
    campaign: `${config.apiUrl}/api/generate-campaign`,
  },
} as const; 