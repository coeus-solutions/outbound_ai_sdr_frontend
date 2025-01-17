import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Check, X } from 'lucide-react';
import { getToken } from '../../utils/auth';
import { Company, getCompanyById, disconnectCalendar } from '../../services/companies';
import { useToast } from '../../context/ToastContext';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Dialog } from '../shared/Dialog';

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
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

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

  const handleDisconnectClick = () => {
    setShowDisconnectConfirm(true);
  };

  const handleDisconnectConfirm = async () => {
    if (!companyId) return;

    try {
      setIsDisconnecting(true);
      const token = getToken();
      if (!token) {
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      await disconnectCalendar(token, companyId);
      
      // Refetch company data to update the UI
      const updatedCompany = await getCompanyById(token, companyId);
      setCompany(updatedCompany);
      
      showToast('Calendar disconnected successfully', 'success');
      setShowDisconnectConfirm(false);
    } catch (err) {
      showToast('Failed to disconnect calendar. Please try again.', 'error');
    } finally {
      setIsDisconnecting(false);
    }
  };

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

  const isCalendarConnected = company?.cronofy_provider && company?.cronofy_linked_email;
  const connectedProvider = calendarProviders.find(p => p.providerName === company?.cronofy_provider);

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

          {isCalendarConnected && connectedProvider && (
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-50">
              <div className="flex items-center space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
                <div className={`flex-shrink-0 h-12 w-12 rounded-lg ${connectedProvider.bgColor} p-2 flex items-center justify-center shadow-sm`}>
                  <img
                    src={connectedProvider.logo}
                    alt={`${connectedProvider.name} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Connected Calendar</h3>
                  <div className="mt-1.5 flex flex-col">
                    <span className="text-base text-gray-900 font-medium">
                      {company.cronofy_default_calendar_name || 'Default Calendar'}
                    </span>
                    <span className="text-sm text-gray-600">
                      {company.cronofy_linked_email} • {connectedProvider.name}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 flex items-center space-x-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 shadow-sm">
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Connected
                  </span>
                  <button
                    onClick={handleDisconnectClick}
                    disabled={isDisconnecting}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isDisconnecting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700 mr-2"></div>
                        Disconnecting...
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 mr-1" />
                        Disconnect
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

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
                    {company?.cronofy_provider === provider.providerName ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Check className="h-3 w-3 mr-1" />
                        Connected
                      </span>
                    ) : (
                      <Tooltip.Provider>
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <button
                              type="button"
                              disabled={Boolean(isCalendarConnected)}
                              className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md transition-colors duration-200 ${
                                isCalendarConnected 
                                  ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                                  : 'border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                              }`}
                              onClick={isCalendarConnected ? undefined : () => window.open(getOAuthUrl(provider.providerName, companyId || ''), '_blank')}
                            >
                              Connect
                            </button>
                          </Tooltip.Trigger>
                          {isCalendarConnected && (
                            <Tooltip.Portal>
                              <Tooltip.Content
                                className="bg-gray-900 text-white px-3 py-1.5 rounded text-xs"
                                sideOffset={5}
                              >
                                Please disconnect the current calendar before connecting a new one
                                <Tooltip.Arrow className="fill-gray-900" />
                              </Tooltip.Content>
                            </Tooltip.Portal>
                          )}
                        </Tooltip.Root>
                      </Tooltip.Provider>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog
        isOpen={showDisconnectConfirm}
        onClose={() => setShowDisconnectConfirm(false)}
        title="Disconnect Calendar"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to disconnect the calendar? This will remove the calendar integration and all associated settings.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDisconnectConfirm(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              onClick={handleDisconnectConfirm}
              disabled={isDisconnecting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDisconnecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Disconnecting...
                </>
              ) : (
                'Disconnect'
              )}
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
} 