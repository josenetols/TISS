import { useCallback } from 'react';
import type { GuiaSADT, Procedimento } from '../types/tiss';
import { INDICACAO_ACIDENTE, CARATER_ATENDIMENTO, TIPO_ATENDIMENTO, TIPO_SAIDA, CONSELHOS_PROFISSIONAIS, UFS_BRASIL } from '../types/tiss';
import { ProcedureRow } from './ProcedureRow';
import { formatCNPJ } from '../utils/validators';

interface SADTFormProps {
  guia: GuiaSADT;
  onChange: (data: Partial<GuiaSADT>) => void;
}

export function SADTForm({ guia, onChange }: SADTFormProps) {
  const updateSolicitante = (field: string, value: string) => {
    onChange({ dadosSolicitante: { ...guia.dadosSolicitante, [field]: value } });
  };
  const updateExecutante = (field: string, value: string) => {
    onChange({ contratadoExecutante: { ...guia.contratadoExecutante, [field]: value } });
  };
  const updateProfExec = (field: string, value: string) => {
    onChange({ profissionalExecutante: { ...guia.profissionalExecutante, [field]: value } });
  };

  const addProcedimento = useCallback(() => {
    const novo: Procedimento = {
      id: Date.now().toString(),
      codigoTabela: '22',
      codigoProcedimento: '',
      descricaoProcedimento: '',
      quantidadeExecutada: 1,
      valorUnitario: 0,
      valorTotal: 0,
      dataExecucao: guia.dataAtendimento,
    };
    onChange({ procedimentosExecutados: [...guia.procedimentosExecutados, novo] });
  }, [guia.procedimentosExecutados, guia.dataAtendimento, onChange]);

  const updateProcedimento = useCallback((id: string, data: Partial<Procedimento>) => {
    onChange({
      procedimentosExecutados: guia.procedimentosExecutados.map((p) =>
        p.id === id ? { ...p, ...data } : p
      ),
    });
  }, [guia.procedimentosExecutados, onChange]);

  const removeProcedimento = useCallback((id: string) => {
    onChange({
      procedimentosExecutados: guia.procedimentosExecutados.filter((p) => p.id !== id),
    });
  }, [guia.procedimentosExecutados, onChange]);

  const totalGeral = guia.procedimentosExecutados.reduce((sum, p) => sum + p.valorTotal, 0);

  return (
    <>
      {/* Dados do Atendimento SADT */}
      <section className="glass p-6 animate-slide-up" id="section-atendimento-sadt" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <h3 className="text-base font-semibold text-text-primary">Dados do Atendimento</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="sadt-guia">Nº Guia Prestador <span className="text-red-400">*</span></label>
            <input id="sadt-guia" type="text" className="glass-input" placeholder="Número da guia" value={guia.cabecalhoGuia.numeroGuiaPrestador} onChange={(e) => onChange({ cabecalhoGuia: { ...guia.cabecalhoGuia, numeroGuiaPrestador: e.target.value } })} />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="sadt-guia-op">Nº Guia Operadora</label>
            <input id="sadt-guia-op" type="text" className="glass-input" placeholder="Opcional" value={guia.cabecalhoGuia.numeroGuiaOperadora || ''} onChange={(e) => onChange({ cabecalhoGuia: { ...guia.cabecalhoGuia, numeroGuiaOperadora: e.target.value } })} />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="sadt-data">Data do Atendimento <span className="text-red-400">*</span></label>
            <input id="sadt-data" type="date" className="glass-input" value={guia.dataAtendimento} onChange={(e) => onChange({ dataAtendimento: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="sadt-carater">Caráter <span className="text-red-400">*</span></label>
            <select id="sadt-carater" className="glass-input" value={guia.caraterAtendimento} onChange={(e) => onChange({ caraterAtendimento: e.target.value })}>
              {CARATER_ATENDIMENTO.map((c) => (<option key={c.valor} value={c.valor}>{c.valor} — {c.descricao}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="sadt-tipo">Tipo Atendimento <span className="text-red-400">*</span></label>
            <select id="sadt-tipo" className="glass-input" value={guia.tipoAtendimento} onChange={(e) => onChange({ tipoAtendimento: e.target.value })}>
              {TIPO_ATENDIMENTO.map((t) => (<option key={t.valor} value={t.valor}>{t.valor} — {t.descricao}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="sadt-acidente">Acidente <span className="text-red-400">*</span></label>
            <select id="sadt-acidente" className="glass-input" value={guia.indicacaoAcidente} onChange={(e) => onChange({ indicacaoAcidente: e.target.value })}>
              {INDICACAO_ACIDENTE.map((i) => (<option key={i.valor} value={i.valor}>{i.valor} — {i.descricao}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="sadt-saida">Tipo de Saída <span className="text-red-400">*</span></label>
            <select id="sadt-saida" className="glass-input" value={guia.tipoSaida} onChange={(e) => onChange({ tipoSaida: e.target.value })}>
              {TIPO_SAIDA.map((t) => (<option key={t.valor} value={t.valor}>{t.valor} — {t.descricao}</option>))}
            </select>
          </div>
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="sadt-indicacao">Indicação Clínica</label>
            <input id="sadt-indicacao" type="text" className="glass-input" placeholder="Indicação clínica" value={guia.indicacaoClinica || ''} onChange={(e) => onChange({ indicacaoClinica: e.target.value })} />
          </div>
        </div>
      </section>

      {/* Profissional Solicitante */}
      <section className="glass p-6 animate-slide-up" id="section-solicitante" style={{ animationDelay: '0.15s' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
            <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
          </div>
          <h3 className="text-base font-semibold text-text-primary">Profissional Solicitante</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="s-sol-nome">Nome <span className="text-red-400">*</span></label>
            <input id="s-sol-nome" type="text" className="glass-input" value={guia.dadosSolicitante.nomeProfissional} onChange={(e) => updateSolicitante('nomeProfissional', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="s-sol-cons">Conselho <span className="text-red-400">*</span></label>
            <select id="s-sol-cons" className="glass-input" value={guia.dadosSolicitante.conselhoProfissional} onChange={(e) => updateSolicitante('conselhoProfissional', e.target.value)}>
              {CONSELHOS_PROFISSIONAIS.map((c) => (<option key={c.valor} value={c.valor}>{c.descricao}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="s-sol-num">Nº Conselho <span className="text-red-400">*</span></label>
            <input id="s-sol-num" type="text" className="glass-input" value={guia.dadosSolicitante.numeroConselho} onChange={(e) => updateSolicitante('numeroConselho', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="s-sol-uf">UF <span className="text-red-400">*</span></label>
            <select id="s-sol-uf" className="glass-input" value={guia.dadosSolicitante.ufConselho} onChange={(e) => updateSolicitante('ufConselho', e.target.value)}>
              {UFS_BRASIL.map((uf) => (<option key={uf} value={uf}>{uf}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="s-sol-cbo">CBO <span className="text-red-400">*</span></label>
            <input id="s-sol-cbo" type="text" className="glass-input" placeholder="Ex: 225120" value={guia.dadosSolicitante.codigoCBO} onChange={(e) => updateSolicitante('codigoCBO', e.target.value)} />
          </div>
        </div>
      </section>

      {/* Contratado Executante */}
      <section className="glass p-6 animate-slide-up" id="section-executante" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
            <svg className="w-4 h-4 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <h3 className="text-base font-semibold text-text-primary">Contratado Executante</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="s-exec-cnpj">CNPJ <span className="text-red-400">*</span></label>
            <input id="s-exec-cnpj" type="text" className="glass-input" placeholder="00.000.000/0000-00" value={formatCNPJ(guia.contratadoExecutante.cnpjContratado)} onChange={(e) => updateExecutante('cnpjContratado', e.target.value.replace(/\D/g, '').slice(0, 14))} maxLength={18} />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="s-exec-nome">Nome <span className="text-red-400">*</span></label>
            <input id="s-exec-nome" type="text" className="glass-input" value={guia.contratadoExecutante.nomeContratado} onChange={(e) => updateExecutante('nomeContratado', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="s-exec-cnes">CNES <span className="text-red-400">*</span></label>
            <input id="s-exec-cnes" type="text" className="glass-input" placeholder="0000000" value={guia.contratadoExecutante.cnesContratado} onChange={(e) => updateExecutante('cnesContratado', e.target.value.replace(/\D/g, '').slice(0, 7))} maxLength={7} />
          </div>
        </div>
        {/* Profissional Executante */}
        <h4 className="text-sm font-semibold text-text-secondary mt-6 mb-4">Profissional Executante</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="s-pexec-nome">Nome <span className="text-red-400">*</span></label>
            <input id="s-pexec-nome" type="text" className="glass-input" value={guia.profissionalExecutante.nomeProfissional} onChange={(e) => updateProfExec('nomeProfissional', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="s-pexec-cons">Conselho <span className="text-red-400">*</span></label>
            <select id="s-pexec-cons" className="glass-input" value={guia.profissionalExecutante.conselhoProfissional} onChange={(e) => updateProfExec('conselhoProfissional', e.target.value)}>
              {CONSELHOS_PROFISSIONAIS.map((c) => (<option key={c.valor} value={c.valor}>{c.descricao}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="s-pexec-num">Nº Conselho <span className="text-red-400">*</span></label>
            <input id="s-pexec-num" type="text" className="glass-input" value={guia.profissionalExecutante.numeroConselho} onChange={(e) => updateProfExec('numeroConselho', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="s-pexec-uf">UF <span className="text-red-400">*</span></label>
            <select id="s-pexec-uf" className="glass-input" value={guia.profissionalExecutante.ufConselho} onChange={(e) => updateProfExec('ufConselho', e.target.value)}>
              {UFS_BRASIL.map((uf) => (<option key={uf} value={uf}>{uf}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="s-pexec-cbo">CBO <span className="text-red-400">*</span></label>
            <input id="s-pexec-cbo" type="text" className="glass-input" placeholder="Ex: 225120" value={guia.profissionalExecutante.codigoCBO} onChange={(e) => updateProfExec('codigoCBO', e.target.value)} />
          </div>
        </div>
      </section>

      {/* Procedimentos Executados */}
      <section className="glass p-6 animate-slide-up" id="section-procedimentos" style={{ animationDelay: '0.25s' }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/15 flex items-center justify-center">
              <svg className="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-primary">Procedimentos Executados</h3>
              <p className="text-xs text-text-muted">{guia.procedimentosExecutados.length} procedimento(s)</p>
            </div>
          </div>
          <button type="button" onClick={addProcedimento} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500/15 border border-teal-500/25 text-teal-300 text-sm font-medium hover:bg-teal-500/25 transition-all cursor-pointer">
            <span className="text-lg leading-none">+</span> Adicionar
          </button>
        </div>

        {guia.procedimentosExecutados.length === 0 ? (
          <div className="text-center py-12 text-text-muted">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <p className="text-sm">Nenhum procedimento adicionado</p>
            <p className="text-xs mt-1">Clique em "Adicionar" para incluir procedimentos</p>
          </div>
        ) : (
          <div className="space-y-3">
            {guia.procedimentosExecutados.map((proc, index) => (
              <ProcedureRow key={proc.id} procedimento={proc} index={index} onUpdate={(data) => updateProcedimento(proc.id, data)} onRemove={() => removeProcedimento(proc.id)} />
            ))}
            {/* Total */}
            <div className="flex justify-end pt-4 border-t border-border-subtle">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-text-secondary">Total Geral:</span>
                <span className="text-xl font-bold gradient-text">R$ {totalGeral.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
