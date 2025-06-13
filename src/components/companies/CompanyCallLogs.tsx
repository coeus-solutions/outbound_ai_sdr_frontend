import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { CallLogList } from '../calls/CallLogList';
import { CallLogFilters } from '../calls/CallLogFilters';
import { useCallLogs } from '../../hooks/useCallLogs';
import { PageHeader } from '../shared/PageHeader';
import { getCompanyById } from '../../services/companies';
import { getToken } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';
import type { Company } from '../../services/companies';
import { getCampaignById, type Campaign } from '../../services/emailCampaigns';

export function CompanyCallLogs() {
  const { companyId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const campaignRunId = queryParams.get('campaign_run_id');
  const campaignId = queryParams.get('campaign_id');
  const { showToast } = useToast();
  const { callLogs, isLoading: isLoadingCalls, error: callLogsError, filters, setFilters, totalItems, currentPage, currentPageSize, setPage, setPageSize } = useCallLogs({
    companyId: companyId || '',
    campaignRunId: campaignRunId || undefined,
    campaignId: campaignId || undefined,
  });
  const [company, setCompany] = useState<Company | null>(null);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoadingCompany, setIsLoadingCompany] = useState(true);
  const [isLoadingCampaign, setIsLoadingCampaign] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompany() {
      if (!companyId) {
        console.error('No companyId provided');
        return;
      }

      try {
        const token = getToken();
        if (!token) {
          setError('Authentication token not found');
          showToast('Authentication failed. Please try logging in again.', 'error');
          return;
        }

        const companyData = await getCompanyById(token, companyId);
        setCompany(companyData);
        setError(null);
      } catch (err) {
        const errorMessage = 'Failed to fetch company details';
        console.error('Error fetching company:', err);
        setError(errorMessage);
        showToast(errorMessage, 'error');
      } finally {
        setIsLoadingCompany(false);
      }
    }

    fetchCompany();
  }, [companyId, showToast]);

  useEffect(() => {
    async function fetchCampaign() {
      if (!campaignId || campaignRunId) {
        // Don't fetch if we don't have campaignId or if we have campaignRunId
        return;
      }

      try {
        setIsLoadingCampaign(true);
        const token = getToken();
        if (!token) {
          showToast('Authentication failed. Please try logging in again.', 'error');
          return;
        }

        const campaignData = await getCampaignById(token, campaignId);
        setCampaign(campaignData);
      } catch (err) {
        console.error('Error fetching campaign:', err);
        showToast('Failed to fetch campaign details', 'error');
      } finally {
        setIsLoadingCampaign(false);
      }
    }

    fetchCampaign();
  }, [campaignId, campaignRunId, showToast]);

  const isLoading = isLoadingCalls || isLoadingCompany || isLoadingCampaign;

  // Debug logging
  useEffect(() => {
    console.log('CompanyCallLogs Debug:', {
      companyId,
      totalCallLogs: callLogs.length,
      callLogs,
      isLoading,
      error,
      callLogsError
    });
  }, [companyId, callLogs, isLoading, error, callLogsError]);

  if (error || callLogsError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          {error || (callLogsError instanceof Error ? callLogsError.message : 'An error occurred')}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="text-indigo-600 hover:text-indigo-500"
        >
          Try again
        </button>
      </div>
    );
  }

  const handleBackClick = () => {
    navigate(`/companies/${companyId}/campaign-runs`);
  };

  const getHeaderTitle = () => {
    if (campaignRunId) {
      return `Campaign run ${campaignRunId}`;
    }
    if (campaign) {
      return `Campaign: ${campaign.name}`;
    }
    return 'Campaign run Unknown';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={getHeaderTitle()}
        subtitle="Call logs for"
        showBackButton={true}
        onBackClick={handleBackClick}
      />

      <CallLogFilters filters={filters} onFilterChange={setFilters} companyId={companyId || ''} />
      <CallLogList 
        callLogs={callLogs} 
        isLoading={isLoading} 
        page={currentPage}
        pageSize={currentPageSize}
        totalItems={totalItems}
        totalPages={Math.ceil(totalItems / currentPageSize)}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}