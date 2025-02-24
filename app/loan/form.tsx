import React, { useState, useRef } from 'react';
import { View, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, Button, RadioButton, PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { styles } from "../src/styles/form.styles";

export default function LoanFormScreen() {
  const router = useRouter();

  const [amortizationSystem, setAmortizationSystem] = useState<'price' | 'sac'>('sac');
  const [propertyValue, setPropertyValue] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState<string>('');

  const downPaymentRef = useRef<TextInput>(null);
  const interestRateRef = useRef<TextInput>(null);
  const loanTermRef = useRef<TextInput>(null);

  const formatCurrency = (value: string) => {
    let num = value.replace(/\D/g, '');
    num = num.replace(/^0+/, '');
    return num ? `R$ ${parseFloat(num).toLocaleString('pt-BR')}` : '';
  };

  const formatInterestRate = (value: string) => {
    let cleanedValue = value.replace(/[^\d,]/g, '');
    if (cleanedValue.includes(',')) {
      cleanedValue = cleanedValue.replace(/,+/g, ',');
      const parts = cleanedValue.split(',');
      cleanedValue = `${parts[0]},${parts[1]?.slice(0, 2) || ''}`;
    }
    return cleanedValue ? `${cleanedValue}%` : '';
  };

  const formatLoanTerm = (value: string) => {
    let num = value.replace(/\D/g, '');
    let numericValue = num ? Math.min(Math.max(parseInt(num, 10), 1), 40) : '';
    return numericValue ? `${numericValue} anos` : '';
  };

  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case 'propertyValue': setPropertyValue(formatCurrency(value)); break;
      case 'downPayment': setDownPayment(formatCurrency(value)); break;
      case 'interestRate': setInterestRate(formatInterestRate(value)); break;
      case 'loanTerm': setLoanTerm(formatLoanTerm(value)); break;
    }
  };

  const handleCalculate = () => {
    const propertyNum = parseFloat(propertyValue.replace(/\D/g, '')) || 0;
    const downPaymentNum = parseFloat(downPayment.replace(/\D/g, '')) || 0;
    const interestNum = parseFloat(interestRate.replace('%', '').replace(',', '.')) || 0;
    const termNum = parseInt(loanTerm.replace(/\D/g, ''), 10) || 0;

    if (propertyNum <= 0 || downPaymentNum < 0 || interestNum <= 0 || interestNum > 50 || termNum < 1 || termNum > 40) {
      alert("Preencha os campos corretamente!");
      return;
    }

    router.push({
      pathname: '/loan/summary',
      params: {
        propertyValue: propertyNum.toString(),
        downPayment: downPaymentNum.toString(),
        interestRate: interestNum.toString(),
        loanTerm: termNum.toString(),
        amortizationSystem,
      }
    });
  };

  return (
    <PaperProvider>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text variant="headlineLarge" style={[styles.title, { color: '#000' }]}>
            Amortiza+
          </Text>

          <View style={{ marginBottom: 20 }}>
            <Text variant="titleMedium" style={{ color: '#000' }}>Sistema de Amortização</Text>
            <RadioButton.Group
              onValueChange={(value) => setAmortizationSystem(value as 'price' | 'sac')}
              value={amortizationSystem}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <RadioButton value="sac" color={'#000'} />
                  <Text style={{ color: '#000' }}>SAC</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                  <RadioButton value="price" color={'#000'} />
                  <Text style={{ color: '#000' }}>Price</Text>
                </View>
              </View>
            </RadioButton.Group>
          </View>

          <TextInput
            keyboardType="numeric"
            value={propertyValue}
            onChangeText={(value) => handleInputChange('propertyValue', value)}
            style={[styles.input, { backgroundColor: '#FFF', color: '#000' }]}
            placeholder="Valor do imóvel"
          />

          <TextInput
            ref={downPaymentRef}
            keyboardType="numeric"
            value={downPayment}
            onChangeText={(value) => handleInputChange('downPayment', value)}
            style={[styles.input, { backgroundColor: '#FFF', color: '#000' }]}
            placeholder="Valor da entrada"
          />

          <TextInput
            ref={interestRateRef}
            keyboardType="numeric"
            value={interestRate}
            onChangeText={(value) => handleInputChange('interestRate', value)}
            style={[styles.input, { backgroundColor: '#FFF', color: '#000' }]}
            placeholder="Taxa de juros anual (%)"
          />

          <TextInput
            ref={loanTermRef}
            keyboardType="numeric"
            value={loanTerm}
            onChangeText={(value) => handleInputChange('loanTerm', value)}
            style={[styles.input, { backgroundColor: '#FFF', color: '#000' }]}
            placeholder="Prazo do financiamento (anos)"
          />

          <Button mode="contained" onPress={handleCalculate} style={styles.button}>
            📊 Calcular Financiamento
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}
