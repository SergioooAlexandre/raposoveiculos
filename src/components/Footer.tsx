import React from 'react';
import { Link } from 'react-router-dom';
import { Car, MapPin, Phone, Mail, Clock, MessageCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { InstagramIcon } from './Icons';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { cleanPhoneForWhatsApp } from '../utils/formatters';

export const Footer: React.FC = () => {
  const { settings } = useSiteSettings();

  const whatsappClean = cleanPhoneForWhatsApp(settings?.whatsapp || '5579998476431');
  const whatsappUrl = `https://wa.me/${whatsappClean}?text=${encodeURIComponent('Olá! Vim pelo site da Raposo Veículos e gostaria de mais informações.')}`;
  const instagramHandle = settings?.instagram || '@nexussitesbr';
  const instagramUrl = `https://instagram.com/${instagramHandle.replace('@', '')}`;

  return (
    <footer className="bg-[#030303] border-t border-[#1F1F24] text-gray-400 text-sm mt-20">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Store Branding & Slogan */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E11D48] to-[#9F1239] flex items-center justify-center shadow-[0_0_15px_rgba(225,29,72,0.4)]">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-heading tracking-tight text-white">
                RAPOSO <span className="text-[#E11D48]">VEÍCULOS</span>
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              Excelência e sofisticação no mercado automotivo. Veículos vistoriados, com procedência rigorosamente verificada e condições especiais de financiamento.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0A0A0C] border border-[#1F1F24] text-[11px] text-gray-300">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E11D48]" />
                Procedência e Garantia Asseguradas
              </span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-white font-heading font-semibold text-base tracking-wide">Navegação</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-[#E11D48] transition-colors">Início</Link>
              </li>
              <li>
                <Link to="/estoque" className="hover:text-[#E11D48] transition-colors">Estoque Completo</Link>
              </li>
              <li>
                <Link to="/ofertas" className="hover:text-[#E11D48] transition-colors">Veículos em Oferta</Link>
              </li>
              <li>
                <Link to="/favoritos" className="hover:text-[#E11D48] transition-colors">Meus Favoritos</Link>
              </li>
              <li>
                <Link to="/sobre" className="hover:text-[#E11D48] transition-colors">Sobre a Raposo Veículos</Link>
              </li>
              <li>
                <Link to="/contato" className="hover:text-[#E11D48] transition-colors">Fale Conosco</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div className="space-y-4">
            <h4 className="text-white font-heading font-semibold text-base tracking-wide">Atendimento</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E11D48] shrink-0 mt-0.5" />
                <span>{settings?.address || 'Rodovia Raposo Tavares, km 18 - São Paulo, SP'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E11D48] shrink-0" />
                <span>{settings?.phone || '(79) 99847-6431'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#25D366] transition-colors"
                >
                  WhatsApp da Loja
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#E11D48] shrink-0" />
                <span>{settings?.email || 'contato@raposoveiculos.com.br'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <InstagramIcon className="w-4 h-4 text-[#E11D48] shrink-0" />
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E11D48] transition-colors"
                >
                  {instagramHandle}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Hours & Legal */}
          <div className="space-y-4">
            <h4 className="text-white font-heading font-semibold text-base tracking-wide">Horário de Funcionamento</h4>
            <div className="flex items-start gap-2.5 text-xs">
              <Clock className="w-4 h-4 text-[#E11D48] shrink-0 mt-0.5" />
              <span>{settings?.opening_hours || 'Segunda a Sexta: 08h às 19h | Sábado: 08h às 16h'}</span>
            </div>
            
            <div className="pt-4 border-t border-[#1F1F24] space-y-2">
              <h5 className="text-xs font-semibold text-gray-300">Termos e Conformidade</h5>
              <div className="flex flex-col gap-1.5 text-xs">
                <Link to="/privacidade" className="hover:text-[#E11D48] transition-colors">
                  Política de Privacidade (LGPD)
                </Link>
                <Link to="/termos" className="hover:text-[#E11D48] transition-colors">
                  Termos de Uso
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar with Mandatory Nexus Sites BR Credit */}
      <div className="border-t border-[#1F1F24] bg-[#020202]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          
          {/* Copyright Raposo Veículos */}
          <div className="text-gray-400 text-center sm:text-left">
            © 2026 Raposo Veículos. Todos os direitos reservados.
          </div>

          {/* MANDATORY CREDIT: Nexus Sites BR */}
          <div className="flex items-center gap-1.5 text-gray-400">
            <span>Desenvolvido por</span>
            <a
              href="https://nexus-sites-br.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gray-200 hover:text-[#E11D48] inline-flex items-center gap-1 transition-colors group"
            >
              <span className="underline underline-offset-4 decoration-[#E11D48]/50 group-hover:decoration-[#E11D48]">
                Nexus Sites BR
              </span>
              <ExternalLink className="w-3 h-3 text-[#E11D48] opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};
