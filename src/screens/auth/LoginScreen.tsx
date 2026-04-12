import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSSO } from '@clerk/clerk-expo';
import { useWarmUpBrowser } from '../../hooks/useWarmUpBrowser';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

import * as AuthSession from 'expo-auth-session';

export default function LoginScreen() {
  useWarmUpBrowser();

  const { colors } = useTheme();

  const { startSSOFlow } = useSSO();

  const onPressGoogle = useCallback(async () => {
    console.log('[Auth] Attempting Google SSO...');
    try {
      // makeRedirectUri securely resolves development/production scheme boundaries
      const redirectUrl = AuthSession.makeRedirectUri({ 
        scheme: 'travelpinterest',
        path: 'oauth-callback' 
      });
      console.log('[Auth] Generated Redirect URL for Clerk:', redirectUrl);

      // We wrap it in a log to see if startSSOFlow actually returns or gets stuck
      console.log('[Auth] Calling startSSOFlow() with Google strategy...');
      const response = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl
      });
      
      console.log('[Auth] startSSOFlow() completed successfully! Response keys:', Object.keys(response));
      
      const { createdSessionId, setActive, signIn, signUp } = response;

      if (createdSessionId) {
        console.log('[Auth] Success! Got createdSessionId:', createdSessionId);
        setActive!({ session: createdSessionId });
      } else {
        // If it isn't an instant session, it might be a multi-step login (e.g., signup)
        console.log('[Auth] Sign-in attempt returned no createdSessionId.');
        console.log('[Auth] signIn status:', signIn?.status, '| signUp status:', signUp?.status);
      }
    } catch (err) {
      console.error('[Auth] OAuth completely failed/rejected. Error details:', JSON.stringify(err, null, 2));
    }
  }, [startSSOFlow]);

  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.card}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Welcome to TravelPinterest
        </Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Discover the world's most amazing destinations.
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={onPressGoogle}
        >
          <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    padding: spacing.xl,
    borderRadius: spacing.md,
    gap: spacing.md,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.xxl,
    fontWeight: typography.bold,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.md,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  button: {
    padding: spacing.md,
    borderRadius: spacing.sm,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#000',
    fontSize: typography.md,
    fontWeight: typography.bold,
  },
});

