/**
 * Styling Utilities & Helper Functions
 * Centralized styling utilities for consistent UI/UX
 */

import { Platform } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONTS } from './theme';

/**
 * Platform-specific utility
 */
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

/**
 * Create consistent shadow styles
 */
export const createShadow = (elevation = 2) => {
  if (isIOS) {
    return {
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: elevation },
      shadowOpacity: 0.2,
      shadowRadius: elevation * 2,
    };
  } else {
    return {
      elevation,
    };
  }
};

/**
 * Create gradient background (compatible with linear gradient)
 */
export const createGradient = (startColor, endColor) => ({
  background: `linear-gradient(135deg, ${startColor} 0%, ${endColor} 100%)`,
});

/**
 * Flexbox utilities
 */
export const flexStyles = {
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  columnCenter: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnSpaceAround: {
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
};

/**
 * Responsive padding helper
 */
export const createResponsivePadding = (horizontal, vertical) => ({
  paddingHorizontal: horizontal || SPACING.md,
  paddingVertical: vertical || SPACING.md,
});

/**
 * Responsive margin helper
 */
export const createResponsiveMargin = (horizontal, vertical) => ({
  marginHorizontal: horizontal || 0,
  marginVertical: vertical || 0,
});

/**
 * Text input styling helper
 */
export const createInputStyle = (isFocused = false, isError = false) => {
  let backgroundColor, borderColor, borderWidth;

  if (isError) {
    backgroundColor = COLORS.errorLight;
    borderColor = COLORS.error;
    borderWidth = 2;
  } else if (isFocused) {
    backgroundColor = COLORS.inputFocus;
    borderColor = COLORS.primary;
    borderWidth = 2;
  } else {
    backgroundColor = COLORS.inputBackground;
    borderColor = COLORS.border;
    borderWidth = 1;
  }

  return {
    backgroundColor,
    borderColor,
    borderWidth,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONTS.body,
    color: COLORS.text,
  };
};

/**
 * Button styling helper with variants
 */
export const createButtonStyle = (variant = 'primary', disabled = false) => {
  const baseStyle = {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...createShadow(2),
  };

  const variants = {
    primary: {
      ...baseStyle,
      backgroundColor: disabled ? COLORS.disabled : COLORS.primary,
    },
    secondary: {
      ...baseStyle,
      backgroundColor: disabled ? COLORS.disabled : COLORS.secondary,
    },
    outline: {
      ...baseStyle,
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: disabled ? COLORS.disabled : COLORS.primary,
    },
    danger: {
      ...baseStyle,
      backgroundColor: disabled ? COLORS.disabled : COLORS.error,
    },
    success: {
      ...baseStyle,
      backgroundColor: disabled ? COLORS.disabled : COLORS.success,
    },
    ghost: {
      ...baseStyle,
      backgroundColor: 'transparent',
    },
  };

  return variants[variant] || variants.primary;
};

/**
 * Card styling helper
 */
export const createCardStyle = (variant = 'default') => {
  const baseStyle = {
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.white,
    ...createShadow(1),
  };

  const variants = {
    default: {
      ...baseStyle,
      backgroundColor: COLORS.white,
      borderColor: COLORS.border,
      borderWidth: 1,
    },
    elevated: {
      ...baseStyle,
      backgroundColor: COLORS.surface,
      ...createShadow(3),
    },
    filled: {
      ...baseStyle,
      backgroundColor: COLORS.surfaceLight,
    },
    outlined: {
      ...baseStyle,
      backgroundColor: 'transparent',
      borderColor: COLORS.primary,
      borderWidth: 1,
    },
    success: {
      ...baseStyle,
      backgroundColor: COLORS.successLight,
      borderColor: COLORS.success,
      borderWidth: 1,
    },
    warning: {
      ...baseStyle,
      backgroundColor: COLORS.warningLight,
      borderColor: COLORS.warning,
      borderWidth: 1,
    },
    error: {
      ...baseStyle,
      backgroundColor: COLORS.errorLight,
      borderColor: COLORS.error,
      borderWidth: 1,
    },
  };

  return variants[variant] || variants.default;
};

/**
 * Badge styling helper
 */
export const createBadgeStyle = (variant = 'primary') => {
  const baseStyle = {
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    alignItems: 'center',
    justifyContent: 'center',
  };

  const variants = {
    primary: {
      ...baseStyle,
      backgroundColor: COLORS.primary,
    },
    secondary: {
      ...baseStyle,
      backgroundColor: COLORS.secondary,
    },
    success: {
      ...baseStyle,
      backgroundColor: COLORS.success,
    },
    warning: {
      ...baseStyle,
      backgroundColor: COLORS.warning,
    },
    error: {
      ...baseStyle,
      backgroundColor: COLORS.error,
    },
    critical: {
      ...baseStyle,
      backgroundColor: COLORS.critical,
    },
    info: {
      ...baseStyle,
      backgroundColor: COLORS.info,
    },
    outline: {
      ...baseStyle,
      backgroundColor: 'transparent',
      borderColor: COLORS.primary,
      borderWidth: 1,
    },
  };

  return variants[variant] || variants.primary;
};

/**
 * Text styling helper
 */
export const createTextStyle = (type = 'body', color = COLORS.text) => {
  const textStyles = {
    h1: {
      fontSize: FONTS.h1,
      fontWeight: '700',
      lineHeight: FONTS.h1 * 1.2,
      color,
    },
    h2: {
      fontSize: FONTS.h2,
      fontWeight: '700',
      lineHeight: FONTS.h2 * 1.2,
      color,
    },
    h3: {
      fontSize: FONTS.h3,
      fontWeight: '600',
      lineHeight: FONTS.h3 * 1.2,
      color,
    },
    h4: {
      fontSize: FONTS.h4,
      fontWeight: '600',
      lineHeight: FONTS.h4 * 1.2,
      color,
    },
    h5: {
      fontSize: FONTS.h5,
      fontWeight: '600',
      lineHeight: FONTS.h5 * 1.3,
      color,
    },
    h6: {
      fontSize: FONTS.h6,
      fontWeight: '500',
      lineHeight: FONTS.h6 * 1.3,
      color,
    },
    body: {
      fontSize: FONTS.body,
      fontWeight: '400',
      lineHeight: FONTS.body * 1.5,
      color,
    },
    bodySmall: {
      fontSize: FONTS.bodySmall,
      fontWeight: '400',
      lineHeight: FONTS.bodySmall * 1.5,
      color,
    },
    label: {
      fontSize: FONTS.label,
      fontWeight: '600',
      lineHeight: FONTS.label * 1.4,
      color,
    },
    caption: {
      fontSize: FONTS.caption,
      fontWeight: '400',
      lineHeight: FONTS.caption * 1.4,
      color,
    },
  };

  return textStyles[type] || textStyles.body;
};

/**
 * Container spacing helper
 */
export const containerSpacing = {
  xs: SPACING.xs,
  sm: SPACING.sm,
  md: SPACING.md,
  lg: SPACING.lg,
  xl: SPACING.xl,
  xxl: SPACING.xxl,
};

/**
 * Border radius helper
 */
export const borderRadius = {
  sm: BORDER_RADIUS.sm,
  md: BORDER_RADIUS.md,
  lg: BORDER_RADIUS.lg,
  xl: BORDER_RADIUS.xl,
  full: BORDER_RADIUS.full,
};

/**
 * Opacity utilities
 */
export const opacity = {
  disabled: 0.5,
  hover: 0.8,
  focus: 0.9,
  full: 1,
};

/**
 * Z-index utilities
 */
export const zIndex = {
  hidden: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  modal: 100,
  tooltip: 110,
  notification: 120,
};

export default {
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
};
