import { useState, useRef, useEffect, useCallback } from 'react';
import { buscarCodigosTUSS, type CodigoTUSS } from '../types/tuss-codes';

interface TUSSAutocompleteProps {
  value: string;
  onChange: (codigo: string, descricao: string, valorReferencia?: number) => void;
  placeholder?: string;
}

export function TUSSAutocomplete({ value, onChange, placeholder }: TUSSAutocompleteProps) {
  const [query, setQuery] = useState(value || '');
  const [results, setResults] = useState<CodigoTUSS[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sincronizar valor externo
  useEffect(() => { setQuery(value || ''); }, [value]);

  const handleSearch = useCallback((term: string) => {
    setQuery(term);
    if (term.length >= 2) {
      const found = buscarCodigosTUSS(term, 8);
      setResults(found);
      setIsOpen(found.length > 0);
      setHighlightIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, []);

  const handleSelect = useCallback((item: CodigoTUSS) => {
    setQuery(item.codigo);
    setIsOpen(false);
    onChange(item.codigo, item.descricao, item.valorReferencia);
  }, [onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && highlightIndex >= 0) {
      e.preventDefault();
      handleSelect(results[highlightIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Fechar ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Agrupar por categoria
  const grouped = results.reduce<Record<string, CodigoTUSS[]>>((acc, item) => {
    if (!acc[item.categoria]) acc[item.categoria] = [];
    acc[item.categoria].push(item);
    return acc;
  }, {});

  let flatIndex = -1;

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        className="glass-input"
        placeholder={placeholder || 'Código ou descrição...'}
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => { if (results.length > 0) setIsOpen(true); }}
        onKeyDown={handleKeyDown}
      />

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 glass-strong max-h-64 overflow-y-auto" style={{ borderRadius: '12px' }}>
          {Object.entries(grouped).map(([categoria, items]) => (
            <div key={categoria}>
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-text-muted bg-navy-900/50 sticky top-0">
                {categoria}
              </div>
              {items.map((item) => {
                flatIndex++;
                const idx = flatIndex;
                return (
                  <button
                    key={item.codigo}
                    type="button"
                    className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors cursor-pointer border-b border-border-subtle/50 last:border-0 ${
                      idx === highlightIndex ? 'bg-teal-500/10 text-teal-300' : 'text-text-primary hover:bg-surface-hover'
                    }`}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setHighlightIndex(idx)}
                  >
                    <span className="text-xs font-mono font-semibold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded flex-shrink-0">
                      {item.codigo}
                    </span>
                    <span className="text-xs truncate flex-1">{item.descricao}</span>
                    {item.valorReferencia && (
                      <span className="text-[10px] text-text-muted flex-shrink-0">
                        R$ {item.valorReferencia.toFixed(2)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
