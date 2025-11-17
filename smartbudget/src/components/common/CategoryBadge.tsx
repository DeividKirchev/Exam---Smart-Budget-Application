/**
 * CategoryBadge Component
 *
 * Displays a category with icon and color in a consistent badge format.
 * Used across the application for visual category identification in lists,
 * forms, charts, and dashboards.
 *
 * @module CategoryBadge
 */

import React from 'react';
import { getCategoryById } from '../../constants/categories';
import { getIconComponent } from '../../utils/iconMapper';

export interface CategoryBadgeProps {
  /** Category ID to display (e.g., "salary", "food") */
  categoryId: string;
  /** Visual variant controlling size and spacing */
  variant?: 'default' | 'compact' | 'large';
  /** Whether to show the category icon */
  showIcon?: boolean;
  /** Whether to show the category name */
  showName?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * CategoryBadge component for consistent category display
 *
 * Features:
 * - Automatic category lookup from constants
 * - Dynamic icon rendering from Lucide React
 * - Configurable sizing with variant prop
 * - Accessible with ARIA labels
 * - Color-coded backgrounds matching category definitions
 *
 * @example
 * // Default usage - shows icon and name
 * <CategoryBadge categoryId="food" />
 *
 * @example
 * // Compact variant for lists
 * <CategoryBadge categoryId="salary" variant="compact" />
 *
 * @example
 * // Icon only for chart legends
 * <CategoryBadge categoryId="rent" showName={false} />
 *
 * @example
 * // Large variant for dashboard highlights
 * <CategoryBadge categoryId="entertainment" variant="large" />
 */
export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  categoryId,
  variant = 'default',
  showIcon = true,
  showName = true,
  className = '',
}) => {
  // Look up category from constants
  const category = getCategoryById(categoryId);

  if (!category) {
    console.error(`Category "${categoryId}" not found in CATEGORIES constant`);
    return null;
  }

  // Get the icon component for this category
  const IconComponent = getIconComponent(category.icon);

  // Variant-specific sizing classes
  const sizeClasses = {
    compact: 'text-xs px-2 py-1 gap-1',
    default: 'text-sm px-3 py-1.5 gap-2',
    large: 'text-base px-4 py-2 gap-2',
  };

  // Icon sizes for each variant
  const iconSizes = {
    compact: 14,
    default: 16,
    large: 20,
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses[variant]} ${className}`}
      style={{
        backgroundColor: category.color,
        color: '#FFFFFF',
      }}
      role="img"
      aria-label={`${category.name} category`}
    >
      {showIcon && <IconComponent size={iconSizes[variant]} />}
      {showName && <span>{category.name}</span>}
    </span>
  );
};

export default CategoryBadge;
