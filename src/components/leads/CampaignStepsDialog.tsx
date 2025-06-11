import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getToken } from '../../utils/auth';
import { getCompanyCampaigns, Campaign } from '../../services/emailCampaigns';
import { useToast } from '../../context/ToastContext';

interface CampaignStepsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
}

export function CampaignStepsDialog({ isOpen, onClose, companyId }: CampaignStepsDialogProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen && companyId) {
      fetchCampaigns();
    }
  }, [isOpen, companyId]);

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      if (!token) {
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      const campaignsData = await getCompanyCampaigns(token, companyId);
      setCampaigns(campaignsData);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      showToast('Failed to fetch campaigns', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Campaign Steps</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="campaign" className="block text-sm font-medium text-gray-700 mb-1">
                Select Campaign
              </label>
              <select
                id="campaign"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                defaultValue=""
              >
                <option value="" disabled>Select a campaign</option>
                {isLoading ? (
                  <option value="" disabled>Loading campaigns...</option>
                ) : (
                  campaigns.map((campaign) => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 