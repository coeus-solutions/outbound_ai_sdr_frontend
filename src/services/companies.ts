import { apiEndpoints, config } from '../config';

export interface Company {
  id: string;
  name: string;
  address?: string;
  industry?: string;
  website?: string;
  user_id: string;
  cronofy_provider?: string;
  cronofy_linked_email?: string;
  cronofy_default_calendar_name?: string;
  cronofy_default_calendar_id?: string;
  account_email?: string;
  products_services?: string;
  background?: string;
  overview?: string;
  products?: Array<{
    id: string;
    name: string;
    total_campaigns: number;
  }>;
}

export interface CompanyCreate {
  name: string;
  website: string;
  address?: string;
  industry?: string;
}

export interface CronofyAuthResponse {
  message: string;
}

export interface CompanyUserResponse {
  name: string | null;
  email: string;
  role: string;
  user_company_profile_id: string;
}

export async function getCompanies(token: string): Promise<Company[]> {
  const response = await fetch(apiEndpoints.companies.list(true), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch companies');
  }

  return response.json();
}

export async function getCompanyById(token: string, companyId: string): Promise<Company> {
  const response = await fetch(`${apiEndpoints.companies.list()}/${companyId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch company details');
  }

  return response.json();
}

export async function createCompany(token: string, company: CompanyCreate): Promise<Company> {
  const response = await fetch(apiEndpoints.companies.create, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(company),
  });

  if (!response.ok) {
    throw new Error('Failed to create company');
  }

  return response.json();
}

export async function cronofyAuth(token: string, companyId: string, code: string, redirectUrl: string): Promise<CronofyAuthResponse> {
  const response = await fetch(`${apiEndpoints.companies.list()}/${companyId}/cronofy-auth?code=${encodeURIComponent(code)}&redirect_url=${encodeURIComponent(redirectUrl)}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = new Error('Failed to authenticate with Cronofy') as any;
    error.response = response;
    throw error;
  }

  return response.json();
}

export async function disconnectCalendar(token: string, companyId: string): Promise<void> {
  const response = await fetch(`${apiEndpoints.companies.list()}/${companyId}/calendar`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
}

export async function deleteCompany(token: string, companyId: string): Promise<void> {
  const response = await fetch(`${apiEndpoints.companies.list()}/${companyId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete company');
  }
}

export async function getCompanyUsers(token: string, companyId: string): Promise<CompanyUserResponse[]> {
  const response = await fetch(apiEndpoints.companies.users(companyId), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch company users');
  }

  return response.json();
}

export async function deleteUserCompanyProfile(token: string, userCompanyProfileId: string): Promise<void> {
  const response = await fetch(`${config.apiUrl}/api/user_company_profile/${userCompanyProfileId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to delete user from company');
  }
} 