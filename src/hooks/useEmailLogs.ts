import { useState, useEffect } from 'react';
import { EmailLog, getCompanyEmails } from '../services/emails';
import { useToast } from '../context/ToastContext';

export interface EmailLogFilters {
  campaign_id?: string;
  lead_id?: string;
}

export function useEmailLogs(companyId: string) {
  const { showToast } = useToast();
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EmailLogFilters>({});

  useEffect(() => {
    async function fetchEmailLogs() {
      if (!companyId) return;

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found');
          showToast('Authentication failed. Please try logging in again.', 'error');
          return;
        }

        const logs = await getCompanyEmails(token, companyId, filters.campaign_id, filters.lead_id);
        setEmailLogs(logs);
        setError(null);
      } catch (err) {
        const errorMessage = 'Failed to fetch email logs';
        setError(errorMessage);
        showToast(errorMessage, 'error');
        console.error('Error fetching email logs:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEmailLogs();
  }, [companyId, filters.campaign_id, filters.lead_id, showToast]);

  return {
    emailLogs,
    isLoading,
    error,
    filters,
    setFilters,
  };
} 