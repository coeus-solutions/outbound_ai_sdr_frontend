import React from 'react';
import { SkeletonLoader } from './SkeletonLoader';

interface TableSkeletonLoaderProps {
  rowCount?: number;
  columnCount?: number;
  hasHeader?: boolean;
}

export const TableSkeletonLoader: React.FC<TableSkeletonLoaderProps> = ({
  rowCount = 5,
  columnCount = 4,
  hasHeader = true
}) => {
  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      {hasHeader && (
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <SkeletonLoader className="h-8 w-48" />
        </div>
      )}
      <div className="divide-y divide-gray-200">
        {[...Array(rowCount)].map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(columnCount)].map((_, colIndex) => (
                <div key={colIndex}>
                  <SkeletonLoader className="h-4 w-full" />
                  {colIndex === 0 && (
                    <SkeletonLoader className="h-3 w-2/3 mt-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 