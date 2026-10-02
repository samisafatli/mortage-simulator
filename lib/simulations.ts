import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LoanInput } from './amortization';

const STORAGE_KEY = 'simulations';

export type SavedSimulation = {
  id: string;
  createdAt: string;
  input: LoanInput;
};

/** Formato gravado pela versão 1.0.x do app (valores como string). */
type LegacySimulation = {
  id: string;
  propertyValue: string;
  downPayment: string;
  interestRate: string;
  loanTerm: string;
  amortizationSystem: string;
};

function normalize(raw: unknown): SavedSimulation | null {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw as Partial<SavedSimulation> & Partial<LegacySimulation>;

  if (item.input && item.id && item.createdAt) {
    return { id: item.id, createdAt: item.createdAt, input: item.input };
  }

  if (item.id && item.propertyValue !== undefined) {
    const timestamp = Number(item.id);
    return {
      id: item.id,
      createdAt: new Date(Number.isFinite(timestamp) ? timestamp : Date.now()).toISOString(),
      input: {
        propertyValue: Number(item.propertyValue),
        downPayment: Number(item.downPayment),
        annualRate: Number(item.interestRate),
        years: Number(item.loanTerm),
        system: item.amortizationSystem === 'price' ? 'price' : 'sac',
      },
    };
  }

  return null;
}

async function readAll(): Promise<SavedSimulation[]> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalize).filter((sim): sim is SavedSimulation => sim !== null);
  } catch {
    return [];
  }
}

async function writeAll(simulations: SavedSimulation[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(simulations));
}

export function isSameInput(a: LoanInput, b: LoanInput): boolean {
  return (
    a.propertyValue === b.propertyValue &&
    a.downPayment === b.downPayment &&
    a.annualRate === b.annualRate &&
    a.years === b.years &&
    a.system === b.system
  );
}

/** Simulações salvas, da mais recente para a mais antiga. */
export async function loadSimulations(): Promise<SavedSimulation[]> {
  const simulations = await readAll();
  return simulations.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function findSimulation(input: LoanInput): Promise<SavedSimulation | undefined> {
  const simulations = await readAll();
  return simulations.find((sim) => isSameInput(sim.input, input));
}

/** Salva a simulação; se uma idêntica já existir, devolve a existente sem duplicar. */
export async function saveSimulation(input: LoanInput): Promise<SavedSimulation> {
  const simulations = await readAll();
  const existing = simulations.find((sim) => isSameInput(sim.input, input));
  if (existing) return existing;

  const simulation: SavedSimulation = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    input,
  };
  await writeAll([...simulations, simulation]);
  return simulation;
}

export async function deleteSimulation(id: string): Promise<void> {
  const simulations = await readAll();
  await writeAll(simulations.filter((sim) => sim.id !== id));
}
