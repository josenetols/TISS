// =============================================================================
// Tabela TUSS — Terminologia Unificada da Saúde Suplementar
// Subconjunto curado de códigos comuns para autocomplete
// Para carregar a tabela completa, substituir por import de JSON externo
// =============================================================================

export interface CodigoTUSS {
  codigo: string;
  descricao: string;
  categoria: string;
  valorReferencia?: number;  // Valor de referência sugerido (R$)
}

// Estrutura modular: pode ser substituída por fetch de JSON externo
export const TUSS_CODES: CodigoTUSS[] = [
  // ── Consultas ──
  { codigo: '10101012', descricao: 'Consulta em consultório (no horário normal)', categoria: 'Consultas', valorReferencia: 150.00 },
  { codigo: '10101020', descricao: 'Consulta em domicílio', categoria: 'Consultas', valorReferencia: 250.00 },
  { codigo: '10101039', descricao: 'Consulta em pronto-socorro', categoria: 'Consultas', valorReferencia: 180.00 },
  { codigo: '10102019', descricao: 'Consulta médica em atenção primária', categoria: 'Consultas', valorReferencia: 120.00 },
  { codigo: '10103015', descricao: 'Consulta em ambulatório de especialidades', categoria: 'Consultas', valorReferencia: 170.00 },

  // ── Exames Laboratoriais ──
  { codigo: '40301630', descricao: 'Hemograma completo', categoria: 'Exames Laboratoriais', valorReferencia: 15.00 },
  { codigo: '40302040', descricao: 'Glicose (dosagem)', categoria: 'Exames Laboratoriais', valorReferencia: 8.00 },
  { codigo: '40302059', descricao: 'Hemoglobina glicada (HbA1c)', categoria: 'Exames Laboratoriais', valorReferencia: 22.00 },
  { codigo: '40301087', descricao: 'Colesterol total', categoria: 'Exames Laboratoriais', valorReferencia: 10.00 },
  { codigo: '40301095', descricao: 'Colesterol HDL', categoria: 'Exames Laboratoriais', valorReferencia: 12.00 },
  { codigo: '40301109', descricao: 'Colesterol LDL', categoria: 'Exames Laboratoriais', valorReferencia: 12.00 },
  { codigo: '40301117', descricao: 'Triglicerídeos', categoria: 'Exames Laboratoriais', valorReferencia: 10.00 },
  { codigo: '40302423', descricao: 'Creatinina', categoria: 'Exames Laboratoriais', valorReferencia: 8.00 },
  { codigo: '40302580', descricao: 'Ureia', categoria: 'Exames Laboratoriais', valorReferencia: 8.00 },
  { codigo: '40301460', descricao: 'TSH (Hormônio Tireoestimulante)', categoria: 'Exames Laboratoriais', valorReferencia: 20.00 },
  { codigo: '40301478', descricao: 'T4 Livre', categoria: 'Exames Laboratoriais', valorReferencia: 20.00 },
  { codigo: '40304361', descricao: 'PSA Total', categoria: 'Exames Laboratoriais', valorReferencia: 25.00 },
  { codigo: '40301940', descricao: 'TGO (AST)', categoria: 'Exames Laboratoriais', valorReferencia: 8.00 },
  { codigo: '40301958', descricao: 'TGP (ALT)', categoria: 'Exames Laboratoriais', valorReferencia: 8.00 },
  { codigo: '40304060', descricao: 'Ácido úrico', categoria: 'Exames Laboratoriais', valorReferencia: 8.00 },
  { codigo: '40311031', descricao: 'Urina tipo I (EAS)', categoria: 'Exames Laboratoriais', valorReferencia: 10.00 },
  { codigo: '40301150', descricao: 'Potássio', categoria: 'Exames Laboratoriais', valorReferencia: 8.00 },
  { codigo: '40301168', descricao: 'Sódio', categoria: 'Exames Laboratoriais', valorReferencia: 8.00 },
  { codigo: '40301770', descricao: 'Ferro sérico', categoria: 'Exames Laboratoriais', valorReferencia: 12.00 },
  { codigo: '40301788', descricao: 'Ferritina', categoria: 'Exames Laboratoriais', valorReferencia: 25.00 },

  // ── Exames de Imagem ──
  { codigo: '40808017', descricao: 'Radiografia de tórax (PA e perfil)', categoria: 'Exames de Imagem', valorReferencia: 40.00 },
  { codigo: '40808084', descricao: 'Radiografia de coluna cervical', categoria: 'Exames de Imagem', valorReferencia: 45.00 },
  { codigo: '40808092', descricao: 'Radiografia de coluna lombo-sacra', categoria: 'Exames de Imagem', valorReferencia: 50.00 },
  { codigo: '40901017', descricao: 'Ultrassonografia de abdome total', categoria: 'Exames de Imagem', valorReferencia: 100.00 },
  { codigo: '40901050', descricao: 'Ultrassonografia de tireoide', categoria: 'Exames de Imagem', valorReferencia: 80.00 },
  { codigo: '40901084', descricao: 'Ultrassonografia pélvica / transvaginal', categoria: 'Exames de Imagem', valorReferencia: 90.00 },
  { codigo: '40901114', descricao: 'Ultrassonografia de mama bilateral', categoria: 'Exames de Imagem', valorReferencia: 90.00 },
  { codigo: '40501020', descricao: 'Tomografia computadorizada de crânio', categoria: 'Exames de Imagem', valorReferencia: 250.00 },
  { codigo: '40501012', descricao: 'Tomografia computadorizada de tórax', categoria: 'Exames de Imagem', valorReferencia: 280.00 },
  { codigo: '40601013', descricao: 'Ressonância magnética de crânio', categoria: 'Exames de Imagem', valorReferencia: 500.00 },
  { codigo: '40601021', descricao: 'Ressonância magnética de coluna', categoria: 'Exames de Imagem', valorReferencia: 550.00 },
  { codigo: '40401014', descricao: 'Mamografia bilateral', categoria: 'Exames de Imagem', valorReferencia: 70.00 },

  // ── Cardiologia ──
  { codigo: '40201058', descricao: 'Eletrocardiograma (ECG)', categoria: 'Cardiologia', valorReferencia: 30.00 },
  { codigo: '40201066', descricao: 'Teste ergométrico', categoria: 'Cardiologia', valorReferencia: 120.00 },
  { codigo: '40201074', descricao: 'Ecocardiograma transtorácico', categoria: 'Cardiologia', valorReferencia: 180.00 },
  { codigo: '40201082', descricao: 'Holter 24h', categoria: 'Cardiologia', valorReferencia: 150.00 },
  { codigo: '40201090', descricao: 'MAPA 24h', categoria: 'Cardiologia', valorReferencia: 130.00 },

  // ── Oftalmologia ──
  { codigo: '40202011', descricao: 'Fundoscopia / Mapeamento de retina', categoria: 'Oftalmologia', valorReferencia: 80.00 },
  { codigo: '40202020', descricao: 'Tonometria', categoria: 'Oftalmologia', valorReferencia: 40.00 },
  { codigo: '40202038', descricao: 'Campimetria computadorizada', categoria: 'Oftalmologia', valorReferencia: 90.00 },

  // ── Endoscopia ──
  { codigo: '40202160', descricao: 'Endoscopia digestiva alta', categoria: 'Endoscopia', valorReferencia: 250.00 },
  { codigo: '40202178', descricao: 'Colonoscopia', categoria: 'Endoscopia', valorReferencia: 400.00 },

  // ── Fisioterapia ──
  { codigo: '50000470', descricao: 'Sessão de fisioterapia motora', categoria: 'Fisioterapia', valorReferencia: 35.00 },
  { codigo: '50000489', descricao: 'Sessão de fisioterapia respiratória', categoria: 'Fisioterapia', valorReferencia: 35.00 },

  // ── Procedimentos Gerais ──
  { codigo: '20101015', descricao: 'Curativo grau I (pequeno)', categoria: 'Procedimentos', valorReferencia: 20.00 },
  { codigo: '20101023', descricao: 'Curativo grau II (médio)', categoria: 'Procedimentos', valorReferencia: 35.00 },
  { codigo: '20104014', descricao: 'Retirada de pontos', categoria: 'Procedimentos', valorReferencia: 15.00 },
];

/**
 * Busca códigos TUSS por código ou descrição.
 * Projetado para ser modular — pode ser substituído por uma busca em JSON externo.
 */
export function buscarCodigosTUSS(termo: string, limite: number = 10): CodigoTUSS[] {
  if (!termo || termo.trim().length < 2) return [];

  const termoNormalizado = termo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  return TUSS_CODES
    .filter((item) => {
      const codigoMatch = item.codigo.includes(termo);
      const descricaoNormalizada = item.descricao.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const descricaoMatch = descricaoNormalizada.includes(termoNormalizado);
      return codigoMatch || descricaoMatch;
    })
    .slice(0, limite);
}

/**
 * Busca um código TUSS específico pelo código exato.
 */
export function buscarCodigoExato(codigo: string): CodigoTUSS | undefined {
  return TUSS_CODES.find((item) => item.codigo === codigo);
}

/**
 * Retorna todas as categorias disponíveis.
 */
export function obterCategorias(): string[] {
  return [...new Set(TUSS_CODES.map((item) => item.categoria))];
}
