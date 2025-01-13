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
        <h2 className="mt-3 text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </>
  );
}