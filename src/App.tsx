import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { Dashboard } from './components/dashboard/Dashboard';
import { UnauthenticatedApp } from './components/UnauthenticatedApp';
import { useAuth } from './hooks/useAuth';

export function App() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    if (!isAuthenticated && !location.pathname.startsWith('/login') && !location.pathname.startsWith('/signup')) {
      navigate('/login');
    } else if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/signup')) {
      navigate('/');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<UnauthenticatedApp />} />
        <Route path="/signup" element={<UnauthenticatedApp />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <DashboardLayout onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="/companies" element={<div>Companies</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DashboardLayout>
  );
}