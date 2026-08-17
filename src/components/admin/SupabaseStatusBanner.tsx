import React from 'react';
import { ShieldAlert, CheckCircle2, Server } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';

export const SupabaseStatusBanner: React.FC = () => {
  if (isSupabaseConfigured) {
    return (
      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 text-emerald-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white block text-sm">Banco de Dados Supabase Conectado</span>
            <span className="text-emerald-400/80 text-[11px]">
              Todas as alterações salvas neste painel são enviadas para o Supabase e sincronizadas em tempo real para celulares, tablets e outros computadores.
            </span>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold shrink-0 uppercase tracking-wider">
          Sincronização Global Ativa
        </div>
      </div>
    );
  }

  return (
    <div className="bg-rose-950/60 border-2 border-rose-500/40 rounded-2xl p-5 text-rose-200 text-xs space-y-3 shadow-2xl">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5 animate-pulse" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-extrabold text-white text-sm">ATENÇÃO: Supabase Não Configurado no Ambiente de Produção</h4>
            <span className="px-2 py-0.5 rounded bg-rose-900 text-rose-200 text-[10px] font-mono font-bold uppercase">Ação Necessária</span>
          </div>
          <p className="text-gray-300 text-xs leading-relaxed">
            As variáveis de ambiente <code className="bg-black/50 text-rose-300 px-1.5 py-0.5 rounded font-mono text-[11px]">VITE_SUPABASE_URL</code> e <code className="bg-black/50 text-rose-300 px-1.5 py-0.5 rounded font-mono text-[11px]">VITE_SUPABASE_ANON_KEY</code> não estão configuradas na <strong>Vercel</strong>.
          </p>
          <p className="text-rose-300 font-semibold text-xs pt-1">
            ⚠️ As alterações salvas agora NÃO serão refletidas em outros dispositivos (como o seu celular) até que as credenciais do Supabase sejam adicionadas na Vercel.
          </p>
        </div>
      </div>

      <div className="bg-black/40 border border-rose-500/20 rounded-xl p-3.5 space-y-2 text-[11px] text-gray-300">
        <div className="font-bold text-white flex items-center gap-1.5">
          <Server className="w-3.5 h-3.5 text-rose-400" />
          <span>Como ativar a sincronização global no celular (Vercel + Supabase):</span>
        </div>
        <ol className="list-decimal list-inside space-y-1 text-gray-300">
          <li>Acesse o painel da Vercel em <strong className="text-white">vercel.com</strong> e abra o projeto <strong className="text-white">raposoveiculos</strong>.</li>
          <li>Vá em <strong className="text-white">Settings &gt; Environment Variables</strong>.</li>
          <li>Cadastre <code className="text-rose-300">VITE_SUPABASE_URL</code> com a URL do seu projeto Supabase.</li>
          <li>Cadastre <code className="text-rose-300">VITE_SUPABASE_ANON_KEY</code> com a anon/public key do Supabase.</li>
          <li>Clique em <strong className="text-white">Redeploy</strong> na Vercel.</li>
        </ol>
      </div>
    </div>
  );
};
