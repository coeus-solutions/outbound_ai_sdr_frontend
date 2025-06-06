// Update CallLog type to include companyId
export interface Transcript {
  id: number;
  text: string;
  user: 'assistant' | 'user' | 'agent-action';
  created_at: string;
}

export interface CallLog {
  id: string;
  company_id: string;
  lead_id: string;
  lead_name: string;
  lead_phone_number: string | null;
  product_id: string;
  campaign_name: string;
  created_at: string;
  last_called_at: string;
  duration: number; // in seconds
  sentiment: 'positive' | 'negative' | 'not_connected';
  summary: string;
  has_meeting_booked: boolean;
  transcripts?: Transcript[];
  recording_url?: string;
  failure_reason?: string;
}

export interface UserCompanyRole {
  company_id: string;
  role: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  first_name?: string;
  last_name?: string;
  verified: boolean;
  created_at: string;
  company_roles: UserCompanyRole[] | null;
  subscription?: {
    plan_type: 'fixed' | 'performance';
    lead_tier: number;
    channels_active: string[];
  };
  plan_type?: 'fixed' | 'performance' | 'trial';
  lead_tier?: number;
  channels_active?: {
    email: boolean;
    phone: boolean;
    linkedin: boolean;
    whatsapp: boolean;
    [key: string]: boolean;
  };
  subscription_status?: string;
  upgrade_message?: string;
  billing_period_start?: string;
  billing_period_end?: string;
  subscription_details?: {
    has_subscription: boolean;
    subscription_items: Array<{
      name: string;
      quantity: number;
      price: string;
      currency: string;
      interval: string;
      usage_type: 'licensed' | 'metered';
    }>;
  };
}

export interface VoiceAgentSettings {
  enabled: boolean;
  voice_id?: string;
  language?: string;
  accent?: string;
  speaking_rate?: number;
  pitch?: number;
  voice?: string;
  background_track?: string;
  prompt?: string;
  call_from_number?: string;
  transfer_phone_number?: string;
  agent_name?: string;
  record?: boolean;
}

export type PartnershipType = "RESELLER" | "REFERRAL" | "TECHNOLOGY";

export type CompanySize = "1-10" | "11-50" | "51-200" | "201-500" | "501+";

export type ApplicationStatus = "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED";

export interface PartnerApplication {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  partnershipType: PartnershipType;
  companySize: CompanySize;
  industry: string;
  motivation: string;
}