import React from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { LoginForm } from './auth/LoginForm';
import { SignUpForm } from './auth/SignUpForm';
import { ForgotPasswordForm } from './auth/ForgotPasswordForm';
import { useAuth } from '../hooks/useAuth';
import { Footer } from './shared/Footer';

export function UnauthenticatedApp() {
  const { login } = useAuth();
  const location = useLocation();
  const isSignup = location.pathname === '/signup';
  const isForgotPassword = location.pathname === '/forgot-password';

  const renderForm = () => {
    if (isSignup) {
      return <SignUpForm onSignup={login} />;
    }
    if (isForgotPassword) {
      return <ForgotPasswordForm />;
    }
    return <LoginForm onLogin={login} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md flex justify-center">
          <Link to="/" className="inline-flex items-center space-x-0 hover:opacity-80 transition-opacity">
            <img src="/images/logo.png" alt="ReachGenie.ai Logo" className="h-8" />
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              ReachGenie.ai
            </h2>
          </Link>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {renderForm()}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}