import React, { useState, useEffect } from 'react';
import { Lead } from '../../services/leads';
import { Product, getProducts } from '../../services/products';
import { Mail, Phone, Building2, Facebook, Twitter, Briefcase } from 'lucide-react';
import { CallDialog } from './CallDialog';
import { useParams } from 'react-router-dom';
import { getToken } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';
import { startCall } from '../../services/calls';
import * as Tooltip from '@radix-ui/react-tooltip';

interface LeadTableProps {
  leads: Lead[];
}

export function LeadTable({ leads }: LeadTableProps) {
  const { companyId } = useParams();
  const { showToast } = useToast();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      if (!companyId) return;

      setIsLoadingProducts(true);
      try {
        const token = getToken();
        if (!token) {
          showToast('Authentication failed. Please try logging in again.', 'error');
          return;
        }

        const productsData = await getProducts(token, companyId);
        setProducts(productsData);
      } catch (err) {
        showToast('Failed to fetch products', 'error');
      } finally {
        setIsLoadingProducts(false);
      }
    }

    fetchProducts();
  }, [companyId, showToast]);

  const handleInitiateCall = async (productId: string) => {
    if (selectedLead) {
      try {
        const token = getToken();
        if (!token) {
          showToast('Authentication failed. Please try logging in again.', 'error');
          return;
        }

        if (!companyId) {
          showToast('Company ID is missing', 'error');
          return;
        }

        await startCall(token, companyId, selectedLead.id, productId);
        showToast('Call initiated successfully', 'success');
      } catch (err) {
        console.error('Error initiating call:', err);
        showToast('Failed to initiate call', 'error');
      }
      setIsCallDialogOpen(false);
      setSelectedLead(null);
    }
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Social</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {lead.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      {lead.email && (
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          <a href={`mailto:${lead.email}`} className="hover:text-indigo-600">
                            {lead.email}
                          </a>
                        </div>
                      )}
                      {lead.phone_number && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          <a href={`tel:${lead.phone_number}`} className="hover:text-indigo-600">
                            {lead.phone_number}
                          </a>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      {lead.company && (
                        <div className="flex items-center text-sm text-gray-900">
                          <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                          {lead.company}
                        </div>
                      )}
                      {lead.company_size && (
                        <div className="text-sm text-gray-500">
                          Size: {lead.company_size}
                        </div>
                      )}
                      {lead.company_revenue && (
                        <div className="text-sm text-gray-500">
                          Revenue: {lead.company_revenue}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {lead.job_title && (
                      <div className="flex items-center text-sm text-gray-900">
                        <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                        {lead.job_title}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-3">
                      {lead.company_facebook && (
                        <a
                          href={lead.company_facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-500"
                        >
                          <Facebook className="h-5 w-5" />
                        </a>
                      )}
                      {lead.company_twitter && (
                        <a
                          href={lead.company_twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-400"
                        >
                          <Twitter className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Tooltip.Provider>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <button
                            onClick={() => {
                              setSelectedLead(lead);
                              setIsCallDialogOpen(true);
                            }}
                            disabled={isLoadingProducts || products.length === 0 || !lead.phone_number}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            {isLoadingProducts ? 'Loading...' : 'Call'}
                          </button>
                        </Tooltip.Trigger>
                        {(isLoadingProducts || products.length === 0 || !lead.phone_number) && (
                          <Tooltip.Portal>
                            <Tooltip.Content
                              className="bg-gray-900 text-white px-3 py-1.5 rounded text-xs"
                              sideOffset={5}
                            >
                              {!lead.phone_number 
                                ? "This lead doesn't have a phone number"
                                : isLoadingProducts
                                ? "Loading products..."
                                : products.length === 0
                                ? "No products available"
                                : null}
                              <Tooltip.Arrow className="fill-gray-900" />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        )}
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CallDialog
        isOpen={isCallDialogOpen}
        onClose={() => {
          setIsCallDialogOpen(false);
          setSelectedLead(null);
        }}
        products={products}
        lead={selectedLead}
        onInitiateCall={handleInitiateCall}
      />
    </>
  );
}