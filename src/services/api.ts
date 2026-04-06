import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token to every request
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('clerk_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('clerk_token');
    }
    return Promise.reject(error);
  }
);

export default api;

export const setAuthToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync('clerk_token', token);
};

export const getAuthToken = async (): Promise<string | null> => {
  return SecureStore.getItemAsync('clerk_token');
};

export const clearAuthToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync('clerk_token');
};
