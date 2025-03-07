import { apiEndpoints } from '../config';

export interface Lead {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  phone_number: string;
  company_size: string | null;
  job_title: string | null;
  company_facebook: string | null;
  company_twitter: string | null;
  company_revenue: string | null;
  company_id: string;
}

export interface LeadDetail extends Lead {
  first_name: string | null;
  last_name: string | null;
  lead_source: string;
  education: string;
  personal_linkedin_url: string;
  country: string;
  city: string;
  state: string;
  mobile: string;
  direct_phone: string;
  office_phone: string | null;
  hq_location: string | null;
  website: string;
  headcount: number;
  industries: string[];
  department: string;
  company_address: string;
  company_city: string;
  company_zip: string;
  company_state: string;
  company_country: string;
  company_linkedin_url: string;
  company_type: string;
  company_description: string;
  technologies: string[];
  financials: { value: string };
  company_founded_year: number;
  seniority: string;
}

export interface CreateLeadPayload {
  name: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  company?: string;
  phone_number?: string;
  company_size?: string;
  job_title?: string;
  lead_source?: string;
  education?: string;
  personal_linkedin_url?: string;
  country?: string;
  city?: string;
  state?: string;
  mobile?: string;
  direct_phone?: string;
  office_phone?: string;
  hq_location?: string;
  website?: string;
  headcount?: number;
  industries?: string[];
  department?: string;
  sic_code?: string;
  isic_code?: string;
  naics_code?: string;
  company_address?: string;
  company_city?: string;
  company_zip?: string;
  company_state?: string;
  company_country?: string;
  company_hq_address?: string;
  company_hq_city?: string;
  company_hq_zip?: string;
  company_hq_state?: string;
  company_hq_country?: string;
  company_linkedin_url?: string;
  company_type?: string;
  company_description?: string;
  technologies?: string[];
  financials?: any;
  company_founded_year?: number;
  seniority?: string;
  hiring_positions?: any[];
  location_move?: any;
  job_change?: any;
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

export async function createLead(token: string, companyId: string, leadData: CreateLeadPayload): Promise<Lead> {
  const response = await fetch(apiEndpoints.companies.leads.list(companyId), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(leadData),
  });

  if (!response.ok) {
    throw new Error('Failed to create lead');
  }

  return response.json();
}

export async function getLeadDetails(token: string, companyId: string, leadId: string): Promise<LeadDetail> {
  const response = await fetch(`${apiEndpoints.companies.leads.list(companyId)}/${leadId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch lead details');
  }

  const result = await response.json();
  return result.data;
}

export interface UploadLeadsResponse {
  message: string;
  leads_saved: number;
  leads_skipped: number;
  unmapped_headers: string[];
}

export async function uploadLeads(token: string, companyId: string, file: File): Promise<UploadLeadsResponse> {
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

  return response.json();
}

export async function deleteLead(token: string, companyId: string, leadId: string): Promise<void> {
  const response = await fetch(`${apiEndpoints.companies.leads.list(companyId)}/${leadId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete lead');
  }
}

export async function deleteLeads(token: string, companyId: string, leadIds: string[]): Promise<void> {
  // Delete leads one by one
  const errors: Error[] = [];
  
  for (const leadId of leadIds) {
    try {
      await deleteLead(token, companyId, leadId);
    } catch (error) {
      errors.push(error as Error);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Failed to delete ${errors.length} leads`);
  }
} 