import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, type TextInput as NativeTextInput } from 'react-native';
import { Button, Card, HelperText, SegmentedButtons, Text, TextInput } from 'react-native-paper';

import ScreenHeader from '@/components/ScreenHeader';
import { TEXTS } from '@/constants/texts';
import { useAppTheme } from '@/constants/theme';
import { annualToMonthlyRate, type AmortizationSystem, type LoanInput } from '@/lib/amortization';
import {
  formatBRL,
  formatPercent,
  maskCurrency,
  maskInteger,
  maskRate,
  parseDigits,
  parseRate,
} from '@/lib/format';
import {
  hasErrors,
  isLowDownPayment,
  parseLoanParams,
  toLoanParams,
  validateLoanInput,
  type LoanErrors,
  type LoanField,
  type LoanParams,
} from '@/lib/validation';
import { styles } from '@/styles/form.styles';

// O TextInput do Paper repassa a ref para o TextInput nativo.
type InputRef = NativeTextInput;

export default function LoanFormScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const initial = parseLoanParams(useLocalSearchParams<LoanParams>());

  const [system, setSystem] = useState<AmortizationSystem>(initial?.system ?? 'sac');
  const [propertyText, setPropertyText] = useState(initial ? maskCurrency(String(initial.propertyValue)) : '');
  const [downPaymentText, setDownPaymentText] = useState(initial ? maskCurrency(String(initial.downPayment)) : '');
  const [rateText, setRateText] = useState(initial ? maskRate(String(initial.annualRate)) : '');
  const [yearsText, setYearsText] = useState(initial ? String(initial.years) : '');
  const [submitted, setSubmitted] = useState(false);

  const downPaymentRef = useRef<InputRef>(null);
  const rateRef = useRef<InputRef>(null);
  const yearsRef = useRef<InputRef>(null);

  const input: LoanInput = {
    propertyValue: parseDigits(propertyText),
    downPayment: parseDigits(downPaymentText),
    annualRate: parseRate(rateText),
    years: parseDigits(yearsText),
    system,
  };

  // Depois da primeira tentativa de envio, os erros acompanham a digitação.
  const errors: LoanErrors = submitted ? validateLoanInput(input) : {};

  const financed = Math.max(input.propertyValue - input.downPayment, 0);
  const downPaymentRatio = input.propertyValue > 0 ? (input.downPayment / input.propertyValue) * 100 : 0;

  const handleCalculate = () => {
    setSubmitted(true);
    if (hasErrors(validateLoanInput(input))) return;
    router.push({ pathname: '/loan/summary', params: { ...toLoanParams(input), origin: 'form' } });
  };

  const helper = (field: LoanField, hint?: string, warning?: string) => {
    if (errors[field]) {
      return <HelperText type="error">{errors[field]}</HelperText>;
    }
    if (warning) {
      return <HelperText type="info" style={{ color: theme.colors.warning }}>{warning}</HelperText>;
    }
    return <HelperText type="info" visible={!!hint}>{hint ?? ' '}</HelperText>;
  };

  return (
    <>
      <ScreenHeader title={TEXTS.LOAN_FORM_TITLE} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text variant="titleMedium" style={styles.sectionTitle}>{TEXTS.AMORTIZATION_SYSTEM}</Text>
          <SegmentedButtons
            value={system}
            onValueChange={(value) => setSystem(value as AmortizationSystem)}
            buttons={[
              { value: 'sac', label: TEXTS.AMORTIZATION_SAC, icon: 'trending-down' },
              { value: 'price', label: TEXTS.AMORTIZATION_PRICE, icon: 'trending-neutral' },
            ]}
          />
          <Text variant="bodySmall" style={[styles.systemDescription, { color: theme.colors.onSurfaceVariant }]}>
            {system === 'sac' ? TEXTS.AMORTIZATION_SAC_DESCRIPTION : TEXTS.AMORTIZATION_PRICE_DESCRIPTION}
          </Text>

          <TextInput
            mode="outlined"
            label={TEXTS.LOAN_FORM_PROPERTY_VALUE}
            placeholder="R$ 500.000"
            keyboardType="number-pad"
            returnKeyType="next"
            value={propertyText}
            onChangeText={(text) => setPropertyText(maskCurrency(text))}
            onSubmitEditing={() => downPaymentRef.current?.focus()}
            error={!!errors.propertyValue}
            left={<TextInput.Icon icon="home-outline" />}
            style={styles.field}
          />
          {helper('propertyValue')}

          <TextInput
            ref={downPaymentRef}
            mode="outlined"
            label={TEXTS.LOAN_FORM_DOWN_PAYMENT}
            placeholder="R$ 100.000"
            keyboardType="number-pad"
            returnKeyType="next"
            value={downPaymentText}
            onChangeText={(text) => setDownPaymentText(maskCurrency(text))}
            onSubmitEditing={() => rateRef.current?.focus()}
            error={!!errors.downPayment}
            left={<TextInput.Icon icon="cash" />}
            style={styles.field}
          />
          {helper(
            'downPayment',
            input.propertyValue > 0 && input.downPayment > 0
              ? TEXTS.LOAN_FORM_DOWN_PAYMENT_HINT(formatPercent(downPaymentRatio, 1))
              : undefined,
            input.propertyValue > 0 && downPaymentText !== '' && isLowDownPayment(input)
              ? TEXTS.LOAN_FORM_LOW_DOWN_PAYMENT
              : undefined,
          )}

          <TextInput
            ref={rateRef}
            mode="outlined"
            label={TEXTS.LOAN_FORM_INTEREST_RATE}
            placeholder="10,5"
            keyboardType="decimal-pad"
            returnKeyType="next"
            value={rateText}
            onChangeText={(text) => setRateText(maskRate(text))}
            onSubmitEditing={() => yearsRef.current?.focus()}
            error={!!errors.annualRate}
            left={<TextInput.Icon icon="percent-outline" />}
            right={<TextInput.Affix text={TEXTS.LOAN_FORM_RATE_SUFFIX} />}
            style={styles.field}
          />
          {helper(
            'annualRate',
            input.annualRate > 0
              ? TEXTS.LOAN_FORM_RATE_HINT(formatPercent(annualToMonthlyRate(input.annualRate) * 100, 4))
              : undefined,
          )}

          <TextInput
            ref={yearsRef}
            mode="outlined"
            label={TEXTS.LOAN_FORM_LOAN_TERM}
            placeholder="30"
            keyboardType="number-pad"
            returnKeyType="done"
            value={yearsText}
            onChangeText={(text) => setYearsText(maskInteger(text, 2))}
            onSubmitEditing={handleCalculate}
            error={!!errors.years}
            left={<TextInput.Icon icon="calendar-month-outline" />}
            right={<TextInput.Affix text={TEXTS.LOAN_FORM_TERM_SUFFIX} />}
            style={styles.field}
          />
          {helper('years', input.years > 0 ? TEXTS.LOAN_FORM_TERM_HINT(input.years * 12) : undefined)}

          <Card mode="contained" style={[styles.financedCard, { backgroundColor: theme.colors.secondaryContainer }]}>
            <Card.Content style={styles.financedRow}>
              <Text variant="bodyLarge" style={{ color: theme.colors.onSecondaryContainer }}>
                {TEXTS.LOAN_FORM_FINANCED}
              </Text>
              <Text variant="titleLarge" style={{ color: theme.colors.onSecondaryContainer }}>
                {formatBRL(financed)}
              </Text>
            </Card.Content>
          </Card>

          <Button
            mode="contained"
            icon="calculator-variant"
            onPress={handleCalculate}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            {TEXTS.LOAN_FORM_CALCULATE}
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
