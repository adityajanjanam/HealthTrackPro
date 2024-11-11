import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const ViewPatientRecordsScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch patient data from the backend
    const fetchPatients = async () => {
      setLoading(true);
      try {
        console.log('Fetching patient data...');
        const response = await fetch('http://192.168.2.246:5000/patient-records');  
        if (!response.ok) {
          console.error('Response error:', response.status);
          throw new Error(`Failed to fetch patient records: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('Patients fetched successfully:', data);
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patient data:', error);
        alert(`Failed to fetch patient records: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPatients();
  }, []);
  
  // Show a loading message while data is being fetched
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading patient records...</Text>
      </View>
    );
  }

  // Show message if no records found
  if (!patients || patients.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No records found for this patient.</Text>
      </View>
    );
  }

  // Filter patients based on search input
  const filteredPatients = patients
    .filter(patient => patient.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'lastVisit') return new Date(b.lastVisit) - new Date(a.lastVisit);
      if (sortBy === 'age') return b.age - a.age;
    });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Filter by name"
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.sortButton} onPress={() => setSortBy('lastVisit')}>
          <Text style={styles.sortButtonText}>Sort by Last Visit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list}>
        {filteredPatients.map((patient, index) => (
          <View key={index} style={[styles.patientCard, patient.isCritical && styles.criticalCard]}>
            <Text style={styles.patientName}>
              {patient.name}, {patient.age}
            </Text>
            <Text style={styles.patientDetails}>
              Chronic Conditions: {patient.conditions}
            </Text>
            <Text style={styles.patientDetails}>
              Last Visit: {patient.lastVisit}
            </Text>
            {patient.isCritical && <Text style={styles.criticalText}>Critical Condition</Text>}
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => navigation.navigate('PatientDetail', { patient })}
            >
              <Text style={styles.detailsButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    fontSize: 16,
  },
  sortButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  sortButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  list: {
    marginTop: 10,
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
    marginBottom: 5,
  },
  patientDetails: {
    fontSize: 14,
    color: '#6e6e6e',
    marginBottom: 10,
  },
  criticalText: {
    color: 'red',
    fontWeight: 'bold',
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
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
  },
});

export default ViewPatientRecordsScreen;
