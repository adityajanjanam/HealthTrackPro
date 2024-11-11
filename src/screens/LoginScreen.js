import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Helper function to validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    // Validation checks before proceeding with the login request
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in both email and password fields.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://192.168.2.246:5000/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const username = email.split('@')[0];
        Alert.alert('Success', 'Logged in successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.replace('Home', { username }), // Pass the username to Home Screen
          },
        ]);
      } else {
        if (data.message === 'Invalid credentials') {
          Alert.alert('Error', 'Incorrect email or password. Please try again.');
        } else if (data.message === 'User not found') {
          // Suggest sign-up if the user does not exist
          Alert.alert('User Not Found', 'No account found with this email. Would you like to sign up?', [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Sign Up',
              onPress: () => navigation.navigate('SignUp'),
            },
          ]);
        } else {
          Alert.alert('Error', 'Login failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require('../../assets/healthtrack_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>HealthTrackPro</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, loading ? styles.buttonDisabled : {}]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.link}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
  },
  input: {
    width: '100%',
    height: 55,
    backgroundColor: '#e8e8e8',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 17,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
  link: {
    color: '#007bff',
    marginTop: 15,
    fontSize: 15,
  },
  forgotPassword: {
    color: '#007bff',
    marginTop: 10,
    fontSize: 14,
  },
});

export default LoginScreen;
