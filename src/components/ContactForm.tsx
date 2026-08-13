import React, { useState } from 'react';
import { Send, MessageCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { contactService } from '../services/contactService';
import { useToast } from '../hooks/useToast';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { cleanPhoneForWhatsApp } from '../utils/formatters';

interface ContactFormProps {
  vehicleId?: string;
  vehicleTitle?: string;
  onSuccess?: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  vehicleId,
  vehicleTitle,
  onSuccess,
}) => {
  const { showToast } = useToast();
  const { settings } = useSiteSettings();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(
    vehicleTitle ? `Olá! Gostaria de mais informações sobre o veículo ${vehicleTitle}.` : ''
  );
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || !message) {
      showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }

    setLoading(true);
    try {
      await contactService.createLead({
        vehicle_id: vehicleId || null,
        vehicle_title: vehicleTitle || null,
        name,
        phone,
        whatsapp: whatsapp || phone,
        email,
        message,
      });

      setSubmitted(true);
      showToast('Mensagem enviada com sucesso! Em breve entraremos em contato.', 'success');
      onSuccess?.();
    } catch (err: any) {
      console.error(err);
      showToast('Erro ao enviar mensagem. Tente novamente ou use nosso WhatsApp.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    const rawNumber = settings?.whatsapp || '5511999999999';
    const cleanNumber = cleanPhoneForWhatsApp(rawNumber);
    const text = `Olá! Meu nome é ${name || 'Cliente'}. ${
      vehicleTitle ? `Estou interessado no veículo *${vehicleTitle}*.` : 'Gostaria de falar com um consultor.'
    } ${message ? `Mensagem: ${message}` : ''}`;

    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (submitted) {
    return (
      <div className="bg-[#0A0A0C] border border-[#1F1F24] rounded-2xl p-8 text-center space-y-4 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold font-heading text-white">Mensagem Recebida!</h3>
        <p className="text-sm text-gray-400 max-w-md mx-auto">
          Agradecemos o seu contato. Um de nossos consultores da Raposo Veículos responderá o mais breve possível.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setName('');
            setPhone('');
            setWhatsapp('');
            setEmail('');
            setMessage('');
          }}
          className="mt-4 px-6 py-2.5 rounded-xl bg-[#141418] hover:bg-[#1f1f24] text-xs font-semibold text-gray-300 hover:text-white transition-colors"
        >
          Enviar nova mensagem
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0C] border border-[#1F1F24] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
      
      {/* Header */}
      <div>
        <span className="text-[11px] font-mono text-[#E11D48] uppercase tracking-widest font-bold block">
          Fale com a Raposo Veículos
        </span>
        <h3 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight mt-1">
          {vehicleTitle ? 'Tenho interesse neste veículo' : 'Envie uma mensagem'}
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Preencha seus dados abaixo e nossos consultores responderão prontamente.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Name */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
            Nome Completo *
          </label>
          <input
            type="text"
            required
            placeholder="Ex: João da Silva"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E11D48] transition-colors"
          />
        </div>

        {/* Contact info row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Telefone / WhatsApp *
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
              className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E11D48] transition-colors"
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
              className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E11D48] transition-colors"
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
            Mensagem *
          </label>
          <textarea
            rows={3}
            required
            placeholder="Como podemos ajudar você? (Dúvidas sobre o veículo, proposta de troca, financiamento...)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E11D48] transition-colors resize-none"
          />
        </div>

        {/* Actions */}
        <div className="pt-2 space-y-2.5">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#E11D48] hover:bg-[#F43F5E] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(225,29,72,0.35)] transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Enviar Mensagem</span>
          </button>

          <button
            type="button"
            onClick={handleWhatsAppRedirect}
            className="w-full py-2.5 rounded-xl bg-[#141418] hover:bg-[#1f1f24] text-[#25D366] text-xs font-semibold flex items-center justify-center gap-2 border border-[#2A2A32] transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Falar diretamente pelo WhatsApp</span>
          </button>
        </div>

      </form>

    </div>
  );
};
