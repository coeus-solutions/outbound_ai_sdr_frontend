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