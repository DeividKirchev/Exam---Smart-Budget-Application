import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 24,
    md: 40,
    lg: 64,
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2
        size={sizeClasses[size]}
        className="animate-spin text-blue-600 mb-2"
        aria-hidden="true"
      />
      {message && <p className="text-sm text-gray-600">{message}</p>}
      <span className="sr-only">{message}</span>
    </div>
  );
};
