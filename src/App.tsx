import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { Dashboard } from './components/dashboard/Dashboard';
import { UnauthenticatedApp } from './components/UnauthenticatedApp';
import { useAuth } from './hooks/useAuth';
import { LandingPage } from './components/landing/LandingPage';

export function App() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/' && !location.pathname.startsWith('/login') && !location.pathname.startsWith('/signup')) {
      navigate('/login');
    } else if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/')) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<UnauthenticatedApp />} />
        <Route path="/signup" element={<UnauthenticatedApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <DashboardLayout onLogout={handleLogout}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/companies" element={<div>Companies</div>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
}