import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/companies')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Back to companies"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </button>
        <div>
          {subtitle && <h2 className="text-sm font-medium text-gray-500">{subtitle}</h2>}
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}