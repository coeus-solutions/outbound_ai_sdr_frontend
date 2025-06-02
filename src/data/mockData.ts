import { Product } from '../services/products';
import { Company } from '../services/companies';
import { Lead } from '../services/leads';

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Acme Corp',
    address: '123 Business Ave, Tech City',
    industry: 'Technology',
  },
  {
    id: '2',
    name: 'Global Industries',
    address: '456 Enterprise St, Commerce City',
    industry: 'Manufacturing',
  },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Enterprise CRM',
    product_name: 'Enterprise CRM',
    company_id: '1',
    total_campaigns: 0,
    total_calls: 0,
    total_positive_calls: 0,
    total_sent_emails: 0,
    total_opened_emails: 0,
    total_replied_emails: 0,
    unique_leads_contacted: 0,
    total_meetings_booked_in_calls: 0,
    total_meetings_booked_in_emails: 0,
  },
  {
    id: '2',
    name: 'Analytics Suite',
    product_name: 'Analytics Suite',
    company_id: '1',
    total_campaigns: 0,
    total_calls: 0,
    total_positive_calls: 0,
    total_sent_emails: 0,
    total_opened_emails: 0,
    total_replied_emails: 0,
    unique_leads_contacted: 0,
    total_meetings_booked_in_calls: 0,
    total_meetings_booked_in_emails: 0,
  },
];

export const mockLeads: Lead[] = [
  {
    id: '1',
    companyId: '1',
    name: 'John Smith',
    company: 'TechCorp Solutions',
    email: 'john.smith@example.com',
    phoneNumber: '+1 (555) 123-4567',
    companySize: '100-500',
    jobTitle: 'Chief Technology Officer',
    companyRevenue: '$10M-$50M',
    companyFacebook: 'facebook.com/techcorp',
    companyTwitter: 'twitter.com/techcorp'
  },
  {
    id: '2',
    companyId: '1',
    name: 'Sarah Johnson',
    company: 'MegaCorp Industries',
    email: 'sarah.j@example.com',
    phoneNumber: '+1 (555) 987-6543',
    companySize: '1000+',
    jobTitle: 'VP of Sales',
    companyRevenue: '$100M+',
    companyFacebook: 'facebook.com/megacorp',
    companyTwitter: 'twitter.com/megacorp'
  },
  {
    id: '3',
    companyId: '1',
    name: 'Michael Chen',
    company: 'Growth Dynamics',
    email: 'mchen@example.com',
    phoneNumber: '+1 (555) 456-7890',
    companySize: '50-100',
    jobTitle: 'Director of Marketing',
    companyRevenue: '$5M-$10M',
    companyFacebook: 'facebook.com/growthco',
    companyTwitter: 'twitter.com/growthco'
  }
];