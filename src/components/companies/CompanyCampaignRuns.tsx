import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getCampaignRuns, type CampaignRun } from '../../services/emailCampaigns';
import { formatDate } from '../../utils/date';
import { EmptyState } from './EmptyState';
import { SkeletonLoader } from '../shared/SkeletonLoader';
import { TableSkeletonLoader } from '../shared/TableSkeletonLoader';
import { PageHeader } from '../shared/PageHeader';
import { getCompanyById, type Company } from '../../services/companies';
import { useToast } from '../../context/ToastContext';
import { Mail, Phone, ChevronLeft, ChevronRight, Info, List, ChevronDown } from 'lucide-react';
import { LoadingButton } from '../shared/LoadingButton';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function CompanyCampaignRuns() {
  const { companyId, campaignId } = useParams();
  const auth = useAuth();
  const { showToast } = useToast();
  const [campaignRuns, setCampaignRuns] = useState<CampaignRun[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    async function fetchData() {
      if (!companyId || !auth.isAuthenticated) return;

      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) return;
        
        // Fetch company data
        const companyData = await getCompanyById(token, companyId);
        setCompany(companyData);
        
        const response = await getCampaignRuns(token, companyId, campaignId, page, pageSize);
        setCampaignRuns(response.items);
        setTotalItems(response.total);
        setTotalPages(response.total_pages);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch campaign runs';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [companyId, campaignId, auth.isAuthenticated, page, pageSize, showToast]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={company?.name || 'Loading...'}
          subtitle="Campaign runs for"
        />
        <TableSkeletonLoader
          rowCount={5}
          columnCount={7}
          hasHeader={true}
        />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'running':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={company?.name || 'Company'}
        subtitle="Campaign runs for"
      />
      
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Campaign progress is updated periodically. Refresh the page to see the latest status and results.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Run At
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leads to Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaignRuns.map((run) => (
                <tr key={run.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(run.run_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {run.campaigns.type === 'email' ? (
                        <Mail className="w-4 h-4 text-blue-500 mr-2" />
                      ) : run.campaigns.type === 'call' ? (
                        <Phone className="w-4 h-4 text-purple-500 mr-2" />
                      ) : run.campaigns.type === 'email_and_call' ? (
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-blue-500" />
                          <Phone className="w-4 h-4 text-purple-500 ml-1 mr-2" />
                        </div>
                      ) : (
                        <span className="w-4 h-4 mr-2" />
                      )}
                      <span className="text-sm text-gray-900">{run.campaigns.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(run.status)}`}>
                        {run.status}
                      </span>
                      {run.status.toLowerCase() === 'failed' && run.failure_reason && (
                        <div className="relative group">
                          <Info className="h-4 w-4 text-red-500 cursor-help" />
                          <div className="absolute z-[9999] invisible group-hover:visible bg-gray-900 text-white text-xs rounded py-2 px-3 left-1/2 bottom-full mb-2 min-w-[24rem] -translate-x-1/2 whitespace-normal">
                            <p className="text-center">{run.failure_reason}</p>
                            <div className="absolute left-1/2 bottom-[-6px] w-3 h-3 bg-gray-900 transform rotate-45 -translate-x-1/2"></div>
                          </div>
                        </div>
                      )}
                      {run.has_failed_items && (
                        <div className="relative group">
                          <Info className="h-4 w-4 text-red-500 cursor-help" />
                          <div className="absolute z-[9999] invisible group-hover:visible bg-gray-900 text-white text-xs rounded py-2 px-3 left-1/2 bottom-full mb-2 min-w-[24rem] -translate-x-1/2 whitespace-normal">
                            <p className="text-center">This campaign run has failed items. You can retry those failed items by visiting Queued Emails/Calls screen</p>
                            <div className="absolute left-1/2 bottom-[-6px] w-3 h-3 bg-gray-900 transform rotate-45 -translate-x-1/2"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${run.leads_total === 0 && run.leads_processed === 0 ? 100 : Math.min(100, Math.round((run.leads_processed / run.leads_total) * 100))}%` }}
                        />
                      </div>
                      <span className="ml-2 text-sm text-gray-500">
                        {run.leads_total === 0 && run.leads_processed === 0 ? 100 : Math.min(100, Math.round((run.leads_processed / run.leads_total) * 100))}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {run.leads_total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button className="inline-flex items-center justify-between min-w-[120px] px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Actions
                          <ChevronDown className="h-3.5 w-3.5 ml-1" />
                        </button>
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content 
                          className="min-w-[180px] bg-white rounded-md shadow-lg border border-gray-200 py-1"
                          sideOffset={5}
                        >
                          {(run.campaigns.type === 'email' || run.campaigns.type === 'email_and_call') && (
                            <>
                              <DropdownMenu.Item className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" asChild>
                                <Link to={`/companies/${companyId}/emails?campaign_run_id=${run.id}`}>
                                  <Mail className="h-3.5 w-3.5 mr-2" />
                                  View Emails
                                </Link>
                              </DropdownMenu.Item>
                              <DropdownMenu.Item className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" asChild>
                                <Link to={`/companies/${companyId}/campaign-runs/${run.id}/email-queues`}>
                                  <List className="h-3.5 w-3.5 mr-2" />
                                  Email Queue
                                </Link>
                              </DropdownMenu.Item>
                            </>
                          )}
                          {(run.campaigns.type === 'call' || run.campaigns.type === 'email_and_call') && (
                            <>
                              <DropdownMenu.Item className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" asChild>
                                <Link to={`/companies/${companyId}/calls?campaign_run_id=${run.id}`}>
                                  <Phone className="h-3.5 w-3.5 mr-2" />
                                  View Calls
                                </Link>
                              </DropdownMenu.Item>
                              <DropdownMenu.Item className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" asChild>
                                <Link to={`/companies/${companyId}/campaign-runs/${run.id}/call-queues`}>
                                  <List className="h-3.5 w-3.5 mr-2" />
                                  Call Queue
                                </Link>
                              </DropdownMenu.Item>
                            </>
                          )}
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(Math.max(page - 1, 1))}
              disabled={page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
              disabled={page === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startItem}</span> to{' '}
                <span className="font-medium">{endItem}</span> of{' '}
                <span className="font-medium">{totalItems}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(Math.max(page - 1, 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(Math.min(page + 1, totalPages))}
                  disabled={page === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 