/**
 * Icon Mapper Utility
 *
 * Centralizes Lucide React icon imports and provides a type-safe mapping
 * from icon names (strings) to icon components. Includes fallback handling
 * for missing icons.
 *
 * @module iconMapper
 */

import {
  Wallet,
  Briefcase,
  TrendingUp,
  PiggyBank,
  Home,
  Car,
  ShoppingCart,
  Film,
  Lightbulb,
  Heart,
  ShoppingBag,
  MoreHorizontal,
  Circle,
  type LucideIcon,
} from 'lucide-react';

/**
 * Map of icon names to Lucide React icon components
 * Used to convert string icon names from category data to renderable components
 */
const ICON_MAP: Record<string, LucideIcon> = {
  Wallet,
  Briefcase,
  TrendingUp,
  PiggyBank,
  Home,
  Car,
  ShoppingCart,
  Film,
  Lightbulb,
  Heart,
  ShoppingBag,
  MoreHorizontal,
};

/**
 * Retrieves a Lucide React icon component by name
 *
 * @param iconName - Name of the Lucide icon (e.g., "Wallet", "ShoppingCart")
 * @returns The corresponding Lucide icon component, or Circle as fallback
 *
 * @example
 * const IconComponent = getIconComponent('Wallet');
 * return <IconComponent size={20} />;
 *
 * @example
 * // Invalid icon name returns Circle fallback
 * const IconComponent = getIconComponent('InvalidIcon');
 * // Console warning: Icon "InvalidIcon" not found in ICON_MAP. Using Circle fallback.
 */
export const getIconComponent = (iconName: string): LucideIcon => {
  const IconComponent = ICON_MAP[iconName];

  if (!IconComponent) {
    console.warn(
      `Icon "${iconName}" not found in ICON_MAP. Using Circle fallback.`
    );
    return Circle;
  }

  return IconComponent;
};
