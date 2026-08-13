import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Car, Lock, Mail, Loader2, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, error, clearError, isSupabaseConnected } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!email || !password) {
      showToast('Por favor, informe seu e-mail e senha.', 'error');
      return;
    }

    setLoading(true);
    try {
      const success = await signIn(email, password);
      if (success) {
        showToast('Login realizado com sucesso!', 'success');
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Erro ao realizar login.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-gray-100 flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
      
      {/* Background ambient lights */}
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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E11D48] to-[#9F1239] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(225,29,72,0.4)]">
              <Car className="w-6 h-6 text-white" />
            </div>
            
            <div>
              <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight">
                Painel Administrativo
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Raposo Veículos • Acesso Restrito
              </p>
            </div>
          </div>

          {/* Database Connection Notice */}
          {!isSupabaseConnected && (
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Modo Demonstração Ativo:</strong> As credenciais do Supabase não foram configuradas no arquivo <code>.env</code>. O login será simulado localmente para avaliação do painel.
              </div>
            </div>
          )}

          {/* Error Message Alert */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                E-mail Administrativo
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@raposoveiculos.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E11D48] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Senha de Acesso
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E11D48] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#E11D48] hover:bg-[#F43F5E] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(225,29,72,0.35)] transition-all disabled:opacity-50 mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              <span>Entrar no Sistema</span>
            </button>
          </form>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="max-w-md w-full mx-auto text-center text-xs text-gray-600 z-10">
        © 2026 Raposo Veículos • Sistema Administrativo
      </div>

    </div>
  );
};
