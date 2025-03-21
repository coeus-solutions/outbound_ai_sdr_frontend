import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { CampaignRun, getCampaignRuns } from '../../services/emailCampaigns';
import { formatDate } from '../../utils/date';
import { EmptyState } from './EmptyState';
import { SkeletonLoader } from '../shared/SkeletonLoader';
import { TableSkeletonLoader } from '../shared/TableSkeletonLoader';
import { PageHeader } from '../shared/PageHeader';
import { getCompanyById, type Company } from '../../services/companies';
import { useToast } from '../../context/ToastContext';
import { Mail, Phone } from 'lucide-react';

export function CompanyCampaignRuns() {
  const { companyId } = useParams<{ companyId: string }>();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [campaignRuns, setCampaignRuns] = useState<CampaignRun[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!companyId) return;
        const token = localStorage.getItem('token');
        if (!token) return;

        // Fetch company details
        const companyData = await getCompanyById(token, companyId);
        setCompany(companyData);

        // Fetch campaign runs
        const runsData = await getCampaignRuns(token, companyId);
        setCampaignRuns(runsData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId, showToast]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Loading..."
          subtitle="Campaign runs for"
        />
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
                    Total Leads
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Processed Leads
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...Array(5)].map((_, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 animate-pulse"></div>
                        <div className="ml-2 h-4 bg-gray-200 rounded animate-pulse w-10"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
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

  if (campaignRuns.length === 0) {
    return (
      <>
        <PageHeader
          title={company?.name || 'Company'}
          subtitle="Campaign runs for"
        />
        <EmptyState
          title="No Campaign Runs"
          description="There are no campaign runs yet."
          actionLink={`/companies/${companyId}/campaigns`}
          actionText="View Campaigns"
        />
      </>
    );
  }

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
                  Total Leads
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Processed Leads
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaignRuns.map((run) => (
                <tr key={run.id}>
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
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(run.status)}`}>
                      {run.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${run.leads_total === 0 && run.leads_processed === 0 ? 100 : Math.round((run.leads_processed / run.leads_total) * 100)}%` }}
                        />
                      </div>
                      <span className="ml-2 text-sm text-gray-500">
                        {run.leads_total === 0 && run.leads_processed === 0 ? 100 : Math.round((run.leads_processed / run.leads_total) * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {run.leads_total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {run.leads_processed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      to={`/companies/${companyId}/${(run.campaigns.type === 'email' || run.campaigns.type === 'email_and_call') ? 'emails' : 'calls'}?campaign_run_id=${run.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      {(run.campaigns.type === 'email' || run.campaigns.type === 'email_and_call') ? 'Email Log' : (run.campaigns.type === 'call' ? 'Call Log' : '')}
                    </Link>
                    {(run.campaigns.type === 'email' || run.campaigns.type === 'email_and_call') && (
                      <>
                        <span className="mx-2 text-gray-300">|</span>
                        <Link
                          to={`/companies/${companyId}/campaign-runs/${run.id}/email-queues`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Queued Emails
                        </Link>
                      </>
                    )}
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