import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mail, Plus, Eye, Play, Phone, TestTube2 } from 'lucide-react';
import { PageHeader } from '../shared/PageHeader';
import { getCompanyById, Company } from '../../services/companies';
import { getCompanyCampaigns, Campaign, runCampaign } from '../../services/emailCampaigns';
import { getToken } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';
import { formatDateTime } from '../../utils/formatters';
import { TestRunDialog } from './TestRunDialog';

interface APIError {
  response?: {
    status: number;
    data?: {
      detail?: string;
    };
  };
}

interface TemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  template: string;
}

function TemplateDialog({ isOpen, onClose, template }: TemplateDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Email Template Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: template }}
        />
      </div>
    </div>
  );
}

export function CompanyCampaigns() {
  const { companyId } = useParams();
  const { showToast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<string | null>(null);
  const [templateDialog, setTemplateDialog] = useState<{ isOpen: boolean; template: string }>({
    isOpen: false,
    template: '',
  });
  const [testRunDialog, setTestRunDialog] = useState<{ isOpen: boolean; campaign: Campaign | null }>({
    isOpen: false,
    campaign: null,
  });

  useEffect(() => {
    async function fetchData() {
      if (!companyId) return;

      try {
        const token = getToken();
        if (!token) {
          setError('Authentication token not found');
          showToast('Authentication failed. Please try logging in again.', 'error');
          return;
        }

        const [companyData, campaignsData] = await Promise.all([
          getCompanyById(token, companyId),
          getCompanyCampaigns(token, companyId)
        ]);

        setCompany(companyData);
        setCampaigns(Array.isArray(campaignsData) ? campaignsData : []);
        setError(null);
      } catch (err) {
        const errorMessage = 'Failed to fetch data';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [companyId, showToast]);

  const handleRunCampaign = async (campaign: Campaign) => {
    setIsRunning(campaign.id);
    try {
      const token = getToken();
      if (!token) {
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      const result = await runCampaign(token, campaign.id);
      showToast(`Campaign "${campaign.name}" started successfully!`, 'success');
    } catch (err: unknown) {
      console.log('API Error:', err);  // Temporary log to debug
      const error = err as APIError;
      if (error?.response?.status === 400 && error?.response?.data?.detail) {
        showToast(error.response.data.detail, 'error');
      } else {
        showToast('Failed to run campaign', 'error');
      }
    } finally {
      setIsRunning(null);
    }
  };

  const handleTestRun = async (value: string) => {
    if (!testRunDialog.campaign) return;
    
    try {
      const token = getToken();
      if (!token) {
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      // TODO: Implement the test run API call here
      showToast(`Test run initiated for ${testRunDialog.campaign.name}`, 'success');
    } catch (err) {
      console.error('API Error:', err);
      showToast('Failed to run test campaign', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="text-indigo-600 hover:text-indigo-500"
        >
          Try again
        </button>
      </div>
    );
  }

  const hasNoCampaigns = !campaigns || campaigns.length === 0;

  return (
    <div className="space-y-6">
      <TestRunDialog
        isOpen={testRunDialog.isOpen}
        onClose={() => setTestRunDialog({ isOpen: false, campaign: null })}
        campaignType={testRunDialog.campaign?.type || 'email'}
        campaignName={testRunDialog.campaign?.name || ''}
        onSubmit={handleTestRun}
      />
      
      <TemplateDialog
        isOpen={templateDialog.isOpen}
        onClose={() => setTemplateDialog({ isOpen: false, template: '' })}
        template={templateDialog.template}
      />
      
      <div className="flex justify-between items-center">
        <PageHeader
          title={company?.name || 'Company'}
          subtitle="Campaigns for"
        />
        <Link
          to={`/companies/${companyId}/campaigns/new`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Link>
      </div>

      {hasNoCampaigns ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Mail className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first campaign.</p>
          <div className="mt-6">
            <Link
              to={`/companies/${companyId}/campaigns/new`}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                      {campaign.description && (
                        <div className="text-sm text-gray-500">{campaign.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        campaign.type === 'email' 
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {campaign.type === 'email' ? (
                          <Mail className="h-3 w-3 mr-1" />
                        ) : (
                          <Phone className="h-3 w-3 mr-1" />
                        )}
                        {campaign.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDateTime(campaign.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleRunCampaign(campaign)}
                        disabled={isRunning === campaign.id}
                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white ${
                          isRunning === campaign.id
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        {isRunning === campaign.id ? 'Running...' : 'Run'}
                      </button>

                      <button
                        onClick={() => setTestRunDialog({ isOpen: true, campaign })}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        <TestTube2 className="h-3 w-3 mr-1" />
                        Test Run
                      </button>
                      
                      {campaign.type === 'email' && campaign.template && (
                        <button
                          onClick={() => setTemplateDialog({ isOpen: true, template: campaign.template || '' })}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Template
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 