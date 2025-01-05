import React from 'react';
import { Package, Plus } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Product } from '../../types';
import { EmptyState } from './EmptyState';
import { PageHeader } from '../shared/PageHeader';
import { mockProducts, mockCompanies } from '../../data/mockData';

export function CompanyProducts() {
  const { companyId } = useParams();
  const products = mockProducts.filter(p => p.companyId === companyId);
  const company = mockCompanies.find(c => c.id === companyId);

  const addProductButton = (
    <Link
      to={`/companies/${companyId}/products/new`}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
    >
      <Plus className="h-5 w-5 mr-2" />
      Add Product
    </Link>
  );

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
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{product.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}