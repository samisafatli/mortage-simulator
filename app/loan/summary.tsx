import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, FlatList, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { Text, Button, Card, Divider, PaperProvider } from 'react-native-paper';

import { styles } from "../src/styles/summary.styles";

type LoanInstallment = {
  month: number;
  totalPayment: number;
  interestPayment: number;
  amortization: number;
  balance: number;
};

export default function LoanSummaryScreen() {
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

      const totalInterestPaid = totalPaid - loan;
      setTotalInterest(totalInterestPaid);
      setTotalPaidAmount(totalPaid);
    }
  }, [propertyValue, downPayment, interestRate, loanTerm, amortizationSystem]);


  return (
    <PaperProvider>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>📊 Resumo do Financiamento</Text>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>🏠 Detalhes da Simulação</Text>
            <Divider style={styles.divider} />
            <Text style={styles.cardText}>💰 Valor do Imóvel: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseInt(propertyValue))}</Text>
            <Text style={styles.cardText}>🔹 Entrada: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseInt(downPayment))}</Text>
            <Text style={styles.cardText}>🏦 Valor Financiado: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(loanAmount)}</Text>
            <Text style={styles.cardText}>📈 Taxa de Juros Anual: {interestRate}%</Text>
            <Text style={styles.cardText}>🕒 Prazo: {loanTerm} anos</Text>
            <Divider style={styles.divider} />
            <Text style={styles.cardText}>💵 Total de Juros Pagos: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInterest)}</Text>
            <Text style={styles.cardText}>💳 Total Pago (Juros + Amortização): {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPaidAmount)}</Text>
            <Text style={styles.cardText}>⚖️ Sistema de Amortização: {amortizationSystem === 'price' ? 'Price' : 'SAC'}</Text>
          </Card.Content>
        </Card>

        {/* Tabela de amortização */}
        <FlatList
          data={schedule}
          keyExtractor={(item) => item.month.toString()}
          ListHeaderComponent={() => (
            <View style={styles.headerRow}>
              <Text style={styles.headerText}>Mês</Text>
              <Text style={styles.headerText}>Parcela</Text>
              <Text style={styles.headerText}>Juros</Text>
              <Text style={styles.headerText}>Amortização</Text>
              <Text style={styles.headerText}>Saldo</Text>
            </View>
          )}
          renderItem={({ item, index }) => (
            <View style={[styles.row, { backgroundColor: index % 2 === 0 ? '#F8F9FA' : '#FFF' }]}>
              <Text style={styles.cell}>{item.month}</Text>
              <Text style={styles.cell}>R$ {item.totalPayment.toFixed(2)}</Text>
              <Text style={styles.cell}>R$ {item.interestPayment.toFixed(2)}</Text>
              <Text style={styles.cell}>R$ {item.amortization.toFixed(2)}</Text>
              <Text style={styles.cell}>R$ {item.balance.toFixed(2)}</Text>
            </View>
          )}
        />

        <Button mode="contained" onPress={() => router.push('/loan/form')} style={styles.button}>
          🔄 Nova Simulação
        </Button>
      </ScrollView>
    </PaperProvider>
  );
}
