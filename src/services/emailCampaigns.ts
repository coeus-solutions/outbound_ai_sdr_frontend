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
  product_id: string;
  email_subject: string;
  email_body: string;
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