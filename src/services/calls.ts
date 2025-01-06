import { apiEndpoints } from '../config';
import { CallLog } from '../types';

export async function getCompanyCalls(token: string, companyId: string): Promise<CallLog[]> {
  const response = await fetch(apiEndpoints.companies.calls.list(companyId), {
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