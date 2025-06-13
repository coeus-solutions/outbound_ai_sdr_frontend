import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { EmailLogList } from '../emails/EmailLogList';
import { EmailLogFilters } from '../emails/EmailLogFilters';
import { useEmailLogs } from '../../hooks/useEmailLogs';
import { PageHeader } from '../shared/PageHeader';
import { getCompanyById } from '../../services/companies';
import { getToken } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';
import type { Company } from '../../services/companies';
import { getCampaignById, type Campaign } from '../../services/emailCampaigns';

export function CompanyEmails() {
  const { companyId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const campaignRunId = queryParams.get('campaign_run_id') || undefined;
  const campaignId = queryParams.get('campaign_id') || undefined;
  const { showToast } = useToast();
  const {
    emailLogs,
    loading: isLoadingEmails,
    error: emailLogsError,
    page,
    pageSize,
    totalPages,
    total,
    filters,
    setPage,
    setPageSize,
    setFilters,
  } = useEmailLogs({ 
    companyId: companyId || '', 
    campaignRunId,
    initialFilters: campaignId ? { campaign_id: campaignId } : undefined
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

  const isLoading = isLoadingEmails || isLoadingCompany || isLoadingCampaign;

  if (error || emailLogsError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          {error || (emailLogsError instanceof Error ? emailLogsError.message : 'An error occurred')}
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
        subtitle="Email logs for"
        showBackButton={true}
        onBackClick={handleBackClick}
      />

      <EmailLogFilters 
        filters={filters} 
        onFilterChange={setFilters} 
        companyId={companyId || ''} 
        setPage={setPage}
      />
      
      <EmailLogList
        emailLogs={emailLogs}
        isLoading={isLoading}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
} 