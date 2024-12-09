  import React, { useState } from 'react';
  import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
  } from 'react-native';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
  import DateTimePickerModal from 'react-native-modal-datetime-picker';

  const BASE_URL = 'http://10.0.2.2:5000';

  const AddPatientScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [contact, setContact] = useState('');
    const [medicalHistory, setMedicalHistory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const validateInput = () => {
      if (!name || !dob || !contact || !medicalHistory) {
        Alert.alert('Validation Error', 'All fields are required.');
        return false;
      }
      const contactRegex = /^[0-9]{10}$/;
      if (!contactRegex.test(contact)) {
        Alert.alert('Validation Error', 'Enter a valid 10-digit contact number.');
        return false;
      }
      return true;
    };

    const handleDateConfirm = (date) => {
      setDob(date.toLocaleDateString('en-US'));
      setDatePickerVisibility(false);
    };

    const handleSubmit = async () => {
      if (!validateInput()) return;

      setIsLoading(true);

      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          Alert.alert('Error', 'You are not logged in. Please log in again.');
          navigation.navigate('Login');
          return;
        }

        const response = await fetch(`${BASE_URL}/patients`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            dob,
            contact,
            medicalHistory,
          }),
        });

        if (response.ok) {
          Alert.alert('Success', 'Patient added successfully!');
          setName('');
          setDob('');
          setContact('');
          setMedicalHistory('');
          navigation.goBack();
        } else {
          const errorData = await response.json();
          Alert.alert('Error', errorData.message || 'Failed to add patient.');
        }
      } catch (error) {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>
            <Icon name="account-plus" size={24} color="#007bff" /> Add Patient
          </Text>

          <View style={styles.inputContainer}>
            <Icon name="account" size={20} color="#007bff" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter patient's name"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
            />
          </View>

          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setDatePickerVisibility(true)}
            accessible
            accessibilityLabel="Select Date of Birth"
          >
            <Icon name="calendar" size={20} color="#007bff" style={styles.inputIcon} />
            <Text style={[styles.input, dob ? { color: '#000' } : { color: '#888' }]}>
              {dob || 'Select Date of Birth'}
            </Text>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleDateConfirm}
            onCancel={() => setDatePickerVisibility(false)}
          />

          <View style={styles.inputContainer}>
            <Icon name="phone" size={20} color="#007bff" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter contact number (10 digits)"
              placeholderTextColor="#888"
              value={contact}
              onChangeText={setContact}
              keyboardType="phone-pad"
            />
          </View>

          <View style={[styles.inputContainer, styles.textAreaContainer]}>
            <Icon name="file-document" size={20} color="#007bff" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter medical history (e.g., allergies, past illnesses)"
              placeholderTextColor="#888"
              value={medicalHistory}
              onChangeText={setMedicalHistory}
              multiline={true}
              numberOfLines={4}
            />
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
          ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              accessible
              accessibilityLabel="Submit Patient Information"
            >
              <Text style={styles.buttonText}>
                <Icon name="check-circle" size={20} color="#fff" /> Submit
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f9fa',
      paddingHorizontal: 20,
      paddingVertical: 10,
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
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#007bff',
      textAlign: 'center',
      marginBottom: 20,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
      marginBottom: 15,
      paddingHorizontal: 10,
    },
    inputIcon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      height: 50,
      fontSize: 16,
    },
    textAreaContainer: {
      alignItems: 'flex-start',
      paddingVertical: 10,
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
      marginTop: 10,
    },
    buttonText: {
      color: '#fff',
    fontWeight: 'bold',
      fontSize: 16,
    },
    loader: {
      marginTop: 20,
    },
  });

  export default AddPatientScreen;
