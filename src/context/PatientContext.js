import React, { createContext, useState, useContext, useCallback } from 'react';
import { patientService } from '../services';

const PatientContext = createContext();

export const usePatients = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatients must be used within a PatientProvider');
  }
  return context;
};

export const PatientProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [statistics, setStatistics] = useState({
    totalPatients: 0,
    criticalPatients: 0,
    activePatients: 0,
    stablePatients: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all patients
  const fetchPatients = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await patientService.getPatients(params);
      if (response.success) {
        setPatients(response.data.patients);
        return { success: true, data: response.data };
      }
      return { success: false, message: response.message };
    } catch (error) {
      setError(error.message || 'Failed to fetch patients');
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch statistics
  const fetchStatistics = useCallback(async () => {
    try {
      const response = await patientService.getStatistics();
      if (response.success) {
        setStatistics(response.data);
        return { success: true, data: response.data };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      return { success: false, message: error.message };
    }
  }, []);

  // Fetch a single patient
  const fetchPatient = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await patientService.getPatientById(id);
      if (response.success) {
        setSelectedPatient(response.data.patient);
        return { success: true, data: response.data.patient };
      }
      return { success: false, message: response.message };
    } catch (error) {
      setError(error.message || 'Failed to fetch patient');
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create patient
  const createPatient = useCallback(async (patientData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await patientService.createPatient(patientData);
      if (response.success) {
        // Refresh patient list
        await fetchPatients();
        await fetchStatistics();
        return { success: true, data: response.data.patient };
      }
      return { success: false, message: response.message };
    } catch (error) {
      setError(error.message || 'Failed to create patient');
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [fetchPatients, fetchStatistics]);

  // Update patient
  const updatePatient = useCallback(async (id, patientData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await patientService.updatePatient(id, patientData);
      if (response.success) {
        // Update local state
        setPatients((prev) =>
          prev.map((p) => (p._id === id ? response.data.patient : p))
        );
        if (selectedPatient?._id === id) {
          setSelectedPatient(response.data.patient);
        }
        return { success: true, data: response.data.patient };
      }
      return { success: false, message: response.message };
    } catch (error) {
      setError(error.message || 'Failed to update patient');
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [selectedPatient]);

  // Delete patient
  const deletePatient = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await patientService.deletePatient(id);
      if (response.success) {
        // Remove from local state
        setPatients((prev) => prev.filter((p) => p._id !== id));
        if (selectedPatient?._id === id) {
          setSelectedPatient(null);
        }
        await fetchStatistics();
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      setError(error.message || 'Failed to delete patient');
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [selectedPatient, fetchStatistics]);

  // Get critical patients
  const fetchCriticalPatients = useCallback(async () => {
    try {
      const response = await patientService.getCriticalPatients();
      if (response.success) {
        return { success: true, data: response.data.patients };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }, []);

  const value = {
    patients,
    selectedPatient,
    statistics,
    isLoading,
    error,
    fetchPatients,
    fetchPatient,
    fetchStatistics,
    createPatient,
    updatePatient,
    deletePatient,
    fetchCriticalPatients,
    setSelectedPatient,
  };

  return <PatientContext.Provider value={value}>{children}</PatientContext.Provider>;
};

export default PatientContext;
