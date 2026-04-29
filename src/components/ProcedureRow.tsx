import type { Procedimento } from '../types/tiss';
import { TUSSAutocomplete } from './TUSSAutocomplete';

interface ProcedureRowProps {
  procedimento: Procedimento;
  index: number;
  onUpdate: (data: Partial<Procedimento>) => void;
  onRemove: () => void;
}

export function ProcedureRow({ procedimento, index, onUpdate, onRemove }: ProcedureRowProps) {
  const handleQtyChange = (qty: number) => {
    onUpdate({ quantidadeExecutada: qty, valorTotal: qty * procedimento.valorUnitario });
  };

  const handleValueChange = (val: number) => {
    onUpdate({ valorUnitario: val, valorTotal: procedimento.quantidadeExecutada * val });
  };

  return (
    <div className="p-4 rounded-xl bg-navy-800/50 border border-border-subtle animate-slide-up hover:border-border-focus/30 transition-all group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-text-muted bg-navy-700/50 px-2 py-0.5 rounded">#{index + 1}</span>
        <button type="button" onClick={onRemove} className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400/70 hover:text-red-400 text-xs font-medium cursor-pointer px-2 py-1 rounded hover:bg-red-500/10">
          Remover
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        <div className="md:col-span-2">
          <label className="block text-[11px] font-medium text-text-muted mb-1">Código TUSS</label>
          <TUSSAutocomplete
            value={procedimento.codigoProcedimento}
            onChange={(codigo, descricao, valor) => {
              onUpdate({
                codigoProcedimento: codigo,
                descricaoProcedimento: descricao,
                valorUnitario: valor ?? procedimento.valorUnitario,
                valorTotal: procedimento.quantidadeExecutada * (valor ?? procedimento.valorUnitario),
              });
            }}
            placeholder="Buscar..."
          />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-text-muted mb-1">Data Execução</label>
          <input type="date" className="glass-input text-xs" value={procedimento.dataExecucao} onChange={(e) => onUpdate({ dataExecucao: e.target.value })} />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-text-muted mb-1">Qtd.</label>
          <input type="number" min="1" className="glass-input text-xs" value={procedimento.quantidadeExecutada} onChange={(e) => handleQtyChange(parseInt(e.target.value) || 1)} />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-text-muted mb-1">Valor Unit. (R$)</label>
          <input type="number" step="0.01" min="0" className="glass-input text-xs" value={procedimento.valorUnitario || ''} onChange={(e) => handleValueChange(parseFloat(e.target.value) || 0)} />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-text-muted mb-1">Total (R$)</label>
          <div className="glass-input text-xs bg-teal-500/5 border-teal-500/20 text-teal-300 font-semibold cursor-default">
            {procedimento.valorTotal.toFixed(2)}
          </div>
        </div>
      </div>
      {procedimento.descricaoProcedimento && (
        <p className="text-[11px] text-text-muted mt-2 truncate">
          📋 {procedimento.descricaoProcedimento}
        </p>
      )}
    </div>
  );
}
