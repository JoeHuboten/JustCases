'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { FiCheck, FiX, FiAlertCircle, FiInfo, FiShoppingCart, FiHeart, FiTrash2 } from 'react-icons/fi';

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'cart' | 'wishlist';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ConfirmOptions {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

interface ConfirmDialog {
  message: string;
  onConfirm: () => void;
  options?: ConfirmOptions;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  showConfirm: (message: string, onConfirm: () => void, options?: ConfirmOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastIcon = ({ type }: { type: ToastType }) => {
  switch (type) {
    case 'success':
      return <FiCheck className="w-5 h-5" />;
    case 'error':
      return <FiX className="w-5 h-5" />;
    case 'warning':
      return <FiAlertCircle className="w-5 h-5" />;
    case 'cart':
      return <FiShoppingCart className="w-5 h-5" />;
    case 'wishlist':
      return <FiHeart className="w-5 h-5" />;
    default:
      return <FiInfo className="w-5 h-5" />;
  }
};

const getToastStyles = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400';
    case 'error':
      return 'bg-red-500/20 border-red-500/30 text-red-400';
    case 'warning':
      return 'bg-amber-500/20 border-amber-500/30 text-amber-400';
    case 'cart':
      return 'bg-accent/20 border-accent/30 text-accent-light';
    case 'wishlist':
      return 'bg-pink-500/20 border-pink-500/30 text-pink-400';
    default:
      return 'bg-accent/20 border-accent/30 text-accent-light';
  }
};

const ToastItem = ({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) => {
  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl
        shadow-2xl shadow-black/20 animate-slide-in-right
        ${getToastStyles(toast.type)}
      `}
      style={{
        animation: 'slideInRight 0.3s ease-out, fadeOut 0.3s ease-in forwards',
        animationDelay: `0s, ${(toast.duration || 3000) - 300}ms`,
      }}
    >
      <div className="flex-shrink-0">
        <ToastIcon type={toast.type} />
      </div>
      <p className="text-sm font-medium text-white">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 ml-2 p-1 rounded-lg hover:bg-white/10 transition-colors"
      >
        <FiX className="w-4 h-4 text-white/60" />
      </button>
    </div>
  );
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog | null>(null);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substring(7);
    const newToast: Toast = { id, message, type, duration };
    
    setToasts((prev) => [...prev, newToast]);
    
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  const showConfirm = useCallback((message: string, onConfirm: () => void, options?: ConfirmOptions) => {
    setConfirmDialog({ message, onConfirm, options });
  }, []);

  const handleConfirm = () => {
    confirmDialog?.onConfirm();
    setConfirmDialog(null);
  };

  const handleCancel = () => {
    setConfirmDialog(null);
  };

  return (
    <ToastContext.Provider value={{ showToast, showConfirm }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </div>

      {/* Confirm Dialog */}
      {confirmDialog && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ animation: 'fadeInOverlay 0.2s ease-out' }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCancel}
          />

          {/* Dialog card */}
          <div
            className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#0f1117]/90 backdrop-blur-xl shadow-2xl shadow-black/50 p-6 flex flex-col items-center gap-5"
            style={{ animation: 'scaleInDialog 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}
          >
            {/* Icon */}
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${confirmDialog.options?.destructive !== false ? 'bg-red-500/15' : 'bg-amber-500/15'}`}>
              <FiTrash2 className={`w-7 h-7 ${confirmDialog.options?.destructive !== false ? 'text-red-400' : 'text-amber-400'}`} />
            </div>

            {/* Title */}
            <div className="text-center">
              <h3 className="text-base font-semibold text-white mb-1">
                {confirmDialog.options?.title ?? 'Потвърди действието'}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">{confirmDialog.message}</p>
            </div>

            {/* Buttons */}
            <div className="flex w-full gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-150"
              >
                {confirmDialog.options?.cancelText ?? 'Отказ'}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-150 shadow-lg ${
                  confirmDialog.options?.destructive !== false
                    ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30'
                    : 'bg-accent hover:bg-accent/90 shadow-accent/30'
                }`}
              >
                {confirmDialog.options?.confirmText ?? 'Потвърди'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style jsx global>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
            transform: translateX(50%);
          }
        }

        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @keyframes scaleInDialog {
          from { transform: scale(0.85); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
