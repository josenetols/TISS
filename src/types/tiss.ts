// =============================================================================
// Tipos de dados para o padrão TISS 4.02.00
// Referência: ANS — Troca de Informação em Saúde Suplementar
// =============================================================================

// --- Cabeçalho da Mensagem TISS ---

export interface CabecalhoTransacao {
  tipoTransacao: 'ENVIO_LOTE_GUIAS';
  sequencialTransacao: string;
  dataRegistroTransacao: string;  // YYYY-MM-DD
  horaRegistroTransacao: string;  // HH:MM:SS
  versaoPadrao: '4.02.00';
}

// --- Dados do Prestador (Contratado) ---

export interface DadosPrestador {
  cnpj: string;               // 14 dígitos
  cnes: string;               // 7 dígitos
  nomeContratado: string;
}

// --- Dados da Operadora (Destino) ---

export interface DadosOperadora {
  registroANS: string;         // 6 dígitos — Registro ANS da operadora
}

// --- Dados do Lote ---

export interface DadosLote {
  numeroLote: string;
}

// --- Dados do Beneficiário (Paciente) ---

export interface DadosBeneficiario {
  numeroCarteira: string;
  nomeBeneficiario: string;
  numeroCNS?: string;          // Cartão Nacional de Saúde (opcional)
  atendimentoRN: 'S' | 'N';   // Recém-nascido?
}

// --- Dados do Profissional ---

export interface DadosProfissional {
  nomeProfissional: string;
  conselhoProfissional: string;  // Ex: "06" (CRM), "07" (CRO)
  numeroConselho: string;
  ufConselho: string;            // Ex: "SP", "RJ"
  codigoCBO: string;             // Classificação Brasileira de Ocupações
}

// --- Procedimento Executado (TUSS) ---

export interface Procedimento {
  id: string;                     // ID interno para React keys
  codigoTabela: string;           // Código da tabela (ex: "22" para TUSS)
  codigoProcedimento: string;     // Código TUSS
  descricaoProcedimento: string;
  quantidadeExecutada: number;
  valorUnitario: number;
  valorTotal: number;
  dataExecucao: string;           // YYYY-MM-DD
}

// --- Cabeçalho da Guia ---

export interface CabecalhoGuia {
  numeroGuiaPrestador: string;
  numeroGuiaOperadora?: string;   // Preenchido pela operadora (opcional)
}

// --- Guia de Consulta ---

export interface GuiaConsulta {
  cabecalhoGuia: CabecalhoGuia;
  dadosBeneficiario: DadosBeneficiario;
  profissionalExecutante: DadosProfissional;
  indicacaoAcidente: string;
  /**
   * Tipo de consulta:
   * 1 - Primeira consulta
   * 2 - Retorno / Seguimento
   * 3 - Pré-natal
   * 4 - Por encaminhamento
   */
  tipoConsulta: string;
  codigoConsulta: string;          // Código TUSS da consulta
  dataAtendimento: string;         // YYYY-MM-DD
  valorProcedimento: number;
}

// --- Guia SP/SADT ---

export interface GuiaSADT {
  cabecalhoGuia: CabecalhoGuia;
  dadosBeneficiario: DadosBeneficiario;
  dadosSolicitante: DadosProfissional;
  contratadoExecutante: {
    cnpjContratado: string;
    nomeContratado: string;
    cnesContratado: string;
  };
  profissionalExecutante: DadosProfissional;
  procedimentosExecutados: Procedimento[];
  indicacaoClinica?: string;
  /**
   * Caráter do atendimento:
   * 1 - Eletivo
   * 2 - Urgência / Emergência
   */
  caraterAtendimento: string;
  dataAtendimento: string;         // YYYY-MM-DD
  /**
   * Tipo de atendimento:
   * 05 - SADT
   * 04 - Quimioterapia
   * etc.
   */
  tipoAtendimento: string;
  indicacaoAcidente: string;
  /**
   * Tipo de saída:
   * 1 - Alta curado
   * 2 - Alta melhorado
   * 3 - Alta a pedido
   * 4 - Alta com previsão de retorno
   * 5 - Alta por evasão
   * 6 - Alta por conveniência administrativa
   * 7 - Encerramento administrativo
   * 8 - Permanência
   * 9 - Transferência
   * 10 - Óbito
   * 11 - Óbito por diagnóstico principal
   * 12 - Alta da mãe/puérpera e recém-nascido
   */
  tipoSaida: string;
}

// --- Formulário Completo (Estado do App) ---

export type TipoGuia = 'consulta' | 'sadt';

export interface FormularioTISS {
  tipoGuia: TipoGuia;
  prestador: DadosPrestador;
  operadora: DadosOperadora;
  lote: DadosLote;
  guiaConsulta?: GuiaConsulta;
  guiaSADT?: GuiaSADT;
}

// --- Tabelas de Domínio TISS ---

export const TIPOS_CONSULTA = [
  { valor: '1', descricao: 'Primeira consulta' },
  { valor: '2', descricao: 'Retorno / Seguimento' },
  { valor: '3', descricao: 'Pré-natal' },
  { valor: '4', descricao: 'Por encaminhamento' },
] as const;

export const CARATER_ATENDIMENTO = [
  { valor: '1', descricao: 'Eletivo' },
  { valor: '2', descricao: 'Urgência / Emergência' },
] as const;

export const INDICACAO_ACIDENTE = [
  { valor: '0', descricao: 'Acidente de trabalho' },
  { valor: '1', descricao: 'Acidente de trânsito' },
  { valor: '2', descricao: 'Outros acidentes' },
  { valor: '9', descricao: 'Não acidente' },
] as const;

export const TIPO_ATENDIMENTO = [
  { valor: '01', descricao: 'Remoção' },
  { valor: '02', descricao: 'Pequena cirurgia' },
  { valor: '03', descricao: 'Terapias' },
  { valor: '04', descricao: 'Quimioterapia' },
  { valor: '05', descricao: 'SADT' },
  { valor: '06', descricao: 'Radioterapia' },
  { valor: '07', descricao: 'TRS - Terapia Renal Substitutiva' },
] as const;

export const TIPO_SAIDA = [
  { valor: '1', descricao: 'Alta curado' },
  { valor: '2', descricao: 'Alta melhorado' },
  { valor: '3', descricao: 'Alta a pedido' },
  { valor: '4', descricao: 'Alta com previsão de retorno' },
  { valor: '5', descricao: 'Alta por evasão' },
  { valor: '6', descricao: 'Alta por conveniência administrativa' },
  { valor: '7', descricao: 'Encerramento administrativo' },
  { valor: '8', descricao: 'Permanência' },
  { valor: '9', descricao: 'Transferência' },
  { valor: '10', descricao: 'Óbito' },
  { valor: '11', descricao: 'Óbito pelo diagnóstico principal' },
  { valor: '12', descricao: 'Alta da mãe/puérpera e recém-nascido' },
] as const;

export const CONSELHOS_PROFISSIONAIS = [
  { valor: '01', descricao: 'CRAS' },
  { valor: '02', descricao: 'COREN' },
  { valor: '03', descricao: 'CRF' },
  { valor: '04', descricao: 'CRFA' },
  { valor: '05', descricao: 'CREFITO' },
  { valor: '06', descricao: 'CRM' },
  { valor: '07', descricao: 'CRO' },
  { valor: '08', descricao: 'CRP' },
  { valor: '09', descricao: 'CRN' },
  { valor: '10', descricao: 'CONRE' },
  { valor: '11', descricao: 'CRBM' },
  { valor: '12', descricao: 'CRBIO' },
  { valor: '13', descricao: 'COFFITO' },
  { valor: '14', descricao: 'OUTROS' },
] as const;

export const UFS_BRASIL = [
  'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR',
  'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO',
] as const;
