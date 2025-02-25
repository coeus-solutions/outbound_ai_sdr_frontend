import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { getToken } from '../../utils/auth';
import { Product, getProduct, updateProduct } from '../../services/products';
import { PageHeader } from '../shared/PageHeader';
import { useToast } from '../../context/ToastContext';
import { EnrichedProductInfo } from './EnrichedProductInfo';

export function EditProduct() {
  const { companyId, productId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    product_name: '',
    description: ''
  });

  useEffect(() => {
    async function fetchProduct() {
      if (!companyId || !productId) return;

      try {
        const token = getToken();
        if (!token) {
          showToast('Authentication failed. Please try logging in again.', 'error');
          return;
        }

        const productData = await getProduct(token, companyId, productId);
        setProduct(productData);
        setForm({
          product_name: productData.product_name,
          description: productData.description || ''
        });
      } catch (error) {
        console.error('Error fetching product:', error);
        showToast('Failed to fetch product details', 'error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [companyId, productId, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId || !productId) return;

    try {
      setIsSaving(true);
      const token = getToken();
      if (!token) {
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      await updateProduct(token, companyId, productId, {
        product_name: form.product_name,
        description: form.description
      });

      showToast('Product updated successfully', 'success');
      navigate(`/companies/${companyId}/products`);
    } catch (error) {
      console.error('Error updating product:', error);
      showToast('Failed to update product', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
        title={product?.product_name || 'Edit Product'}
        subtitle="Edit"
      />

      <div className="bg-white shadow-sm rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="product_name" className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              id="product_name"
              name="product_name"
              value={form.product_name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={form.description}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter product description..."
            />
          </div>

          {product?.product_url && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product URL
              </label>
              <div className="mt-1">
                <a 
                  href={product.product_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  {product.product_url}
                </a>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                The product URL cannot be edited after creation.
              </p>
            </div>
          )}

          {product?.file_name && product?.original_filename && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Documentation
              </label>
              <div className="mt-1">
                <a 
                  href={`/api/files/${product.file_name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  {product.original_filename}
                </a>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                The documentation file cannot be changed after creation.
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(`/companies/${companyId}/products`)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {product?.enriched_information && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Product Information</h3>
            <EnrichedProductInfo enrichedInfo={product.enriched_information} />
          </div>
        )}
      </div>
    </div>
  );
} 