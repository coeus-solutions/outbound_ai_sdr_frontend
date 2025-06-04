import { apiEndpoints } from '../config';

export interface UpdateUserRequest {
  name?: string | null;
  old_password?: string | null;
  new_password?: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  plan_type?: string;
  subscription_status?: string;
  upgrade_message?: string;
  company_roles?: Array<{ company_id: string; role: string }>;
  channels_active?: { [key: string]: boolean };
  subscription?: {
    status: string;
    details: {
      lead_tier: string;
      billing_period_start: string;
      billing_period_end: string;
    };
  };
}

export interface GetUserOptions {
  showSubscriptionDetails?: boolean;
}

export async function getUser(token: string, options: GetUserOptions = {}): Promise<User> {
  const response = await fetch(apiEndpoints.users.me(options), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch user profile');
  }

  return response.json();
}

export async function updateUser(token: string, data: UpdateUserRequest): Promise<User> {
  const response = await fetch(apiEndpoints.users.me(), {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to update user profile');
  }

  return response.json();
} 
