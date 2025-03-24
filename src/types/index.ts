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
  lead_phone_number: string;
  product_id: string;
  campaign_name: string;
  created_at: string;
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

export interface UserInDB {
  email: string;
  id: string;
  name: string | null;
  verified: boolean;
  created_at: string;
  company_roles: UserCompanyRole[] | null;
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