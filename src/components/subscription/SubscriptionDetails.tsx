import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../types';
import { apiEndpoints } from '../../config';
import { getToken } from '../../utils/auth';

interface SubscriptionInfo {
  plan_type: 'fixed' | 'performance';
  lead_tier: number;
  channels_active: string[];
  subscription_status: string;
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
        if (data.plan_type || data.subscription) {
          const subscriptionData = {
            plan_type: (data.plan_type || data.subscription?.plan_type || 'fixed') as 'fixed' | 'performance',
            lead_tier: data.lead_tier || data.subscription?.lead_tier || 2500,
            channels_active: data.channels_active 
              ? Object.entries(data.channels_active)
                  .filter(([_, isActive]) => isActive)
                  .map(([channel]) => channel)
              : data.subscription?.channels_active || [],
            subscription_status: data.subscription_status || 'inactive',
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Subscription Details</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Plan Type</h2>
            <p className="mt-1 text-lg">{subscriptionInfo.plan_type.charAt(0).toUpperCase() + subscriptionInfo.plan_type.slice(1)}</p>
          </div>
          
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
        </div>

        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-2">Active Channels</h2>
          <div className="flex flex-wrap gap-2">
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
      </div>
    </div>
  );
} 