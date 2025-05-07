import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../types';
import { apiEndpoints } from '../../config';
import { getToken } from '../../utils/auth';

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

  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      try {
        const token = getToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(apiEndpoints.users.me, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch subscription details');
        }

        const data: User = await response.json();
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
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'canceled':
      case 'expired':
      case 'past_due':
        return 'text-red-600';
      default:
        return 'text-gray-600';
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
      <h1 className="text-2xl font-bold mb-6">Subscription Details</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Plan Type</h2>
            <p className="mt-1 text-lg">{subscriptionInfo.plan_type.charAt(0).toUpperCase() + subscriptionInfo.plan_type.slice(1)}</p>
          </div>
          
          {subscriptionInfo.plan_type !== 'trial' && (
            <>
              <div>
                <h2 className="text-sm font-medium text-gray-500">Status</h2>
                <p className={`mt-1 text-lg ${getStatusColor(subscriptionInfo.subscription_status)}`}>
                  {subscriptionInfo.subscription_status.charAt(0).toUpperCase() + subscriptionInfo.subscription_status.slice(1)}
                </p>
              </div>

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
                      year: 'numeric',
                    })}
                    <span className="mx-2">-</span>
                    {new Date(subscriptionInfo.billing_period_end).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              )}

              <div className="col-span-2">
                <h2 className="text-sm font-medium text-gray-500">Active Channels</h2>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
} 