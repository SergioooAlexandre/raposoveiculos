import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  MessageCircle,
  Search
} from 'lucide-react';
import type { Proposal, ProposalStatus } from '../../types';
import { proposalService } from '../../services/proposalService';
import { LoadingState, EmptyState } from '../../components/ConfirmDialog';
import { formatCurrency, cleanPhoneForWhatsApp } from '../../utils/formatters';
import { useToast } from '../../hooks/useToast';

export const AdminProposals: React.FC = () => {
  const { showToast } = useToast();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const data = await proposalService.getProposals();
      setProposals(data);
    } catch (err) {
      console.error(err);
      showToast('Erro ao carregar propostas.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleStatusChange = async (id: string, newStatus: ProposalStatus) => {
    try {
      const ok = await proposalService.updateProposalStatus(id, newStatus);
      if (ok) {
        setProposals(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
        showToast('Status da proposta atualizado.', 'success');
      }
    } catch {
      showToast('Erro ao atualizar status da proposta.', 'error');
    }
  };

  const handleOpenWhatsApp = (proposal: Proposal) => {
    const cleanNumber = cleanPhoneForWhatsApp(proposal.whatsapp || proposal.phone);
    const msg = `Olá ${proposal.name}! Sou consultor da Raposo Veículos sobre a proposta de ${formatCurrency(proposal.proposal_value)} enviada no veículo ${proposal.vehicle_title || ''}. Gostaria de conversar com você!`;
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const filteredProposals = proposals.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm) ||
      (p.vehicle_title && p.vehicle_title.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = !statusFilter || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-[#0A0A0C] border border-[#1F1F24] p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-white">Propostas Comerciais</h2>
          <p className="text-xs text-gray-400">Acompanhe as intenções de compra e simulações enviadas pelos clientes</p>
        </div>

        <div className="text-xs font-mono text-[#E11D48] font-bold bg-[#E11D48]/10 px-3 py-1.5 rounded-xl border border-[#E11D48]/30 self-start sm:self-auto">
          {proposals.length} {proposals.length === 1 ? 'proposta registrada' : 'propostas registradas'}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0A0A0C] border border-[#1F1F24] p-4 rounded-2xl">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar por cliente, e-mail, telefone ou veículo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E11D48]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            { label: 'Todas', value: '' },
            { label: 'Nova', value: 'NOVA' },
            { label: 'Em Análise', value: 'EM_ANALISE' },
            { label: 'Negociando', value: 'NEGOCIANDO' },
            { label: 'Aprovada', value: 'APROVADA' },
            { label: 'Recusada', value: 'RECUSADA' },
          ].map(st => (
            <button
              key={st.value}
              type="button"
              onClick={() => setStatusFilter(st.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all whitespace-nowrap ${
                statusFilter === st.value
                  ? 'bg-[#E11D48] border-[#E11D48] text-white font-semibold'
                  : 'bg-[#141418] border-[#2A2A32] text-gray-400 hover:text-white'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <LoadingState message="Carregando propostas..." />
      ) : filteredProposals.length === 0 ? (
        <EmptyState
          title="Nenhuma proposta encontrada"
          description="Nenhuma proposta comercial corresponde aos filtros aplicados."
          icon={<FileSpreadsheet className="w-8 h-8" />}
        />
      ) : (
        <div className="space-y-4">
          {filteredProposals.map((prop) => (
            <div
              key={prop.id}
              className="bg-[#0A0A0C] border border-[#1F1F24] hover:border-[#E11D48]/30 p-6 rounded-3xl shadow-xl transition-all space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-[#1F1F24]">
                
                {/* Client Info */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#E11D48]/10 text-[#E11D48] flex items-center justify-center font-bold text-sm shrink-0">
                    {prop.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-white text-base">{prop.name}</span>
                      <span className="text-[10px] font-mono text-gray-400 bg-[#141418] px-2 py-0.5 rounded border border-[#2A2A32]">
                        {new Date(prop.created_at).toLocaleDateString('pt-BR')} às {new Date(prop.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-1">
                      <span>Tel: {prop.phone}</span>
                      <span>•</span>
                      <span>Email: {prop.email}</span>
                      {prop.vehicle_title && (
                        <>
                          <span>•</span>
                          <span className="text-[#E11D48] font-semibold">{prop.vehicle_title}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Dropdown & WhatsApp Action */}
                <div className="flex items-center gap-3 self-end lg:self-center">
                  <select
                    value={prop.status}
                    onChange={(e) => handleStatusChange(prop.id, e.target.value as ProposalStatus)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border focus:outline-none ${
                      prop.status === 'NOVA'
                        ? 'bg-blue-950/60 border-blue-500/40 text-blue-300'
                        : prop.status === 'EM_ANALISE' || prop.status === 'NEGOCIANDO'
                        ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                        : prop.status === 'APROVADA'
                        ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                        : 'bg-neutral-900 border-neutral-700 text-gray-400'
                    }`}
                  >
                    <option value="NOVA">Nova</option>
                    <option value="EM_ANALISE">Em Análise</option>
                    <option value="NEGOCIANDO">Negociando</option>
                    <option value="APROVADA">Aprovada</option>
                    <option value="RECUSADA">Recusada</option>
                    <option value="FINALIZADA">Finalizada</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleOpenWhatsApp(prop)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-lg shadow-green-950/30 transition-all shrink-0"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Chamar no WhatsApp</span>
                  </button>
                </div>

              </div>

              {/* Financial proposal numbers */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#141418] p-4 rounded-2xl text-xs">
                <div>
                  <span className="text-[10px] text-gray-500 font-mono uppercase block">Valor Ofertado</span>
                  <span className="text-base font-extrabold font-heading text-[#E11D48]">{formatCurrency(prop.proposal_value)}</span>
                </div>

                <div>
                  <span className="text-[10px] text-gray-500 font-mono uppercase block">Valor de Entrada</span>
                  <span className="text-base font-extrabold font-heading text-white">{formatCurrency(prop.down_payment)}</span>
                </div>

                <div>
                  <span className="text-[10px] text-gray-500 font-mono uppercase block">Parcelamento Pretendido</span>
                  <span className="text-sm font-bold text-gray-300">{prop.installments_count || 48} parcelas</span>
                </div>
              </div>

              {/* Message */}
              {prop.message && (
                <div className="text-xs text-gray-400 bg-[#070709] p-3 rounded-xl border border-[#1F1F24]">
                  <strong className="text-gray-300">Mensagem do cliente:</strong> {prop.message}
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
