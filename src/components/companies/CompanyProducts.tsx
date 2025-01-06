import React, { useEffect, useState } from 'react';
import { Package, Plus } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState } from './EmptyState';
import { PageHeader } from '../shared/PageHeader';
import { getToken } from '../../utils/auth';
import { Product, getProducts } from '../../services/products';
import { Company, getCompanyById } from '../../services/companies';
import { useToast } from '../../context/ToastContext';

export function CompanyProducts() {
  const { companyId } = useParams();
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
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
              <div className="flex items-start space-x-3">
                <Package className="h-6 w-6 text-indigo-600 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold">{product.product_name}</h3>
                  {product.description && (
                    <p className="text-gray-600 text-sm mt-1">{product.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}