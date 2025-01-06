import { apiEndpoints } from '../config';

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone_number: string;
  company_size: string | null;
  job_title: string | null;
  company_facebook: string | null;
  company_twitter: string | null;
  company_revenue: string | null;
  company_id: string;
}

export async function getLeads(token: string, companyId: string): Promise<Lead[]> {
  const response = await fetch(apiEndpoints.companies.leads.list(companyId), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch leads');
  }

  return response.json();
}

export async function uploadLeads(token: string, companyId: string, file: File): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(apiEndpoints.companies.leads.upload(companyId), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload leads');
  }
} 