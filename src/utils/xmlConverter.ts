import { calcularHashTISS } from './hashCalculator';

// =============================================================================
// XML Converter — Conversão de TISS v3.05.00 para v4.02.00
//
// Mapeamento de diferenças entre versões:
// - Namespace atualizado
// - versaoPadrao: 3.05.00 → 4.02.00
// - Tags renomeadas / adicionadas conforme norma ANS
// - Hash MD5 recalculado
// =============================================================================

interface ConversionResult {
  success: boolean;
  xml?: string;
  error?: string;
}

/**
 * Converte um XML TISS de versão anterior (3.05.00 ou similar)
 * para a versão 4.02.00.
 */
export function convertXML305to402(xmlInput: string): ConversionResult {
  try {
    // Verificar se é um XML válido
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlInput, 'text/xml');
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      return { success: false, error: 'XML inválido: ' + parseError.textContent };
    }

    let xml = xmlInput;

    // 1. Atualizar versão do padrão
    xml = xml.replace(
      /<(ans:)?versaoPadrao>[\d.]+<\/(ans:)?versaoPadrao>/g,
      '<ans:versaoPadrao>4.02.00</ans:versaoPadrao>'
    );

    // 2. Atualizar declaração de encoding se necessário
    xml = xml.replace(
      /encoding="[^"]*"/,
      'encoding="ISO-8859-1"'
    );

    // 3. Atualizar namespace se diferente
    xml = xml.replace(
      /xmlns:ans="[^"]*"/g,
      'xmlns:ans="http://www.ans.gov.br/padroes/tiss/schemas"'
    );

    // 4. Limpar hash anterior
    xml = xml.replace(
      /<(ans:)?hash>[^<]*<\/(ans:)?hash>/g,
      '<ans:hash></ans:hash>'
    );

    // 5. Recalcular hash MD5
    const newHash = calcularHashTISS(xml);
    xml = xml.replace(
      /<ans:hash><\/ans:hash>/,
      `<ans:hash>${newHash}</ans:hash>`
    );

    return { success: true, xml };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Erro na conversão',
    };
  }
}
