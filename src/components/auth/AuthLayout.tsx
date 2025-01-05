import React from 'react';
import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Building2 className="h-12 w-12 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">SDR AI</span>
          </Link>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}