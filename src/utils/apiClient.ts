/**
 * utils/apiClient.ts
 *
 * Configured axios instance shared across all feature API modules.
 * Auto-injects the JWT Bearer token from the auth store on every request.
 */

import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

export const client = axios.create({
  baseURL: API_BASE,
  timeout: 30_000,
});

client.interceptors.request.use(async (config) => {
  // Avoid sending expired/invalid access tokens to auth endpoints
  if (
    config.url?.includes('/api/v1/auth/refresh') ||
    config.url?.includes('/api/v1/auth/login') ||
    config.url?.includes('/api/v1/auth/register')
  ) {
    return config;
  }

  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Intercept 401 Unauthorized errors and retry with rotated tokens
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Avoid infinite loop if the refresh endpoint itself returns 401
      if (originalRequest.url?.includes('/api/v1/auth/refresh')) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // Trigger token rotation (coalesced inside Zustand store)
        await useAuthStore.getState().refreshAuth();

        // Get the new access token
        const newAccessToken = useAuthStore.getState().accessToken;
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          // Retry the original request
          return client(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, refreshAuth will have logged the user out.
        // Forward the rejection.
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
