import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../types';
import { apiEndpoints } from '../../config';
import { getToken } from '../../utils/auth';
import { Dialog } from '../shared/Dialog';
import { useToast } from '../../context/ToastContext';
import ChangeSubscriptionDialog from './ChangeSubscriptionDialog';
import { getUser } from '../../services/users';

interface SubscriptionItem {
  name: string;
  quantity: number;
  price: string;
  currency: string;
  interval: string;
  usage_type?: string;
}

interface SubscriptionInfo {
  plan_type: 'fixed' | 'performance' | 'trial';
  lead_tier: number;
  channels_active: string[];
  subscription_status: string;
  billing_period_start?: string;
  billing_period_end?: string;
  has_subscription?: boolean;
  subscription_items?: SubscriptionItem[];
}

export function SubscriptionDetails() {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showChangeDialog, setShowChangeDialog] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      try {
        const token = getToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        const data = await getUser(token, { showSubscriptionDetails: true });
        console.log('API Response:', data);
        // Transform user data into subscription info
        if (data.plan_type || data.subscription || data.subscription_details) {
          const subscriptionData = {
            plan_type: (data.plan_type || data.subscription?.plan_type || 'fixed') as 'fixed' | 'performance' | 'trial',
            lead_tier: data.lead_tier || data.subscription?.lead_tier || 2500,
            channels_active: data.channels_active 
              ? Object.entries(data.channels_active)
                  .filter(([_, isActive]) => isActive)
                  .map(([channel]) => channel)
              : data.subscription?.channels_active || [],
            subscription_status: data.subscription_status || 'inactive',
            billing_period_start: data.billing_period_start,
            billing_period_end: data.billing_period_end,
            has_subscription: data.subscription_details?.has_subscription || false,
            subscription_items: data.subscription_details?.subscription_items || [],
          };
          console.log('Transformed Subscription Data:', subscriptionData);
          setSubscriptionInfo(subscriptionData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchSubscriptionDetails();
    }
  }, [isAuthenticated]);

  const handleCancelSubscription = async () => {
    try {
      setCanceling(true);
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(apiEndpoints.subscription.cancel, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      // Update subscription status locally
      setSubscriptionInfo(prev => prev ? {
        ...prev,
        subscription_status: 'canceled'
      } : null);

      showToast('Subscription canceled successfully', 'success');
      setShowCancelDialog(false);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to cancel subscription', 'error');
    } finally {
      setCanceling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!subscriptionInfo) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
        <p>No active subscription found.</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
      case 'expired':
      case 'past_due':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateTotalAmount = () => {
    if (!subscriptionInfo.subscription_items) return 0;
    return subscriptionInfo.subscription_items.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.quantity);
    }, 0);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subscription Details</h1>
        <div className="flex space-x-3">
          {subscriptionInfo?.subscription_status.toLowerCase() === 'active' && (
            <>
              <button
                onClick={() => setShowChangeDialog(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors focus:outline-none"
              >
                Change Subscription
              </button>
              <button
                onClick={() => setShowCancelDialog(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors focus:outline-none"
              >
                Cancel Subscription
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Plan Type</h2>
            <p className="mt-1 text-lg">{subscriptionInfo.plan_type.charAt(0).toUpperCase() + subscriptionInfo.plan_type.slice(1)}</p>
          </div>
          
          {subscriptionInfo.plan_type !== 'trial' && (
            <div>
              <h2 className="text-sm font-medium text-gray-500">Status</h2>
              <div className="mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusColor(subscriptionInfo.subscription_status)}`}>
                  {subscriptionInfo.subscription_status.charAt(0).toUpperCase() + subscriptionInfo.subscription_status.slice(1)}
                </span>
              </div>
            </div>
          )}

          <div>
            <h2 className="text-sm font-medium text-gray-500">Lead Tier</h2>
            <p className="mt-1 text-lg">{subscriptionInfo.lead_tier.toLocaleString()} Leads</p>
          </div>

          {subscriptionInfo.billing_period_start && subscriptionInfo.billing_period_end && (
            <div className="col-span-2">
              <h2 className="text-sm font-medium text-gray-500">Billing Period</h2>
              <p className="mt-1 text-lg">
                {new Date(subscriptionInfo.billing_period_start).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                } as Intl.DateTimeFormatOptions)}
                <span className="mx-2">-</span>
                {new Date(subscriptionInfo.billing_period_end).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                } as Intl.DateTimeFormatOptions)}
              </p>
            </div>
          )}

          <div className="col-span-2">
            <h2 className="text-sm font-medium text-gray-500">Channels</h2>
            <div className="flex flex-wrap gap-2 mt-1">
              {subscriptionInfo.channels_active.map((channel) => (
                <span
                  key={channel}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {channel}
                </span>
              ))}
            </div>
          </div>

          {subscriptionInfo.has_subscription && subscriptionInfo.subscription_items && subscriptionInfo.subscription_items.length > 0 && (
            <div className="col-span-2 mt-6">
              <h2 className="text-sm font-medium text-gray-500 mb-4">Subscription Items</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subscriptionInfo.subscription_items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div className="flex items-center">
                            <span>{item.name}</span>
                            {item.usage_type === 'metered' && (
                              <span className="ml-2 text-xs text-gray-500">
                                (Varies with usage)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: item.currency
                          }).format(parseFloat(item.price))}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: item.currency
                          }).format(parseFloat(item.price) * item.quantity)}
                          {item.usage_type === 'licensed' && `/${item.interval}`}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">Total</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: subscriptionInfo.subscription_items[0]?.currency || 'USD'
                        }).format(calculateTotalAmount())}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Subscription Confirmation Dialog */}
      <Dialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        title="Cancel Subscription"
      >
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Are you sure you want to cancel your subscription?
            </h3>
            <p className="text-sm text-gray-500">
              This action cannot be undone. Your subscription will be canceled immediately and you will lose access to premium features.
            </p>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowCancelDialog(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
              disabled={canceling}
            >
              Keep Subscription
            </button>
            <button
              type="button"
              onClick={handleCancelSubscription}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none disabled:opacity-50"
              disabled={canceling}
            >
              {canceling ? 'Canceling...' : 'Yes, Cancel Subscription'}
            </button>
          </div>
        </div>
      </Dialog>

      {/* Change Subscription Dialog */}
      {subscriptionInfo && (
        <ChangeSubscriptionDialog
          isOpen={showChangeDialog}
          onClose={() => setShowChangeDialog(false)}
          currentPlanType={subscriptionInfo.plan_type}
          currentLeadTier={subscriptionInfo.lead_tier}
          currentChannels={subscriptionInfo.channels_active}
        />
      )}
    </div>
  );
} 