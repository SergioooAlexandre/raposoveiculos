import React, { useState, useEffect } from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Vehicle } from '../types';
import { vehicleService } from '../services/vehicleService';
import { useFavorites } from '../hooks/useFavorites';
import { VehicleCard } from '../components/VehicleCard';
import { LoadingState, EmptyState } from '../components/ConfirmDialog';

export const Favorites: React.FC = () => {
  const { favoriteIds } = useFavorites();
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const data = await vehicleService.getVehicles();
        setAllVehicles(data);
      } catch (err) {
        console.error('Erro ao carregar veículos:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  const favoriteVehicles = allVehicles.filter(v => favoriteIds.includes(v.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-[#0A0A0C] border border-[#1F1F24] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E11D48]/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#E11D48] uppercase tracking-widest font-bold">
            <Heart className="w-4 h-4 fill-current" />
            <span>Sua Garagem de Desejos</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
            Veículos Favoritados
          </h1>

          <p className="text-xs sm:text-sm text-gray-400 max-w-2xl font-light">
            Aqui estão salvos os veículos que você marcou com coração. Eles ficam salvos no seu navegador para facilitar sua comparação.
          </p>
        </div>
      </div>

      {/* Grid or Empty State */}
      {loading ? (
        <LoadingState message="Carregando seus favoritos..." />
      ) : favoriteVehicles.length === 0 ? (
        <EmptyState
          title="Você ainda não favoritou nenhum veículo"
          description="Navegue pelo nosso estoque e clique no ícone de coração nos veículos para salvá-los nesta lista."
          actionText="Explorar Estoque"
          onAction={() => window.location.href = '/estoque'}
          icon={<Heart className="w-8 h-8" />}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>{favoriteVehicles.length} {favoriteVehicles.length === 1 ? 'veículo salvo' : 'veículos salvos'}</span>
            <Link to="/estoque" className="text-[#E11D48] hover:underline font-sans flex items-center gap-1">
              <span>Continuar navegando</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {favoriteVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
