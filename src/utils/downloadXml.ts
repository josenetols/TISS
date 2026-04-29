import type { TipoGuia } from '../types/tiss';
import type { FormState } from '../hooks/useFormState';
import { generateMensagemTISS, type TipoGuiaXML } from './xmlGenerator';
import { calcularHashTISS } from './hashCalculator';

// =============================================================================
// Download XML — Gera, calcula hash, e faz download do arquivo
// =============================================================================

interface DownloadResult {
  success: boolean;
  filename?: string;
  error?: string;
}

/**
 * Gera o XML TISS completo, calcula o hash MD5 e dispara o download.
 */
export function generateAndDownloadXML(
  formState: FormState,
  tipoGuia: TipoGuia
): DownloadResult {
  try {
    const tipo: TipoGuiaXML = tipoGuia;

    // Montar parâmetros
    const params = {
      prestador: formState.prestador,
      operadora: formState.operadora,
      lote: formState.lote,
      guiaConsulta: tipo === 'consulta' ? formState.guiaConsulta : undefined,
      guiaSADT: tipo === 'sadt' ? formState.guiaSADT : undefined,
    };

    // Gerar XML com placeholder de hash
    let xml = generateMensagemTISS(params, tipo);

    // Calcular hash MD5
    const hash = calcularHashTISS(xml);

    // Substituir placeholder pelo hash calculado
    xml = xml.replace('{{HASH_PLACEHOLDER}}', hash);

    // Criar o nome do arquivo
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const guiaLabel = tipo === 'consulta' ? 'Consulta' : 'SP-SADT';
    const filename = `TISS_${guiaLabel}_${date}_Lote${formState.lote.numeroLote}.xml`;

    // Disparar download
    downloadFile(xml, filename, 'application/xml');

    return { success: true, filename };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Erro desconhecido',
    };
  }
}

/**
 * Cria um blob e dispara o download no navegador.
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
