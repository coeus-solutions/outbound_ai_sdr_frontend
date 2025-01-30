import React, { useState } from 'react';
import { Dialog } from '../shared/Dialog';
import { Company } from '../../services/companies';
import { Building2, MapPin, Briefcase, Globe } from 'lucide-react';
import clsx from 'clsx';

interface CompanyDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
}

export function CompanyDetailsDialog({ isOpen, onClose, company }: CompanyDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState<'background' | 'overview' | 'products'>('background');

  if (!company) return null;

  const tabs = [
    { id: 'background', name: 'Company Background' },
    { id: 'overview', name: 'Company Overview' },
    { id: 'products', name: 'Product and Services' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'background':
        return (
          <div className="space-y-4 p-4">
            {company.background ? (
              <div>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{company.background}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No background information available.</p>
            )}
          </div>
        );
      case 'overview':
        return (
          <div className="space-y-4 p-4">
            {company.overview ? (
              <div>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{company.overview}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No overview information available.</p>
            )}
          </div>
        );
      case 'products':
        return (
          <div className="space-y-4 p-4">
            {company.products_services ? (
              <div>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{company.products_services}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No products and services information available.</p>
            )}
          </div>
        );
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={company.name}
      size="2xl"
    >
      <div className="w-[800px] max-w-full space-y-6">
        {/* Company Info */}
        <div className="px-6 pt-2 pb-4 border-b border-gray-200">
          <div className="space-y-2">
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
              >
                <Globe className="h-4 w-4 mr-2" />
                {company.website}
              </a>
            )}
            {company.address && (
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-2" />
                {company.address}
              </div>
            )}
            {company.industry && (
              <div className="flex items-center text-sm">
                <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
                <div className="flex flex-wrap gap-2">
                  {company.industry.split(',').map((industry, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {industry.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Company details tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={clsx(
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                )}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px]">
          {renderTabContent()}
        </div>
      </div>
    </Dialog>
  );
} 