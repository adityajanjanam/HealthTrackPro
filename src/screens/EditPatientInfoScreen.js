import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.0.2.2:5000';

const EditPatientInfoScreen = ({ route, navigation }) => {
  const { patient } = route.params || {};
  if (!patient) {
    Alert.alert('Error', 'Patient data is missing.');
    navigation.goBack();
    return null;
  }

  const [name, setName] = useState(patient.name || '');
  const [contact, setContact] = useState(patient.contact || '');
  const [email, setEmail] = useState(patient.email || '');
  const [medicalHistory, setMedicalHistory] = useState(patient.medicalHistory || '');
  const [isLoading, setIsLoading] = useState(false);

  const validateInput = () => {
    if (!name || !contact || !email || !medicalHistory) {
      Alert.alert('Validation Error', 'All fields are required.');
      return false;
    }
    const contactRegex = /^[0-9]{10}$/;
    if (!contactRegex.test(contact)) {
      Alert.alert('Validation Error', 'Enter a valid 10-digit contact number.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateInput()) return;

    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem('accessToken');
      console.log('Token:', token);
      if (!token) {
        Alert.alert('Authentication Error', 'Please log in again.');
        navigation.navigate('Login');
        return;
      }

      const payload = { name, contact, email, medicalHistory };
      console.log('Token:', token);
      console.log('Payload:', payload);

      const response = await fetch(`${API_BASE_URL}/patients/${patient._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server Error:', errorText);
        Alert.alert('Error', `Server Error: ${errorText}`);
        return;
      }

      const data = await response.json();
      console.log('Server Response:', data);

      Alert.alert('Success', 'Patient info updated successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating patient info:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Patient Info</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter patient's name"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contact</Text>
        <TextInput
          style={styles.input}
          value={contact}
          onChangeText={setContact}
          placeholder="Enter contact number"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email address"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Medical History</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={medicalHistory}
          onChangeText={setMedicalHistory}
          placeholder="Enter medical history (e.g., allergies, past illnesses)"
          multiline
        />
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && { backgroundColor: '#ccc' }]}
        onPress={handleSave}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EditPatientInfoScreen;
