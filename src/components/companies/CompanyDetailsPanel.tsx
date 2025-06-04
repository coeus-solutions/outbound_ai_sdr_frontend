import React, { useState, useEffect } from 'react';
import { Building2, Globe, X, Package, ExternalLink, Pencil, Loader, Trash2 } from 'lucide-react';
import type { Company } from '../../services/companies';
import { useToast } from '../../context/ToastContext';
import { getToken } from '../../utils/auth';
import { Link } from 'react-router-dom';
import { LoadingButton } from '../shared/LoadingButton';
import { Product, getProducts } from '../../services/products';
import { apiEndpoints } from '../../config';
import { DeleteProductModal } from './DeleteProductModal';

interface CompanyDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
  onCompanyUpdate: (updatedCompany: Company) => void;
}

export function CompanyDetailsPanel({ isOpen, onClose, company, onCompanyUpdate }: CompanyDetailsPanelProps) {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedCompany, setEditedCompany] = useState<Company | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Initialize edit form when company changes
  React.useEffect(() => {
    setEditedCompany(company);
    setIsEditing(false);
  }, [company]);

  // Fetch products when panel opens
  useEffect(() => {
    if (isOpen && company) {
      fetchProducts(company.id);
    } else {
      setProducts([]);
    }
  }, [isOpen, company]);

  const fetchProducts = async (companyId: string) => {
    try {
      setIsLoadingProducts(true);
      const token = getToken();
      if (!token) {
        showToast('Authentication failed', 'error');
        return;
      }
      
      const productsData = await getProducts(token, companyId);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast('Failed to fetch products', 'error');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  if (!isOpen || !company) return null;

  const handleSave = async () => {
    if (!editedCompany) return;

    try {
      setIsSaving(true);
      const token = getToken();
      if (!token) {
        showToast('Authentication failed', 'error');
        return;
      }

      const response = await fetch(`${apiEndpoints.companies.list()}/${editedCompany.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editedCompany),
      });

      if (!response.ok) {
        throw new Error('Failed to update company');
      }

      const updatedCompany: Company = await response.json();
      onCompanyUpdate(updatedCompany);
      setIsEditing(false);
      showToast('Company details updated successfully', 'success');
    } catch (error) {
      console.error('Error updating company:', error);
      showToast('Failed to update company details', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSuccess = () => {
    if (productToDelete && company) {
      // Remove the deleted product from the local state
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productToDelete.id));
      
      // Update the company object to reflect the deleted product
      if (company) {
        const updatedCompany = {
          ...company,
          products: company.products.filter(p => p.id !== productToDelete.id)
        };
        
        // Propagate the change to the parent component
        onCompanyUpdate(updatedCompany);
      }
    }
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } z-50`}
    >
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Building2 className="h-6 w-6 text-gray-400 mr-3" />
            <h2 className="text-lg font-semibold text-gray-900">{company.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto h-full pb-32">
        <div className="px-6 py-4 space-y-6">
          {/* URL Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                Website
              </h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Edit
                </button>
              )}
            </div>
            {isEditing ? (
              <input
                type="url"
                value={editedCompany?.website || ''}
                onChange={(e) => setEditedCompany(prev => prev ? { ...prev, website: e.target.value } : null)}
                className="form-input block w-full text-sm"
                placeholder="https://example.com"
              />
            ) : (
              company.website ? (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
                >
                  {company.website}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              ) : (
                <span className="text-sm text-gray-500">No website provided</span>
              )
            )}
          </div>

          {/* Overview Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Overview</h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Edit
                </button>
              )}
            </div>
            {isEditing ? (
              <textarea
                value={editedCompany?.overview || ''}
                onChange={(e) => setEditedCompany(prev => prev ? { ...prev, overview: e.target.value } : null)}
                className="form-textarea block w-full text-sm"
                rows={4}
                placeholder="Enter company overview..."
              />
            ) : (
              <p className="text-sm text-gray-600">
                {company.overview || 'No overview provided'}
              </p>
            )}
          </div>

          {/* Products Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Products & Services
              </h3>
              <Link
                to={`/companies/${company.id}/products`}
                className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
              >
                View Products
              </Link>
            </div>
            <div className="space-y-3">
              {isLoadingProducts ? (
                <div className="flex items-center justify-center py-6">
                  <Loader className="h-6 w-6 text-indigo-600 animate-spin" />
                  <span className="ml-2 text-sm text-gray-500">Loading products...</span>
                </div>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Link
                      to={`/companies/${company.id}/products/${product.id}/edit`}
                      className="group flex-grow"
                    >
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 flex items-center">
                        {product.product_name || product.name}
                        <Pencil className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h4>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <Package className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No products added yet</p>
                  <Link
                    to={`/companies/${company.id}/products`}
                    className="mt-2 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    View Products
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer with save button when editing */}
      {isEditing && (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setEditedCompany(company);
                setIsEditing(false);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <LoadingButton
              onClick={handleSave}
              isLoading={isSaving}
              loadingText="Saving..."
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Save Changes
            </LoadingButton>
          </div>
        </div>
      )}

      {productToDelete && (
        <DeleteProductModal
          companyId={company.id}
          product={productToDelete}
          isOpen={Boolean(productToDelete)}
          onClose={() => setProductToDelete(null)}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
} 