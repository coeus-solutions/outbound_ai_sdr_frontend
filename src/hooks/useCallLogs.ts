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
    async function fetchCallLogs() {
      if (!companyId) return;

      try {
        setIsLoading(true);
        const token = getToken();
        if (!token) {
          setError('Authentication token not found');
          return;
        }

        const data = await getCompanyCalls(token, companyId, filters.campaign_id, campaignRunId, filters.lead_id);
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
  }, [companyId, filters.campaign_id, campaignRunId, filters.lead_id]);

  // Filter the call logs based on the current filters
  const filteredCallLogs = callLogs.filter(log => {
    // Date range filter
    if (filters.dateRange !== 'all') {
      // Use last_called_at if available, otherwise fall back to created_at
      const dateValue = log.last_called_at || log.created_at;
      if (!dateValue) {
        console.warn('Call log missing date value:', log.id);
        return true; // Include logs with missing date values
      }

      const logDate = new Date(dateValue);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Start of today
      const thisWeek = new Date(today);
      thisWeek.setDate(today.getDate() - today.getDay()); // Start of current week (Sunday)
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Start of current month

      // For debugging
      console.log('Filtering log:', {
        id: log.id,
        date: dateValue,
        parsedDate: logDate,
        today: today,
        thisWeek: thisWeek,
        thisMonth: thisMonth,
        filter: filters.dateRange
      });

      switch (filters.dateRange) {
        case 'today':
          // Compare date parts only (ignore time)
          if (logDate.getFullYear() !== today.getFullYear() ||
              logDate.getMonth() !== today.getMonth() ||
              logDate.getDate() !== today.getDate()) {
            return false;
          }
          break;
        case 'week':
          // Check if the date is within the current week
          const weekEnd = new Date(thisWeek);
          weekEnd.setDate(weekEnd.getDate() + 7);
          if (logDate < thisWeek || logDate >= weekEnd) {
            return false;
          }
          break;
        case 'month':
          // Check if the date is within the current month
          const nextMonth = new Date(thisMonth);
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          if (logDate < thisMonth || logDate >= nextMonth) {
            return false;
          }
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