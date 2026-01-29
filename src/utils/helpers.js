/**
 * Compiled regex patterns for validation (computed once at module load)
 * This prevents regex recompilation on every function call
 */
const REGEX_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\d{10}$/,
  bloodPressure: /^\d+\/\d+$/,
};

/**
 * Validation utilities
 */

export const validateEmail = (email) => {
  return REGEX_PATTERNS.email.test(email);
};

export const validatePhone = (phone) => {
  return REGEX_PATTERNS.phone.test(phone);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateBloodPressure = (bp) => {
  return REGEX_PATTERNS.bloodPressure.test(bp);
};

export const validateNumeric = (value) => {
  return !Number.isNaN(Number.parseFloat(value)) && Number.isFinite(value);
};

/**
 * Format utilities
 */

// Cache for locale formatter options
const DATE_OPTIONS = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

const DATETIME_OPTIONS = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
};

export const formatDate = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', DATE_OPTIONS);
};

export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleString('en-US', DATETIME_OPTIONS);
};

export const formatAge = (dob) => {
  if (!dob) return 'N/A';
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return `${age} years`;
};

export const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Critical condition utilities
 */

// Helper functions to reduce cognitive complexity
const checkBloodPressure = (bp, reasons) => {
  let isCritical = false;
  if (bp) {
    const [systolic, diastolic] = bp.split('/').map(Number);
    if (!Number.isNaN(systolic) && !Number.isNaN(diastolic)) {
      if (systolic >= 180 || diastolic >= 120) {
        isCritical = true;
        reasons.push('Hypertensive crisis');
      } else if (systolic < 90 || diastolic < 60) {
        isCritical = true;
        reasons.push('Hypotension');
      }
    }
  }
  return isCritical;
};

const checkHeartRate = (hr, reasons) => {
  let isCritical = false;
  if (hr) {
    const heartRate = Number.parseFloat(hr);
    if (heartRate <= 50) {
      isCritical = true;
      reasons.push('Bradycardia');
    } else if (heartRate >= 120) {
      isCritical = true;
      reasons.push('Tachycardia');
    }
  }
  return isCritical;
};

const checkOxygenLevel = (o2, reasons) => {
  let isCritical = false;
  if (o2) {
    const oxygenLevel = Number.parseFloat(o2);
    if (oxygenLevel < 90) {
      isCritical = true;
      reasons.push('Low oxygen saturation');
    }
  }
  return isCritical;
};

const checkRespiratoryRate = (rr, reasons) => {
  let isCritical = false;
  if (rr) {
    const respiratoryRate = Number.parseFloat(rr);
    if (respiratoryRate <= 10) {
      isCritical = true;
      reasons.push('Bradypnea');
    } else if (respiratoryRate >= 30) {
      isCritical = true;
      reasons.push('Tachypnea');
    }
  }
  return isCritical;
};

export const checkCriticalVitals = (vitals) => {
  const reasons = [];
  const isCritical = checkBloodPressure(vitals.bloodPressure, reasons)
    || checkHeartRate(vitals.heartRate, reasons)
    || checkOxygenLevel(vitals.oxygenLevel, reasons)
    || checkRespiratoryRate(vitals.respiratoryRate, reasons);
  return { isCritical, reasons };
};

/**
 * Error handling utilities
 */

export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error.message) return error.message;
  if (error.errors && Array.isArray(error.errors)) {
    return error.errors.map(e => e.message).join(', ');
  }
  return 'An unexpected error occurred';
};

/**
 * Data transformation utilities
 */

export const normalizeTestType = (type) => {
  const mapping = {
    bloodPressure: 'BloodPressure',
    heartRate: 'HeartRate',
    oxygenLevel: 'OxygenLevel',
    respiratoryRate: 'RespiratoryRate',
  };
  return mapping[type] || type;
};

export const denormalizeTestType = (type) => {
  const mapping = {
    BloodPressure: 'bloodPressure',
    HeartRate: 'heartRate',
    OxygenLevel: 'oxygenLevel',
    RespiratoryRate: 'respiratoryRate',
  };
  return mapping[type] || type;
};

/**
 * Storage utilities
 */

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
