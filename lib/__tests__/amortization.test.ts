import {
  annualToMonthlyRate,
  buildSchedule,
  pricePayment,
  simulateLoan,
  yearlyBalances,
} from '../amortization';

describe('annualToMonthlyRate', () => {
  it('converte taxa efetiva anual em mensal equivalente', () => {
    expect(annualToMonthlyRate(12.682503)).toBeCloseTo(0.01, 8);
    expect(annualToMonthlyRate(0)).toBe(0);
  });

  it('compõe de volta para a taxa anual', () => {
    const monthly = annualToMonthlyRate(10.5);
    expect((Math.pow(1 + monthly, 12) - 1) * 100).toBeCloseTo(10.5, 10);
  });
});

describe('Price', () => {
  it('calcula a parcela fixa pela fórmula PMT', () => {
    expect(pricePayment(100_000, 0.01, 12)).toBeCloseTo(8884.88, 2);
  });

  it('divide o principal igualmente quando a taxa é zero', () => {
    expect(pricePayment(12_000, 0, 12)).toBe(1000);
  });

  it('mantém parcelas constantes e zera o saldo', () => {
    const schedule = buildSchedule(100_000, 0.01, 12, 'price');
    expect(schedule).toHaveLength(12);
    schedule.forEach((item) => expect(item.payment).toBeCloseTo(8884.88, 2));
    expect(schedule[11].balance).toBe(0);
    const amortized = schedule.reduce((sum, item) => sum + item.amortization, 0);
    expect(amortized).toBeCloseTo(100_000, 6);
  });
});

describe('SAC', () => {
  const schedule = buildSchedule(120_000, 0.01, 12, 'sac');

  it('amortiza valor constante com parcelas decrescentes', () => {
    schedule.forEach((item) => expect(item.amortization).toBeCloseTo(10_000, 6));
    expect(schedule[0].payment).toBeCloseTo(11_200, 6);
    expect(schedule[11].payment).toBeCloseTo(10_100, 6);
    for (let i = 1; i < schedule.length; i++) {
      expect(schedule[i].payment).toBeLessThan(schedule[i - 1].payment);
    }
  });

  it('cobra juros totais de i·P·(n+1)/2', () => {
    const interest = schedule.reduce((sum, item) => sum + item.interest, 0);
    expect(interest).toBeCloseTo(7_800, 6);
    expect(schedule[11].balance).toBe(0);
  });
});

describe('simulateLoan', () => {
  const base = { propertyValue: 500_000, downPayment: 100_000, annualRate: 10, years: 30 };

  it('calcula principal, prazo e totais', () => {
    const result = simulateLoan({ ...base, system: 'sac' });
    expect(result.principal).toBe(400_000);
    expect(result.months).toBe(360);
    expect(result.schedule).toHaveLength(360);
    expect(result.totalPaid).toBeCloseTo(result.principal + result.totalInterest, 6);
    expect(result.firstPayment).toBeGreaterThan(result.lastPayment);
  });

  it('SAC paga menos juros que Price nas mesmas condições', () => {
    const sac = simulateLoan({ ...base, system: 'sac' });
    const price = simulateLoan({ ...base, system: 'price' });
    expect(sac.totalInterest).toBeLessThan(price.totalInterest);
    expect(sac.firstPayment).toBeGreaterThan(price.firstPayment);
  });

  it('devolve o saldo no fim de cada ano', () => {
    const result = simulateLoan({ ...base, years: 2, system: 'sac' });
    const balances = yearlyBalances(result);
    expect(balances).toHaveLength(3);
    expect(balances[0]).toBe(400_000);
    expect(balances[1]).toBeCloseTo(200_000, 6);
    expect(balances[2]).toBe(0);
  });
});
