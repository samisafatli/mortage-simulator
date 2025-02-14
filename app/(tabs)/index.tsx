import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const theme = useColorScheme();
  const isDark = theme === 'dark';
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
    <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>🏡 Mortgage Simulator</Text>
    <Text style={[styles.subtitle, { color: isDark ? '#DDD' : '#333' }]}>
      Calcule seu financiamento de forma rápida e fácil!
    </Text>

    <TouchableOpacity
      style={[styles.button, { backgroundColor: isDark ? '#2E86DE' : '#1A73E8' }]}
      onPress={() => router.push('/loan/form')}
    >
      <Text style={styles.buttonText}>➕ Nova Simulação</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.buttonSecondary, { backgroundColor: isDark ? '#444' : '#333' }]}
      onPress={() => router.push('/loan/saved')}
    >
      <Text style={styles.buttonText}>📂 Simulações Salvas</Text>
    </TouchableOpacity>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#2E86DE',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
