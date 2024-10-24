import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const PatientDetailScreen = ({ navigation }) => {
  const handleEditInfo = () => {
    // Logic to edit patient info
    alert('Edit info functionality not yet implemented.');
  };

  const handleDeleteInfo = () => {
    // Logic to delete patient info
    alert('Delete info functionality not yet implemented.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Patient Detail View</Text>

      {/* Personal Details */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Personal Details</Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Name: </Text>Samantha Green
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Age: </Text>34
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Contact: </Text>(555) 123-4567
        </Text>
      </View>

      {/* Clinical Data */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Clinical Data</Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Blood Pressure: </Text>180/120 mmHg <Text style={styles.critical}>Critical</Text>
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Heart Rate: </Text>110 bpm
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Blood Oxygen Level: </Text>92%
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.label}>Respiratory Rate: </Text>18/min
        </Text>
      </View>

      {/* Medical History */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Medical History</Text>
        <Text style={styles.detailText}>
          <Text style={styles.dateLabel}>2023-01-15: </Text>Completed physical therapy for knee.
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.dateLabel}>2022-11-10: </Text>Prescribed medication for cholesterol management.
        </Text>
      </View>

      {/* Patient Records */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Patient Records</Text>
        <Text style={styles.detailText}>
          <Text style={styles.dateLabel}>2023-02-14: </Text>Blood tests indicate normal cholesterol levels.
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.dateLabel}>2023-01-10: </Text>MRI scan for knee showed improvement. Routine check-up. All vitals normal.
        </Text>
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
