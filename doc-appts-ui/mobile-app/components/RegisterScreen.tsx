import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const genders = ['Male', 'Female', 'Other'];

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState('');
  const [genderOpen, setGenderOpen] = useState(false);
  const [mobile, setMobile] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const nextErrors: string[] = [];

    if (!email.trim() || !email.includes('@')) {
      nextErrors.push('Enter a valid email address.');
    }
    if (!password.trim() || password.length < 8) {
      nextErrors.push('Password must be at least 8 characters.');
    }
    if (password !== confirmPassword) {
      nextErrors.push('Passwords must match.');
    }
    if (!firstName.trim()) {
      nextErrors.push('First name is required.');
    }
    if (!lastName.trim()) {
      nextErrors.push('Last name is required.');
    }
    if (!dob.trim()) {
      nextErrors.push('Date of birth is required.');
    }
    if (!gender.trim()) {
      nextErrors.push('Gender is required.');
    }
    if (!mobile.trim() || mobile.length < 8) {
      nextErrors.push('Enter a valid mobile number.');
    }

    setErrors(nextErrors);
    return nextErrors.length === 0;
  };

  const handleRegister = () => {
    if (!validate()) {
      return;
    }

    setSuccess(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <View style={styles.brandRow}>
              <Text style={styles.brand}>DocAppts</Text>
              <Link href="/login" asChild>
                <TouchableOpacity>
                  <Text style={styles.switchLink}>Already have an account?</Text>
                </TouchableOpacity>
              </Link>
            </View>

            {success ? (
              <View style={styles.successBox}>
                <Text style={styles.successTitle}>Account created!</Text>
                <Text style={styles.successText}>Your account has been registered successfully.</Text>
                <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/login')}>
                  <Text style={styles.primaryButtonText}>Continue to login</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.title}>Create new account</Text>
                <Text style={styles.subtitle}>Register to book appointments and manage your bookings.</Text>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    placeholderTextColor="#7b8ba3"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    placeholderTextColor="#7b8ba3"
                    style={styles.input}
                    secureTextEntry
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Confirm password</Text>
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm password"
                    placeholderTextColor="#7b8ba3"
                    style={styles.input}
                    secureTextEntry
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>First name</Text>
                  <TextInput
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="First name"
                    placeholderTextColor="#7b8ba3"
                    style={styles.input}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Last name</Text>
                  <TextInput
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Last name"
                    placeholderTextColor="#7b8ba3"
                    style={styles.input}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Date of birth</Text>
                  <TouchableOpacity
                    style={[styles.input, styles.dropdownToggle]}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={dob ? styles.inputText : styles.placeholderText}>
                      {dob || 'Select date of birth'}
                    </Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={dob ? new Date(dob) : new Date('1990-01-01')}
                      mode="date"
                      display={Platform.OS === 'android' ? 'calendar' : 'spinner'}
                      maximumDate={new Date()}
                      onChange={(_, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          const formatted = selectedDate.toISOString().split('T')[0];
                          setDob(formatted);
                        }
                      }}
                    />
                  )}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Gender</Text>
                  <TouchableOpacity
                    style={[styles.input, styles.dropdownToggle]}
                    onPress={() => setGenderOpen((open) => !open)}
                  >
                    <Text style={gender ? styles.inputText : styles.placeholderText}>
                      {gender || 'Select gender'}
                    </Text>
                  </TouchableOpacity>
                  {genderOpen && (
                    <View style={styles.dropdownList}>
                      {genders.map((option) => (
                        <TouchableOpacity
                          key={option}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setGender(option);
                            setGenderOpen(false);
                          }}
                        >
                          <Text style={styles.dropdownItemText}>{option}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Mobile</Text>
                  <TextInput
                    value={mobile}
                    onChangeText={setMobile}
                    placeholder="Mobile number"
                    placeholderTextColor="#7b8ba3"
                    style={styles.input}
                    keyboardType="phone-pad"
                  />
                </View>

                {errors.length > 0 && (
                  <View style={styles.errorBox}>
                    {errors.map((message) => (
                      <Text key={message} style={styles.errorText}>
                        {message}
                      </Text>
                    ))}
                  </View>
                )}

                <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
                  <Text style={styles.primaryButtonText}>Register</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#edf4ff',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
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
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  brand: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0b4a7a',
  },
  switchLink: {
    color: '#ffffff',
    backgroundColor: '#0b4a7a',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    fontWeight: '700',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    color: '#64748b',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  label: {
    color: '#475569',
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dce7f5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#0f172a',
    backgroundColor: '#f9fbff',
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: '#0b4a7a',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  dropdownToggle: {
    paddingVertical: 16,
    justifyContent: 'center',
  },
  dropdownList: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dce7f5',
    borderRadius: 12,
    marginTop: 8,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  dropdownItemText: {
    color: '#0f172a',
    fontSize: 15,
  },
  placeholderText: {
    color: '#94a3b8',
  },
  inputText: {
    color: '#0f172a',
  },
  errorBox: {
    marginTop: 8,
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  errorText: {
    color: '#991b1b',
    fontSize: 13,
    marginBottom: 4,
  },
  successBox: {
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0b4a7a',
    marginBottom: 10,
  },
  successText: {
    color: '#475569',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 18,
  },
});
