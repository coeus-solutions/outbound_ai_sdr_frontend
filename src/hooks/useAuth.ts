import { useState, useEffect } from 'react';
import { auth } from '../utils/auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => auth.isAuthenticated());

  const login = () => {
    auth.login();
    setIsAuthenticated(true);
  };

  const logout = () => {
    auth.logout();
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    login,
    logout
  };
}