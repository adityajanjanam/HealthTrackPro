import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';


// Import Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import AddPatientScreen from './src/screens/AddPatientScreen';
import AddPatientRecordScreen from './src/screens/AddPatientRecordScreen';
import ViewPatientRecordsScreen from './src/screens/ViewPatientRecordsScreen';
import PatientDetailScreen from './src/screens/PatientDetailScreen';
import ListAllPatientsScreen from './src/screens/ListAllPatientsScreen';
import EditPatientInfoScreen from './src/screens/EditPatientInfoScreen';

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await Font.loadAsync({
          'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
        });
        setFontsLoaded(true);
      } catch (err) {
        console.warn('Error loading resources:', err);
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Show nothing until fonts are loaded
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerTitleAlign: 'center',
          headerBackground: () => (
            <LinearGradient
              colors={['#3A7D44', '#007bff']}
              style={{ flex: 1 }}
            />
          ),
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: 'Roboto-Bold',
          },
        }}
      >
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up' }} />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ title: 'Forgot Password' }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Home',
            headerLeft: () => null,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="AddPatientScreen"
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
          name="EditPatientInfo"
          component={EditPatientInfoScreen}
          options={{ title: 'Edit Patient Info' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
