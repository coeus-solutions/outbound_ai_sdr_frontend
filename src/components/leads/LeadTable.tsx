import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Building2, Phone, Mail, Search, ChevronRight, X, Loader2, Trash2, Briefcase, Facebook, Twitter } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useToast } from '../../context/ToastContext';
import { getToken } from '../../utils/auth';
import { getProducts, Product } from '../../services/products';
import { Lead, LeadDetail, getLeadDetails, deleteLeads } from '../../services/leads';
import { startCall } from '../../services/calls';
import { CallDialog } from './CallDialog';
import { LeadDetailsPanel } from './LeadDetailsPanel';
import { useDebounce } from '../../hooks/useDebounce';

interface LeadTableProps {
  leads: Lead[];
  onLeadsDeleted?: () => void;
}

export function LeadTable({ leads, onLeadsDeleted }: LeadTableProps) {
  const { companyId } = useParams();
  const { showToast } = useToast();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedLeadDetails, setSelectedLeadDetails] = useState<LeadDetail | null>(null);
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingProgress, setDeletingProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // 300ms delay
  
  const ITEMS_PER_PAGE = 10;

  // Filter leads based on debounced search query
  const filteredLeads = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return leads;
    
    const query = debouncedSearchQuery.toLowerCase().trim();
    return leads.filter(lead => 
      lead.name?.toLowerCase().includes(query) ||
      lead.email?.toLowerCase().includes(query) ||
      lead.company?.toLowerCase().includes(query) ||
      lead.job_title?.toLowerCase().includes(query)
    );
  }, [leads, debouncedSearchQuery]);

  // Update pagination calculations to use filtered leads
  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentLeads = filteredLeads.slice(startIndex, endIndex);

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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

  const handleSelectAll = () => {
    if (selectedLeads.size === currentLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(currentLeads.map(lead => lead.id)));
    }
  };

  const handleSelectLead = (e: React.MouseEvent, leadId: string) => {
    e.stopPropagation();
    const newSelectedLeads = new Set(selectedLeads);
    if (selectedLeads.has(leadId)) {
      newSelectedLeads.delete(leadId);
    } else {
      newSelectedLeads.add(leadId);
    }
    setSelectedLeads(newSelectedLeads);
  };

  const handleDeleteSelected = async () => {
    if (!companyId || selectedLeads.size === 0 || isDeleting) return;

    try {
      setIsDeleting(true);
      setDeletingProgress(0);
      const token = getToken();
      if (!token) {
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      const selectedLeadsArray = Array.from(selectedLeads);
      let successCount = 0;
      let failureCount = 0;

      for (let i = 0; i < selectedLeadsArray.length; i++) {
        try {
          await deleteLeads(token, companyId, [selectedLeadsArray[i]]);
          successCount++;
        } catch (error) {
          failureCount++;
          console.error(`Error deleting lead ${selectedLeadsArray[i]}:`, error);
        }
        setDeletingProgress(Math.round(((i + 1) / selectedLeadsArray.length) * 100));
      }

      if (failureCount === 0) {
        showToast('All leads deleted successfully', 'success');
      } else if (successCount === 0) {
        showToast('Failed to delete leads', 'error');
      } else {
        showToast(`Deleted ${successCount} leads, failed to delete ${failureCount} leads`, 'info');
      }

      setSelectedLeads(new Set());
      onLeadsDeleted?.();
    } catch (error) {
      showToast('Failed to delete leads', 'error');
      console.error('Error deleting leads:', error);
    } finally {
      setIsDeleting(false);
      setDeletingProgress(0);
    }
  };

  return (
    <>
      <div className="mt-8 flex flex-col">
        <div className="mb-4 space-y-4">
          {/* Search input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads by name, email, company, or job title..."
              className="form-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-500" />
              </button>
            )}
          </div>

          {/* Actions and pagination row */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSelectAll}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {selectedLeads.size === currentLeads.length ? 'Deselect All' : 'Select All'}
              </button>
              {selectedLeads.size > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Deleting... ({deletingProgress}%)</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Selected ({selectedLeads.size})</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredLeads.length)} of {filteredLeads.length} leads
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="relative py-3.5 pl-4 pr-3 sm:pl-6">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        checked={selectedLeads.size === currentLeads.length && currentLeads.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
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
                  {currentLeads.map((lead) => (
                    <tr 
                      key={lead.id} 
                      onClick={() => handleLeadClick(lead)}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <td className="relative py-4 pl-4 pr-3 sm:pl-6">
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          checked={selectedLeads.has(lead.id)}
                          onChange={(e) => e.stopPropagation()}
                          onClick={(e) => handleSelectLead(e, lead.id)}
                        />
                      </td>
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
          setSelectedLead(null);
          setSelectedLeadDetails(null);
        }}
        leadDetails={selectedLeadDetails}
        onCallClick={() => {
          setIsCallDialogOpen(true);
          setIsDetailsPanelOpen(false);
        }}
      />
    </>
  );
}