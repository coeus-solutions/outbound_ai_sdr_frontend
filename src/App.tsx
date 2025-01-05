import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthenticatedApp } from './components/AuthenticatedApp';
import { UnauthenticatedApp } from './components/UnauthenticatedApp';
import { LandingPage } from './components/landing/LandingPage';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <AuthenticatedApp />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/*" element={<UnauthenticatedApp />} />
    </Routes>
  );
}