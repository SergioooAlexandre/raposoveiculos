import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDestructive = false,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0A0A0C] border border-[#1F1F24] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        
        <div className="flex items-center gap-3 text-white">
          <div className={`p-2.5 rounded-xl ${isDestructive ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400' : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-lg">{title}</h3>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed">
          {message}
        </p>

        <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[#1F1F24]">
          <button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-[#141418] hover:bg-[#1f1f24] text-xs font-semibold text-gray-300 transition-colors"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`px-5 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-2 transition-all ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-900/30'
                : 'bg-[#E11D48] hover:bg-[#F43F5E]'
            }`}
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{confirmText}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export const EmptyState: React.FC<{
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}> = ({ title, description, actionText, onAction, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[#0A0A0C] border border-[#1F1F24] rounded-2xl">
      {icon ? (
        <div className="p-4 rounded-2xl bg-[#141418] border border-[#1F1F24] text-[#E11D48] mb-3">
          {icon}
        </div>
      ) : null}
      <h3 className="text-lg font-bold font-heading text-white">{title}</h3>
      {description && <p className="text-xs text-gray-400 max-w-sm mt-1 mb-4">{description}</p>}
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-[#E11D48] hover:bg-[#F43F5E] text-white text-xs font-semibold shadow-md transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Carregando informações...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Loader2 className="w-8 h-8 text-[#E11D48] animate-spin" />
      <span className="text-xs text-gray-400 font-mono tracking-wider mt-3 uppercase">
        {message}
      </span>
    </div>
  );
};
