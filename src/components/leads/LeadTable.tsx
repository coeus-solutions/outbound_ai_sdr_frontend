import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Building2, Mail, Phone, Briefcase, Facebook, Twitter, ChevronRight } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useToast } from '../../context/ToastContext';
import { getToken } from '../../utils/auth';
import { getProducts, Product } from '../../services/products';
import { Lead, LeadDetail, getLeadDetails } from '../../services/leads';
import { startCall } from '../../services/calls';
import { CallDialog } from './CallDialog';
import { LeadDetailsPanel } from './LeadDetailsPanel';

interface LeadTableProps {
  leads: Lead[];
}

export function LeadTable({ leads }: LeadTableProps) {
  const { companyId } = useParams();
  const { showToast } = useToast();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedLeadDetails, setSelectedLeadDetails] = useState<LeadDetail | null>(null);
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      if (!companyId) return;

      try {
        const token = getToken();
        if (!token) {
          showToast('Authentication failed. Please try logging in again.', 'error');
          return;
        }

        const productsData = await getProducts(token, companyId);
        setProducts(productsData);
      } catch (error) {
        showToast('Failed to fetch products', 'error');
        console.error('Error fetching products:', error);
      }
    }

    fetchProducts();
  }, [companyId, showToast]);

  const handleLeadClick = async (lead: Lead) => {
    if (!companyId) return;

    setSelectedLead(lead);
    setIsDetailsPanelOpen(true);

    try {
      const token = getToken();
      if (!token) {
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      const details = await getLeadDetails(token, companyId, lead.id);
      setSelectedLeadDetails(details);
    } catch (error) {
      showToast('Failed to fetch lead details', 'error');
      console.error('Error fetching lead details:', error);
      setIsDetailsPanelOpen(false);
    }
  };

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
      } catch (error) {
        console.error('Error initiating call:', error);
        showToast('Failed to initiate call', 'error');
      }
      setIsCallDialogOpen(false);
      setSelectedLead(null);
    }
  };

  return (
    <>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Contact
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Company
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Job Title
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Social
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {leads.map((lead) => (
                    <tr 
                      key={lead.id} 
                      onClick={() => handleLeadClick(lead)}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {lead.name}
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
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Tooltip.Provider>
                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLeadClick(lead);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <ChevronRight className="h-5 w-5" />
                              </button>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                              <Tooltip.Content
                                className="bg-gray-900 text-white px-3 py-1.5 rounded text-xs"
                                sideOffset={5}
                              >
                                View Details
                                <Tooltip.Arrow className="fill-gray-900" />
                              </Tooltip.Content>
                            </Tooltip.Portal>
                          </Tooltip.Root>
                        </Tooltip.Provider>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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

      <LeadDetailsPanel
        isOpen={isDetailsPanelOpen}
        onClose={() => {
          setIsDetailsPanelOpen(false);
          setSelectedLeadDetails(null);
        }}
        leadDetails={selectedLeadDetails}
      />
    </>
  );
}