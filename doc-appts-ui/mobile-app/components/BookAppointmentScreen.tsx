import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';

const practiceNames: Record<number, string> = {
  1: 'Brighton Family Clinic',
  2: 'Northside Specialist Care',
  3: 'Harbour Health Hub',
};

const practitionerNames: Record<number, string> = {
  1: 'Dr. Amelia Ross',
  2: 'Dr. Daniel Singh',
  3: 'Dr. Rachel Kim',
};

const billingLabels: Record<number, string> = {
  1: 'Bulk billed',
  2: 'Mixed billing',
  3: 'No bulk billing',
};

function formatDateLabel(dateValue?: string) {
  if (!dateValue) return 'Select a date';

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;

  return date.toLocaleDateString('en-AU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function BookAppointmentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; date?: string; slot?: string }>();
  const practiceId = Number(params.id ?? '1');
  const practiceName = practiceNames[practiceId] ?? 'Clinic';
  const practitionerName = practitionerNames[practiceId] ?? 'Dr. available practitioner';
  const slot = params.slot ?? '9:00 AM';
  const date = params.date ?? new Date().toISOString();
  const billing = billingLabels[practiceId] ?? 'Bulk billed';

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [mfaCode, setMfaCode] = useState('');

  const handleBook = () => {
    Alert.alert(
      'Appointment booked',
      `${practiceName}\n${practitionerName}\n${formatDateLabel(date)}\n${slot}`,
      [
        { text: 'Back to search', onPress: () => router.push('/') },
        { text: 'OK' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book appointment</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Text style={styles.practiceName}>{practiceName}</Text>
          <Text style={styles.practitioner}>{practitionerName}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{formatDateLabel(date)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Time</Text>
            <Text style={styles.value}>{slot}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Billing</Text>
            <Text style={styles.value}>{billing}</Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Payment details</Text>

          <TextInput
            placeholder="Name on card"
            value={cardName}
            onChangeText={setCardName}
            style={styles.input}
            placeholderTextColor="#7b8ba3"
          />

          <TextInput
            placeholder="Card number"
            value={cardNumber}
            onChangeText={setCardNumber}
            keyboardType="number-pad"
            style={styles.input}
            placeholderTextColor="#7b8ba3"
          />

          <TextInput
            placeholder="MFA code"
            value={mfaCode}
            onChangeText={setMfaCode}
            keyboardType="number-pad"
            style={styles.input}
            placeholderTextColor="#7b8ba3"
          />
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleBook}>
          <Text style={styles.primaryButtonText}>Confirm booking</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#edf4ff',
  },
  header: {
    backgroundColor: '#0b4a7a',
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  headerTitle: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 18,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dfeaf9',
    padding: 18,
    marginBottom: 16,
  },
  practiceName: {
    color: '#0f172a',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  practitioner: {
    color: '#0b4a7a',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#edf3fb',
  },
  label: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  value: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dfeaf9',
    padding: 18,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dce7f5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: '#f9fbff',
    color: '#0f172a',
  },
  primaryButton: {
    backgroundColor: '#0b4a7a',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
  },
});
