import { apiEndpoints } from '../config';

export interface EmailLog {
  id: string;
  campaign_id: string;
  lead_id: string;
  sent_at: string;
  campaign_name: string | null;
  lead_name: string | null;
  lead_email: string | null;
  has_opened: boolean;
  has_replied: boolean;
  has_meeting_booked: boolean;
}

export interface EmailHistory {
  message_id: string | null;
  email_subject: string | null;
  email_body: string | null;
  sender_type: string;
  sent_at: string;
  created_at: string;
  from_name: string | null;
  from_email: string | null;
  to_email: string | null;
}

export interface PaginatedEmailLogResponse {
  items: EmailLog[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export async function getCompanyEmails(
  token: string,
  companyId: string,
  campaignId?: string,
  leadId?: string,
  campaignRunId?: string,
  page: number = 1,
  pageSize: number = 10,
  status?: 'opened' | 'replied' | 'meeting_booked'
): Promise<PaginatedEmailLogResponse> {
  const url = new URL(`${apiEndpoints.companies.emails.list(companyId)}`);
  
  if (campaignId) {
    url.searchParams.append('campaign_id', campaignId);
  }
  
  if (leadId) {
    url.searchParams.append('lead_id', leadId);
  }
  
  if (campaignRunId) {
    url.searchParams.append('campaign_run_id', campaignRunId);
  }

  if (status) {
    url.searchParams.append('status', status);
  }
  
  url.searchParams.append('page_number', page.toString());
  url.searchParams.append('limit', pageSize.toString());
  
  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch company emails');
  }
  
  return response.json();
}

export async function getEmailHistory(token: string, companyId: string, emailLogId: string): Promise<EmailHistory[]> {
  const response = await fetch(`${apiEndpoints.companies.emails.list(companyId)}/${emailLogId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch email history');
  }

  return response.json();
} 