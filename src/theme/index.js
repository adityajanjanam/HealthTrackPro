/**
 * Theme System Index
 * Central export point for all theme, styling, and icon utilities
 */

// Color, typography, spacing, and component configurations
export {
  COLORS,
  FONTS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  TYPOGRAPHY,
  COMPONENTS,
  ANIMATIONS,
  getColorByStatus,
  getColorForHealthStatus,
} from './theme';

// Global component styles
export { default as globalStyles } from './globalStyles';

// Icon system
export {
  ICONS,
  ICON_SIZES,
  ICON_COLORS,
  getIconForStatus,
  getColorForStatus,
  getIconForVital,
  getIconForSection,
} from './icons';

// Styling utilities and helper functions
export {
  isIOS,
  isAndroid,
  createShadow,
  createGradient,
  flexStyles,
  createResponsivePadding,
  createResponsiveMargin,
  createInputStyle,
  createButtonStyle,
  createCardStyle,
  createBadgeStyle,
  createTextStyle,
  containerSpacing,
  borderRadius,
  opacity,
  zIndex,
} from './utilities';
