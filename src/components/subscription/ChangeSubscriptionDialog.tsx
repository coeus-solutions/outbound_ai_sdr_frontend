import { useState, useEffect } from 'react';
import { Dialog } from '../shared/Dialog';
import { Check, Mail, Phone, Linkedin, MessageCircle } from 'lucide-react';
import { apiEndpoints } from '../../config';
import { getToken } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';

interface ChangeSubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlanType: 'fixed' | 'performance' | 'trial';
  currentLeadTier: number;
  currentChannels: string[];
}

interface Channel {
  id: string;
  name: string;
  isAvailable: boolean;
  icon: React.ComponentType<{ className?: string }>;
  pricing: {
    fixed: number;
    performance: number;
  };
}

const channels: Channel[] = [
  { 
    id: 'email', 
    name: 'Email', 
    isAvailable: true,
    icon: Mail,
    pricing: {
      fixed: 50,
      performance: 25
    }
  },
  { 
    id: 'phone', 
    name: 'Phone', 
    isAvailable: true,
    icon: Phone,
    pricing: {
      fixed: 1500,
      performance: 750
    }
  },
  { 
    id: 'linkedin', 
    name: 'LinkedIn', 
    isAvailable: false,
    icon: Linkedin,
    pricing: {
      fixed: 300,
      performance: 150
    }
  },
  { 
    id: 'whatsapp', 
    name: 'WhatsApp', 
    isAvailable: false,
    icon: MessageCircle,
    pricing: {
      fixed: 200,
      performance: 100
    }
  },
];

const planTypes = [
  { id: 'fixed' as const, name: 'Fixed Plan', description: 'Pay a fixed monthly fee regardless of results' },
  { id: 'performance' as const, name: 'Performance Plan', description: 'Pay based on the actual results and performance' },
];

const leadTiers = [
  { value: 2500, caption: '2,500 leads' },
  { value: 5000, caption: '5,000 leads' },
  { value: 7500, caption: '7,500 leads' },
  { value: 10000, caption: '10,000 leads' },
];

export default function ChangeSubscriptionDialog({ 
  isOpen, 
  onClose, 
  currentPlanType,
  currentLeadTier,
  currentChannels 
}: ChangeSubscriptionDialogProps) {
  const [selectedPlanType, setSelectedPlanType] = useState(planTypes.find(plan => plan.id === currentPlanType) || planTypes[0]);
  const [selectedLeadTier, setSelectedLeadTier] = useState(leadTiers.find(tier => tier.value === currentLeadTier) || leadTiers[0]);
  const [selectedChannels, setSelectedChannels] = useState<Record<string, boolean>>({
    email: currentChannels.includes('email'),
    phone: currentChannels.includes('phone'),
    whatsapp: currentChannels.includes('whatsapp'),
    linkedin: currentChannels.includes('linkedin')
  });
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleChannelToggle = (channelId: string) => {
    setSelectedChannels(prev => ({
      ...prev,
      [channelId]: !prev[channelId]
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      if (!token) {
        showToast('Authentication required', 'error');
        return;
      }

      const response = await fetch(apiEndpoints.subscription.change, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan_type: selectedPlanType.id,
          lead_tier: selectedLeadTier.value,
          channels: selectedChannels,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to change subscription');
      }

      showToast('Subscription updated successfully', 'success');
      onClose();
      // Optionally refresh the page or update the parent component
      window.location.reload();
    } catch (error) {
      console.error('Error changing subscription:', error);
      showToast(error instanceof Error ? error.message : 'Failed to change subscription', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Change Subscription"
      size="2xl"
    >
      <div className="space-y-6 p-6">
        {/* Plan Type Selection */}
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Plan Type
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {planTypes.map((plan) => (
                <div key={plan.id} className="flex flex-col">
                  <button
                    onClick={() => setSelectedPlanType(plan)}
                    className={`${
                      selectedPlanType.id === plan.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-900'
                    } relative flex cursor-pointer rounded-lg px-3 py-3 shadow-md focus:outline-none border w-full`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="text-sm font-medium">
                        {plan.name}
                      </span>
                      {selectedPlanType.id === plan.id && (
                        <div className="shrink-0 text-white">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </button>
                  <p className="text-xs text-gray-500 mt-1.5 px-2">
                    {plan.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lead Tier Selection */}
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Lead Tier
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {leadTiers.map((tier) => (
              <button
                key={tier.value}
                onClick={() => setSelectedLeadTier(tier)}
                className={`${
                  selectedLeadTier.value === tier.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900'
                } relative flex cursor-pointer rounded-lg px-3 py-3 shadow-md focus:outline-none border`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm font-medium">
                    {tier.caption}
                  </span>
                  {selectedLeadTier.value === tier.value && (
                    <div className="shrink-0 text-white">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Channel Selection */}
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Channels
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {channels.map((channel) => {
              const Icon = channel.icon;
              return (
                <button
                  key={channel.id}
                  onClick={() => channel.isAvailable && handleChannelToggle(channel.id)}
                  disabled={!channel.isAvailable}
                  className={`${
                    selectedChannels[channel.id]
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900'
                  } relative flex cursor-pointer rounded-lg px-3 py-3 shadow-md focus:outline-none border ${
                    !channel.isAvailable ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="flex w-full flex-col space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${
                          selectedChannels[channel.id] ? 'text-white' : 'text-gray-600'
                        }`} />
                        <span className="text-sm font-medium">{channel.name}</span>
                      </div>
                      {selectedChannels[channel.id] && channel.isAvailable && (
                        <Check className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4" />
                      <span className={`text-xs ${
                        selectedChannels[channel.id] ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        +${channel.pricing[selectedPlanType.id]}/month
                      </span>
                    </div>
                  </div>
                  {!channel.isAvailable && (
                    <div className="absolute top-0 right-0 m-2">
                      <span className="text-xs font-medium text-gray-900 bg-white/90 px-2 py-1 rounded shadow-sm">
                        Coming soon
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading || !Object.values(selectedChannels).some(Boolean)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Change Subscription'}
          </button>
        </div>
      </div>
    </Dialog>
  );
} 