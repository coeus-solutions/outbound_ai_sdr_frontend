import { apiEndpoints } from '../config';

export interface Company {
  id: string;
  name: string;
  address?: string;
  industry?: string;
  user_id: string;
}

export interface CompanyCreate {
  name: string;
  address?: string;
  industry?: string;
}

export interface CronofyAuthResponse {
  message: string;
}

export async function getCompanies(token: string): Promise<Company[]> {
  const response = await fetch(apiEndpoints.companies.list, {
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
  const response = await fetch(`${apiEndpoints.companies.list}/${companyId}`, {
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
  const response = await fetch(`${apiEndpoints.companies.list}/${companyId}/cronofy-auth?code=${encodeURIComponent(code)}&redirect_url=${encodeURIComponent(redirectUrl)}`, {
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