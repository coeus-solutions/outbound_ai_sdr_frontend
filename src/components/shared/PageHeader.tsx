import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export function PageHeader({ title, subtitle, action, showBackButton = true, onBackClick }: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate('/companies');
    }
  };

  return (
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center space-x-4">
        {showBackButton && (
          <button
            onClick={handleBackClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
        )}
        <div>
          {subtitle && <h2 className="text-xs font-medium text-gray-500">{subtitle}</h2>}
          <h1 className="text-lg font-bold text-gray-900">{title}</h1>
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}