import React, { useState } from 'react';
import { X, Send, MessageCircle, CheckCircle2, Loader2 } from 'lucide-react';
import type { Vehicle } from '../types';
import { proposalService } from '../services/proposalService';
import { useToast } from '../hooks/useToast';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { formatCurrency, cleanPhoneForWhatsApp } from '../utils/formatters';

interface ProposalModalProps {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
  initialDownPayment?: number;
  initialInstallments?: number;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  initialDownPayment = 0,
  initialInstallments = 48,
}) => {
  const { showToast } = useToast();
  const { settings } = useSiteSettings();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [proposalValue, setProposalValue] = useState<number>(vehicle.promotional_price || vehicle.price);
  const [downPayment, setDownPayment] = useState<number>(initialDownPayment);
  const [installments, setInstallments] = useState<number>(initialInstallments);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) {
      showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }

    setLoading(true);
    try {
      await proposalService.createProposal({
        vehicle_id: vehicle.id,
        vehicle_title: `${vehicle.brand} ${vehicle.model} ${vehicle.version} ${vehicle.year}`,
        name,
        phone,
        whatsapp: whatsapp || phone,
        email,
        proposal_value: proposalValue,
        down_payment: downPayment,
        installments_count: installments,
        message,
      });

      setSuccess(true);
      showToast('Proposta enviada com sucesso! Nossa equipe entrará em contato.', 'success');
    } catch (err: any) {
      console.error(err);
      showToast('Erro ao enviar proposta. Tente novamente ou chame no WhatsApp.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendViaWhatsApp = () => {
    const rawNumber = settings?.whatsapp || '5579998476431';
    const cleanNumber = cleanPhoneForWhatsApp(rawNumber);
    const msg = `*PROPOSTA DE COMPRA - RAPOSO VEÍCULOS*
Veículo: ${vehicle.brand} ${vehicle.model} ${vehicle.year}
Valor Proposto: ${formatCurrency(proposalValue)}
Entrada: ${formatCurrency(downPayment)} (${installments}x)
Cliente: ${name || 'Não informado'}
Telefone: ${phone || 'Não informado'}
E-mail: ${email || 'Não informado'}
${message ? `Mensagem: ${message}` : ''}`;

    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#0A0A0C] border border-[#1F1F24] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8">
        
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#141418] text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-8 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-heading text-white">Proposta Enviada com Sucesso!</h3>
            <p className="text-sm text-gray-400 max-w-sm mx-auto">
              Recebemos sua proposta para o <strong className="text-white">{vehicle.brand} {vehicle.model}</strong>. Nossos consultores analisarão e responderão em breve.
            </p>
            <div className="pt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleSendViaWhatsApp}
                className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Acelerar pelo WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-[#141418] text-gray-300 text-sm font-medium hover:text-white"
              >
                Fechar janela
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Modal Header */}
            <div>
              <span className="text-[10px] font-mono text-[#E11D48] uppercase tracking-widest font-bold">
                Negociação Direta
              </span>
              <h3 className="text-xl font-bold font-heading text-white tracking-tight">
                Fazer Proposta
              </h3>
              <p className="text-xs text-gray-400 mt-0.5 truncate">
                {vehicle.brand} {vehicle.model} {vehicle.version} ({vehicle.year})
              </p>
            </div>

            {/* Inputs Grid */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E11D48]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Telefone / Celular *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(11) 98888-7777"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setWhatsapp(e.target.value);
                    }}
                    className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E11D48]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E11D48]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Valor da Proposta (R$)
                  </label>
                  <input
                    type="number"
                    value={proposalValue}
                    onChange={(e) => setProposalValue(Number(e.target.value))}
                    className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono font-bold text-[#E11D48] focus:outline-none focus:border-[#E11D48]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Valor de Entrada (R$)
                  </label>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#E11D48]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Parcelas Pretendidas
                </label>
                <select
                  value={installments}
                  onChange={(e) => setInstallments(Number(e.target.value))}
                  className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#E11D48]"
                >
                  <option value={12}>12x parcelas</option>
                  <option value={24}>24x parcelas</option>
                  <option value={36}>36x parcelas</option>
                  <option value={48}>48x parcelas</option>
                  <option value={60}>60x parcelas</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Mensagem / Observações (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Tenho carro na troca, gostaria de agendar uma visita..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E11D48]"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-3 space-y-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#E11D48] hover:bg-[#F43F5E] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(225,29,72,0.35)] transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Enviar Proposta Formal</span>
              </button>

              <button
                type="button"
                onClick={handleSendViaWhatsApp}
                className="w-full py-2.5 rounded-xl bg-[#141418] hover:bg-[#1f1f24] text-[#25D366] text-xs font-semibold flex items-center justify-center gap-2 border border-[#2A2A32] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Negociar agora pelo WhatsApp</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
