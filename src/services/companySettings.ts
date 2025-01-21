import { apiEndpoints } from '../config';

export interface AccountCredentials {
  account_email: string;
  account_password: string;
  type: string;
}

export async function updateAccountCredentials(token: string, companyId: string, credentials: AccountCredentials): Promise<void> {
  const response = await fetch(apiEndpoints.companies.accountCredentials(companyId), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Failed to update account credentials');
  }
}

export async function getAccountCredentials(token: string, companyId: string): Promise<AccountCredentials> {
  const response = await fetch(apiEndpoints.companies.accountCredentials(companyId), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch account credentials');
  }

  return response.json();
} 