import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  CheckCircle2,
  Clock,
  CheckCheck,
  Sparkles,
  Flame,
  FileSpreadsheet,
  Users,
  TrendingUp,
  ArrowRight,
  PlusCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { dashboardService, type DashboardStats } from '../../services/dashboardService';
import { vehicleService } from '../../services/vehicleService';
import { proposalService } from '../../services/proposalService';
import { contactService } from '../../services/contactService';
import { SupabaseStatusBanner } from '../../components/admin/SupabaseStatusBanner';
import { LoadingState } from '../../components/ConfirmDialog';
import { formatCurrency } from '../../utils/formatters';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pieData, setPieData] = useState<any[]>([]);
  const [stockEvolution, setStockEvolution] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [statsRes, pieRes, evoRes, actRes] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getVehiclesByStatusData(),
          dashboardService.getStockEvolutionData(),
          dashboardService.getRecentActivities(),
        ]);

        setStats(statsRes);
        setPieData(pieRes);
        setStockEvolution(evoRes);
        setActivities(actRes);
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();

    const unsubVehicles = vehicleService.subscribeToRealtime(() => loadDashboard());
    const unsubProposals = proposalService.subscribeToRealtime(() => loadDashboard());
    const unsubLeads = contactService.subscribeToRealtime(() => loadDashboard());

    return () => {
      unsubVehicles();
      unsubProposals();
      unsubLeads();
    };
  }, []);

  if (loading || !stats) {
    return <LoadingState message="Carregando métricas do painel..." />;
  }

  const statCards = [
    { label: 'Total no Estoque', value: stats.totalVehicles, icon: Car, color: 'text-white', bg: 'bg-[#141418]' },
    { label: 'Disponíveis', value: stats.availableVehicles, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-950/20' },
    { label: 'Reservados', value: stats.reservedVehicles, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-950/20' },
    { label: 'Vendidos', value: stats.soldVehicles, icon: CheckCheck, color: 'text-gray-400', bg: 'bg-neutral-900' },
    { label: 'Veículos Destaque', value: stats.featuredVehicles, icon: Sparkles, color: 'text-[#E11D48]', bg: 'bg-rose-950/20' },
    { label: 'Veículos em Oferta', value: stats.offerVehicles, icon: Flame, color: 'text-[#D4AF37]', bg: 'bg-amber-950/20' },
    { label: 'Propostas Recebidas', value: stats.totalProposals, icon: FileSpreadsheet, color: 'text-blue-400', bg: 'bg-blue-950/20' },
    { label: 'Contatos / Leads', value: stats.totalLeads, icon: Users, color: 'text-purple-400', bg: 'bg-purple-950/20' },
  ];

  return (
    <div className="space-y-8">
      
      {/* Supabase Connection Status Banner */}
      <SupabaseStatusBanner />

      {/* Top Value Banner */}
      <div className="bg-[#0A0A0C] border border-[#1F1F24] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-mono text-[#E11D48] uppercase tracking-widest font-bold block">
            Valor Estimado do Estoque Ativo
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight mt-1">
            {formatCurrency(stats.totalStockValue)}
          </div>
          <span className="text-xs text-gray-400 block mt-1">
            Soma dos valores de todos os veículos com status "Disponível".
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/veiculos/novo"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#E11D48] hover:bg-[#F43F5E] text-white text-xs font-semibold shadow-lg shadow-rose-900/30 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Adicionar Novo Veículo</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid (8 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card, i) => (
          <div
            key={i}
            className="bg-[#0A0A0C] border border-[#1F1F24] p-5 rounded-2xl space-y-3 shadow-lg hover:border-[#E11D48]/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-400">{card.label}</span>
              <div className={`p-2 rounded-xl ${card.bg} ${card.color}`}>
                <card.icon className="w-4 h-4" />
              </div>
            </div>
            <div className={`text-2xl sm:text-3xl font-extrabold font-heading ${card.color}`}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Evolution Chart (8 Cols) */}
        <div className="lg:col-span-8 bg-[#0A0A0C] border border-[#1F1F24] p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F1F24]">
            <div>
              <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#E11D48]" />
                <span>Evolução do Estoque & Propostas</span>
              </h3>
              <p className="text-xs text-gray-400">Histórico de volume nos últimos 6 meses</p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stockEvolution}>
                <defs>
                  <linearGradient id="colorPropostas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E11D48" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#E11D48" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEstoque" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#4B5563" fontSize={11} tickLine={false} />
                <YAxis stroke="#4B5563" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#070709', borderColor: '#1F1F24', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="estoque" name="Estoque" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorEstoque)" />
                <Area type="monotone" dataKey="propostas" name="Propostas" stroke="#E11D48" strokeWidth={2} fillOpacity={1} fill="url(#colorPropostas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown Pie (4 Cols) */}
        <div className="lg:col-span-4 bg-[#0A0A0C] border border-[#1F1F24] p-6 rounded-3xl shadow-xl space-y-4">
          <div className="pb-3 border-b border-[#1F1F24]">
            <h3 className="font-heading font-bold text-base text-white">Status dos Veículos</h3>
            <p className="text-xs text-gray-400">Distribuição do estoque atual</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#070709', borderColor: '#1F1F24', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Legend */}
          <div className="space-y-2 pt-2 border-t border-[#1F1F24] text-xs">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-300">{item.name}</span>
                </div>
                <span className="font-bold text-white font-mono">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Recent Activities Section */}
      <div className="bg-[#0A0A0C] border border-[#1F1F24] rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1F1F24]">
          <div>
            <h3 className="font-heading font-bold text-base text-white">Atividades Recentes</h3>
            <p className="text-xs text-gray-400">Últimas interações, propostas e movimentações do estoque</p>
          </div>
          <Link
            to="/admin/propostas"
            className="text-xs font-semibold text-[#E11D48] hover:text-[#F43F5E] flex items-center gap-1"
          >
            <span>Ver todas as propostas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {activities.map((act) => (
            <div
              key={act.id}
              className="flex items-start justify-between p-4 rounded-2xl bg-[#141418] border border-[#1F1F24] gap-4"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">{act.title}</span>
                <p className="text-xs text-gray-400">{act.description}</p>
              </div>
              <span className="text-[10px] font-mono text-gray-500 shrink-0">{act.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
