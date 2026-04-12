import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import RootNavigator from './src/navigation/RootNavigator';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { tokenCache } from './src/utils/tokenCache';

// Get publishable key from environment variables
const publishableKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error(
    'Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. ' +
    'Add it to your .env.local file: EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...'
  );
}

function Inner(): React.JSX.Element {
  const { theme } = useTheme();
  return (
    <>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
}

export default function App(): React.JSX.Element {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <SafeAreaProvider>
          <ThemeProvider>
            <Inner />
          </ThemeProvider>
        </SafeAreaProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}