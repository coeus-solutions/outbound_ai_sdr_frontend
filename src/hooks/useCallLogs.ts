import { useState, useEffect } from 'react';
import { CallLog } from '../types';

// Mock data - replace with actual API calls
const mockCallLogs: CallLog[] = [
  {
    id: '1',
    companyId: '1',
    leadId: '1',
    leadName: 'John Smith',
    productId: '1',
    productName: 'Enterprise CRM',
    timestamp: new Date().toISOString(),
    duration: 645, // 10:45
    sentiment: 'positive',
    summary: 'Lead showed strong interest in the product features. Discussed pricing and implementation timeline. Follow-up scheduled for next week.'
  },
  {
    id: '2',
    companyId: '1',
    leadId: '2',
    leadName: 'Sarah Johnson',
    productId: '2',
    productName: 'Analytics Suite',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    duration: 425, // 7:05
    sentiment: 'neutral',
    summary: 'Technical discussion about integration capabilities. Lead requested additional documentation about API endpoints.'
  }
];

interface CallLogFilters {
  search: string;
  dateRange: 'all' | 'today' | 'week' | 'month';
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export function useCallLogs() {
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<CallLogFilters>({
    search: '',
    dateRange: 'all'
  });

  useEffect(() => {
    // Simulate API call
    const loadCallLogs = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCallLogs(mockCallLogs);
      } catch (error) {
        console.error('Error loading call logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCallLogs();
  }, []);

  return {
    callLogs,
    isLoading,
    filters,
    setFilters
  };
}