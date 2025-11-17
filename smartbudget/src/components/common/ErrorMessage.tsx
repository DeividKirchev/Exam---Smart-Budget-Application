import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  type = 'error',
  onRetry,
  onDismiss,
  className = '',
}) => {
  const bgColor = {
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  }[type];

  const textColor = {
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
  }[type];

  const iconColor = {
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
  }[type];

  return (
    <div
      className={`flex items-start p-4 border rounded-md ${bgColor} ${className}`}
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className={`flex-shrink-0 mr-3 ${iconColor}`} size={20} />
      <div className="flex-1">
        <p className={`text-sm font-medium ${textColor}`}>{message}</p>
      </div>
      {(onRetry || onDismiss) && (
        <div className="ml-3 flex gap-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className={`text-sm font-medium ${textColor} hover:underline focus:outline-none focus:ring-2 focus:ring-offset-1`}
              aria-label="Retry action"
            >
              Retry
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className={`text-sm font-medium ${textColor} hover:underline focus:outline-none focus:ring-2 focus:ring-offset-1`}
              aria-label="Dismiss message"
            >
              Dismiss
            </button>
          )}
        </div>
      )}
    </div>
  );
};
