import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { InstagramIcon } from '../components/Icons';
import { ContactForm } from '../components/ContactForm';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { cleanPhoneForWhatsApp } from '../utils/formatters';

export const Contact: React.FC = () => {
  const { settings } = useSiteSettings();

  const whatsappClean = cleanPhoneForWhatsApp(settings?.whatsapp || '5511999999999');
  const whatsappUrl = `https://wa.me/${whatsappClean}?text=${encodeURIComponent('Olá! Vim pelo site da Raposo Veículos e gostaria de falar com um atendente.')}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A0A0C] border border-[#E11D48]/30 text-[#E11D48] text-xs font-mono font-bold uppercase tracking-wider">
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Fale Conosco</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
          Canais de Atendimento
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-light">
          Estamos prontos para atender você e tirar todas as suas dúvidas sobre veículos, avaliações e financiamento.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left 5 Columns: Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0A0A0C] border border-[#1F1F24] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            <h3 className="font-heading font-bold text-xl text-white">Nossos Contatos</h3>

            <div className="space-y-4 text-xs">
              
              {/* WhatsApp Highlight */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 text-white hover:bg-[#25D366]/20 transition-all group"
              >
                <div className="p-2.5 rounded-xl bg-[#25D366] text-white group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="text-[10px] text-[#25D366] font-bold uppercase font-mono block">WhatsApp Direto</span>
                  <span className="font-bold text-sm">{settings?.phone || '(11) 3456-7890'}</span>
                </div>
              </a>

              {/* Phone */}
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#141418] border border-[#1F1F24]">
                <div className="p-2.5 rounded-xl bg-[#E11D48]/10 text-[#E11D48]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-mono uppercase block">Telefone Fixo</span>
                  <span className="font-bold text-white text-sm">{settings?.phone || '(11) 3456-7890'}</span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#141418] border border-[#1F1F24]">
                <div className="p-2.5 rounded-xl bg-[#E11D48]/10 text-[#E11D48]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-mono uppercase block">E-mail Comercial</span>
                  <span className="font-bold text-white text-sm">{settings?.email || 'contato@raposoveiculos.com.br'}</span>
                </div>
              </div>

              {/* Instagram */}
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#141418] border border-[#1F1F24]">
                <div className="p-2.5 rounded-xl bg-[#E11D48]/10 text-[#E11D48]">
                  <InstagramIcon className="w-5 h-5 text-[#E11D48]" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-mono uppercase block">Instagram Oficial</span>
                  <span className="font-bold text-white text-sm">{settings?.instagram || '@raposoveiculos'}</span>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#141418] border border-[#1F1F24]">
                <div className="p-2.5 rounded-xl bg-[#E11D48]/10 text-[#E11D48] mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-mono uppercase block">Endereço da Loja</span>
                  <span className="font-medium text-white text-xs leading-relaxed">
                    {settings?.address || 'Rodovia Raposo Tavares, km 18 - São Paulo, SP'}
                  </span>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#141418] border border-[#1F1F24]">
                <div className="p-2.5 rounded-xl bg-[#E11D48]/10 text-[#E11D48] mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-mono uppercase block">Horário de Funcionamento</span>
                  <span className="font-medium text-white text-xs leading-relaxed">
                    {settings?.opening_hours || 'Segunda a Sexta: 08h às 19h | Sábado: 08h às 16h'}
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Right 7 Columns: Form and Map */}
        <div className="lg:col-span-7 space-y-6">
          <ContactForm />

          {/* Interactive Map Embed / Location Card */}
          <div className="bg-[#0A0A0C] border border-[#1F1F24] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-white font-heading font-bold text-base">
              <MapPin className="w-4 h-4 text-[#E11D48]" />
              <span>Localização do Showroom</span>
            </div>
            
            <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden border border-[#1F1F24] bg-neutral-900">
              <iframe
                title="Mapa de Localização"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                loading="lazy"
                src="https://maps.google.com/maps?q=Rodovia+Raposo+Tavares+Sao+Paulo&t=&z=14&ie=UTF8&iwloc=&output=embed"
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
