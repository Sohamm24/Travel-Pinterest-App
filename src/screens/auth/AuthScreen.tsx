import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSignIn, useSignUp } from '@clerk/clerk-expo';
import { setAuthToken } from '../../services/api';

export default function AuthScreen(): React.JSX.Element {
  const [isLogin, setIsLogin] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const { signIn, setActive: setSignInActive, isLoaded: siLoaded } = useSignIn();
  const { signUp, setActive: setSignUpActive, isLoaded: suLoaded } = useSignUp();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        if (!siLoaded) return;
        const result = await signIn.create({ identifier: email, password });
        if (result.status === 'complete') {
          await setSignInActive({ session: result.createdSessionId });
          const token = await result.createdSessionId;
          if (token) await setAuthToken(token);
        }
      } else {
        if (!suLoaded) return;
        await signUp.create({ emailAddress: email, password });
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        Alert.alert('Verify Email', 'Check your email for a verification code.');
      }
    } catch (err: any) {
      Alert.alert('Error', err?.errors?.[0]?.message ?? 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Logo / branding */}
        <Text style={styles.logo}>✈️</Text>
        <Text style={styles.appName}>TravelPin</Text>
        <Text style={styles.tagline}>Discover extraordinary local experiences</Text>

        {/* Toggle */}
        <View style={styles.toggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, isLogin && styles.toggleActive]}
            onPress={() => setIsLogin(true)}
          >
            <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, !isLogin && styles.toggleActive]}
            onPress={() => setIsLogin(false)}
          >
            <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#555"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#555"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={[styles.authBtn, loading && styles.authBtnDisabled]}
            onPress={handleAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.authBtnText}>
                {isLogin ? '🔑 Sign In' : '🚀 Create Account'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          By continuing you agree to our Terms & Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f1a' },
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 16 },
  logo: { fontSize: 64, textAlign: 'center' },
  appName: { color: '#fff', fontSize: 32, fontWeight: '900', textAlign: 'center', letterSpacing: 1 },
  tagline: { color: '#888', fontSize: 14, textAlign: 'center' },
  toggle: {
    flexDirection: 'row',
    backgroundColor: '#16162a',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#2a2a40',
  },
  toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  toggleActive: { backgroundColor: '#6C63FF' },
  toggleText: { color: '#888', fontWeight: '700', fontSize: 14 },
  toggleTextActive: { color: '#fff' },
  form: { gap: 12 },
  input: {
    backgroundColor: '#16162a', borderRadius: 12, padding: 14,
    color: '#fff', fontSize: 15, borderWidth: 1, borderColor: '#2a2a40',
  },
  authBtn: {
    backgroundColor: '#6C63FF', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginTop: 4,
  },
  authBtnDisabled: { opacity: 0.6 },
  authBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  footer: { color: '#444', fontSize: 11, textAlign: 'center' },
});
