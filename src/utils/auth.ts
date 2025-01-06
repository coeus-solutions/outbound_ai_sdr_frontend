import { config } from '../config';

export const getToken = () => localStorage.getItem('token');

export const setToken = (token: string) => localStorage.setItem('token', token);

export const removeToken = () => localStorage.removeItem('token');

export const isAuthenticated = () => !!getToken();

export const logout = () => {
  removeToken();
  
  if (config.isProduction) {
    window.location.href = '/login';
  }
  
  return '/login';
};