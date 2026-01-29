import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://10.0.2.2:5000';

const AddPatientRecordScreen = ({ navigation }) => {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [patients, setPatients] = useState([]);
  const [readings, setReadings] = useState({
    bloodPressure: '',
    heartRate: '',
    oxygenLevel: '',
    respiratoryRate: '',
  });
  const [symptoms, setSymptoms] = useState({
    cough: false,
    fever: false,
    fatigue: false,
    shortnessOfBreath: false,
  });
  const [treatmentNotes, setTreatmentNotes] = useState('');
  const [isCritical, setIsCritical] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const testTypes = [
    { label: 'Blood Pressure', key: 'bloodPressure', placeholder: 'Enter as systolic/diastolic (e.g., 120/80)' },
    { label: 'Heart Rate', key: 'heartRate', placeholder: 'Enter heart rate (e.g., 70)' },
    { label: 'Oxygen Level', key: 'oxygenLevel', placeholder: 'Enter oxygen level (e.g., 95)' },
    { label: 'Respiratory Rate', key: 'respiratoryRate', placeholder: 'Enter respiratory rate (e.g., 16)' },
  ];

  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          Alert.alert('Error', 'You must log in again.');
          navigation.navigate('Login');
          return;
        }

        const response = await fetch(`${BASE_URL}/patients`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch patients');
        }

        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
        Alert.alert('Error', 'Failed to load patient data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [navigation]);

  useEffect(() => {
    checkCriticalCondition();
  }, [readings, symptoms]);

  const checkCriticalCondition = () => {
    let critical = false;

    // Check readings
    if (readings.bloodPressure) {
      const [systolic, diastolic] = readings.bloodPressure.split('/').map(Number);
      if (!isNaN(systolic) && !isNaN(diastolic)) {
        critical = systolic >= 180 || diastolic >= 120;
      }
    }
    if (readings.heartRate) {
      const heartRate = parseFloat(readings.heartRate);
      critical = critical || (heartRate <= 50 || heartRate >= 120);
    }
    if (readings.oxygenLevel) {
      const oxygenLevel = parseFloat(readings.oxygenLevel);
      critical = critical || oxygenLevel < 90;
    }
    if (readings.respiratoryRate) {
      const respiratoryRate = parseFloat(readings.respiratoryRate);
      critical = critical || (respiratoryRate <= 10 || respiratoryRate >= 30);
    }

    // Check symptoms
    const criticalSymptoms = symptoms.fever || symptoms.shortnessOfBreath;
    if (criticalSymptoms) {
      critical = true;
    }

    setIsCritical(critical);
  };

  const validateFields = () => {
    if (!selectedPatient) {
      Alert.alert('Validation Error', 'Please select a patient.');
      return false;
    }
    if (!Object.values(readings).some((reading) => reading.trim())) {
      Alert.alert('Validation Error', 'Please enter at least one test reading.');
      return false;
    }
    if (readings.bloodPressure && !/^\d+\/\d+$/.test(readings.bloodPressure)) {
      Alert.alert('Validation Error', 'Please enter a valid blood pressure (e.g., 120/80).');
      return false;
    }
    if (!treatmentNotes.trim()) {
      Alert.alert('Validation Error', 'Please add treatment notes.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;
  
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      Alert.alert('Error', 'You must log in again.');
      navigation.navigate('Login');
      return;
    }
  
    try {
      // Normalize testType
      const normalizeTestType = {
        bloodPressure: 'BloodPressure',
        heartRate: 'HeartRate',
        oxygenLevel: 'OxygenLevel',
        respiratoryRate: 'RespiratoryRate',
      };
  
      // Prepare readings array
      const readingsArray = Object.entries(readings)
        .filter(([key, value]) => value.trim()) // Filter out empty readings
        .map(([key, value]) => ({
          testType: normalizeTestType[key], // Convert to backend-compatible enum value
          value: value.trim(), // Ensure value is a string
        }));
  
      if (readingsArray.length === 0) {
        Alert.alert('Error', 'No valid test readings provided.');
        return;
      }
  
      // Prepare payload
      const payload = {
        patientId: selectedPatient,
        readings: readingsArray,
        symptoms: Object.keys(symptoms).filter((key) => symptoms[key]),
        treatmentNotes: treatmentNotes.trim(),
        isCritical,
      };
  
      const response = await fetch(`${BASE_URL}/patient-records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        Alert.alert('Success', 'Record submitted successfully.');
        resetFields();
      } else {
        const errorData = await response.json();
        console.error('Error Response:', errorData);
        Alert.alert('Error', errorData.message || 'Failed to submit record.');
      }
    } catch (error) {
      console.error('Error Submitting Record:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    }
  };


  const resetFields = () => {
    setSelectedPatient('');
    setReadings({
      bloodPressure: '',
      heartRate: '',
      oxygenLevel: '',
      respiratoryRate: '',
    });
    setSymptoms({
      cough: false,
      fever: false,
      fatigue: false,
      shortnessOfBreath: false,
    });
    setTreatmentNotes('');
    setIsCritical(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#3A7D44" style={styles.loader} />
        ) : (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Select Patient</Text>
              <Picker
                selectedValue={selectedPatient}
                style={styles.picker}
                onValueChange={setSelectedPatient}
              >
                <Picker.Item label="Select a Patient" value="" />
                {patients.map((patient) => (
                  <Picker.Item key={patient._id} label={patient.name} value={patient._id} />
                ))}
              </Picker>
            </View>

            {testTypes.map((test) => (
              <View key={test.key} style={styles.inputGroup}>
                <Text style={styles.label}>{test.label}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={test.placeholder}
                  keyboardType="numeric"
                  value={readings[test.key]}
                  onChangeText={(value) =>
                    setReadings((prev) => ({ ...prev, [test.key]: value }))
                  }
                />
              </View>
            ))}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Symptoms</Text>
              <View style={styles.switchContainer}>
                {Object.keys(symptoms).map((symptom) => (
                  <View key={symptom} style={styles.switchRow}>
                    <Switch
                      value={symptoms[symptom]}
                      onValueChange={(value) =>
                        setSymptoms((prev) => ({ ...prev, [symptom]: value }))
                      }
                    />
                    <Text style={styles.switchLabel}>
                      {symptom.charAt(0).toUpperCase() + symptom.slice(1)}
                    </Text>
                  </View>
                ))}
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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Critical Condition</Text>
              <View style={styles.criticalContainer}>
                <Switch value={isCritical} disabled />
                <Text style={styles.criticalText}>
                  {isCritical ? 'Yes, Critical' : 'No, Stable'}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit Record</Text>
            </TouchableOpacity>
          </>
        )}
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
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  loader: {
    marginTop: 50,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#3A7D44',
  },
  picker: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 16,
    elevation: 3,
    shadowColor: '#000',
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
    marginLeft: 10,
    color: '#555',
  },
  button: {
    backgroundColor: 'green',
    paddingVertical: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  criticalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  criticalText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#555',
  },
});

export default AddPatientRecordScreen;
