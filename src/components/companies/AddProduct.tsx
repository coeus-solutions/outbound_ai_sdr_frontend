import React, { useState, useRef, useEffect } from 'react';
import { Package, Upload, Globe } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getToken } from '../../utils/auth';
import { createProduct, getProduct, updateProduct } from '../../services/products';
import { useToast } from '../../context/ToastContext';
import { getCompanyById } from '../../services/companies';
import { PageHeader } from '../shared/PageHeader';

export function AddProduct() {
  const navigate = useNavigate();
  const { companyId, productId } = useParams();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!productId);
  const [error, setError] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [formData, setFormData] = useState({
    product_name: '',
    product_url: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchData() {
      if (!companyId) return;
      try {
        const token = getToken();
        if (!token) {
          setError('Authentication token not found');
          return;
        }

        // Fetch company name
        const company = await getCompanyById(token, companyId);
        setCompanyName(company.name);

        // If editing, fetch product details
        if (productId) {
          const product = await getProduct(token, companyId, productId);
          setFormData({
            product_name: product.product_name,
            product_url: product.product_url || '',  // Use product_url instead of url
          });
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        showToast('Failed to fetch data', 'error');
      } finally {
        setIsFetching(false);
      }
    }
    fetchData();
  }, [companyId, productId, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) return;

    if (!productId && !selectedFile) {
      showToast('Please upload a documentation file', 'error');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) {
        setError('Authentication token not found');
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      // Normalize URL if provided (add https:// if missing)
      let normalizedUrl = formData.product_url;
      if (normalizedUrl && !normalizedUrl.match(/^https?:\/\//)) {
        normalizedUrl = `https://${normalizedUrl}`;
      }

      if (productId) {
        // Update existing product
        await updateProduct(token, companyId, productId, {
          product_name: formData.product_name,
          product_url: normalizedUrl,
        });
        showToast('Product updated successfully!', 'success');
      } else {
        // Create new product
        await createProduct(token, companyId, {
          product_name: formData.product_name,
          product_url: normalizedUrl,
          file: selectedFile || undefined,
        });
        showToast('Product created successfully!', 'success');
      }

      navigate(`/companies/${companyId}/products`);
    } catch (error) {
      const errorMessage = productId ? 'Failed to update product' : 'Failed to create product';
      setError(errorMessage);
      showToast(`${errorMessage}. Please try again.`, 'error');
      console.error(errorMessage, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['docx', 'pdf', 'txt'];
    
    if (!extension || !allowedExtensions.includes(extension)) {
      showToast('Only .docx, .pdf, and .txt files are allowed', 'error');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setSelectedFile(null);
      return;
    }

    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      showToast('File size must be less than 10MB', 'error');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title={productId ? "Edit Product" : "Add New Product"}
        subtitle={`for ${companyName}`}
        showBackButton={false}
      />
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="product_name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
              <span className="text-red-500"> *</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Package className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="product_name"
                name="product_name"
                required
                value={formData.product_name}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your product or value proposition name"
              />
            </div>
          </div>

          {!productId && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Documentation File
                  <span className="text-red-500"> *</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload documentation</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          ref={fileInputRef}
                          className="sr-only"
                          onChange={handleFileChange}
                          accept=".docx,.pdf,.txt"
                          required
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      Upload product documentation, sales materials, or value proposition details (.docx, .pdf, .txt)
                    </p>
                    <p className="text-xs text-gray-500">
                      Maximum file size: 10MB
                    </p>
                    {selectedFile && (
                      <p className="text-sm text-gray-600">
                        Selected file: {selectedFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="product_url" className="block text-sm font-medium text-gray-700 mb-1">
                  Product URL
                  <span className="text-gray-500 font-normal"> (Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    id="product_url"
                    name="product_url"
                    value={formData.product_url}
                    onChange={handleChange}
                    className="form-input pl-10"
                    placeholder="https://example.com/product"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Link to your product page. Adding a URL will automatically enrich your product with additional information using AI.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/companies/${companyId}/products`)}
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {productId ? 'Saving...' : 'Creating...'}
              </div>
            ) : (
              productId ? 'Save Changes' : 'Add Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}