import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { Text, Button, Card, PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { styles } from "../src/styles/index.styles";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <PaperProvider>
      <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
        <Text variant="headlineLarge" style={[styles.title, { color: '#000' }]}>
          Amortiza+
        </Text>
        <Text variant="bodyLarge" style={[styles.subtitle, { color: '#555' }]}>
          Calcule seu financiamento de forma rápida e fácil!
        </Text>

        <Card style={[styles.card, { backgroundColor: '#FFF' }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ color: '#000' }}>Nova Simulação</Text>
            <Text variant="bodyMedium" style={{ color: '#666' }}>
              Insira os dados do financiamento e veja os cálculos detalhados.
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => router.push('/loan/form')}>
              Iniciar
            </Button>
          </Card.Actions>
        </Card>

        <Card style={[styles.card, { backgroundColor: '#FFF' }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ color: '#000' }}>Simulações Salvas</Text>
            <Text variant="bodyMedium" style={{ color: '#666' }}>
              Consulte suas simulações anteriores e compare opções.
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => router.push('/loan/saved')}>
              Acessar
            </Button>
          </Card.Actions>
        </Card>
      </View>
    </PaperProvider>
  );
}


