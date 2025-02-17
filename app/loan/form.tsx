import { useState, useRef } from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, Button, RadioButton, PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { MaskedTextInput } from 'react-native-mask-text';
import debounce from 'lodash.debounce';

export default function LoanFormScreen() {
  const theme = useColorScheme();
  const isDark = theme === 'dark';
  const router = useRouter();

  const [propertyValue, setPropertyValue] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [amortizationSystem, setAmortizationSystem] = useState<'price' | 'sac'>('price');

  const debouncedSetPropertyValue = useRef(debounce((text) => setPropertyValue(text), 300)).current;
  const debouncedSetDownPayment = useRef(debounce((text) => setDownPayment(text), 300)).current;
  const debouncedSetInterestRate = useRef(debounce((text) => setInterestRate(text), 300)).current;
  const debouncedSetLoanTerm = useRef(debounce((text) => setLoanTerm(text), 300)).current;

  const handleCalculate = () => {
    if (!propertyValue || !downPayment || !interestRate || !loanTerm) {
      alert('Erro: Preencha todos os campos corretamente!');
      return;
    }

    const cleanPropertyValue = parseFloat(propertyValue.replace(/\D/g, '')) / 100;
    const cleanDownPayment = parseFloat(downPayment.replace(/\D/g, '')) / 100;
    const cleanInterestRate = parseFloat(interestRate.replace('%', '').replace(',', '.'));
    const cleanLoanTerm = parseInt(loanTerm, 10);

    const loanAmount = cleanPropertyValue - cleanDownPayment;
    if (loanAmount <= 0) {
      alert('Erro: O valor da entrada deve ser menor que o valor do imóvel.');
      return;
    }

    router.push({
      pathname: '/loan/summary',
      params: {
        propertyValue: cleanPropertyValue,
        downPayment: cleanDownPayment,
        interestRate: cleanInterestRate,
        loanTerm: cleanLoanTerm,
        amortizationSystem,
      }
    });
  };

  return (
    <PaperProvider theme={isDark ? MD3DarkTheme : MD3LightTheme}>
      <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
        <Text variant="headlineLarge" style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>
          Amortiza+
        </Text>

        <MaskedTextInput
          type="currency"
          options={{
            prefix: 'R$ ',
            decimalSeparator: ',',
            groupSeparator: '.',
            precision: 2,
          }}
          keyboardType="numeric"
          value={propertyValue}
          onChangeText={(_, rawText) => debouncedSetPropertyValue(rawText || '')}
          style={[styles.input, { backgroundColor: isDark ? '#222' : '#FFF', color: isDark ? '#FFF' : '#000' }]}
          placeholder="Valor do imóvel"
          placeholderTextColor={isDark ? '#AAA' : '#666'}
        />

        <MaskedTextInput
          type="currency"
          options={{
            prefix: 'R$ ',
            decimalSeparator: ',',
            groupSeparator: '.',
            precision: 2,
          }}
          keyboardType="numeric"
          value={downPayment}
          onChangeText={(_, rawText) => debouncedSetDownPayment(rawText || '')}
          style={[styles.input, { backgroundColor: isDark ? '#222' : '#FFF', color: isDark ? '#FFF' : '#000' }]}
          placeholder="Valor da entrada"
          placeholderTextColor={isDark ? '#AAA' : '#666'}
        />

        <MaskedTextInput
          mask="99,99%"
          keyboardType="numeric"
          value={interestRate}
          onChangeText={(_, rawText) => debouncedSetInterestRate(rawText || '')}
          style={[styles.input, { backgroundColor: isDark ? '#222' : '#FFF', color: isDark ? '#FFF' : '#000' }]}
          placeholder="Taxa de juros anual (%)"
          placeholderTextColor={isDark ? '#AAA' : '#666'}
        />

        <MaskedTextInput
          mask="99"
          keyboardType="numeric"
          value={loanTerm}
          onChangeText={(_, rawText) => debouncedSetLoanTerm(rawText || '')}
          style={[styles.input, { backgroundColor: isDark ? '#222' : '#FFF', color: isDark ? '#FFF' : '#000' }]}
          placeholder="Prazo do financiamento (anos)"
          placeholderTextColor={isDark ? '#AAA' : '#666'}
        />

        <View style={styles.radioContainer}>
          <Text style={[styles.radioLabel, { color: isDark ? '#FFF' : '#000' }]}>Sistema de Amortização:</Text>
          <RadioButton.Group onValueChange={(value) => setAmortizationSystem(value as 'price' | 'sac')} value={amortizationSystem}>
            <View style={styles.radioOption}>
              <RadioButton value="price" color={isDark ? '#4C8BF5' : '#1A73E8'} />
              <Text style={{ color: isDark ? '#FFF' : '#000' }}>Sistema Price</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="sac" color={isDark ? '#4C8BF5' : '#1A73E8'} />
              <Text style={{ color: isDark ? '#FFF' : '#000' }}>Sistema SAC</Text>
            </View>
          </RadioButton.Group>
        </View>

        <Button mode="contained" onPress={handleCalculate} style={styles.button}>
          📊 Calcular Financiamento
        </Button>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  radioContainer: {
    marginBottom: 20,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    paddingVertical: 10,
  },
});
