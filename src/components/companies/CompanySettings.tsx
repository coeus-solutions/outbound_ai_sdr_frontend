import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Check, X, Mail, Mic, Lock, ChevronDown, User, Info, UserSquare2, UserCircle, Volume2, Globe2, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import { getToken } from '../../utils/auth';
import { Company, getCompanyById, disconnectCalendar } from '../../services/companies';
import { AccountCredentials, updateAccountCredentials } from '../../services/companySettings';
import { useToast } from '../../context/ToastContext';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Dialog } from '../shared/Dialog';
import { PageHeader } from '../shared/PageHeader';
import clsx from 'clsx';
import { apiEndpoints } from '../../config';
import { v4 as uuidv4 } from 'uuid';
import { CompanyUsers } from './CompanyUsers';
import { useUserRole } from '../../hooks/useUserRole';

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
  },
  {
    id: 'custom',
    name: 'Custom Calendar',
    description: 'Add your custom calendar link',
    logo: '/images/calendar-providers/custom-calendar.svg',
    bgColor: 'bg-gray-100',
    providerName: 'custom'
  }
];

type SettingsTab = 'calendar' | 'email' | 'voice' | 'invite_users';

interface VoiceOption {
  id: string;
  label: string;
  gender: 'male' | 'female';
}

const voiceOptions: VoiceOption[] = [
  { id: 'josh', label: 'Josh', gender: 'male' },
  { id: 'florian', label: 'Florian', gender: 'male' },
  { id: 'derek', label: 'Derek', gender: 'male' },
  { id: 'june', label: 'June', gender: 'female' },
  { id: 'nat', label: 'Nat', gender: 'male' },
  { id: 'paige', label: 'Paige', gender: 'female' }
];

interface BackgroundOption {
  id: string;
  label: string;
}

const backgroundOptions: BackgroundOption[] = [
  { id: 'office', label: 'Office' },
  { id: 'cafe', label: 'Cafe' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'none', label: 'None' }
];

interface LanguageOption {
  id: string;
  label: string;
  region?: string;
}

const languageOptions: LanguageOption[] = [
  { id: 'en', label: 'English' },
  { id: 'en-US', label: 'English', region: 'US' },
  { id: 'en-GB', label: 'English', region: 'UK' },
  { id: 'en-AU', label: 'English', region: 'Australia' },
  { id: 'en-NZ', label: 'English', region: 'New Zealand' },
  { id: 'en-IN', label: 'English', region: 'India' },
  { id: 'zh', label: 'Chinese', region: 'Mandarin, Simplified' },
  { id: 'zh-CN', label: 'Chinese', region: 'Mandarin, Simplified, China' },
  { id: 'zh-Hans', label: 'Chinese', region: 'Mandarin, Simplified, Hans' },
  { id: 'zh-TW', label: 'Chinese', region: 'Mandarin, Traditional' },
  { id: 'zh-Hant', label: 'Chinese', region: 'Mandarin, Traditional, Hant' },
  { id: 'es', label: 'Spanish' },
  { id: 'es-419', label: 'Spanish', region: 'Latin America' },
  { id: 'fr', label: 'French' },
  { id: 'fr-CA', label: 'French', region: 'Canada' },
  { id: 'de', label: 'German' },
  { id: 'el', label: 'Greek' },
  { id: 'hi', label: 'Hindi' },
  { id: 'hi-Latn', label: 'Hindi', region: 'Latin script' },
  { id: 'ja', label: 'Japanese' },
  { id: 'ko', label: 'Korean' },
  { id: 'ko-KR', label: 'Korean', region: 'Korea' },
  { id: 'pt', label: 'Portuguese' },
  { id: 'pt-BR', label: 'Portuguese', region: 'Brazil' },
  { id: 'it', label: 'Italian' },
  { id: 'nl', label: 'Dutch' },
  { id: 'pl', label: 'Polish' },
  { id: 'ru', label: 'Russian' },
  { id: 'sv', label: 'Swedish' },
  { id: 'sv-SE', label: 'Swedish', region: 'Sweden' },
  { id: 'da', label: 'Danish' },
  { id: 'da-DK', label: 'Danish', region: 'Denmark' },
  { id: 'fi', label: 'Finnish' },
  { id: 'id', label: 'Indonesian' },
  { id: 'ms', label: 'Malay' },
  { id: 'tr', label: 'Turkish' },
  { id: 'uk', label: 'Ukrainian' },
  { id: 'bg', label: 'Bulgarian' },
  { id: 'cs', label: 'Czech' },
  { id: 'ro', label: 'Romanian' },
  { id: 'sk', label: 'Slovak' }
];

interface VoiceAgentSettings {
  voice: string;
  background_track: string;
  temperature?: number;
  language: string;
  prompt: string;
  call_from_number: string;
  transfer_phone_number: string;
  agent_name: string;
}

interface InviteUserRow {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'SDR';
}

interface InviteResponse {
  message: string;
  results: Array<{
    email: string;
    status: string;
    message: string;
  }>;
}

declare module '../../services/companies' {
  interface Company {
    custom_calendar_url?: string;
    voice_agent_settings?: VoiceAgentSettings;
  }
}

export function CompanySettings() {
  const { companyId } = useParams<{ companyId: string }>();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { isAdmin, isLoading: isRoleLoading, error: roleError } = useUserRole(companyId);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>('calendar');
  const [selectedEmailProvider, setSelectedEmailProvider] = useState('gmail');
  const [isSavingCredentials, setIsSavingCredentials] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string>('florian');
  const [isVoiceDropdownOpen, setIsVoiceDropdownOpen] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<string>('none');
  const [isBackgroundDropdownOpen, setIsBackgroundDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string[]>([]);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [agentName, setAgentName] = useState<string>('');
  const [credentials, setCredentials] = useState<AccountCredentials>({
    account_email: '',
    account_password: '',
    type: selectedEmailProvider
  });
  const [prompt, setPrompt] = useState<string>('');
  const [callFromNumber, setCallFromNumber] = useState<string>('');
  const [transferNumber, setTransferNumber] = useState<string>('');
  const [isSavingVoiceSettings, setIsSavingVoiceSettings] = useState(false);
  const [inviteUsers, setInviteUsers] = useState<InviteUserRow[]>([
    { id: '1', name: '', email: '', role: 'SDR' }
  ]);
  const [isSendingInvites, setIsSendingInvites] = useState(false);
  const [refreshUsersList, setRefreshUsersList] = useState<(() => void) | undefined>();
  
  // Add custom calendar state
  const [showCustomCalendarModal, setShowCustomCalendarModal] = useState(false);
  const [customCalendarUrl, setCustomCalendarUrl] = useState('');
  const [isSavingCustomCalendar, setIsSavingCustomCalendar] = useState(false);

  useEffect(() => {
    // Check if user has admin role
    if (!isRoleLoading && !isAdmin) {
      showToast('You do not have permission to access this page. Only admins can access company settings.', 'error');
      navigate(`/companies/${companyId}`);
      return;
    }

    // Only fetch company data if user is admin
    if (!isRoleLoading && isAdmin && companyId) {
      const fetchCompany = async () => {
        try {
          const token = getToken();
          if (!token) {
            setError('Authentication token not found');
            return;
          }

          const companyData = await getCompanyById(token, companyId);
          setCompany(companyData);

          // Set voice agent settings if they exist
          if (companyData.voice_agent_settings) {
            const settings = companyData.voice_agent_settings;
            setSelectedVoice(settings.voice || 'florian');
            setSelectedBackground(settings.background_track || 'none');
            setSelectedLanguage(settings.language ? [settings.language] : []);
            setPrompt(settings.prompt || '');
            setCallFromNumber(settings.call_from_number || '');
            setTransferNumber(settings.transfer_phone_number || '');
            setAgentName(settings.agent_name || '');
          }

          if (companyData.account_email) {
            setCredentials(prev => ({
              ...prev,
              account_email: companyData.account_email || ''
            }));
          }
        } catch (err) {
          console.error('Error fetching company:', err);
          setError(err instanceof Error ? err.message : 'Failed to fetch company details');
        } finally {
          setIsLoading(false);
        }
      };

      fetchCompany();
    }
  }, [companyId, isAdmin, isRoleLoading, navigate, showToast]);

  useEffect(() => {
    setCredentials(prev => ({
      ...prev,
      type: selectedEmailProvider
    }));
  }, [selectedEmailProvider]);

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
      showToast('Failed to save email settings, please check your credentials and try again', 'error');
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

  const handleVoiceSettingsSave = async () => {
    if (!companyId) return;

    setIsSavingVoiceSettings(true);
    try {
      const token = getToken();
      if (!token) {
        showToast('Authentication failed', 'error');
        return;
      }

      const response = await fetch(apiEndpoints.companies.voiceAgentSettings(companyId || ''), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voice: selectedVoice,
          background_track: selectedBackground,
          language: selectedLanguage.join(','),
          prompt,
          call_from_number: callFromNumber,
          transfer_phone_number: transferNumber,
          agent_name: agentName,
          record: true
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update voice agent settings');
      }

      const updatedCompany = await response.json();
      setCompany(updatedCompany);
      showToast('Voice agent settings saved successfully', 'success');
    } catch (error) {
      console.error('Error saving voice agent settings:', error);
      showToast('Failed to save voice agent settings', 'error');
    } finally {
      setIsSavingVoiceSettings(false);
    }
  };

  const addInviteUserRow = () => {
    setInviteUsers([
      ...inviteUsers,
      { id: Date.now().toString(), name: '', email: '', role: 'SDR' }
    ]);
  };

  const removeInviteUserRow = (id: string) => {
    setInviteUsers(inviteUsers.filter(user => user.id !== id));
  };

  const updateInviteUserRow = (id: string, field: keyof InviteUserRow, value: string) => {
    setInviteUsers(inviteUsers.map(user => 
      user.id === id ? { ...user, [field]: value } : user
    ));
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendInvites = async () => {
    if (!companyId) return;

    // Validate all email fields
    const invalidEmails = inviteUsers.filter(user => !isValidEmail(user.email));
    if (invalidEmails.length > 0) {
      showToast('Please fix invalid email addresses before sending invites', 'error');
      return;
    }

    // Validate all roles are selected
    const missingRoles = inviteUsers.filter(user => !user.role);
    if (missingRoles.length > 0) {
      showToast('Please select a role for all users', 'error');
      return;
    }

    setIsSendingInvites(true);
    try {
      const token = getToken();
      if (!token) {
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      const response = await fetch(apiEndpoints.companies.invite(companyId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          invites: inviteUsers.map(user => ({
            email: user.email,
            name: user.name || undefined,
            role: user.role.toLowerCase() // Convert role to lowercase
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send invites');
      }

      const data: InviteResponse = await response.json();

      // Show success message
      showToast(data.message, 'success');

      // Show individual results if there are any failures
      const failures = data.results.filter(result => result.status !== 'success');
      if (failures.length > 0) {
        failures.forEach(failure => {
          showToast(`${failure.email}: ${failure.message}`, 'error');
        });
      }

      // Reset form if all successful
      if (failures.length === 0) {
        setInviteUsers([{
          id: uuidv4(),
          name: '',
          email: '',
          role: 'SDR'
        }]);

        // Refresh the users list
        if (refreshUsersList) {
          refreshUsersList();
        }
      }
    } catch (error) {
      console.error('Error sending invites:', error);
      showToast('Failed to send invites. Please try again.', 'error');
    } finally {
      setIsSendingInvites(false);
    }
  };

  // Add a function to handle saving the custom calendar URL
  const handleSaveCustomCalendar = async () => {
    if (!companyId || !customCalendarUrl) return;
    
    setIsSavingCustomCalendar(true);
    try {
      const token = getToken();
      if (!token) {
        showToast('Authentication failed. Please try logging in again.', 'error');
        return;
      }

      // Here you would typically make an API call to save the custom calendar URL
      // For now, we'll just simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the company state to reflect the custom calendar connection
      setCompany(prev => prev ? {
        ...prev,
        custom_calendar_url: customCalendarUrl,
        cronofy_provider: 'custom'
      } : null);
      
      setShowCustomCalendarModal(false);
      showToast('Custom calendar added successfully', 'success');
    } catch (error) {
      console.error('Error saving custom calendar:', error);
      showToast('Failed to add custom calendar', 'error');
    } finally {
      setIsSavingCustomCalendar(false);
    }
  };

  if (isRoleLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || roleError) {
    return (
      <div className="text-center text-red-600 mt-8">
        {error || roleError}
      </div>
    );
  }

  const isCalendarConnected = company?.cronofy_provider && company?.cronofy_linked_email;
  const connectedProvider = calendarProviders.find(p => p.providerName === company?.cronofy_provider);

  const tabs = [
    { id: 'calendar', name: 'Calendar', icon: Calendar },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'voice', name: 'Voice Agent', icon: Mic },
    { id: 'invite_users', name: 'Invite Users', icon: UserPlus },
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
                className="form-input"
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
                'Test Connection & Save Email Settings'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  const renderInviteUsersTab = () => (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center">
          <UserPlus className="h-6 w-6 text-gray-400" />
          <h2 className="ml-3 text-lg font-medium text-gray-900">Invite Users</h2>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Invite team members to join your company
        </p>
      </div>
      <div className="px-6 py-6">
        <div className="space-y-6">
          {inviteUsers.map((user, index) => (
            <div key={user.id} className="flex items-start space-x-4">
              <div className="flex-1 grid grid-cols-3 gap-6">
                <div>
                  <label htmlFor={`name-${user.id}`} className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id={`name-${user.id}`}
                      value={user.name}
                      onChange={(e) => updateInviteUserRow(user.id, 'name', e.target.value)}
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor={`email-${user.id}`} className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id={`email-${user.id}`}
                      value={user.email}
                      onChange={(e) => updateInviteUserRow(user.id, 'email', e.target.value)}
                      className={clsx(
                        "appearance-none block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-indigo-500 sm:text-sm",
                        user.email && !isValidEmail(user.email)
                          ? "border-red-300 focus:border-red-500 text-red-900 placeholder-red-300"
                          : "border-gray-300 focus:border-indigo-500"
                      )}
                      placeholder="john@example.com"
                      required
                    />
                    {user.email && !isValidEmail(user.email) && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {user.email && !isValidEmail(user.email) && (
                    <p className="mt-1 text-xs text-red-600">Please enter a valid email address</p>
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <label htmlFor={`role-${user.id}`} className="block text-sm font-medium text-gray-700">
                      Role <span className="text-red-500">*</span>
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
                            <div className="space-y-2">
                              <p>
                                <span className="font-semibold">Admin:</span> Has full access to manage users, campaigns, leads, company settings, and configurations.
                              </p>
                              <p>
                                <span className="font-semibold">SDR:</span> Can manage leads and campaigns but cannot invite users, delete the company, or change company settings.
                              </p>
                            </div>
                            <Tooltip.Arrow className="fill-gray-900" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCircle className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id={`role-${user.id}`}
                      value={user.role}
                      onChange={(e) => updateInviteUserRow(user.id, 'role', e.target.value as 'Admin' | 'SDR')}
                      className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    >
                      <option value="Admin">Admin</option>
                      <option value="SDR">SDR</option>
                    </select>
                  </div>
                </div>
              </div>
              {inviteUsers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInviteUserRow(user.id)}
                  className="mt-7 inline-flex items-center p-1.5 border border-transparent rounded-full text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={addInviteUserRow}
              disabled={isSendingInvites}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Another User
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={sendInvites}
              disabled={isSendingInvites}
            >
              {isSendingInvites ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Sending Invites...
                </>
              ) : (
                'Send Invites'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'calendar':
        return (
          <div className="space-y-6">
            {/* Calendar settings */}
            {isCalendarConnected && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-5 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={connectedProvider?.logo}
                        alt={`${connectedProvider?.name} logo`}
                        className="h-8 w-8 rounded-lg"
                      />
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {connectedProvider?.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {company?.cronofy_provider === 'custom' 
                            ? `Custom URL: ${company?.custom_calendar_url}`
                            : `Connected as ${company?.cronofy_linked_email}`
                          }
                        </p>
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
                        {provider.id === 'custom' ? (
                          <Calendar className="w-full h-full text-indigo-600" />
                        ) : (
                          <img
                            src={provider.logo}
                            alt={`${provider.name} logo`}
                            className="w-full h-full object-contain"
                          />
                        )}
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
                      {provider.id === 'custom' ? (
                        company?.cronofy_provider === 'custom' ? (
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
                                  onClick={isCalendarConnected ? undefined : () => setShowCustomCalendarModal(true)}
                                >
                                  Add
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
                        )
                      ) : (
                        company?.cronofy_provider === provider.providerName ? (
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
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Calendar Modal */}
            <Dialog
              isOpen={showCustomCalendarModal}
              onClose={() => setShowCustomCalendarModal(false)}
              title="Add Custom Calendar"
            >
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Enter your custom calendar URL to connect it with ReachGenie.
                </p>
                <div>
                  <label htmlFor="customCalendarUrl" className="block text-sm font-medium text-gray-700">
                    Calendar URL
                  </label>
                  <input
                    type="url"
                    id="customCalendarUrl"
                    name="customCalendarUrl"
                    value={customCalendarUrl}
                    onChange={(e) => setCustomCalendarUrl(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="https://example.com/calendar"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowCustomCalendarModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCustomCalendar}
                    disabled={!customCalendarUrl || isSavingCustomCalendar}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingCustomCalendar ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      'Save'
                    )}
                  </button>
                </div>
              </div>
            </Dialog>
          </div>
        );

      case 'invite_users':
        return (
          <div className="space-y-6">
            <CompanyUsers onRefreshNeeded={(refreshFn) => setRefreshUsersList(() => refreshFn)} />
            {renderInviteUsersTab()}
          </div>
        );

      case 'email':
        return renderEmailSettings();

      case 'voice':
        return (
          <div className="space-y-6">
            {/* Voice settings */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-center">
                  <Mic className="h-6 w-6 text-gray-400" />
                  <h2 className="ml-3 text-lg font-medium text-gray-900">Voice Agent Settings</h2>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Configure your voice agent settings
                </p>
              </div>
              <div className="px-6 py-6 space-y-6">
                <div>
                  <div className="flex items-center space-x-2">
                    <label htmlFor="agentName" className="block text-sm font-medium text-gray-700">
                      Default Agent Name
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
                            The name your AI agent will use when introducing itself
                            <Tooltip.Arrow className="fill-gray-900" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCircle className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="agentName"
                      name="agentName"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="e.g. Alex, Sarah, etc."
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <label htmlFor="voice" className="block text-sm font-medium text-gray-700">
                      Voice Selection
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
                            Voice of your AI agent
                            <Tooltip.Arrow className="fill-gray-900" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                  <div className="relative mt-1">
                    <button
                      type="button"
                      className="relative w-full bg-white pl-10 pr-10 py-2 text-left border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                      onClick={() => setIsVoiceDropdownOpen(!isVoiceDropdownOpen)}
                    >
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {selectedVoice ? (
                          voiceOptions.find(v => v.id === selectedVoice)?.gender === 'male' ? (
                            <UserSquare2 className="h-5 w-5 text-blue-500" />
                          ) : (
                            <UserCircle className="h-5 w-5 text-pink-500" />
                          )
                        ) : (
                          <Mic className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <span className="block truncate">
                        {selectedVoice ? voiceOptions.find(v => v.id === selectedVoice)?.label : 'Select a voice'}
                      </span>
                      <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </span>
                    </button>
                    {isVoiceDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                        {voiceOptions.map((voice) => (
                          <div
                            key={voice.id}
                            className={`${
                              selectedVoice === voice.id ? 'bg-indigo-50 text-indigo-900' : 'text-gray-900'
                            } cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-indigo-50`}
                            onClick={() => {
                              setSelectedVoice(voice.id);
                              setIsVoiceDropdownOpen(false);
                            }}
                          >
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                              {voice.gender === 'male' ? (
                                <UserSquare2 className="h-5 w-5 text-blue-500" />
                              ) : (
                                <UserCircle className="h-5 w-5 text-pink-500" />
                              )}
                            </span>
                            <span className={`block truncate ${selectedVoice === voice.id ? 'font-semibold' : 'font-normal'}`}>
                              {voice.label}
                            </span>
                            {selectedVoice === voice.id && (
                              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-600">
                                <Check className="h-5 w-5" />
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                      Language
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
                            Language you'd like to support
                            <Tooltip.Arrow className="fill-gray-900" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                  <div className="relative mt-1">
                    <button
                      type="button"
                      className="relative w-full bg-white pl-10 pr-10 py-2 text-left border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                      onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                    >
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Globe2 className="h-5 w-5 text-gray-400" />
                      </div>
                      <span className="block truncate">
                        {selectedLanguage.length === 0 
                          ? 'Select languages' 
                          : selectedLanguage.length === 1 
                            ? (() => {
                                const lang = languageOptions.find(l => l.id === selectedLanguage[0]);
                                if (!lang) return 'Select languages';
                                return lang.region ? `${lang.label} (${lang.region})` : lang.label;
                              })()
                            : `${selectedLanguage.length} languages selected`
                        }
                      </span>
                      <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </span>
                    </button>
                    {isLanguageDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                        {languageOptions.map((language) => (
                          <div
                            key={language.id}
                            className={`${
                              selectedLanguage.includes(language.id) ? 'bg-indigo-50 text-indigo-900' : 'text-gray-900'
                            } cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-indigo-50`}
                            onClick={() => {
                              const isSelected = selectedLanguage.includes(language.id);
                              if (isSelected) {
                                setSelectedLanguage(selectedLanguage.filter(id => id !== language.id));
                              } else {
                                setSelectedLanguage([...selectedLanguage, language.id]);
                              }
                            }}
                          >
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                              <Globe2 className="h-5 w-5 text-gray-400" />
                            </span>
                            <span className={`block truncate ${selectedLanguage.includes(language.id) ? 'font-semibold' : 'font-normal'}`}>
                              {language.region ? `${language.label} (${language.region})` : language.label}
                            </span>
                            {selectedLanguage.includes(language.id) && (
                              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-600">
                                <Check className="h-5 w-5" />
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <label htmlFor="background" className="block text-sm font-medium text-gray-700">
                      Background Sounds
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
                            What background sounds you'd like to have. This makes agents appear more human.
                            <Tooltip.Arrow className="fill-gray-900" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                  <div className="relative mt-1">
                    <button
                      type="button"
                      className="relative w-full bg-white pl-10 pr-10 py-2 text-left border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                      onClick={() => setIsBackgroundDropdownOpen(!isBackgroundDropdownOpen)}
                    >
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Volume2 className={`h-5 w-5 ${selectedBackground === 'none' ? 'text-gray-400' : 'text-indigo-500'}`} />
                      </div>
                      <span className="block truncate">
                        {backgroundOptions.find(b => b.id === selectedBackground)?.label || 'Select background'}
                      </span>
                      <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </span>
                    </button>
                    {isBackgroundDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                        {backgroundOptions.map((background) => (
                          <div
                            key={background.id}
                            className={`${
                              selectedBackground === background.id ? 'bg-indigo-50 text-indigo-900' : 'text-gray-900'
                            } cursor-pointer select-none relative py-2 pl-10 pr-4 hover:bg-indigo-50`}
                            onClick={() => {
                              setSelectedBackground(background.id);
                              setIsBackgroundDropdownOpen(false);
                            }}
                          >
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                              <Volume2 className={`h-5 w-5 ${background.id === 'none' ? 'text-gray-400' : 'text-indigo-500'}`} />
                            </span>
                            <span className={`block truncate ${selectedBackground === background.id ? 'font-semibold' : 'font-normal'}`}>
                              {background.label}
                            </span>
                            {selectedBackground === background.id && (
                              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-600">
                                <Check className="h-5 w-5" />
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <label htmlFor="callFromNumber" className="block text-sm font-medium text-gray-700">
                      Number to call from
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
                            Which number should appear in the calls
                            <Tooltip.Arrow className="fill-gray-900" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                  <div className="relative mt-1">
                    <input
                      type="text"
                      id="callFromNumber"
                      name="callFromNumber"
                      value={callFromNumber}
                      onChange={(e) => setCallFromNumber(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="mt-1 text-sm text-indigo-600">
                    <button
                      type="button"
                      className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
                    >
                      Buy number
                    </button>
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <label htmlFor="transferNumber" className="block text-sm font-medium text-gray-700">
                      Transfer number
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
                            If prospects want to talk to a human which number should be used
                            <Tooltip.Arrow className="fill-gray-900" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                  <div className="relative mt-1">
                    <input
                      type="text"
                      id="transferNumber"
                      name="transferNumber"
                      value={transferNumber}
                      onChange={(e) => setTransferNumber(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="script" className="block text-sm font-medium text-gray-700 mb-1">
                    Basic guideline for the agent
                  </label>
                  <div className="flex items-center space-x-2 mb-1">
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
                            What instructions would you like to give to the agent
                            <Tooltip.Arrow className="fill-gray-900" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>
                  <div className="relative">
                    <textarea
                      id="script"
                      name="script"
                      rows={4}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg bg-white placeholder-gray-500"
                      placeholder="e.g. You are Alex, a sales representative agent at Acme contacting prospect for a demo"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={isSavingVoiceSettings}
                    onClick={handleVoiceSettingsSave}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingVoiceSettings ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      'Save Voice Settings'
                    )}
                  </button>
                </div>
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