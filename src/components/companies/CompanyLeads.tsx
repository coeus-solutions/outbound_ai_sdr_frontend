import React, { useEffect, useState } from 'react';
import { Upload, UserPlus, HelpCircle, History } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { EmptyState } from './EmptyState';
import { LeadTable } from '../leads/LeadTable';
import { FileUpload } from '../shared/FileUpload';
import { PageHeader } from '../shared/PageHeader';
import { getToken } from '../../utils/auth';
import { Lead, getCompanyLeads } from '../../services/companies';
import { Company, getCompanyById } from '../../services/companies';
import { uploadLeads } from '../../services/leads';
import { useToast } from '../../context/ToastContext';
import { CsvFormatDialog } from './CsvFormatDialog';
import { useDebounce } from '../../hooks/useDebounce';
import { AddLeadPanel } from '../leads/AddLeadPanel';

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
  const [isAddLeadPanelOpen, setIsAddLeadPanelOpen] = useState(false);

  // Add debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchData = async (page: number = 1, search?: string) => {
    if (!companyId) return;

    try {
      setIsLoading(true);
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
    fetchData(currentPage, debouncedSearchTerm);
  }, [companyId, currentPage, debouncedSearchTerm, showToast]);

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
      console.error('Error uploading leads:', error);
      showToast(error instanceof Error ? error.message : 'Failed to upload leads', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsLoading(true);
    fetchData(page, searchTerm);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleAddLeadClick = () => {
    setIsAddLeadPanelOpen(true);
  };

  const handleLeadAdded = () => {
    fetchData(currentPage, searchTerm);
  };

  const uploadButton = (
    <div className="flex items-center gap-3">
      <button
        onClick={handleAddLeadClick}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <UserPlus className="h-5 w-5 mr-2" />
        Add Lead
      </button>
      <div className="flex items-center">
        <FileUpload 
          accept=".csv"
          onUpload={handleFileUpload}
          buttonText={isUploading ? 'Uploading...' : 'Upload CSV'}
          icon={<Upload className="h-5 w-5 mr-2" />}
          disabled={isUploading}
        />
        <button
          onClick={() => setIsFormatDialogOpen(true)}
          className="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="CSV import guidelines"
          title="CSV import guidelines"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
        <Link
          to={`/companies/${companyId}/upload-history`}
          className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <History className="h-5 w-5 mr-2" />
          Upload History
        </Link>
      </div>
    </div>
  );

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

      {(!isLoading && leads.length === 0 && !searchTerm) ? (
        <div className="mt-8 max-w-md mx-auto">
          <EmptyState
            title="No leads yet"
            description="Upload a CSV file to import your leads or add them manually."
            actionLink="#"
            actionText="CSV import guidelines"
            onAction={() => setIsFormatDialogOpen(true)}
          />
        </div>
      ) : (
        <LeadTable 
          leads={isLoading ? [] : leads} 
          onLeadsDeleted={() => fetchData(currentPage)}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalLeads}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          searchTerm={searchTerm}
          isLoading={isLoading}
        />
      )}

      <CsvFormatDialog
        isOpen={isFormatDialogOpen}
        onClose={() => setIsFormatDialogOpen(false)}
      />

      <AddLeadPanel 
        isOpen={isAddLeadPanelOpen}
        onClose={() => setIsAddLeadPanelOpen(false)}
        companyId={companyId || ''}
        onLeadAdded={handleLeadAdded}
      />
    </div>
  );
} 