import { useState, useCallback } from 'react';
import { useUsers } from '../hooks/useUsers';
import { CreateUserModal } from './CreateUserModal';
import type { ToastMessage } from './ui/Toast';

// =============================================================================
// AdminDashboard — Gerenciamento de usuários
// =============================================================================

interface AdminDashboardProps {
  onToast: (type: ToastMessage['type'], title: string, message?: string) => void;
}

export function AdminDashboard({ onToast }: AdminDashboardProps) {
  const { users, createUser, resetPassword, toggleStatus, deleteUser } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [resetUserId, setResetUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return u.nome.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
  });

  const handleResetPassword = useCallback((userId: string) => {
    if (!newPassword.trim() || newPassword.length < 4) {
      onToast('error', 'Senha inválida', 'Mínimo 4 caracteres');
      return;
    }
    const result = resetPassword(userId, newPassword);
    if (result.success) {
      onToast('success', 'Senha resetada com sucesso');
      setResetUserId(null);
      setNewPassword('');
    } else {
      onToast('error', 'Erro ao resetar senha', result.error);
    }
  }, [newPassword, resetPassword, onToast]);

  const handleToggleStatus = useCallback((userId: string) => {
    toggleStatus(userId);
    onToast('info', 'Status atualizado');
  }, [toggleStatus, onToast]);

  const handleDelete = useCallback((userId: string, email: string) => {
    if (!confirm(`Tem certeza que deseja excluir ${email}?`)) return;
    const result = deleteUser(userId);
    if (result.success) {
      onToast('success', 'Usuário excluído', email);
    } else {
      onToast('error', 'Erro ao excluir', result.error);
    }
  }, [deleteUser, onToast]);

  const nivelBadge = (nivel: string) => {
    const styles: Record<string, string> = {
      admin: 'bg-violet-500/15 text-violet-400 border-violet-500/25',
      operador: 'bg-teal-500/15 text-teal-400 border-teal-500/25',
      visualizador: 'bg-slate-500/15 text-slate-400 border-slate-500/25',
    };
    const labels: Record<string, string> = {
      admin: 'Admin',
      operador: 'Operador',
      visualizador: 'Visualizador',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${styles[nivel] || styles.visualizador}`}>
        {labels[nivel] || nivel}
      </span>
    );
  };

  const statusBadge = (status: string) => {
    const isAtivo = status === 'ativo';
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
        isAtivo ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' : 'bg-red-500/15 text-red-400 border-red-500/25'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${isAtivo ? 'bg-emerald-400' : 'bg-red-400'}`} />
        {isAtivo ? 'Ativo' : 'Inativo'}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
              <svg className="w-5 h-5 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-primary">Gerenciamento de Usuários</h3>
              <p className="text-xs text-text-muted">{users.length} usuário(s) cadastrado(s)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Busca */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text"
                className="glass-input pl-10 w-60"
                placeholder="Buscar usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Botão Novo Usuário */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-semibold hover:from-teal-400 hover:to-cyan-400 shadow-lg transition-all cursor-pointer active:scale-[0.98]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Novo Usuário
            </button>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-widest text-text-muted">Nome</th>
                <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-widest text-text-muted">E-mail</th>
                <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-widest text-text-muted">Nível</th>
                <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-widest text-text-muted">Status</th>
                <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-widest text-text-muted">Criado em</th>
                <th className="text-right px-6 py-4 text-[11px] font-semibold uppercase tracking-widest text-text-muted">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-muted text-sm">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border-subtle/50 hover:bg-surface-hover transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center text-xs font-bold text-teal-400">
                          {user.nome.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-text-primary">{user.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{user.email}</td>
                    <td className="px-6 py-4">{nivelBadge(user.nivelAcesso)}</td>
                    <td className="px-6 py-4">{statusBadge(user.status)}</td>
                    <td className="px-6 py-4 text-xs text-text-muted">
                      {new Date(user.criadoEm).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Reset Senha */}
                        {resetUserId === user.id ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="password"
                              className="glass-input w-28 text-xs py-1.5"
                              placeholder="Nova senha"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              autoFocus
                            />
                            <button onClick={() => handleResetPassword(user.id)} className="p-1.5 rounded-lg bg-teal-500/15 text-teal-400 hover:bg-teal-500/25 transition-all cursor-pointer" title="Confirmar">
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                            </button>
                            <button onClick={() => { setResetUserId(null); setNewPassword(''); }} className="p-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-all cursor-pointer" title="Cancelar">
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                          </div>
                        ) : (
                          <>
                            <button onClick={() => setResetUserId(user.id)} className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted hover:text-amber-400 transition-all cursor-pointer" title="Resetar senha">
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                            </button>
                            <button onClick={() => handleToggleStatus(user.id)} className={`p-1.5 rounded-lg hover:bg-surface-hover transition-all cursor-pointer ${user.status === 'ativo' ? 'text-text-muted hover:text-orange-400' : 'text-text-muted hover:text-emerald-400'}`} title={user.status === 'ativo' ? 'Desativar' : 'Ativar'}>
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                            </button>
                            {user.email !== 'admin@tiss.com' && (
                              <button onClick={() => handleDelete(user.id, user.email)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-all cursor-pointer" title="Excluir">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <CreateUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={createUser}
        onToast={onToast}
      />
    </div>
  );
}
