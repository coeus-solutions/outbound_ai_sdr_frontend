import React from 'react';
import { useParams } from 'react-router-dom';
import { CallLogList } from '../calls/CallLogList';
import { CallLogFilters } from '../calls/CallLogFilters';
import { useCallLogs } from '../../hooks/useCallLogs';
import { PageHeader } from '../shared/PageHeader';
import { mockCompanies } from '../../data/mockData';

export function CompanyCallLogs() {
  const { companyId } = useParams();
  const { callLogs, isLoading, filters, setFilters } = useCallLogs();
  const company = mockCompanies.find(c => c.id === companyId);

  const companyCallLogs = callLogs.filter(log => log.companyId === companyId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={company?.name || 'Company'}
        subtitle="Call logs for"
      />

      <CallLogFilters filters={filters} onFilterChange={setFilters} />
      <CallLogList callLogs={companyCallLogs} isLoading={isLoading} />
    </div>
  );
}