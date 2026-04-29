import type { DadosPrestador, DadosOperadora, DadosLote } from '../types/tiss';
import { formatCNPJ } from '../utils/validators';

// =============================================================================
// ProviderForm — Dados do prestador e operadora
// Persistido no localStorage via useFormState
// =============================================================================

interface ProviderFormProps {
  prestador: DadosPrestador;
  operadora: DadosOperadora;
  lote: DadosLote;
  onPrestadorChange: (data: Partial<DadosPrestador>) => void;
  onOperadoraChange: (data: Partial<DadosOperadora>) => void;
  onLoteChange: (data: Partial<DadosLote>) => void;
}

export function ProviderForm({
  prestador,
  operadora,
  lote,
  onPrestadorChange,
  onOperadoraChange,
  onLoteChange,
}: ProviderFormProps) {
  return (
    <section className="glass p-6 animate-slide-up" id="section-prestador">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-teal-500/15 flex items-center justify-center">
          <svg className="w-4 h-4 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-semibold text-text-primary">Dados do Prestador</h3>
          <p className="text-xs text-text-muted">Salvos automaticamente para reutilização</p>
        </div>
        <div className="ml-auto px-2 py-1 rounded-md bg-teal-500/10 border border-teal-500/20">
          <span className="text-[10px] font-medium text-teal-400">AUTO-SALVO</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* CNPJ */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="prestador-cnpj">
            CNPJ <span className="text-red-400">*</span>
          </label>
          <input
            id="prestador-cnpj"
            type="text"
            className="glass-input"
            placeholder="00.000.000/0000-00"
            value={formatCNPJ(prestador.cnpj)}
            onChange={(e) => onPrestadorChange({ cnpj: e.target.value.replace(/\D/g, '').slice(0, 14) })}
            maxLength={18}
          />
        </div>

        {/* CNES */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="prestador-cnes">
            CNES <span className="text-red-400">*</span>
          </label>
          <input
            id="prestador-cnes"
            type="text"
            className="glass-input"
            placeholder="0000000"
            value={prestador.cnes}
            onChange={(e) => onPrestadorChange({ cnes: e.target.value.replace(/\D/g, '').slice(0, 7) })}
            maxLength={7}
          />
        </div>

        {/* Registro ANS da Operadora */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="operadora-ans">
            Registro ANS (Operadora) <span className="text-red-400">*</span>
          </label>
          <input
            id="operadora-ans"
            type="text"
            className="glass-input"
            placeholder="000000"
            value={operadora.registroANS}
            onChange={(e) => onOperadoraChange({ registroANS: e.target.value.replace(/\D/g, '').slice(0, 6) })}
            maxLength={6}
          />
        </div>

        {/* Nome do Contratado */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="prestador-nome">
            Nome do Contratado <span className="text-red-400">*</span>
          </label>
          <input
            id="prestador-nome"
            type="text"
            className="glass-input"
            placeholder="Razão social do prestador"
            value={prestador.nomeContratado}
            onChange={(e) => onPrestadorChange({ nomeContratado: e.target.value })}
          />
        </div>

        {/* Número do Lote */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="lote-numero">
            Nº do Lote <span className="text-red-400">*</span>
          </label>
          <input
            id="lote-numero"
            type="text"
            className="glass-input"
            placeholder="1"
            value={lote.numeroLote}
            onChange={(e) => onLoteChange({ numeroLote: e.target.value.replace(/\D/g, '') })}
          />
        </div>
      </div>
    </section>
  );
}
