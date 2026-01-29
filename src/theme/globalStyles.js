/**
 * Styled Components & Reusable Component Styles
 * HealthTrackPro Design System
 */

import { StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY, FONTS } from './theme';

export const globalStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  containerPadded: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  containerSurface: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },

  // Header Styles
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text.inverse,
    marginBottom: SPACING.sm,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.bodySmall,
    color: 'rgba(255, 255, 255, 0.9)',
  },

  // Card Styles
  card: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  cardCompact: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  cardPrimary: {
    backgroundColor: COLORS.primaryBg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    marginBottom: SPACING.lg,
  },
  cardSuccess: {
    backgroundColor: '#E8F5E9',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
    marginBottom: SPACING.lg,
  },
  cardWarning: {
    backgroundColor: '#FFF3E0',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
    marginBottom: SPACING.lg,
  },
  cardError: {
    backgroundColor: '#FFEBEE',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
    marginBottom: SPACING.lg,
  },
  cardCritical: {
    backgroundColor: '#FFCDD2',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.critical,
    marginBottom: SPACING.lg,
  },

  // Text Styles
  title: TYPOGRAPHY.h2,
  subtitle: TYPOGRAPHY.h4,
  bodyText: TYPOGRAPHY.body,
  bodyTextSmall: TYPOGRAPHY.bodySmall,
  label: TYPOGRAPHY.label,
  caption: TYPOGRAPHY.caption,

  // Button Styles
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    ...SHADOWS.sm,
  },
  buttonPrimaryText: {
    color: COLORS.text.inverse,
    fontSize: FONTS.body,
    fontWeight: FONTS.semibold,
  },
  buttonSecondary: {
    backgroundColor: COLORS.secondary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    ...SHADOWS.sm,
  },
  buttonSecondaryText: {
    color: COLORS.text.inverse,
    fontSize: FONTS.body,
    fontWeight: FONTS.semibold,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonOutlineText: {
    color: COLORS.primary,
    fontSize: FONTS.body,
    fontWeight: FONTS.semibold,
  },
  buttonDisabled: {
    backgroundColor: COLORS.text.disabled,
    opacity: 0.6,
  },
  buttonDanger: {
    backgroundColor: COLORS.error,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    ...SHADOWS.sm,
  },
  buttonDangerText: {
    color: COLORS.text.inverse,
    fontSize: FONTS.body,
    fontWeight: FONTS.semibold,
  },

  // Input Styles
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    fontSize: FONTS.body,
    color: COLORS.text.primary,
    minHeight: 48,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.background,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  inputLabel: {
    ...TYPOGRAPHY.label,
    marginBottom: SPACING.sm,
  },
  inputHelperText: {
    ...TYPOGRAPHY.caption,
    marginTop: SPACING.xs,
    color: COLORS.text.hint,
  },
  inputErrorText: {
    ...TYPOGRAPHY.caption,
    marginTop: SPACING.xs,
    color: COLORS.error,
  },

  // Row & Flex Styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
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
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Divider Styles
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.lg,
  },
  dividerSmall: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.md,
  },

  // Badge Styles
  badge: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePrimary: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primaryBg,
  },
  badgePrimaryText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: FONTS.semibold,
  },
  badgeSuccess: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: '#E8F5E9',
  },
  badgeSuccessText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.success,
    fontWeight: FONTS.semibold,
  },
  badgeWarning: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: '#FFF3E0',
  },
  badgeWarningText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.warning,
    fontWeight: FONTS.semibold,
  },
  badgeError: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: '#FFEBEE',
  },
  badgeErrorText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    fontWeight: FONTS.semibold,
  },
  badgeCritical: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: '#FFCDD2',
  },
  badgeCriticalText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.critical,
    fontWeight: FONTS.semibold,
  },

  // List Item Styles
  listItem: {
    flexDirection: 'row',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    alignItems: 'center',
  },
  listItemLarge: {
    flexDirection: 'row',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    alignItems: 'center',
  },
  listItemIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    ...TYPOGRAPHY.label,
    marginBottom: SPACING.xs,
  },
  listItemSubtitle: {
    ...TYPOGRAPHY.bodySmall,
  },

  // Modal/Bottom Sheet Styles
  bottomSheetHeader: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  bottomSheetTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    ...SHADOWS.lg,
  },

  // Empty State Styles
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  emptyStateTitle: {
    ...TYPOGRAPHY.h4,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  emptyStateText: {
    ...TYPOGRAPHY.bodySmall,
    textAlign: 'center',
    color: COLORS.text.secondary,
    marginBottom: SPACING.xl,
  },

  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingSpinner: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Status Indicator
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.md,
  },
  statusOnline: {
    backgroundColor: COLORS.success,
  },
  statusOffline: {
    backgroundColor: COLORS.text.disabled,
  },
  statusWarning: {
    backgroundColor: COLORS.warning,
  },
  statusCritical: {
    backgroundColor: COLORS.critical,
  },
});

export default globalStyles;
