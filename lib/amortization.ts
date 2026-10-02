export type AmortizationSystem = 'sac' | 'price';

export type LoanInput = {
  propertyValue: number;
  downPayment: number;
  /** Taxa efetiva anual, em porcentagem (ex.: 10.5 = 10,5% a.a.). */
  annualRate: number;
  years: number;
  system: AmortizationSystem;
};

export type Installment = {
  month: number;
  payment: number;
  interest: number;
  amortization: number;
  balance: number;
};

export type LoanResult = {
  principal: number;
  monthlyRate: number;
  months: number;
  schedule: Installment[];
  firstPayment: number;
  lastPayment: number;
  totalPaid: number;
  totalInterest: number;
};

/**
 * Converte a taxa efetiva anual (padrão dos bancos brasileiros) para a taxa
 * mensal equivalente: (1 + a)^(1/12) - 1.
 */
export function annualToMonthlyRate(annualRatePercent: number): number {
  return Math.pow(1 + annualRatePercent / 100, 1 / 12) - 1;
}

export function pricePayment(principal: number, monthlyRate: number, months: number): number {
  if (monthlyRate === 0) return principal / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
}

export function buildSchedule(
  principal: number,
  monthlyRate: number,
  months: number,
  system: AmortizationSystem,
): Installment[] {
  const schedule: Installment[] = [];
  const fixedPayment = system === 'price' ? pricePayment(principal, monthlyRate, months) : 0;
  const fixedAmortization = principal / months;
  let balance = principal;

  for (let month = 1; month <= months; month++) {
    const interest = balance * monthlyRate;
    let amortization = system === 'price' ? fixedPayment - interest : fixedAmortization;

    // Na última parcela quita o saldo restante, eliminando resíduos de ponto flutuante.
    if (month === months) amortization = balance;

    balance -= amortization;
    schedule.push({
      month,
      payment: amortization + interest,
      interest,
      amortization,
      balance: Math.max(balance, 0),
    });
  }

  return schedule;
}

export function simulateLoan(input: LoanInput): LoanResult {
  const principal = input.propertyValue - input.downPayment;
  const months = Math.round(input.years * 12);
  const monthlyRate = annualToMonthlyRate(input.annualRate);
  const schedule = buildSchedule(principal, monthlyRate, months, input.system);
  const totalPaid = schedule.reduce((sum, item) => sum + item.payment, 0);

  return {
    principal,
    monthlyRate,
    months,
    schedule,
    firstPayment: schedule[0]?.payment ?? 0,
    lastPayment: schedule[schedule.length - 1]?.payment ?? 0,
    totalPaid,
    totalInterest: totalPaid - principal,
  };
}

export type YearSummary = {
  year: number;
  /** Soma das parcelas pagas no ano. */
  paid: number;
  interest: number;
  amortization: number;
  /** Saldo devedor ao fim do ano. */
  balance: number;
  installments: Installment[];
};

/** Agrupa o cronograma em anos de 12 parcelas, com os totais de cada ano. */
export function groupByYear(schedule: Installment[]): YearSummary[] {
  const years: YearSummary[] = [];
  for (let start = 0; start < schedule.length; start += 12) {
    const installments = schedule.slice(start, start + 12);
    years.push({
      year: start / 12 + 1,
      paid: installments.reduce((sum, item) => sum + item.payment, 0),
      interest: installments.reduce((sum, item) => sum + item.interest, 0),
      amortization: installments.reduce((sum, item) => sum + item.amortization, 0),
      balance: installments[installments.length - 1].balance,
      installments,
    });
  }
  return years;
}

/** Saldo devedor ao fim de cada ano, começando pelo valor financiado (ano 0). */
export function yearlyBalances(result: LoanResult): number[] {
  const balances = [result.principal];
  for (let month = 12; month <= result.months; month += 12) {
    balances.push(result.schedule[month - 1].balance);
  }
  return balances;
}
