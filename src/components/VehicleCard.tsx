import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Gauge, Fuel, Cog, ArrowRight } from 'lucide-react';
import type { Vehicle } from '../types';
import { VehicleStatusBadge } from './VehicleStatusBadge';
import { formatCurrency, formatKm } from '../utils/formatters';
import { useFavorites } from '../hooks/useFavorites';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(vehicle.id);

  const displayImage = isHovered && vehicle.secondary_image
    ? vehicle.secondary_image
    : vehicle.primary_image || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80';

  const hasDiscount = vehicle.is_offer && vehicle.promotional_price && vehicle.promotional_price < vehicle.price;

  return (
    <div
      className="group relative bg-[#0A0A0C] border border-[#1F1F24] hover:border-[#E11D48]/40 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Image & Overlays */}
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
        <img
          src={displayImage}
          alt={`${vehicle.brand} ${vehicle.model}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Gradient dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-black/40" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10">
          <VehicleStatusBadge
            status={vehicle.status}
            featured={vehicle.featured}
            isOffer={vehicle.is_offer}
            size="sm"
          />
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(vehicle.id);
          }}
          aria-label={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          className={`absolute top-3 right-3 z-20 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 ${
            favorited
              ? 'bg-[#E11D48] text-white shadow-[0_0_15px_rgba(225,29,72,0.6)]'
              : 'bg-black/60 text-gray-300 hover:text-white hover:bg-black/90'
          }`}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
        </button>

        {/* Year Model Pill */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-xs font-semibold text-gray-200">
            {vehicle.year}/{vehicle.model_year}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        
        {/* Titles */}
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#E11D48] font-bold">
            {vehicle.brand}
          </div>
          <h3 className="text-lg font-bold font-heading text-white tracking-tight group-hover:text-[#E11D48] transition-colors truncate">
            {vehicle.model}
          </h3>
          <p className="text-xs text-gray-400 truncate mt-0.5" title={vehicle.version}>
            {vehicle.version}
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 my-3 border-y border-[#1F1F24] text-[11px] text-gray-300">
          <div className="flex items-center gap-1.5 truncate">
            <Gauge className="w-3.5 h-3.5 text-[#E11D48] shrink-0" />
            <span className="truncate">{formatKm(vehicle.mileage)}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Cog className="w-3.5 h-3.5 text-[#E11D48] shrink-0" />
            <span className="truncate capitalize">{vehicle.transmission.toLowerCase()}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Fuel className="w-3.5 h-3.5 text-[#E11D48] shrink-0" />
            <span className="truncate capitalize">{vehicle.fuel.toLowerCase()}</span>
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="flex items-end justify-between gap-2 pt-1">
          <div>
            {hasDiscount ? (
              <div className="flex flex-col">
                <span className="text-[11px] text-gray-500 line-through">
                  {formatCurrency(vehicle.price)}
                </span>
                <span className="text-xl font-extrabold font-heading text-[#D4AF37]">
                  {formatCurrency(vehicle.promotional_price)}
                </span>
              </div>
            ) : (
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Preço à vista</span>
                <span className="text-xl font-extrabold font-heading text-white">
                  {formatCurrency(vehicle.price)}
                </span>
              </div>
            )}
          </div>

          <Link
            to={`/veiculo/${vehicle.slug}`}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141418] hover:bg-[#E11D48] text-white text-xs font-semibold border border-[#2A2A32] hover:border-[#E11D48] shadow-md transition-all duration-200 group/btn"
          >
            <span>Detalhes</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
};
