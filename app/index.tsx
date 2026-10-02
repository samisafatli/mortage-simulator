import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TEXTS } from '@/constants/texts';
import { useAppTheme } from '@/constants/theme';
import { loadSimulations } from '@/lib/simulations';
import { styles } from '@/styles/index.styles';

type IconProps = { size: number };
const CalculatorIcon = (props: IconProps) => <Avatar.Icon {...props} icon="calculator-variant-outline" />;
const BookmarkIcon = (props: IconProps) => <Avatar.Icon {...props} icon="bookmark-multiple-outline" />;

export default function HomeScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const [savedCount, setSavedCount] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadSimulations()
        .then((simulations) => setSavedCount(simulations.length))
        .catch(() => setSavedCount(null));
    }, []),
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <Avatar.Icon
            icon="home-city-outline"
            size={72}
            style={[styles.logo, { backgroundColor: theme.colors.primaryContainer }]}
            color={theme.colors.onPrimaryContainer}
          />
          <Text variant="headlineLarge" style={styles.title}>
            {TEXTS.APP_NAME}
          </Text>
          <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            {TEXTS.APP_DESCRIPTION}
          </Text>
        </View>

        <Card mode="contained" style={[styles.card, { backgroundColor: theme.colors.primaryContainer }]} onPress={() => router.push('/loan/form')}>
          <Card.Title
            title={TEXTS.HOME_NEW_SIMULATION_TITLE}
            titleVariant="titleLarge"
            titleStyle={{ color: theme.colors.onPrimaryContainer }}
            left={CalculatorIcon}
          />
          <Card.Content>
            <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer }}>
              {TEXTS.HOME_NEW_SIMULATION_DESCRIPTION}
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" icon="arrow-right" contentStyle={{ flexDirection: 'row-reverse' }} onPress={() => router.push('/loan/form')}>
              {TEXTS.BUTTON_START}
            </Button>
          </Card.Actions>
        </Card>

        <Card mode="elevated" style={styles.card} onPress={() => router.push('/loan/saved')}>
          <Card.Title
            title={TEXTS.HOME_SAVED_SIMULATIONS_TITLE}
            titleVariant="titleLarge"
            subtitle={savedCount === null ? undefined : TEXTS.HOME_SAVED_COUNT(savedCount)}
            left={BookmarkIcon}
          />
          <Card.Content>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {TEXTS.HOME_SAVED_SIMULATIONS_DESCRIPTION}
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="outlined" onPress={() => router.push('/loan/saved')}>
              {TEXTS.BUTTON_VIEW}
            </Button>
          </Card.Actions>
        </Card>

        <Text variant="bodySmall" style={[styles.disclaimer, { color: theme.colors.onSurfaceVariant }]}>
          {TEXTS.HOME_DISCLAIMER}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
