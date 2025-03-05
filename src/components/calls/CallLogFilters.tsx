import React, { useState, useEffect } from 'react';
import { Calendar, Filter, Search } from 'lucide-react';
import { getCompanyCampaigns, Campaign } from '../../services/emailCampaigns';
import { getToken } from '../../utils/auth';
import { Lead } from '../../services/leads';
import { Autocomplete } from '../shared/Autocomplete';
import { useDebounce } from '../../hooks/useDebounce';
import { apiEndpoints } from '../../config';

interface CallLogFilters {
  dateRange: 'all' | 'today' | 'week' | 'month';
  campaign_id?: string;
  lead_id?: string;
}

interface CallLogFiltersProps {
  filters: CallLogFilters;
  onFilterChange: (filters: CallLogFilters) => void;
  companyId: string;
}

export function CallLogFilters({ filters, onFilterChange, companyId }: CallLogFiltersProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const token = getToken();
        if (!token) return;

        const campaignsData = await getCompanyCampaigns(token, companyId, 'call');
        setCampaigns(campaignsData);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setIsLoadingCampaigns(false);
      }
    }

    fetchCampaigns();
  }, [companyId]);

  useEffect(() => {
    async function searchLeads() {
      if (!debouncedSearchTerm) {
        setLeads([]);
        return;
      }

      try {
        setIsLoadingLeads(true);
        const token = getToken();
        if (!token) return;

        const url = new URL(apiEndpoints.companies.leads.list(companyId));
        url.searchParams.append('search_term', debouncedSearchTerm);
        url.searchParams.append('page_number', '1');
        url.searchParams.append('limit', '20');

        const response = await fetch(url.toString(), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch leads');
        }

        const data = await response.json();
        setLeads(data.items);
      } catch (error) {
        console.error('Error searching leads:', error);
      } finally {
        setIsLoadingLeads(false);
      }
    }

    searchLeads();
  }, [companyId, debouncedSearchTerm]);

  const handleLeadChange = (lead: Lead | null) => {
    setSelectedLead(lead);
    onFilterChange({ ...filters, lead_id: lead?.id });
  };

  const handleLeadSearch = (term: string) => {
    setSearchTerm(term);
    if (!term) {
      setSelectedLead(null);
      onFilterChange({ ...filters, lead_id: undefined });
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Calendar className="h-5 w-5 text-gray-400" />
        <select
          value={filters.dateRange}
          onChange={(e) => onFilterChange({ ...filters, dateRange: e.target.value as CallLogFilters['dateRange'] })}
          className="block min-w-[150px] pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="all">All time</option>
          <option value="today">Today</option>
          <option value="week">This week</option>
          <option value="month">This month</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <Filter className="h-5 w-5 text-gray-400" />
        <select
          value={filters.campaign_id || ''}
          onChange={(e) => onFilterChange({ ...filters, campaign_id: e.target.value || undefined })}
          className="block min-w-[250px] pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          disabled={isLoadingCampaigns}
        >
          <option value="">All campaigns</option>
          {campaigns.map((campaign) => (
            <option key={campaign.id} value={campaign.id} className="whitespace-normal">
              {campaign.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-gray-400" />
        <Autocomplete<Lead>
          items={leads}
          value={selectedLead}
          onChange={handleLeadChange}
          onSearch={handleLeadSearch}
          getItemLabel={(lead) => lead.name}
          getItemValue={(lead) => lead.id}
          getItemSubLabel={(lead) => lead.phone_number}
          placeholder="Search leads..."
          isLoading={isLoadingLeads}
          className="min-w-[300px]"
        />
      </div>
    </div>
  );
}