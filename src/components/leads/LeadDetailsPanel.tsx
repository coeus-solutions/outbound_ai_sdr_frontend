import React, { useState } from 'react';
import { X, Building2, Mail, Phone, MapPin, Globe, Briefcase, Users, DollarSign, Calendar, Award, BookOpen, Linkedin, LucideIcon, Zap, Loader2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { LeadDetail, enrichLeadData } from '../../services/leads';
import { getToken } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';
import { useParams } from 'react-router-dom';

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
  const { showToast } = useToast();
  const { companyId } = useParams<{ companyId: string }>();

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

  const EnrichedDataItem = ({ 
    title, 
    items 
  }: { 
    title: string; 
    items: Array<{ [key: string]: string }> | string[] 
  }) => {
    if (!items || items.length === 0) return null;
    
    // Check if items is an array of strings
    const isStringArray = items.length > 0 && typeof items[0] === 'string';
    
    return (
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
        <div className="space-y-4">
          {isStringArray ? (
            // Render array of strings
            <div className="space-y-2">
              {(items as string[]).map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <p className="text-sm text-gray-600">{item}</p>
                </div>
              ))}
            </div>
          ) : (
            // Render structured data
            (items as Array<{ [key: string]: string }>).map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                {Object.entries(item).map(([key, value]) => (
                  <div key={key} className="mb-2 last:mb-0">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {key === 'pain_point' ? 'Pain Point' : 
                       key === 'trigger' ? 'Trigger' : 
                       key === 'interest' ? 'Interest' : 
                       key === 'challenge' ? 'Challenge' : 
                       key === 'impact' ? 'Impact' : key}
                    </p>
                    <p className="text-sm text-gray-600">{value}</p>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const BusinessOverviewSection = ({ data }: { 
    data: { 
      description?: string;
      company_highlights?: string[];
      products_and_services?: string[];
      company_name?: string;
      business_model?: string;
      market_position?: string;
      key_products_services?: string[];
    } 
  }) => {
    if (!data) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Business Overview</h3>
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          {data.description && (
            <div className="mb-4">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{data.description}</p>
            </div>
          )}
          
          {data.company_name && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-900 mb-1">Company Name</p>
              <p className="text-sm text-gray-600">{data.company_name}</p>
            </div>
          )}
          
          {data.business_model && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-900 mb-1">Business Model</p>
              <p className="text-sm text-gray-600">{data.business_model}</p>
            </div>
          )}
          
          {data.market_position && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-900 mb-1">Market Position</p>
              <p className="text-sm text-gray-600">{data.market_position}</p>
            </div>
          )}
          
          {data.company_highlights && data.company_highlights.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-900 mb-2">Company Highlights</p>
              <ul className="list-disc list-inside space-y-1">
                {data.company_highlights.map((highlight: string, index: number) => (
                  <li key={index} className="text-sm text-gray-600">{highlight}</li>
                ))}
              </ul>
            </div>
          )}
          
          {data.products_and_services && data.products_and_services.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-900 mb-2">Products & Services</p>
              <ul className="list-disc list-inside space-y-1">
                {data.products_and_services.map((item: string, index: number) => (
                  <li key={index} className="text-sm text-gray-600">{item}</li>
                ))}
              </ul>
            </div>
          )}
          
          {data.key_products_services && data.key_products_services.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Key Products & Services</p>
              <ul className="list-disc list-inside space-y-1">
                {data.key_products_services.map((item: string, index: number) => (
                  <li key={index} className="text-sm text-gray-600">{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  const IndustryChallengesSection = ({ data }: { 
    data: { 
      challenges?: Array<{
        impact: string;
        challenge: string;
      }>;
      business_impact?: string;
    } | string[]
  }) => {
    if (!data) return null;
    
    // Check if data is an array of strings
    const isStringArray = Array.isArray(data) && data.length > 0 && typeof data[0] === 'string';
    
    // Define a type for the structured data
    type StructuredChallenges = {
      challenges?: Array<{
        impact: string;
        challenge: string;
      }>;
      business_impact?: string;
    };
    
    return (
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Industry Challenges</h3>
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          {isStringArray ? (
            // Render array of strings
            <div className="space-y-2">
              {(data as string[]).map((challenge, index) => (
                <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0">
                  <p className="text-sm text-gray-600">{challenge}</p>
                </div>
              ))}
            </div>
          ) : (
            // Render structured data
            <>
              {(data as StructuredChallenges).challenges && (data as StructuredChallenges).challenges!.length > 0 && (
                <div className="mb-4">
                  <div className="space-y-3">
                    {(data as StructuredChallenges).challenges!.map((item, index) => (
                      <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0">
                        <p className="text-sm font-medium text-gray-900 mb-1">{item.challenge}</p>
                        <p className="text-sm text-gray-600">{item.impact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {(data as StructuredChallenges).business_impact && (
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">Business Impact</p>
                  <p className="text-sm text-gray-600">{(data as StructuredChallenges).business_impact}</p>
                </div>
              )}
            </>
          )}
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
      PAIN_POINTS, 
      BUYING_TRIGGERS, 
      BUSINESS_OVERVIEW, 
      INDUSTRY_CHALLENGES,
      PROSPECT_PROFESSIONAL_INTERESTS 
    } = leadDetails.enriched_data;

    return (
      <>
        {BUSINESS_OVERVIEW && (
          <BusinessOverviewSection data={BUSINESS_OVERVIEW} />
        )}
        
        {PAIN_POINTS && PAIN_POINTS.length > 0 && (
          <EnrichedDataItem 
            title="Pain Points" 
            items={PAIN_POINTS} 
          />
        )}
        
        {BUYING_TRIGGERS && BUYING_TRIGGERS.length > 0 && (
          <EnrichedDataItem 
            title="Buying Triggers" 
            items={BUYING_TRIGGERS} 
          />
        )}
        
        {INDUSTRY_CHALLENGES && (
          <IndustryChallengesSection data={INDUSTRY_CHALLENGES} />
        )}
        
        {PROSPECT_PROFESSIONAL_INTERESTS && PROSPECT_PROFESSIONAL_INTERESTS.length > 0 && (
          <EnrichedDataItem 
            title="Professional Interests" 
            items={PROSPECT_PROFESSIONAL_INTERESTS} 
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
            {onCallClick && (
              <button
                onClick={onCallClick}
                className="text-indigo-600 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <Phone className="h-6 w-6" />
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
    </div>
  );
} 