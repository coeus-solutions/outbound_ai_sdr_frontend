// Update CallLog type to include companyId
export interface CallLog {
  id: string;
  companyId: string;
  leadId: string;
  leadName: string;
  productId: string;
  productName: string;
  timestamp: string;
  duration: number; // in seconds
  sentiment: 'positive' | 'neutral' | 'negative';
  summary: string;
}