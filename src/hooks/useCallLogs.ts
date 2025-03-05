import { useState, useEffect } from 'react';
import { CallLog } from '../types';
import { getCompanyCalls } from '../services/calls';
import { getToken } from '../utils/auth';

interface CallLogFilters {
  dateRange: 'all' | 'today' | 'week' | 'month';
  campaign_id?: string;
}

export function useCallLogs(companyId: string, campaignRunId?: string) {
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CallLogFilters>({
    dateRange: 'all'
  });

  useEffect(() => {
    async function fetchCallLogs() {
      if (!companyId) return;

      try {
        setIsLoading(true);
        const token = getToken();
        if (!token) {
          setError('Authentication token not found');
          return;
        }

        const data = await getCompanyCalls(token, companyId, filters.campaign_id, campaignRunId);
        setCallLogs(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching call logs:', err);
        setError('Failed to fetch call logs');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCallLogs();
  }, [companyId, filters.campaign_id, campaignRunId]);

  // Filter the call logs based on the current filters
  const filteredCallLogs = callLogs.filter(log => {
    // Date range filter
    if (filters.dateRange !== 'all') {
      const logDate = new Date(log.created_at);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisWeek = new Date(today);
      thisWeek.setDate(today.getDate() - today.getDay());
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      switch (filters.dateRange) {
        case 'today':
          if (logDate < today) return false;
          break;
        case 'week':
          if (logDate < thisWeek) return false;
          break;
        case 'month':
          if (logDate < thisMonth) return false;
          break;
      }
    }

    return true;
  });

  return {
    callLogs: filteredCallLogs,
    isLoading,
    error,
    filters,
    setFilters
  };
}