import { Link } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AppHeader() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <View style={styles.header}>
      <Link href="/" asChild>
        <TouchableOpacity>
          <Text style={styles.brand}>DocAppts</Text>
        </TouchableOpacity>
      </Link>

      <View style={styles.headerActions}>
        <Link href="/register/practice" asChild>
          <TouchableOpacity>
            <Text style={styles.headerLink}>List your practice</Text>
          </TouchableOpacity>
        </Link>

        {isLoggedIn ? (
          <TouchableOpacity onPress={logout}>
            <Text style={styles.headerLink}>Logout</Text>
          </TouchableOpacity>
        ) : (
          <Link href="/login" asChild>
            <TouchableOpacity>
              <Text style={styles.headerLink}>Login</Text>
            </TouchableOpacity>
          </Link>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0b4a7a',
  },
  brand: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerLink: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
});
