import { apiEndpoints } from '../config';

export interface EmailLog {
  id: string;
  campaign_id: string;
  lead_id: string;
  sent_at: string;
  campaign_name: string | null;
  lead_name: string | null;
  lead_email: string | null;
}

export async function getCompanyEmails(token: string, companyId: string, campaignId?: string): Promise<EmailLog[]> {
  const url = new URL(apiEndpoints.companies.emails.list(companyId));
  if (campaignId) {
    url.searchParams.append('campaign_id', campaignId);
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch email logs');
  }

  return response.json();
} 