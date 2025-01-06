import React from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLink: string;
  actionText: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLink, actionText, onAction }: EmptyStateProps) {
  const content = (
    <>
      <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
        <Package className="h-6 w-6 text-indigo-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
    </>
  );

  if (onAction) {
    return (
      <div className="text-center bg-white rounded-lg shadow-md p-8">
        {content}
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
        >
          {actionText}
        </button>
      </div>
    );
  }

  return (
    <div className="text-center bg-white rounded-lg shadow-md p-8">
      {content}
      <Link
        to={actionLink}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
      >
        {actionText}
      </Link>
    </div>
  );
}