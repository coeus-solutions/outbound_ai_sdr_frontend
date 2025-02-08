import React, { useEffect, useState } from 'react';
import { Building2, Plus, Package, Phone, Mail, Settings, Eye, ChevronDown, ChevronUp, Target, Linkedin, Lock, ArrowRight, Search, ExternalLink, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getToken } from '../../utils/auth';
import { Company, getCompanies, getCompanyById, deleteCompany } from '../../services/companies';
import { CompanyDetailsDialog } from './CompanyDetailsDialog';
import { Dialog } from '../shared/Dialog';
import { getCompanyProducts, Product } from '../../services/products';
import { getCompanyCampaigns } from '../../services/emailCampaigns';
import { getCompanyEmails } from '../../services/emails';
import { getCompanyCalls } from '../../services/calls';
import { getLeads } from '../../services/leads';
import { useToast } from '../../context/ToastContext';

interface CompanyCardProps {
  company: CompanyWithStats;
  onViewDetails: () => void;
  isLoadingDetails?: boolean;
  onDelete: () => void;
}

export function CompanyList() {
  const { showToast } = useToast();
  const [companies, setCompanies] = useState<CompanyWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingCompanyId, setLoadingCompanyId] = useState<string | null>(null);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ... existing fetchCompanies code ...

  const handleDeleteCompany = async (company: Company) => {
    setCompanyToDelete(company);
  };

  const handleConfirmDelete = async () => {
    if (!companyToDelete) return;

    try {
      setIsDeleting(true);
      const token = getToken();
      if (!token) {
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      await deleteCompany(token, companyToDelete.id);
      setCompanies(companies.filter(c => c.id !== companyToDelete.id));
      showToast('Company deleted successfully', 'success');
      setCompanyToDelete(null);
    } catch (error) {
      console.error('Error deleting company:', error);
      showToast('Failed to delete company', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // ... existing JSX until the CompanyCard mapping ...

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ... existing header JSX ... */}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {companies.length === 0 ? (
          // ... existing empty state JSX ...
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredCompanies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                onViewDetails={() => handleViewDetails(company)}
                isLoadingDetails={loadingCompanyId === company.id}
                onDelete={() => handleDeleteCompany(company)}
              />
            ))}
          </div>
        )}
      </div>

      <CompanyDetailsDialog
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedCompany(null);
        }}
        company={selectedCompany}
      />

      <Dialog
        isOpen={Boolean(companyToDelete)}
        onClose={() => setCompanyToDelete(null)}
        title="Delete Company"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete {companyToDelete?.name}? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setCompanyToDelete(null)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

function CompanyCard({ company, onViewDetails, isLoadingDetails, onDelete }: CompanyCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        {/* Company Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-indigo-600" />
              {company.name}
            </h2>
            {company.website && (
              <a 
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-indigo-600 flex items-center mt-1"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                {company.website}
              </a>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Link
              to={`/companies/${company.id}/products/new`}
              className="p-2 text-gray-400 hover:text-indigo-600"
              title="Add product"
            >
              <Package className="w-5 h-5" />
            </Link>
            <button
              onClick={onViewDetails}
              className="p-2 text-gray-400 hover:text-gray-600"
              disabled={isLoadingDetails}
              title="View company details"
            >
              {isLoadingDetails ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
            <Link 
              to={`/companies/${company.id}/settings`}
              className="p-2 text-gray-400 hover:text-gray-600"
              title="Company settings"
            >
              <Settings className="w-5 h-5" />
            </Link>
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-600"
              title="Delete company"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-400 hover:text-gray-600"
              title={isExpanded ? "Collapse section" : "Expand section"}
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Products Section */}
        {isExpanded && (
          <div className="mt-4">
            {company.products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {company.products.map((product) => (
                  <ProductCard key={product.id} product={product} companyId={company.id} />
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products</h3>
                <p className="text-gray-500 mb-4">Get started by adding your first product/service</p>
                <Link
                  to={`/companies/${company.id}/products/new`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Add Product
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 