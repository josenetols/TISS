import { useState, useCallback } from 'react';
import type { TipoGuia } from './types/tiss';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import { LoginPage } from './components/LoginPage';
import { ProviderForm } from './components/ProviderForm';
import { PatientForm } from './components/PatientForm';
import { ConsultaForm } from './components/ConsultaForm';
import { SADTForm } from './components/SADTForm';
import { XMLConverter } from './components/XMLConverter';
import { AdminDashboard } from './components/AdminDashboard';
import { Toast, type ToastMessage } from './components/ui/Toast';
import { useFormState } from './hooks/useFormState';
import { generateAndDownloadXML } from './utils/downloadXml';

// ── Ícones SVG inline ──

function IconConsulta({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M9 14l2 2 4-4" />
    </svg>
  );
}

function IconSADT({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  );
}

function IconConverter({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
  );
}

function IconAdmin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconDownload({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function IconSun({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function IconMoon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

function IconLogout({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

type ActiveView = 'consulta' | 'sadt' | 'converter' | 'admin';

const NAV_ITEMS: { id: ActiveView; label: string; sublabel: string; icon: React.ComponentType<{ className?: string }>; adminOnly?: boolean }[] = [
  { id: 'consulta', label: 'Guia de Consulta', sublabel: 'Consultas médicas', icon: IconConsulta },
  { id: 'sadt', label: 'Guia SP/SADT', sublabel: 'Exames e procedimentos', icon: IconSADT },
  { id: 'converter', label: 'Converter XML', sublabel: 'v3.05.00 → v4.02.00', icon: IconConverter },
  { id: 'admin', label: 'Admin', sublabel: 'Gerenciar usuários', icon: IconAdmin, adminOnly: true },
];

export default function App() {
  const { user, isAuthenticated, logout } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [activeView, setActiveView] = useState<ActiveView>('consulta');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const tipoGuia: TipoGuia = activeView === 'sadt' ? 'sadt' : 'consulta';
  const formState = useFormState(tipoGuia);

  const addToast = useCallback((type: ToastMessage['type'], title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleGenerate = useCallback(async () => {
    if (activeView === 'converter' || activeView === 'admin') return;

    setIsGenerating(true);
    try {
      const result = generateAndDownloadXML(formState, tipoGuia);
      if (result.success) {
        addToast('success', 'XML gerado com sucesso!', result.filename);
      } else {
        addToast('error', 'Erro ao gerar XML', result.error);
      }
    } catch (err) {
      addToast('error', 'Erro inesperado', String(err));
    } finally {
      setIsGenerating(false);
    }
  }, [activeView, formState, tipoGuia, addToast]);

  // Se não autenticado, mostra tela de login
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm">
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
          ))}
        </div>
      </>
    );
  }

  const isAdmin = user?.nivelAcesso === 'admin';
  const visibleNavItems = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);
  const showGenerateButton = activeView !== 'converter' && activeView !== 'admin';

  return (
    <div className="min-h-screen bg-mesh flex">
      {/* ── Sidebar ── */}
      <aside className="w-72 min-h-screen glass-strong flex flex-col border-r border-border-subtle sticky top-0 h-screen" style={{ borderRadius: 0 }}>
        {/* Logo / Branding */}
        <div className="p-6 border-b border-border-subtle">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">&lt;/&gt;</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary leading-tight">Gerador TISS</h1>
              <span className="text-xs font-medium text-teal-400">v4.02.00</span>
            </div>
          </div>
          <p className="text-xs text-text-muted mt-3 leading-relaxed">
            Ferramenta para geração de guias médicas no padrão ANS
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted px-3 mb-2">
            Tipo de Guia
          </span>
          {visibleNavItems.map((item) => {
            const isActive = activeView === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveView(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer
                  ${isActive
                    ? 'bg-gradient-to-r from-teal-500/15 to-cyan-500/10 text-teal-300 shadow-lg border border-teal-500/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover border border-transparent'
                  }
                `}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-teal-400' : ''}`} />
                <div className="min-w-0">
                  <div className={`text-sm font-medium truncate ${isActive ? 'text-teal-300' : ''}`}>
                    {item.label}
                  </div>
                  <div className={`text-[11px] truncate ${isActive ? 'text-teal-400/60' : 'text-text-muted'}`}>
                    {item.sublabel}
                  </div>
                </div>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse-glow flex-shrink-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Generate Button */}
        {showGenerateButton && (
          <div className="p-4 border-t border-border-subtle">
            <button
              id="btn-generate-xml"
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`
                w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm
                transition-all duration-200 cursor-pointer
                ${isGenerating
                  ? 'bg-teal-500/20 text-teal-300/50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-400 hover:to-cyan-400 shadow-lg hover:shadow-teal-500/25 active:scale-[0.98]'
                }
              `}
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-teal-300/30 border-t-teal-300 rounded-full animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <IconDownload className="w-4 h-4" />
                  Gerar XML
                </>
              )}
            </button>
          </div>
        )}

        {/* User Info & Logout */}
        <div className="p-4 border-t border-border-subtle">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center text-xs font-bold text-teal-400">
              {user?.nome.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-text-primary truncate">{user?.nome}</p>
              <p className="text-[10px] text-text-muted truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-text-muted hover:text-red-400 hover:bg-red-500/10 border border-border-subtle hover:border-red-500/20 transition-all cursor-pointer"
          >
            <IconLogout className="w-3.5 h-3.5" />
            Sair
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-10 glass-strong px-8 py-4 border-b border-border-subtle flex items-center justify-between" style={{ borderRadius: 0 }}>
          <div>
            <h2 className="text-xl font-bold text-text-primary">
              {activeView === 'consulta' && 'Guia de Consulta'}
              {activeView === 'sadt' && 'Guia SP/SADT'}
              {activeView === 'converter' && 'Converter XML'}
              {activeView === 'admin' && 'Painel Administrativo'}
            </h2>
            <p className="text-sm text-text-secondary mt-0.5">
              {activeView === 'consulta' && 'Preencha os dados para gerar a guia de consulta médica'}
              {activeView === 'sadt' && 'Preencha os dados para gerar a guia de exames e procedimentos'}
              {activeView === 'converter' && 'Faça upload de um XML TISS antigo para converter para a versão 4.02.00'}
              {activeView === 'admin' && 'Gerencie usuários, permissões e acessos do sistema'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              id="btn-theme-toggle"
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl border border-border-subtle flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all cursor-pointer hover:scale-105"
              title={resolvedTheme === 'dark' ? 'Modo claro' : 'Modo escuro'}
            >
              {resolvedTheme === 'dark' ? (
                <IconSun className="w-[18px] h-[18px]" />
              ) : (
                <IconMoon className="w-[18px] h-[18px]" />
              )}
            </button>
            <div className="px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20">
              <span className="text-xs font-semibold text-teal-400">TISS 4.02.00</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {activeView === 'admin' ? (
            <div className="animate-fade-in">
              <AdminDashboard onToast={addToast} />
            </div>
          ) : activeView === 'converter' ? (
            <div className="animate-fade-in">
              <XMLConverter onToast={addToast} />
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in" key={activeView}>
              {/* Dados do Prestador */}
              <ProviderForm
                prestador={formState.prestador}
                operadora={formState.operadora}
                lote={formState.lote}
                onPrestadorChange={formState.setPrestador}
                onOperadoraChange={formState.setOperadora}
                onLoteChange={formState.setLote}
              />

              {/* Dados do Paciente */}
              <PatientForm
                beneficiario={activeView === 'consulta' ? formState.guiaConsulta.dadosBeneficiario : formState.guiaSADT.dadosBeneficiario}
                onChange={activeView === 'consulta' ? formState.setBeneficiarioConsulta : formState.setBeneficiarioSADT}
              />

              {/* Formulário Específico */}
              {activeView === 'consulta' ? (
                <ConsultaForm
                  guia={formState.guiaConsulta}
                  onChange={formState.setGuiaConsulta}
                />
              ) : (
                <SADTForm
                  guia={formState.guiaSADT}
                  onChange={formState.setGuiaSADT}
                />
              )}
            </div>
          )}
        </div>
      </main>

      {/* ── Toast Container ── */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>
    </div>
  );
}
