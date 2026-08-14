import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const practiceSchedules: Record<number, Record<string, string[]>> = {
  1: {
    '2026-08-12': ['9:00 AM', '9:30 AM', '10:15 AM', '11:00 AM'],
    '2026-08-13': ['9:15 AM', '10:30 AM', '1:00 PM'],
    '2026-08-14': ['8:45 AM', '11:30 AM', '2:15 PM', '4:00 PM'],
    '2026-08-15': ['9:00 AM', '10:00 AM', '3:30 PM'],
    '2026-08-16': ['8:30 AM', '2:00 PM', '5:15 PM'],
    '2026-08-17': ['9:45 AM', '12:15 PM', '3:45 PM'],
    '2026-08-18': ['10:00 AM', '11:45 AM', '4:30 PM'],
  },
  2: {
    '2026-08-12': ['8:30 AM', '11:15 AM'],
    '2026-08-13': ['9:00 AM', '10:45 AM', '2:30 PM'],
    '2026-08-14': ['8:00 AM', '1:00 PM', '4:15 PM'],
    '2026-08-15': ['9:30 AM', '12:00 PM'],
    '2026-08-16': ['10:15 AM', '3:45 PM'],
    '2026-08-17': ['8:45 AM', '11:00 AM', '5:00 PM'],
    '2026-08-18': ['9:15 AM', '1:30 PM', '3:00 PM'],
  },
  3: {
    '2026-08-12': ['9:30 AM', '11:00 AM', '1:45 PM'],
    '2026-08-13': ['8:15 AM', '10:00 AM', '3:15 PM'],
    '2026-08-14': ['9:45 AM', '2:00 PM', '5:30 PM'],
    '2026-08-15': ['8:30 AM', '12:15 PM'],
    '2026-08-16': ['10:30 AM', '1:00 PM', '4:45 PM'],
    '2026-08-17': ['9:00 AM', '2:15 PM', '4:30 PM'],
    '2026-08-18': ['11:00 AM', '2:45 PM'],
  },
};

const practiceNames: Record<number, string> = {
  1: 'Brighton Family Clinic',
  2: 'Northside Specialist Care',
  3: 'Harbour Health Hub',
};

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(date: Date) {
  return date.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function AppointmentTableScreen() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const practiceId = Number(id ?? '1');
  const practiceName = practiceNames[practiceId] ?? 'Clinic';

  const dates = useMemo(() => {
    const start = new Date();
    return Array.from({ length: 7 }, (_, index) => addDays(start, index));
  }, []);

  const [dateOffset, setDateOffset] = useState(0);
  const [warningMessage, setWarningMessage] = useState('');
  const maxVisibleColumns = 3;

  const visibleDates = dates.slice(dateOffset, dateOffset + maxVisibleColumns);
  const scheduleMap = practiceSchedules[practiceId] ?? practiceSchedules[1];

  const maxRows = useMemo(() => {
    return Math.max(
      1,
      ...visibleDates.map((date) => (scheduleMap[formatDateKey(date)] ?? []).length)
    );
  }, [scheduleMap, visibleDates]);

  const handleSelectSlot = (date: Date, slot: string) => {
    if (!isLoggedIn) {
      const message = 'You must be logged in to book an appointment. Please log in first.';
      setWarningMessage(message);
      Alert.alert(
        'Login required',
        message,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/login') },
        ]
      );
      return;
    }

    setWarningMessage('');
    router.push({
      pathname: '/book-appointment',
      params: {
        id: String(practiceId),
        date: formatDateKey(date),
        slot,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Available appointments</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Text style={styles.practiceName}>{practiceName}</Text>
          <Text style={styles.summaryText}>Choose a time that suits you.</Text>
        </View>

        <View style={styles.tableNav}>
          <TouchableOpacity
            style={[styles.navButton, dateOffset === 0 && styles.navButtonDisabled]}
            onPress={() => setDateOffset((current) => Math.max(0, current - maxVisibleColumns))}
            disabled={dateOffset === 0}
          >
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              dateOffset + maxVisibleColumns >= dates.length && styles.navButtonDisabled,
            ]}
            onPress={() => setDateOffset((current) => Math.min(dates.length - maxVisibleColumns, current + maxVisibleColumns))}
            disabled={dateOffset + maxVisibleColumns >= dates.length}
          >
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        </View>

        {warningMessage ? (
          <View style={styles.warningBanner}>
            <Text style={styles.warningText}>{warningMessage}</Text>
          </View>
        ) : null}

        <View style={styles.tableWrap}>
          <View style={styles.tableHeaderRow}>
            {visibleDates.map((date) => (
              <View key={formatDateKey(date)} style={styles.dateColumnHeader}>
                <Text style={styles.dateHeaderText}>{formatDisplayDate(date)}</Text>
              </View>
            ))}
          </View>

          {Array.from({ length: maxRows }).map((_, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.tableRow}>
              {visibleDates.map((date) => {
                const dateKey = formatDateKey(date);
                const slots = scheduleMap[dateKey] ?? [];
                const slot = slots[rowIndex];

                if (!slot) {
                  return <View key={`${dateKey}-${rowIndex}`} style={styles.emptySlot} />;
                }

                return (
                  <TouchableOpacity
                    key={`${dateKey}-${slot}`}
                    style={styles.slotButton}
                    onPress={() => handleSelectSlot(date, slot)}
                  >
                    <Text style={styles.slotText}>{slot}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
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
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#dfeaf9',
  },
  practiceName: {
    color: '#0f172a',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  summaryText: {
    color: '#64748b',
    fontSize: 14,
  },
  tableNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 12,
  },
  navButton: {
    backgroundColor: '#0b4a7a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  navButtonDisabled: {
    backgroundColor: '#cbd5e1',
  },
  navButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  tableWrap: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#dfeaf9',
    marginBottom: 24,
  },
  warningBanner: {
    backgroundColor: '#ffefeb',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#f97316',
    padding: 12,
    marginBottom: 14,
  },
  warningText: {
    color: '#b45309',
    fontWeight: '700',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#eaf3ff',
  },
  dateColumnHeader: {
    flex: 1,
    minHeight: 72,
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: '#dfeaf9',
    justifyContent: 'center',
  },
  dateHeaderText: {
    color: '#0b4a7a',
    fontWeight: '800',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#edf3fb',
  },
  slotButton: {
    flex: 1,
    minHeight: 62,
    borderRightWidth: 1,
    borderRightColor: '#edf3fb',
    backgroundColor: '#f9fbff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  emptySlot: {
    flex: 1,
    minHeight: 62,
    borderRightWidth: 1,
    borderRightColor: '#edf3fb',
    backgroundColor: '#ffffff',
  },
  slotText: {
    color: '#0b4a7a',
    fontWeight: '700',
    textAlign: 'center',
  },
});
