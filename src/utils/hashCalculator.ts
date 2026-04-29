import MD5 from 'crypto-js/md5';
import Latin1 from 'crypto-js/enc-latin1';

// =============================================================================
// Hash MD5 — Cálculo conforme regras TISS
//
// Regras ANS:
// 1. Extrair APENAS o conteúdo de texto das tags XML (não incluir nomes de tags)
// 2. Concatenar todos os valores sequencialmente (esquerda para direita)
// 3. NÃO incluir a tag <ans:hash> no cálculo
// 4. Calcular MD5 usando codificação ISO-8859-1 (Latin-1)
// 5. Resultado: 32 caracteres hexadecimais lowercase
// =============================================================================

/**
 * Extrai todo o conteúdo de texto de um XML, ignorando nomes de tags.
 * Segue a regra TISS de concatenar valores sequencialmente.
 */
function extractTextContent(xml: string): string {
  // Remove a tag <ans:hash>...</ans:hash> do cálculo
  const xmlSemHash = xml.replace(/<ans:hash>.*?<\/ans:hash>/g, '<ans:hash></ans:hash>');

  // Usa DOMParser para extrair conteúdo de texto
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlSemHash, 'text/xml');

  const textParts: string[] = [];

  function walk(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        textParts.push(text);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      for (let i = 0; i < node.childNodes.length; i++) {
        walk(node.childNodes[i]);
      }
    }
  }

  walk(doc.documentElement);
  return textParts.join('');
}

/**
 * Calcula o hash MD5 conforme especificação TISS.
 * Usa codificação ISO-8859-1 (Latin-1) para o cálculo.
 *
 * @param xml - String XML completa (sem o hash preenchido)
 * @returns Hash MD5 de 32 caracteres hexadecimais
 */
export function calcularHashTISS(xml: string): string {
  const content = extractTextContent(xml);

  // crypto-js MD5 com encoding Latin1 (ISO-8859-1)
  const wordArray = Latin1.parse(content);
  const hash = MD5(wordArray);

  return hash.toString();
}
