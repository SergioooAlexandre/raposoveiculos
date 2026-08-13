import React from 'react';
import { Award, Users, MapPin, Building, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { cleanPhoneForWhatsApp } from '../utils/formatters';

export const About: React.FC = () => {
  const { settings } = useSiteSettings();

  const whatsappClean = cleanPhoneForWhatsApp(settings?.whatsapp || '5579998476431');
  const whatsappUrl = `https://wa.me/${whatsappClean}?text=${encodeURIComponent('Olá! Gostaria de conhecer melhor a Raposo Veículos.')}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      
      {/* 1. Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A0A0C] border border-[#E11D48]/30 text-[#E11D48] text-xs font-mono font-bold uppercase tracking-wider">
          <Building className="w-3.5 h-3.5" />
          <span>Nossa História & Propósito</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
          Excelência, Procedência e Paixão por Automóveis
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
          Conheça a trajetória da <strong>Raposo Veículos</strong>, uma concessionária concebida para oferecer uma experiência automotiva segura, transparente e de alto padrão.
        </p>
      </div>

      {/* 2. Story Section with Image Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-5 text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
            Mais que vender carros, realizamos conquistas com total segurança.
          </h2>
          <p>
            Fundada com a missão de transformar o mercado de seminovos e veículos premium, a <strong>Raposo Veículos</strong> estabeleceu como pilar inegociável a transparência e a procedência em cada veículo integrado ao nosso showroom.
          </p>
          <p>
            Compreendemos que a aquisição de um automóvel representa um momento significativo na vida de nossos clientes. Por isso, eliminamos burocracias desnecessárias e aplicamos rigorosos laudos de perícia cautelar que certificam estrutura, pintura, histórico de quilometragem e ausência de sinistros ou leilões.
          </p>
          <p>
            Localizados estrategicamente na Rodovia Raposo Tavares, proporcionamos um atendimento personalizado com consultores altamente qualificados e ambiente moderno e acolhedor.
          </p>
        </div>

        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <img
            src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80"
            alt="Showroom Raposo Veículos"
            className="w-full h-64 object-cover rounded-3xl border border-[#1F1F24] shadow-2xl"
          />
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
            alt="Veículos Selecionados"
            className="w-full h-64 object-cover rounded-3xl border border-[#1F1F24] shadow-2xl mt-8"
          />
        </div>
      </div>

      {/* 3. Pillars: Missão, Visão e Valores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="bg-[#0A0A0C] border border-[#1F1F24] p-8 rounded-3xl space-y-4 hover:border-[#E11D48]/30 transition-colors shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-[#E11D48]/10 text-[#E11D48] flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-xl text-white">Missão</h3>
          <p className="text-xs text-gray-400 leading-relaxed font-light">
            Oferecer veículos seminovos e de alto padrão com procedência rigorosamente comprovada, garantindo negociações justas, ágeis e a máxima satisfação de nossos clientes.
          </p>
        </div>

        <div className="bg-[#0A0A0C] border border-[#1F1F24] p-8 rounded-3xl space-y-4 hover:border-[#E11D48]/30 transition-colors shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-[#E11D48]/10 text-[#E11D48] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-xl text-white">Visão</h3>
          <p className="text-xs text-gray-400 leading-relaxed font-light">
            Ser reconhecida como a principal referência de confiança, inovação digital e qualidade em catálogo automotivo de São Paulo e região.
          </p>
        </div>

        <div className="bg-[#0A0A0C] border border-[#1F1F24] p-8 rounded-3xl space-y-4 hover:border-[#E11D48]/30 transition-colors shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-[#E11D48]/10 text-[#E11D48] flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-xl text-white">Valores</h3>
          <p className="text-xs text-gray-400 leading-relaxed font-light">
            Ética inegociável, transparência em todas as etapas, respeito ao cliente, laudos cautelares 100% autênticos e compromisso com o pós-venda.
          </p>
        </div>

      </div>

      {/* 4. Differentials / Security Checklist */}
      <div className="bg-[#0A0A0C] border border-[#1F1F24] rounded-3xl p-8 sm:p-12 shadow-2xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-mono text-[#E11D48] uppercase tracking-widest font-bold">
            Garantia de Procedência
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            Nosso Padrão de Qualidade em 4 Etapas
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          
          <div className="bg-[#141418] p-5 rounded-2xl border border-[#1F1F24] space-y-2">
            <div className="font-mono text-xl font-extrabold text-[#E11D48]">01</div>
            <h4 className="font-bold text-white text-sm">Inspeção Cautelar</h4>
            <p className="text-gray-400">Verificação estrutural em empresa credenciada pelo Detran.</p>
          </div>

          <div className="bg-[#141418] p-5 rounded-2xl border border-[#1F1F24] space-y-2">
            <div className="font-mono text-xl font-extrabold text-[#E11D48]">02</div>
            <h4 className="font-bold text-white text-sm">Revisão Mecânica</h4>
            <p className="text-gray-400">Checagem de mais de 80 itens de segurança, motor e suspensão.</p>
          </div>

          <div className="bg-[#141418] p-5 rounded-2xl border border-[#1F1F24] space-y-2">
            <div className="font-mono text-xl font-extrabold text-[#E11D48]">03</div>
            <h4 className="font-bold text-white text-sm">Documentação Limpa</h4>
            <p className="text-gray-400">Transferência rápida, IPVA regularizado e sem débitos.</p>
          </div>

          <div className="bg-[#141418] p-5 rounded-2xl border border-[#1F1F24] space-y-2">
            <div className="font-mono text-xl font-extrabold text-[#E11D48]">04</div>
            <h4 className="font-bold text-white text-sm">Estética Premium</h4>
            <p className="text-gray-400">Higienização detalhada, polimento e vitrificação de pintura.</p>
          </div>

        </div>
      </div>

      {/* 5. Location and Direct Contact Banner */}
      <div className="bg-gradient-to-r from-[#0A0A0C] via-[#141418] to-[#0A0A0C] border border-[#1F1F24] rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl font-bold font-heading text-white">Venha tomar um café em nosso Showroom</h3>
          <p className="text-xs text-gray-400 flex items-center justify-center md:justify-start gap-2">
            <MapPin className="w-4 h-4 text-[#E11D48]" />
            <span>{settings?.address || 'Rodovia Raposo Tavares, km 18 - São Paulo, SP'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/estoque"
            className="px-6 py-3 rounded-xl bg-[#E11D48] hover:bg-[#F43F5E] text-white font-semibold text-xs shadow-lg shadow-rose-900/30 transition-all"
          >
            Ver Veículos no Estoque
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-[#141418] hover:bg-[#1f1f24] text-white font-semibold text-xs border border-[#2A2A32] transition-colors"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>

    </div>
  );
};
