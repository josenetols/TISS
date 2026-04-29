import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User } from '../types/auth';

// =============================================================================
// AuthContext — Autenticação mock com localStorage
// Cria admin padrão no primeiro acesso
// =============================================================================

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => { success: boolean; error?: string };
  logout: () => void;
}

const USERS_KEY = 'tiss_users';
const SESSION_KEY = 'tiss_auth_session';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Hash simples para senha (mock — não usar em produção) */
function hashSenha(senha: string): string {
  let hash = 0;
  for (let i = 0; i < senha.length; i++) {
    const char = senha.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'h_' + Math.abs(hash).toString(36);
}

/** Garante que o admin padrão existe */
function ensureDefaultAdmin(): void {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const users: User[] = raw ? JSON.parse(raw) : [];

    const adminExists = users.some((u) => u.email === 'admin@tiss.com');
    if (!adminExists) {
      users.push({
        id: 'admin-001',
        nome: 'Administrador',
        email: 'admin@tiss.com',
        senha: hashSenha('admin123'),
        nivelAcesso: 'admin',
        status: 'ativo',
        criadoEm: new Date().toISOString(),
      });
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  } catch { /* ignora */ }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    ensureDefaultAdmin();
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) return JSON.parse(raw) as User;
    } catch { /* ignora */ }
    return null;
  });

  const isAuthenticated = user !== null;

  // Sincroniza sessão no localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [user]);

  const login = useCallback((email: string, senha: string): { success: boolean; error?: string } => {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      const users: User[] = raw ? JSON.parse(raw) : [];

      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!found) {
        return { success: false, error: 'Usuário não encontrado' };
      }
      if (found.status === 'inativo') {
        return { success: false, error: 'Usuário inativo. Contate o administrador.' };
      }
      if (found.senha !== hashSenha(senha)) {
        return { success: false, error: 'Senha incorreta' };
      }

      setUser(found);
      return { success: true };
    } catch {
      return { success: false, error: 'Erro ao autenticar' };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}

// Re-exportar hashSenha para uso no useUsers
export { hashSenha };
