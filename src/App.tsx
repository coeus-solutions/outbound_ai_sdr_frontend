import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ToastProvider } from './context/ToastContext';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { LandingPage } from './components/landing/LandingPage';
import { CognismLandingPage } from './components/landing/CognismLandingPage';
import { SaasGroupLandingPage } from './components/landing/SaasGroupLandingPage';
import { PartnerPage } from './components/landing/PartnerPage';
import { UnauthenticatedApp } from './components/UnauthenticatedApp';
import { CompanyList } from './components/companies/CompanyList';
import { AddCompany } from './components/companies/AddCompany';
import { CompanyProducts } from './components/companies/CompanyProducts';
import { AddProduct } from './components/companies/AddProduct';
import { EditProduct } from './components/companies/EditProduct';
import { CompanyLeads } from './components/companies/CompanyLeads';
import { LeadList } from './components/leads/LeadList';
import { CompanyCallLogs } from './components/companies/CompanyCallLogs';
import { CompanyEmails } from './components/companies/CompanyEmails';
import { CompanyCampaigns } from './components/companies/CompanyCampaigns';
import { AddEmailCampaign } from './components/companies/AddEmailCampaign';
import { CompanySettings } from './components/companies/CompanySettings';
import { CronofyCallback } from './components/auth/CronofyCallback';
import { GettingStarted } from './components/dashboard/GettingStarted';
import { UserProfile } from './components/user/UserProfile';
import { VerifyAccount } from './components/auth/VerifyAccount';
import { InviteSignup } from './components/auth/InviteSignup';
import { CompanyCampaignRuns } from './components/companies/CompanyCampaignRuns';

// Import competitor pages
import { JasonAIPage } from './components/competitors/JasonAIPage';
import { AiSDRPage } from './components/competitors/AiSDRPage';
import { JazonByLyzrPage } from './components/competitors/JazonByLyzrPage';
import { AliceBy11xPage } from './components/competitors/AliceBy11xPage';
import { LuruPage } from './components/competitors/LuruPage';
import { RegieAIPage } from './components/competitors/RegieAIPage';
import { BoshByRelevancePage } from './components/competitors/BoshByRelevancePage';
import { PiperByQualifiedPage } from './components/competitors/PiperByQualifiedPage';
import { MeetChaseAISDRPage } from './components/competitors/MeetChaseAISDRPage';
import { GemEByUserGemsPage } from './components/competitors/GemEByUserGemsPage';
import { ArtisanAIPage } from './components/competitors/ArtisanAIPage';

export function App() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    // Only redirect to login if not on public routes
    if (!isAuthenticated && 
        location.pathname !== '/' && 
        location.pathname !== '/cognism' && 
        location.pathname !== '/saas-group' && 
        location.pathname !== '/partners' && 
        !location.pathname.startsWith('/login') && 
        !location.pathname.startsWith('/signup') && 
        !location.pathname.startsWith('/forgot-password') && 
        !location.pathname.startsWith('/reset-password') && 
        !location.pathname.startsWith('/verify-account') &&
        !location.pathname.startsWith('/invite') &&
        !location.pathname.startsWith('/compare/')) {
      navigate('/login');
    } 
    // Only redirect to companies if on auth routes
    else if (isAuthenticated && 
            (location.pathname === '/login' || 
             location.pathname === '/signup' || 
             location.pathname === '/forgot-password' || 
             location.pathname === '/reset-password')) {
      navigate('/companies');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  return (
    <ToastProvider>
      <Routes>
        <Route path="/cognism" element={<CognismLandingPage />} />
        <Route path="/saas-group" element={<SaasGroupLandingPage />} />
        <Route path="/partners" element={<PartnerPage />} />
        
        {/* Competitor comparison routes */}
        <Route path="/compare/jason-ai" element={<JasonAIPage />} />
        <Route path="/compare/aisdr" element={<AiSDRPage />} />
        <Route path="/compare/jazon-by-lyzr" element={<JazonByLyzrPage />} />
        <Route path="/compare/alice-by-11x" element={<AliceBy11xPage />} />
        <Route path="/compare/luru" element={<LuruPage />} />
        <Route path="/compare/regie-ai" element={<RegieAIPage />} />
        <Route path="/compare/bosh-by-relevance" element={<BoshByRelevancePage />} />
        <Route path="/compare/piper-by-qualified" element={<PiperByQualifiedPage />} />
        <Route path="/compare/meetchase-ai-sdr" element={<MeetChaseAISDRPage />} />
        <Route path="/compare/gem-e-by-usergems" element={<GemEByUserGemsPage />} />
        <Route path="/compare/artisan-ai" element={<ArtisanAIPage />} />
        
        {!isAuthenticated ? (
          <>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<UnauthenticatedApp />} />
            <Route path="/signup" element={<UnauthenticatedApp />} />
            <Route path="/forgot-password" element={<UnauthenticatedApp />} />
            <Route path="/reset-password" element={<UnauthenticatedApp />} />
            <Route path="/verify-account" element={<VerifyAccount />} />
            <Route path="/cronofy-auth" element={<CronofyCallback />} />
            <Route path="/getting-started" element={<GettingStarted />} />
            <Route path="/invite" element={<InviteSignup />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <Route element={<DashboardLayout onLogout={handleLogout} />}>
            <Route path="/" element={<Navigate to="/companies" replace />} />
            <Route path="/companies" element={<CompanyList />} />
            <Route path="/companies/new" element={<AddCompany />} />
            <Route path="/companies/:companyId/products" element={<CompanyProducts />} />
            <Route path="/companies/:companyId/products/new" element={<AddProduct />} />
            <Route path="/companies/:companyId/products/:productId/edit" element={<EditProduct />} />
            <Route path="/companies/:companyId/products/:productId/leads" element={<LeadList />} />
            <Route path="/companies/:companyId/leads" element={<CompanyLeads />} />
            <Route path="/companies/:companyId/calls" element={<CompanyCallLogs />} />
            <Route path="/companies/:companyId/emails" element={<CompanyEmails />} />
            <Route path="/companies/:companyId/campaigns" element={<CompanyCampaigns />} />
            <Route path="/companies/:companyId/campaign-runs" element={<CompanyCampaignRuns />} />
            <Route path="/companies/:companyId/campaigns/new" element={<AddEmailCampaign />} />
            <Route path="/companies/:companyId/settings" element={<CompanySettings />} />
            <Route path="/cronofy-auth" element={<CronofyCallback />} />
            <Route path="/getting-started" element={<GettingStarted />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="*" element={<Navigate to="/companies" replace />} />
          </Route>
        )}
      </Routes>
    </ToastProvider>
  );
}