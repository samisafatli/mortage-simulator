import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Share, View } from 'react-native';
import { Appbar, Button, Card, Chip, Divider, Snackbar, Text } from 'react-native-paper';

import BalanceChart from '@/components/BalanceChart';
import InfoRow from '@/components/InfoRow';
import { ScheduleHeader, ScheduleRow } from '@/components/ScheduleTable';
import ScreenHeader from '@/components/ScreenHeader';
import { TEXTS } from '@/constants/texts';
import { useAppTheme } from '@/constants/theme';
import { simulateLoan, yearlyBalances, type Installment, type LoanInput, type LoanResult } from '@/lib/amortization';
import { formatBRL, formatPercent } from '@/lib/format';
import { findSimulation, saveSimulation } from '@/lib/simulations';
import { parseLoanParams, toLoanParams, type LoanParams } from '@/lib/validation';
import { styles } from '@/styles/summary.styles';

type SummaryParams = LoanParams & { origin?: string };

const systemLabel = (system: LoanInput['system']) =>
  system === 'price' ? TEXTS.AMORTIZATION_PRICE : TEXTS.AMORTIZATION_SAC;

const keyExtractor = (item: Installment) => String(item.month);
const renderItem = ({ item }: { item: Installment }) => <ScheduleRow item={item} />;

export default function LoanSummaryScreen() {
  const router = useRouter();
  const { propertyValue, downPayment, annualRate, years, system, origin } = useLocalSearchParams<SummaryParams>();
  const input = useMemo(
    () => parseLoanParams({ propertyValue, downPayment, annualRate, years, system }),
    [propertyValue, downPayment, annualRate, years, system],
  );

  if (!input) {
    return (
      <>
        <ScreenHeader title={TEXTS.LOAN_SUMMARY_TITLE} />
        <View style={styles.centered}>
          <Text variant="bodyLarge">{TEXTS.LOAN_SUMMARY_INVALID}</Text>
          <Button mode="contained" onPress={() => router.replace('/loan/form')}>
            {TEXTS.HOME_NEW_SIMULATION_TITLE}
          </Button>
        </View>
      </>
    );
  }

  return <LoanSummary input={input} cameFromForm={origin === 'form'} />;
}

type LoanSummaryProps = Readonly<{ input: LoanInput; cameFromForm: boolean }>;

function LoanSummary({ input, cameFromForm }: LoanSummaryProps) {
  const router = useRouter();
  const theme = useAppTheme();
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState('');

  const results = useMemo(
    () => ({
      sac: simulateLoan({ ...input, system: 'sac' }),
      price: simulateLoan({ ...input, system: 'price' }),
    }),
    [input],
  );
  const result = results[input.system];
  const balances = useMemo(() => yearlyBalances(result), [result]);

  useEffect(() => {
    findSimulation(input)
      .then((existing) => setSaved(!!existing))
      .catch(() => setSaved(false));
  }, [input]);

  const handleSave = async () => {
    try {
      await saveSimulation(input);
      setMessage(saved ? TEXTS.ALERT_SIMULATION_ALREADY_SAVED : TEXTS.ALERT_SIMULATION_SAVED);
      setSaved(true);
    } catch {
      setMessage(TEXTS.ALERT_SIMULATION_ERROR);
    }
  };

  const handleShare = () => {
    const lines = [
      `${TEXTS.LOAN_SUMMARY_PROPERTY_VALUE}: ${formatBRL(input.propertyValue)}`,
      `${TEXTS.LOAN_SUMMARY_DOWN_PAYMENT}: ${formatBRL(input.downPayment)}`,
      `${TEXTS.LOAN_SUMMARY_LOAN_AMOUNT}: ${formatBRL(result.principal)}`,
      `${TEXTS.LOAN_SUMMARY_INTEREST_RATE}: ${formatPercent(input.annualRate)} a.a.`,
      `${TEXTS.LOAN_SUMMARY_LOAN_TERM}: ${TEXTS.LOAN_SUMMARY_TERM_VALUE(input.years, result.months)}`,
      `${TEXTS.LOAN_SUMMARY_AMORTIZATION_SYSTEM}: ${systemLabel(input.system)}`,
      `${TEXTS.LOAN_SUMMARY_FIRST_PAYMENT}: ${formatBRL(result.firstPayment)}`,
      `${TEXTS.LOAN_SUMMARY_TOTAL_INTEREST}: ${formatBRL(result.totalInterest)}`,
      `${TEXTS.LOAN_SUMMARY_TOTAL_PAID}: ${formatBRL(result.totalPaid)}`,
    ];
    Share.share({ message: TEXTS.LOAN_SUMMARY_SHARE_MESSAGE(lines) }).catch(() => undefined);
  };

  const handleEdit = () => {
    if (cameFromForm) router.back();
    else router.push({ pathname: '/loan/form', params: toLoanParams(input) });
  };

  const header = <SummaryHeader input={input} result={result} results={results} balances={balances} />;

  const footer = (
    <>
      <View style={[styles.tableFooter, { backgroundColor: theme.colors.surface }]} />
      <Button
        mode="outlined"
        icon="pencil-outline"
        onPress={handleEdit}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        {TEXTS.BUTTON_EDIT}
      </Button>
    </>
  );

  return (
    <>
      <ScreenHeader title={TEXTS.LOAN_SUMMARY_TITLE}>
        <Appbar.Action icon="share-variant-outline" onPress={handleShare} accessibilityLabel={TEXTS.LOAN_SUMMARY_SHARE} />
        <Appbar.Action
          icon={saved ? 'bookmark' : 'bookmark-outline'}
          onPress={handleSave}
          accessibilityLabel={saved ? TEXTS.LOAN_SUMMARY_SAVED : TEXTS.LOAN_SUMMARY_SAVE}
        />
      </ScreenHeader>

      <FlatList
        data={result.schedule}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        contentContainerStyle={styles.content}
        initialNumToRender={24}
        windowSize={11}
      />

      <Snackbar visible={message !== ''} onDismiss={() => setMessage('')} duration={2500}>
        {message}
      </Snackbar>
    </>
  );
}

type SummaryHeaderProps = Readonly<{
  input: LoanInput;
  result: LoanResult;
  results: Record<LoanInput['system'], LoanResult>;
  balances: number[];
}>;

function SummaryHeader({ input, result, results, balances }: SummaryHeaderProps) {
  const theme = useAppTheme();
  const savings = results.price.totalInterest - results.sac.totalInterest;
  const downPaymentRatio = (input.downPayment / input.propertyValue) * 100;

  return (
    <View style={styles.header}>
      <Card mode="contained" style={[styles.card, { backgroundColor: theme.colors.primaryContainer }]}>
        <Card.Content>
          <Text variant="labelLarge" style={[styles.heroLabel, { color: theme.colors.onPrimaryContainer }]}>
            {input.system === 'price' ? TEXTS.LOAN_SUMMARY_FIXED_PAYMENT : TEXTS.LOAN_SUMMARY_FIRST_PAYMENT}
          </Text>
          <Text variant="displaySmall" style={[styles.heroValue, { color: theme.colors.onPrimaryContainer }]}>
            {formatBRL(result.firstPayment)}
          </Text>
          <View style={styles.heroFooter}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer, flexShrink: 1 }}>
              {input.system === 'sac' ? TEXTS.LOAN_SUMMARY_LAST_PAYMENT(formatBRL(result.lastPayment)) : ''}
            </Text>
            <Chip compact icon={input.system === 'sac' ? 'trending-down' : 'trending-neutral'}>
              {systemLabel(input.system)}
            </Chip>
          </View>
        </Card.Content>
      </Card>

      <Card mode="elevated" style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>{TEXTS.LOAN_SUMMARY_DETAILS}</Text>
          <InfoRow label={TEXTS.LOAN_SUMMARY_PROPERTY_VALUE} value={formatBRL(input.propertyValue)} />
          <InfoRow
            label={TEXTS.LOAN_SUMMARY_DOWN_PAYMENT}
            value={`${formatBRL(input.downPayment)} (${formatPercent(downPaymentRatio, 1)})`}
          />
          <InfoRow label={TEXTS.LOAN_SUMMARY_LOAN_AMOUNT} value={formatBRL(result.principal)} />
          <InfoRow
            label={TEXTS.LOAN_SUMMARY_INTEREST_RATE}
            value={TEXTS.LOAN_SUMMARY_RATE_VALUE(formatPercent(input.annualRate), formatPercent(result.monthlyRate * 100, 4))}
          />
          <InfoRow label={TEXTS.LOAN_SUMMARY_LOAN_TERM} value={TEXTS.LOAN_SUMMARY_TERM_VALUE(input.years, result.months)} />
          <Divider style={styles.divider} />
          <InfoRow label={TEXTS.LOAN_SUMMARY_TOTAL_INTEREST} value={formatBRL(result.totalInterest)} />
          <InfoRow label={TEXTS.LOAN_SUMMARY_TOTAL_PAID} value={formatBRL(result.totalPaid)} emphasis />
        </Card.Content>
      </Card>

      <Card mode="elevated" style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>{TEXTS.LOAN_SUMMARY_COMPARISON}</Text>
          <View style={styles.comparisonRow}>
            {(['sac', 'price'] as const).map((system) => {
              const selected = system === input.system;
              return (
                <View
                  key={system}
                  style={[
                    styles.comparisonColumn,
                    {
                      borderColor: selected ? theme.colors.primary : theme.colors.outlineVariant,
                      backgroundColor: selected ? theme.colors.elevation.level2 : 'transparent',
                    },
                  ]}
                >
                  <Text variant="labelLarge" style={{ color: selected ? theme.colors.primary : theme.colors.onSurface }}>
                    {systemLabel(system)}
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {TEXTS.LOAN_SUMMARY_COMPARISON_FIRST}
                  </Text>
                  <Text variant="bodyLarge">{formatBRL(results[system].firstPayment)}</Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {TEXTS.LOAN_SUMMARY_TOTAL_PAID}
                  </Text>
                  <Text variant="bodyLarge">{formatBRL(results[system].totalPaid)}</Text>
                </View>
              );
            })}
          </View>
          {savings > 0.5 && (
            <Text variant="bodyMedium" style={[styles.comparisonNote, { color: theme.colors.success }]}>
              {TEXTS.LOAN_SUMMARY_COMPARISON_SAVINGS(formatBRL(savings))}
            </Text>
          )}
        </Card.Content>
      </Card>

      <Card mode="elevated" style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>{TEXTS.LOAN_SUMMARY_CHART_TITLE}</Text>
          <BalanceChart balances={balances} />
        </Card.Content>
      </Card>

      <View>
        <Text variant="titleMedium" style={[styles.scheduleTitle, styles.cardTitle]}>{TEXTS.LOAN_SUMMARY_SCHEDULE}</Text>
        <ScheduleHeader />
      </View>
    </View>
  );
}
