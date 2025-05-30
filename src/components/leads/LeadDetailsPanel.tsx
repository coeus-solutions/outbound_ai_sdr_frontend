import React, { useState, useEffect } from 'react';
import { X, Building2, Mail, Phone, MapPin, Globe, Briefcase, Users, DollarSign, Calendar, Award, BookOpen, Linkedin, LucideIcon, Zap, Loader2, FileText, PhoneCall } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { LeadDetail, enrichLeadData } from '../../services/leads';
import { getToken } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';
import { useParams } from 'react-router-dom';
import { Product, getProducts } from '../../services/products';
import { EmailScriptDialog } from './EmailScriptDialog';
import { CallScriptDialog } from './CallScriptDialog';

interface LeadDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  leadDetails: LeadDetail | null;
  onCallClick?: () => void;
  onLeadUpdated?: (updatedLead: LeadDetail) => void;
}

type TabType = 'basic' | 'enriched';

export function LeadDetailsPanel({ isOpen, onClose, leadDetails, onCallClick, onLeadUpdated }: LeadDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [isEnriching, setIsEnriching] = useState(false);
  const [isEmailScriptDialogOpen, setIsEmailScriptDialogOpen] = useState(false);
  const [isCallScriptDialogOpen, setIsCallScriptDialogOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const { showToast } = useToast();
  const { companyId } = useParams<{ companyId: string }>();

  useEffect(() => {
    if (isOpen && companyId) {
      fetchProducts();
    }
  }, [isOpen, companyId]);

  const fetchProducts = async () => {
    if (!companyId) return;
    
    try {
      setIsLoadingProducts(true);
      const token = getToken();
      if (!token) {
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }
      
      const fetchedProducts = await getProducts(token, companyId);
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      showToast('Failed to fetch products', 'error');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  if (!isOpen || !leadDetails) return null;

  const handleEnrichData = async () => {
    if (!companyId || !leadDetails.id) return;
    
    try {
      setIsEnriching(true);
      const token = getToken();
      if (!token) {
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      const enrichedLeadData = await enrichLeadData(token, companyId, leadDetails.id);
      
      if (onLeadUpdated) {
        onLeadUpdated(enrichedLeadData);
      }
      
      showToast('Lead data enriched successfully', 'success');
    } catch (error) {
      console.error('Error enriching lead data:', error);
      showToast('Failed to enrich lead data', 'error');
    } finally {
      setIsEnriching(false);
    }
  };

  const handleEmailScriptClick = () => {
    setIsEmailScriptDialogOpen(true);
  };

  const handleCallScriptClick = () => {
    setIsCallScriptDialogOpen(true);
  };

  const DetailSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );

  const DetailItem = ({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string | null | undefined }) => {
    if (!value) return null;
    return (
      <div className="flex items-start">
        <Icon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
        <div className="ml-3">
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-sm text-gray-900">{value}</p>
        </div>
      </div>
    );
  };

  const renderBasicInfo = () => (
    <>
      {/* Personal Information */}
      <DetailSection title="Personal Information">
        <DetailItem icon={Briefcase} label="Name" value={leadDetails.name} />
        <DetailItem icon={Mail} label="Email" value={leadDetails.email} />
        <DetailItem icon={Phone} label="Phone" value={leadDetails.phone_number} />
        <DetailItem icon={MapPin} label="Location" value={
          [leadDetails.city, leadDetails.state, leadDetails.country]
            .filter(Boolean)
            .join(', ')
        } />
        <DetailItem icon={Award} label="Job Title" value={leadDetails.job_title} />
        <DetailItem icon={BookOpen} label="Education" value={leadDetails.education} />
        {leadDetails.personal_linkedin_url && (
          <a
            href={leadDetails.personal_linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <Linkedin className="h-5 w-5 mr-2" />
            <span>LinkedIn Profile</span>
          </a>
        )}
      </DetailSection>

      {/* Company Information */}
      <DetailSection title="Company Information">
        <DetailItem icon={Building2} label="Company Name" value={leadDetails.company} />
        <DetailItem icon={Globe} label="Website" value={leadDetails.website} />
        <DetailItem icon={Users} label="Company Size" value={leadDetails.headcount?.toString()} />
        <DetailItem icon={DollarSign} label="Revenue" value={leadDetails.financials?.value ? formatCurrency(Number(leadDetails.financials.value)) : undefined} />
        <DetailItem icon={Calendar} label="Founded" value={leadDetails.company_founded_year?.toString()} />
        <DetailItem icon={Building2} label="Company Type" value={leadDetails.company_type} />
        {leadDetails.company_linkedin_url && (
          <a
            href={leadDetails.company_linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <Linkedin className="h-5 w-5 mr-2" />
            <span>Company LinkedIn</span>
          </a>
        )}
      </DetailSection>

      {/* Technologies */}
      {leadDetails.technologies && leadDetails.technologies.length > 0 && (
        <DetailSection title="Technologies">
          <div className="flex flex-wrap gap-2">
            {leadDetails.technologies.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {tech}
              </span>
            ))}
          </div>
        </DetailSection>
      )}

      {/* Company Description */}
      {leadDetails.company_description && (
        <DetailSection title="Company Description">
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{leadDetails.company_description}</p>
        </DetailSection>
      )}
    </>
  );

  const BusinessOverviewSection = ({ data }: { 
    data: {
      companyName?: string;
      businessModel?: string;
      keyProductsServices?: string[];
    } 
  }) => {
    if (!data) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Business Overview</h3>
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          {data.companyName && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-900 mb-1">Company Name</p>
              <p className="text-sm text-gray-600">{data.companyName}</p>
            </div>
          )}
          
          {data.businessModel && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-900 mb-1">Business Model</p>
              <p className="text-sm text-gray-600">{data.businessModel}</p>
            </div>
          )}
          
          {data.keyProductsServices && data.keyProductsServices.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Key Products & Services</p>
              <ul className="list-disc list-inside space-y-1">
                {data.keyProductsServices.map((item: string, index: number) => (
                  <li key={index} className="text-sm text-gray-600">{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  const EnrichedDataList = ({ title, items }: { title: string; items: string[] }) => {
    if (!items || !Array.isArray(items) || items.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <p className="text-sm text-gray-600">{item}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEnrichedData = () => {
    if (!leadDetails.enriched_data) {
      return (
        <div className="p-8 flex flex-col items-center justify-center h-64">
          <p className="text-gray-500 text-center mb-6">No enriched data available for this lead.</p>
          <button
            onClick={handleEnrichData}
            disabled={isEnriching}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEnriching ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enriching Data...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Enrich Data
              </>
            )}
          </button>
        </div>
      );
    }

    const { 
      businessOverview,
      prospectProfessionalInterests,
      painPoints,
      buyingTriggers,
      industryChallenges
    } = leadDetails.enriched_data;

    // Add debug logging
    console.log('Enriched Data:', {
      businessOverview,
      prospectProfessionalInterests,
      painPoints,
      buyingTriggers,
      industryChallenges
    });

    return (
      <>
        {businessOverview && (
          <BusinessOverviewSection data={businessOverview} />
        )}
        
        {Array.isArray(painPoints) && painPoints.length > 0 && (
          <EnrichedDataList 
            title="Pain Points" 
            items={painPoints} 
          />
        )}
        
        {Array.isArray(buyingTriggers) && buyingTriggers.length > 0 && (
          <EnrichedDataList 
            title="Buying Triggers" 
            items={buyingTriggers} 
          />
        )}
        
        {Array.isArray(industryChallenges) && industryChallenges.length > 0 && (
          <EnrichedDataList 
            title="Industry Challenges" 
            items={industryChallenges} 
          />
        )}
        
        {Array.isArray(prospectProfessionalInterests) && prospectProfessionalInterests.length > 0 && (
          <EnrichedDataList 
            title="Professional Interests" 
            items={prospectProfessionalInterests} 
          />
        )}
      </>
    );
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Lead Details</h2>
          <div className="flex items-center space-x-4">
            {leadDetails?.phone_number && (
              <button
                onClick={handleCallScriptClick}
                className="text-indigo-600 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Generate Call Script"
              >
                <PhoneCall className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={handleEmailScriptClick}
              className="text-indigo-600 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title="Generate Email Script"
            >
              <FileText className="h-5 w-5" />
            </button>
            {onCallClick && leadDetails?.phone_number && (
              <button
                onClick={onCallClick}
                className="text-indigo-600 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Call Lead"
              >
                <Phone className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              className={`flex items-center px-4 py-2 text-sm font-medium ${
                activeTab === 'basic'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('basic')}
            >
              <Users className="h-4 w-4 mr-2" />
              Basic Info
            </button>
            <button
              className={`flex items-center px-4 py-2 text-sm font-medium ${
                activeTab === 'enriched'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('enriched')}
            >
              <Zap className="h-4 w-4 mr-2" />
              Enriched Data
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {activeTab === 'basic' ? renderBasicInfo() : renderEnrichedData()}
        </div>
      </div>

      {/* Email Script Dialog */}
      {leadDetails && companyId && (
        <EmailScriptDialog
          isOpen={isEmailScriptDialogOpen}
          onClose={() => setIsEmailScriptDialogOpen(false)}
          companyId={companyId}
          leadId={leadDetails.id}
          products={isLoadingProducts ? [] : products}
        />
      )}

      {/* Call Script Dialog */}
      {leadDetails && companyId && (
        <CallScriptDialog
          isOpen={isCallScriptDialogOpen}
          onClose={() => setIsCallScriptDialogOpen(false)}
          companyId={companyId}
          leadId={leadDetails.id}
          products={isLoadingProducts ? [] : products}
        />
      )}
    </div>
  );
} 