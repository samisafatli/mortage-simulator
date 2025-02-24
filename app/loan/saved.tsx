import { View, Text, StyleSheet } from 'react-native';

export default function LoanFormScreen() {


  return (
    <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <Text style={[styles.title, { color: '#000' }]}>📊 Nova Simulação</Text>
      <Text style={{ color: '#333' }}>
        Formulário de entrada de dados será implementado aqui.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
});
