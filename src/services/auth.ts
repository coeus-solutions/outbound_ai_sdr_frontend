import { apiEndpoints } from '../config';

interface InviteTokenResponse {
  email: string;
}

interface InvitePasswordRequest {
  token: string;
  password: string;
}

interface InvitePasswordResponse {
  message: string;
}

interface Token {
  access_token: string;
  token_type: string;
}

export async function verifyInviteToken(token: string): Promise<InviteTokenResponse> {
  const response = await fetch(apiEndpoints.auth.inviteToken(token), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to verify invite token');
  }

  return response.json();
}

export async function setupInvitePassword(token: string, password: string): Promise<InvitePasswordResponse> {
  const requestBody: InvitePasswordRequest = {
    token,
    password,
  };

  const response = await fetch(apiEndpoints.auth.invitePassword, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to set up password');
  }

  return response.json();
} 