import { config } from '../config';

export const getToken = () => localStorage.getItem('token');

export const setToken = (token: string) => localStorage.setItem('token', token);

export const removeToken = () => localStorage.removeItem('token');

export const isAuthenticated = () => !!getToken();

export const getUserEmail = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));

    return JSON.parse(jsonPayload).sub || null;
  } catch (err) {
    console.error('Error decoding token:', err);
    return null;
  }
};

export const logout = () => {
  removeToken();
  
  if (config.isProduction) {
    window.location.href = '/login';
  }
  
  return '/login';
};