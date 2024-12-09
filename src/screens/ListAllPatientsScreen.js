import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const API_BASE_URL = 'http://10.0.2.2:5000';

const ListAllPatientsScreen = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCritical, setShowCritical] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          Alert.alert('Authentication Error', 'You must log in again.');
          navigation.navigate('Login');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/patients`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch patients data');
        }

        const data = await response.json();
        console.log('API Response:', data);
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
        Alert.alert('Error', `Error fetching patients data. ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleDeletePatient = async (patientId) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Authentication Error', 'You must log in again.');
        navigation.navigate('Login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/patients/${patientId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete patient');
      }

      Alert.alert('Success', 'Patient deleted successfully.');
      setPatients((prevPatients) => prevPatients.filter((p) => p._id !== patientId));
    } catch (error) {
      console.error('Error deleting patient:', error);
      Alert.alert('Error', error.message);
    }
  };

  const filteredPatients = patients
    .filter((patient) =>
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((patient) => (showCritical ? patient.isCritical === true : true));

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search patients..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowCritical(!showCritical)}
        >
          <Text style={styles.filterButtonText}>
            {showCritical ? 'Show All Patients' : 'Show Critical Patients'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddPatientScreen')}
        >
          <Text style={styles.addButtonText}>Add Patient</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
        {filteredPatients.length === 0 ? (
          <Text style={styles.emptyState}>No patients found.</Text>
        ) : (
          filteredPatients.map((patient) => (
            <View
              key={patient._id}
              style={[styles.patientCard, patient.isCritical ? styles.criticalCard : null]}
            >
              <Text style={styles.patientName}>{patient.name}</Text>
              <Text style={styles.patientDetails}>
                Phone: {patient.contact || 'N/A'}
              </Text>
              <Text style={styles.patientDetails}>
                Email: {patient.email || 'N/A'}
              </Text>
              <Text style={styles.patientDetails}>
                Blood Pressure: {patient.bloodPressure || 'N/A'}
              </Text>
              <Text style={styles.patientDetails}>
                Heart Rate: {patient.heartRate || 'N/A'}
              </Text>
              {patient.isCritical && (
                <Text style={styles.criticalText}>Critical Condition</Text>
              )}
              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => navigation.navigate('PatientDetail', { patientId: patient._id })}
                >
                  <Icon name="info" size={20} color="#fff" />
                  <Text style={styles.detailsButtonText}>Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() =>
                    Alert.alert(
                      'Delete Patient',
                      'Are you sure you want to delete this patient?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Delete', onPress: () => handleDeletePatient(patient._id) },
                      ]
                    )
                  }
                >
                  <Icon name="delete" size={20} color="#fff" />
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filterButton: {
    flex: 0.48,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    flex: 0.48,
    backgroundColor: '#28a745',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff0000',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  detailsButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 14,
  },
  deleteButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 14,
  },
  emptyState: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
  },
});

export default ListAllPatientsScreen;
