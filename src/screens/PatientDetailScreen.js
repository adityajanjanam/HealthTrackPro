import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.0.2.2:5000';

const PatientDetailScreen = ({ route, navigation }) => {
  const { patientId } = route.params || {};
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Patient Data
  useEffect(() => {
    if (!patientId) {
      Alert.alert('Error', 'Patient ID is missing.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
      return;
    }

    const fetchPatientData = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          Alert.alert('Authentication Error', 'Please log in again.');
          navigation.navigate('Login');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/patients/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error Response: ${errorText}`);
          throw new Error('Failed to fetch patient data.');
        }

        const data = await response.json();
        setPatientData(data);
      } catch (error) {
        console.error('Error fetching patient data:', error);
        Alert.alert('Error', 'Unable to fetch patient data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId]);

  // Edit Patient Info
  const handleEditInfo = () => {
    if (!patientData) {
      Alert.alert('Error', 'Patient data is missing. Cannot edit.');
      return;
    }
    navigation.navigate('EditPatientInfo', { patient: patientData });
  };

  // Delete Patient Info
  const handleDeleteInfo = async () => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this patient?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
              Alert.alert('Authentication Error', 'Please log in again.');
              navigation.navigate('Login');
              return;
            }

            const response = await fetch(`${API_BASE_URL}/patients/${patientId}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
              const errorText = await response.text();
              console.error(`Error Response: ${errorText}`);
              throw new Error('Failed to delete patient.');
            }

            Alert.alert('Success', 'Patient deleted successfully.');
            navigation.goBack();
          } catch (error) {
            console.error('Error deleting patient:', error);
            Alert.alert('Error', 'An unexpected error occurred while deleting the patient.');
          }
        },
      },
    ]);
  };

  // Display Loader
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading patient details...</Text>
      </View>
    );
  }

  // Display No Data
  if (!patientData) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>No data available for this patient.</Text>
      </View>
    );
  }

  // Render Patient Details
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Patient Details</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Personal Details</Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Name: </Text>
          {patientData.name || 'N/A'}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Contact: </Text>
          {patientData.contact || 'N/A'}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Email: </Text>
          {patientData.email || 'N/A'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Clinical Data</Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Blood Pressure: </Text>
          {patientData.bloodPressure || 'N/A'}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Heart Rate: </Text>
          {patientData.heartRate || 'N/A'}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Oxygen Level: </Text>
          {patientData.oxygenLevel || 'N/A'}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Respiratory Rate: </Text>
          {patientData.respiratoryRate || 'N/A'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Medical History</Text>
        <Text style={styles.detailText}>
          {patientData.medicalHistory || 'No medical history available.'}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEditInfo}>
          <Text style={styles.buttonText}>Edit Info</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteInfo}>
          <Text style={styles.buttonText}>Delete Info</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#007bff',
  },
  card: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ff0000',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PatientDetailScreen;
