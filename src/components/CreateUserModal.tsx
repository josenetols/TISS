import { useState } from 'react';
import type { NivelAcesso } from '../types/auth';
import { NIVEIS_ACESSO } from '../types/auth';

// =============================================================================
// CreateUserModal — Modal para criação de novo usuário
// =============================================================================

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { nome: string; email: string; senha: string; nivelAcesso: NivelAcesso }) => { success: boolean; error?: string };
  onToast: (type: 'success' | 'error', title: string, message?: string) => void;
}

export function CreateUserModal({ isOpen, onClose, onSubmit, onToast }: CreateUserModalProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nivelAcesso, setNivelAcesso] = useState<NivelAcesso>('operador');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nome.trim() || !email.trim() || !senha.trim()) {
      setError('Todos os campos são obrigatórios');
      return;
    }
    if (senha.length < 4) {
      setError('A senha deve ter pelo menos 4 caracteres');
      return;
    }

    const result = onSubmit({ nome: nome.trim(), email: email.trim(), senha, nivelAcesso });
    if (result.success) {
      onToast('success', 'Usuário criado', email);
      setNome(''); setEmail(''); setSenha(''); setNivelAcesso('operador');
      onClose();
    } else {
      setError(result.error || 'Erro ao criar usuário');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative glass-strong w-full max-w-md animate-slide-up" style={{ borderRadius: '20px' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/15 flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
            </div>
            <h3 className="text-base font-semibold text-text-primary">Novo Usuário</h3>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors cursor-pointer p-1">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="new-user-nome">Nome completo</label>
            <input id="new-user-nome" type="text" className="glass-input" placeholder="Nome do usuário" value={nome} onChange={(e) => setNome(e.target.value)} autoFocus />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="new-user-email">E-mail</label>
            <input id="new-user-email" type="email" className="glass-input" placeholder="email@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="new-user-senha">Senha</label>
            <input id="new-user-senha" type="password" className="glass-input" placeholder="Mínimo 4 caracteres" value={senha} onChange={(e) => setSenha(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5" htmlFor="new-user-nivel">Nível de Acesso</label>
            <select id="new-user-nivel" className="glass-input" value={nivelAcesso} onChange={(e) => setNivelAcesso(e.target.value as NivelAcesso)}>
              {NIVEIS_ACESSO.map((n) => (
                <option key={n.valor} value={n.valor} className="bg-navy-800 dark:bg-navy-800">{n.descricao}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <svg className="w-4 h-4 text-red-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              <span className="text-xs text-red-400 font-medium">{error}</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-text-secondary border border-border-subtle hover:bg-surface-hover transition-all cursor-pointer">
              Cancelar
            </button>
            <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-400 hover:to-cyan-400 shadow-lg transition-all cursor-pointer active:scale-[0.98]">
              Criar Usuário
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
