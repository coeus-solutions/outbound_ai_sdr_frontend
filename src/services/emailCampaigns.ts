import { apiEndpoints } from '../config';

export interface Campaign {
  id: string;
  name: string;
  description: string | null;
  type: 'email' | 'call' | 'email_and_call';
  product_id: string;
  company_id: string;
  created_at: string;
  template?: string;
}

interface CampaignsResponse {
  data: Campaign[];
}

export interface CampaignCreate {
  name: string;
  description?: string;
  type: 'email' | 'call' | 'email_and_call';
  product_id: string;
  template?: string;
  number_of_reminders?: number;
  days_between_reminders?: number;
  auto_reply_enabled?: boolean;
  call_trigger?: 'after_email_sent' | 'when_opened';
  stop_on_any_reply?: boolean;
}

export interface RunCampaignResponse {
  message: string;
  campaign_id: string;
  status: string;
}

export interface CampaignRun {
  id: string;
  campaign_id: string;
  run_at: string;
  leads_total: number;
  leads_processed: number;
  status: string;
  created_at: string;
  campaigns: {
    name: string;
    type: 'email' | 'call' | 'email_and_call';
  };
}

export interface TestRunCampaignResponse {
  message: string;
  campaign_id: string;
  status: string;
}

export interface EmailQueue {
  id: string;
  company_id: string;
  campaign_id: string;
  campaign_run_id: string;
  lead_id: string;
  subject: string;
  email_body: string;
  status: string;
  priority: number;
  retry_count: number;
  max_retries: number;
  error_message: string | null;
  created_at: string;
  scheduled_for: string | null;
  processed_at: string | null;
  lead_name: string | null;
  lead_email: string | null;
}

export interface PaginatedEmailQueueResponse {
  items: EmailQueue[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface RetryResponse {
  message: string;
  campaign_run_id: string;
  status: string;
}

export async function getCompanyCampaigns(
  token: string, 
  companyId: string, 
  type?: ('email' | 'call' | 'email_and_call' | 'all') | Array<'email' | 'call' | 'email_and_call' | 'all'>
): Promise<Campaign[]> {
  const url = new URL(apiEndpoints.companies.emailCampaigns.list(companyId));
  if (type) {
    if (Array.isArray(type)) {
      type.forEach(t => url.searchParams.append('type', t));
    } else {
      url.searchParams.append('type', type);
    }
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

export async function getCampaignRuns(token: string, companyId: string, campaignId?: string): Promise<CampaignRun[]> {
  let url = apiEndpoints.companies.campaignRuns.list(companyId);
  if (campaignId) {
    url += `?campaign_id=${campaignId}`;
  }

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch campaign runs');
  }

  return response.json();
}

export async function testRunCampaign(token: string, campaignId: string, leadContact: string): Promise<TestRunCampaignResponse> {
  const response = await fetch(apiEndpoints.campaigns.testRun(campaignId), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ lead_contact: leadContact }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    const error = new Error('Failed to run test campaign') as any;
    error.response = {
      status: response.status,
      data: data
    };
    throw error;
  }

  return data;
}

export async function getEmailQueues(
  token: string,
  campaignRunId: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedEmailQueueResponse> {
  const url = new URL(`${apiEndpoints.campaigns.emailQueues.list(campaignRunId)}`);
  url.searchParams.append('page_number', page.toString());
  url.searchParams.append('limit', limit.toString());

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch email queues');
  }

  return response.json();
}

export async function retryFailedCampaignEmails(
  token: string,
  campaignRunId: string
): Promise<RetryResponse> {
  const response = await fetch(apiEndpoints.campaigns.retry(campaignRunId), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    const error = new Error('Failed to retry campaign emails') as any;
    error.response = {
      status: response.status,
      data: data
    };
    throw error;
  }

  return data;
} 