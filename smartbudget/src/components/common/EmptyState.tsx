import React from 'react';
import { FileX } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <FileX size={48} />,
  title,
  message,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 md:p-12 text-center ${className}`}
    >
      <div className="mb-4 text-gray-400">{icon}</div>
      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-sm md:text-base text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={action.label}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
