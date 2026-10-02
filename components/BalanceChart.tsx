import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { useAppTheme } from '@/constants/theme';
import { formatBRLShort } from '@/lib/format';

type BalanceChartProps = Readonly<{
  /** Saldo ao fim de cada ano; o índice 0 é o valor financiado. */
  balances: number[];
}>;

const CHART_HEIGHT = 140;

/** Gráfico de barras simples (sem dependências nativas) da evolução do saldo devedor. */
export default function BalanceChart({ balances }: BalanceChartProps) {
  const theme = useAppTheme();
  const max = balances[0] || 1;
  const years = balances.length - 1;
  const midYear = Math.round(years / 2);

  return (
    <View
      accessible
      accessibilityLabel={`Saldo devedor começa em ${formatBRLShort(max)} e chega a zero em ${years} anos`}
    >
      <View style={styles.axisRow}>
        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
          {formatBRLShort(max)}
        </Text>
      </View>
      <View style={[styles.bars, { borderBottomColor: theme.colors.outlineVariant }]}>
        {balances.map((balance, year) => (
          <View
            key={year}
            style={[
              styles.bar,
              {
                height: Math.max((balance / max) * CHART_HEIGHT, balance > 0 ? 2 : 0),
                backgroundColor: year === 0 ? theme.colors.chartBarMuted : theme.colors.chartBar,
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.labels}>
        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Início</Text>
        {years > 2 && (
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Ano {midYear}</Text>
        )}
        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Ano {years}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  axisRow: {
    marginBottom: 4,
  },
  bars: {
    height: CHART_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  bar: {
    flex: 1,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
});
