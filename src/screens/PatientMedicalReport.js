import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const PatientMedicalReport = ({ navigation }) => {
  const [patientReports, setPatientReports] = useState([]);

  useEffect(() => {
    // Fetch medical report data from the backend
    const fetchReports = async () => {
      try {
        const response = await fetch('http://192.168.2.246:5000/reports'); // Replace with actual backend API URL
        if (response.ok) {
          const data = await response.json();
          setPatientReports(data);
        } else {
          console.error('Failed to fetch reports:', response.status);
        }
      } catch (error) {
        console.error('Error fetching patient reports:', error);
      }
    };

    fetchReports();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.selectedRecordCard}>
        <Text style={styles.selectedRecordTitle}>Selected record:</Text>
        <View style={styles.selectedRecordContent}>
          <Text style={styles.selectedRecordName}>Patient records</Text>
          <Image
            source={require('../../assets/MedicalRecords.jpg')} // Replace with your own image file path
            style={styles.selectedRecordImage}
            resizeMode="contain"
          />
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.recordsOverview}>
        <Text style={styles.overviewTitle}>Patient records overview</Text>
        <View style={styles.recordsGrid}>
          {patientReports.map((report, index) => (
            <View key={index} style={styles.recordBox}>
              <Image
                source={{ uri: report.imageUrl }} // Load images dynamically from backend data
                style={styles.recordImage}
                resizeMode="contain"
              />
              <Text style={styles.recordLabel}>{report.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  selectedRecordCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedRecordTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  selectedRecordContent: {
    width: '100%',
    alignItems: 'center',
  },
  selectedRecordName: {
    fontSize: 16,
    marginBottom: 10,
  },
  selectedRecordImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  viewButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  recordsOverview: {
    marginBottom: 20,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  recordBox: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  recordImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  recordLabel: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6e6e6e',
  },
});

export default PatientMedicalReport;
