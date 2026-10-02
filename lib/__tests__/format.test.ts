import { maskCurrency, maskInteger, maskRate, parseDigits, parseRate } from '../format';

// O Intl usa espaço não separável entre "R$" e o número; normalizamos para comparar.
const normalize = (text: string) => text.replace(/\s/g, ' ');

describe('maskCurrency', () => {
  it('formata dígitos como reais inteiros', () => {
    expect(normalize(maskCurrency('250000'))).toBe('R$ 250.000');
    expect(normalize(maskCurrency('R$ 1.2345'))).toBe('R$ 12.345');
  });

  it('remove zeros à esquerda e retorna vazio sem dígitos', () => {
    expect(normalize(maskCurrency('0005'))).toBe('R$ 5');
    expect(maskCurrency('R$ ')).toBe('');
    expect(maskCurrency('000')).toBe('');
  });

  it('permite apagar dígito a dígito', () => {
    expect(normalize(maskCurrency('R$ 1.00'))).toBe('R$ 100');
  });
});

describe('maskRate', () => {
  it('aceita uma vírgula e até duas casas decimais', () => {
    expect(maskRate('10,555')).toBe('10,55');
    expect(maskRate('10,5,5')).toBe('10,55');
    expect(maskRate('9.5')).toBe('9,5');
    expect(maskRate(',5')).toBe('0,5');
  });

  it('limita a parte inteira a dois dígitos', () => {
    expect(maskRate('1234')).toBe('12');
  });
});

describe('parsers', () => {
  it('converte texto em número', () => {
    expect(parseDigits('R$ 250.000')).toBe(250_000);
    expect(parseDigits('')).toBe(0);
    expect(parseRate('10,5')).toBe(10.5);
    expect(parseRate('')).toBe(0);
    expect(maskInteger('3a5x9', 2)).toBe('35');
  });
});
