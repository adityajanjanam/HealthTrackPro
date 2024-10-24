import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

// Sample patient data with clinical info
const patients = [
  {
    name: 'John Smith',
    age: 45,
    heartRate: 120, // Critical threshold exceeded
    bloodPressure: '180/120 mmHg', // Critical threshold exceeded
    oxygenLevel: '89%', // Critical threshold
    isCritical: true, // Marked as critical based on readings
  },
  {
    name: 'Emily Brown',
    age: 32,
    heartRate: 80,
    bloodPressure: '120/80 mmHg',
    oxygenLevel: '95%',
    isCritical: false,
  },
  {
    name: 'Michael Johnson',
    age: 58,
    heartRate: 130, // Critical threshold exceeded
    bloodPressure: '160/110 mmHg', // Borderline critical
    oxygenLevel: '88%', // Critical threshold exceeded
    isCritical: true,
  },
];

const CriticalConditionAlertScreen = ({ navigation }) => {
  // Filter patients with critical conditions
  const criticalPatients = patients.filter(patient => patient.isCritical);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Critical Condition Patients</Text>
      
      <ScrollView style={styles.list}>
        {criticalPatients.length === 0 ? (
          <Text style={styles.noAlerts}>No patients in critical condition.</Text>
        ) : (
          criticalPatients.map((patient, index) => (
            <View key={index} style={styles.patientCard}>
              <Text style={styles.patientName}>
                {patient.name}, {patient.age}
              </Text>
              <Text style={styles.patientDetails}>Heart Rate: {patient.heartRate} bpm</Text>
              <Text style={styles.patientDetails}>Blood Pressure: {patient.bloodPressure}</Text>
              <Text style={styles.patientDetails}>Oxygen Level: {patient.oxygenLevel}</Text>

              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => navigation.navigate('PatientDetail', { patient })}
              >
                <Text style={styles.detailsButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  patientCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderColor: 'red', // Highlight critical patients in red
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  patientDetails: {
    fontSize: 14,
    color: '#6e6e6e',
    marginBottom: 10,
  },
  detailsButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  noAlerts: {
    textAlign: 'center',
    fontSize: 18,
    color: '#555',
    marginTop: 50,
  },
});

export default CriticalConditionAlertScreen;
