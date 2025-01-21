import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Check, X, Mail, Mic, Lock, ChevronDown, User, Info } from 'lucide-react';
import { getToken } from '../../utils/auth';
import { Company, getCompanyById, disconnectCalendar } from '../../services/companies';
import { AccountCredentials, updateAccountCredentials } from '../../services/companySettings';
import { useToast } from '../../context/ToastContext';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Dialog } from '../shared/Dialog';
import { PageHeader } from '../shared/PageHeader';
import clsx from 'clsx';

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

type SettingsTab = 'calendar' | 'email' | 'voice';

export function CompanySettings() {
  const { companyId } = useParams<{ companyId: string }>();
  const { showToast } = useToast();
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>('calendar');
  const [selectedEmailProvider, setSelectedEmailProvider] = useState('gmail');
  const [isSavingCredentials, setIsSavingCredentials] = useState(false);
  const [credentials, setCredentials] = useState<AccountCredentials>({
    account_email: '',
    account_password: '',
    type: selectedEmailProvider
  });

  useEffect(() => {
    setCredentials(prev => ({
      ...prev,
      type: selectedEmailProvider
    }));
  }, [selectedEmailProvider]);

  useEffect(() => {
    async function fetchData() {
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
        if (companyData.account_email) {
          setCredentials(prev => ({
            ...prev,
            account_email: companyData.account_email || ''
          }));
        }
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        const errorMessage = 'Failed to fetch company details';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [companyId, showToast]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) return;

    setIsSavingCredentials(true);
    try {
      const token = getToken();
      if (!token) {
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      await updateAccountCredentials(token, companyId, {
        ...credentials,
        type: selectedEmailProvider,
      });

      showToast('Email settings saved successfully', 'success');
    } catch (error) {
      console.error('Error saving credentials:', error);
      showToast('Failed to save email settings', 'error');
    } finally {
      setIsSavingCredentials(false);
    }
  };

  const handleCredentialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };

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
    } catch (error) {
      console.error('Error disconnecting calendar:', error);
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

  const tabs = [
    { id: 'calendar', name: 'Calendar', icon: Calendar },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'voice', name: 'Voice Agent', icon: Mic },
  ];

  const renderEmailSettings = () => (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center">
          <Mail className="h-6 w-6 text-gray-400" />
          <h2 className="ml-3 text-lg font-medium text-gray-900">Email Settings</h2>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Enter your email account credentials to enable sending and receiving emails on your behalf
        </p>
      </div>
      <form onSubmit={handleCredentialsSubmit} className="px-6 py-6 space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Email Provider
            </label>
            <div className="flex items-center space-x-2">
              <div className="relative max-w-[200px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="type"
                  name="type"
                  value={selectedEmailProvider}
                  onChange={(e) => setSelectedEmailProvider(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg bg-white"
                >
                  <option value="gmail">Gmail</option>
                </select>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="account_email" className="block text-sm font-medium text-gray-700">
              Account Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="account_email"
                id="account_email"
                value={credentials.account_email}
                onChange={handleCredentialsChange}
                className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="john.doe@example.com"
                required
              />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <label htmlFor="account_password" className="block text-sm font-medium text-gray-700">
                Account Password
              </label>
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center text-gray-400 hover:text-gray-500"
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="bg-gray-900 text-white px-4 py-2 rounded text-xs max-w-xs z-50"
                      sideOffset={5}
                    >
                      <div>
                        An app password is a 16-digit passcode that gives permission to access your Google Account. App passwords can only be used with accounts that have 2-Step Verification turned on.
                      </div>
                      <div className="mt-2">
                        You can create an app password at:{' '}
                        <a 
                          href="https://myaccount.google.com/apppasswords" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-300 hover:text-blue-200 underline"
                        >
                          https://myaccount.google.com/apppasswords
                        </a>
                      </div>
                      <Tooltip.Arrow className="fill-gray-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="account_password"
                id="account_password"
                value={credentials.account_password}
                onChange={handleCredentialsChange}
                className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSavingCredentials}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSavingCredentials ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Email Settings'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'calendar':
        return (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-gray-400" />
                <h2 className="ml-3 text-lg font-medium text-gray-900">Calendar</h2>
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
                                  className="bg-gray-900 text-white px-4 py-2 rounded text-xs max-w-xs z-50"
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
        );

      case 'email':
        return renderEmailSettings();

      case 'voice':
        return (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center">
                <Mic className="h-6 w-6 text-gray-400" />
                <h2 className="ml-3 text-lg font-medium text-gray-900">Voice Agent Settings</h2>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Configure your voice agent settings and example script
              </p>
            </div>
            <div className="px-6 py-6 space-y-6">
              <div>
                <label htmlFor="voice" className="block text-sm font-medium text-gray-700">
                  Voice Selection
                </label>
                <select
                  id="voice"
                  name="voice"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option>Select a voice</option>
                  <option>Male Voice 1</option>
                  <option>Female Voice 1</option>
                  <option>Male Voice 2</option>
                  <option>Female Voice 2</option>
                </select>
              </div>
              <div>
                <label htmlFor="script" className="block text-sm font-medium text-gray-700">
                  Example Script
                </label>
                <textarea
                  id="script"
                  name="script"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter your example script here..."
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Voice Settings
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        <PageHeader
          title={`${company?.name || 'Company'} Settings`}
          subtitle="Manage your company settings and integrations"
        />

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Settings tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as SettingsTab)}
                  className={clsx(
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm'
                  )}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  <Icon className={clsx(
                    activeTab === tab.id ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500',
                    '-ml-0.5 mr-2 h-5 w-5'
                  )} />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
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