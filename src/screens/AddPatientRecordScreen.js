import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Switch, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const AddPatientRecordScreen = ({ navigation }) => {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [patients, setPatients] = useState([]);
  const [testType, setTestType] = useState('');
  const [reading, setReading] = useState('');
  const [symptoms, setSymptoms] = useState({
    cough: false,
    fever: false,
    fatigue: false,
    shortnessOfBreath: false,
  });
  const [treatmentNotes, setTreatmentNotes] = useState('');

  useEffect(() => {
    // Fetch patient list from the backend
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://192.168.2.246:5000/patients');
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  const handleSubmit = async () => {
    if (!selectedPatient || !testType || !reading) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const patientData = {
      patientId: selectedPatient,
      testType,
      reading,
      symptoms: Object.keys(symptoms).filter(key => symptoms[key]),
      treatmentNotes,
    };

    try {
      const response = await fetch('http://192.168.2.246:5000/patient-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });

      if (response.ok) {
        Alert.alert('Success', 'Record submitted successfully!');
        // Reset form fields
        setSelectedPatient('');
        setTestType('');
        setReading('');
        setSymptoms({
          cough: false,
          fever: false,
          fatigue: false,
          shortnessOfBreath: false,
        });
        setTreatmentNotes('');
        navigation.goBack();
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to submit record.');
      }
    } catch (error) {
      console.error('Error submitting patient data:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    }
  };

  const handlePatientChange = (itemValue) => {
    if (itemValue === 'new') {
      navigation.navigate('AddPatient');
    } else {
      setSelectedPatient(itemValue);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Select Patient</Text>
          <Picker
            selectedValue={selectedPatient}
            style={styles.picker}
            onValueChange={handlePatientChange}
          >
            <Picker.Item label="Create New Patient" value="new" />
            {patients.map(patient => (
              <Picker.Item key={patient._id} label={patient.name} value={patient._id} />
            ))}
          </Picker>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Select Test Type</Text>
          <Picker
            selectedValue={testType}
            style={styles.picker}
            onValueChange={(itemValue) => setTestType(itemValue)}
          >
            <Picker.Item label="Blood Pressure" value="bloodPressure" />
            <Picker.Item label="Heart Rate" value="heartRate" />
            <Picker.Item label="Oxygen Level" value="oxygenLevel" />
            <Picker.Item label="Respiratory Rate" value="respiratoryRate" />
          </Picker>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Enter Reading</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter the reading"
            keyboardType="numeric"
            value={reading}
            onChangeText={setReading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Symptoms</Text>
          <View style={styles.switchContainer}>
            <View style={styles.switchRow}>
              <Switch
                value={symptoms.cough}
                onValueChange={(value) => setSymptoms({ ...symptoms, cough: value })}
              />
              <Text style={styles.switchLabel}>Cough</Text>
            </View>
            <View style={styles.switchRow}>
              <Switch
                value={symptoms.fever}
                onValueChange={(value) => setSymptoms({ ...symptoms, fever: value })}
              />
              <Text style={styles.switchLabel}>Fever</Text>
            </View>
            <View style={styles.switchRow}>
              <Switch
                value={symptoms.fatigue}
                onValueChange={(value) => setSymptoms({ ...symptoms, fatigue: value })}
              />
              <Text style={styles.switchLabel}>Fatigue</Text>
            </View>
            <View style={styles.switchRow}>
              <Switch
                value={symptoms.shortnessOfBreath}
                onValueChange={(value) => setSymptoms({ ...symptoms, shortnessOfBreath: value })}
              />
              <Text style={styles.switchLabel}>Shortness of Breath</Text>
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Treatment Notes</Text>
          <TextInput
            style={styles.input}
            placeholder="Notes on treatment plan"
            value={treatmentNotes}
            onChangeText={setTreatmentNotes}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Record</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    backgroundColor: '#e8e8e8',
    borderRadius: 8,
  },
  input: {
    backgroundColor: '#e8e8e8',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '50%',
  },
  switchLabel: {
    fontSize: 14,
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddPatientRecordScreen;
