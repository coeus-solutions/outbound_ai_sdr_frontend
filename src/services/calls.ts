import { apiEndpoints } from '../config';
import { CallLog } from '../types';

export async function getCompanyCalls(token: string, companyId: string, campaignId?: string, campaignRunId?: string, leadId?: string): Promise<CallLog[]> {
  const url = new URL(apiEndpoints.companies.calls.list(companyId));
  if (campaignId) {
    url.searchParams.append('campaign_id', campaignId);
  }
  if (campaignRunId) {
    url.searchParams.append('campaign_run_id', campaignRunId);
  }
  if (leadId) {
    url.searchParams.append('lead_id', leadId);
  }

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