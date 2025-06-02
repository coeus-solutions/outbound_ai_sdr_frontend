import React, { useEffect, useState } from 'react';
import { Package, Plus, Pencil, Trash2, ExternalLink, Search } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { EmptyState } from './EmptyState';
import { PageHeader } from '../shared/PageHeader';
import { getToken } from '../../utils/auth';
import { Product, getProducts } from '../../services/products';
import { Company, getCompanyById } from '../../services/companies';
import { useToast } from '../../context/ToastContext';
import { DeleteProductModal } from './DeleteProductModal';
import { EnrichedProductInfo } from './EnrichedProductInfo';

// Extended Product type with UI state
interface ProductWithUIState extends Product {
  isExpanded?: boolean;
}

export function CompanyProducts() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [products, setProducts] = useState<ProductWithUIState[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductWithUIState[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<ProductWithUIState | null>(null);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);

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
        setFilteredProducts(productsData);
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

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter(product => 
        product.product_name.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const addProductButton = (
    <Link
      to={`/companies/${companyId}/products/new`}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
    >
      <Plus className="h-5 w-5 mr-2" />
      Add Product
    </Link>
  );

  const handleEditClick = (product: ProductWithUIState) => {
    navigate(`/companies/${companyId}/products/${product.id}/edit`);
  };

  const handleDeleteClick = (product: ProductWithUIState) => {
    setProductToDelete(product);
  };

  const handleDeleteSuccess = () => {
    if (productToDelete) {
      // Remove the deleted product from the list
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productToDelete.id));
      setProductToDelete(null);
    }
  };

  const toggleProductDetails = (productId: string) => {
    setExpandedProductId(expandedProductId === productId ? null : productId);
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
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Search field */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaigns
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Calls
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Emails
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Meetings
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <React.Fragment key={product.id}>
                    <tr 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleProductDetails(product.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <Package className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.product_name}</div>
                            {product.product_url && (
                              <a 
                                href={product.product_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center mt-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Visit Website
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.total_campaigns}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.total_calls}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.total_sent_emails}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.total_meetings_booked_in_calls + product.total_meetings_booked_in_emails}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(product);
                            }}
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            aria-label="Edit product"
                          >
                            <Pencil className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(product);
                            }}
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            aria-label="Delete product"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedProductId === product.id && product.enriched_information && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 bg-gray-50">
                          <div className="border-t border-gray-200 pt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">AI-Enriched Information</h4>
                            <EnrichedProductInfo enrichedInfo={product.enriched_information} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {productToDelete && (
        <DeleteProductModal
          companyId={companyId || ''}
          product={productToDelete}
          isOpen={Boolean(productToDelete)}
          onClose={() => setProductToDelete(null)}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}