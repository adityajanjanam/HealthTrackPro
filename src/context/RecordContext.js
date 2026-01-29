import React, { createContext, useState, useContext, useCallback } from 'react';
import { recordService } from '../services';

const RecordContext = createContext();

export const useRecords = () => {
  const context = useContext(RecordContext);
  if (!context) {
    throw new Error('useRecords must be used within a RecordProvider');
  }
  return context;
};

export const RecordProvider = ({ children }) => {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all records
  const fetchRecords = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await recordService.getRecords(params);
      if (response.success) {
        setRecords(response.data.records);
        return { success: true, data: response.data };
      }
      return { success: false, message: response.message };
    } catch (error) {
      setError(error.message || 'Failed to fetch records');
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch records by patient ID
  const fetchRecordsByPatientId = useCallback(async (patientId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await recordService.getRecordsByPatientId(patientId);
      if (response.success) {
        setRecords(response.data.records);
        return { success: true, data: response.data.records };
      }
      return { success: false, message: response.message };
    } catch (error) {
      setError(error.message || 'Failed to fetch records');
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch a single record
  const fetchRecord = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await recordService.getRecordById(id);
      if (response.success) {
        setSelectedRecord(response.data.record);
        return { success: true, data: response.data.record };
      }
      return { success: false, message: response.message };
    } catch (error) {
      setError(error.message || 'Failed to fetch record');
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create record
  const createRecord = useCallback(async (recordData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await recordService.createRecord(recordData);
      if (response.success) {
        // Add new records to local state
        setRecords((prev) => [...response.data.records, ...prev]);
        return { success: true, data: response.data.records };
      }
      return { success: false, message: response.message };
    } catch (error) {
      setError(error.message || 'Failed to create record');
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update record
  const updateRecord = useCallback(async (id, recordData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await recordService.updateRecord(id, recordData);
      if (response.success) {
        // Update local state
        setRecords((prev) =>
          prev.map((r) => (r._id === id ? response.data.record : r))
        );
        if (selectedRecord?._id === id) {
          setSelectedRecord(response.data.record);
        }
        return { success: true, data: response.data.record };
      }
      return { success: false, message: response.message };
    } catch (error) {
      setError(error.message || 'Failed to update record');
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [selectedRecord]);

  // Delete record
  const deleteRecord = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await recordService.deleteRecord(id);
      if (response.success) {
        // Remove from local state
        setRecords((prev) => prev.filter((r) => r._id !== id));
        if (selectedRecord?._id === id) {
          setSelectedRecord(null);
        }
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      setError(error.message || 'Failed to delete record');
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [selectedRecord]);

  // Get critical records
  const fetchCriticalRecords = useCallback(async () => {
    try {
      const response = await recordService.getCriticalRecords();
      if (response.success) {
        return { success: true, data: response.data.records };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }, []);

  // Get record statistics
  const fetchRecordStatistics = useCallback(async (patientId) => {
    try {
      const response = await recordService.getRecordStatistics(patientId);
      if (response.success) {
        return { success: true, data: response.data.statistics };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }, []);

  const value = {
    records,
    selectedRecord,
    isLoading,
    error,
    fetchRecords,
    fetchRecordsByPatientId,
    fetchRecord,
    createRecord,
    updateRecord,
    deleteRecord,
    fetchCriticalRecords,
    fetchRecordStatistics,
    setSelectedRecord,
  };

  return <RecordContext.Provider value={value}>{children}</RecordContext.Provider>;
};

export default RecordContext;
