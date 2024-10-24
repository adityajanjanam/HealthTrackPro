import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Switch, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Correctly importing Picker

const AddPatientRecordScreen = ({ navigation }) => {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [bloodPressureSystolic, setBloodPressureSystolic] = useState('');
  const [bloodPressureDiastolic, setBloodPressureDiastolic] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [symptoms, setSymptoms] = useState({
    cough: false,
    fever: false,
    fatigue: false,
    shortnessOfBreath: false,
  });
  const [diagnosis, setDiagnosis] = useState('');
  const [treatmentNotes, setTreatmentNotes] = useState('');

  // Sample list of patients (could be fetched from an API or database)
  const patients = [
    { id: '1', name: 'John Smith' },
    { id: '2', name: 'Emily Johnson' },
    { id: '3', name: 'Michael Brown' },
  ];

  const handleSubmit = () => {
    if (!bloodPressureSystolic || !bloodPressureDiastolic || !heartRate || !diagnosis || !selectedPatient) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const patientData = {
      patient: selectedPatient,
      bloodPressureSystolic,
      bloodPressureDiastolic,
      heartRate,
      symptoms,
      diagnosis,
      treatmentNotes,
    };

    console.log('Patient Data:', patientData);

    Alert.alert('Success', 'Record submitted successfully!');

    // Reset form fields
    setSelectedPatient('');
    setBloodPressureSystolic('');
    setBloodPressureDiastolic('');
    setHeartRate('');
    setSymptoms({
      cough: false,
      fever: false,
      fatigue: false,
      shortnessOfBreath: false,
    });
    setDiagnosis('');
    setTreatmentNotes('');

    navigation.goBack();
  };

  // Redirect to Add Patient screen if "Create New Patient" is selected
  const handlePatientChange = (itemValue) => {
    if (itemValue === "new") {
      navigation.navigate('AddPatient');
    } else {
      setSelectedPatient(itemValue);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Add Dropdown to Select Existing Patient or Create New */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Select Patient</Text>
          <Picker
            selectedValue={selectedPatient}
            style={styles.picker}
            onValueChange={handlePatientChange}
          >
            <Picker.Item label="Create New Patient" value="new" />
            {patients.map((patient) => (
              <Picker.Item key={patient.id} label={patient.name} value={patient.name} />
            ))}
          </Picker>
        </View>

        {/* Blood Pressure Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Blood Pressure</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.inputHalf]}
              placeholder="Systolic"
              keyboardType="numeric"
              value={bloodPressureSystolic}
              onChangeText={setBloodPressureSystolic}
            />
            <TextInput
              style={[styles.input, styles.inputHalf]}
              placeholder="Diastolic"
              keyboardType="numeric"
              value={bloodPressureDiastolic}
              onChangeText={setBloodPressureDiastolic}
            />
          </View>
        </View>

        {/* Heart Rate Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Heart Rate</Text>
          <TextInput
            style={styles.input}
            placeholder="Heart Rate"
            keyboardType="numeric"
            value={heartRate}
            onChangeText={setHeartRate}
          />
        </View>

        {/* Symptoms Switches */}
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

        {/* Diagnosis Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Diagnosis</Text>
          <TextInput
            style={styles.input}
            placeholder="Diagnosis details"
            value={diagnosis}
            onChangeText={setDiagnosis}
          />
        </View>

        {/* Treatment Notes Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Treatment Notes</Text>
          <TextInput
            style={styles.input}
            placeholder="Notes on treatment plan"
            value={treatmentNotes}
            onChangeText={setTreatmentNotes}
          />
        </View>

        {/* Submit Button */}
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    backgroundColor: '#e8e8e8',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 16,
  },
  inputHalf: {
    width: '48%',
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