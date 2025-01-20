import React, { useEffect, useState } from 'react';
import { Package, Plus, Pencil } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState } from './EmptyState';
import { PageHeader } from '../shared/PageHeader';
import { Dialog } from '../shared/Dialog';
import { getToken } from '../../utils/auth';
import { Product, getProducts, updateProduct } from '../../services/products';
import { Company, getCompanyById } from '../../services/companies';
import { useToast } from '../../context/ToastContext';

export function CompanyProducts() {
  const { companyId } = useParams();
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [productForm, setProductForm] = useState({
    product_name: '',
    description: ''
  });

  useEffect(() => {
    if (editingProduct) {
      setProductForm({
        product_name: editingProduct.product_name,
        description: editingProduct.description || ''
      });
    }
  }, [editingProduct]);

  useEffect(() => {
    async function fetchData() {
      if (!companyId) return;

      try {
        const token = getToken();
        if (!token) {
          setError('Authentication token not found');
          showToast('Authentication failed. Please try logging in again.', 'error');
          return;
        }

        // Fetch both company details and products in parallel
        const [companyData, productsData] = await Promise.all([
          getCompanyById(token, companyId),
          getProducts(token, companyId)
        ]);

        setCompany(companyData);
        setProducts(productsData);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        const errorMessage = 'Failed to fetch data';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [companyId, showToast]);

  const addProductButton = (
    <Link
      to={`/companies/${companyId}/products/new`}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
    >
      <Plus className="h-5 w-5 mr-2" />
      Add Product
    </Link>
  );

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
  };

  const handleCloseDialog = () => {
    setEditingProduct(null);
    setProductForm({ product_name: '', description: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !companyId) return;

    try {
      setIsUpdating(true);
      const token = getToken();
      if (!token) {
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      const updatedProduct = await updateProduct(token, companyId, editingProduct.id, productForm);
      
      // Update the products list with the updated product
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === updatedProduct.id ? updatedProduct : p
        )
      );

      showToast('Product updated successfully', 'success');
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating product:', error);
      showToast('Failed to update product', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

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
        subtitle="Products for"
        action={addProductButton}
      />

      {products.length === 0 ? (
        <div className="mt-8 max-w-md mx-auto">
          <EmptyState
            title="No products yet"
            description="Get started by adding your first product to this company."
            actionLink={`/companies/${companyId}/products/new`}
            actionText="Add your first product"
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Package className="h-6 w-6 text-indigo-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold">{product.product_name}</h3>
                    {product.description && (
                      <p className="text-gray-600 text-sm mt-1">{product.description}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleEditClick(product)}
                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Pencil className="h-3.5 w-3.5 mr-1" />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        isOpen={Boolean(editingProduct)}
        onClose={handleCloseDialog}
        title="Edit Product"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="product_name" className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              id="product_name"
              name="product_name"
              value={productForm.product_name}
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
              value={productForm.description}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
            <button
              type="button"
              onClick={handleCloseDialog}
              className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}