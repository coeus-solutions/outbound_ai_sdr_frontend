import React, { useEffect, useState } from 'react';
import { Building2, Plus, Package, Phone, Mail, Settings, Eye, ChevronDown, ChevronUp, Search, ExternalLink, Trash2, Pencil, Users, Megaphone, Ban, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getToken } from '../../utils/auth';
import { Company, getCompanies, getCompanyById, deleteCompany } from '../../services/companies';
import { Dialog } from '../shared/Dialog';
import { Product } from '../../services/products';
import { Campaign, getCompanyCampaigns } from '../../services/emailCampaigns';
import { useToast } from '../../context/ToastContext';
import { SkeletonLoader } from '../shared/SkeletonLoader';
import { LoadingButton } from '../shared/LoadingButton';
import { CardSkeletonLoader } from '../shared/CardSkeletonLoader';
import { useUserRole } from '../../hooks/useUserRole';
import * as Tooltip from '@radix-ui/react-tooltip';
import { CompanyDetailsPanel } from './CompanyDetailsPanel';
import { DoNotEmailDialog } from './DoNotEmailDialog';

interface ProductStats {
  id: string;
  name: string;
  product_name: string;
  description?: string;
  url?: string;
  file_name?: string;
  total_campaigns: number;
  total_calls: number;
  total_positive_calls: number;
  total_sent_emails: number;
  total_opened_emails: number;
  total_replied_emails: number;
  unique_leads_contacted: number;
  total_meetings_booked_in_calls: number;
  total_meetings_booked_in_emails: number;
}

interface CompanyWithStats extends Omit<Company, 'products'> {
  products: ProductStats[];
}

interface CompanyCardProps {
  company: CompanyWithStats;
  onViewDetails: (company: CompanyWithStats) => void;
  isLoadingDetails?: boolean;
  onDelete: () => void;
}

interface ProductCardProps {
  product: ProductStats;
  companyId: string;
}

export function CompanyList() {
  const { showToast } = useToast();
  const [companies, setCompanies] = useState<CompanyWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingCompanyId, setLoadingCompanyId] = useState<string | null>(null);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const token = getToken();
        if (!token) {
          setError('Authentication token not found');
          return;
        }
        const companiesData = await getCompanies(token);
        
        // Map companies with their products and stats
        const companiesWithProducts = companiesData.map(company => ({
          ...company,
          products: company.products.map(product => ({
            id: product.id,
            name: product.name,
            product_name: product.product_name,
            description: product.description,
            company_id: product.company_id,
            total_campaigns: product.total_campaigns,
            total_calls: product.total_calls,
            total_positive_calls: product.total_positive_calls,
            total_sent_emails: product.total_sent_emails,
            total_opened_emails: product.total_opened_emails,
            total_replied_emails: product.total_replied_emails,
            unique_leads_contacted: product.unique_leads_contacted,
            total_meetings_booked_in_calls: product.total_meetings_booked_in_calls,
            total_meetings_booked_in_emails: product.total_meetings_booked_in_emails
          }))
        }));

        setCompanies(companiesWithProducts);
        setError(null);
      } catch (err) {
        setError('Failed to fetch companies');
        console.error('Error fetching companies:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(company => 
    (company.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.products.some(product => 
      ((product.product_name || product.name || '')).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleViewDetails = async (company: CompanyWithStats) => {
    try {
      setLoadingCompanyId(company.id);
      const token = getToken();
      if (!token) {
        setError('Authentication token not found');
        return;
      }
      const companyDetails = await getCompanyById(token, company.id);
      setSelectedCompany(companyDetails);
      setIsDetailsOpen(true);
    } catch (error) {
      console.error('Error fetching company details:', error);
      showToast('Failed to fetch company details', 'error');
    } finally {
      setLoadingCompanyId(null);
    }
  };

  const handleDeleteCompany = async (company: CompanyWithStats) => {
    setCompanyToDelete({
      ...company,
      products: company.products as unknown as Product[]
    });
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

  const handleCompanyUpdate = (updatedCompany: Company) => {
    setCompanies(companies.map(company => {
      if (company.id === updatedCompany.id) {
        // Map the updated products to the CompanyWithStats product structure
        const updatedProducts = updatedCompany.products.map(product => ({
          id: product.id,
          name: product.name,
          product_name: product.product_name,
          description: product.description,
          company_id: product.company_id,
          total_campaigns: product.total_campaigns || 0,
          total_calls: product.total_calls || 0,
          total_positive_calls: product.total_positive_calls || 0,
          total_sent_emails: product.total_sent_emails || 0,
          total_opened_emails: product.total_opened_emails || 0,
          total_replied_emails: product.total_replied_emails || 0,
          unique_leads_contacted: product.unique_leads_contacted || 0,
          total_meetings_booked_in_calls: product.total_meetings_booked_in_calls || 0,
          total_meetings_booked_in_emails: product.total_meetings_booked_in_emails || 0
        }));
        
        return {
          ...company,
          ...updatedCompany,
          products: updatedProducts
        };
      }
      return company;
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <SkeletonLoader className="h-8 w-48 mb-2" />
                <SkeletonLoader className="h-4 w-64" />
              </div>
              <SkeletonLoader className="h-10 w-32" />
            </div>
            <div className="mt-4">
              <SkeletonLoader className="h-10 w-full" />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 gap-6">
            {[...Array(3)].map((_, index) => (
              <CardSkeletonLoader 
                key={index}
                hasHeader={true}
                hasActions={true}
                actionCount={4}
                contentSections={2}
              />
            ))}
          </div>
        </div>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your companies, products, and campaigns
              </p>
            </div>
            <Link
              to="/companies/new"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Company
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className="mt-4 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search companies or products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-10 w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {companies.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No companies</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new company.</p>
            <div className="mt-6">
              <Link
                to="/companies/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Company
              </Link>
            </div>
          </div>
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
              <LoadingButton
                isLoading={isDeleting}
                loadingText="Deleting..."
                variant="danger"
              >
                Delete
              </LoadingButton>
            </button>
          </div>
        </div>
      </Dialog>

      <CompanyDetailsPanel
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedCompany(null);
        }}
        company={selectedCompany}
        onCompanyUpdate={handleCompanyUpdate}
      />
    </div>
  );
}

function CompanyCard({ company, onViewDetails, isLoadingDetails, onDelete }: CompanyCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDoNotEmailDialogOpen, setIsDoNotEmailDialogOpen] = useState(false);
  const { isAdmin } = useUserRole(company.id);

  if (isLoadingDetails) {
    return <CardSkeletonLoader hasHeader={true} hasActions={true} actionCount={4} contentSections={2} />;
  }

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
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Link
                    to={`/companies/${company.id}/campaigns`}
                    className="p-2 text-gray-400 hover:text-indigo-600"
                  >
                    <Target className="w-5 h-5" />
                  </Link>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-gray-900 text-white px-3 py-1.5 rounded text-xs"
                    sideOffset={5}
                  >
                    Campaigns
                    <Tooltip.Arrow className="fill-gray-900" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>

            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Link
                    to={`/companies/${company.id}/campaign-runs`}
                    className="p-2 text-gray-400 hover:text-indigo-600"
                  >
                    <Megaphone className="w-5 h-5" />
                  </Link>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-gray-900 text-white px-3 py-1.5 rounded text-xs"
                    sideOffset={5}
                  >
                    Campaign Runs
                    <Tooltip.Arrow className="fill-gray-900" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>

            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Link
                    to={`/companies/${company.id}/products/new`}
                    className="p-2 text-gray-400 hover:text-indigo-600"
                  >
                    <Package className="w-5 h-5" />
                  </Link>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-gray-900 text-white px-3 py-1.5 rounded text-xs"
                    sideOffset={5}
                  >
                    Add product
                    <Tooltip.Arrow className="fill-gray-900" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>

            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    onClick={() => onViewDetails(company)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    disabled={isLoadingDetails}
                  >
                    {isLoadingDetails ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-gray-900 text-white px-3 py-1.5 rounded text-xs"
                    sideOffset={5}
                  >
                    View details
                    <Tooltip.Arrow className="fill-gray-900" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>

            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Link 
                    to={`/companies/${company.id}/settings`}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Settings className="w-5 h-5" />
                  </Link>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-gray-900 text-white px-3 py-1.5 rounded text-xs"
                    sideOffset={5}
                  >
                    Settings
                    <Tooltip.Arrow className="fill-gray-900" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>

            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Link 
                    to={`/companies/${company.id}/leads`}
                    className="p-2 text-gray-400 hover:text-indigo-600"
                  >
                    <Users className="w-5 h-5" />
                  </Link>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-gray-900 text-white px-3 py-1.5 rounded text-xs"
                    sideOffset={5}
                  >
                    View Leads
                    <Tooltip.Arrow className="fill-gray-900" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>

            {/* Do Not Email Button */}
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    onClick={() => setIsDoNotEmailDialogOpen(true)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <Ban className="w-5 h-5" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-gray-900 text-white px-3 py-1.5 rounded text-xs"
                    sideOffset={5}
                  >
                    View do-not-email list
                    <Tooltip.Arrow className="fill-gray-900" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>

            {/* Delete Button - Admin Only */}
            {isAdmin && (
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      onClick={onDelete}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="bg-gray-900 text-white px-3 py-1.5 rounded text-xs"
                      sideOffset={5}
                    >
                      Delete company
                      <Tooltip.Arrow className="fill-gray-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            )}

            {/* Expand/Collapse Button */}
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Products Section */}
        {isExpanded && (
          <div className="space-y-4">
            {company.products.length > 0 ? (
              company.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  companyId={company.id}
                />
              ))
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No products/value props yet</h3>
                <div className="mt-2 px-4">
                  <p className="text-sm text-gray-600">Products/Value Props are the foundation of your lead generation campaigns.</p>
                  <div className="mt-3 space-y-2">
                    <p className="text-sm text-gray-600">Here's how it works:</p>
                    <ol className="text-left text-sm text-gray-600 space-y-2 list-decimal list-inside">
                      <li>Add a product or service with its value proposition</li>
                      <li>Upload your product documentation or sales materials</li>
                      <li>Create targeted email or call campaigns</li>
                      <li>Generate and nurture leads based on your value proposition</li>
                    </ol>
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    to={`/companies/${company.id}/products/new`}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Package className="h-5 w-5 mr-2" />
                    Add Your First Product
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Do Not Email Dialog */}
      <DoNotEmailDialog
        isOpen={isDoNotEmailDialogOpen}
        onClose={() => setIsDoNotEmailDialogOpen(false)}
        companyId={company.id}
      />
    </div>
  );
}

function ProductCard({ product, companyId }: ProductCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (isExpanded) {
      fetchCampaigns();
    }
  }, [isExpanded, companyId, product.id]);

  const fetchCampaigns = async () => {
    try {
      setIsLoadingCampaigns(true);
      const token = getToken();
      if (!token) {
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      const campaignsData = await getCompanyCampaigns(token, companyId);
      // Filter campaigns for this product
      const productCampaigns = campaignsData.filter(campaign => campaign.product_id === product.id);
      setCampaigns(productCampaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      showToast('Failed to fetch campaigns', 'error');
    } finally {
      setIsLoadingCampaigns(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-3">
          <Package className="w-5 h-5 text-green-600 mt-1" />
          <div className="flex-1">
            <Link
              to={`/companies/${companyId}/products/${product.id}/edit`}
              className="group"
            >
              <h4 className="font-medium text-gray-900 text-base group-hover:text-indigo-600 flex items-center">
                {product.product_name || product.name}
                <Pencil className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              {product.description && (
                <p className="text-sm text-gray-600 mt-1">{product.description}</p>
              )}
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded-lg">
              <p className="text-xs text-gray-500">Active Campaigns</p>
              <p className="text-lg font-semibold mt-1">{product.total_campaigns}</p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="text-xs text-gray-500">Total Calls</p>
              <p className="text-lg font-semibold mt-1">{product.total_calls}</p>
              <p className="text-xs text-gray-500 mt-1">
                {product.total_positive_calls} conversations
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="text-xs text-gray-500">Emails Sent</p>
              <p className="text-lg font-semibold mt-1">{product.total_sent_emails}</p>
              <p className="text-xs text-gray-500 mt-1">
                {product.total_opened_emails} opens
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="text-xs text-gray-500">Meetings Booked</p>
              <p className="text-lg font-semibold mt-1">
                {product.total_meetings_booked_in_calls + product.total_meetings_booked_in_emails}
              </p>
            </div>
          </div>

          {/* Campaigns Section */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-sm font-medium text-gray-900">Active Campaigns</h5>
              <div className="flex items-center space-x-2">
                <Link
                  to={`/companies/${companyId}/campaigns/new`}
                  className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center"
                >
                  New Campaign
                </Link>
              </div>
            </div>

            {isLoadingCampaigns ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
              </div>
            ) : campaigns.length > 0 ? (
              <div className="space-y-3">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <Link 
                        to={campaign.type === 'email' 
                          ? `/companies/${companyId}/emails`
                          : `/companies/${companyId}/calls`}
                        className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                      >
                        {campaign.name}
                      </Link>
                      {campaign.description && (
                        <div className="text-xs text-gray-500">{campaign.description}</div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={campaign.type === 'email' 
                          ? `/companies/${companyId}/emails`
                          : `/companies/${companyId}/calls`}
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          campaign.type === 'email' 
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            : campaign.type === 'call'
                            ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                            : campaign.type === 'email_and_call'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {campaign.type === 'email' ? (
                          <Mail className="h-3 w-3 mr-1" />
                        ) : campaign.type === 'call' ? (
                          <Phone className="h-3 w-3 mr-1" />
                        ) : campaign.type === 'email_and_call' ? (
                          <div className="flex items-center">
                            <Mail className="h-3 w-3" />
                            <Phone className="h-3 w-3 ml-1 mr-1" />
                          </div>
                        ) : (
                          <Mail className="h-3 w-3 mr-1" />
                        )}
                        {campaign.type === 'email' ? 'Email' : 
                         campaign.type === 'call' ? 'Call' : 
                         campaign.type === 'email_and_call' ? 'Email + Call' : 
                         campaign.type}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500">No active campaigns</p>
                <Link
                  to={`/companies/${companyId}/campaigns/new`}
                  className="mt-2 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Create your first campaign
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}