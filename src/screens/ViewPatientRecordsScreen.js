import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';

const API_BASE_URL = 'http://10.0.2.2:5000';

const ViewPatientRecordsScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPatientRecords = async () => {
    setLoading(true);
    try {
      // Retrieve token from AsyncStorage
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Error', 'Your session has expired. Please log in again.');
        navigation.replace('Login');
        return;
      }

      // Make the API request
      const response = await fetch(`${API_BASE_URL}/patient-records`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Handle non-JSON responses or API errors
      const rawText = await response.text();
      if (!response.ok) {
        console.error('Error fetching records:', rawText);
        throw new Error('Failed to fetch patient records.');
      }

      const data = JSON.parse(rawText);
      setRecords(data);
    } catch (error) {
      console.error('Error:', error.message);
      Alert.alert('Error', 'Failed to fetch patient records. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientRecords();
  }, []);

  const handleSort = (a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.patientId?.name || '').localeCompare(b.patientId?.name || '');
      case 'date':
        return new Date(b.date) - new Date(a.date);
      case 'testType':
        return (a.testType || '').localeCompare(b.testType || '');
      case 'reading':
        return parseFloat(b.reading) - parseFloat(a.reading);
      default:
        return 0;
    }
  };

  const filteredRecords = records
    .filter((record) => record.patientId?.name?.toLowerCase().includes(search.toLowerCase()))
    .sort(handleSort);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3A7D44" />
        <Text>Loading patient records...</Text>
      </View>
    );
  }

  if (!records || records.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No patient records available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.headerTitle}>View Patient Records</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color="#A8A8A8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by patient name"
          placeholderTextColor="#A8A8A8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Dropdown for Sorting */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort By:</Text>
        <View style={styles.dropdownWrapper}>
          <Picker
            selectedValue={sortBy}
            style={styles.dropdown}
            onValueChange={(itemValue) => setSortBy(itemValue)}
          >
            <Picker.Item label="Name" value="name" />
            <Picker.Item label="Test Type" value="testType" />
            <Picker.Item label="Date" value="date" />
            <Picker.Item label="Reading" value="reading" />
          </Picker>
        </View>
      </View>

      {/* Patient Records List */}
      <ScrollView style={styles.list}>
        {filteredRecords.map((record, index) => (
          <View key={index} style={styles.recordCard}>
            <Text style={styles.recordTitle}>
              Patient: {record.patientId?.name || 'Unknown'}
            </Text>
            <Text style={styles.recordDetails}>
              Test Type: {record.testType || 'N/A'}
            </Text>
            <Text style={styles.recordDetails}>
              Reading: {record.reading || 'N/A'}
            </Text>
            <Text style={styles.recordDetails}>
              Symptoms: {record.symptoms?.join(', ') || 'None'}
            </Text>
            <Text style={styles.recordDetails}>
              Date: {record.date ? new Date(record.date).toLocaleString() : 'N/A'}
            </Text>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() =>
                navigation.navigate('PatientDetail', {
                  patientId: record.patientId?._id,
                })
              }
            >
              <Text style={styles.detailsButtonText}>View Patient</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3A7D44',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sortLabel: {
    fontSize: 16,
    color: '#3A7D44',
    marginRight: 10,
  },
  dropdownWrapper: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dropdown: {
    height: 50,
    color: '#333',
  },
  list: {
    marginTop: 10,
  },
  recordCard: {
    padding: 15,
    backgroundColor: '#FFF',
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  recordTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#3A7D44',
  },
  recordDetails: {
    marginTop: 5,
    fontSize: 14,
    color: '#555',
  },
  detailsButton: {
    marginTop: 10,
    backgroundColor: '#3A7D44',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#555',
  },
});

export default ViewPatientRecordsScreen;
