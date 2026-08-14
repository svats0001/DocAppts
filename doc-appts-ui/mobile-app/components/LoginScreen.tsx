import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const DEMO_EMAIL = 'demo@docappts.com';
const DEMO_PASSWORD = 'password123';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both your email and password.');
      return;
    }

    if (email.toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      setError('');
      login();
      router.replace('/');
      return;
    }

    setError('Invalid login. Try demo@docappts.com with password123.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.loginContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.loginCard}>
          <Link href="/" asChild>
            <TouchableOpacity>
              <Text style={styles.brand}>DocAppts</Text>
            </TouchableOpacity>
          </Link>
          <Text style={styles.loginTitle}>Sign in to continue</Text>
          <Text style={styles.loginSubtitle}>
            Access your appointments and book clinics from your phone.
          </Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#7b8ba3"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              if (error) setError('');
            }}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#7b8ba3"
            value={password}
            onChangeText={(value) => {
              setPassword(value);
              if (error) setError('');
            }}
            style={styles.input}
            secureTextEntry
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.primaryButtonText}>Log in</Text>
          </TouchableOpacity>

          <Link href="/register" asChild>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Create an account</Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              setEmail(DEMO_EMAIL);
              setPassword(DEMO_PASSWORD);
            }}
          >
            <Text style={styles.secondaryButtonText}>Use demo credentials</Text>
          </TouchableOpacity>

          <Link href="/" asChild>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Back to home</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#edf4ff',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#edf4ff',
  },
  loginCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: '#dfeaf9',
    shadowColor: '#94a3b8',
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  brand: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0b4a7a',
  },
  loginTitle: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  loginSubtitle: {
    marginTop: 8,
    marginBottom: 16,
    color: '#64748b',
    fontSize: 15,
    lineHeight: 22,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dce7f5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 10,
    color: '#0f172a',
    backgroundColor: '#f9fbff',
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: '#0b4a7a',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#0b4a7a',
    fontWeight: '600',
  },
  errorText: {
    marginTop: 8,
    color: '#dc2626',
    fontSize: 13,
  },
});
