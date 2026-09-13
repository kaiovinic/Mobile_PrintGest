/**
 * Formata um valor numérico para o padrão de moeda brasileira (R$ 1.250,00).
 */
export function formatarMoeda(valor: number): string {
  if (isNaN(valor)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

/**
 * Formata uma string de data (ISO) para o padrão brasileiro (DD/MM/AAAA).
 */
export function formatarData(dataIso: string | null | undefined): string {
  if (!dataIso) return '-';
  try {
    const data = new Date(dataIso);
    if (isNaN(data.getTime())) return '-';
    return new Intl.DateTimeFormat('pt-BR').format(data);
  } catch {
    return '-';
  }
}

/**
 * Formata um CPF ou CNPJ com a máscara visual correspondente.
 */
export function formatarCpfCnpj(documento: string | null | undefined): string {
  if (!documento) return '-';
  const limpo = documento.replace(/\D/g, '');

  if (limpo.length === 11) {
    return limpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  if (limpo.length === 14) {
    return limpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  return documento;
}
