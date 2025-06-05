import React, { useEffect, useState } from 'react';
import { Upload, UserPlus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Lead, getLeads } from '../../services/leads';
import { EmptyState } from '../companies/EmptyState';
import { LeadTable } from './LeadTable';
import { FileUpload } from '../shared/FileUpload';
import { PageHeader } from '../shared/PageHeader';
import { getToken } from '../../utils/auth';
import { getProducts, Product } from '../../services/products';
import { useToast } from '../../context/ToastContext';
import { AddLeadPanel } from './AddLeadPanel';

export function LeadList() {
  const { companyId, productId } = useParams();
  const { showToast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddLeadPanelOpen, setIsAddLeadPanelOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLeads = async () => {
    if (!companyId) return;

    try {
      const token = getToken();
      if (!token) {
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      const leadsData = await getLeads(token, companyId);
      setLeads(leadsData);
    } catch (error) {
      console.error('Error fetching leads:', error);
      showToast('Failed to fetch leads', 'error');
    }
  };

  useEffect(() => {
    async function fetchData() {
      if (!companyId || !productId) return;

      try {
        setIsLoading(true);
        const token = getToken();
        if (!token) {
          showToast('Authentication failed. Please try logging in again.', 'error');
          return;
        }

        // Fetch both products and leads in parallel
        const [productsData, leadsData] = await Promise.all([
          getProducts(token, companyId),
          getLeads(token, companyId)
        ]);

        const currentProduct = productsData.find(p => p.id === productId);
        if (currentProduct) {
          setProduct(currentProduct);
        }
        setLeads(leadsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        showToast('Failed to fetch data', 'error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [companyId, productId, showToast]);

  const handleFileUpload = async (file: File) => {
    // Handle CSV file upload and parsing
    console.log('Uploading file:', file);
  };

  const handleAddLeadClick = () => {
    setIsAddLeadPanelOpen(true);
  };

  const handleLeadAdded = () => {
    fetchLeads();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // In a real implementation, this would fetch the specific page of leads
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // In a real implementation, this would search for leads matching the term
  };

  const uploadButton = (
    <div className="flex space-x-2">
      <button
        onClick={handleAddLeadClick}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <UserPlus className="h-5 w-5 mr-2" />
        Add Lead
      </button>
      <FileUpload 
        accept=".csv"
        onUpload={handleFileUpload}
        buttonText="Upload CSV"
        icon={<Upload className="h-5 w-5 mr-2" />}
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

  return (
    <div className="space-y-6">
      <PageHeader
        title={product?.product_name || 'Product'}
        subtitle="Leads for"
        action={uploadButton}
        showBackButton={false}
      />

      {leads.length === 0 ? (
        <div className="mt-8 max-w-md mx-auto">
          <EmptyState
            title="No leads yet"
            description="Upload a CSV file to import your leads or add them manually."
            actionLink="#"
            actionText="CSV import guidelines"
          />
        </div>
      ) : (
        <LeadTable 
          leads={leads}
          currentPage={currentPage}
          totalPages={Math.ceil(leads.length / 10)}
          totalItems={leads.length}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
          searchTerm={searchTerm}
          isLoading={isLoading}
          onLeadsDeleted={fetchLeads}
        />
      )}

      <AddLeadPanel 
        isOpen={isAddLeadPanelOpen}
        onClose={() => setIsAddLeadPanelOpen(false)}
        companyId={companyId || ''}
        onLeadAdded={handleLeadAdded}
      />
    </div>
  );
}