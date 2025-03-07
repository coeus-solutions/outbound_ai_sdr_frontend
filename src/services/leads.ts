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
  lead_source: string | null;
  education: string | null;
  personal_linkedin_url: string | null;
  country: string | null;
  city: string | null;
  state: string | null;
  mobile: string | null;
  direct_phone: string | null;
  office_phone: string | null;
  hq_location: string | null;
  website: string | null;
  headcount: number | null;
  industries: string[] | null;
  department: string | null;
  company_address: string | null;
  company_city: string | null;
  company_zip: string | null;
  company_state: string | null;
  company_country: string | null;
  company_linkedin_url: string | null;
  company_type: string | null;
  company_description: string | null;
  technologies: string[] | null;
  financials: { value: string } | null;
  company_founded_year: number | null;
  seniority: string | null;
  enriched_data?: {
    PAIN_POINTS?: Array<{
      pain_point: string;
      explanation: string;
    }> | string[];
    BUYING_TRIGGERS?: Array<{
      trigger: string;
      explanation: string;
    }> | string[];
    BUSINESS_OVERVIEW?: {
      description?: string;
      company_highlights?: string[];
      products_and_services?: string[];
      company_name?: string;
      business_model?: string;
      market_position?: string;
      key_products_services?: string[];
    };
    INDUSTRY_CHALLENGES?: {
      challenges?: Array<{
        impact: string;
        challenge: string;
      }>;
      business_impact?: string;
    } | string[];
    PROSPECT_PROFESSIONAL_INTERESTS?: Array<{
      interest: string;
      explanation: string;
    }> | string[];
  } | null;
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
  financials?: { value: string };
  company_founded_year?: number;
  seniority?: string;
  hiring_positions?: Record<string, unknown>[];
  location_move?: Record<string, unknown>;
  job_change?: Record<string, unknown>;
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
  const response = await fetch(`${apiEndpoints.companies.leads.list(companyId)}/bulk-delete`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ lead_ids: leadIds }),
  });

  if (!response.ok) {
    throw new Error('Failed to delete leads');
  }
}

export async function enrichLeadData(token: string, companyId: string, leadId: string): Promise<LeadDetail> {
  const response = await fetch(`${apiEndpoints.companies.leads.list(companyId)}/${leadId}/enrich`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to enrich lead data');
  }

  const result = await response.json();
  return result.data;
} 