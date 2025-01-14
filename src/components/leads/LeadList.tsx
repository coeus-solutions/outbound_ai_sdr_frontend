import React from 'react';
import { Upload } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Lead } from '../../types';
import { EmptyState } from '../companies/EmptyState';
import { LeadTable } from './LeadTable';
import { FileUpload } from '../shared/FileUpload';
import { PageHeader } from '../shared/PageHeader';
import { mockLeads, mockCompanies } from '../../data/mockData';

export function LeadList() {
  const { companyId } = useParams();
  const leads = mockLeads.filter(lead => lead.companyId === companyId);
  const company = mockCompanies.find(c => c.id === companyId);

  const handleFileUpload = async (file: File) => {
    // Handle CSV file upload and parsing
    console.log('Uploading file:', file);
  };

  const uploadButton = (
    <FileUpload 
      accept=".csv"
      onUpload={handleFileUpload}
      buttonText="Upload CSV"
      icon={<Upload className="h-5 w-5 mr-2" />}
    />
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={company?.name || 'Company'}
        subtitle="Leads for"
        action={uploadButton}
      />

      {leads.length === 0 ? (
        <div className="mt-8 max-w-md mx-auto">
          <EmptyState
            title="No leads yet"
            description="Upload a CSV file to import your leads."
            actionLink="#"
            actionText="CSV import guidelines"
          />
        </div>
      ) : (
        <LeadTable leads={leads} />
      )}
    </div>
  );
}