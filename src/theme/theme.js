/**
 * HealthTrackPro Theme & Color Configuration
 * Modern Healthcare-focused Design System
 */

export const COLORS = {
  // Primary Colors - Blue Tones (Healthcare/Trust)
  primary: '#1976D2', // Deep Blue
  primaryLight: '#42A5F5', // Light Blue
  primaryDark: '#1565C0', // Dark Blue
  primaryBg: '#E3F2FD', // Faint Blue Background

  // Secondary Colors - Teal (Health/Growth)
  secondary: '#00BCD4', // Teal
  secondaryLight: '#4DD0E1', // Light Teal
  secondaryDark: '#0097A7', // Dark Teal
  secondaryBg: '#E0F2F1', // Faint Teal Background

  // Status Colors
  success: '#4CAF50', // Green
  warning: '#FF9800', // Orange
  error: '#F44336', // Red
  critical: '#D32F2F', // Dark Red
  info: '#2196F3', // Blue Info

  // Background Colors
  background: '#FFFFFF', // White
  surface: '#F5F5F5', // Light Gray
  surfaceLight: '#FAFAFA', // Lighter Gray
  surfaceDark: '#EEEEEE', // Slightly Darker Gray

  // Text Colors
  text: {
    primary: '#212121', // Dark Gray/Black
    secondary: '#757575', // Medium Gray
    disabled: '#BDBDBD', // Light Gray
    inverse: '#FFFFFF', // White
    hint: '#9E9E9E', // Hint Gray
  },

  // Border & Divider
  border: '#E0E0E0', // Light Gray Border
  divider: '#EEEEEE', // Divider Gray

  // Shadow
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.3)',

  // Gradient Base
  gradientStart: '#1976D2',
  gradientEnd: '#00BCD4',
};

export const FONTS = {
  // Font Family
  primary: 'System', // Use system font for performance
  secondary: 'System',

  // Font Sizes
  h1: 32, // Large Headings
  h2: 28, // Section Headings
  h3: 24, // Subsection Headings
  h4: 20, // Title
  h5: 18, // Subtitle
  h6: 16, // Section Title
  body: 14, // Body Text
  bodySmall: 12, // Small Body Text
  label: 12, // Labels
  caption: 10, // Caption

  // Font Weights
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const SPACING = {
  // Spacing Units (4pt base)
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  md: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5.46,
    elevation: 4,
  },
  lg: {
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 8.65,
    elevation: 6,
  },
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: FONTS.h1,
    fontWeight: FONTS.bold,
    lineHeight: 40,
    color: COLORS.text.primary,
  },
  h2: {
    fontSize: FONTS.h2,
    fontWeight: FONTS.bold,
    lineHeight: 36,
    color: COLORS.text.primary,
  },
  h3: {
    fontSize: FONTS.h3,
    fontWeight: FONTS.semibold,
    lineHeight: 32,
    color: COLORS.text.primary,
  },
  h4: {
    fontSize: FONTS.h4,
    fontWeight: FONTS.semibold,
    lineHeight: 28,
    color: COLORS.text.primary,
  },
  body: {
    fontSize: FONTS.body,
    fontWeight: FONTS.regular,
    lineHeight: 20,
    color: COLORS.text.primary,
  },
  bodySmall: {
    fontSize: FONTS.bodySmall,
    fontWeight: FONTS.regular,
    lineHeight: 16,
    color: COLORS.text.secondary,
  },
  label: {
    fontSize: FONTS.label,
    fontWeight: FONTS.semibold,
    lineHeight: 16,
    color: COLORS.text.primary,
  },
  caption: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.regular,
    lineHeight: 12,
    color: COLORS.text.hint,
  },
};

export const COMPONENTS = {
  button: {
    padding: {
      small: { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md },
      medium: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg },
      large: { paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xl },
    },
    borderRadius: BORDER_RADIUS.md,
    height: {
      small: 32,
      medium: 40,
      large: 48,
    },
  },
  input: {
    padding: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg },
    borderRadius: BORDER_RADIUS.md,
    height: 48,
    fontSize: FONTS.body,
  },
  card: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.md,
  },
  sheet: {
    borderRadius: { borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl },
    ...SHADOWS.lg,
  },
};

export const ANIMATIONS = {
  duration: {
    short: 200,
    normal: 300,
    long: 500,
  },
  timing: 'ease-in-out',
};

export default {
  COLORS,
  FONTS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  TYPOGRAPHY,
  COMPONENTS,
  ANIMATIONS,
};
