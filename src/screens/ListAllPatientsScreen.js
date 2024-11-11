import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const ListAllPatientsScreen = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCritical, setShowCritical] = useState(false);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // Fetch patient data from the backend API
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://192.168.2.246:5000/patients');
        if (!response.ok) {
          throw new Error(`Failed to fetch patients data: ${response.status}`);
        }
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
        alert(`Error fetching patients data. Status: ${error.message}`);
      }
    };    

    fetchPatients();
  }, []);

  // Filter patients based on search term and critical status
  const filteredPatients = patients
    .filter((patient) => patient.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((patient) => (showCritical ? patient.isCritical : true));

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

      <ScrollView style={styles.scrollView}>
        {filteredPatients.map((patient, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.patientCard,
              patient.isCritical ? styles.criticalCard : null,
            ]}
            onPress={() => navigation.navigate('PatientDetail', { patient })}
          >
            <Text style={styles.patientName}>{patient.name}</Text>
            <Text style={styles.patientDetails}>Phone: {patient.phone}</Text>
            <Text style={styles.patientDetails}>Email: {patient.email}</Text>
            <Text style={styles.patientDetails}>Blood Pressure: {patient.bloodPressure}</Text>
            <Text style={styles.patientDetails}>Heart Rate: {patient.heartRate}</Text>
            {patient.isCritical && <Text style={styles.criticalText}>Critical Condition</Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>
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
});

export default ListAllPatientsScreen;
