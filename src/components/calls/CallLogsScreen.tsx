import React from 'react';
import { CallLogList } from './CallLogList';
import { CallLogFilters } from './CallLogFilters';
import { useCallLogs } from '../../hooks/useCallLogs';

export function CallLogsScreen() {
  const { callLogs, isLoading, filters, setFilters } = useCallLogs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Call Logs</h1>
        <p className="text-sm text-gray-500 mt-1">View and analyze your sales call history</p>
      </div>

      <CallLogFilters filters={filters} onFilterChange={setFilters} />
      <CallLogList callLogs={callLogs} isLoading={isLoading} />
    </div>
  );
}