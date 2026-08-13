import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  FileSpreadsheet,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  PlusCircle,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { user, signOut, isSupabaseConnected } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Estoque de Veículos', path: '/admin/veiculos', icon: Car },
    { name: 'Novo Veículo', path: '/admin/veiculos/novo', icon: PlusCircle },
    { name: 'Propostas Recebidas', path: '/admin/propostas', icon: FileSpreadsheet },
    { name: 'Contatos / Leads', path: '/admin/contatos', icon: Users },
    { name: 'Configurações do Site', path: '/admin/configuracoes', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-5">
      
      {/* Brand Header */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#E11D48] to-[#9F1239] flex items-center justify-center shadow-[0_0_15px_rgba(225,29,72,0.4)]">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-heading font-bold text-base text-white tracking-tight block">
                RAPOSO <span className="text-[#E11D48]">ADMIN</span>
              </span>
              <span className="text-[9px] text-gray-400 font-mono uppercase tracking-widest block">
                Gestão de Estoque
              </span>
            </div>
          </Link>

          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Database Status Indicator */}
        <div className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono flex items-center gap-2 ${
          isSupabaseConnected
            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
            : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
        }`}>
          <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span>{isSupabaseConnected ? 'Supabase Conectado' : 'Modo Demonstração'}</span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5 pt-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#E11D48] text-white shadow-[0_0_15px_rgba(225,29,72,0.35)]'
                    : 'text-gray-300 hover:bg-[#141418] hover:text-white'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Info & User */}
      <div className="pt-6 border-t border-[#1F1F24] space-y-4">
        
        {/* User Card */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-[#1F1F24] border border-white/10 flex items-center justify-center text-xs font-bold text-white uppercase">
            {user?.name?.[0] || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-white block truncate">
              {user?.name || 'Administrador'}
            </span>
            <span className="text-[10px] text-gray-400 block truncate">
              {user?.email || 'admin@raposoveiculos.com.br'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1.5">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#141418] hover:bg-[#1f1f24] text-gray-300 text-xs font-medium transition-colors"
          >
            <span>Ver Site Público</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-rose-400 hover:bg-rose-950/30 text-xs font-semibold transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair do Sistema</span>
          </button>
        </div>

      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 h-screen shrink-0 bg-[#070709] border-r border-[#1F1F24] flex-col sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-72 bg-[#070709] h-full border-r border-[#1F1F24]">
            {sidebarContent}
          </div>
          <div className="flex-1" onClick={onCloseMobile} />
        </div>
      )}
    </>
  );
};
