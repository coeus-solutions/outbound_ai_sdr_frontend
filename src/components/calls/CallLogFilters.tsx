import React, { useState, useEffect } from 'react';
import { Calendar, Filter } from 'lucide-react';
import { getCompanyCampaigns, Campaign } from '../../services/emailCampaigns';
import { getToken } from '../../utils/auth';

interface CallLogFilters {
  dateRange: 'all' | 'today' | 'week' | 'month';
  sentiment?: 'positive' | 'negative' | 'neutral';
  campaign_id?: string;
}

interface CallLogFiltersProps {
  filters: CallLogFilters;
  onFilterChange: (filters: CallLogFilters) => void;
  companyId: string;
}

export function CallLogFilters({ filters, onFilterChange, companyId }: CallLogFiltersProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(false);
      }
    }

    fetchCampaigns();
  }, [companyId]);

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
          disabled={isLoading}
        >
          <option value="">All campaigns</option>
          {campaigns.map((campaign) => (
            <option key={campaign.id} value={campaign.id} className="whitespace-normal">
              {campaign.name}
            </option>
          ))}
        </select>
      </div>

      <select
        value={filters.sentiment || ''}
        onChange={(e) => onFilterChange({ 
          ...filters, 
          sentiment: e.target.value as CallLogFilters['sentiment'] || undefined 
        })}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option value="">All sentiments</option>
        <option value="positive">Positive</option>
        <option value="neutral">Neutral</option>
        <option value="negative">Negative</option>
      </select>
    </div>
  );
}