import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';

import { TEXTS } from '@/constants/texts';
import { useAppTheme } from '@/constants/theme';
import type { Installment, YearSummary } from '@/lib/amortization';
import { formatBRL } from '@/lib/format';

const strip = (value: number) => formatBRL(value).replace('R$', '').trim();

export function ScheduleHeader() {
  const theme = useAppTheme();
  const color = { color: theme.colors.onSurfaceVariant };

  return (
    <View style={[styles.row, styles.header, { backgroundColor: theme.colors.surfaceVariant }]}>
      <Text variant="labelMedium" style={[styles.period, color]}>{TEXTS.LOAN_SUMMARY_COL_YEAR}</Text>
      <Text variant="labelMedium" style={[styles.cell, color]}>{TEXTS.LOAN_SUMMARY_COL_PAID}</Text>
      <Text variant="labelMedium" style={[styles.cell, color]}>{TEXTS.LOAN_SUMMARY_COL_INTEREST}</Text>
      <Text variant="labelMedium" style={[styles.cell, color]}>{TEXTS.LOAN_SUMMARY_COL_AMORTIZATION}</Text>
      <Text variant="labelMedium" style={[styles.cell, color]}>{TEXTS.LOAN_SUMMARY_COL_BALANCE}</Text>
    </View>
  );
}

type YearRowProps = Readonly<{
  summary: YearSummary;
  expanded: boolean;
  onToggle: (year: number) => void;
}>;

export const YearRow = memo(function YearRow({ summary, expanded, onToggle }: YearRowProps) {
  const theme = useAppTheme();

  return (
    <Pressable
      onPress={() => onToggle(summary.year)}
      android_ripple={{ color: theme.colors.surfaceVariant }}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      accessibilityLabel={TEXTS.LOAN_SUMMARY_YEAR_A11Y(summary.year)}
      style={[
        styles.row,
        styles.yearRow,
        {
          backgroundColor: expanded ? theme.colors.elevation.level2 : theme.colors.surface,
          borderBottomColor: theme.colors.outlineVariant,
        },
      ]}
    >
      <View style={[styles.period, styles.yearLabel]}>
        <Icon source={expanded ? 'chevron-down' : 'chevron-right'} size={16} color={theme.colors.primary} />
        <Text variant="bodySmall" style={[styles.strong, { color: theme.colors.primary }]}>{summary.year}</Text>
      </View>
      <Text variant="bodySmall" style={[styles.cell, styles.strong]}>{strip(summary.paid)}</Text>
      <Text variant="bodySmall" style={styles.cell}>{strip(summary.interest)}</Text>
      <Text variant="bodySmall" style={styles.cell}>{strip(summary.amortization)}</Text>
      <Text variant="bodySmall" style={styles.cell}>{strip(summary.balance)}</Text>
    </Pressable>
  );
});

type MonthRowProps = Readonly<{ item: Installment; last: boolean }>;

export const MonthRow = memo(function MonthRow({ item, last }: MonthRowProps) {
  const theme = useAppTheme();
  const muted = { color: theme.colors.onSurfaceVariant };

  return (
    <View
      style={[
        styles.row,
        styles.monthRow,
        {
          backgroundColor: theme.colors.elevation.level2,
          borderBottomColor: last ? theme.colors.outlineVariant : 'transparent',
        },
      ]}
    >
      <Text variant="labelSmall" style={[styles.period, styles.monthLabel, muted]}>
        {TEXTS.LOAN_SUMMARY_MONTH_SHORT(item.month)}
      </Text>
      <Text variant="labelSmall" style={styles.cell}>{strip(item.payment)}</Text>
      <Text variant="labelSmall" style={[styles.cell, muted]}>{strip(item.interest)}</Text>
      <Text variant="labelSmall" style={[styles.cell, muted]}>{strip(item.amortization)}</Text>
      <Text variant="labelSmall" style={[styles.cell, muted]}>{strip(item.balance)}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'transparent',
  },
  header: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  yearRow: {
    paddingVertical: 12,
  },
  monthRow: {
    paddingVertical: 6,
  },
  period: {
    width: 48,
    fontVariant: ['tabular-nums'],
  },
  yearLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  monthLabel: {
    paddingLeft: 18,
  },
  cell: {
    flex: 1,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  strong: {
    fontWeight: '600',
  },
});
