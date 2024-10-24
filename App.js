import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import AddPatientScreen from './src/screens/AddPatientScreen';
import AddPatientRecordScreen from './src/screens/AddPatientRecordScreen';
import ViewPatientRecordsScreen from './src/screens/ViewPatientRecordsScreen';
import PatientMedicalReport from './src/screens/PatientMedicalReport';
import PatientDetailScreen from './src/screens/PatientDetailScreen';
import ListAllPatientsScreen from './src/screens/ListAllPatientsScreen';
import CriticalConditionAlertScreen from './src/screens/CriticalConditionAlertScreen'; // Import the CriticalConditionAlertScreen

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Welcome"
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#f8f8f8',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen} 
          options={{ headerShown: false }}  // Hide header for Welcome screen
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Login' }}
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUpScreen} 
          options={{ title: 'Sign Up' }}
        />
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPasswordScreen} 
          options={{ title: 'Forgot Password' }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Home', headerLeft: null }}  // Remove back button for Home screen
        />
        <Stack.Screen 
          name="AddPatient" 
          component={AddPatientScreen} 
          options={{ title: 'Add Patient' }}
        />
        <Stack.Screen 
          name="AddPatientRecord" 
          component={AddPatientRecordScreen} 
          options={{ title: 'Add Patient Record' }}
        />
        <Stack.Screen 
          name="PatientDetail" 
          component={PatientDetailScreen} 
          options={{ title: 'Patient Detail' }}
        />
        <Stack.Screen 
          name="ListAllPatients" 
          component={ListAllPatientsScreen} 
          options={{ title: 'Patient List' }}
        />
        <Stack.Screen 
          name="ViewPatientRecords" 
          component={ViewPatientRecordsScreen} 
          options={{ title: 'View Patient Records' }}
        />
        <Stack.Screen 
          name="PatientMedicalReport" 
          component={PatientMedicalReport} 
          options={{ title: 'Patient Medical Report' }}
        />
        <Stack.Screen 
          name="CriticalConditionAlert"  // Register the CriticalConditionAlertScreen here
          component={CriticalConditionAlertScreen} 
          options={{ title: 'Critical Condition Alerts' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
