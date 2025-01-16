import React, { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getToken } from '../../utils/auth';
import { cronofyAuth } from '../../services/companies';
import { useToast } from '../../context/ToastContext';

export function CronofyCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const code = searchParams.get('code');
  const companyId = searchParams.get('state');
  const redirectUrl = `${window.location.origin}/cronofy-auth`;
  const mounted = useRef(true);

  useEffect(() => {
    async function handleCronofyAuth() {
      if (!mounted.current) return;
      
      if (!code || !companyId) {
        showToast('Missing required parameters', 'error');
        navigate(`/companies/${companyId || ''}/settings`);
        return;
      }

      const token = getToken();
      if (!token) {
        showToast('Authentication token not found', 'error');
        navigate(`/companies/${companyId}/settings`);
        return;
      }

      try {
        await cronofyAuth(token, companyId, code, redirectUrl);
        showToast('Calendar connected successfully', 'success');
        navigate(`/companies/${companyId}/settings`);
      } catch (err) {
        console.error('Error connecting calendar:', err);
        showToast('Failed to connect calendar. Please try again.', 'error');
        navigate(`/companies/${companyId}/settings`);
      }
    }

    handleCronofyAuth();

    return () => {
      mounted.current = false;
    };
  }, [code, companyId, navigate, showToast, redirectUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Connecting Calendar
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Please wait while we complete the calendar integration...
        </p>
      </div>
    </div>
  );
} 