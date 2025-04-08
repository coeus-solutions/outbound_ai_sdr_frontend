import { useCallback, useEffect, useState } from 'react';
import { getToken } from '../utils/auth';
import { EmailLog, getCompanyEmails } from '../services/emails';
import { useToast } from '../context/ToastContext';

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
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  refetch: () => Promise<void>;
}

export function useEmailLogs({ companyId, campaignRunId }: UseEmailLogsProps): UseEmailLogsReturn {
  const { showToast } = useToast();
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchEmailLogs = useCallback(async () => {
    const token = getToken();
    if (!token || !companyId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getCompanyEmails(
        token,
        companyId,
        undefined,
        undefined,
        campaignRunId,
        page,
        pageSize
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
  }, [companyId, campaignRunId, page, pageSize, showToast]);

  useEffect(() => {
    fetchEmailLogs();
  }, [fetchEmailLogs]);

  return {
    emailLogs,
    loading,
    error,
    page,
    pageSize,
    totalPages,
    total,
    setPage,
    setPageSize,
    refetch: fetchEmailLogs,
  };
} 