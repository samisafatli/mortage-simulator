const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const integerFormatter = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
const percentFormatter = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });

export function formatBRL(value: number): string {
  return currencyFormatter.format(value);
}

/** Moeda sem centavos, para eixos e rótulos compactos. */
export function formatBRLShort(value: number): string {
  if (value >= 1_000_000) return `R$ ${percentFormatter.format(value / 1_000_000)} mi`;
  if (value >= 1_000) return `R$ ${integerFormatter.format(value / 1_000)} mil`;
  return `R$ ${integerFormatter.format(value)}`;
}

export function formatPercent(value: number, fractionDigits = 2): string {
  return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: fractionDigits }).format(value)}%`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR');
}

/** Mantém só os dígitos e devolve o número inteiro correspondente (ou 0). */
export function parseDigits(text: string): number {
  const digits = text.replace(/\D/g, '');
  return digits ? Number(digits) : 0;
}

/** Máscara de moeda em reais inteiros, aplicada durante a digitação: "250000" → "R$ 250.000". */
export function maskCurrency(text: string): string {
  const digits = text.replace(/\D/g, '').replace(/^0+/, '').slice(0, 12);
  return digits ? `R$ ${integerFormatter.format(Number(digits))}` : '';
}

/** Máscara de taxa: dígitos e uma vírgula, com no máximo 2 casas decimais. */
export function maskRate(text: string): string {
  const cleaned = text.replace(/\./g, ',').replace(/[^\d,]/g, '');
  const [integer, ...rest] = cleaned.split(',');
  const intPart = integer.slice(0, 2);
  if (rest.length === 0) return intPart;
  return `${intPart || '0'},${rest.join('').slice(0, 2)}`;
}

export function parseRate(text: string): number {
  const value = parseFloat(text.replace(',', '.'));
  return Number.isFinite(value) ? value : 0;
}

export function maskInteger(text: string, maxLength: number): string {
  return text.replace(/\D/g, '').slice(0, maxLength);
}
