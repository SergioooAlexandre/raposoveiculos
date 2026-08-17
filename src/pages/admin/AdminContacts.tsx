import React, { useState, useEffect } from 'react';
import {
  Users,
  MessageCircle,
  Search
} from 'lucide-react';
import type { Lead, LeadStatus } from '../../types';
import { contactService } from '../../services/contactService';
import { LoadingState, EmptyState } from '../../components/ConfirmDialog';
import { cleanPhoneForWhatsApp } from '../../utils/formatters';
import { useToast } from '../../hooks/useToast';

export const AdminContacts: React.FC = () => {
  const { showToast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await contactService.getLeads();
      setLeads(data);
    } catch (err) {
      console.error(err);
      showToast('Erro ao carregar contatos.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();

    const unsubscribe = contactService.subscribeToRealtime(() => {
      fetchLeads();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    try {
      const ok = await contactService.updateLeadStatus(id, newStatus);
      if (ok) {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
        showToast('Status do contato atualizado.', 'success');
      }
    } catch {
      showToast('Erro ao atualizar status.', 'error');
    }
  };

  const handleOpenWhatsApp = (lead: Lead) => {
    const cleanNumber = cleanPhoneForWhatsApp(lead.whatsapp || lead.phone);
    const msg = `Olá ${lead.name}! Sou consultor da Raposo Veículos. Recebemos sua mensagem enviada pelo site e estou à disposição para ajudar!`;
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.includes(searchTerm) ||
      l.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-[#0A0A0C] border border-[#1F1F24] p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-white">Leads e Contatos</h2>
          <p className="text-xs text-gray-400">Mensagens e dúvidas enviadas pelos visitantes do catálogo</p>
        </div>

        <div className="text-xs font-mono text-[#E11D48] font-bold bg-[#E11D48]/10 px-3 py-1.5 rounded-xl border border-[#E11D48]/30 self-start sm:self-auto">
          {leads.length} {leads.length === 1 ? 'mensagem registrada' : 'mensagens registradas'}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0A0A0C] border border-[#1F1F24] p-4 rounded-2xl">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar por nome, e-mail, telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E11D48]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            { label: 'Todos', value: '' },
            { label: 'Novo', value: 'NOVO' },
            { label: 'Em Atendimento', value: 'EM_ATENDIMENTO' },
            { label: 'Respondido', value: 'RESPONDIDO' },
            { label: 'Finalizado', value: 'FINALIZADO' },
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
        <LoadingState message="Carregando mensagens recebidas..." />
      ) : filteredLeads.length === 0 ? (
        <EmptyState
          title="Nenhum contato encontrado"
          description="Nenhuma mensagem corresponde aos filtros selecionados."
          icon={<Users className="w-8 h-8" />}
        />
      ) : (
        <div className="space-y-4">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-[#0A0A0C] border border-[#1F1F24] hover:border-[#E11D48]/30 p-6 rounded-3xl shadow-xl transition-all space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-[#1F1F24]">
                
                {/* User info */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-sm shrink-0">
                    {lead.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-white text-base">{lead.name}</span>
                      <span className="text-[10px] font-mono text-gray-400 bg-[#141418] px-2 py-0.5 rounded border border-[#2A2A32]">
                        {new Date(lead.created_at).toLocaleDateString('pt-BR')} às {new Date(lead.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-1">
                      <span>Tel: {lead.phone}</span>
                      <span>•</span>
                      <span>Email: {lead.email}</span>
                      {lead.vehicle_title && (
                        <>
                          <span>•</span>
                          <span className="text-[#E11D48] font-semibold">Veículo: {lead.vehicle_title}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status selector & Action */}
                <div className="flex items-center gap-3 self-end lg:self-center">
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border focus:outline-none ${
                      lead.status === 'NOVO'
                        ? 'bg-blue-950/60 border-blue-500/40 text-blue-300'
                        : lead.status === 'EM_ATENDIMENTO'
                        ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                        : lead.status === 'RESPONDIDO'
                        ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                        : 'bg-neutral-900 border-neutral-700 text-gray-400'
                    }`}
                  >
                    <option value="NOVO">Novo</option>
                    <option value="EM_ATENDIMENTO">Em Atendimento</option>
                    <option value="RESPONDIDO">Respondido</option>
                    <option value="FINALIZADO">Finalizado</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleOpenWhatsApp(lead)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-lg shadow-green-950/30 transition-all shrink-0"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>WhatsApp</span>
                  </button>
                </div>

              </div>

              {/* Message body */}
              <div className="text-xs text-gray-300 bg-[#141418] p-4 rounded-2xl border border-[#2A2A32] leading-relaxed">
                {lead.message}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
