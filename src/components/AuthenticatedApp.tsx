import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { DashboardLayout } from './dashboard/DashboardLayout';
import { CompanyList } from './companies/CompanyList';
import { AddCompany } from './companies/AddCompany';
import { CompanyProducts } from './companies/CompanyProducts';
import { AddProduct } from './companies/AddProduct';
import { EditProduct } from './companies/EditProduct';
import { LeadList } from './leads/LeadList';
import { CompanyCallLogs } from './companies/CompanyCallLogs';
import { UserProfile } from './user/UserProfile';
import { SubscriptionDetails } from './subscription/SubscriptionDetails';
import { logout } from '../utils/auth';

export function AuthenticatedApp() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const redirectPath = logout();
    navigate(redirectPath);
  };

  return (
    <Routes>
      <Route element={<DashboardLayout onLogout={handleLogout} />}>
        <Route path="/" element={<CompanyList />} />
        <Route path="/companies" element={<CompanyList />} />
        <Route path="/companies/new" element={<AddCompany />} />
        <Route path="/companies/:companyId/products" element={<CompanyProducts />} />
        <Route path="/companies/:companyId/products/new" element={<AddProduct />} />
        <Route path="/companies/:companyId/products/:productId/edit" element={<EditProduct />} />
        <Route path="/companies/:companyId/products/:productId/leads" element={<LeadList />} />
        <Route path="/companies/:companyId/calls" element={<CompanyCallLogs />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/subscription" element={<SubscriptionDetails />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}