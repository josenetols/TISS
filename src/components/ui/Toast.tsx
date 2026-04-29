import { useEffect, useState } from 'react';

// =============================================================================
// Toast — Notificação com auto-dismiss e progresso
// =============================================================================

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
  duration?: number;
}

const ICONS: Record<ToastMessage['type'], string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
};

const COLORS: Record<ToastMessage['type'], { bg: string; border: string; icon: string; bar: string }> = {
  success: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    icon: 'bg-emerald-500/20 text-emerald-400',
    bar: 'bg-emerald-400',
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: 'bg-red-500/20 text-red-400',
    bar: 'bg-red-400',
  },
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: 'bg-blue-500/20 text-blue-400',
    bar: 'bg-blue-400',
  },
  warning: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    icon: 'bg-amber-500/20 text-amber-400',
    bar: 'bg-amber-400',
  },
};

export function Toast({ toast, onDismiss, duration = 5000 }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);
  const colors = COLORS[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(toast.id), 200);
    }, duration);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss, duration]);

  return (
    <div
      className={`
        glass-strong relative overflow-hidden w-80 
        ${colors.bg} ${colors.border} border
        ${isExiting ? 'toast-exit' : 'toast-enter'}
      `}
      style={{ borderRadius: '12px' }}
    >
      <div className="flex items-start gap-3 p-4">
        <div className={`w-7 h-7 rounded-lg ${colors.icon} flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5`}>
          {ICONS[toast.type]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary">{toast.title}</p>
          {toast.message && (
            <p className="text-xs text-text-secondary mt-1 truncate">{toast.message}</p>
          )}
        </div>
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => onDismiss(toast.id), 200);
          }}
          className="text-text-muted hover:text-text-primary transition-colors text-lg leading-none cursor-pointer"
        >
          ×
        </button>
      </div>
      {/* Barra de progresso */}
      <div className="h-0.5 w-full bg-white/5">
        <div
          className={`h-full ${colors.bar} opacity-60`}
          style={{
            animation: `shrink ${duration}ms linear forwards`,
          }}
        />
      </div>
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
