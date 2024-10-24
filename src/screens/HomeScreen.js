import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Linking, Dimensions, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation, route }) => {
  const username = route.params?.username || 'Healthcare Provider';

  // Simulated patient data
  const totalPatientsCount = 5; 
  const criticalPatientsCount = 2; // Example for critical patients count

  const handleHelpPress = () => {
    Alert.alert(
      '24/7 Assistance',
      'Would you like to call our toll-free number: 1-800-123-4567?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Call',
          onPress: () => Linking.openURL('tel:1-800-123-4567'),
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Dashboard Overview Section */}
      <View style={styles.dashboard}>
        <Text style={styles.welcomeText}>Welcome, {username}!</Text>
        <Text style={styles.dashboardText}>Total Patients: {totalPatientsCount}</Text>
        <Text style={styles.dashboardText}>Critical Patients: {criticalPatientsCount}</Text>
        {criticalPatientsCount > 0 && (
          <TouchableOpacity 
            style={styles.criticalAlertButton}
            onPress={() => navigation.navigate('CriticalConditionAlert')}
          >
            <Text style={styles.criticalAlertText}>
              ⚠️ Attention! {criticalPatientsCount} patients in critical condition.
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Manage Patients Section */}
      <View style={styles.card}>
        <View style={styles.manageCard}>
          <Image
            source={require('../../assets/stethoscope.png')} // Replace with your image file
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.manageTitle}>Manage patient data efficiently!</Text>
          <View style={styles.manageActions}>
            <TouchableOpacity
              style={styles.manageButton}
              onPress={() => navigation.navigate('AddPatient')}
            >
              <Text style={styles.manageButtonText}>Add New Patients</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.manageButton}
              onPress={() => navigation.navigate('ListAllPatients')}
            >
              <Text style={styles.manageButtonText}>View All Patients</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Patient Records Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patient Records</Text>
        <View style={styles.recordsRow}>
          <View style={styles.iconBox}>
            <Icon name="file-document-outline" size={30} color="#fff" />
            <Text style={styles.iconLabel}>Clinical Info</Text>
          </View>
          <View style={styles.iconBox}>
            <Icon name="heart-pulse" size={30} color="#fff" />
            <Text style={styles.iconLabel}>Blood Pressure</Text>
          </View>
          <View style={styles.iconBox}>
            <Icon name="medical-bag" size={30} color="#fff" />
            <Text style={styles.iconLabel}>Health Records</Text>
          </View>
          <View style={styles.iconBox}>
            <Icon name="heart" size={30} color="#fff" />
            <Text style={styles.iconLabel}>Heart Rate</Text>
          </View>
        </View>
      </View>

      {/* New Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>New Features</Text>
        <View style={styles.recordsRow}>
          <TouchableOpacity
            style={styles.iconBoxDark}
            onPress={() => navigation.navigate('AddPatientRecord')}
          >
            <Icon name="account-plus" size={30} color="#fff" />
            <Text style={styles.iconLabel}>Add Patient Records</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBoxDark}
            onPress={() => navigation.navigate('ViewPatientRecords')}
          >
            <Icon name="format-list-bulleted" size={30} color="#fff" />
            <Text style={styles.iconLabel}>View Patient Records</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Live Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Live Support</Text>
        <View style={styles.supportCard}>
          <Image
            source={require('../../assets/support.png')} // Replace with your image file
            style={styles.supportImage}
            resizeMode="contain"
          />
          <View style={styles.supportText}>
            <Text style={styles.supportTitle}>24/7 Assistance</Text>
            <TouchableOpacity style={styles.supportButton} onPress={handleHelpPress}>
              <Text style={styles.supportButtonText}>Help</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
  },
  dashboard: {
    marginBottom: height * 0.02,
  },
  dashboardText: {
    fontSize: width * 0.04,
    marginBottom: height * 0.005,
  },
  criticalAlertButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  criticalAlertText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: width * 0.04,
  },
  card: {
    marginBottom: height * 0.02,
  },
  welcomeText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
  },
  manageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: width * 0.04,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: height * 0.01,
  },
  manageTitle: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.01,
  },
  manageActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  manageButton: {
    backgroundColor: '#000',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.04,
    borderRadius: 8,
  },
  manageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: height * 0.02,
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
  },
  recordsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  iconBox: {
    width: '48%',
    backgroundColor: '#007bff',
    padding: width * 0.05,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: height * 0.015,
  },
  iconBoxDark: {
    width: '48%',
    backgroundColor: '#000',
    padding: width * 0.05,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: height * 0.015,
  },
  iconLabel: {
    color: '#fff',
    marginTop: height * 0.01,
    textAlign: 'center',
  },
  supportCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: width * 0.04,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  supportImage: {
    width: width * 0.15,
    height: width * 0.15,
    marginRight: width * 0.04,
  },
  supportText: {
    flex: 1,
  },
  supportTitle: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  supportButton: {
    marginTop: height * 0.01,
    backgroundColor: '#000',
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.05,
    borderRadius: 8,
  },
  supportButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
