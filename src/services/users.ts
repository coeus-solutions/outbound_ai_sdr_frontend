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
}

export async function getUser(token: string): Promise<User> {
  const response = await fetch(apiEndpoints.users.me, {
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
  const response = await fetch(apiEndpoints.users.me, {
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
