import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
  setPageSize: (pageSize: number) => void;
}

export const useCallLogs = (
  props: UseCallLogsProps
): UseCallLogsReturn => {
  const { companyId, campaignId, campaignRunId } = props;
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(Number(props.page) || 1);
  const [currentPageSize, setCurrentPageSize] = useState(Number(props.pageSize) || 3);
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

      const pageNumber = Number(currentPage);
      const pageSizeNumber = Number(currentPageSize);

      if (isNaN(pageNumber) || pageNumber < 1) {
        console.error('Invalid page number:', pageNumber);
        setError(new Error('Invalid page number'));
        setIsLoading(false);
        return;
      }

      const response = await getCompanyCalls(
        token,
        companyId,
        filtersRef.current.campaign_id,
        campaignRunId,
        filtersRef.current.lead_id,
        pageNumber,
        pageSizeNumber
      );
      setCallLogs(response.items);
      setTotalItems(response.total);
      
      // Ensure totalPages is at least 1
      const calculatedTotalPages = Math.max(1, Math.ceil(response.total / pageSizeNumber));
      setTotalPages(calculatedTotalPages);
    } catch (error) {
      console.error('Error fetching call logs:', error);
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [companyId, currentPage, currentPageSize, campaignRunId]);

  // Fetch call logs when dependencies change
  useEffect(() => {
    fetchCallLogs();
  }, [fetchCallLogs, currentPage, currentPageSize]);

  // Consolidated effect for all data fetching
  useEffect(() => {
    // Skip the initial render for filter changes
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else if (filters.campaign_id !== filtersRef.current.campaign_id || filters.lead_id !== filtersRef.current.lead_id) {
      // Reset to page 1 only when campaign or lead changes
      setCurrentPage(1);
      return; // Let the page change trigger the fetch
    }
    
    fetchCallLogs();
  }, [fetchCallLogs, currentPage, currentPageSize, filters.campaign_id, filters.lead_id]);

  // Filter call logs based on date range on the client side
  const filteredCallLogs = useMemo(() => {
    if (filters.dateRange === 'all') {
      return callLogs;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start of current week (Sunday)

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    return callLogs.filter(log => {
      const callDate = new Date(log.last_called_at);
      switch (filters.dateRange) {
        case 'today':
          return callDate >= today;
        case 'week':
          return callDate >= startOfWeek;
        case 'month':
          return callDate >= startOfMonth;
        default:
          return true;
      }
    });
  }, [callLogs, filters.dateRange]);

  const handleSetPage = (page: number) => {
    if (isNaN(page) || page < 1) {
      console.error('Invalid page number:', page);
      return;
    }
    const pageNumber = Number(page);
    setCurrentPage(pageNumber);
  };

  const handleSetPageSize = (pageSize: number) => {
    if (isNaN(pageSize) || pageSize < 1) {
      console.error('Invalid page size:', pageSize);
      return;
    }
    const pageSizeNumber = Number(pageSize);
    setCurrentPageSize(pageSizeNumber);
    setFilters(prev => ({ ...prev, limit: pageSizeNumber }));
  };

  return {
    callLogs: filteredCallLogs,
    isLoading,
    error,
    totalItems,
    totalPages,
    currentPage,
    currentPageSize,
    filters,
    setFilters,
    setPage: handleSetPage,
    setPageSize: handleSetPageSize,
  };
};