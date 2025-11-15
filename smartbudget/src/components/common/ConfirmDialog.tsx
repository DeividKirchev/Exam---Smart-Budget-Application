/**
 * ConfirmDialog Component
 *
 * Reusable modal dialog for confirmation actions. Supports different variants
 * (danger, warning, info) with appropriate styling. Includes accessibility
 * features: ARIA attributes, keyboard navigation, and focus management.
 *
 * @module components/common/ConfirmDialog
 */

import React, { useEffect, useRef } from 'react';

/**
 * ConfirmDialog component props interface
 */
export interface ConfirmDialogProps {
  /** Controls dialog visibility */
  isOpen: boolean;

  /** Dialog title text */
  title: string;

  /** Dialog message/description text */
  message: string;

  /** Label for confirm button (default: "Confirm") */
  confirmLabel?: string;

  /** Label for cancel button (default: "Cancel") */
  cancelLabel?: string;

  /** Callback when user confirms */
  onConfirm: () => void;

  /** Callback when user cancels or closes dialog */
  onCancel: () => void;

  /** Visual variant for styling (default: "info") */
  variant?: 'danger' | 'warning' | 'info';
}

/**
 * ConfirmDialog Component
 *
 * A reusable modal dialog for user confirmations with accessibility support.
 * Blocks background interaction when open, supports keyboard navigation,
 * and manages focus appropriately.
 *
 * @example
 * ```tsx
 * <ConfirmDialog
 *   isOpen={showDialog}
 *   title="Delete Transaction"
 *   message="Are you sure? This action cannot be undone."
 *   confirmLabel="Delete"
 *   cancelLabel="Cancel"
 *   variant="danger"
 *   onConfirm={handleConfirm}
 *   onCancel={handleCancel}
 * />
 * ```
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'info',
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  /**
   * Handle Escape key press to close dialog
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  /**
   * Prevent body scroll when dialog is open
   */
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  /**
   * Focus first button when dialog opens
   */
  useEffect(() => {
    if (isOpen && cancelButtonRef.current) {
      cancelButtonRef.current.focus();
    }
  }, [isOpen]);

  // Don't render if not open
  if (!isOpen) return null;

  /**
   * Get button styling based on variant
   */
  const getConfirmButtonClass = (): string => {
    const baseClass =
      'px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

    switch (variant) {
      case 'danger':
        return `${baseClass} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`;
      case 'warning':
        return `${baseClass} bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500`;
      case 'info':
      default:
        return `${baseClass} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 transition-all duration-300 ease-out transform"
      >
        {/* Title */}
        <h2
          id="dialog-title"
          className="text-xl font-semibold text-gray-900 mb-3"
        >
          {title}
        </h2>

        {/* Message */}
        <p id="dialog-description" className="text-gray-600 mb-6">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={getConfirmButtonClass()}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
