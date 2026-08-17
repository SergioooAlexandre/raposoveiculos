import React, { useState, useEffect } from 'react';
import { Flame, Car } from 'lucide-react';
import type { Vehicle } from '../types';
import { vehicleService } from '../services/vehicleService';
import { VehicleCard } from '../components/VehicleCard';
import { LoadingState, EmptyState } from '../components/ConfirmDialog';
import { Link } from 'react-router-dom';

export const Offers: React.FC = () => {
  const [offers, setOffers] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      try {
        const data = await vehicleService.getOffersVehicles();
        setOffers(data);
      } catch (err) {
        console.error('Erro ao buscar ofertas:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();

    const unsubscribe = vehicleService.subscribeToRealtime(() => {
      fetchOffers();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Offers Banner */}
      <div className="bg-gradient-to-r from-[#1A0B10] via-[#0A0A0C] to-[#141005] border border-[#E11D48]/30 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/15 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5" />
            <span>Condições Especiais</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Ofertas e Oportunidades
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
            Veículos com valores promocionais e descontos exclusivos por tempo limitado. Aproveite as melhores oportunidades para fechar negócio.
          </p>
        </div>
      </div>

      {/* Offers Grid */}
      {loading ? (
        <LoadingState message="Carregando ofertas especiais..." />
      ) : offers.length === 0 ? (
        <EmptyState
          title="Nenhuma oferta no momento"
          description="Todas as nossas ofertas promocionais foram finalizadas. Visite nosso estoque completo para ver todos os modelos disponíveis."
          actionText="Ver Estoque Completo"
          onAction={() => window.location.href = '/estoque'}
          icon={<Car className="w-8 h-8" />}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>{offers.length} {offers.length === 1 ? 'oferta disponível' : 'ofertas disponíveis'}</span>
            <Link to="/estoque" className="text-[#E11D48] hover:underline font-sans">
              Ver todo o estoque &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {offers.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
