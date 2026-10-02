import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { TEXTS } from '@/constants/texts';
import { useAppTheme } from '@/constants/theme';
import type { Installment } from '@/lib/amortization';
import { formatBRL } from '@/lib/format';

const strip = (value: number) => formatBRL(value).replace('R$', '').trim();

export function ScheduleHeader() {
  const theme = useAppTheme();
  const color = { color: theme.colors.onSurfaceVariant };

  return (
    <View style={[styles.row, styles.header, { backgroundColor: theme.colors.surfaceVariant }]}>
      <Text variant="labelMedium" style={[styles.month, color]}>{TEXTS.LOAN_SUMMARY_COL_MONTH}</Text>
      <Text variant="labelMedium" style={[styles.cell, color]}>{TEXTS.LOAN_SUMMARY_COL_PAYMENT}</Text>
      <Text variant="labelMedium" style={[styles.cell, color]}>{TEXTS.LOAN_SUMMARY_COL_INTEREST}</Text>
      <Text variant="labelMedium" style={[styles.cell, color]}>{TEXTS.LOAN_SUMMARY_COL_AMORTIZATION}</Text>
      <Text variant="labelMedium" style={[styles.cell, color]}>{TEXTS.LOAN_SUMMARY_COL_BALANCE}</Text>
    </View>
  );
}

type ScheduleRowProps = Readonly<{ item: Installment }>;

export const ScheduleRow = memo(function ScheduleRow({ item }: ScheduleRowProps) {
  const theme = useAppTheme();
  const endOfYear = item.month % 12 === 0;

  return (
    <View
      style={[
        styles.row,
        { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.outlineVariant },
        endOfYear && styles.yearEnd,
      ]}
    >
      <Text variant="bodySmall" style={styles.month}>{item.month}</Text>
      <Text variant="bodySmall" style={[styles.cell, styles.strong]}>{strip(item.payment)}</Text>
      <Text variant="bodySmall" style={styles.cell}>{strip(item.interest)}</Text>
      <Text variant="bodySmall" style={styles.cell}>{strip(item.amortization)}</Text>
      <Text variant="bodySmall" style={styles.cell}>{strip(item.balance)}</Text>
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
  yearEnd: {
    borderBottomWidth: 1,
  },
  month: {
    width: 36,
    fontVariant: ['tabular-nums'],
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
