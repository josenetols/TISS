// =============================================================================
// Validadores — CNPJ, CNES, ANS, etc.
// =============================================================================

/** Formata CNPJ com máscara XX.XXX.XXX/XXXX-XX */
export function formatCNPJ(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

/** Valida CNPJ pelo algoritmo módulo 11 */
export function validarCNPJ(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, '');
  if (digits.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(digits)) return false;

  const calc = (base: number) => {
    let sum = 0;
    let weight = base;
    for (let i = 0; i < base - 1; i++) {
      sum += parseInt(digits[i]) * weight;
      weight--;
      if (weight < 2) weight = 9;
    }
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  return calc(13) === parseInt(digits[12]) && calc(14) === parseInt(digits[13]);
}

/** Valida CNES (7 dígitos) */
export function validarCNES(cnes: string): boolean {
  return /^\d{7}$/.test(cnes.replace(/\D/g, ''));
}

/** Valida Registro ANS (6 dígitos) */
export function validarRegistroANS(registro: string): boolean {
  return /^\d{6}$/.test(registro.replace(/\D/g, ''));
}

/** Valida data no formato YYYY-MM-DD */
export function validarData(data: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(data) && !isNaN(Date.parse(data));
}

/** Formata valor monetário para exibição */
export function formatMoney(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Formata valor monetário para XML (2 casas decimais, ponto como separador) */
export function formatMoneyXML(value: number): string {
  return value.toFixed(2);
}
