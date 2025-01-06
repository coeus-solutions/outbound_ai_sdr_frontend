import React, { useEffect, useState } from 'react';
import { Upload } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { EmptyState } from './EmptyState';
import { LeadTable } from '../leads/LeadTable';
import { FileUpload } from '../shared/FileUpload';
import { PageHeader } from '../shared/PageHeader';
import { getToken } from '../../utils/auth';
import { Lead, getLeads, uploadLeads } from '../../services/leads';
import { Company, getCompanyById } from '../../services/companies';
import { useToast } from '../../context/ToastContext';

export function CompanyLeads() {
  const { companyId } = useParams();
  const { showToast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!companyId) return;

    try {
      const token = getToken();
      if (!token) {
        setError('Authentication token not found');
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      // Fetch both company details and leads in parallel
      const [companyData, leadsData] = await Promise.all([
        getCompanyById(token, companyId),
        getLeads(token, companyId)
      ]);

      setCompany(companyData);
      setLeads(leadsData);
      setError(null);
    } catch (err) {
      const errorMessage = 'Failed to fetch data';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [companyId, showToast]);

  const handleFileUpload = async (file: File) => {
    if (!companyId) return;

    setIsUploading(true);
    try {
      const token = getToken();
      if (!token) {
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      await uploadLeads(token, companyId, file);
      showToast('Leads uploaded successfully!', 'success');
      // Refresh the leads list
      fetchData();
    } catch (err) {
      showToast('Failed to upload leads. Please make sure the CSV file is properly formatted.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const uploadButton = (
    <FileUpload 
      accept=".csv"
      onUpload={handleFileUpload}
      buttonText={isUploading ? 'Uploading...' : 'Upload CSV'}
      icon={<Upload className="h-5 w-5 mr-2" />}
      disabled={isUploading}
    />
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="text-indigo-600 hover:text-indigo-500"
        >
          Try again
        </button>
      </div>
    );
  }

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
            actionText="Learn how to format your CSV"
          />
        </div>
      ) : (
        <LeadTable leads={leads} />
      )}
    </div>
  );
} 