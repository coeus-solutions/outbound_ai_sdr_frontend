import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './dashboard/DashboardLayout';
import { CompanyList } from './companies/CompanyList';
import { AddCompany } from './companies/AddCompany';
import { CompanyProducts } from './companies/CompanyProducts';
import { AddProduct } from './companies/AddProduct';
import { LeadList } from './leads/LeadList';
import { CompanyCallLogs } from './companies/CompanyCallLogs';

export function AuthenticatedApp() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<CompanyList />} />
        <Route path="/companies" element={<CompanyList />} />
        <Route path="/companies/new" element={<AddCompany />} />
        <Route path="/companies/:companyId/products" element={<CompanyProducts />} />
        <Route path="/companies/:companyId/products/new" element={<AddProduct />} />
        <Route path="/companies/:companyId/leads" element={<LeadList />} />
        <Route path="/companies/:companyId/calls" element={<CompanyCallLogs />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DashboardLayout>
  );
}