import { useState, useEffect, useCallback } from 'react';
import type { DadosPrestador, DadosOperadora, DadosLote, GuiaConsulta, GuiaSADT, DadosBeneficiario, TipoGuia } from '../types/tiss';

// =============================================================================
// Hook de estado do formulário TISS
// Gerencia todo o estado e persiste dados do prestador no localStorage
// =============================================================================

const STORAGE_KEY = 'tiss_prestador_data';
const STORAGE_KEY_OPERADORA = 'tiss_operadora_data';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch { /* ignora erros de parsing */ }
  return fallback;
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch { /* ignora erros de storage */ }
}

const DEFAULT_PRESTADOR: DadosPrestador = {
  cnpj: '',
  cnes: '',
  nomeContratado: '',
};

const DEFAULT_OPERADORA: DadosOperadora = {
  registroANS: '',
};

const DEFAULT_LOTE: DadosLote = {
  numeroLote: '1',
};

const DEFAULT_BENEFICIARIO: DadosBeneficiario = {
  numeroCarteira: '',
  nomeBeneficiario: '',
  numeroCNS: '',
  atendimentoRN: 'N',
};

function createDefaultGuiaConsulta(): GuiaConsulta {
  return {
    cabecalhoGuia: { numeroGuiaPrestador: '' },
    dadosBeneficiario: { ...DEFAULT_BENEFICIARIO },
    profissionalExecutante: {
      nomeProfissional: '',
      conselhoProfissional: '06',  // CRM padrão
      numeroConselho: '',
      ufConselho: 'SP',
      codigoCBO: '',
    },
    indicacaoAcidente: '9',    // Não acidente
    tipoConsulta: '1',         // Primeira consulta
    codigoConsulta: '10101012', // Consulta em consultório
    dataAtendimento: new Date().toISOString().split('T')[0],
    valorProcedimento: 0,
  };
}

function createDefaultGuiaSADT(): GuiaSADT {
  return {
    cabecalhoGuia: { numeroGuiaPrestador: '', numeroGuiaOperadora: '' },
    dadosBeneficiario: { ...DEFAULT_BENEFICIARIO },
    dadosSolicitante: {
      nomeProfissional: '',
      conselhoProfissional: '06',
      numeroConselho: '',
      ufConselho: 'SP',
      codigoCBO: '',
    },
    contratadoExecutante: {
      cnpjContratado: '',
      nomeContratado: '',
      cnesContratado: '',
    },
    profissionalExecutante: {
      nomeProfissional: '',
      conselhoProfissional: '06',
      numeroConselho: '',
      ufConselho: 'SP',
      codigoCBO: '',
    },
    procedimentosExecutados: [],
    indicacaoClinica: '',
    caraterAtendimento: '1',   // Eletivo
    dataAtendimento: new Date().toISOString().split('T')[0],
    tipoAtendimento: '05',    // SADT
    indicacaoAcidente: '9',    // Não acidente
    tipoSaida: '1',           // Alta curado
  };
}

export interface FormState {
  prestador: DadosPrestador;
  operadora: DadosOperadora;
  lote: DadosLote;
  guiaConsulta: GuiaConsulta;
  guiaSADT: GuiaSADT;
  setPrestador: (data: Partial<DadosPrestador>) => void;
  setOperadora: (data: Partial<DadosOperadora>) => void;
  setLote: (data: Partial<DadosLote>) => void;
  setGuiaConsulta: (data: Partial<GuiaConsulta>) => void;
  setGuiaSADT: (data: Partial<GuiaSADT>) => void;
  setBeneficiarioConsulta: (data: Partial<DadosBeneficiario>) => void;
  setBeneficiarioSADT: (data: Partial<DadosBeneficiario>) => void;
}

export function useFormState(_tipoGuia: TipoGuia): FormState {
  const [prestador, setPrestadorState] = useState<DadosPrestador>(
    () => loadFromStorage(STORAGE_KEY, DEFAULT_PRESTADOR)
  );
  const [operadora, setOperadoraState] = useState<DadosOperadora>(
    () => loadFromStorage(STORAGE_KEY_OPERADORA, DEFAULT_OPERADORA)
  );
  const [lote, setLoteState] = useState<DadosLote>(DEFAULT_LOTE);
  const [guiaConsulta, setGuiaConsultaState] = useState<GuiaConsulta>(createDefaultGuiaConsulta);
  const [guiaSADT, setGuiaSADTState] = useState<GuiaSADT>(createDefaultGuiaSADT);

  // Persistir dados do prestador no localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEY, prestador);
  }, [prestador]);

  useEffect(() => {
    saveToStorage(STORAGE_KEY_OPERADORA, operadora);
  }, [operadora]);

  const setPrestador = useCallback((data: Partial<DadosPrestador>) => {
    setPrestadorState(prev => ({ ...prev, ...data }));
  }, []);

  const setOperadora = useCallback((data: Partial<DadosOperadora>) => {
    setOperadoraState(prev => ({ ...prev, ...data }));
  }, []);

  const setLote = useCallback((data: Partial<DadosLote>) => {
    setLoteState(prev => ({ ...prev, ...data }));
  }, []);

  const setGuiaConsulta = useCallback((data: Partial<GuiaConsulta>) => {
    setGuiaConsultaState(prev => ({ ...prev, ...data }));
  }, []);

  const setGuiaSADT = useCallback((data: Partial<GuiaSADT>) => {
    setGuiaSADTState(prev => ({ ...prev, ...data }));
  }, []);

  const setBeneficiarioConsulta = useCallback((data: Partial<DadosBeneficiario>) => {
    setGuiaConsultaState(prev => ({
      ...prev,
      dadosBeneficiario: { ...prev.dadosBeneficiario, ...data },
    }));
  }, []);

  const setBeneficiarioSADT = useCallback((data: Partial<DadosBeneficiario>) => {
    setGuiaSADTState(prev => ({
      ...prev,
      dadosBeneficiario: { ...prev.dadosBeneficiario, ...data },
    }));
  }, []);

  return {
    prestador,
    operadora,
    lote,
    guiaConsulta,
    guiaSADT,
    setPrestador,
    setOperadora,
    setLote,
    setGuiaConsulta,
    setGuiaSADT,
    setBeneficiarioConsulta,
    setBeneficiarioSADT,
  };
}
