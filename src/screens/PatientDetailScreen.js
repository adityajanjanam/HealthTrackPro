import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const PatientDetailScreen = ({ navigation, route }) => {
  const { patientId } = route.params;
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    if (!patientId) {
      console.error('Patient ID is undefined.');
      return;
    }
  
    // Fetch patient data from backend server
    const fetchPatientData = async () => {
      try {
        console.log('Fetching data for patient ID:', patientId);
        const response = await fetch(`http://192.168.2.246:5000/patients/${patientId}`);
        if (response.ok) {
          const data = await response.json();
          setPatientData(data);
        } else {
          console.error('Failed to fetch patient data:', response.status);
          alert(`Failed to fetch patient data: ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
        alert(`Error fetching patient data: ${error.message}`);
      }
    };
  
    fetchPatientData();
  }, [patientId]);
  
  

  const handleEditInfo = () => {
    alert('Edit info functionality not yet implemented.');
  };

  const handleDeleteInfo = () => {
    alert('Delete info functionality not yet implemented.');
  };

  if (!patientData) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Patient Detail View</Text>
      {/* Personal Details */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Personal Details</Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Name: </Text>{patientData.name}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Age: </Text>{patientData.age}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Contact: </Text>{patientData.contact}
        </Text>
      </View>
      {/* Clinical Data */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Clinical Data</Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Blood Pressure: </Text>{patientData.bloodPressure} {patientData.isCritical && <Text style={styles.critical}>Critical</Text>}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Heart Rate: </Text>{patientData.heartRate}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Blood Oxygen Level: </Text>{patientData.oxygenLevel}
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Respiratory Rate: </Text>{patientData.respiratoryRate}
        </Text>
      </View>
      {/* Medical History */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Medical History</Text>
        {patientData.medicalHistory.map((entry, index) => (
          <Text key={index} style={styles.detailText}>
            <Text style={styles.dateLabel}>{entry.date}: </Text>{entry.description}
          </Text>
        ))}
      </View>
      {/* Patient Records */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Patient Records</Text>
        {patientData.records.map((record, index) => (
          <Text key={index} style={styles.detailText}>
            <Text style={styles.dateLabel}>{record.date}: </Text>{record.description}
          </Text>
        ))}
      </View>
      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEditInfo}>
          <Text style={styles.buttonText}>Edit Info</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteInfo}>
          <Text style={styles.buttonText}>Delete Info</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
  dateLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  critical: {
    color: 'red',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  editButton: {
    backgroundColor: '#000',
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
