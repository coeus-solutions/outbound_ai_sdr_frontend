import { useEffect, useState } from 'react';
import { getToken } from '../utils/auth';
import { UserInDB } from '../types';
import { getCurrentUser } from '../services/user';

export function useUserRole(companyId: string | undefined) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!companyId) {
        setIsLoading(false);
        return;
      }

      try {
        const token = getToken();
        if (!token) {
          setError('Authentication token not found');
          setIsLoading(false);
          return;
        }

        const userData = await getCurrentUser(token);
        
        // Check if user has admin role for the specified company
        const hasAdminRole = userData.company_roles?.some(
          role => role.company_id === companyId && role.role.toLowerCase() === 'admin'
        ) ?? false;

        setIsAdmin(hasAdminRole);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user role');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [companyId]);

  return { isAdmin, isLoading, error };
} 