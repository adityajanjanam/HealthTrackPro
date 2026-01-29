import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Required for Expo Google Auth
WebBrowser.maybeCompleteAuthSession();

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
};

/**
 * OAuth Service for Google Authentication
 * Provides utility functions for handling OAuth flows
 */
class OAuthService {
  /**
   * Authenticate with backend using Google credentials
   * @param {string} googleToken - ID token from Google
   * @param {object} userInfo - User info from Google
   * @returns {Promise<object>} Authentication result with user and tokens
   */
  async googleSignIn(googleToken, userInfo) {
    if (!googleToken || !userInfo) {
      throw new Error('Missing required authentication parameters');
    }

    try {
      const response = await fetch(`${API_URL}/oauth/google/mobile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleId: userInfo.sub || userInfo.id,
          email: userInfo.email,
          name: userInfo.name || userInfo.displayName,
          picture: userInfo.picture || userInfo.photoUrl,
          idToken: googleToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Authentication failed with status ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Store tokens and user info
      await this.storeAuthData(data.data);

      return {
        success: true,
        user: data.data.user,
        tokens: {
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
        },
      };
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  }

  /**
   * Store authentication data in local storage
   * @param {object} authData - Authentication data containing tokens and user info
   */
  async storeAuthData(authData) {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.ACCESS_TOKEN, authData.accessToken],
        [STORAGE_KEYS.REFRESH_TOKEN, authData.refreshToken],
        [STORAGE_KEYS.USER, JSON.stringify(authData.user)],
      ]);
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw new Error('Failed to store authentication data');
    }
  }

  /**
   * Retrieve stored authentication tokens
   * @returns {Promise<object>} Tokens object with accessToken and refreshToken
   */
  async getStoredTokens() {
    try {
      const [accessToken, refreshToken] = await AsyncStorage.multiGet([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
      ]);

      return {
        accessToken: accessToken[1],
        refreshToken: refreshToken[1],
      };
    } catch (error) {
      console.error('Error retrieving tokens:', error);
      return { accessToken: null, refreshToken: null };
    }
  }

  /**
   * Retrieve stored user info
   * @returns {Promise<object|null>} User object or null if not found
   */
  async getStoredUser() {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error retrieving user:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   * @returns {Promise<boolean>} True if valid access token exists
   */
  async isAuthenticated() {
    try {
      const { accessToken } = await this.getStoredTokens();
      return !!accessToken;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  /**
   * Clear all authentication data
   */
  async clearAuthData() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER,
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
      throw new Error('Failed to clear authentication data');
    }
  }

  /**
   * Refresh access token using refresh token
   * @returns {Promise<string>} New access token
   */
  async refreshAccessToken() {
    try {
      const { refreshToken } = await this.getStoredTokens();

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_URL}/oauth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Token refresh failed');
      }

      // Store new token
      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.data.accessToken);

      return data.data.accessToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      // Clear auth data if refresh fails
      await this.clearAuthData();
      throw error;
    }
  }
}

export default new OAuthService();
