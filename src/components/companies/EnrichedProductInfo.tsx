import React, { useState, useEffect } from 'react';

interface EnrichedInformation {
  overview?: string;
  key_value_proposition?: string;
  pricing?: string;
  reviews?: string[];
  market_overview?: string;
  competitors?: string;
}

interface EnrichedProductInfoProps {
  enrichedInfo: EnrichedInformation;
}

export const EnrichedProductInfo: React.FC<EnrichedProductInfoProps> = ({ enrichedInfo }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Determine which tabs to show based on available data
  const tabs = [
    { id: 'overview', label: 'Overview', content: enrichedInfo?.overview },
    { id: 'value', label: 'Value Proposition', content: enrichedInfo?.key_value_proposition },
    { id: 'market', label: 'Market Overview', content: enrichedInfo?.market_overview },
    { id: 'competitors', label: 'Competitors', content: enrichedInfo?.competitors },
    { id: 'pricing', label: 'Pricing', content: enrichedInfo?.pricing },
    { id: 'reviews', label: 'Reviews', content: enrichedInfo?.reviews?.length ? enrichedInfo.reviews : null },
  ].filter(tab => tab.content);
  
  // Set first available tab as active if current active tab doesn't exist
  useEffect(() => {
    if (tabs.length > 0 && !tabs.find(tab => tab.id === activeTab)) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);
  
  if (!enrichedInfo || tabs.length === 0) return null;
  
  const activeTabContent = tabs.find(tab => tab.id === activeTab);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 mt-4">
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto" aria-label="Tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-3 px-4 text-sm font-medium border-b-2 focus:outline-none
                ${activeTab === tab.id 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="p-4">
        {activeTabContent?.id === 'reviews' && Array.isArray(activeTabContent.content) ? (
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
            {activeTabContent.content.map((review, index) => (
              <li key={index}>{review}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600">{activeTabContent?.content as string}</p>
        )}
      </div>
    </div>
  );
}; 