import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminHeader } from '../components/AdminHeader';
import { Loader2 } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#E11D48] animate-spin" />
          <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">
            Autenticando sessão administrativa...
          </span>
        </div>
      </div>
    );
  }

  // Authentication guard
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const getPageMeta = (pathname: string) => {
    if (pathname === '/admin') return { title: 'Dashboard Geral', subtitle: 'Visão executiva do estoque, propostas e métricas' };
    if (pathname === '/admin/veiculos') return { title: 'Gestão de Veículos', subtitle: 'Catálogo de carros cadastrados, status e destaques' };
    if (pathname === '/admin/veiculos/novo') return { title: 'Cadastrar Novo Veículo', subtitle: 'Preencha a ficha técnica completa, opcionais e fotos' };
    if (pathname.includes('/admin/veiculos/') && pathname.includes('/editar')) return { title: 'Editar Veículo', subtitle: 'Atualize preços, status ou mídias do veículo' };
    if (pathname === '/admin/propostas') return { title: 'Propostas Comerciais', subtitle: 'Acompanhe negociações e propostas enviadas pelo site' };
    if (pathname === '/admin/contatos') return { title: 'Leads e Mensagens', subtitle: 'Contatos e dúvidas enviadas pelos visitantes' };
    if (pathname === '/admin/configuracoes') return { title: 'Configurações da Loja', subtitle: 'Telefones, WhatsApp, horários, endereço e SEO' };
    return { title: 'Painel Administrativo', subtitle: 'Raposo Veículos' };
  };

  const { title, subtitle } = getPageMeta(location.pathname);

  return (
    <div className="min-h-screen bg-[#030303] text-gray-100 flex font-sans">
      
      {/* Sidebar */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title={title}
          subtitle={subtitle}
          onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
};
