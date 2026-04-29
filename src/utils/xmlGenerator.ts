import type { DadosPrestador, DadosOperadora, DadosLote, GuiaConsulta, GuiaSADT, DadosBeneficiario, DadosProfissional, Procedimento } from '../types/tiss';
import { formatMoneyXML } from './validators';

// =============================================================================
// XML Generator — Geração do XML TISS 4.02.00
// =============================================================================

const NS = 'ans';
const TISS_NS = 'http://www.ans.gov.br/padroes/tiss/schemas';
const XSI_NS = 'http://www.w3.org/2001/XMLSchema-instance';
const VERSAO = '4.02.00';

function tag(name: string, content: string, attrs?: string): string {
  const a = attrs ? ` ${attrs}` : '';
  return `<${NS}:${name}${a}>${content}</${NS}:${name}>`;
}

function tagOpt(name: string, content: string | undefined | null): string {
  if (!content) return '';
  return tag(name, content);
}

function now(): { date: string; time: string } {
  const d = new Date();
  const date = d.toISOString().split('T')[0];
  const time = d.toTimeString().split(' ')[0];
  return { date, time };
}

// ── Cabeçalho ──

function generateCabecalho(operadora: DadosOperadora, sequencial: string): string {
  const { date, time } = now();
  return tag('cabecalho',
    tag('identificacaoTransacao',
      tag('tipoTransacao', 'ENVIO_LOTE_GUIAS') +
      tag('sequencialTransacao', sequencial) +
      tag('dataRegistroTransacao', date) +
      tag('horaRegistroTransacao', time)
    ) +
    tag('origem',
      tag('identificacaoPrestador',
        tag('registroANS', operadora.registroANS)
      )
    ) +
    tag('destino',
      tag('registroANS', operadora.registroANS)
    ) +
    tag('versaoPadrao', VERSAO)
  );
}

// ── Beneficiário ──

function generateBeneficiario(b: DadosBeneficiario): string {
  return tag('dadosBeneficiario',
    tag('numeroCarteira', b.numeroCarteira) +
    tag('atendimentoRN', b.atendimentoRN) +
    tag('nomeBeneficiario', b.nomeBeneficiario) +
    tagOpt('numeroCNS', b.numeroCNS)
  );
}

// ── Profissional ──

function generateProfissional(tagName: string, p: DadosProfissional): string {
  return tag(tagName,
    tag('nomeProfissional', p.nomeProfissional) +
    tag('conselhoProfissional', p.conselhoProfissional) +
    tag('numeroConselhoProfissional', p.numeroConselho) +
    tag('UF', p.ufConselho) +
    tag('CNES', '0000000') +
    tag('codigoCBO', p.codigoCBO)
  );
}

// ── Guia de Consulta ──

function generateGuiaConsulta(guia: GuiaConsulta, prestador: DadosPrestador): string {
  return tag('guiaConsulta',
    tag('cabecalhoGuia',
      tag('registroANS', '000000') +
      tag('numeroGuiaPrestador', guia.cabecalhoGuia.numeroGuiaPrestador)
    ) +
    generateBeneficiario(guia.dadosBeneficiario) +
    tag('contratadoExecutante',
      tag('cnpjContratado', prestador.cnpj) +
      tag('nomeContratado', prestador.nomeContratado) +
      tag('CNES', prestador.cnes)
    ) +
    tag('dadosAtendimento',
      tag('dataAtendimento', guia.dataAtendimento) +
      tag('tipoConsulta', guia.tipoConsulta) +
      tag('indicacaoAcidente', guia.indicacaoAcidente) +
      tag('codigoTabela', '22') +
      tag('codigoProcedimento', guia.codigoConsulta) +
      tag('valorProcedimento', formatMoneyXML(guia.valorProcedimento))
    ) +
    generateProfissional('profissionalExecutante', guia.profissionalExecutante)
  );
}

// ── Procedimento Executado ──

function generateProcedimento(proc: Procedimento, prof: DadosProfissional, seq: number): string {
  return tag('procedimentoExecutado',
    tag('sequencialItem', String(seq)) +
    tag('dataExecucao', proc.dataExecucao) +
    tag('horaInicial', '08:00:00') +
    tag('horaFinal', '08:30:00') +
    tag('codigoTabela', proc.codigoTabela || '22') +
    tag('codigoProcedimento', proc.codigoProcedimento) +
    tag('quantidadeExecutada', String(proc.quantidadeExecutada)) +
    tag('valorUnitario', formatMoneyXML(proc.valorUnitario)) +
    tag('valorTotal', formatMoneyXML(proc.valorTotal)) +
    generateProfissional('equipeSadt', prof)
  );
}

// ── Guia SP/SADT ──

function generateGuiaSADT(guia: GuiaSADT, prestador: DadosPrestador): string {
  const procsXml = guia.procedimentosExecutados
    .map((proc, i) => generateProcedimento(proc, guia.profissionalExecutante, i + 1))
    .join('\n');

  const totalGeral = guia.procedimentosExecutados.reduce((s, p) => s + p.valorTotal, 0);

  return tag('guiaSP-SADT',
    tag('cabecalhoGuia',
      tag('registroANS', '000000') +
      tag('numeroGuiaPrestador', guia.cabecalhoGuia.numeroGuiaPrestador) +
      tagOpt('numeroGuiaOperadora', guia.cabecalhoGuia.numeroGuiaOperadora)
    ) +
    generateBeneficiario(guia.dadosBeneficiario) +
    tag('dadosSolicitante',
      tag('contratadoSolicitante',
        tag('cnpjContratado', prestador.cnpj) +
        tag('nomeContratado', prestador.nomeContratado)
      ) +
      generateProfissional('profissionalSolicitante', guia.dadosSolicitante)
    ) +
    tag('dadosSolicitacao',
      tag('caraterAtendimento', guia.caraterAtendimento) +
      tag('dataSolicitacao', guia.dataAtendimento) +
      tagOpt('indicacaoClinica', guia.indicacaoClinica)
    ) +
    tag('dadosExecutante',
      tag('contratadoExecutante',
        tag('cnpjContratado', guia.contratadoExecutante.cnpjContratado) +
        tag('nomeContratado', guia.contratadoExecutante.nomeContratado) +
        tag('CNES', guia.contratadoExecutante.cnesContratado)
      )
    ) +
    tag('dadosAtendimento',
      tag('tipoAtendimento', guia.tipoAtendimento) +
      tag('indicacaoAcidente', guia.indicacaoAcidente) +
      tag('tipoSaida', guia.tipoSaida)
    ) +
    tag('procedimentosExecutados', procsXml) +
    tag('valorTotal',
      tag('valorProcedimentos', formatMoneyXML(totalGeral)) +
      tag('valorTotalGeral', formatMoneyXML(totalGeral))
    )
  );
}

// ── Mensagem TISS Completa ──

export type TipoGuiaXML = 'consulta' | 'sadt';

export interface GenerateXMLParams {
  prestador: DadosPrestador;
  operadora: DadosOperadora;
  lote: DadosLote;
  guiaConsulta?: GuiaConsulta;
  guiaSADT?: GuiaSADT;
}

/**
 * Gera a mensagem TISS completa (sem o hash — será inserido após o cálculo).
 */
export function generateMensagemTISS(
  params: GenerateXMLParams,
  tipo: TipoGuiaXML
): string {
  const { prestador, operadora, lote } = params;

  const cabecalho = generateCabecalho(operadora, '1');

  let guiaXml = '';
  if (tipo === 'consulta' && params.guiaConsulta) {
    guiaXml = generateGuiaConsulta(params.guiaConsulta, prestador);
  } else if (tipo === 'sadt' && params.guiaSADT) {
    guiaXml = generateGuiaSADT(params.guiaSADT, prestador);
  }

  const corpo = tag('prestadorParaOperadora',
    tag('loteGuias',
      tag('numeroLote', lote.numeroLote) +
      tag('guiasTISS', guiaXml)
    )
  );

  const epilogo = tag('epilogo', tag('hash', '{{HASH_PLACEHOLDER}}'));

  const xml = `<?xml version="1.0" encoding="ISO-8859-1"?>\n` +
    `<${NS}:mensagemTISS xmlns:${NS}="${TISS_NS}" xmlns:xsi="${XSI_NS}">\n` +
    cabecalho + '\n' +
    corpo + '\n' +
    epilogo + '\n' +
    `</${NS}:mensagemTISS>`;

  return xml;
}
