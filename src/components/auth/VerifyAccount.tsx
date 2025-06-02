import React, { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiEndpoints } from '../../config';
import { useToast } from '../../context/ToastContext';

export function VerifyAccount() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const token = searchParams.get('token');
  const hasShownToast = useRef(false);

  useEffect(() => {
    const verifyAccount = async () => {
      if (!token && !hasShownToast.current) {
        hasShownToast.current = true;
        showToast('Verification token is missing', 'error');
        navigate('/login');
        return;
      }

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(apiEndpoints.auth.verify, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Invalid or expired verification token');
        }

        if (!hasShownToast.current) {
          hasShownToast.current = true;
          showToast('Account verified successfully! Please login to continue.', 'success');
        }
        navigate('/login');
      } catch (error) {
        console.error('Verification error:', error);
        if (!hasShownToast.current) {
          hasShownToast.current = true;
          showToast(error instanceof Error ? error.message : 'Invalid or expired verification token', 'error');
        }
        navigate('/login');
      }
    };

    verifyAccount();
  }, [token, navigate, showToast]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Verifying your account</h2>
          <p className="mt-2 text-sm text-gray-600">Please wait while we verify your account...</p>
        </div>
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    </div>
  );
} 