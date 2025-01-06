import { useState, useEffect } from 'react';
import { isAuthenticated as checkAuth, logout as authLogout, setToken, getToken } from '../utils/auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => checkAuth());

  const login = (token: string) => {
    setToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    authLogout();
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const checkAuthStatus = () => {
      const authState = checkAuth();
      setIsAuthenticated(authState);
    };

    checkAuthStatus();
    const interval = setInterval(checkAuthStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    isAuthenticated,
    login,
    logout
  };
}