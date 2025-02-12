// Update CallLog type to include companyId
export interface CallLog {
  id: string;
  company_id: string;
  lead_id: string;
  lead_name: string;
  lead_phone_number: string;
  product_id: string;
  campaign_name: string;
  created_at: string;
  duration: number; // in seconds
  sentiment: 'positive' | 'neutral' | 'negative';
  summary: string;
}

export interface UserCompanyRole {
  company_id: string;
  role: string;
}

export interface UserInDB {
  email: string;
  id: string;
  name: string | null;
  verified: boolean;
  created_at: string;
  company_roles: UserCompanyRole[] | null;
}