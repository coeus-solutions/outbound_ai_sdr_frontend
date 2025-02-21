import React, { useEffect, useState } from 'react';
import { Building2, Plus, Package, Phone, Mail, Settings, Eye, ChevronDown, ChevronUp, Target, Linkedin, Lock, ArrowRight, Search, ExternalLink, Trash2, Volume2 } from 'lucide-react';
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
import { SkeletonLoader } from '../shared/SkeletonLoader';
import { LoadingButton } from '../shared/LoadingButton';
import { CardSkeletonLoader } from '../shared/CardSkeletonLoader';
import { useUserRole } from '../../hooks/useUserRole';
import * as Tooltip from '@radix-ui/react-tooltip';

interface ProductStats {
  id: string;
  name: string;
  product_name: string;
  total_campaigns: number;
  total_calls: number;
  total_positive_calls: number;
  total_sent_emails: number;
  total_opened_emails: number;
  total_replied_emails: number;
  unique_leads_contacted: number;
  total_meetings_booked_in_calls: number;
  total_meetings_booked_in_emails: number;
  leads: {
    total: number;
    contacted: number;
  };
  calls: {
    total: number;
    conversations: number;
    meetings: number;
  };
  emails: {
    total: number;
    opens: number;
    replies: number;
    meetings: number;
  };
  campaigns: number;
}

interface CompanyWithStats extends Omit<Company, 'products'> {
  products: ProductStats[];
}

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

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const token = getToken();
        if (!token) {
          setError('Authentication token not found');
          return;
        }
        const companiesData = await getCompanies(token);
        
        // Transform the companies data to include the required stats structure
        const companiesWithStats = companiesData.map((company) => {
          return {
            ...company,
            products: company.products?.map((product: Product) => ({
              id: product.id,
              name: product.name,
              product_name: product.product_name,
              total_campaigns: product.total_campaigns,
              total_calls: product.total_calls,
              total_positive_calls: product.total_positive_calls,
              total_sent_emails: product.total_sent_emails,
              total_opened_emails: product.total_opened_emails,
              total_replied_emails: product.total_replied_emails,
              unique_leads_contacted: product.unique_leads_contacted,
              total_meetings_booked_in_calls: product.total_meetings_booked_in_calls,
              total_meetings_booked_in_emails: product.total_meetings_booked_in_emails,
              leads: {
                total: company.total_leads || 0,
                contacted: product.unique_leads_contacted,
              },
              calls: {
                total: product.total_calls,
                conversations: product.total_positive_calls,
                meetings: product.total_meetings_booked_in_calls,
              },
              emails: {
                total: product.total_sent_emails,
                opens: product.total_opened_emails,
                replies: product.total_replied_emails,
                meetings: product.total_meetings_booked_in_emails,
              },
              campaigns: product.total_campaigns,
            })) || []
          };
        });

        setCompanies(companiesWithStats);
        setError(null);
      } catch (err) {
        setError('Failed to fetch companies');
        console.error('Error fetching companies:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCompanies();
  }, []); // Only run once on mount

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.products.some(product => 
      product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleViewDetails = async (company: Company) => {
    try {
      setLoadingCompanyId(company.id);
      const token = getToken();
      if (!token) {
        setError('Authentication token not found');
        return;
      }
      const fullCompanyDetails = await getCompanyById(token, company.id);
      setSelectedCompany(fullCompanyDetails);
      setIsDetailsOpen(true);
    } catch (error) {
      console.error('Error fetching company details:', error);
      // Still show the dialog with basic company info if fetching details fails
      setSelectedCompany(company);
      setIsDetailsOpen(true);
    } finally {
      setLoadingCompanyId(null);
    }
  };

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
                className="form-input"
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
    </div>
  );
}

function CompanyCard({ company, onViewDetails, isLoadingDetails, onDelete }: CompanyCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
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
                  <Link 
                    to={`/companies/${company.id}/leads`}
                    className="p-2 text-gray-400 hover:text-blue-600"
                  >
                    <Target className="w-5 h-5" />
                  </Link>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-gray-900 text-white px-3 py-1.5 rounded text-xs"
                    sideOffset={5}
                  >
                    Manage leads
                    <Tooltip.Arrow className="fill-gray-900" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>

            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Link 
                    to={`/companies/${company.id}/campaigns`}
                    className="p-2 text-gray-400 hover:text-purple-600"
                  >
                    <Volume2 className="w-5 h-5" />
                  </Link>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-gray-900 text-white px-3 py-1.5 rounded text-xs"
                    sideOffset={5}
                  >
                    Manage campaigns
                    <Tooltip.Arrow className="fill-gray-900" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>

            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    onClick={onViewDetails}
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

            {isAdmin && (
              <>
                <Tooltip.Provider>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <Link to={`/companies/${company.id}/settings`} className="p-2 text-gray-400 hover:text-gray-600">
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
              </>
            )}

            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-gray-900 text-white px-3 py-1.5 rounded text-xs"
                    sideOffset={5}
                  >
                    {isExpanded ? 'Collapse' : 'Expand'}
                    <Tooltip.Arrow className="fill-gray-900" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
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
                <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding your first product/service</p>
                <div className="mt-6">
                  <Link
                    to={`/companies/${company.id}/products/new`}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Package className="h-5 w-5 mr-2" />
                    Add Product
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: ProductStats;
  companyId: string;
}

function ProductCard({ product, companyId }: ProductCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const calculatePercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  // Calculate percentages
  const callSuccessRate = calculatePercentage(product.calls.conversations, product.calls.total);
  const emailOpenRate = calculatePercentage(product.emails.opens, product.emails.total);
  const emailReplyRate = calculatePercentage(product.emails.replies, product.emails.total);

  const metricBoxStyle = "bg-gray-50 rounded-lg";
  const metricBoxInnerStyle = "p-3 flex flex-col items-center justify-center min-h-[80px]";

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-3">
          <Package className="w-5 h-5 text-green-600 mt-1" />
          <div>
            <h4 className="font-medium text-gray-900">{product.product_name}</h4>
            <div className="mt-1 text-sm text-gray-500">
              {product.campaigns} active campaigns
            </div>
          </div>
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 text-gray-400 hover:text-gray-600"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* Leads Section */}
          <div className="bg-white p-4 rounded-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center text-blue-600">
                <Target className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Leads</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className={metricBoxStyle}>
                <div className={metricBoxInnerStyle}>
                  <div className="text-sm text-gray-500">Total</div>
                  <div className="text-lg font-semibold mt-1">{product.leads.total}</div>
                </div>
              </div>
              <div className={metricBoxStyle}>
                <div className={metricBoxInnerStyle}>
                  <div className="text-sm text-gray-500">Contacted</div>
                  <div className="text-lg font-semibold mt-1">{product.leads.contacted}</div>
                </div>
              </div>
              <div className={metricBoxStyle}>
                <div className={metricBoxInnerStyle}>
                  <div className="text-sm text-gray-500">Contact Rate</div>
                  <div className={`text-lg font-semibold mt-1 ${getPercentageColor(calculatePercentage(product.leads.contacted, product.leads.total))}`}>
                    {calculatePercentage(product.leads.contacted, product.leads.total)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calls Section */}
          <div className="bg-white p-4 rounded-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center text-yellow-600">
                <Phone className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Calls</span>
              </div>
              <Link 
                to={`/companies/${companyId}/calls`}
                className="text-sm text-yellow-600 hover:text-yellow-700 flex items-center"
              >
                View call logs
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className={metricBoxStyle}>
                <div className={metricBoxInnerStyle}>
                  <div className="text-sm text-gray-500">Dialed</div>
                  <div className="text-lg font-semibold mt-1">{product.calls.total}</div>
                </div>
              </div>
              <div className={metricBoxStyle}>
                <div className={metricBoxInnerStyle}>
                  <div className="text-sm text-gray-500">Conversations</div>
                  <div className="text-lg font-semibold mt-1">{product.calls.conversations}</div>
                </div>
              </div>
              <div className={metricBoxStyle}>
                <div className={metricBoxInnerStyle}>
                  <div className="text-sm text-gray-500">Meetings Booked</div>
                  <div className="text-lg font-semibold mt-1">{product.calls.meetings}</div>
                </div>
              </div>
              <div className={metricBoxStyle}>
                <div className={metricBoxInnerStyle}>
                  <div className="text-sm text-gray-500">Conversation Rate</div>
                  <div className={`text-lg font-semibold mt-1 ${getPercentageColor(callSuccessRate)}`}>
                    {callSuccessRate}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Emails Section */}
          <div className="bg-white p-4 rounded-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center text-purple-600">
                <Mail className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Emails</span>
              </div>
              <div className="flex items-center space-x-4">
                <Link 
                  to={`/companies/${companyId}/emails`}
                  className="text-sm text-purple-600 hover:text-purple-700 flex items-center"
                >
                  View emails
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-4">
              <div className={metricBoxStyle}>
                <div className={metricBoxInnerStyle}>
                  <div className="text-sm text-gray-500">Sent</div>
                  <div className="text-lg font-semibold mt-1">{product.emails.total}</div>
                </div>
              </div>
              <div className={metricBoxStyle}>
                <div className={metricBoxInnerStyle}>
                  <div className="text-sm text-gray-500">Opened</div>
                  <div className="text-lg font-semibold mt-1">{product.emails.opens}</div>
                </div>
              </div>
              <div className={metricBoxStyle}>
                <div className={metricBoxInnerStyle}>
                  <div className="text-sm text-gray-500">Open Rate</div>
                  <div className={`text-lg font-semibold mt-1 ${getPercentageColor(emailOpenRate)}`}>
                    {emailOpenRate}%
                  </div>
                </div>
              </div>
              <div className={metricBoxStyle}>
                <div className={metricBoxInnerStyle}>
                  <div className="text-sm text-gray-500">Replied</div>
                  <div className="text-lg font-semibold mt-1">{product.emails.replies}</div>
                </div>
              </div>
              <div className={metricBoxStyle}>
                <div className={metricBoxInnerStyle}>
                  <div className="text-sm text-gray-500">Reply Rate</div>
                  <div className={`text-lg font-semibold mt-1 ${getPercentageColor(emailReplyRate)}`}>
                    {emailReplyRate}%
                  </div>
                </div>
              </div>
              <div className={metricBoxStyle}>
                <div className={metricBoxInnerStyle}>
                  <div className="text-sm text-gray-500">Meetings Booked</div>
                  <div className="text-lg font-semibold mt-1">{product.emails.meetings}</div>
                </div>
              </div>
            </div>
          </div>

          {/* LinkedIn Section */}
          <div className="bg-white p-4 rounded-md relative overflow-hidden">
            <div className="flex items-center text-blue-600 mb-3">
              <Linkedin className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">LinkedIn</span>
            </div>
            
            {/* Coming Soon Overlay */}
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
              <div className="text-center">
                <Lock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">Coming Soon</p>
                <p className="text-xs text-gray-500 mt-1">LinkedIn integration will be available shortly</p>
              </div>
            </div>

            {/* Metrics Grid (will be visible once feature is available) */}
            <div className="grid grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-500">Contacts</div>
                <div className="text-lg font-semibold">-</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Engagements</div>
                <div className="text-lg font-semibold">-</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Messages</div>
                <div className="text-lg font-semibold">-</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Meetings</div>
                <div className="text-lg font-semibold">-</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}