/**
 * HealthTrackPro Icon Set & Icon Management
 * Uses Material Icons & custom SVG icons
 */

// Icon mapping for Material Design Icons
export const ICONS = {
  // Navigation Icons
  home: 'home',
  patients: 'people',
  records: 'description',
  profile: 'person',
  settings: 'settings',
  menu: 'menu',
  close: 'close',
  back: 'arrow_back',
  forward: 'arrow_forward',

  // Action Icons
  add: 'add',
  edit: 'edit',
  delete: 'delete',
  search: 'search',
  filter: 'filter_list',
  sort: 'sort',
  share: 'share',
  download: 'download',
  upload: 'upload',
  refresh: 'refresh',

  // Status Icons
  check: 'check_circle',
  checkmark: 'check',
  alert: 'warning',
  error: 'error',
  info: 'info',
  success: 'done',
  pending: 'schedule',

  // Health & Medical Icons
  health: 'favorite',
  heart: 'favorite',
  bloodPressure: 'favorite_border',
  heartRate: 'pulse',
  breathing: 'air',
  temperature: 'thermostat',
  medical: 'local_hospital',
  doctor: 'person_white_24dp',
  pill: 'medication',
  bandage: 'healing',

  // Patient Related Icons
  patientAdd: 'person_add',
  patientRemove: 'person_remove',
  prescription: 'receipt',
  allergy: 'warning',
  history: 'history',
  calendar: 'calendar_today',
  clock: 'access_time',

  // Authentication Icons
  login: 'login',
  logout: 'logout',
  password: 'lock',
  eye: 'visibility',
  eyeOff: 'visibility_off',

  // Communication Icons
  phone: 'phone',
  email: 'email',
  message: 'message',
  call: 'call',

  // Utility Icons
  loading: 'hourglass_empty',
  more: 'more_vert',
  moreHoriz: 'more_horiz',
  export: 'get_app',
  print: 'print',
  help: 'help',
  about: 'info',

  // Analytics Icons
  chart: 'bar_chart',
  analytics: 'analytics',
  trend: 'trending_up',
  dashboard: 'dashboard',
  report: 'assessment',

  // Subscription Icons
  payment: 'payment',
  card: 'credit_card',
  pricing: 'price_check',
  star: 'star',
  crown: 'grade',

  // Misc Icons
  notification: 'notifications',
  bell: 'notifications_active',
  location: 'location_on',
  link: 'link',
  copy: 'content_copy',
  trash: 'delete_outline',
};

// Icon size constants
export const ICON_SIZES = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
  xxl: 48,
};

// Icon colors
export const ICON_COLORS = {
  primary: '#1976D2',
  secondary: '#00BCD4',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  critical: '#D32F2F',
  disabled: '#BDBDBD',
  dark: '#212121',
  light: '#FFFFFF',
};

/**
 * Get icon name by category
 */
export const getIconForStatus = (status) => {
  const statusMap = {
    healthy: ICONS.success,
    warning: ICONS.alert,
    critical: ICONS.error,
    pending: ICONS.pending,
    active: ICONS.check,
    inactive: ICONS.error,
    completed: ICONS.checkmark,
    'in-progress': ICONS.loading,
  };
  return statusMap[status] || ICONS.info;
};

/**
 * Get color for status
 */
export const getColorForStatus = (status) => {
  const colorMap = {
    healthy: ICON_COLORS.success,
    warning: ICON_COLORS.warning,
    critical: ICON_COLORS.critical,
    error: ICON_COLORS.error,
    pending: ICON_COLORS.warning,
    success: ICON_COLORS.success,
    info: ICON_COLORS.primary,
  };
  return colorMap[status] || ICON_COLORS.primary;
};

/**
 * Get icon for vital sign
 */
export const getIconForVital = (vitalType) => {
  const vitalMap = {
    blood_pressure: ICONS.bloodPressure,
    heart_rate: ICONS.heartRate,
    temperature: ICONS.temperature,
    respiration: ICONS.breathing,
    oxygen: ICONS.breathing,
    pulse: ICONS.heartRate,
  };
  return vitalMap[vitalType] || ICONS.health;
};

/**
 * Get icon for section/navigation
 */
export const getIconForSection = (sectionName) => {
  const sectionMap = {
    home: ICONS.home,
    patients: ICONS.patients,
    records: ICONS.records,
    analytics: ICONS.analytics,
    profile: ICONS.profile,
    settings: ICONS.settings,
    subscriptions: ICONS.crown,
    support: ICONS.help,
  };
  return sectionMap[sectionName] || ICONS.info;
};

export default {
  ICONS,
  ICON_SIZES,
  ICON_COLORS,
  getIconForStatus,
  getColorForStatus,
  getIconForVital,
  getIconForSection,
};
