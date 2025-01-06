// Update CallLog type to include companyId
export interface CallLog {
  id: string;
  company_id: string;
  lead_id: string;
  lead_name: string;
  product_id: string;
  product_name: string;
  created_at: string;
  duration: number; // in seconds
  sentiment: 'positive' | 'neutral' | 'negative';
  summary: string;
}