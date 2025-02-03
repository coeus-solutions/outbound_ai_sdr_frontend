import React from 'react';
import { SkeletonLoader } from './SkeletonLoader';

interface CardSkeletonLoaderProps {
  hasHeader?: boolean;
  hasFooter?: boolean;
  hasActions?: boolean;
  actionCount?: number;
  contentSections?: number;
}

export const CardSkeletonLoader: React.FC<CardSkeletonLoaderProps> = ({
  hasHeader = true,
  hasFooter = false,
  hasActions = true,
  actionCount = 3,
  contentSections = 2
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {hasHeader && (
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-2">
            <SkeletonLoader className="h-6 w-48" />
            <SkeletonLoader className="h-4 w-64" />
          </div>
          {hasActions && (
            <div className="flex space-x-2">
              {[...Array(actionCount)].map((_, index) => (
                <SkeletonLoader key={index} className="h-8 w-8 rounded-full" />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        {[...Array(contentSections)].map((_, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-3">
                <SkeletonLoader className="h-5 w-5" />
                <div>
                  <SkeletonLoader className="h-5 w-32 mb-2" />
                  <SkeletonLoader className="h-4 w-24" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasFooter && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <SkeletonLoader className="h-4 w-32" />
            <SkeletonLoader className="h-8 w-24" />
          </div>
        </div>
      )}
    </div>
  );
}; 