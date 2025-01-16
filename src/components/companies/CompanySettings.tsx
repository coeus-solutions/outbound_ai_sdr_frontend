import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { getToken } from '../../utils/auth';
import { Company, getCompanyById } from '../../services/companies';
import { useToast } from '../../context/ToastContext';

function getOAuthUrl(providerName: string, companyId: string): string {
  const redirectUri = `${window.location.origin}/cronofy-auth`;
  return `https://app.cronofy.com/oauth/authorize?avoid_linking=true&client_id=${import.meta.env.VITE_CRONOFY_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=create_event&provider_name=${providerName}&state=${companyId}`;
}

interface CalendarProvider {
  id: string;
  name: string;
  description: string;
  logo: string;
  bgColor: string;
  providerName: string;
}

const calendarProviders: CalendarProvider[] = [
  {
    id: 'google',
    name: 'Google Calendar',
    description: 'Connect your Google Calendar account',
    logo: '/images/calendar-providers/google-calendar.svg',
    bgColor: 'bg-white',
    providerName: 'google'
  },
  {
    id: 'icloud',
    name: 'iCloud Calendar',
    description: 'Connect your iCloud Calendar account',
    logo: '/images/calendar-providers/icloud-calendar.svg',
    bgColor: 'bg-[#000000]',
    providerName: 'apple'
  },
  {
    id: 'office365',
    name: 'Office 365',
    description: 'Connect your Office 365 Calendar account',
    logo: '/images/calendar-providers/office365-calendar.svg',
    bgColor: 'bg-[#D83B01]',
    providerName: 'office365'
  },
  {
    id: 'exchange',
    name: 'Exchange',
    description: 'Connect your Exchange Calendar account',
    logo: '/images/calendar-providers/exchange-calendar.svg',
    bgColor: 'bg-[#0078D4]',
    providerName: 'exchange'
  },
  {
    id: 'outlook',
    name: 'Outlook.com',
    description: 'Connect your Outlook.com Calendar account',
    logo: '/images/calendar-providers/outlook-calendar.svg',
    bgColor: 'bg-[#0078D4]',
    providerName: 'live_connect'
  }
];

export function CompanySettings() {
  const { companyId } = useParams<{ companyId: string }>();
  const { showToast } = useToast();
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompany() {
      if (!companyId) return;

      try {
        const token = getToken();
        if (!token) {
          setError('Authentication token not found');
          showToast('Authentication failed. Please try logging in again.', 'error');
          return;
        }

        const companyData = await getCompanyById(token, companyId);
        setCompany(companyData);
        setError(null);
      } catch (err) {
        const errorMessage = 'Failed to fetch company details';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCompany();
  }, [companyId, showToast]);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{company?.name || 'Company'} Settings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your company settings and integrations
          </p>
        </div>

        {/* Calendar Integration Section */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-gray-400" />
              <h2 className="ml-3 text-lg font-medium text-gray-900">Calendar Integration</h2>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Integrate your calendar to enable seamless meeting scheduling when leads are ready to engage
            </p>
          </div>

          <div className="px-6 py-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {calendarProviders.map((provider) => (
                <div
                  key={provider.id}
                  className="relative rounded-lg border border-gray-200 bg-white px-6 py-5 shadow-sm hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`flex-shrink-0 h-12 w-12 rounded-lg ${provider.bgColor} p-2 flex items-center justify-center transition-transform group-hover:scale-105`}>
                      <img
                        src={provider.logo}
                        alt={`${provider.name} logo`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="focus:outline-none">
                        <p className="text-sm font-medium text-gray-900">
                          {provider.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {provider.description}
                        </p>
                      </div>
                    </div>
                    <a
                      href={getOAuthUrl(provider.providerName, companyId || '')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                      Connect
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 