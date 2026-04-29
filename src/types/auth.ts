// =============================================================================
// Tipos de autenticação e gerenciamento de usuários
// =============================================================================

export interface User {
  id: string;
  nome: string;
  email: string;
  senha: string;
  nivelAcesso: NivelAcesso;
  status: StatusUsuario;
  criadoEm: string;
}

export type NivelAcesso = 'admin' | 'operador' | 'visualizador';
export type StatusUsuario = 'ativo' | 'inativo';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export const NIVEIS_ACESSO: { valor: NivelAcesso; descricao: string }[] = [
  { valor: 'admin', descricao: 'Administrador' },
  { valor: 'operador', descricao: 'Operador' },
  { valor: 'visualizador', descricao: 'Visualizador' },
];

export const STATUS_USUARIO: { valor: StatusUsuario; descricao: string }[] = [
  { valor: 'ativo', descricao: 'Ativo' },
  { valor: 'inativo', descricao: 'Inativo' },
];
