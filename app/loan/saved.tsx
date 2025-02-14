import { View, Text, StyleSheet, useColorScheme } from 'react-native';

export default function LoanFormScreen() {
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
      <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>📊 Nova Simulação</Text>
      <Text style={{ color: isDark ? '#DDD' : '#333' }}>
        Formulário de entrada de dados será implementado aqui.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
});
