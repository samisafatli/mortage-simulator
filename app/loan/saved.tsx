import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Button, Card, Divider, PaperProvider, Icon, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { styles } from "../src/styles/saved.styles";

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
    alert("Simulação removida.");
  };

  return (
    <PaperProvider>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Simulações Salvas</Text>
        {simulations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon source="clipboard-text-outline" size={80} color="#B0BEC5" />
            <Text style={styles.emptyMessage}>Nenhuma simulação salva.</Text>
            <Button
              mode="contained"
              onPress={() => router.push('/loan/form')}
              style={styles.newSimulationButton}
              labelStyle={styles.newSimulationButtonLabel}
            >
              Nova Simulação
            </Button>
          </View>
        ) : (

          simulations.map((sim, index) => (
            <Card key={sim.id} style={styles.card}>
              <Card.Content>
                <Text style={styles.cardTitle}>{index + 1}º Simulação </Text>
                <Divider style={styles.divider} />

                <Text style={styles.cardText}>Valor do Imóvel: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(sim.propertyValue))}</Text>
                <Text style={styles.cardText}>Entrada: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(sim.downPayment))}</Text>
                <Text style={styles.cardText}>Taxa de Juros: {sim.interestRate}%</Text>
                <Text style={styles.cardText}>Prazo: {sim.loanTerm} anos</Text>
                <Divider style={styles.divider} />
                <Text style={styles.cardText}>Total Pago: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(sim.totalPaidAmount))}</Text>
                <Text style={styles.cardText}>Sistema: {sim.amortizationSystem === 'price' ? 'Price' : 'SAC'}</Text>
              </Card.Content>

              <Card.Actions>
                <IconButton
                  icon="delete"
                  size={20}
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
