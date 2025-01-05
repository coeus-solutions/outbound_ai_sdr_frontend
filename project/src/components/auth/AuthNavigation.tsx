import React from 'react';

interface AuthNavigationProps {
  onNavigate: (page: 'login' | 'signup' | 'forgot-password') => void;
  currentPage: 'login' | 'signup' | 'forgot-password';
}

export function AuthNavigation({ onNavigate, currentPage }: AuthNavigationProps) {
  return (
    <div className="text-sm text-center">
      {currentPage === 'login' && (
        <>
          <span className="text-gray-500">Don't have an account?</span>{' '}
          <button 
            onClick={() => onNavigate('signup')}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </button>
        </>
      )}
      {currentPage === 'signup' && (
        <>
          <span className="text-gray-500">Already have an account?</span>{' '}
          <button 
            onClick={() => onNavigate('login')}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </button>
        </>
      )}
    </div>
  );
}