import React from 'react';

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function AuthLayout({ title, children }: AuthLayoutProps) {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}