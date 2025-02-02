import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { getCompanyCampaigns, Campaign } from '../../services/emailCampaigns';
import { getToken } from '../../utils/auth';
import type { EmailLogFilters } from '../../hooks/useEmailLogs';

interface EmailLogFiltersProps {
  filters: EmailLogFilters;
  onFilterChange: (filters: EmailLogFilters) => void;
  companyId: string;
}

export function EmailLogFilters({ filters, onFilterChange, companyId }: EmailLogFiltersProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const token = getToken();
        if (!token) return;

        const campaignsData = await getCompanyCampaigns(token, companyId, 'email');
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
    </div>
  );
} 