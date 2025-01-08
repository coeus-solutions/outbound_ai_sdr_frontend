import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mail, Plus, Eye, Play } from 'lucide-react';
import { PageHeader } from '../shared/PageHeader';
import { getCompanyById, Company } from '../../services/companies';
import { getCompanyEmailCampaigns, EmailCampaign, runEmailCampaign } from '../../services/emailCampaigns';
import { getToken } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';
import { formatDateTime } from '../../utils/formatters';

export function CompanyEmailCampaigns() {
  const { companyId } = useParams();
  const { showToast } = useToast();
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRunning, setIsRunning] = useState<string | null>(null);

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
          getCompanyEmailCampaigns(token, companyId)
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

  const handleViewEmail = (campaign: EmailCampaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCampaign(null);
    setIsModalOpen(false);
  };

  const handleRunCampaign = async (campaign: EmailCampaign) => {
    setIsRunning(campaign.id);
    try {
      const token = getToken();
      if (!token) {
        setError('Authentication token not found');
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      const result = await runEmailCampaign(token, campaign.id);
      showToast(`Campaign "${campaign.name}" started successfully!`, 'success');
    } catch (err) {
      const errorMessage = 'Failed to run campaign';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsRunning(null);
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
      <div className="flex justify-between items-center">
        <PageHeader
          title={company?.name || 'Company'}
          subtitle="Email Campaigns for"
        />
        <Link
          to={`/companies/${companyId}/email-campaigns/new`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Link>
      </div>

      {hasNoCampaigns ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Mail className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No email campaigns</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first email campaign.</p>
          <div className="mt-6">
            <Link
              to={`/companies/${companyId}/email-campaigns/new`}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Subject</th>
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
                      <div className="text-sm text-gray-900">{campaign.email_subject}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDateTime(campaign.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewEmail(campaign)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Email
                        </button>
                        <button
                          onClick={() => handleRunCampaign(campaign)}
                          disabled={isRunning === campaign.id}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          {isRunning === campaign.id ? 'Running...' : 'Run Campaign'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Email Preview Modal */}
      {isModalOpen && selectedCampaign && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Email Preview: {selectedCampaign.name}
                    </h3>
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Subject:</h4>
                      <p className="text-sm text-gray-900 mb-4">{selectedCampaign.email_subject}</p>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Body:</h4>
                      <div 
                        className="prose max-w-none bg-white p-4 rounded border border-gray-200"
                        dangerouslySetInnerHTML={{ __html: selectedCampaign.email_body }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 