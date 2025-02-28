import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { CallLogList } from '../calls/CallLogList';
import { CallLogFilters } from '../calls/CallLogFilters';
import { useCallLogs } from '../../hooks/useCallLogs';
import { PageHeader } from '../shared/PageHeader';
import { getCompanyById } from '../../services/companies';
import { getToken } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';
import type { Company } from '../../services/companies';

export function CompanyCallLogs() {
  const { companyId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const campaignRunId = queryParams.get('campaign_run_id');
  const { showToast } = useToast();
  const { callLogs, isLoading: isLoadingCalls, error: callLogsError, filters, setFilters } = useCallLogs(companyId || '', campaignRunId);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoadingCompany, setIsLoadingCompany] = useState(true);
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

  const isLoading = isLoadingCalls || isLoadingCompany;

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
        <div className="text-red-600 mb-4">{error || callLogsError}</div>
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
      <PageHeader
        title={company?.name || 'Company'}
        subtitle="Call logs for"
      />

      <CallLogFilters filters={filters} onFilterChange={setFilters} companyId={companyId || ''} />
      <CallLogList callLogs={callLogs} isLoading={isLoading} />
    </div>
  );
}