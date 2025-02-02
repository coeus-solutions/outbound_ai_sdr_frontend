import React, { useEffect, useState } from 'react';
import { Building2, Plus, Package, Phone, Mail, Settings, Globe, Eye, ChevronDown, ChevronUp, Target, Users, Linkedin, Lock, ArrowRight, Search, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getToken } from '../../utils/auth';
import { Company, getCompanies } from '../../services/companies';
import { CompanyDetailsDialog } from './CompanyDetailsDialog';

interface ProductStats {
  id: string;
  name: string;
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

interface CompanyWithStats extends Company {
  products: ProductStats[];
}

export function CompanyList() {
  const [companies, setCompanies] = useState<CompanyWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const token = getToken();
        if (!token) {
          setError('Authentication token not found');
          return;
        }
        const data = await getCompanies(token);
        // TODO: Replace this with actual API data once available
        const companiesWithStats: CompanyWithStats[] = data.map(company => ({
          ...company,
          products: [{
            id: '1',
            name: 'Default Product',
            leads: { total: 0, contacted: 0 },
            calls: { total: 0, conversations: 0, meetings: 0 },
            emails: { total: 0, opens: 0, replies: 0, meetings: 0 },
            campaigns: 0
          }]
        }));
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
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                onViewDetails={() => {
                  setSelectedCompany(company);
                  setIsDetailsOpen(true);
                }}
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
    </div>
  );
}

interface CompanyCardProps {
  company: CompanyWithStats;
  onViewDetails: () => void;
}

function CompanyCard({ company, onViewDetails }: CompanyCardProps) {
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
            <button
              onClick={onViewDetails}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <Eye className="w-5 h-5" />
            </button>
            <Link to={`/companies/${company.id}/settings`}>
              <Settings className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </Link>
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
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Products</h3>
              <Link 
                to={`/companies/${company.id}/products/new`}
                className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Product
              </Link>
            </div>
            
            <div className="grid gap-4">
              {company.products.map((product) => (
                <ProductCard key={product.id} product={product} companyId={company.id} />
              ))}
            </div>
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

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-3">
          <Package className="w-5 h-5 text-green-600 mt-1" />
          <div>
            <h4 className="font-medium text-gray-900">{product.name}</h4>
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
              <Link 
                to={`/companies/${companyId}/leads`}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
              >
                Manage leads
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-lg font-semibold">{product.leads.total}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Contacted</div>
                <div className="text-lg font-semibold">{product.leads.contacted}</div>
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
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-lg font-semibold">{product.calls.total}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Conversations</div>
                <div className="text-lg font-semibold">{product.calls.conversations}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Meetings</div>
                <div className="text-lg font-semibold">{product.calls.meetings}</div>
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
                <Link 
                  to={`/companies/${companyId}/campaigns`}
                  className="text-sm text-purple-600 hover:text-purple-700 flex items-center"
                >
                  Manage campaigns
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-lg font-semibold">{product.emails.total}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Opens</div>
                <div className="text-lg font-semibold">{product.emails.opens}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Replies</div>
                <div className="text-lg font-semibold">{product.emails.replies}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Meetings</div>
                <div className="text-lg font-semibold">{product.emails.meetings}</div>
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