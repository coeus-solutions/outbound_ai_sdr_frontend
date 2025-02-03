import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { apiEndpoints } from '../../config';

interface ValidationError {
  detail: {
    loc: string[];
    msg: string;
    type: string;
  }[];
}

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Basic validation
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(apiEndpoints.auth.resetPassword, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          new_password: newPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422) {
          const validationError = data as ValidationError;
          const errorMessage = validationError.detail?.[0]?.msg || 'Invalid input';
          throw new Error(errorMessage);
        }
        throw new Error(data.detail || 'Failed to reset password');
      }

      setSuccessMessage('Your password has been reset successfully.');
      // Clear form
      setNewPassword('');
      setConfirmPassword('');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while resetting password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="bg-white flex justify-center pt-8 px-4">
        <div className="w-full max-w-md">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4" role="alert">
            Invalid or missing reset token. Please request a new password reset link.
          </div>
          <div className="text-center mt-4">
            <Link 
              to="/forgot-password"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Request new reset link
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
                <div className="mt-2">
                  <span className="text-sm">Redirecting to login page...</span>
                </div>
              </div>
            )}

            <div className="space-y-3 mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-input"
                  placeholder="New password"
                  disabled={isLoading}
                  minLength={8}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input"
                  placeholder="Confirm new password"
                  disabled={isLoading}
                  minLength={8}
                />
              </div>
            </div>

            <div className="mb-4">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Resetting password...' : 'Reset password'}
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