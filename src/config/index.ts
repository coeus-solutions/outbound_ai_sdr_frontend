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
  subscription: {
    fulfillCheckout: (sessionId: string) => `${config.apiUrl}/api/fulfill_checkout/${sessionId}` as const,
    create: `${config.apiUrl}/api/subscriptions` as const,
    cancel: `${config.apiUrl}/api/subscriptions/cancel` as const,
    change: `${config.apiUrl}/api/subscriptions/change` as const,
  },
  users: {
    me: (options?: { showSubscriptionDetails?: boolean }): string => {
      const baseUrl = `${config.apiUrl}/api/users/me`;
      return options?.showSubscriptionDetails ? `${baseUrl}?show_subscription_details=true` : baseUrl;
    },
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
    checkDuplicateAccount: (companyId: string, accountEmail: string) => `${config.apiUrl}/api/companies/${companyId}/accounts/${accountEmail}/check-duplicate`,
    voiceAgentSettings: (companyId: string) => `${config.apiUrl}/api/companies/${companyId}/voice_agent_settings`,
    invite: (companyId: string) => `${config.apiUrl}/api/companies/${companyId}/invite`,
    users: (companyId: string) => `${config.apiUrl}/api/companies/${companyId}/users`,
    customCalendar: (companyId: string) => `${config.apiUrl}/api/companies/${companyId}/custom_calendar`,
    doNotEmail: {
      upload: (companyId: string) => `${config.apiUrl}/api/companies/${companyId}/do-not-email/upload`,
      list: (companyId: string) => `${config.apiUrl}/api/companies/${companyId}/do-not-email`,
    },
    uploadTasks: {
      list: (companyId: string) => `${config.apiUrl}/api/companies/${companyId}/upload-tasks`,
    },
  },
  calls: {
    details: (callId: string) => `${config.apiUrl}/api/calls/${callId}`,
    webhook: `${config.apiUrl}/api/calls/webhook`,
    retry: (queueId: string) => `${config.apiUrl}/api/call-queues/${queueId}/retry`,
  },
  campaigns: {
    run: (campaignId: string) => `${config.apiUrl}/api/campaigns/${campaignId}/run`,
    testRun: (campaignId: string) => `${config.apiUrl}/api/campaigns/${campaignId}/test-run`,
    details: (campaignId: string) => `${config.apiUrl}/api/campaigns/${campaignId}`,
    emailQueues: {
      list: (campaignRunId: string) => `${config.apiUrl}/api/campaigns/${campaignRunId}/email-queues`,
    },
    callQueues: {
      list: (campaignRunId: string) => `${config.apiUrl}/api/campaigns/${campaignRunId}/call-queues`,
    },
    retry: (campaignRunId: string) => `${config.apiUrl}/api/campaign-runs/${campaignRunId}/retry`,
    leadStatus: (campaignId: string, leadId: string) => `${config.apiUrl}/api/campaigns/${campaignId}/leads/${leadId}/status`,
  },
  generate: {
    campaign: `${config.apiUrl}/api/generate-campaign`,
  },
  uploadHistory: {
    download: (uploadTaskId: string) => `${config.apiUrl}/api/upload-tasks/${uploadTaskId}/download`,
    skippedRows: (uploadTaskId: string) => `${config.apiUrl}/api/upload-tasks/${uploadTaskId}/skipped-rows`,
  },
} as const; 