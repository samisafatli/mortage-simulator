import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, FlatList } from 'react-native';
import { useEffect, useState } from 'react';

type LoanInstallment = {
  month: number;
  totalPayment: number;
  interestPayment: number;
  amortization: number;
  balance: number;
};

const calculatePriceSchedule = (
  principal: number,
  interestRate: number,
  months: number
): LoanInstallment[] => {
  const monthlyRate = interestRate / 100 / 12;
  if (monthlyRate === 0) return [];

  const fixedPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  let balance = principal;
  let schedule: LoanInstallment[] = [];

  for (let i = 1; i <= months; i++) {
    const interestPayment = balance * monthlyRate;
    const amortization = fixedPayment - interestPayment;
    balance -= amortization;

    schedule.push({
      month: i,
      totalPayment: fixedPayment,
      interestPayment,
      amortization,
      balance: balance > 0 ? balance : 0,
    });
  }

  return schedule;
};

export default function LoanSummaryScreen() {
  const theme = useColorScheme();
  const isDark = theme === 'dark';
  const router = useRouter();
  const { propertyValue, downPayment, interestRate, loanTerm } = useLocalSearchParams<{
    propertyValue: string;
    downPayment: string;
    interestRate: string;
    loanTerm: string;
  }>();

  const [schedule, setSchedule] = useState<LoanInstallment[]>([]);

  useEffect(() => {
    if (propertyValue && downPayment && interestRate && loanTerm) {
      const loanAmount = parseFloat(propertyValue) - parseFloat(downPayment);
      const rate = parseFloat(interestRate);
      const termMonths = parseInt(loanTerm, 10) * 12;

      const priceSchedule = calculatePriceSchedule(loanAmount, rate, termMonths);
      setSchedule(priceSchedule);
    }
  }, [propertyValue, downPayment, interestRate, loanTerm]);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
      <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>📊 Resumo do Financiamento</Text>

      <FlatList
        data={schedule}
        keyExtractor={(item) => item.month.toString()}
        ListHeaderComponent={() => (
          <View style={[styles.headerRow, { backgroundColor: isDark ? '#1E1E1E' : '#DDD' }]}>
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
              {
                backgroundColor: isDark ? (index % 2 === 0 ? '#1A1A1A' : '#222') : index % 2 === 0 ? '#F5F5F5' : '#FFF',
              },
            ]}
          >
            <Text style={[styles.cell, { color: isDark ? '#DDD' : '#000' }]}>{item.month}</Text>
            <Text style={[styles.cell, { color: isDark ? '#DDD' : '#000' }]}>R$ {item.totalPayment.toFixed(2)}</Text>
            <Text style={[styles.cell, { color: isDark ? '#DDD' : '#000' }]}>R$ {item.interestPayment.toFixed(2)}</Text>
            <Text style={[styles.cell, { color: isDark ? '#DDD' : '#000' }]}>R$ {item.amortization.toFixed(2)}</Text>
            <Text style={[styles.cell, { color: isDark ? '#DDD' : '#000' }]}>R$ {item.balance.toFixed(2)}</Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: isDark ? '#2E86DE' : '#1A73E8' }]}
        onPress={() => router.push('/loan/form')}
      >
        <Text style={styles.buttonText}>🔄 Nova Simulação</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 5,
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
  },
  cell: {
    fontSize: 14,
    flex: 1,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
