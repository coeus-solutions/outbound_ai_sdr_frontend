import { apiEndpoints } from '../config';

export interface EmailCampaign {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  product_id: string;
  email_subject: string;
  email_body: string;
  created_at: string;
}

interface EmailCampaignsResponse {
  data: EmailCampaign[];
}

export interface EmailCampaignCreate {
  name: string;
  description?: string;
  email_subject: string;
  email_body: string;
}

export interface RunCampaignResponse {
  message: string;
  campaign_id: string;
  status: string;
}

export async function getCompanyEmailCampaigns(token: string, companyId: string): Promise<EmailCampaign[]> {
  const response = await fetch(apiEndpoints.companies.emailCampaigns.list(companyId), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch email campaigns');
  }

  const responseData = await response.json();
  return responseData;
}

export async function createEmailCampaign(token: string, companyId: string, campaign: EmailCampaignCreate): Promise<EmailCampaign> {
  const response = await fetch(apiEndpoints.companies.emailCampaigns.list(companyId), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(campaign),
  });

  if (!response.ok) {
    throw new Error('Failed to create email campaign');
  }

  return response.json();
}

export async function runEmailCampaign(token: string, campaignId: string): Promise<RunCampaignResponse> {
  const response = await fetch(apiEndpoints.emailCampaigns.run(campaignId), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    const error = new Error('Failed to run email campaign') as any;
    error.response = {
      status: response.status,
      data: data
    };
    throw error;
  }

  return data;
} 