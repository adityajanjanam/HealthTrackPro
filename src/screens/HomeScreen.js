import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const BASE_URL = 'http://10.0.2.2:5000';

const fetchWithToken = async (endpoint) => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      Alert.alert('Error', 'You must log in again.');
      return null;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error fetching ${endpoint}:`, errorText);
      Alert.alert('Error', `Failed to fetch data from ${endpoint}.`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error.message);
    Alert.alert('Error', 'An unexpected error occurred.');
    return null;
  }
};

const HomeScreen = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [totalPatients, setTotalPatients] = useState(0);
  const [criticalPatients, setCriticalPatients] = useState(0);
  const username = route.params?.username || 'Healthcare Provider';

  useEffect(() => {
    const fetchStatistics = async () => {
      setIsLoading(true);
      try {
        const data = await fetchWithToken('/patients');
        if (data) {
          setTotalPatients(data.length);
          const criticalCount = data.filter((patient) => patient.isCritical).length;
          setCriticalPatients(criticalCount);
        }
      } catch (error) {
        console.error('Fetch error:', error.message);
        Alert.alert('Error', 'An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      {isLoading && <ActivityIndicator size="large" color="#007bff" />}
      
      {/* Header Section */}
      <LinearGradient colors={['#007bff', '#00c6ff']} style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.welcomeText}>Welcome, {username}!</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={require('../../assets/stethoscope.png')}
          style={styles.bannerImage}
          resizeMode="contain"
        />
      </LinearGradient>

      {/* Dashboard Statistics */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Dashboard Statistics</Text>
        <View style={styles.statisticsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statCount}>{totalPatients}</Text>
            <Text style={styles.statLabel}>Total Patients</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statCount}>{criticalPatients}</Text>
            <Text style={styles.statLabel}>Critical Patients</Text>
          </View>
        </View>
      </View>

      {/* Manage Patients */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Manage Patients</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('AddPatientScreen')}
          >
            <Icon name="account-plus" size={30} color="#007bff" />
            <Text style={styles.actionText}>Add Patient</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={async () => {
              const data = await fetchWithToken('/patients');
              if (data) {
                navigation.navigate('ListAllPatients', { patients: data });
              }
            }}
          >
            <Icon name="account-multiple" size={30} color="#007bff" />
            <Text style={styles.actionText}>View Patients</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Patient Records */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Patient Records</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('AddPatientRecord')}
          >
            <Icon name="file-document-edit" size={30} color="#28a745" />
            <Text style={styles.actionText}>Add Records</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={async () => {
              const data = await fetchWithToken('/patient-records');
              if (data) {
                navigation.navigate('ViewPatientRecords', { records: data });
              }
            }}
          >
            <Icon name="folder-open" size={30} color="#28a745" />
            <Text style={styles.actionText}>View Records</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* App Features */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>App Features</Text>
        <View style={styles.featuresRow}>
          <TouchableOpacity style={styles.featureBox}>
            <Icon name="heart-pulse" size={30} color="#fff" />
            <Text style={styles.featureText}>Heart Rate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.featureBox}>
            <Icon name="stethoscope" size={30} color="#fff" />
            <Text style={styles.featureText}>Clinical Info</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.featureBox}>
            <Icon name="medical-bag" size={30} color="#fff" />
            <Text style={styles.featureText}>Health Records</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.featureBox}>
            <Icon name="heart" size={30} color="#fff" />
            <Text style={styles.featureText}>Blood Pressure</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  scrollViewContent: {
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bannerImage: {
    width: width * 0.9,
    height: 150,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f1f1f1',
  },
  actionText: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featureBox: {
    width: '22%',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#007bff',
  },
  featureText: {
    marginTop: 5,
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  statisticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f1f1f1',
    width: '48%',
  },
  statCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
  },
  statLabel: {
    fontSize: 14,
    color: '#555',
  },
});

export default HomeScreen;
