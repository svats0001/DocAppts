import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Practice = {
  id: number;
  name: string;
  specialty: string;
  address: string;
  billing: string;
  distance: string;
  rating: number;
  nextAvailable: string;
};

const practices: Practice[] = [
  {
    id: 1,
    name: 'Brighton Family Clinic',
    specialty: 'General Practitioner',
    address: '12 Marine Parade, Brighton',
    billing: 'Bulk billed',
    distance: '2.4 km',
    rating: 4.8,
    nextAvailable: 'Today · 3:30 PM',
  },
  {
    id: 2,
    name: 'Northside Specialist Care',
    specialty: 'Endocrinologist',
    address: '88 St Kilda Rd, Melbourne',
    billing: 'Mixed',
    distance: '4.8 km',
    rating: 4.7,
    nextAvailable: 'Tomorrow · 9:00 AM',
  },
  {
    id: 3,
    name: 'Harbour Health Hub',
    specialty: 'Iron Infusions',
    address: '5 Collins Street, Melbourne',
    billing: 'No bulk billing',
    distance: '1.1 km',
    rating: 4.9,
    nextAvailable: 'Today · 6:15 PM',
  },
];

const specialties = ['All', 'General Practitioner', 'Endocrinologist', 'Iron Infusions'];
const locations = ['All', 'Melbourne', 'Brighton', 'Frankston'];
const tabs = ['Appointments', 'Profile'];

export default function HomeScreen() {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Discover');
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');

  const filteredPractices = useMemo(() => {
    return practices.filter((practice) => {
      const matchesSearch = `${practice.name} ${practice.specialty}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesSpecialty =
        selectedSpecialty === 'All' || practice.specialty === selectedSpecialty;
      const matchesLocation =
        selectedLocation === 'All' || practice.address.toLowerCase().includes(selectedLocation.toLowerCase());

      return matchesSearch && matchesSpecialty && matchesLocation;
    });
  }, [search, selectedSpecialty, selectedLocation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Find care near you</Text>
          <Text style={styles.heroText}>
            Search for trusted clinics, compare availability and book in minutes.
          </Text>
          <View style={styles.searchBox}>
            <TextInput
              placeholder="Search doctor or clinic"
              placeholderTextColor="#7b8ba3"
              value={search}
              onChangeText={setSearch}
              style={styles.input}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Location</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {locations.map((location) => {
            const selected = location === selectedLocation;
            return (
              <TouchableOpacity
                key={location}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => setSelectedLocation(location)}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{location}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.sectionTitle}>Specialty</Text>
        <View style={styles.chipWrap}>
          {specialties.map((specialty) => {
            const selected = specialty === selectedSpecialty;
            return (
              <TouchableOpacity
                key={specialty}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => setSelectedSpecialty(specialty)}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{specialty}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Featured clinics</Text>
        {filteredPractices.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No clinics matched that search.</Text>
            <Text style={styles.emptyText}>Try a broader keyword or switch the filter.</Text>
          </View>
        ) : (
          filteredPractices.map((practice) => (
            <View key={practice.id} style={styles.card}>
              <View style={styles.cardTopRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{practice.name}</Text>
                  <Text style={styles.cardMeta}>{practice.specialty}</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{practice.billing}</Text>
                </View>
              </View>

              <Text style={styles.address}>{practice.address}</Text>

              <View style={styles.cardFooter}>
                <Text style={styles.rating}>⭐ {practice.rating.toFixed(1)}</Text>
                <Text style={styles.distance}>{practice.distance}</Text>
              </View>

              <Text style={styles.nextAvailable}>Next available: {practice.nextAvailable}</Text>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => router.push({ pathname: '/appointment-table', params: { id: String(practice.id) } })}
              >
                <Text style={styles.primaryButtonText}>Book appointment</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {isLoggedIn ? (
        <View style={styles.tabBar}>
          {tabs.map((tab) => {
            const selected = tab === activeTab;
            return (
              <TouchableOpacity key={tab} style={styles.tabItem} onPress={() => setActiveTab(tab)}>
                <Text style={[styles.tabText, selected && styles.tabTextSelected]}>{tab}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#edf4ff',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    marginTop: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#dfeaf9',
    shadowColor: '#94a3b8',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  heroTitle: {
    color: '#0b4a7a',
    fontSize: 22,
    fontWeight: '700',
  },
  heroText: {
    marginTop: 8,
    color: '#48627c',
    fontSize: 15,
    lineHeight: 22,
  },
  searchBox: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#dce7f5',
  },
  input: {
    color: '#0f172a',
    fontSize: 15,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 14,
    marginBottom: 10,
  },
  chipRow: {
    gap: 8,
    paddingRight: 4,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#eef5ff',
    borderWidth: 1,
    borderColor: '#d8e5f6',
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: '#0b4a7a',
  },
  chipText: {
    color: '#334155',
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e6edf7',
    shadowColor: '#94a3b8',
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  cardMeta: {
    marginTop: 4,
    color: '#64748b',
    fontSize: 13,
  },
  badge: {
    backgroundColor: '#def7ec',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    color: '#0f766e',
    fontSize: 12,
    fontWeight: '700',
  },
  address: {
    marginTop: 10,
    color: '#334155',
    fontSize: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  rating: {
    color: '#f59e0b',
    fontWeight: '700',
  },
  distance: {
    color: '#64748b',
  },
  nextAvailable: {
    marginTop: 8,
    color: '#0f4c81',
    fontWeight: '600',
  },
  primaryButton: {
    marginTop: 12,
    backgroundColor: '#0b4a7a',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 16,
  },
  emptyText: {
    color: '#64748b',
    marginTop: 6,
    textAlign: 'center',
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#0b4a7a',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#0a3d6d',
    shadowColor: '#0b4a7a',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
  },
  tabItem: {
    paddingHorizontal: 16,
  },
  tabText: {
    color: '#eaf4ff',
    fontWeight: '600',
  },
  tabTextSelected: {
    color: '#ffffff',
  },
});
