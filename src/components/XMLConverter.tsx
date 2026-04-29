import { useState, useCallback, useRef } from 'react';
import type { ToastMessage } from './ui/Toast';
import { convertXML305to402 } from '../utils/xmlConverter';
import { downloadFile } from '../utils/downloadXml';

interface XMLConverterProps {
  onToast: (type: ToastMessage['type'], title: string, message?: string) => void;
}

export function XMLConverter({ onToast }: XMLConverterProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (f: File) => {
    if (!f.name.endsWith('.xml')) {
      onToast('error', 'Arquivo inválido', 'Por favor, selecione um arquivo .xml');
      return;
    }
    setFile(f);
    const text = await f.text();
    // Mostrar preview das primeiras 20 linhas
    const lines = text.split('\n').slice(0, 20).join('\n');
    setPreview(lines + (text.split('\n').length > 20 ? '\n...' : ''));
  }, [onToast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const handleConvert = useCallback(async () => {
    if (!file) return;
    setIsConverting(true);
    try {
      const text = await file.text();
      const result = convertXML305to402(text);

      if (result.success && result.xml) {
        const newName = file.name.replace(/\.xml$/i, '_v402.xml');
        downloadFile(result.xml, newName, 'application/xml');
        onToast('success', 'Conversão concluída!', newName);
      } else {
        onToast('error', 'Erro na conversão', result.error || 'Erro desconhecido');
      }
    } catch (err) {
      onToast('error', 'Erro inesperado', String(err));
    } finally {
      setIsConverting(false);
    }
  }, [file, onToast]);

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        className={`glass p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragging ? 'border-teal-400 bg-teal-500/5 scale-[1.01]' : 'hover:border-border-focus'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xml"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
        <div className="flex flex-col items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
            isDragging ? 'bg-teal-500/20' : 'bg-navy-700/50'
          }`}>
            <svg className={`w-8 h-8 ${isDragging ? 'text-teal-400' : 'text-text-muted'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">
              {isDragging ? 'Solte o arquivo aqui' : 'Arraste um XML ou clique para selecionar'}
            </p>
            <p className="text-xs text-text-muted mt-1">Suporta TISS v3.05.00 e outras versões anteriores</p>
          </div>
        </div>
      </div>

      {/* File Info & Preview */}
      {file && (
        <div className="glass p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center">
                <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">{file.name}</p>
                <p className="text-xs text-text-muted">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setFile(null); setPreview(null); }} className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-muted hover:text-text-primary hover:bg-surface-hover transition-all cursor-pointer border border-border-subtle">
                Remover
              </button>
              <button onClick={handleConvert} disabled={isConverting} className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isConverting ? 'bg-teal-500/20 text-teal-300/50' : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-400 hover:to-cyan-400'
              }`}>
                {isConverting ? 'Convertendo...' : 'Converter para v4.02.00'}
              </button>
            </div>
          </div>

          {preview && (
            <div className="mt-4 rounded-xl bg-navy-950/80 border border-border-subtle overflow-hidden">
              <div className="px-4 py-2 border-b border-border-subtle bg-navy-800/30">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">Preview do XML</span>
              </div>
              <pre className="p-4 text-xs text-text-secondary font-mono overflow-x-auto max-h-64 leading-relaxed">
                {preview}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
