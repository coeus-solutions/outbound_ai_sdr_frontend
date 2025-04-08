import { useState, useEffect, useCallback, useRef } from 'react';
import { CallLog } from '../types';
import { getCompanyCalls } from '../services/calls';
import { getToken } from '../utils/auth';

interface CallLogFilters {
  dateRange: 'all' | 'today' | 'week' | 'month';
  campaign_id?: string;
  lead_id?: string;
  page?: number;
  limit?: number;
}

interface UseCallLogsProps {
  companyId: string;
  campaignId?: string;
  campaignRunId?: string;
  token?: string;
  page?: number;
  pageSize?: number;
}

interface UseCallLogsReturn {
  callLogs: CallLog[];
  isLoading: boolean;
  error: Error | null;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  currentPageSize: number;
  filters: CallLogFilters;
  setFilters: (filters: CallLogFilters) => void;
  setPage: (page: number) => void;
}

export const useCallLogs = (
  props: UseCallLogsProps
): UseCallLogsReturn => {
  const { companyId, campaignId, campaignRunId } = props;
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(props.page || 1);
  const [currentPageSize, setCurrentPageSize] = useState(props.pageSize || 10);
  const [filters, setFilters] = useState<CallLogFilters>({
    dateRange: 'all',
    campaign_id: campaignId,
    page: currentPage,
    limit: currentPageSize,
  });
  
  // Use a ref to track filter changes without causing re-renders
  const filtersRef = useRef(filters);
  const isInitialMount = useRef(true);
  
  // Update the ref when filters change
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const fetchCallLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) {
        setError(new Error('Authentication token not found'));
        return;
      }

      const response = await getCompanyCalls(
        token,
        companyId,
        filtersRef.current.campaign_id,
        campaignRunId,
        filtersRef.current.lead_id,
        currentPage,
        currentPageSize
      );
      setCallLogs(response.items);
      setTotalItems(response.total);
    } catch (error) {
      console.error('Error fetching call logs:', error);
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [companyId, currentPage, currentPageSize, campaignRunId]);

  useEffect(() => {
    fetchCallLogs();
  }, [fetchCallLogs]);

  // Add a separate effect to trigger a fetch when filters change
  useEffect(() => {
    // Skip the initial render
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Reset to first page when filters change
    setCurrentPage(1);
    fetchCallLogs();
  }, [filters.dateRange, filters.campaign_id, filters.lead_id, fetchCallLogs]);

  const handleSetPage = (page: number) => {
    setCurrentPage(page);
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSetPageSize = (pageSize: number) => {
    setCurrentPageSize(pageSize);
    setFilters(prev => ({ ...prev, limit: pageSize }));
  };

  const totalPages = Math.ceil(totalItems / currentPageSize);

  return {
    callLogs,
    isLoading,
    error,
    totalItems,
    totalPages,
    currentPage,
    currentPageSize,
    filters,
    setFilters,
    setPage: handleSetPage,
  };
};