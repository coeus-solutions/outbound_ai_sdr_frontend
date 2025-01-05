import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from './auth/AuthLayout';
import { LoginForm } from './auth/LoginForm';
import { SignUpForm } from './auth/SignUpForm';
import { ForgotPasswordForm } from './auth/ForgotPasswordForm';
import { useAuth } from '../hooks/useAuth';

export function UnauthenticatedApp() {
  const { login } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          <AuthLayout title="Sign in to your account">
            <LoginForm onLogin={login} />
          </AuthLayout>
        } 
      />
      <Route 
        path="/signup" 
        element={
          <AuthLayout title="Create your account">
            <SignUpForm onSignup={login} />
          </AuthLayout>
        } 
      />
      <Route 
        path="/forgot-password" 
        element={
          <AuthLayout title="Reset your password">
            <ForgotPasswordForm />
          </AuthLayout>
        } 
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}