import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { apiEndpoints } from '../../config';

interface ValidationError {
  detail: {
    loc: string[];
    msg: string;
    type: string;
  }[];
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(apiEndpoints.auth.forgotPassword, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422) {
          const validationError = data as ValidationError;
          const errorMessage = validationError.detail?.[0]?.msg || 'Invalid email format';
          throw new Error(errorMessage);
        }
        throw new Error(data.detail || 'Failed to send reset instructions');
      }

      setSuccessMessage('If an account exists with this email, you will receive password reset instructions.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while sending reset instructions');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white flex justify-center pt-8 px-4">
      <div className="w-full max-w-md">
        <AuthLayout title="Reset your password">
          <form onSubmit={handleSubmit} className="mt-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4" role="alert">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4" role="alert">
                {successMessage}
              </div>
            )}

            <div className="space-y-3 mb-6">
              <p className="text-sm text-gray-500">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="mb-4">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send reset instructions'}
              </button>
            </div>

            <div className="text-sm text-center">
              <Link 
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Back to login
              </Link>
            </div>
          </form>
        </AuthLayout>
      </div>
    </div>
  );
}