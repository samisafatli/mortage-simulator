import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, useColorScheme, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { Text, Button, Card, PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

import { styles } from "../src/styles/summary.styles";

type LoanInstallment = {
  month: number;
  totalPayment: number;
  interestPayment: number;
  amortization: number;
  balance: number;
};

export default function LoanSummaryScreen() {
  const theme = useColorScheme();
  const isDark = theme === 'dark';
  const router = useRouter();
  const { propertyValue, downPayment, interestRate, loanTerm, amortizationSystem } = useLocalSearchParams<{
    propertyValue: string;
    downPayment: string;
    interestRate: string;
    loanTerm: string;
    amortizationSystem: 'price' | 'sac';
  }>();

  const [schedule, setSchedule] = useState<LoanInstallment[]>([]);
  const [loanAmount, setLoanAmount] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);

  useEffect(() => {
    if (propertyValue && downPayment && interestRate && loanTerm && amortizationSystem) {
      const loan = parseFloat(propertyValue) - parseFloat(downPayment);
      setLoanAmount(loan);
      const rate = parseFloat(interestRate) / 100;
      const termMonths = parseInt(loanTerm, 10) * 12;

      if (loan <= 0 || rate <= 0 || termMonths <= 0) {
        return;
      }

      let calculatedSchedule: LoanInstallment[] = [];
      let totalPaid = 0;

      if (amortizationSystem === 'price') {
        // Cálculo pelo Sistema Price
        const monthlyRate = rate / 12;
        const monthlyPayment =
          loan * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
          (Math.pow(1 + monthlyRate, termMonths) - 1);

        let balance = loan;
        for (let i = 1; i <= termMonths; i++) {
          const interestPayment = balance * monthlyRate;
          const amortization = monthlyPayment - interestPayment;
          balance -= amortization;
          totalPaid += monthlyPayment;

          calculatedSchedule.push({
            month: i,
            totalPayment: monthlyPayment,
            interestPayment,
            amortization,
            balance: balance < 0 ? 0 : balance,
          });
        }
      } else {
        // Cálculo pelo Sistema SAC
        const amortization = loan / termMonths;
        let balance = loan;
        for (let i = 1; i <= termMonths; i++) {
          const interestPayment = balance * (rate / 12);
          const totalPayment = amortization + interestPayment;
          balance -= amortization;
          totalPaid += totalPayment;

          calculatedSchedule.push({
            month: i,
            totalPayment,
            interestPayment,
            amortization,
            balance: balance < 0 ? 0 : balance,
          });
        }
      }

      setSchedule(calculatedSchedule);

      // Total de juros pagos ao longo do financiamento
      const totalInterestPaid = totalPaid - loan;
      setTotalInterest(totalInterestPaid);

      // Total geral pago (empréstimo + juros)
      setTotalPaidAmount(totalPaid);
    }
  }, [propertyValue, downPayment, interestRate, loanTerm, amortizationSystem]);



  return (
    <PaperProvider theme={isDark ? MD3DarkTheme : MD3LightTheme}>
      <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>

        <Text variant="headlineLarge" style={[styles.title, { color: isDark ? '#E0E0E0' : '#000' }]}>
          📊 Resumo do Financiamento
        </Text>

        <Card style={[styles.card, { backgroundColor: isDark ? '#262626' : '#FFF' }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ color: isDark ? '#FFFFFF' : '#000' }}>🏠 Detalhes da Simulação</Text>
            <Text variant="bodyMedium" style={{ color: isDark ? '#BBBBBB' : '#444' }}>Valor do Imóvel: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseInt(propertyValue))}</Text>
            <Text variant="bodyMedium" style={{ color: isDark ? '#BBBBBB' : '#444' }}>Entrada: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseInt(downPayment))}</Text>
            <Text variant="bodyMedium" style={{ color: isDark ? '#BBBBBB' : '#444' }}>Valor Financiado: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(loanAmount)}</Text>
            <Text variant="bodyMedium" style={{ color: isDark ? '#BBBBBB' : '#444' }}>Taxa de Juros Anual: {interestRate}%</Text>
            <Text variant="bodyMedium" style={{ color: isDark ? '#BBBBBB' : '#444' }}>Prazo: {loanTerm} anos</Text>
            <Text variant="bodyMedium" style={{ color: isDark ? '#BBBBBB' : '#444' }}>
              Total de Juros Pagos: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInterest)}
            </Text>
            <Text variant="bodyMedium" style={{ color: isDark ? '#BBBBBB' : '#444' }}>
              Total Pago (Juros + Amortização): {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPaidAmount)}
            </Text>
            <Text variant="bodyMedium" style={{ color: isDark ? '#BBBBBB' : '#444' }}>
              Sistema de Amortização: {amortizationSystem === 'price' ? 'Price' : 'SAC'}
            </Text>
          </Card.Content>
        </Card>

        <FlatList
          data={schedule}
          keyExtractor={(item) => item.month.toString()}
          ListHeaderComponent={() => (
            <View style={[styles.headerRow, { backgroundColor: isDark ? '#333' : '#DDD' }]}>
              <Text style={[styles.headerText, { color: isDark ? '#FFF' : '#000' }]}>Mês</Text>
              <Text style={[styles.headerText, { color: isDark ? '#FFF' : '#000' }]}>Parcela</Text>
              <Text style={[styles.headerText, { color: isDark ? '#FFF' : '#000' }]}>Juros</Text>
              <Text style={[styles.headerText, { color: isDark ? '#FFF' : '#000' }]}>Amortização</Text>
              <Text style={[styles.headerText, { color: isDark ? '#FFF' : '#000' }]}>Saldo</Text>
            </View>
          )}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.row,
                { backgroundColor: isDark ? (index % 2 === 0 ? '#1A1A1A' : '#222') : index % 2 === 0 ? '#F5F5F5' : '#FFF' },
              ]}
            >
              <Text style={styles.cell}>{item.month}</Text>
              <Text style={styles.cell}>R$ {item.totalPayment.toFixed(2)}</Text>
              <Text style={styles.cell}>R$ {item.interestPayment.toFixed(2)}</Text>
              <Text style={styles.cell}>R$ {item.amortization.toFixed(2)}</Text>
              <Text style={styles.cell}>R$ {item.balance.toFixed(2)}</Text>
            </View>
          )}
        />

        <Button
          mode="contained"
          onPress={() => router.push('/loan/form')}
          style={[styles.button, { backgroundColor: isDark ? '#2E86DE' : '#1A73E8' }]}
          labelStyle={{ color: '#FFF' }}
        >
          🔄 Nova Simulação
        </Button>

      </View>
    </PaperProvider>
  );
}

