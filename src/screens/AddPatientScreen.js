import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const AddPatientScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [contact, setContact] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');

  const handleSubmit = async () => {
    if (!name || !dob || !contact || !medicalHistory) {
      alert('Please fill in all the fields');
    } else {
      try {
        const response = await fetch('http://192.168.2.246:5000/patients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, dob, contact, medicalHistory }),
        });

        if (response.ok) {
          Alert.alert('Success', 'Patient information added successfully!');
          // Clear form fields
          setName('');
          setDob('');
          setContact('');
          setMedicalHistory('');
        } else {
          const errorData = await response.json();
          Alert.alert('Error', errorData.message || 'Failed to add patient.');
        }
      } catch (error) {
        console.error('Error adding patient:', error);
        Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter patient's name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          style={styles.input}
          placeholder="MM/DD/YYYY"
          placeholderTextColor="#888"
          value={dob}
          onChangeText={setDob}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Contact Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter contact number"
          placeholderTextColor="#888"
          value={contact}
          onChangeText={setContact}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Medical History</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter medical history"
          placeholderTextColor="#888"
          value={medicalHistory}
          onChangeText={setMedicalHistory}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddPatientScreen;
