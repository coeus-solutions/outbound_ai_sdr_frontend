import React from 'react';
import { Package } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLink: string;
  actionText: string;
}

export function EmptyState({ title, description, actionLink, actionText }: EmptyStateProps) {
  return (
    <div className="text-center bg-white rounded-lg shadow-md p-8">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
        <Package className="h-6 w-6 text-indigo-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      <Link
        to={actionLink}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
      >
        {actionText}
      </Link>
    </div>
  );
}