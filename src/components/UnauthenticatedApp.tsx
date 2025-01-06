import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LoginForm } from './auth/LoginForm';
import { SignUpForm } from './auth/SignUpForm';
import { useAuth } from '../hooks/useAuth';

export function UnauthenticatedApp() {
  const { login } = useAuth();
  const location = useLocation();
  const isSignup = location.pathname === '/signup';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isSignup ? 'Create your account' : 'Sign in to your account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isSignup ? <SignUpForm onSignup={login} /> : <LoginForm onLogin={login} />}
        </div>
      </div>
    </div>
  );
}