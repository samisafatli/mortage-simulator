import type { LoanInput } from '../amortization';
import { hasErrors, isLowDownPayment, parseLoanParams, toLoanParams, validateLoanInput } from '../validation';

const valid: LoanInput = { propertyValue: 500_000, downPayment: 100_000, annualRate: 10.5, years: 30, system: 'sac' };

describe('validateLoanInput', () => {
  it('aceita uma simulação válida', () => {
    expect(hasErrors(validateLoanInput(valid))).toBe(false);
  });

  it('aceita entrada zero', () => {
    expect(validateLoanInput({ ...valid, downPayment: 0 })).toEqual({});
  });

  it('rejeita entrada maior ou igual ao valor do imóvel', () => {
    expect(validateLoanInput({ ...valid, downPayment: 500_000 }).downPayment).toBeDefined();
  });

  it('valida faixas de taxa e prazo', () => {
    expect(validateLoanInput({ ...valid, annualRate: 0 }).annualRate).toBeDefined();
    expect(validateLoanInput({ ...valid, annualRate: 50.01 }).annualRate).toBeDefined();
    expect(validateLoanInput({ ...valid, years: 0 }).years).toBeDefined();
    expect(validateLoanInput({ ...valid, years: 41 }).years).toBeDefined();
    expect(validateLoanInput({ ...valid, years: 40 })).toEqual({});
  });

  it('rejeita imóvel sem valor', () => {
    expect(validateLoanInput({ ...valid, propertyValue: 0, downPayment: 0 }).propertyValue).toBeDefined();
  });
});

describe('isLowDownPayment', () => {
  it('sinaliza entrada abaixo de 20%', () => {
    expect(isLowDownPayment({ propertyValue: 500_000, downPayment: 99_999 })).toBe(true);
    expect(isLowDownPayment({ propertyValue: 500_000, downPayment: 100_000 })).toBe(false);
  });
});

describe('parseLoanParams', () => {
  it('faz ida e volta pelos parâmetros da rota', () => {
    expect(parseLoanParams(toLoanParams(valid))).toEqual(valid);
  });

  it('retorna null para parâmetros ausentes ou inválidos', () => {
    expect(parseLoanParams({})).toBeNull();
    expect(parseLoanParams({ ...toLoanParams(valid), system: 'xyz' })).toBeNull();
    expect(parseLoanParams({ ...toLoanParams(valid), years: 'abc' })).toBeNull();
  });
});
