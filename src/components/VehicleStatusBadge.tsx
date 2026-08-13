import React from 'react';
import type { VehicleStatus } from '../types';
import { Sparkles, Flame, CheckCircle, Clock, CheckCheck } from 'lucide-react';

interface VehicleStatusBadgeProps {
  status?: VehicleStatus;
  featured?: boolean;
  isOffer?: boolean;
  size?: 'sm' | 'md';
}

export const VehicleStatusBadge: React.FC<VehicleStatusBadgeProps> = ({
  status,
  featured,
  isOffer,
  size = 'md',
}) => {
  const padClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <div className="flex flex-wrap items-center gap-1.5 pointer-events-none">
      {/* Featured Badge */}
      {featured && (
        <span
          className={`inline-flex items-center gap-1 font-bold rounded-lg bg-[#E11D48] text-white shadow-[0_0_12px_rgba(225,29,72,0.6)] ${padClass}`}
        >
          <Sparkles className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
          DESTAQUE
        </span>
      )}

      {/* Offer Badge */}
      {isOffer && (
        <span
          className={`inline-flex items-center gap-1 font-bold rounded-lg bg-[#D4AF37] text-black shadow-[0_0_12px_rgba(212,175,55,0.6)] ${padClass}`}
        >
          <Flame className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
          OFERTA
        </span>
      )}

      {/* Status Badges */}
      {status === 'RESERVADO' && (
        <span
          className={`inline-flex items-center gap-1 font-bold rounded-lg bg-amber-500/90 text-white backdrop-blur-md border border-amber-400/40 shadow-lg ${padClass}`}
        >
          <Clock className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
          RESERVADO
        </span>
      )}

      {status === 'VENDIDO' && (
        <span
          className={`inline-flex items-center gap-1 font-bold rounded-lg bg-gray-800/90 text-gray-300 backdrop-blur-md border border-gray-700 shadow-lg ${padClass}`}
        >
          <CheckCheck className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
          VENDIDO
        </span>
      )}

      {status === 'DISPONIVEL' && !featured && !isOffer && (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-md ${padClass}`}
        >
          <CheckCircle className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
          Disponível
        </span>
      )}
    </div>
  );
};
