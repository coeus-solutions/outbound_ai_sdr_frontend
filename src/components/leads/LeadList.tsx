import React, { useEffect, useState } from 'react';
import { Upload } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Lead, getLeads } from '../../services/leads';
import { EmptyState } from '../companies/EmptyState';
import { LeadTable } from './LeadTable';
import { FileUpload } from '../shared/FileUpload';
import { PageHeader } from '../shared/PageHeader';
import { getToken } from '../../utils/auth';
import { getProducts, Product } from '../../services/products';
import { useToast } from '../../context/ToastContext';

export function LeadList() {
  const { companyId, productId } = useParams();
  const { showToast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!companyId || !productId) return;

      try {
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

  const uploadButton = (
    <FileUpload 
      accept=".csv"
      onUpload={handleFileUpload}
      buttonText="Upload CSV"
      icon={<Upload className="h-5 w-5 mr-2" />}
    />
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