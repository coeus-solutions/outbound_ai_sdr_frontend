import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCallQueues, PaginatedCallQueueResponse, CallQueue, retryFailedCampaignCalls, retryCallQueueItem } from '../../services/calls';
import { PageHeader } from '../shared/PageHeader';
import { Loader2, Phone, Eye, RefreshCw } from 'lucide-react';
import { getToken } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';
import { formatDateTime } from '../../utils/formatters';
import { getCompanyById, type Company } from '../../services/companies';
import { CallQueueDialog } from './CallQueueDialog';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'sent', label: 'Sent' },
  { value: 'failed', label: 'Failed' }
];

export function CallQueues() {
  const { campaignRunId, companyId } = useParams<{ campaignRunId: string; companyId: string }>();
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PaginatedCallQueueResponse | null>(null);
  const [selectedCallQueue, setSelectedCallQueue] = useState<CallQueue | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('all');

  const fetchData = async () => {
    console.log('Fetching call queues with campaignRunId:', campaignRunId);
    if (!campaignRunId || !companyId) {
      console.error('No campaignRunId or companyId provided');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      if (!token) {
        console.error('No auth token found');
        setError('Authentication token not found');
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      // Fetch company details
      const companyData = await getCompanyById(token, companyId);
      setCompany(companyData);

      console.log('Making API call to fetch call queues...');
      const response = await getCallQueues(token, campaignRunId, page, pageSize, selectedStatus);
      console.log('API response:', response);
      setData(response);
    } catch (err) {
      const errorMessage = 'Failed to fetch data';
      console.error('Error fetching data:', err);
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [campaignRunId, companyId, page, pageSize, selectedStatus, showToast]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRetryFailedItems = async () => {
    if (!campaignRunId) {
      console.error('No campaignRunId provided');
      return;
    }

    try {
      setRetrying(true);
      const token = getToken();
      if (!token) {
        console.error('No auth token found');
        setError('Authentication token not found');
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      const response = await retryFailedCampaignCalls(token, campaignRunId);
      showToast('Retry initiated successfully', 'success');
      // Refresh the data
      fetchData();
    } catch (err) {
      const errorMessage = 'Failed to retry failed items';
      console.error('Error retrying failed items:', err);
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setRetrying(false);
    }
  };

  const handleRetryQueueItem = async (queueId: string) => {
    if (!queueId) {
      console.error('No queueId provided');
      return;
    }

    try {
      setRetrying(true);
      const token = getToken();
      if (!token) {
        console.error('No auth token found');
        setError('Authentication token not found');
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      await retryCallQueueItem(token, queueId);
      showToast('Call queue item retry initiated successfully', 'success');
      // Refresh the data
      fetchData();
    } catch (err) {
      const errorMessage = 'Failed to retry call queue item';
      console.error('Error retrying call queue item:', err);
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setRetrying(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-200 rounded mt-2 animate-pulse"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="bg-white shadow rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retry Count</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Processed At</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Known Error</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...Array(5)].map((_, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader title={company?.name || 'Company'} subtitle="Call Queue for" />
        <button
          onClick={handleRetryFailedItems}
          disabled={retrying}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {retrying ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Retrying...
            </>
          ) : (
            <>
              <RefreshCw className="-ml-1 mr-2 h-4 w-4" />
              Retry Failed Items
            </>
          )}
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <div className="flex items-center space-x-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Filter by status:
            </label>
            <select
              id="status"
              name="status"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1); // Reset page to 1 when status changes
              }}
              className="mt-1 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {data?.items.length === 0 ? (
          <div className="text-center py-12">
            <Phone className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No call queues</h3>
            <p className="mt-1 text-sm text-gray-500">There are no call queues for this campaign run.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retry Count</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Processed At</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Known Error</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.items.map((queue) => (
                  <tr key={queue.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{queue.lead_name || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">{queue.lead_phone || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        queue.status === 'failed' ? 'bg-red-100 text-red-800' :
                        queue.status === 'sent' ? 'bg-green-100 text-green-800' :
                        queue.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {queue.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {queue.retry_count} / {queue.max_retries}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {queue.processed_at ? formatDateTime(queue.processed_at) : 'Not processed'}
                    </td>
                    <td className="px-6 py-4 text-sm text-red-600 whitespace-normal break-words max-w-xs">
                      {queue.error_message || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedCallQueue(queue)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {queue.status === 'failed' && (
                          <button
                            onClick={() => handleRetryQueueItem(queue.id)}
                            disabled={retrying}
                            className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Retry call"
                          >
                            <RefreshCw className={`h-4 w-4 ${retrying ? 'animate-spin' : ''}`} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.items.length > 0 && (
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
                onClick={() => handlePageChange(Math.min(page + 1, data?.total_pages || 1))}
                disabled={page === (data?.total_pages || 1)}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{((page - 1) * pageSize) + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(page * pageSize, data?.total || 0)}</span> of{' '}
                  <span className="font-medium">{data?.total}</span> results
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
                    onClick={() => handlePageChange(Math.min(page + 1, data?.total_pages || 1))}
                    disabled={page === (data?.total_pages || 1)}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedCallQueue && (
        <CallQueueDialog
          isOpen={selectedCallQueue !== null}
          callQueue={selectedCallQueue}
          onClose={() => setSelectedCallQueue(null)}
        />
      )}
    </div>
  );
} 