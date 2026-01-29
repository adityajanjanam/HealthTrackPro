import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GoogleSignInButton from '../components/GoogleSignInButton';
import {
  COLORS,
  FONTS,
  SPACING,
  BORDER_RADIUS,
  globalStyles,
  createShadow,
  createInputStyle,
  createButtonStyle,
  createTextStyle,
} from '../theme';

// Optimized constants
const API_BASE_URL = 'http://10.0.2.2:5000';
const REQUEST_TIMEOUT = 15000; // 15 second timeout
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// eslint-disable-next-line no-unused-vars
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Memoized validation function to prevent recreation
  const isValidEmail = useCallback((emailValue) => {
    return EMAIL_REGEX.test(emailValue);
  }, []);

  // Memoized Google success handler
  const handleGoogleSuccess = useCallback(
    (result) => {
      try {
        const username = result.user.name || result.user.email.split('@')[0];
        Alert.alert('Success', 'Logged in with Google successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.replace('Home', { username }),
          },
        ]);
      } catch (error) {
        console.error('Google login error:', error);
        Alert.alert('Error', 'Failed to process Google login');
      }
    },
    [navigation]
  );

  // Memoized Google error handler
  const handleGoogleError = useCallback((error) => {
    Alert.alert('Error', error.message || 'Google sign-in failed. Please try again.');
  }, []);

  // Memoized login handler with optimized fetch
  const handleLogin = useCallback(async () => {
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
      // Use AbortController for request timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('accessToken', data.token);

        const username = email.split('@')[0];
        Alert.alert('Success', 'Logged in successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.replace('Home', { username }),
          },
        ]);
      } else {
        if (data.message === 'Invalid credentials') {
          Alert.alert('Error', 'Incorrect email or password. Please try again.');
        } else if (data.message === 'User not found') {
          Alert.alert(
            'User Not Found',
            'No account found with this email. Would you like to sign up?',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Sign Up',
                onPress: () => navigation.navigate('SignUp'),
              },
            ]
          );
        } else {
          Alert.alert('Error', data.message || 'Login failed. Please try again.');
        }
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error during login:', error);
        Alert.alert('Error', 'Network request timeout. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [isValidEmail, navigation]);

  return (
    <LinearGradient colors={['#2196F3', '#21CBF3']} style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require('../../assets/healthtrack_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>Login to continue</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.divider} />
        </View>

        {/* Google Sign-In Button */}
        <GoogleSignInButton onSuccess={handleGoogleSuccess} onError={handleGoogleError} />

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.link}>
            Don&apos;t have an account? <Text style={styles.linkHighlight}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

// eslint-disable-next-line react/no-unused-prop-types, no-use-before-define, react-native/no-color-literals
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    ...createShadow(8),
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: SPACING.xl,
  },
  title: {
    ...createTextStyle('h2', COLORS.textPrimary),
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...createTextStyle('body', COLORS.textSecondary),
    marginBottom: SPACING.xl,
  },
  input: {
    ...createInputStyle(false, false),
    width: '100%',
    marginBottom: SPACING.lg,
  },
  inputFocused: {
    ...createInputStyle(true, false),
    width: '100%',
    marginBottom: SPACING.lg,
  },
  inputError: {
    ...createInputStyle(false, true),
    width: '100%',
    marginBottom: SPACING.lg,
  },
  button: {
    ...createButtonStyle('primary', false),
    width: '100%',
    marginTop: SPACING.md,
  },
  buttonDisabled: {
    ...createButtonStyle('primary', true),
    width: '100%',
    marginTop: SPACING.md,
  },
  buttonText: {
    ...createTextStyle('label', COLORS.white),
  },
  forgotPassword: {
    ...createTextStyle('body', COLORS.primary),
    marginTop: SPACING.lg,
  },
  link: {
    ...createTextStyle('body', COLORS.textSecondary),
    marginTop: SPACING.md,
  },
  linkHighlight: {
    ...createTextStyle('label', COLORS.success),
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xl,
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: SPACING.md,
    ...createTextStyle('label', COLORS.textSecondary),
  },
});
