import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, CheckCircle2, Clock, AlertCircle, XCircle, Mail, ChevronDown } from 'lucide-react';
import { getToken } from '../../utils/auth';
import { getCompanyCampaigns, Campaign, getCampaignLeadStatus, CampaignLeadStatus } from '../../services/emailCampaigns';
import { useToast } from '../../context/ToastContext';
import { formatDateTime } from '../../utils/formatters';

interface CampaignStepsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  leadId: string;
  leadName: string;
}

export function CampaignStepsDialog({ isOpen, onClose, companyId, leadId, leadName }: CampaignStepsDialogProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  const [campaignStatus, setCampaignStatus] = useState<CampaignLeadStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
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

  const fetchCampaignStatus = async (campaignId: string) => {
    try {
      setIsLoadingStatus(true);
      const token = getToken();
      if (!token) {
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      const status = await getCampaignLeadStatus(token, campaignId, leadId);
      setCampaignStatus(status);
    } catch (error) {
      console.error('Error fetching campaign status:', error);
      showToast('Failed to fetch campaign status', 'error');
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const handleCampaignChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const campaignId = e.target.value;
    setSelectedCampaign(campaignId);
    if (campaignId) {
      fetchCampaignStatus(campaignId);
    } else {
      setCampaignStatus(null);
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatStepType = (stepType: string) => {
    return stepType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      <div className="absolute inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl h-[80vh] flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Campaign Steps for Lead "{leadName}"</h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="campaign"
                    className="form-input appearance-none"
                    value={selectedCampaign}
                    onChange={handleCampaignChange}
                  >
                    <option value="">Select a campaign</option>
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

              {isLoadingStatus ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : !selectedCampaign ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <div className="max-w-sm text-center">
                    <p className="text-lg font-medium mb-2">View Campaign Progress</p>
                    <p className="text-sm">Select a campaign from the dropdown above to view its steps and track the progress of this lead through the campaign sequence.</p>
                  </div>
                </div>
              ) : selectedCampaign && campaignStatus?.steps?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <AlertCircle className="h-12 w-12 mb-3" />
                  <p className="text-lg font-medium">No Steps Found</p>
                  <p className="text-sm">There are no campaign steps available for this lead.</p>
                </div>
              ) : campaignStatus?.steps && (
                <div className="space-y-4">
                  {campaignStatus.steps.map((step) => (
                    <div
                      key={step.step_number}
                      className="flex items-center space-x-4 p-4 border rounded-lg bg-gray-50"
                    >
                      {getStepIcon(step.status)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {formatStepType(step.step_type)}
                            {step.reminder_number !== null && ` (Reminder ${step.reminder_number})`}
                          </span>
                          <div className="flex items-center space-x-1">
                            <span className={`text-sm capitalize ${
                              step.status === 'sent' ? 'text-green-600' :
                              step.status === 'pending' ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {step.status}
                            </span>
                            {step.status === 'sent' && step.completed_at && (
                              <span className="text-sm text-gray-500">
                                on {formatDateTime(step.completed_at)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
} 