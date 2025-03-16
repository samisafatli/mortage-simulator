import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { Text, Button, Card, Divider, PaperProvider, Appbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { styles } from "../src/styles/summary.styles";
import { TEXTS } from '@/constants/texts';

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

  const [limit, setLimit] = useState(12);
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

  const saveSimulation = async () => {
    try {
      const simulation = {
        id: new Date().getTime().toString(),
        propertyValue,
        downPayment,
        interestRate,
        loanTerm,
        amortizationSystem,
        loanAmount,
        totalInterest,
        totalPaidAmount,
        date: new Date().toLocaleDateString(),
      };

      const storedSimulations = await AsyncStorage.getItem('simulations');
      const simulations = storedSimulations ? JSON.parse(storedSimulations) : [];

      simulations.push(simulation);
      await AsyncStorage.setItem('simulations', JSON.stringify(simulations));

      alert(TEXTS.ALERT_SIMULATION_SAVED);
    } catch (error) {
      alert(TEXTS.ALERT_SIMULATION_ERROR);
    }
  };

  return (
    <PaperProvider>
      <ScrollView style={styles.container}>
        <Appbar.Header style={styles.appBar}>
          <Appbar.Action icon="arrow-left" onPress={() => router.push('/')} />
          <Appbar.Content title={TEXTS.LOAN_SUMMARY_TITLE} />
        </Appbar.Header>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardText}>{TEXTS.LOAN_SUMMARY_LOAN_AMOUNT} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseInt(propertyValue))}</Text>
            <Text style={styles.cardText}>{TEXTS.LOAN_FORM_DOWN_PAYMENT} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseInt(downPayment))}</Text>
            <Text style={styles.cardText}>{TEXTS.LOAN_SUMMARY_LOAN_AMOUNT} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(loanAmount)}</Text>
            <Text style={styles.cardText}>{TEXTS.LOAN_SUMMARY_INTEREST_RATE} {interestRate}%</Text>
            <Text style={styles.cardText}>{TEXTS.LOAN_SUMMARY_LOAN_TERM} {loanTerm} anos</Text>
            <Divider style={styles.divider} />
            <Text style={styles.cardText}>{TEXTS.LOAN_SUMMARY_TOTAL_INTEREST} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInterest)}</Text>
            <Text style={styles.cardText}>{TEXTS.LOAN_SUMMARY_TOTAL_PAID} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPaidAmount)}</Text>
            <Text style={styles.cardText}>{TEXTS.LOAN_SUMMARY_AMORTIZATION_SYSTEM} {amortizationSystem === 'price' ? TEXTS.AMORTIZATION_PRICE : TEXTS.AMORTIZATION_SAC}</Text>
          </Card.Content>
          <Card.Actions style={{ justifyContent: 'flex-end' }}>
            <Appbar.Action
              icon="plus-circle"
              onPress={saveSimulation}
            />
          </Card.Actions>
        </Card>

        {schedule.slice(0, limit).map((item) => (
          <Card key={item.month} style={styles.paymentCard}>
            <Card.Content>
              <Text style={styles.paymentTitle}>{TEXTS.LOAN_SUMMARY_MONTHLY_PAYMENT} {item.month}</Text>
              <Divider style={styles.divider} />
              <Text style={styles.cardText}>{TEXTS.LOAN_SUMMARY_MONTHLY_PAYMENT} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.totalPayment)}</Text>
              <Text style={styles.cardText}>{TEXTS.LOAN_SUMMARY_INTEREST_PAYMENT} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.interestPayment)}</Text>
              <Text style={styles.cardText}>{TEXTS.LOAN_SUMMARY_AMORTIZATION} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.amortization)}</Text>
              <Text style={styles.cardText}>{TEXTS.LOAN_SUMMARY_BALANCE} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.balance)}</Text>
            </Card.Content>
          </Card>
        ))}
        {limit < schedule.length && (
          <Button mode="contained" onPress={() => setLimit(limit + 12)} style={styles.button}>
            {TEXTS.LOAN_SUMMARY_VIEW_MORE}
          </Button>
        )}

        <Button mode="contained" onPress={() => router.push('/loan/form')} style={[styles.button, styles.lastButton]}>
          {TEXTS.LOAN_SUMMARY_NEW_SIMULATION}
        </Button>
      </ScrollView>
    </PaperProvider>
  );
}
