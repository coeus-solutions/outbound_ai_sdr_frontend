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
import { AddProduct } from './components/companies/AddProduct';
import { CompanyLeads } from './components/companies/CompanyLeads';
import { CompanyCallLogs } from './components/companies/CompanyCallLogs';
import { CompanyEmailCampaigns } from './components/companies/CompanyEmailCampaigns';
import { AddEmailCampaign } from './components/companies/AddEmailCampaign';
import { CompanySettings } from './components/companies/CompanySettings';
import { CronofyCallback } from './components/auth/CronofyCallback';
import { ToastProvider } from './context/ToastContext';
import { GettingStarted } from './components/dashboard/GettingStarted';
import { UserProfile } from './components/user/UserProfile';
import { VerifyAccount } from './components/auth/VerifyAccount';
import { CompanyEmails } from './components/companies/CompanyEmails';
import { CompanyCampaigns } from './components/companies/CompanyCampaigns';

export function App() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/' && !location.pathname.startsWith('/login') && !location.pathname.startsWith('/signup') && !location.pathname.startsWith('/forgot-password') && !location.pathname.startsWith('/reset-password') && !location.pathname.startsWith('/verify-account')) {
      navigate('/login');
    } else if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/' || location.pathname === '/forgot-password' || location.pathname === '/reset-password')) {
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
          <Route path="/forgot-password" element={<UnauthenticatedApp />} />
          <Route path="/reset-password" element={<UnauthenticatedApp />} />
          <Route path="/verify-account" element={<VerifyAccount />} />
          <Route path="/cronofy-auth" element={<CronofyCallback />} />
          <Route path="/getting-started" element={<GettingStarted />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      ) : (
        <DashboardLayout onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Navigate to="/companies" replace />} />
            <Route path="/companies" element={<CompanyList />} />
            <Route path="/companies/new" element={<AddCompany />} />
            <Route path="/companies/:companyId/products" element={<CompanyProducts />} />
            <Route path="/companies/:companyId/products/new" element={<AddProduct />} />
            <Route path="/companies/:companyId/leads" element={<CompanyLeads />} />
            <Route path="/companies/:companyId/calls" element={<CompanyCallLogs />} />
            <Route path="/companies/:companyId/emails" element={<CompanyEmails />} />
            <Route path="/companies/:companyId/campaigns" element={<CompanyCampaigns />} />
            <Route path="/companies/:companyId/campaigns/new" element={<AddEmailCampaign />} />
            <Route path="/companies/:companyId/settings" element={<CompanySettings />} />
            <Route path="/cronofy-auth" element={<CronofyCallback />} />
            <Route path="/getting-started" element={<GettingStarted />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="*" element={<Navigate to="/companies" replace />} />
          </Routes>
        </DashboardLayout>
      )}
    </ToastProvider>
  );
}