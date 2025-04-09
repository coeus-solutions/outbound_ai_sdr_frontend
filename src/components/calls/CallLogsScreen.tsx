import React from 'react';
import { useParams } from 'react-router-dom';
import { CallLogList } from './CallLogList';
import { CallLogFilters } from './CallLogFilters';
import { useCallLogs } from '../../hooks/useCallLogs';
import { useAuth } from '../../hooks/useAuth';

export const CallLogsScreen: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const { isAuthenticated } = useAuth();
  const {
    callLogs,
    isLoading,
    error,
    totalItems,
    totalPages,
    currentPage,
    currentPageSize,
    filters,
    setFilters,
    setPage,
    setPageSize,
  } = useCallLogs({
    companyId: companyId || '',
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Call Logs</h1>
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <CallLogFilters
          filters={filters}
          onFilterChange={setFilters}
          companyId={companyId || ''}
        />
      </div>
      <div className="bg-white rounded-lg shadow">
        <CallLogList
          callLogs={callLogs}
          isLoading={isLoading}
          page={currentPage}
          pageSize={currentPageSize}
          totalItems={totalItems}
          totalPages={totalPages}
          onPageChange={setPage}
          onPageSizeChange={(pageSize) => {
            setPageSize(pageSize);
            setPage(1); // Reset to first page when changing page size
          }}
        />
      </div>
    </div>
  );
};