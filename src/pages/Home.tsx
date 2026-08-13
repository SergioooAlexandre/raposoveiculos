import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  ChevronDown,
  HelpCircle,
  Banknote
} from 'lucide-react';
import type { Vehicle } from '../types';
import { vehicleService } from '../services/vehicleService';
import { VehicleCard } from '../components/VehicleCard';
import { SearchBar } from '../components/SearchBar';
import { LoadingState } from '../components/ConfirmDialog';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { cleanPhoneForWhatsApp } from '../utils/formatters';

export const Home: React.FC = () => {
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { settings } = useSiteSettings();

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const data = await vehicleService.getFeaturedVehicles();
        setFeaturedVehicles(data);
      } catch (err) {
        console.error('Erro ao carregar destaques:', err);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  const whatsappPhone = cleanPhoneForWhatsApp(settings?.whatsapp || '5511999999999');
  const consultantWhatsAppUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent('Olá! Gostaria de falar com um consultor da Raposo Veículos.')}`;

  const faqs = [
    {
      q: 'Quais veículos estão disponíveis na Raposo Veículos?',
      a: 'Nosso catálogo conta com sedans, SUVs, pickups, esportivos e hatches seminovos selecionados e inspecionados. Todos os veículos passam por laudo cautelar aprovado e revisão completa.',
    },
    {
      q: 'Como fazer uma proposta em um veículo?',
      a: 'Basta acessar a página do veículo desejado e clicar no botão "Fazer Proposta" ou "Tenho interesse". Você também pode clicar no botão de WhatsApp para negociar diretamente com um consultor.',
    },
    {
      q: 'Como comprar ou financiar um veículo?',
      a: 'Trabalhamos com os principais bancos e financeiras do país (Santander, Itaú, Bradesco, BV, Safra). Você pode simular o valor das parcelas diretamente no site e nos enviar seus dados para aprovação rápida.',
    },
    {
      q: 'Como reservar um veículo de meu interesse?',
      a: 'Para reservar um veículo e garantir a prioridade na negociação, entre em contato imediatamente pelo nosso WhatsApp oficial. O veículo receberá o status RESERVADO no sistema.',
    },
    {
      q: 'A Raposo Veículos aceita meu carro usado na troca?',
      a: 'Sim! Avaliamos seu veículo seminovo com excelente precificação de mercado para ser utilizado como entrada no seu próximo carro.',
    },
  ];

  return (
    <div className="space-y-24">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#E11D48]/15 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-[#D4AF37]/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0A0A0C] border border-[#E11D48]/40 shadow-[0_0_20px_rgba(225,29,72,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-[#E11D48]" />
              <span className="text-xs font-semibold text-gray-200 tracking-wide">
                Catálogo Digital Premium & Estoque Selecionado
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-heading text-white tracking-tight leading-[1.1]">
              Seu próximo carro <span className="text-gradient-red">está aqui.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto font-light">
              Encontre veículos selecionados, com qualidade, procedência e atendimento especializado.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/estoque"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#E11D48] hover:bg-[#F43F5E] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(225,29,72,0.45)] transition-all transform hover:-translate-y-0.5"
              >
                <span>Ver veículos no estoque</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={consultantWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0A0A0C] hover:bg-[#141418] text-white text-sm font-semibold flex items-center justify-center gap-2 border border-[#2A2A32] hover:border-white/20 transition-all"
              >
                <span>Falar com um consultor</span>
              </a>
            </div>

          </div>

          {/* Quick Search Mechanism Bar */}
          <div className="mt-14 max-w-5xl mx-auto">
            <SearchBar />
          </div>

        </div>
      </section>

      {/* 2. VEÍCULOS EM DESTAQUE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#1F1F24]">
          <div>
            <div className="flex items-center gap-2 text-[#E11D48] text-xs font-mono font-bold uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Seleção Especial</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
              Veículos em Destaque
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Os modelos mais desejados e exclusivos do nosso showroom.
            </p>
          </div>

          <Link
            to="/estoque"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#E11D48] hover:text-[#F43F5E] group"
          >
            <span>Ver todo o estoque</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <LoadingState message="Carregando veículos em destaque..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </section>

      {/* 3. VALUE PROPOSITIONS / WHY RAPOSO */}
      <section className="bg-[#070709] border-y border-[#1F1F24] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-[11px] font-mono text-[#E11D48] uppercase tracking-widest font-bold">
              Compromisso com a Excelência
            </span>
            <h2 className="text-3xl font-bold font-heading text-white">Por que escolher a Raposo Veículos?</h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Trabalhamos com transparência absoluta e os mais rigorosos padrões automotivos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-8 rounded-2xl bg-[#0A0A0C] border border-[#1F1F24] hover:border-[#E11D48]/30 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#E11D48]/10 border border-[#E11D48]/30 flex items-center justify-center text-[#E11D48]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-white">Laudo Cautelar 100% Aprovado</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Todos os veículos do estoque passam por perícia técnica rigorosa que atesta estrutura, quilometragem original e histórico sem leilão ou sinistro.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#0A0A0C] border border-[#1F1F24] hover:border-[#E11D48]/30 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#E11D48]/10 border border-[#E11D48]/30 flex items-center justify-center text-[#E11D48]">
                <Banknote className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-white">Melhores Taxas de Financiamento</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Parceria direta com os maiores bancos nacionais para garantir aprovação ágil, taxas de juros competitivas e prazos de até 72 meses.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#0A0A0C] border border-[#1F1F24] hover:border-[#E11D48]/30 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#E11D48]/10 border border-[#E11D48]/30 flex items-center justify-center text-[#E11D48]">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-white">Atendimento Personalizado</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Consultores especializados prontos para entender seu perfil, avaliar seu veículo na troca com justiça e entregar a melhor experiência de compra.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. FAQ SECTION (AEO & GEO OPTIMIZATION) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#E11D48] uppercase tracking-widest font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tire Suas Dúvidas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">Perguntas Frequentes (FAQ)</h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Respostas claras sobre nosso processo de compra, simulação e estoque.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-[#0A0A0C] border border-[#1F1F24] rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm font-semibold text-white hover:text-[#E11D48] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#E11D48]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-gray-400 leading-relaxed border-t border-[#1F1F24] pt-3 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0A0A0C] via-[#141418] to-[#0A0A0C] border border-[#1F1F24] p-8 sm:p-14 text-center space-y-6 shadow-2xl">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#E11D48]/20 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#D4AF37]/15 blur-3xl rounded-full pointer-events-none" />

          <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
            Pronto para encontrar seu novo veículo?
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            Consulte nosso estoque em tempo real ou chame nossos consultores no WhatsApp para receber ofertas exclusivas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              to="/estoque"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#E11D48] hover:bg-[#F43F5E] text-white font-semibold text-xs shadow-[0_0_25px_rgba(225,29,72,0.4)] transition-all"
            >
              Explorar Catálogo Completo
            </Link>
            <a
              href={consultantWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#141418] hover:bg-[#1f1f24] text-white font-semibold text-xs border border-[#2A2A32] transition-colors"
            >
              Atendimento pelo WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
