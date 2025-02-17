import { useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { Text, Button, Card, PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { styles } from "../src/styles/index.styles";

export default function HomeScreen() {
  const theme = useColorScheme();
  const isDark = theme === 'dark';
  const router = useRouter();

  return (
    <PaperProvider theme={isDark ? MD3DarkTheme : MD3LightTheme}>
      <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
        <Text variant="headlineLarge" style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>
          Amortiza+
        </Text>
        <Text variant="bodyLarge" style={[styles.subtitle, { color: isDark ? '#CCC' : '#555' }]}>
          Calcule seu financiamento de forma rápida e fácil!
        </Text>

        <Card style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFF' }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ color: isDark ? '#FFF' : '#000' }}>📊 Nova Simulação</Text>
            <Text variant="bodyMedium" style={{ color: isDark ? '#CCC' : '#666' }}>
              Insira os dados do financiamento e veja os cálculos detalhados.
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={() => router.push('/loan/form')}>
              ➕ Iniciar
            </Button>
          </Card.Actions>
        </Card>

        <Card style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFF' }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ color: isDark ? '#FFF' : '#000' }}>📂 Simulações Salvas</Text>
            <Text variant="bodyMedium" style={{ color: isDark ? '#CCC' : '#666' }}>
              Consulte suas simulações anteriores e compare opções.
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="outlined" onPress={() => router.push('/loan/saved')}>
              📂 Acessar
            </Button>
          </Card.Actions>
        </Card>
      </View>
    </PaperProvider>
  );
}


