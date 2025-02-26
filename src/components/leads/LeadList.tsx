import React, { useEffect, useState } from 'react';
import { Upload, Clock } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Lead, getLeads, uploadLeads } from '../../services/leads';
import { EmptyState } from '../companies/EmptyState';
import { LeadTable } from './LeadTable';
import { FileUpload } from '../shared/FileUpload';
import { PageHeader } from '../shared/PageHeader';
import { getToken } from '../../utils/auth';
import { getProducts, Product } from '../../services/products';
import { useToast } from '../../context/ToastContext';
import { CsvFormatDialog } from '../companies/CsvFormatDialog';

interface UploadStatus {
  taskId: string;
  fileName: string;
  timestamp: Date;
}

export function LeadList() {
  const { companyId, productId } = useParams();
  const { showToast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isFormatDialogOpen, setIsFormatDialogOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);

  const fetchData = async () => {
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
  };

  useEffect(() => {
    fetchData();
  }, [companyId, productId, showToast]);

  const handleFileUpload = async (file: File) => {
    if (!companyId) return;

    setIsUploading(true);
    try {
      console.log('Uploading file:', file);
      const token = getToken();
      if (!token) {
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      const response = await uploadLeads(token, companyId, file);
      
      // Store the task ID and file information
      if (response && response.task_id) {
        setUploadStatus({
          taskId: response.task_id,
          fileName: file.name,
          timestamp: new Date()
        });
      }
      
      showToast('Data Queued. Please check back in a few minutes.', 'success');
      // We'll refresh data after upload completes
    } catch (error) {
      console.error('Error uploading leads:', error);
      showToast('Failed to upload leads. Please make sure the CSV file is properly formatted.', 'error');
    } finally {
      setIsUploading(false);
    }
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

  return (
    <div className="space-y-6">
      <PageHeader
        title={product?.product_name || 'Product'}
        subtitle="Leads for"
        action={uploadButton}
      />

      {uploadStatus && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">File upload in progress</h3>
              <p className="mt-1 text-sm text-blue-600">
                Your file "{uploadStatus.fileName}" is being processed. 
                This might take a few minutes depending on the file size.
              </p>
              <p className="mt-1 text-xs text-blue-500">
                Task ID: {uploadStatus.taskId}
              </p>
              <p className="mt-1 text-xs text-blue-400">
                Started at: {uploadStatus.timestamp.toLocaleTimeString()}
              </p>
              <button 
                onClick={fetchData} 
                className="mt-2 text-sm font-medium text-blue-700 hover:text-blue-800"
              >
                Refresh data
              </button>
            </div>
          </div>
        </div>
      )}

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
        <LeadTable leads={leads} onLeadsDeleted={fetchData} />
      )}

      <CsvFormatDialog
        isOpen={isFormatDialogOpen}
        onClose={() => setIsFormatDialogOpen(false)}
      />
    </div>
  );
}