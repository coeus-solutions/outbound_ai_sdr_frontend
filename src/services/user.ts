import { config } from '../config';
import { UserInDB } from '../types';

export async function getCurrentUser(token: string): Promise<UserInDB> {
  const response = await fetch(`${config.apiUrl}/api/users/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch current user');
  }

  return response.json();
}

export async function updateUserDetails(token: string, name: string | null = null, oldPassword: string | null = null, newPassword: string | null = null) {
  const response = await fetch(`${config.apiUrl}/api/users/me`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      old_password: oldPassword,
      new_password: newPassword,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to update user details');
  }

  return response.json();
} 