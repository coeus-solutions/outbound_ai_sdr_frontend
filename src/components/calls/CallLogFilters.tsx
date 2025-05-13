import React, { useState, useEffect } from 'react';
import { Calendar, Filter, Search, ThumbsUp, CalendarCheck } from 'lucide-react';
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
  page?: number;
  limit?: number;
  sentiment?: 'positive' | 'negative';
  has_meeting_booked?: boolean;
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

        const campaignsData = await getCompanyCampaigns(token, companyId, ['call', 'email_and_call'] as const);
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

  const handleSentimentChange = (value: 'positive' | 'negative' | undefined) => {
    onFilterChange({
      ...filters,
      sentiment: value === filters.sentiment ? undefined : value
    });
  };

  const handleMeetingBookedChange = (value: boolean | undefined) => {
    onFilterChange({
      ...filters,
      has_meeting_booked: value === filters.has_meeting_booked ? undefined : value
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center space-x-2">
        <Calendar className="h-5 w-5 text-gray-400" />
        <select
          value={filters.dateRange}
          onChange={(e) => onFilterChange({ ...filters, dateRange: e.target.value as CallLogFilters['dateRange'] })}
          className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="all">All time</option>
          <option value="today">Today</option>
          <option value="week">This week</option>
          <option value="month">This month</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <ThumbsUp className="h-5 w-5 text-gray-400" />
        <select
          value={filters.sentiment || ''}
          onChange={(e) => handleSentimentChange(e.target.value as 'positive' | 'negative' | undefined)}
          className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">All Sentiments</option>
          <option value="positive">Positive</option>
          <option value="negative">Negative</option>
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <CalendarCheck className="h-5 w-5 text-gray-400" />
        <select
          value={filters.has_meeting_booked === undefined ? '' : filters.has_meeting_booked.toString()}
          onChange={(e) => handleMeetingBookedChange(e.target.value === '' ? undefined : e.target.value === 'true')}
          className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">All Meetings</option>
          <option value="true">Meeting Booked</option>
          <option value="false">No Meeting Booked</option>
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