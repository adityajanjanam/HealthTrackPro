import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ListAllPatientsScreen = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCritical, setShowCritical] = useState(false);
  const [patients, setPatients] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch patient data from the backend API
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          Alert.alert('Error', 'You are not logged in. Please log in again.');
          navigation.navigate('Login');
          return;
        }

        const response = await fetch('http://192.168.2.246:5000/patients', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setPatients(data);
          } else {
            setPatients([]); // Ensure patients is always an array
          }
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch patient data');
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
        Alert.alert('Error', error.message || 'Failed to fetch patient data');
        setPatients([]); // Set to an empty array on error to prevent undefined access
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Filter patients based on search term and critical status
  const filteredPatients = Array.isArray(patients)
    ? patients.filter((patient) => patient.name && patient.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((patient) => (showCritical ? patient.isCritical : true))
    : [];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Patient List</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search patients..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {/* Toggle to show only critical patients */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowCritical(!showCritical)}
      >
        <Text style={styles.filterButtonText}>
          {showCritical ? 'Show All Patients' : 'Show Critical Patients'}
        </Text>
      </TouchableOpacity>

      {loading ? (
        <Text style={styles.loadingText}>Loading patients...</Text>
      ) : patients.length > 0 ? (
        <ScrollView style={styles.scrollView}>
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.patientCard,
                  patient.isCritical ? styles.criticalCard : null,
                ]}
                onPress={() => navigation.navigate('PatientDetail', { patient })}
              >
                <Text style={styles.patientName}>{patient.name}</Text>
                <Text style={styles.patientDetails}>Phone: {patient.contact || 'N/A'}</Text>
                <Text style={styles.patientDetails}>
                  Blood Pressure: {patient.bloodPressure || 'N/A'}
                </Text>
                <Text style={styles.patientDetails}>
                  Heart Rate: {patient.heartRate || 'N/A'}
                </Text>
                {patient.isCritical && (
                  <Text style={styles.criticalText}>Critical Condition</Text>
                )}
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noPatientsText}>No patients found matching the criteria.</Text>
          )}
        </ScrollView>
      ) : (
        <View style={styles.noPatientsContainer}>
          <Text style={styles.noPatientsText}>No patients added yet.</Text>
          <TouchableOpacity
            style={styles.addPatientButton}
            onPress={() => navigation.navigate('AddPatientScreen')}
          >
            <Text style={styles.addPatientButtonText}>Add New Patient</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#e8e8e8',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  patientCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  criticalCard: {
    borderColor: 'red',
    borderWidth: 2,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  patientDetails: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  criticalText: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: 8,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
  },
  noPatientsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  noPatientsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  addPatientButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addPatientButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ListAllPatientsScreen;
