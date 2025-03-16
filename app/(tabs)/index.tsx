import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { Text, Button, Card, PaperProvider } from 'react-native-paper';
import { styles } from "../src/styles/index.styles";
import { TEXTS } from '@/constants/texts';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <PaperProvider>
      <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
        <Text variant="headlineLarge" style={[styles.title, { color: '#000' }]}>
          {TEXTS.APP_NAME}
        </Text>
        <Text variant="bodyLarge" style={[styles.subtitle, { color: '#555' }]}>
          {TEXTS.APP_DESCRIPTION}
        </Text>

        <Card style={[styles.card, { backgroundColor: '#FFF' }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ color: '#000' }}>{TEXTS.HOME_NEW_SIMULATION_TITLE}</Text>
            <Text variant="bodyMedium" style={{ color: '#666' }}>
              {TEXTS.HOME_NEW_SIMULATION_DESCRIPTION}
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => router.push('/loan/form')}>
              {TEXTS.HOME_NEW_SIMULATION_TITLE}
            </Button>
          </Card.Actions>
        </Card>

        <Card style={[styles.card, { backgroundColor: '#FFF' }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ color: '#000' }}>{TEXTS.HOME_SAVED_SIMULATIONS_TITLE}</Text>
            <Text variant="bodyMedium" style={{ color: '#666' }}>
              {TEXTS.HOME_SAVED_SIMULATIONS_DESCRIPTION}
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => router.push('/loan/saved')}>
              {TEXTS.BUTTON_VIEW_MORE}
            </Button>
          </Card.Actions>
        </Card>
      </View>
    </PaperProvider>
  );
}


