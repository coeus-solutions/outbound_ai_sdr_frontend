import { User } from '../types';

class Auth {
  private static instance: Auth;
  
  private constructor() {}
  
  static getInstance(): Auth {
    if (!Auth.instance) {
      Auth.instance = new Auth();
    }
    return Auth.instance;
  }

  login = () => {
    localStorage.setItem('isAuthenticated', 'true');
    window.location.reload(); // Force reload to update auth state
  };
  
  logout = () => {
    localStorage.removeItem('isAuthenticated');
    window.location.reload(); // Force reload to update auth state
  };
  
  isAuthenticated = (): boolean => {
    return localStorage.getItem('isAuthenticated') === 'true';
  };
}

export const auth = Auth.getInstance();