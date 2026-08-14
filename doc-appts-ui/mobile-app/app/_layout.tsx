import { Slot } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import AppHeader from '../components/AppHeader';

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaView style={styles.safeArea}>
        <AppHeader />
        <View style={styles.content}>
          <Slot />
        </View>
      </SafeAreaView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#edf4ff',
  },
  content: {
    flex: 1,
  },
});
