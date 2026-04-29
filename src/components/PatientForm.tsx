import type { DadosBeneficiario } from '../types/tiss';

// =============================================================================
// PatientForm — Dados do beneficiário (paciente)
// =============================================================================

interface PatientFormProps {
  beneficiario: DadosBeneficiario;
  onChange: (data: Partial<DadosBeneficiario>) => void;
}

export function PatientForm({ beneficiario, onChange }: PatientFormProps) {
  return (
    <section className="glass p-6 animate-slide-up" id="section-paciente" style={{ animationDelay: '0.05s' }}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
          <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-semibold text-text-primary">Dados do Beneficiário</h3>
          <p className="text-xs text-text-muted">Informações do paciente</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Número da Carteira */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="paciente-carteira">
            Nº da Carteira <span className="text-red-400">*</span>
          </label>
          <input
            id="paciente-carteira"
            type="text"
            className="glass-input"
            placeholder="Número da carteira"
            value={beneficiario.numeroCarteira}
            onChange={(e) => onChange({ numeroCarteira: e.target.value })}
          />
        </div>

        {/* Nome do Beneficiário */}
        <div className="lg:col-span-2">
          <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="paciente-nome">
            Nome do Beneficiário <span className="text-red-400">*</span>
          </label>
          <input
            id="paciente-nome"
            type="text"
            className="glass-input"
            placeholder="Nome completo do paciente"
            value={beneficiario.nomeBeneficiario}
            onChange={(e) => onChange({ nomeBeneficiario: e.target.value })}
          />
        </div>

        {/* CNS */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="paciente-cns">
            CNS
          </label>
          <input
            id="paciente-cns"
            type="text"
            className="glass-input"
            placeholder="Cartão Nacional de Saúde"
            value={beneficiario.numeroCNS || ''}
            onChange={(e) => onChange({ numeroCNS: e.target.value.replace(/\D/g, '').slice(0, 15) })}
            maxLength={15}
          />
        </div>

        {/* Atendimento RN */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            Atendimento a RN
          </label>
          <div className="flex gap-2 mt-1">
            {(['N', 'S'] as const).map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => onChange({ atendimentoRN: val })}
                className={`
                  flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer border
                  ${beneficiario.atendimentoRN === val
                    ? 'bg-teal-500/15 border-teal-500/30 text-teal-300'
                    : 'bg-surface-input border-border-subtle text-text-muted hover:border-border-focus hover:text-text-secondary'
                  }
                `}
              >
                {val === 'S' ? 'Sim' : 'Não'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
