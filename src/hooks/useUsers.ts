import { useState, useCallback } from 'react';
import type { User, NivelAcesso } from '../types/auth';
import { hashSenha } from '../contexts/AuthContext';

// =============================================================================
// useUsers — CRUD de usuários no localStorage
// =============================================================================

const USERS_KEY = 'tiss_users';

function loadUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>(loadUsers);

  const refresh = useCallback(() => {
    setUsers(loadUsers());
  }, []);

  const createUser = useCallback((data: {
    nome: string;
    email: string;
    senha: string;
    nivelAcesso: NivelAcesso;
  }): { success: boolean; error?: string } => {
    const current = loadUsers();

    // Verificar e-mail duplicado
    if (current.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'E-mail já cadastrado' };
    }

    const newUser: User = {
      id: 'user-' + Date.now().toString(36),
      nome: data.nome,
      email: data.email,
      senha: hashSenha(data.senha),
      nivelAcesso: data.nivelAcesso,
      status: 'ativo',
      criadoEm: new Date().toISOString(),
    };

    const updated = [...current, newUser];
    saveUsers(updated);
    setUsers(updated);
    return { success: true };
  }, []);

  const resetPassword = useCallback((userId: string, newPassword: string): { success: boolean; error?: string } => {
    const current = loadUsers();
    const index = current.findIndex((u) => u.id === userId);
    if (index === -1) return { success: false, error: 'Usuário não encontrado' };

    current[index].senha = hashSenha(newPassword);
    saveUsers(current);
    setUsers([...current]);
    return { success: true };
  }, []);

  const toggleStatus = useCallback((userId: string): { success: boolean } => {
    const current = loadUsers();
    const index = current.findIndex((u) => u.id === userId);
    if (index === -1) return { success: false };

    current[index].status = current[index].status === 'ativo' ? 'inativo' : 'ativo';
    saveUsers(current);
    setUsers([...current]);
    return { success: true };
  }, []);

  const deleteUser = useCallback((userId: string): { success: boolean; error?: string } => {
    const current = loadUsers();
    const user = current.find((u) => u.id === userId);
    if (!user) return { success: false, error: 'Usuário não encontrado' };
    if (user.email === 'admin@tiss.com') return { success: false, error: 'Não é possível excluir o admin padrão' };

    const updated = current.filter((u) => u.id !== userId);
    saveUsers(updated);
    setUsers(updated);
    return { success: true };
  }, []);

  return { users, refresh, createUser, resetPassword, toggleStatus, deleteUser };
}
