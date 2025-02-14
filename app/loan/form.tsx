import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Alert, TextInput } from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';
import { useRouter } from 'expo-router';

export default function LoanFormScreen() {
  const theme = useColorScheme();
  const isDark = theme === 'dark';
  const router = useRouter();

  // Estados do formulário
  const [propertyValue, setPropertyValue] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');

  // Função para formatar taxa de juros (%) corretamente
  const formatPercentage = (text: string) => {
    // Permite apenas números e vírgula
    let formattedText = text.replace(/[^0-9,]/g, '');

    // Adiciona "%" automaticamente no final
    if (formattedText.length > 0 && !formattedText.includes('%')) {
      formattedText += '%';
    }
    
    setInterestRate(formattedText);
  };

  // Função para validar e calcular o financiamento
  const handleCalculate = () => {
    if (!propertyValue || !downPayment || !interestRate || !loanTerm) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos!');
      return;
    }

    // Remover máscaras para fazer cálculos
    const cleanPropertyValue = parseFloat(propertyValue.replace(/\D/g, '')) / 100;
    const cleanDownPayment = parseFloat(downPayment.replace(/\D/g, '')) / 100;
    const cleanInterestRate = parseFloat(interestRate.replace('%', '').replace(',', '.'));
    const cleanLoanTerm = parseInt(loanTerm, 10);

    const loanAmount = cleanPropertyValue - cleanDownPayment;
    if (loanAmount <= 0) {
      Alert.alert('Erro', 'O valor da entrada deve ser menor que o valor do imóvel.');
      return;
    }

    // Passar os valores para a tela de resumo
    router.push({
      pathname: '/loan/summary',
      params: {
        propertyValue: cleanPropertyValue,
        downPayment: cleanDownPayment,
        interestRate: cleanInterestRate,
        loanTerm: cleanLoanTerm
      }
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
      <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>🏡 Simulação de Financiamento</Text>

      {/* Input - Valor do Imóvel */}
      <MaskedTextInput
        style={[styles.input, { backgroundColor: isDark ? '#333' : '#F5F5F5', color: isDark ? '#FFF' : '#000' }]}
        placeholder="Valor do imóvel (R$)"
        placeholderTextColor={isDark ? '#AAA' : '#666'}
        keyboardType="numeric"
        mask="R$ 999.999.999,99"
        value={propertyValue}
        onChangeText={setPropertyValue}
      />

      {/* Input - Valor da Entrada */}
      <MaskedTextInput
        style={[styles.input, { backgroundColor: isDark ? '#333' : '#F5F5F5', color: isDark ? '#FFF' : '#000' }]}
        placeholder="Valor da entrada (R$)"
        placeholderTextColor={isDark ? '#AAA' : '#666'}
        keyboardType="numeric"
        mask="R$ 999.999.999,99"
        value={downPayment}
        onChangeText={setDownPayment}
      />

      {/* Input - Taxa de Juros Anual */}
      <TextInput
        style={[styles.input, { backgroundColor: isDark ? '#333' : '#F5F5F5', color: isDark ? '#FFF' : '#000' }]}
        placeholder="Taxa de juros anual (%)"
        placeholderTextColor={isDark ? '#AAA' : '#666'}
        keyboardType="numeric"
        value={interestRate}
        onChangeText={formatPercentage}
      />

      {/* Input - Prazo do Financiamento */}
      <MaskedTextInput
        style={[styles.input, { backgroundColor: isDark ? '#333' : '#F5F5F5', color: isDark ? '#FFF' : '#000' }]}
        placeholder="Prazo do financiamento (anos)"
        placeholderTextColor={isDark ? '#AAA' : '#666'}
        keyboardType="numeric"
        mask="99"
        value={loanTerm}
        onChangeText={setLoanTerm}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: isDark ? '#2E86DE' : '#1A73E8' }]}
        onPress={handleCalculate}
      >
        <Text style={styles.buttonText}>📊 Calcular Financiamento</Text>
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
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '90%',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
