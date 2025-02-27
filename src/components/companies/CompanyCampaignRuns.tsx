import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { CampaignRun, getCampaignRuns } from '../../services/emailCampaigns';
import { formatDate } from '../../utils/date';
import { EmptyState } from './EmptyState';
import { SkeletonLoader } from '../shared/SkeletonLoader';

export function CompanyCampaignRuns() {
  const { companyId } = useParams<{ companyId: string }>();
  const { isAuthenticated } = useAuth();
  const [campaignRuns, setCampaignRuns] = useState<CampaignRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaignRuns = async () => {
      try {
        if (!companyId) return;
        const token = localStorage.getItem('token');
        if (!token) return;
        const data = await getCampaignRuns(token, companyId);
        setCampaignRuns(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch campaign runs');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignRuns();
  }, [companyId]);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (campaignRuns.length === 0) {
    return (
      <EmptyState
        title="No Campaign Runs"
        description="There are no campaign runs yet."
        actionLink={`/companies/${companyId}/campaigns`}
        actionText="View Campaigns"
      />
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
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Campaign Runs</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Run At
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
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {campaignRuns.map((run) => (
              <tr key={run.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(run.run_at)}
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
                        style={{ width: `${Math.round((run.leads_processed / run.leads_total) * 100)}%` }}
                      />
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      {Math.round((run.leads_processed / run.leads_total) * 100)}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {run.leads_total}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {run.leads_processed}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 