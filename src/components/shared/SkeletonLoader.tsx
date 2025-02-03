import React from 'react';
import clsx from 'clsx';

interface SkeletonLoaderProps {
  className?: string;
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  className,
  count = 1
}) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className={clsx(
            'animate-pulse bg-gray-200 rounded',
            className
          )}
        />
      ))}
    </>
  );
}; 