import { apiEndpoints } from '../config';

export interface Campaign {
  id: string;
  name: string;
  description: string | null;
  type: 'email' | 'call';
  product_id: string;
  company_id: string;
  created_at: string;
}

interface CampaignsResponse {
  data: Campaign[];
}

export interface CampaignCreate {
  name: string;
  description?: string;
  type: 'email' | 'call';
  product_id: string;
}

export interface RunCampaignResponse {
  message: string;
  campaign_id: string;
  status: string;
}

export async function getCompanyCampaigns(token: string, companyId: string, type?: 'email' | 'call' | 'all'): Promise<Campaign[]> {
  const url = new URL(apiEndpoints.companies.emailCampaigns.list(companyId));
  if (type) {
    url.searchParams.append('type', type);
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch campaigns');
  }

  return response.json();
}

export async function createCampaign(token: string, companyId: string, campaign: CampaignCreate): Promise<Campaign> {
  const response = await fetch(apiEndpoints.companies.emailCampaigns.list(companyId), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(campaign),
  });

  if (!response.ok) {
    throw new Error('Failed to create campaign');
  }

  return response.json();
}

export async function runCampaign(token: string, campaignId: string): Promise<RunCampaignResponse> {
  const response = await fetch(apiEndpoints.campaigns.run(campaignId), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    const error = new Error('Failed to run campaign') as any;
    error.response = {
      status: response.status,
      data: data
    };
    throw error;
  }

  return data;
} 