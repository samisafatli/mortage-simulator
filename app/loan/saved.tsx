import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { ActivityIndicator, Button, Card, Chip, Divider, Icon, IconButton, Snackbar, Text } from 'react-native-paper';

import ConfirmDialog from '@/components/ConfirmDialog';
import InfoRow from '@/components/InfoRow';
import ScreenHeader from '@/components/ScreenHeader';
import { TEXTS } from '@/constants/texts';
import { useAppTheme } from '@/constants/theme';
import { simulateLoan } from '@/lib/amortization';
import { formatBRL, formatDate, formatPercent } from '@/lib/format';
import { deleteSimulation, loadSimulations, type SavedSimulation } from '@/lib/simulations';
import { toLoanParams } from '@/lib/validation';
import { styles } from '@/styles/saved.styles';

export default function SavedSimulationsScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const [simulations, setSimulations] = useState<SavedSimulation[] | null>(null);
  const [pendingDelete, setPendingDelete] = useState<SavedSimulation | null>(null);
  const [message, setMessage] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadSimulations()
        .then(setSimulations)
        .catch(() => {
          setSimulations([]);
          setMessage(TEXTS.ALERT_LOAD_ERROR);
        });
    }, []),
  );

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const { id } = pendingDelete;
    setPendingDelete(null);
    try {
      await deleteSimulation(id);
      setSimulations((current) => current?.filter((sim) => sim.id !== id) ?? []);
      setMessage(TEXTS.SAVED_SIMULATIONS_DELETED);
    } catch {
      setMessage(TEXTS.ALERT_DELETE_ERROR);
    }
  };

  const openSimulation = (simulation: SavedSimulation) =>
    router.push({ pathname: '/loan/summary', params: { ...toLoanParams(simulation.input), origin: 'saved' } });

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon source="bookmark-off-outline" size={72} color={theme.colors.outline} />
      <Text variant="titleMedium" style={styles.emptyMessage}>{TEXTS.SAVED_SIMULATIONS_EMPTY}</Text>
      <Text variant="bodyMedium" style={[styles.emptyMessage, { color: theme.colors.onSurfaceVariant }]}>
        {TEXTS.SAVED_SIMULATIONS_EMPTY_HINT}
      </Text>
      <Button
        mode="contained"
        icon="plus"
        onPress={() => router.replace('/loan/form')}
        style={styles.newSimulationButton}
      >
        {TEXTS.SAVED_SIMULATIONS_NEW_SIMULATION}
      </Button>
    </View>
  );

  return (
    <>
      <ScreenHeader title={TEXTS.SAVED_SIMULATIONS_TITLE} />

      {simulations === null ? (
        <ActivityIndicator style={{ marginTop: 48 }} />
      ) : (
        <FlatList
          data={simulations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          ListEmptyComponent={renderEmpty}
          renderItem={({ item }) => (
            <SimulationCard
              simulation={item}
              onPress={() => openSimulation(item)}
              onDelete={() => setPendingDelete(item)}
            />
          )}
        />
      )}

      <ConfirmDialog
        visible={pendingDelete !== null}
        title={TEXTS.DIALOG_DELETE_TITLE}
        message={TEXTS.DIALOG_DELETE_MESSAGE}
        confirmLabel={TEXTS.BUTTON_DELETE}
        onConfirm={confirmDelete}
        onDismiss={() => setPendingDelete(null)}
        destructive
      />

      <Snackbar visible={message !== ''} onDismiss={() => setMessage('')} duration={2500}>
        {message}
      </Snackbar>
    </>
  );
}

type SimulationCardProps = Readonly<{
  simulation: SavedSimulation;
  onPress: () => void;
  onDelete: () => void;
}>;

function SimulationCard({ simulation, onPress, onDelete }: SimulationCardProps) {
  const theme = useAppTheme();
  const { input } = simulation;
  const result = useMemo(() => simulateLoan(input), [input]);
  const systemLabel = input.system === 'price' ? TEXTS.AMORTIZATION_PRICE : TEXTS.AMORTIZATION_SAC;

  return (
    <Card mode="elevated" style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Chip compact icon={input.system === 'sac' ? 'trending-down' : 'trending-neutral'}>{systemLabel}</Chip>
          <IconButton
            icon="delete-outline"
            iconColor={theme.colors.error}
            onPress={onDelete}
            accessibilityLabel={TEXTS.SAVED_SIMULATIONS_DELETE}
          />
        </View>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          {input.system === 'price' ? TEXTS.LOAN_SUMMARY_FIXED_PAYMENT : TEXTS.LOAN_SUMMARY_FIRST_PAYMENT}
        </Text>
        <Text variant="headlineSmall" style={styles.cardValue}>{formatBRL(result.firstPayment)}</Text>
        <Divider style={styles.divider} />
        <InfoRow label={TEXTS.LOAN_SUMMARY_PROPERTY_VALUE} value={formatBRL(input.propertyValue)} />
        <InfoRow label={TEXTS.LOAN_SUMMARY_LOAN_AMOUNT} value={formatBRL(result.principal)} />
        <InfoRow
          label={`${TEXTS.LOAN_SUMMARY_INTEREST_RATE} / ${TEXTS.LOAN_SUMMARY_LOAN_TERM}`}
          value={`${formatPercent(input.annualRate)} a.a. · ${input.years} ${input.years === 1 ? 'ano' : 'anos'}`}
        />
        <InfoRow label={TEXTS.LOAN_SUMMARY_TOTAL_PAID} value={formatBRL(result.totalPaid)} emphasis />
        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
          {TEXTS.SAVED_SIMULATIONS_SAVED_ON(formatDate(simulation.createdAt))}
        </Text>
      </Card.Content>
    </Card>
  );
}
