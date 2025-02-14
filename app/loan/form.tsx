import { useState } from 'react';
import { View, StyleSheet, useColorScheme, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, TextInput, Button, RadioButton, MD3DarkTheme, MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';

export default function LoanFormScreen() {
  const theme = useColorScheme();
  const isDark = theme === 'dark';
  const router = useRouter();

  const [propertyValue, setPropertyValue] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [amortizationSystem, setAmortizationSystem] = useState<'price' | 'sac'>('price');

  const formatPercentage = (text: string) => {
    let formattedText = text.replace(/[^0-9,]/g, '');
    if (formattedText.length > 0 && !formattedText.includes('%')) {
      formattedText += '%';
    }
    setInterestRate(formattedText);
  };

  const handleCalculate = () => {
    if (!propertyValue || !downPayment || !interestRate || !loanTerm) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos!');
      return;
    }

    const cleanPropertyValue = parseFloat(propertyValue.replace(/\D/g, '')) / 100;
    const cleanDownPayment = parseFloat(downPayment.replace(/\D/g, '')) / 100;
    const cleanInterestRate = parseFloat(interestRate.replace('%', '').replace(',', '.'));
    const cleanLoanTerm = parseInt(loanTerm, 10);

    const loanAmount = cleanPropertyValue - cleanDownPayment;
    if (loanAmount <= 0) {
      Alert.alert('Erro', 'O valor da entrada deve ser menor que o valor do imóvel.');
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
        <Text variant="titleLarge" style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>
          🏡 Simulação de Financiamento
        </Text>

        <TextInput
          label="Valor do Imóvel (R$)"
          mode="outlined"
          keyboardType="numeric"
          value={propertyValue}
          onChangeText={setPropertyValue}
          style={styles.input}
          theme={{ colors: { background: isDark ? '#333' : '#F5F5F5' } }}
        />

        <TextInput
          label="Valor da Entrada (R$)"
          mode="outlined"
          keyboardType="numeric"
          value={downPayment}
          onChangeText={setDownPayment}
          style={styles.input}
          theme={{ colors: { background: isDark ? '#333' : '#F5F5F5' } }}
        />

        <TextInput
          label="Taxa de Juros Anual (%)"
          mode="outlined"
          keyboardType="numeric"
          value={interestRate}
          onChangeText={formatPercentage}
          style={styles.input}
          theme={{ colors: { background: isDark ? '#333' : '#F5F5F5' } }}
        />

        <TextInput
          label="Prazo do Financiamento (anos)"
          mode="outlined"
          keyboardType="numeric"
          value={loanTerm}
          onChangeText={setLoanTerm}
          style={styles.input}
          theme={{ colors: { background: isDark ? '#333' : '#F5F5F5' } }}
        />

        <View style={styles.radioContainer}>
          <Text style={[styles.radioLabel, { color: isDark ? '#FFF' : '#000' }]}>Sistema de Amortização:</Text>
          <RadioButton.Group onValueChange={(value) => setAmortizationSystem(value as 'price' | 'sac')} value={amortizationSystem}>
            <View style={styles.radioOption}>
              <RadioButton value="price" color={isDark ? '#2E86DE' : '#1A73E8'} />
              <Text style={{ color: isDark ? '#FFF' : '#000' }}>Sistema Price</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="sac" color={isDark ? '#2E86DE' : '#1A73E8'} />
              <Text style={{ color: isDark ? '#FFF' : '#000' }}>Sistema SAC</Text>
            </View>
          </RadioButton.Group>
        </View>

        <Button
          mode="contained"
          onPress={handleCalculate}
          style={styles.button}
          labelStyle={styles.buttonText}
          buttonColor={isDark ? '#2E86DE' : '#1A73E8'}
        >
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
    marginBottom: 15,
    backgroundColor: 'transparent',
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
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
