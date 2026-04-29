import type { GuiaConsulta } from '../types/tiss';
import { TIPOS_CONSULTA, INDICACAO_ACIDENTE, CONSELHOS_PROFISSIONAIS, UFS_BRASIL } from '../types/tiss';
import { TUSSAutocomplete } from './TUSSAutocomplete';

interface ConsultaFormProps {
  guia: GuiaConsulta;
  onChange: (data: Partial<GuiaConsulta>) => void;
}

export function ConsultaForm({ guia, onChange }: ConsultaFormProps) {
  const updateProf = (field: string, value: string) => {
    onChange({ profissionalExecutante: { ...guia.profissionalExecutante, [field]: value } });
  };

  return (
    <>
      <section className="glass p-6 animate-slide-up" id="section-atendimento-consulta" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-text-primary">Dados do Atendimento</h3>
            <p className="text-xs text-text-muted">Informações da consulta médica</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="consulta-guia">Nº Guia Prestador <span className="text-red-400">*</span></label>
            <input id="consulta-guia" type="text" className="glass-input" placeholder="Número da guia" value={guia.cabecalhoGuia.numeroGuiaPrestador} onChange={(e) => onChange({ cabecalhoGuia: { ...guia.cabecalhoGuia, numeroGuiaPrestador: e.target.value } })} />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="consulta-data">Data do Atendimento <span className="text-red-400">*</span></label>
            <input id="consulta-data" type="date" className="glass-input" value={guia.dataAtendimento} onChange={(e) => onChange({ dataAtendimento: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="consulta-tipo">Tipo de Consulta <span className="text-red-400">*</span></label>
            <select id="consulta-tipo" className="glass-input" value={guia.tipoConsulta} onChange={(e) => onChange({ tipoConsulta: e.target.value })}>
              {TIPOS_CONSULTA.map((t) => (<option key={t.valor} value={t.valor}>{t.valor} — {t.descricao}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="consulta-acidente">Indicação de Acidente <span className="text-red-400">*</span></label>
            <select id="consulta-acidente" className="glass-input" value={guia.indicacaoAcidente} onChange={(e) => onChange({ indicacaoAcidente: e.target.value })}>
              {INDICACAO_ACIDENTE.map((i) => (<option key={i.valor} value={i.valor}>{i.valor} — {i.descricao}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">Código TUSS <span className="text-red-400">*</span></label>
            <TUSSAutocomplete value={guia.codigoConsulta} onChange={(codigo, _desc, valor) => onChange({ codigoConsulta: codigo, valorProcedimento: valor ?? guia.valorProcedimento })} placeholder="Buscar código TUSS..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="consulta-valor">Valor (R$) <span className="text-red-400">*</span></label>
            <input id="consulta-valor" type="number" step="0.01" min="0" className="glass-input" placeholder="0,00" value={guia.valorProcedimento || ''} onChange={(e) => onChange({ valorProcedimento: parseFloat(e.target.value) || 0 })} />
          </div>
        </div>
      </section>

      <section className="glass p-6 animate-slide-up" id="section-profissional-consulta" style={{ animationDelay: '0.15s' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
            <svg className="w-4 h-4 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-text-primary">Profissional Executante</h3>
            <p className="text-xs text-text-muted">Dados do médico responsável</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="c-prof-nome">Nome <span className="text-red-400">*</span></label>
            <input id="c-prof-nome" type="text" className="glass-input" placeholder="Nome completo" value={guia.profissionalExecutante.nomeProfissional} onChange={(e) => updateProf('nomeProfissional', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="c-prof-conselho">Conselho <span className="text-red-400">*</span></label>
            <select id="c-prof-conselho" className="glass-input" value={guia.profissionalExecutante.conselhoProfissional} onChange={(e) => updateProf('conselhoProfissional', e.target.value)}>
              {CONSELHOS_PROFISSIONAIS.map((c) => (<option key={c.valor} value={c.valor}>{c.descricao}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="c-prof-num">Nº Conselho <span className="text-red-400">*</span></label>
            <input id="c-prof-num" type="text" className="glass-input" placeholder="Registro" value={guia.profissionalExecutante.numeroConselho} onChange={(e) => updateProf('numeroConselho', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="c-prof-uf">UF <span className="text-red-400">*</span></label>
            <select id="c-prof-uf" className="glass-input" value={guia.profissionalExecutante.ufConselho} onChange={(e) => updateProf('ufConselho', e.target.value)}>
              {UFS_BRASIL.map((uf) => (<option key={uf} value={uf}>{uf}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="c-prof-cbo">CBO <span className="text-red-400">*</span></label>
            <input id="c-prof-cbo" type="text" className="glass-input" placeholder="Ex: 225120" value={guia.profissionalExecutante.codigoCBO} onChange={(e) => updateProf('codigoCBO', e.target.value)} />
          </div>
        </div>
      </section>
    </>
  );
}
