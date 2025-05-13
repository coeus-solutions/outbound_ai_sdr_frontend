import { apiEndpoints } from '../config';
import { CallLog } from '../types';

export interface CallQueue {
  id: string;
  company_id: string;
  campaign_id: string;
  campaign_run_id: string;
  lead_id: string;
  status: string;
  call_script: string | null;
  priority: number;
  retry_count: number;
  max_retries: number;
  error_message: string | null;
  created_at: string;
  scheduled_for: string | null;
  processed_at: string | null;
  lead_name: string | null;
  lead_phone: string | null;
}

export interface PaginatedCallQueueResponse {
  items: CallQueue[];
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

export interface PaginatedCallResponse {
  items: CallLog[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface CallQueueRetryResponse {
  message: string;
  queue_id: string;
  status: string;
}

export async function getCompanyCalls(
  token: string, 
  companyId: string, 
  queryParams: URLSearchParams
): Promise<PaginatedCallResponse> {
  const url = new URL(apiEndpoints.companies.calls.list(companyId));
  
  // Merge the provided query parameters with the URL
  queryParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch calls');
  }

  const data = await response.json();
  console.log('Raw API response:', data);
  return data;
}

export async function startCall(token: string, companyId: string, leadId: string, productId: string): Promise<CallLog> {
  const url = `${apiEndpoints.companies.calls.start(companyId)}?lead_id=${leadId}&product_id=${productId}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to start call');
  }

  return response.json();
}

export async function getCallDetails(token: string, callId: string): Promise<CallLog> {
  const response = await fetch(apiEndpoints.calls.details(callId), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch call details');
  }

  return response.json();
}

export async function getCallQueues(
  token: string,
  campaignRunId: string,
  page: number = 1,
  limit: number = 20,
  status?: string
): Promise<PaginatedCallQueueResponse> {
  const url = new URL(apiEndpoints.campaigns.callQueues.list(campaignRunId));
  url.searchParams.append('page_number', page.toString());
  url.searchParams.append('limit', limit.toString());
  if (status && status.toLowerCase() !== 'all') {
    url.searchParams.append('status', status.toLowerCase());
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch call queues');
  }

  return response.json();
}

export async function retryFailedCampaignCalls(
  token: string,
  campaignRunId: string
): Promise<RetryResponse> {
  const response = await fetch(`${apiEndpoints.campaigns.retry(campaignRunId)}/call`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    const error = new Error('Failed to retry campaign calls') as any;
    error.response = {
      status: response.status,
      data: data
    };
    throw error;
  }

  return data;
}

export async function retryCallQueueItem(
  token: string,
  queueId: string
): Promise<CallQueueRetryResponse> {
  const response = await fetch(apiEndpoints.calls.retry(queueId), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    const error = new Error('Failed to retry call queue item') as any;
    error.response = {
      status: response.status,
      data: data
    };
    throw error;
  }

  return data;
} 