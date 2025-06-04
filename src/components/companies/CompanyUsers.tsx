import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getToken } from '../../utils/auth';
import { CompanyUserResponse, getCompanyUsers, deleteUserCompanyProfile } from '../../services/companies';
import { Users, Mail, Shield, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { Dialog } from '../shared/Dialog';

interface CompanyUsersProps {
  onRefreshNeeded?: (refreshFn: () => void) => void;
}

export function CompanyUsers({ onRefreshNeeded }: CompanyUsersProps) {
  const { companyId } = useParams<{ companyId: string }>();
  const { showToast } = useToast();
  const [users, setUsers] = useState<CompanyUserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<CompanyUserResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      const token = getToken();
      if (!token) {
        setError('Authentication token not found');
        return;
      }
      if (!companyId) {
        setError('Company ID not found');
        return;
      }
      const usersData = await getCompanyUsers(token, companyId);
      setUsers(usersData);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [companyId]);

  // Register the refresh callback
  useEffect(() => {
    if (onRefreshNeeded) {
      onRefreshNeeded(fetchUsers);
    }
  }, [onRefreshNeeded]);

  const handleDeleteClick = (user: CompanyUserResponse) => {
    setUserToDelete(user);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      const token = getToken();
      if (!token) {
        showToast('Authentication token not found', 'error');
        return;
      }

      await deleteUserCompanyProfile(token, userToDelete.user_company_profile_id);
      
      // Remove the user from the local state
      setUsers(users.filter(u => u.user_company_profile_id !== userToDelete.user_company_profile_id));
      showToast('User removed from company successfully', 'success');
      setUserToDelete(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      showToast(err instanceof Error ? err.message : 'Failed to remove user from company', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Company Users
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.user_company_profile_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="text-sm font-medium text-gray-900">
                        {user.name || 'N/A'}
                        {user.is_owner && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                            Owner
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="text-sm text-gray-900">{user.role}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDeleteClick(user)}
                      className="text-red-600 hover:text-red-900 transition-colors duration-200"
                      title="Remove user from company"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        isOpen={Boolean(userToDelete)}
        onClose={() => setUserToDelete(null)}
        title="Remove User from Company"
      >
        <div className="space-y-6">
          <p className="text-sm text-gray-500">
            Are you sure you want to remove "{userToDelete?.name || userToDelete?.email}" from the company? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setUserToDelete(null)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Removing...
                </>
              ) : (
                'Remove User'
              )}
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
} 