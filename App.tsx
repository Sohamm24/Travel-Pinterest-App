import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import RootNavigator from './src/navigation/RootNavigator';
import AuthScreen from './src/screens/auth/AuthScreen';
import { authService } from './src/services/authService';
import { useStore } from './src/store/useStore';
import { setAuthToken } from './src/services/api';

const PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';

// Token cache using SecureStore (required by Clerk Expo)
const tokenCache = {
  async getToken(key: string) {
    return SecureStore.getItemAsync(key);
  },
  async saveToken(key: string, value: string) {
    return SecureStore.setItemAsync(key, value);
  },
};

function AppInner(): React.JSX.Element {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const setUser = useStore((s) => s.setUser);

  useEffect(() => {
    if (isSignedIn) {
      // Sync token to SecureStore and fetch user profile
      getToken().then(async (token) => {
        if (token) {
          await setAuthToken(token);
          try {
            const user = await authService.getMe();
            setUser(user);
          } catch (e) {
            console.error('Failed to fetch user', e);
          }
        }
      });
    }
  }, [isSignedIn]);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f1a' }}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      {<RootNavigator />}
    </NavigationContainer>
  );
}

export default function App(): React.JSX.Element {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <AppInner />
    </ClerkProvider>
  );
}
