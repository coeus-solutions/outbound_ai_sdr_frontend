import { useState } from 'react';
import { Dialog } from '../shared/Dialog';
import { Check, Mail, Phone, Linkedin, MessageCircle } from 'lucide-react';
import { apiEndpoints } from '../../config';
import { getToken } from '../../utils/auth';
import { useToast } from '../../context/ToastContext';

interface UpgradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type PlanType = 'fixed' | 'performance';

interface Channel {
  id: string;
  name: string;
  isAvailable: boolean;
  pricing: {
    fixed: number;
    performance: number;
  };
  icon: React.ComponentType<{ className?: string }>;
}

const channels: Channel[] = [
  { 
    id: 'email', 
    name: 'Email', 
    isAvailable: true,
    pricing: {
      fixed: 50,
      performance: 25
    },
    icon: Mail
  },
  { 
    id: 'phone', 
    name: 'Phone', 
    isAvailable: true,
    pricing: {
      fixed: 1500,
      performance: 750
    },
    icon: Phone
  },
  { 
    id: 'linkedin', 
    name: 'LinkedIn', 
    isAvailable: false,
    pricing: {
      fixed: 300,
      performance: 150
    },
    icon: Linkedin
  },
  { 
    id: 'whatsapp', 
    name: 'WhatsApp', 
    isAvailable: false,
    pricing: {
      fixed: 200,
      performance: 100
    },
    icon: MessageCircle
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

type LeadTierValue = 2500 | 5000 | 7500 | 10000;

interface PackagePricing {
  fixed: Record<LeadTierValue, number>;
  performance: Record<LeadTierValue, number>;
}

const packagePricing: PackagePricing = {
  fixed: {
    2500: 875,
    5000: 950,
    7500: 1025,
    10000: 1100
  },
  performance: {
    2500: 600,
    5000: 675,
    7500: 750,
    10000: 825
  }
};

export default function UpgradeDialog({ isOpen, onClose }: UpgradeDialogProps) {
  const [selectedPlanType, setSelectedPlanType] = useState(planTypes[0]);
  const [selectedLeadTier, setSelectedLeadTier] = useState(leadTiers[0]);
  const [selectedChannels, setSelectedChannels] = useState<Record<string, boolean>>({
    email: false,
    phone: false,
    whatsapp: false,
    linkedin: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleChannelToggle = (channelId: string) => {
    setSelectedChannels(prev => ({
      ...prev,
      [channelId]: !prev[channelId]
    }));
  };

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      if (!token) {
        showToast('Authentication required', 'error');
        return;
      }

      const response = await fetch(apiEndpoints.subscription.create, {
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
        throw new Error(error.detail || 'Failed to process upgrade request');
      }

      const data = await response.json();
      window.location.href = data.session_url;
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      showToast(error instanceof Error ? error.message : 'Failed to process upgrade request', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Upgrade Your Plan"
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
          <div className="grid grid-cols-4 gap-4">
            {leadTiers.map((tier) => (
              <button
                key={tier.value}
                onClick={() => setSelectedLeadTier(tier)}
                className={`${
                  selectedLeadTier.value === tier.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900'
                } relative flex cursor-pointer rounded-lg px-3 py-3 shadow-md focus:outline-none border min-w-[120px]`}
              >
                <div className="flex w-full items-center justify-between space-x-2">
                  <span className="text-sm font-medium whitespace-nowrap">
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
          <p className="text-xs text-gray-500 mt-2 px-2">
            Monthly enrichment capacity
          </p>
        </div>

        {/* Channels Selection */}
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

        {/* Cost Summary */}
        <div className="border-t border-gray-200 mt-6 pt-4">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Base Package ({selectedPlanType.name.split(' ')[0]} - {selectedLeadTier.value.toLocaleString()} Leads)
              </span>
              <span className="font-medium">${packagePricing[selectedPlanType.id][selectedLeadTier.value as LeadTierValue]}</span>
            </div>
            {channels.filter(channel => selectedChannels[channel.id]).map(channel => (
              <div key={channel.id} className="flex justify-between text-sm">
                <span className="text-gray-600">{channel.name} Channel</span>
                <span className="font-medium">${channel.pricing[selectedPlanType.id]}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-medium pt-2 border-t border-gray-200 mt-2">
              <span>Total Monthly Cost</span>
              <span>${
                packagePricing[selectedPlanType.id][selectedLeadTier.value as LeadTierValue] +
                channels.reduce((total, channel) => 
                  total + (selectedChannels[channel.id] ? channel.pricing[selectedPlanType.id] : 0)
                , 0)
              }</span>
            </div>
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
            onClick={handleUpgrade}
            disabled={isLoading || !Object.values(selectedChannels).some(Boolean)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Upgrade Now'}
          </button>
        </div>
      </div>
    </Dialog>
  );
} 