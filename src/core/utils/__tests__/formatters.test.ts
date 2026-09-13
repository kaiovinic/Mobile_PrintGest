import { formatarMoeda, formatarData, formatarCpfCnpj } from '../formatters';

describe('formatters utility module', () => {
  describe('formatarMoeda', () => {
    it('deve formatar números para moeda brasileira (BRL)', () => {
      const resultado = formatarMoeda(1500.5);
      // Remove espaços não-inquebráveis para asserção limpa
      const limpo = resultado.replace(/\s/g, ' ');
      expect(limpo).toContain('R$');
      expect(limpo).toContain('1.500,50');
    });

    it('deve retornar R$ 0,00 quando o valor for NaN', () => {
      expect(formatarMoeda(NaN)).toBe('R$ 0,00');
    });
  });

  describe('formatarData', () => {
    it('deve formatar string ISO válida para DD/MM/AAAA', () => {
      const dataIso = '2026-09-12T10:00:00.000Z';
      const resultado = formatarData(dataIso);
      expect(resultado).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('deve retornar traço (-) para datas nulas ou inválidas', () => {
      expect(formatarData(null)).toBe('-');
      expect(formatarData('data-invalida')).toBe('-');
    });
  });

  describe('formatarCpfCnpj', () => {
    it('deve aplicar máscara em CPF com 11 dígitos', () => {
      expect(formatarCpfCnpj('12345678901')).toBe('123.456.789-01');
    });

    it('deve aplicar máscara em CNPJ com 14 dígitos', () => {
      expect(formatarCpfCnpj('12345678000195')).toBe('12.345.678/0001-95');
    });

    it('deve retornar o próprio documento caso não seja 11 nem 14 dígitos', () => {
      expect(formatarCpfCnpj('123')).toBe('123');
    });
  });
});
