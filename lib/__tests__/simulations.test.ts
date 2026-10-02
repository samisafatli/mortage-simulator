import AsyncStorage from '@react-native-async-storage/async-storage';

import type { LoanInput } from '../amortization';
import { deleteSimulation, findSimulation, loadSimulations, saveSimulation } from '../simulations';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const input: LoanInput = { propertyValue: 500_000, downPayment: 100_000, annualRate: 10, years: 30, system: 'price' };

beforeEach(async () => {
  await AsyncStorage.clear();
});

it('migra simulações gravadas no formato antigo', async () => {
  await AsyncStorage.setItem(
    'simulations',
    JSON.stringify([
      {
        id: '1700000000000',
        propertyValue: '300000',
        downPayment: '60000',
        interestRate: '9.5',
        loanTerm: '20',
        amortizationSystem: 'sac',
        totalPaidAmount: '400000',
        date: '14/11/2023',
      },
    ]),
  );

  const [legacy] = await loadSimulations();
  expect(legacy.input).toEqual({ propertyValue: 300_000, downPayment: 60_000, annualRate: 9.5, years: 20, system: 'sac' });
  expect(legacy.createdAt).toBe(new Date(1_700_000_000_000).toISOString());
});

it('não duplica uma simulação idêntica', async () => {
  const first = await saveSimulation(input);
  const second = await saveSimulation({ ...input });
  expect(second.id).toBe(first.id);
  expect(await loadSimulations()).toHaveLength(1);
  expect(await findSimulation(input)).toBeDefined();
});

it('exclui pelo id', async () => {
  const saved = await saveSimulation(input);
  await deleteSimulation(saved.id);
  expect(await loadSimulations()).toEqual([]);
});

it('ignora dados corrompidos', async () => {
  await AsyncStorage.setItem('simulations', '{not json');
  expect(await loadSimulations()).toEqual([]);
});
