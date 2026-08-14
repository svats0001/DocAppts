import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
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
import { Picker } from '@react-native-picker/picker';

const locations = [
  '12 Marine Parade, Brighton',
  '88 St Kilda Rd, Melbourne',
  '5 Collins Street, Melbourne',
  '120 Collins Street, Melbourne',
  '50 Queen Street, Melbourne',
];

const specialties = ['General Practitioner', 'Endocrinologist', 'Iron Infusions'];
const billings = ['Bulk billed', 'Mixed', 'No bulk billing'];

export default function CreatePracticeScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [billing, setBilling] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const nextErrors: string[] = [];
    if (!name.trim()) nextErrors.push('Name is required.');
    if (!address.trim()) nextErrors.push('Address is required.');
    if (!description.trim()) nextErrors.push('Description is required.');
    if (!phone.trim()) nextErrors.push('Phone is required.');
    if (!specialty.trim()) nextErrors.push('Specialty is required.');
    if (!billing.trim()) nextErrors.push('Billing option is required.');
    if (!email.trim() || !email.includes('@')) nextErrors.push('Valid email is required.');
    if (!password.trim() || password.length < 8) nextErrors.push('Password must be at least 8 characters.');
    if (password !== confirmPassword) nextErrors.push('Passwords must match.');
    setErrors(nextErrors);
    return nextErrors.length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
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
            <Text style={styles.title}>List your practice</Text>
            <Text style={styles.subtitle}>Create a practice profile so patients can book online.</Text>

            {success ? (
              <View style={styles.successBox}>
                <Text style={styles.successTitle}>Practice created!</Text>
                <Text style={styles.successText}>Your practice has been listed successfully.</Text>
                <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/')}>
                  <Text style={styles.primaryButtonText}>Return home</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput value={name} onChangeText={setName} placeholder="Practice name" placeholderTextColor="#7b8ba3" style={styles.input} />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Address</Text>
                  <TextInput value={address} onChangeText={setAddress} placeholder="Practice address" placeholderTextColor="#7b8ba3" style={styles.input} />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Short practice description"
                    placeholderTextColor="#7b8ba3"
                    style={[styles.input, styles.textArea]}
                    multiline
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Phone</Text>
                  <TextInput value={phone} onChangeText={setPhone} placeholder="Phone number" placeholderTextColor="#7b8ba3" style={styles.input} keyboardType="phone-pad" />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Specialty</Text>
                  <View style={styles.pickerWrap}>
                    <Picker
                      selectedValue={specialty}
                      onValueChange={(value: string) => setSpecialty(value)}
                      style={styles.picker}
                      itemStyle={styles.pickerItem}
                    >
                      <Picker.Item label="Select specialty" value="" />
                      {specialties.map((option) => (
                        <Picker.Item label={option} value={option} key={option} />
                      ))}
                    </Picker>
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Billing</Text>
                  <View style={styles.pickerWrap}>
                    <Picker
                      selectedValue={billing}
                      onValueChange={(value: string) => setBilling(value)}
                      style={styles.picker}
                      itemStyle={styles.pickerItem}
                    >
                      <Picker.Item label="Select billing option" value="" />
                      {billings.map((option) => (
                        <Picker.Item label={option} value={option} key={option} />
                      ))}
                    </Picker>
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor="#7b8ba3" style={styles.input} keyboardType="email-address" autoCapitalize="none" />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput value={password} onChangeText={setPassword} placeholder="Password" placeholderTextColor="#7b8ba3" style={styles.input} secureTextEntry />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Confirm password</Text>
                  <TextInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm password" placeholderTextColor="#7b8ba3" style={styles.input} secureTextEntry />
                </View>

                {errors.length > 0 && (
                  <View style={styles.errorBox}>
                    {errors.map((error) => (
                      <Text key={error} style={styles.errorText}>
                        {error}
                      </Text>
                    ))}
                  </View>
                )}

                <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
                  <Text style={styles.primaryButtonText}>Create practice</Text>
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
  pickerWrap: {
    borderWidth: 1,
    borderColor: '#dce7f5',
    borderRadius: 12,
    backgroundColor: '#f9fbff',
  },
  picker: {
    color: '#0f172a',
    minHeight: 50,
  },
  pickerItem: {
    color: '#0f172a',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
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
