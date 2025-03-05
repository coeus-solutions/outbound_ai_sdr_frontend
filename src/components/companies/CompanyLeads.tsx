import React, { useEffect, useState } from 'react';
import { Upload } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { EmptyState } from './EmptyState';
import { LeadTable } from '../leads/LeadTable';
import { FileUpload } from '../shared/FileUpload';
import { PageHeader } from '../shared/PageHeader';
import { getToken } from '../../utils/auth';
import { Lead, PaginatedLeadResponse, getCompanyLeads } from '../../services/companies';
import { Company, getCompanyById } from '../../services/companies';
import { uploadLeads } from '../../services/leads';
import { useToast } from '../../context/ToastContext';
import { CsvFormatDialog } from './CsvFormatDialog';

export function CompanyLeads() {
  const { companyId } = useParams();
  const { showToast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormatDialogOpen, setIsFormatDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize] = useState(20);

  const fetchData = async (page: number = 1, search?: string) => {
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
        getCompanyLeads(token, companyId, page, pageSize, search)
      ]);

      setCompany(companyData);
      setLeads(leadsData.items);
      setTotalPages(leadsData.total_pages);
      setTotalLeads(leadsData.total);
      setError(null);
    } catch (error) {
      const errorMessage = 'Failed to fetch data';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, searchTerm);
  }, [companyId, currentPage, searchTerm, showToast]);

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
      showToast('Data Queued. Please check back in a few minutes.', 'success');
      // Refresh the first page after upload
      fetchData(1);
    } catch (error) {
      showToast('Failed to upload leads. Please make sure the CSV file is properly formatted.', 'error');
      console.error('Error uploading leads:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  const uploadButton = (
    <div className="flex items-center gap-3">
      {leads.length > 0 && (
        <button
          onClick={() => setIsFormatDialogOpen(true)}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          CSV import guidelines
        </button>
      )}
      <FileUpload 
        accept=".csv"
        onUpload={handleFileUpload}
        buttonText={isUploading ? 'Uploading...' : 'Upload CSV'}
        icon={<Upload className="h-5 w-5 mr-2" />}
        disabled={isUploading}
      />
    </div>
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
            actionText="CSV import guidelines"
            onAction={() => setIsFormatDialogOpen(true)}
          />
        </div>
      ) : (
        <LeadTable 
          leads={leads} 
          onLeadsDeleted={() => fetchData(currentPage)}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalLeads}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          searchTerm={searchTerm}
        />
      )}

      <CsvFormatDialog
        isOpen={isFormatDialogOpen}
        onClose={() => setIsFormatDialogOpen(false)}
      />
    </div>
  );
} 