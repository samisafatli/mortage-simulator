import { TEXTS } from '@/constants/texts';
import type { AmortizationSystem, LoanInput } from './amortization';

export const LIMITS = {
  maxPropertyValue: 100_000_000,
  maxAnnualRate: 50,
  minYears: 1,
  maxYears: 40,
  /** A maioria dos bancos financia no máximo 80% do valor do imóvel. */
  recommendedMinDownPaymentRatio: 0.2,
};

export type LoanField = 'propertyValue' | 'downPayment' | 'annualRate' | 'years';
export type LoanErrors = Partial<Record<LoanField, string>>;

export function validateLoanInput(input: LoanInput): LoanErrors {
  const errors: LoanErrors = {};

  if (!(input.propertyValue > 0)) {
    errors.propertyValue = TEXTS.ERROR_PROPERTY_REQUIRED;
  } else if (input.propertyValue > LIMITS.maxPropertyValue) {
    errors.propertyValue = TEXTS.ERROR_PROPERTY_TOO_HIGH;
  }

  if (!(input.downPayment >= 0)) {
    errors.downPayment = TEXTS.ERROR_DOWN_PAYMENT_INVALID;
  } else if (input.propertyValue > 0 && input.downPayment >= input.propertyValue) {
    errors.downPayment = TEXTS.ERROR_DOWN_PAYMENT_TOO_HIGH;
  }

  if (!(input.annualRate > 0) || input.annualRate > LIMITS.maxAnnualRate) {
    errors.annualRate = TEXTS.ERROR_RATE_RANGE;
  }

  if (!Number.isInteger(input.years) || input.years < LIMITS.minYears || input.years > LIMITS.maxYears) {
    errors.years = TEXTS.ERROR_YEARS_RANGE;
  }

  return errors;
}

export function hasErrors(errors: LoanErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function isLowDownPayment(input: Pick<LoanInput, 'propertyValue' | 'downPayment'>): boolean {
  return (
    input.propertyValue > 0 &&
    input.downPayment < input.propertyValue * LIMITS.recommendedMinDownPaymentRatio
  );
}

export type LoanParams = {
  propertyValue?: string;
  downPayment?: string;
  annualRate?: string;
  years?: string;
  system?: string;
};

export function toLoanParams(input: LoanInput): Record<keyof LoanParams, string> {
  return {
    propertyValue: String(input.propertyValue),
    downPayment: String(input.downPayment),
    annualRate: String(input.annualRate),
    years: String(input.years),
    system: input.system,
  };
}

/** Converte os parâmetros da rota de volta em LoanInput, ou null se forem inválidos. */
export function parseLoanParams(params: LoanParams): LoanInput | null {
  const system: AmortizationSystem | null =
    params.system === 'sac' || params.system === 'price' ? params.system : null;
  if (!system) return null;

  const input: LoanInput = {
    propertyValue: Number(params.propertyValue),
    downPayment: Number(params.downPayment),
    annualRate: Number(params.annualRate),
    years: Number(params.years),
    system,
  };

  return hasErrors(validateLoanInput(input)) ? null : input;
}
