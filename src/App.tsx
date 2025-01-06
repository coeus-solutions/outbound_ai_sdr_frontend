import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { Dashboard } from './components/dashboard/Dashboard';
import { UnauthenticatedApp } from './components/UnauthenticatedApp';
import { useAuth } from './hooks/useAuth';
import { LandingPage } from './components/landing/LandingPage';
import { CompanyList } from './components/companies/CompanyList';
import { AddCompany } from './components/companies/AddCompany';
import { CompanyProducts } from './components/companies/CompanyProducts';
import { ToastProvider } from './context/ToastContext';

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
      navigate('/companies');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  return (
    <ToastProvider>
      {!isAuthenticated ? (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<UnauthenticatedApp />} />
          <Route path="/signup" element={<UnauthenticatedApp />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : (
        <DashboardLayout onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Navigate to="/companies" replace />} />
            <Route path="/companies" element={<CompanyList />} />
            <Route path="/companies/new" element={<AddCompany />} />
            <Route path="/companies/:companyId/products" element={<CompanyProducts />} />
            <Route path="*" element={<Navigate to="/companies" replace />} />
          </Routes>
        </DashboardLayout>
      )}
    </ToastProvider>
  );
}