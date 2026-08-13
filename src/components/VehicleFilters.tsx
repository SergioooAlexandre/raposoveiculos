import React from 'react';
import { RotateCcw, Filter, X, Check } from 'lucide-react';
import type { VehicleFilterState, FuelType, TransmissionType, BodyType, VehicleStatus } from '../types';
import { initialAvailableFeatures } from '../data/mockVehicles';

interface VehicleFiltersProps {
  filters: VehicleFilterState;
  onChange: (filters: VehicleFilterState) => void;
  onReset: () => void;
  totalFound: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const VehicleFilters: React.FC<VehicleFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalFound,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const brands = ['BMW', 'Porsche', 'Toyota', 'Jeep', 'Audi', 'Mercedes-Benz', 'Volkswagen', 'Ford', 'Honda', 'Volvo'];
  const bodyTypes: { label: string; value: BodyType }[] = [
    { label: 'SUV', value: 'SUV' },
    { label: 'Sedan', value: 'SEDAN' },
    { label: 'Hatch', value: 'HATCH' },
    { label: 'Pickup', value: 'PICKUP' },
    { label: 'Coupé', value: 'COUPE' },
    { label: 'Conversível', value: 'CONVERSIVEL' },
  ];

  const handleFeatureToggle = (featureName: string) => {
    const current = filters.selected_features || [];
    const exists = current.includes(featureName);
    const updated = exists
      ? current.filter(f => f !== featureName)
      : [...current, featureName];
    onChange({ ...filters, selected_features: updated });
  };

  const filterContent = (
    <div className="space-y-6 text-sm">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1F1F24]">
        <div>
          <div className="text-white font-heading font-bold text-base flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#E11D48]" />
            <span>Filtros Avançados</span>
          </div>
          <span className="text-xs text-gray-400 font-mono">
            {totalFound} {totalFound === 1 ? 'veículo encontrado' : 'veículos encontrados'}
          </span>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#141418] hover:bg-[#1f1f24] text-xs text-gray-300 hover:text-white transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Limpar</span>
        </button>
      </div>

      {/* Sorting */}
      <div>
        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
          Ordenar Por
        </label>
        <select
          value={filters.sort_by || 'newest'}
          onChange={(e) => onChange({ ...filters, sort_by: e.target.value as any })}
          className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#E11D48]"
        >
          <option value="newest">Mais recentes</option>
          <option value="price_asc">Menor Preço</option>
          <option value="price_desc">Maior Preço</option>
          <option value="mileage_asc">Menor Quilometragem</option>
          <option value="mileage_desc">Maior Quilometragem</option>
        </select>
      </div>

      {/* Status Filter */}
      <div>
        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
          Status no Estoque
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { label: 'Todos', value: '' },
            { label: 'Disponível', value: 'DISPONIVEL' },
            { label: 'Reservado', value: 'RESERVADO' },
          ].map(st => (
            <button
              key={st.value}
              type="button"
              onClick={() => onChange({ ...filters, status: st.value as VehicleStatus | '' })}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                filters.status === st.value
                  ? 'bg-[#E11D48] border-[#E11D48] text-white'
                  : 'bg-[#141418] border-[#2A2A32] text-gray-400 hover:text-white'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
          Marca
        </label>
        <select
          value={filters.brand || ''}
          onChange={(e) => onChange({ ...filters, brand: e.target.value })}
          className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#E11D48]"
        >
          <option value="">Todas as Marcas</option>
          {brands.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* Body Type */}
      <div>
        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
          Carroceria
        </label>
        <div className="grid grid-cols-2 gap-2">
          {bodyTypes.map(bt => {
            const isSelected = filters.body_type === bt.value;
            return (
              <button
                key={bt.value}
                type="button"
                onClick={() => onChange({ ...filters, body_type: isSelected ? '' : bt.value })}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all text-center ${
                  isSelected
                    ? 'bg-[#E11D48]/15 border-[#E11D48] text-[#E11D48] font-bold'
                    : 'bg-[#141418] border-[#2A2A32] text-gray-300 hover:text-white'
                }`}
              >
                {bt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
          Faixa de Preço (R$)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Mínimo"
            value={filters.min_price || ''}
            onChange={(e) => onChange({ ...filters, min_price: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E11D48]"
          />
          <input
            type="number"
            placeholder="Máximo"
            value={filters.max_price || ''}
            onChange={(e) => onChange({ ...filters, max_price: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E11D48]"
          />
        </div>
      </div>

      {/* Year Range */}
      <div>
        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
          Ano de Fabricação
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="De (Ex: 2020)"
            value={filters.min_year || ''}
            onChange={(e) => onChange({ ...filters, min_year: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E11D48]"
          />
          <input
            type="number"
            placeholder="Até (Ex: 2025)"
            value={filters.max_year || ''}
            onChange={(e) => onChange({ ...filters, max_year: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E11D48]"
          />
        </div>
      </div>

      {/* Transmission & Fuel */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
            Câmbio
          </label>
          <select
            value={filters.transmission || ''}
            onChange={(e) => onChange({ ...filters, transmission: e.target.value as TransmissionType | '' })}
            className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E11D48]"
          >
            <option value="">Todos</option>
            <option value="AUTOMATICO">Automático</option>
            <option value="MANUAL">Manual</option>
            <option value="CVT">CVT</option>
            <option value="DUPLA_EMBREAGEM">Dupla Embreagem</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
            Combustível
          </label>
          <select
            value={filters.fuel || ''}
            onChange={(e) => onChange({ ...filters, fuel: e.target.value as FuelType | '' })}
            className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E11D48]"
          >
            <option value="">Todos</option>
            <option value="FLEX">Flex</option>
            <option value="GASOLINA">Gasolina</option>
            <option value="HIBRIDO">Híbrido</option>
            <option value="ELETRICO">Elétrico</option>
            <option value="DIESEL">Diesel</option>
          </select>
        </div>
      </div>

      {/* Features Checklist */}
      <div>
        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
          Opcionais
        </label>
        <div className="max-h-48 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar border border-[#1F1F24] p-3 rounded-xl bg-[#070709]">
          {initialAvailableFeatures.slice(0, 10).map(feat => {
            const isChecked = filters.selected_features?.includes(feat);
            return (
              <label
                key={feat}
                className="flex items-center gap-2 text-xs text-gray-300 hover:text-white cursor-pointer select-none py-0.5"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleFeatureToggle(feat)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    isChecked
                      ? 'bg-[#E11D48] border-[#E11D48] text-white'
                      : 'bg-[#141418] border-[#2A2A32]'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3" />}
                </div>
                <span className="truncate">{feat}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Panel */}
      <aside className="hidden lg:block w-72 shrink-0 bg-[#0A0A0C] border border-[#1F1F24] rounded-2xl p-6 shadow-xl sticky top-28 self-start">
        {filterContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-[#0A0A0C] h-full p-6 overflow-y-auto flex flex-col justify-between border-l border-[#1F1F24]">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#1F1F24]">
                <span className="font-heading font-bold text-lg text-white">Filtrar Veículos</span>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="p-2 rounded-lg bg-[#141418] text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {filterContent}
            </div>

            <div className="pt-6 border-t border-[#1F1F24] mt-6">
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-full py-3.5 rounded-xl bg-[#E11D48] text-white font-semibold text-sm shadow-lg shadow-rose-900/40"
              >
                Ver {totalFound} {totalFound === 1 ? 'resultado' : 'resultados'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
