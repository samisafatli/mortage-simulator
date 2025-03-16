import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Button, Card, Divider, PaperProvider, Icon, IconButton, Appbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { styles } from "../src/styles/saved.styles";
import { TEXTS } from '@/constants/texts';

export default function SavedSimulationsScreen() {
  type Simulation = {
    id: string;
    propertyValue: string;
    downPayment: string;
    interestRate: string;
    loanTerm: string;
    amortizationSystem: string;
    totalPaidAmount: string;
    date: string;
  };

  const [simulations, setSimulations] = useState<Simulation[]>([]);

  const router = useRouter();

  useEffect(() => {
    loadSimulations();
  }, []);

  const loadSimulations = async () => {
    const storedSimulations = await AsyncStorage.getItem('simulations');
    if (storedSimulations) {
      setSimulations(JSON.parse(storedSimulations) as Simulation[]);
    }
  };

  const deleteSimulation = async (id: string) => {
    const updatedSimulations = simulations.filter((sim) => sim.id !== id);
    await AsyncStorage.setItem('simulations', JSON.stringify(updatedSimulations));
    setSimulations(updatedSimulations);
    alert(TEXTS.SAVED_SIMULATIONS_DELETE_CONFIRM);
  };

  return (
    <PaperProvider>
      <ScrollView style={styles.container}>
        <Appbar.Header style={styles.appBar}>
          <Appbar.Action icon="arrow-left" onPress={() => router.push('/')} />
          <Appbar.Content title={TEXTS.SAVED_SIMULATIONS_TITLE} />
        </Appbar.Header>
        {simulations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon source="clipboard-text-outline" size={80} color="#B0BEC5" />
            <Text style={styles.emptyMessage}>{TEXTS.SAVED_SIMULATIONS_EMPTY}</Text>
            <Button
              mode="contained"
              onPress={() => router.push('/loan/form')}
              style={styles.newSimulationButton}
              labelStyle={styles.newSimulationButtonLabel}
            >
              {TEXTS.SAVED_SIMULATIONS_NEW_SIMULATION}
            </Button>
          </View>
        ) : (
          simulations.map((sim, index) => (
            <Card key={sim.id} style={styles.card}>
              <Card.Content>
                <Text style={styles.cardTitle}>{index + 1}º {TEXTS.SAVED_SIMULATIONS_SIMULATION_DETAILS}</Text>
                <Divider style={styles.divider} />
                <Text style={styles.cardText}>{TEXTS.LOAN_FORM_PROPERTY_VALUE}: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(sim.propertyValue))}</Text>
                <Text style={styles.cardText}>{TEXTS.LOAN_FORM_DOWN_PAYMENT}: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(sim.downPayment))}</Text>
                <Text style={styles.cardText}>{TEXTS.LOAN_FORM_INTEREST_RATE}: {sim.interestRate}%</Text>
                <Text style={styles.cardText}>{TEXTS.LOAN_FORM_LOAN_TERM}: {sim.loanTerm} anos</Text>
                <Divider style={styles.divider} />
                <Text style={styles.cardText}>{TEXTS.LOAN_SUMMARY_TOTAL_PAID}: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(sim.totalPaidAmount))}</Text>
                <Text style={styles.cardText}>{TEXTS.LOAN_SUMMARY_AMORTIZATION_SYSTEM}: {sim.amortizationSystem === 'price' ? TEXTS.AMORTIZATION_PRICE : TEXTS.AMORTIZATION_SAC}</Text>
              </Card.Content>
              <Card.Actions>
                <IconButton
                  icon="delete"
                  size={24}
                  onPress={() => deleteSimulation(sim.id)}
                />
              </Card.Actions>
            </Card>
          ))
        )}
      </ScrollView>
    </PaperProvider>
  );
}
