import { useState, useEffect } from 'react';
import { CallLog } from '../types';
import { getCompanyCalls } from '../services/calls';
import { getToken } from '../utils/auth';

interface CallLogFilters {
  dateRange: 'all' | 'today' | 'week' | 'month';
  campaign_id?: string;
  lead_id?: string;
}

export function useCallLogs(companyId: string, campaignRunId?: string) {
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CallLogFilters>({
    dateRange: 'all'
  });

  useEffect(() => {
    const loadCallLogs = async () => {
      if (!companyId) {
        console.error('No companyId provided');
        return;
      }

      setIsLoading(true);
      try {
        const token = getToken();
        if (!token) {
          const errorMessage = 'Authentication token not found';
          console.error(errorMessage);
          setError(errorMessage);
          return;
        }

        console.log('Fetching call logs for company:', companyId);
        const data = await getCompanyCalls(token, companyId, filters.campaign_id, campaignRunId);
        console.log('Call logs response:', data);

        if (!Array.isArray(data)) {
          const errorMessage = 'Invalid response format from server';
          console.error(errorMessage, data);
          setError(errorMessage);
          return;
        }

        setCallLogs(data);
        setError(null);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load call logs';
        console.error('Error loading call logs:', error);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadCallLogs();
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

    // Lead filter
    if (filters.lead_id && log.lead_id !== filters.lead_id) {
      return false;
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