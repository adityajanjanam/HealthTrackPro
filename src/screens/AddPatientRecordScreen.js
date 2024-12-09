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
  const [testType, setTestType] = useState('');
  const [reading, setReading] = useState('');
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
    { label: 'Blood Pressure', value: 'Blood Pressure', placeholder: 'Enter as systolic/diastolic (e.g., 120/80)' },
    { label: 'Heart Rate', value: 'Heart Rate', placeholder: 'Enter heart rate (e.g., 70)' },
    { label: 'Oxygen Level', value: 'Oxygen Level', placeholder: 'Enter oxygen level (e.g., 95)' },
    { label: 'Respiratory Rate', value: 'Respiratory Rate', placeholder: 'Enter respiratory rate (e.g., 16)' },
  ];  

  const getPlaceholder = () => {
    const selectedType = testTypes.find((type) => type.value === testType);
    return selectedType ? selectedType.placeholder : 'Please select a test type to enter reading';
  };

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
    if (testType && reading) {
      checkCriticalCondition();
    }
  }, [testType, reading, symptoms]);

  const checkCriticalCondition = () => {
    let critical = false;
    const parsedReading = parseFloat(reading);

    switch (testType) {
      case 'bloodPressure': {
        const [systolic, diastolic] = reading.split('/').map(Number);
        if (!isNaN(systolic) && !isNaN(diastolic)) {
          critical = systolic >= 180 || diastolic >= 120;
        }
        break;
      }
      case 'heartRate':
        critical = !isNaN(parsedReading) && (parsedReading <= 50 || parsedReading >= 120);
        break;
      case 'oxygenLevel':
        critical = !isNaN(parsedReading) && parsedReading < 90;
        break;
      case 'respiratoryRate':
        critical = !isNaN(parsedReading) && (parsedReading <= 10 || parsedReading >= 30);
        break;
      default:
        break;
    }

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
    if (!testType) {
      Alert.alert('Validation Error', 'Please select a test type.');
      return false;
    }
    if (!reading) {
      Alert.alert('Validation Error', 'Please enter a reading.');
      return false;
    }
    if (testType === 'bloodPressure' && !/^\d+\/\d+$/.test(reading)) {
      Alert.alert('Validation Error', 'Please enter a valid blood pressure (e.g., 120/80).');
      return false;
    }
    if (['heartRate', 'oxygenLevel', 'respiratoryRate'].includes(testType) && isNaN(reading)) {
      Alert.alert('Validation Error', 'Reading must be a number.');
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

    const payload = {
        patientId: selectedPatient,
        testType,
        reading,
        symptoms: Object.keys(symptoms).filter((key) => symptoms[key]),
        treatmentNotes,
        isCritical,
    };

    console.log('Submitting Payload:', payload);

    try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
            Alert.alert('Error', 'You must log in again.');
            navigation.navigate('Login');
            return;
        }

        const response = await fetch(`${BASE_URL}/patient-records`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const alertMessage = isCritical
                ? 'Record submitted successfully! Patient is in critical condition!'
                : 'Record submitted successfully!';
            Alert.alert('Success', alertMessage);
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
    setTestType('');
    setReading('');
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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Select Test Type</Text>
              <Picker
                selectedValue={testType}
                style={styles.picker}
                onValueChange={setTestType}
              >
                <Picker.Item label="Select a Test Type" value="" />
                {testTypes.map((type) => (
                  <Picker.Item key={type.value} label={type.label} value={type.value} />
                ))}
              </Picker>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Enter Reading</Text>
              <TextInput
                style={styles.input}
                placeholder={getPlaceholder()}
                keyboardType="numeric"
                value={reading}
                onChangeText={setReading}
              />
            </View>

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
