import React from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { LoginForm } from './auth/LoginForm';
import { SignUpForm } from './auth/SignUpForm';
import { useAuth } from '../hooks/useAuth';
import { Building2 } from 'lucide-react';

export function UnauthenticatedApp() {
  const { login } = useAuth();
  const location = useLocation();
  const isSignup = location.pathname === '/signup';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex justify-center">
        <Link to="/" className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Building2 className="h-10 w-10 text-indigo-600" />
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            {isSignup ? 'ReachGenie.ai' : 'ReachGenie.ai'}
          </h2>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isSignup ? <SignUpForm onSignup={login} /> : <LoginForm onLogin={login} />}
        </div>
      </div>
    </div>
  );
}