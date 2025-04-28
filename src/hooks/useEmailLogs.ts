import { useCallback, useEffect, useState, useRef } from 'react';
import { getToken } from '../utils/auth';
import { EmailLog, getCompanyEmails } from '../services/emails';
import { useToast } from '../context/ToastContext';

export interface EmailLogFilters {
  campaign_id?: string;
  lead_id?: string;
  status?: 'opened' | 'replied' | 'meeting_booked';
}

interface UseEmailLogsProps {
  companyId: string;
  campaignRunId?: string;
}

interface UseEmailLogsReturn {
  emailLogs: EmailLog[];
  loading: boolean;
  error: Error | null;
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
  filters: EmailLogFilters;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setFilters: (filters: EmailLogFilters) => void;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage email logs with pagination
 * 
 * @param companyId - The ID of the company to fetch emails for
 * @param campaignRunId - Optional campaign run ID to filter by
 * @returns Object containing email logs, loading state, error state, and pagination controls
 * 
 * The API uses page_number and limit parameters for pagination
 */
export function useEmailLogs({ companyId, campaignRunId }: UseEmailLogsProps): UseEmailLogsReturn {
  const { showToast } = useToast();
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<EmailLogFilters>({});
  
  // Use refs to track previous values for comparison
  const prevFiltersRef = useRef<EmailLogFilters>({});
  const prevPageRef = useRef<number>(1);
  const prevPageSizeRef = useRef<number>(10);
  const prevCompanyIdRef = useRef<string>('');
  const prevCampaignRunIdRef = useRef<string | undefined>(undefined);

  const fetchEmailLogs = useCallback(async () => {
    const token = getToken();
    if (!token || !companyId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getCompanyEmails(
        token,
        companyId,
        filters.campaign_id,
        filters.lead_id,
        campaignRunId,
        page,
        pageSize,
        filters.status
      );

      setEmailLogs(response.items);
      setTotalPages(response.total_pages);
      setTotal(response.total);
    } catch (err) {
      setError(err as Error);
      showToast('Failed to fetch email logs', 'error');
    } finally {
      setLoading(false);
    }
  }, [companyId, campaignRunId, page, pageSize, filters, showToast]);

  // Only fetch when dependencies actually change
  useEffect(() => {
    const shouldFetch = 
      companyId !== prevCompanyIdRef.current ||
      campaignRunId !== prevCampaignRunIdRef.current ||
      page !== prevPageRef.current ||
      pageSize !== prevPageSizeRef.current ||
      JSON.stringify(filters) !== JSON.stringify(prevFiltersRef.current);
    
    if (shouldFetch) {
      fetchEmailLogs();
      
      // Update refs with current values
      prevCompanyIdRef.current = companyId;
      prevCampaignRunIdRef.current = campaignRunId;
      prevPageRef.current = page;
      prevPageSizeRef.current = pageSize;
      prevFiltersRef.current = { ...filters };
    }
  }, [companyId, campaignRunId, page, pageSize, filters, fetchEmailLogs]);

  // Reset page to 1 when filters change
  useEffect(() => {
    if (JSON.stringify(filters) !== JSON.stringify(prevFiltersRef.current)) {
      setPage(1);
    }
  }, [filters]);

  return {
    emailLogs,
    loading,
    error,
    page,
    pageSize,
    totalPages,
    total,
    filters,
    setPage,
    setPageSize,
    setFilters,
    refetch: fetchEmailLogs,
  };
}