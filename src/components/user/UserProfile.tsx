import React, { useState, useEffect } from 'react';
import { User, Lock, Mail } from 'lucide-react';
import { getUserEmail, getToken } from '../../utils/auth';
import { updateUser, getUser } from '../../services/users';
import { useToast } from '../../context/ToastContext';

export function UserProfile() {
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const userEmail = getUserEmail();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = getToken();
        if (!token) {
          showToast('Authentication failed. Please try logging in again.', 'error');
          return;
        }

        const userData = await getUser(token);
        setName(userData.name || '');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user profile';
        showToast(errorMessage, 'error');
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchUserProfile();
  }, [showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Name validation
      if (!name.trim()) {
        setError('Please enter your name');
        setIsLoading(false);
        return;
      }

      // Password validation
      if (newPassword || currentPassword || confirmPassword) {
        if (!currentPassword) {
          setError('Please enter your current password');
          setIsLoading(false);
          return;
        }

        if (!newPassword) {
          setError('Please enter your new password');
          setIsLoading(false);
          return;
        }

        if (newPassword.length < 8) {
          setError('New password must be at least 8 characters long');
          setIsLoading(false);
          return;
        }

        if (!confirmPassword) {
          setError('Please confirm your new password');
          setIsLoading(false);
          return;
        }

        if (newPassword !== confirmPassword) {
          setError('New passwords do not match');
          setIsLoading(false);
          return;
        }
      }

      const token = getToken();
      if (!token) {
        showToast('Authentication failed. Please try logging in again.', 'error');
        setIsLoading(false);
        return;
      }

      const updateData = {
        name: name.trim(),
        ...(newPassword ? {
          new_password: newPassword,
          old_password: currentPassword
        } : {})
      };

      const updatedUser = await updateUser(token, updateData);
      showToast('Profile updated successfully', 'success');

      // Clear password fields after successful update
      if (newPassword) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if any password field has a value
  const isPasswordFieldFilled = Boolean(currentPassword || newPassword || confirmPassword);

  if (isPageLoading) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-900">Profile Settings</h2>
          <p className="mt-1 text-sm text-gray-500">
            Update your profile information and password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" role="alert">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={userEmail || ''}
                disabled
                className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg text-gray-500 bg-gray-50 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your name"
                required
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
            <p className="mt-1 text-sm text-gray-500">
              Leave the password fields empty if you don't want to change it
            </p>

            <div className="mt-6 space-y-6">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter current password"
                    required={isPasswordFieldFilled}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter new password (minimum 8 characters)"
                    required={isPasswordFieldFilled}
                    minLength={8}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Confirm new password (minimum 8 characters)"
                    required={isPasswordFieldFilled}
                    minLength={8}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 