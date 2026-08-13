import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Car, Lock, Loader2, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, error, clearError } = useAuth();
  const { showToast } = useToast();

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!password) {
      showToast('Por favor, informe a senha de acesso.', 'error');
      return;
    }

    setLoading(true);
    try {
      const success = await signIn('admin@raposoveiculos.com.br', password);
      if (success) {
        showToast('Acesso autorizado! Bem-vindo ao Painel Administrativo.', 'success');
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Senha incorreta!', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-gray-100 flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#E11D48]/15 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Bar */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para o site</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="max-w-md w-full mx-auto my-auto z-10">
        <div className="bg-[#0A0A0C] border border-[#1F1F24] rounded-3xl p-8 shadow-2xl space-y-6">
          
          {/* Logo & Header */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#E11D48] to-[#9F1239] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(225,29,72,0.4)]">
              <Car className="w-7 h-7 text-white" />
            </div>
            
            <div>
              <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight">
                Painel Administrativo
              </h1>
              <p className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#E11D48]" />
                <span>Área Restrita • Digite a senha para acessar</span>
              </p>
            </div>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form with Password Input Only */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Senha de Acesso
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="Digite a senha..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#E11D48] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#E11D48] hover:bg-[#F43F5E] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(225,29,72,0.35)] transition-all disabled:opacity-50 mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              <span>Acessar Painel</span>
            </button>
          </form>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="max-w-md w-full mx-auto text-center text-xs text-gray-600 z-10">
        © 2026 Raposo Veículos • Sistema Administrativo Fechado
      </div>

    </div>
  );
};
