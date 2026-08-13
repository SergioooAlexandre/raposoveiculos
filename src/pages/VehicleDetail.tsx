import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Car,
  Gauge,
  Fuel,
  Cog,
  ShieldCheck,
  Calendar,
  Layers,
  Palette,
  Zap,
  Activity,
  Compass,
  KeyRound,
  FileCheck2,
  Heart,
  Share2,
  Play,
  MessageCircle,
  FileSpreadsheet,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import type { Vehicle } from '../types';
import { vehicleService } from '../services/vehicleService';
import { VehicleGallery } from '../components/VehicleGallery';
import { VehicleStatusBadge } from '../components/VehicleStatusBadge';
import { FinancingSimulator } from '../components/FinancingSimulator';
import { ProposalModal } from '../components/ProposalModal';
import { VideoModal } from '../components/VideoModal';
import { ContactForm } from '../components/ContactForm';
import { LoadingState, EmptyState } from '../components/ConfirmDialog';
import { formatCurrency, formatKm, cleanPhoneForWhatsApp } from '../utils/formatters';
import { useFavorites } from '../hooks/useFavorites';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useToast } from '../hooks/useToast';

export const VehicleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [initialDownPayment, setInitialDownPayment] = useState(0);
  const [initialInstallments, setInitialInstallments] = useState(48);

  const { isFavorite, toggleFavorite } = useFavorites();
  const { settings } = useSiteSettings();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchDetail = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const data = await vehicleService.getVehicleBySlug(slug);
        setVehicle(data);
        if (data) {
          // Dynamic SEO update
          document.title = `${data.brand} ${data.model} ${data.version} ${data.year} | Raposo Veículos`;
        }
      } catch (err) {
        console.error('Erro ao carregar detalhes do veículo:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [slug]);

  if (loading) {
    return <LoadingState message="Carregando ficha técnica do veículo..." />;
  }

  if (!vehicle) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <EmptyState
          title="Veículo não encontrado"
          description="O veículo solicitado pode ter sido vendido ou o link está incorreto."
          actionText="Voltar ao Estoque"
          onAction={() => window.location.href = '/estoque'}
          icon={<Car className="w-8 h-8" />}
        />
      </div>
    );
  }

  const favorited = isFavorite(vehicle.id);
  const rawNumber = settings?.whatsapp || '5579998476431';
  const cleanNumber = cleanPhoneForWhatsApp(rawNumber);
  const vehicleWhatsAppUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    `Olá! Tenho interesse no veículo *${vehicle.brand} ${vehicle.model} ${vehicle.version} (${vehicle.year})* que vi no site da Raposo Veículos. Gostaria de mais informações.`
  )}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${vehicle.brand} ${vehicle.model} - Raposo Veículos`,
        text: `Confira este ${vehicle.brand} ${vehicle.model} na Raposo Veículos`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copiado para a área de transferência!', 'info');
    }
  };

  const handleApplySimulation = (downPayment: number, installments: number) => {
    setInitialDownPayment(downPayment);
    setInitialInstallments(installments);
    setProposalModalOpen(true);
  };

  // Structured Data Schema.org for Car Listing
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: `${vehicle.brand} ${vehicle.model} ${vehicle.version}`,
    brand: { '@type': 'Brand', name: vehicle.brand },
    model: vehicle.model,
    vehicleModelDate: vehicle.year.toString(),
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: vehicle.mileage,
      unitCode: 'KMT',
    },
    offers: {
      '@type': 'Offer',
      price: vehicle.promotional_price || vehicle.price,
      priceCurrency: 'BRL',
      availability: vehicle.status === 'DISPONIVEL' ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
    },
    image: vehicle.primary_image,
    description: vehicle.description,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-400 font-medium overflow-x-auto pb-1">
        <Link to="/" className="hover:text-white transition-colors">Início</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <Link to="/estoque" className="hover:text-white transition-colors">Estoque</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <span className="text-[#E11D48] truncate">{vehicle.brand} {vehicle.model}</span>
      </nav>

      {/* Top Main Section: Gallery & Purchase Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 Columns: Gallery & Video */}
        <div className="lg:col-span-7 space-y-6">
          <VehicleGallery
            media={vehicle.media}
            title={`${vehicle.brand} ${vehicle.model}`}
            fallbackImage={vehicle.primary_image}
          />

          {/* Video Trigger button when video exists */}
          {vehicle.video_url && (
            <button
              type="button"
              onClick={() => setVideoModalOpen(true)}
              className="w-full py-3.5 px-5 rounded-2xl bg-[#0A0A0C] hover:bg-[#141418] border border-[#1F1F24] hover:border-[#E11D48]/50 text-white text-xs font-semibold flex items-center justify-center gap-2.5 shadow-xl transition-all group"
            >
              <div className="p-1.5 rounded-lg bg-[#E11D48] text-white group-hover:scale-110 transition-transform">
                <Play className="w-3.5 h-3.5 fill-current" />
              </div>
              <span>Assistir ao Vídeo do Veículo</span>
            </button>
          )}
        </div>

        {/* Right 5 Columns: Key Info, Price & Actions Box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0A0A0C] border border-[#1F1F24] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Header / Brand / Status */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#E11D48] font-bold">
                  {vehicle.brand}
                </span>
                
                <VehicleStatusBadge
                  status={vehicle.status}
                  featured={vehicle.featured}
                  isOffer={vehicle.is_offer}
                  size="sm"
                />
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
                {vehicle.model}
              </h1>

              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                {vehicle.version}
              </p>
            </div>

            {/* Price Box */}
            <div className="bg-[#141418] border border-[#1F1F24] p-5 rounded-2xl space-y-1">
              {vehicle.is_offer && vehicle.promotional_price ? (
                <div>
                  <span className="text-xs text-gray-500 line-through block">
                    De: {formatCurrency(vehicle.price)}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold font-heading text-[#D4AF37]">
                      {formatCurrency(vehicle.promotional_price)}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37]">
                      Oferta
                    </span>
                  </div>
                </div>
              ) : (
                <div>
                  <span className="text-[11px] text-gray-400 uppercase tracking-wider block">Preço à vista</span>
                  <div className="text-3xl font-extrabold font-heading text-white">
                    {formatCurrency(vehicle.price)}
                  </div>
                </div>
              )}
              <span className="text-[10px] text-gray-500 block pt-1">
                Consulte condições de troca e financiamento
              </span>
            </div>

            {/* Main Action CTAs */}
            <div className="space-y-3 pt-2">
              <a
                href={vehicleWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(37,211,102,0.35)] transition-all transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Negociar no WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setProposalModalOpen(true)}
                className="w-full py-3.5 rounded-xl bg-[#E11D48] hover:bg-[#F43F5E] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(225,29,72,0.35)] transition-all"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Fazer Proposta Online</span>
              </button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => toggleFavorite(vehicle.id)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    favorited
                      ? 'bg-[#E11D48]/15 border-[#E11D48] text-[#E11D48]'
                      : 'bg-[#141418] border-[#2A2A32] text-gray-300 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
                  <span>{favorited ? 'Favoritado' : 'Favoritar'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="py-2.5 px-3 rounded-xl bg-[#141418] border border-[#2A2A32] hover:border-white/20 text-gray-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Compartilhar</span>
                </button>
              </div>
            </div>

            {/* Security Guarantee Box */}
            <div className="border-t border-[#1F1F24] pt-4 space-y-2 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Laudo Cautelar Aprovado</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Documentação 100% Regularizada</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Technical Specifications Grid */}
      <section className="bg-[#0A0A0C] border border-[#1F1F24] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="border-b border-[#1F1F24] pb-4">
          <h2 className="text-xl font-bold font-heading text-white">Ficha Técnica e Informações</h2>
          <p className="text-xs text-gray-400">Especificações técnicas detalhadas deste modelo</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 text-xs">
          
          <div className="bg-[#141418] border border-[#1F1F24] p-4 rounded-2xl space-y-1">
            <Calendar className="w-4 h-4 text-[#E11D48]" />
            <span className="text-gray-500 text-[10px] uppercase font-mono block">Ano / Modelo</span>
            <span className="font-bold text-white text-sm">{vehicle.year} / {vehicle.model_year}</span>
          </div>

          <div className="bg-[#141418] border border-[#1F1F24] p-4 rounded-2xl space-y-1">
            <Gauge className="w-4 h-4 text-[#E11D48]" />
            <span className="text-gray-500 text-[10px] uppercase font-mono block">Quilometragem</span>
            <span className="font-bold text-white text-sm">{formatKm(vehicle.mileage)}</span>
          </div>

          <div className="bg-[#141418] border border-[#1F1F24] p-4 rounded-2xl space-y-1">
            <Cog className="w-4 h-4 text-[#E11D48]" />
            <span className="text-gray-500 text-[10px] uppercase font-mono block">Câmbio</span>
            <span className="font-bold text-white text-sm capitalize">{vehicle.transmission.toLowerCase()}</span>
          </div>

          <div className="bg-[#141418] border border-[#1F1F24] p-4 rounded-2xl space-y-1">
            <Fuel className="w-4 h-4 text-[#E11D48]" />
            <span className="text-gray-500 text-[10px] uppercase font-mono block">Combustível</span>
            <span className="font-bold text-white text-sm capitalize">{vehicle.fuel.toLowerCase()}</span>
          </div>

          <div className="bg-[#141418] border border-[#1F1F24] p-4 rounded-2xl space-y-1">
            <Layers className="w-4 h-4 text-[#E11D48]" />
            <span className="text-gray-500 text-[10px] uppercase font-mono block">Carroceria</span>
            <span className="font-bold text-white text-sm">{vehicle.body_type}</span>
          </div>

          <div className="bg-[#141418] border border-[#1F1F24] p-4 rounded-2xl space-y-1">
            <Palette className="w-4 h-4 text-[#E11D48]" />
            <span className="text-gray-500 text-[10px] uppercase font-mono block">Cor</span>
            <span className="font-bold text-white text-sm">{vehicle.color}</span>
          </div>

          <div className="bg-[#141418] border border-[#1F1F24] p-4 rounded-2xl space-y-1">
            <Zap className="w-4 h-4 text-[#E11D48]" />
            <span className="text-gray-500 text-[10px] uppercase font-mono block">Motorização</span>
            <span className="font-bold text-white text-sm">{vehicle.engine}</span>
          </div>

          <div className="bg-[#141418] border border-[#1F1F24] p-4 rounded-2xl space-y-1">
            <Activity className="w-4 h-4 text-[#E11D48]" />
            <span className="text-gray-500 text-[10px] uppercase font-mono block">Potência</span>
            <span className="font-bold text-white text-sm">{vehicle.power}</span>
          </div>

          <div className="bg-[#141418] border border-[#1F1F24] p-4 rounded-2xl space-y-1">
            <Compass className="w-4 h-4 text-[#E11D48]" />
            <span className="text-gray-500 text-[10px] uppercase font-mono block">Tração</span>
            <span className="font-bold text-white text-sm">{vehicle.traction}</span>
          </div>

          <div className="bg-[#141418] border border-[#1F1F24] p-4 rounded-2xl space-y-1">
            <KeyRound className="w-4 h-4 text-[#E11D48]" />
            <span className="text-gray-500 text-[10px] uppercase font-mono block">Portas</span>
            <span className="font-bold text-white text-sm">{vehicle.doors} portas</span>
          </div>

          <div className="bg-[#141418] border border-[#1F1F24] p-4 rounded-2xl space-y-1">
            <FileCheck2 className="w-4 h-4 text-[#E11D48]" />
            <span className="text-gray-500 text-[10px] uppercase font-mono block">Final de Placa</span>
            <span className="font-bold text-white text-sm">{vehicle.plate_end}</span>
          </div>

        </div>
      </section>

      {/* Description & Features Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Description */}
        <div className="lg:col-span-7 bg-[#0A0A0C] border border-[#1F1F24] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <h3 className="text-lg font-bold font-heading text-white">Sobre este Veículo</h3>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light whitespace-pre-line">
            {vehicle.description || 'Veículo em excelente estado de conservação, periciado, com laudo cautelar aprovado e procedência garantida pela Raposo Veículos.'}
          </p>
        </div>

        {/* Features Checklist */}
        <div className="lg:col-span-5 bg-[#0A0A0C] border border-[#1F1F24] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <h3 className="text-lg font-bold font-heading text-white">Itens e Opcionais</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {(vehicle.features && vehicle.features.length > 0 ? vehicle.features : ['Ar-condicionado', 'Direção elétrica', 'Vidros elétricos', 'Travas elétricas', 'Freios ABS', 'Airbags']).map((feat, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-300 py-1">
                <CheckCircle2 className="w-4 h-4 text-[#E11D48] shrink-0" />
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Financing Simulator */}
      <section>
        <FinancingSimulator
          vehiclePrice={vehicle.promotional_price || vehicle.price}
          onApplySimulation={handleApplySimulation}
        />
      </section>

      {/* Contact Form Section */}
      <section className="pt-4">
        <ContactForm
          vehicleId={vehicle.id}
          vehicleTitle={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
        />
      </section>

      {/* Proposal Modal */}
      <ProposalModal
        vehicle={vehicle}
        isOpen={proposalModalOpen}
        onClose={() => setProposalModalOpen(false)}
        initialDownPayment={initialDownPayment}
        initialInstallments={initialInstallments}
      />

      {/* Video Modal */}
      {vehicle.video_url && (
        <VideoModal
          videoUrl={vehicle.video_url}
          isOpen={videoModalOpen}
          onClose={() => setVideoModalOpen(false)}
          vehicleTitle={`${vehicle.brand} ${vehicle.model}`}
        />
      )}

    </div>
  );
};
