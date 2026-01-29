import React from 'react';
import { AuthProvider } from './AuthContext';
import { PatientProvider } from './PatientContext';
import { RecordProvider } from './RecordContext';

/**
 * Root provider that combines all context providers
 */
export const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <PatientProvider>
        <RecordProvider>
          {children}
        </RecordProvider>
      </PatientProvider>
    </AuthProvider>
  );
};

export { useAuth } from './AuthContext';
export { usePatients } from './PatientContext';
export { useRecords } from './RecordContext';
