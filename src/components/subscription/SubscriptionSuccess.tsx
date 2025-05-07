import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiEndpoints } from '../../config';

interface CheckoutResponse {
  success: boolean;
  message: string;
}

export function SubscriptionSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(10); // Changed to 10 seconds countdown
  const navigate = useNavigate();

  // Handle countdown and redirect
  useEffect(() => {
    if (status === 'success' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (status === 'success' && countdown === 0) {
      navigate('/companies');
    }
  }, [status, countdown, navigate]);
  
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setStatus('error');
      setMessage('Invalid session ID');
      return;
    }

    const fulfillCheckout = async () => {
      try {
        const response = await fetch(apiEndpoints.subscription.fulfillCheckout(sessionId), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setStatus('success');
          setMessage('Your subscription has been created successfully! The payment is currently being processed and will be activated shortly.');
        } else {
          setStatus('error');
          setMessage('There was an error processing your subscription.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('There was an error processing your subscription. Please contact support.');
      }
    };

    fulfillCheckout();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {status === 'loading' && (
          <div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Processing your subscription...
            </h2>
            <div className="mt-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          </div>
        )}
        
        {status === 'success' && (
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Thank You!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {message}
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Redirecting to dashboard in {countdown} seconds...
            </p>
          </div>
        )}
        
        {status === 'error' && (
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Oops!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 