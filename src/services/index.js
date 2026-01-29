import apiService from './api';

/**
 * Authentication Service
 */
export const authService = {
  /**
   * Register a new user
   */
  register: async (name, email, password) => {
    return apiService.post('/auth/register', { name, email, password });
  },

  /**
   * Login user
   */
  login: async (email, password) => {
    const response = await apiService.post('/auth/login', { email, password });
    
    // Save tokens
    if (response.success && response.data) {
      await apiService.saveTokens(
        response.data.accessToken,
        response.data.refreshToken
      );
    }
    
    return response;
  },

  /**
   * Logout user
   */
  logout: async () => {
    const refreshToken = await apiService.getRefreshToken();
    
    try {
      await apiService.post('/auth/logout', { refreshToken });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await apiService.clearTokens();
    }
  },

  /**
   * Get user profile
   */
  getProfile: async () => {
    return apiService.get('/auth/profile');
  },

  /**
   * Update user profile
   */
  updateProfile: async (name) => {
    return apiService.put('/auth/profile', { name });
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: async () => {
    const token = await apiService.getToken();
    return !!token;
  },
};

/**
 * Patient Service
 */
export const patientService = {
  /**
   * Create a new patient
   */
  createPatient: async (patientData) => {
    return apiService.post('/patients', patientData);
  },

  /**
   * Get all patients with pagination
   */
  getPatients: async (params = {}) => {
    return apiService.get('/patients', params);
  },

  /**
   * Get a single patient by ID
   */
  getPatientById: async (id) => {
    return apiService.get(`/patients/${id}`);
  },

  /**
   * Update patient information
   */
  updatePatient: async (id, patientData) => {
    return apiService.put(`/patients/${id}`, patientData);
  },

  /**
   * Delete patient
   */
  deletePatient: async (id) => {
    return apiService.delete(`/patients/${id}`);
  },

  /**
   * Get critical patients
   */
  getCriticalPatients: async () => {
    return apiService.get('/patients/critical');
  },

  /**
   * Get patient statistics
   */
  getStatistics: async () => {
    return apiService.get('/patients/statistics');
  },
};

/**
 * Patient Record Service
 */
export const recordService = {
  /**
   * Create patient record(s)
   */
  createRecord: async (recordData) => {
    return apiService.post('/records', recordData);
  },

  /**
   * Get all records with filtering
   */
  getRecords: async (params = {}) => {
    return apiService.get('/records', params);
  },

  /**
   * Get records by patient ID
   */
  getRecordsByPatientId: async (patientId) => {
    return apiService.get(`/records/patient/${patientId}`);
  },

  /**
   * Get a single record by ID
   */
  getRecordById: async (id) => {
    return apiService.get(`/records/${id}`);
  },

  /**
   * Update a patient record
   */
  updateRecord: async (id, recordData) => {
    return apiService.put(`/records/${id}`, recordData);
  },

  /**
   * Delete a patient record
   */
  deleteRecord: async (id) => {
    return apiService.delete(`/records/${id}`);
  },

  /**
   * Get critical records
   */
  getCriticalRecords: async () => {
    return apiService.get('/records/critical');
  },

  /**
   * Get record statistics for a patient
   */
  getRecordStatistics: async (patientId) => {
    return apiService.get(`/records/patient/${patientId}/statistics`);
  },
};
