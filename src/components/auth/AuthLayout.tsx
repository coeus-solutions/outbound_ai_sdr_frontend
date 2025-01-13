import React from 'react';
import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <>
      <div className="text-center mb-4">
        <Link 
          to="/" 
          className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <Building2 className="h-10 w-10 text-indigo-600" />
          <span className="text-xl font-bold text-gray-900">ReachGenie.ai</span>
        </Link>
        <h2 className="mt-3 text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </>
  );
}