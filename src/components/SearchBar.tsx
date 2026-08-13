import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RotateCcw, SlidersHorizontal } from 'lucide-react';
import type { FuelType, TransmissionType } from '../types';

export const SearchBar: React.FC = () => {
  const navigate = useNavigate();

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minYear, setMinYear] = useState('');
  const [transmission, setTransmission] = useState<TransmissionType | ''>('');
  const [fuel, setFuel] = useState<FuelType | ''>('');

  const brands = ['BMW', 'Porsche', 'Toyota', 'Jeep', 'Audi', 'Mercedes-Benz', 'Volkswagen', 'Ford', 'Honda', 'Volvo'];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (brand) params.set('brand', brand);
    if (model) params.set('model', model);
    if (maxPrice) params.set('max_price', maxPrice);
    if (minYear) params.set('min_year', minYear);
    if (transmission) params.set('transmission', transmission);
    if (fuel) params.set('fuel', fuel);

    navigate(`/estoque?${params.toString()}`);
  };

  const handleClear = () => {
    setBrand('');
    setModel('');
    setMaxPrice('');
    setMinYear('');
    setTransmission('');
    setFuel('');
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full bg-[#0A0A0C]/90 backdrop-blur-xl border border-[#1F1F24] p-5 sm:p-6 rounded-2xl shadow-2xl"
    >
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1F1F24]">
        <div className="flex items-center gap-2 text-white font-heading font-bold text-base">
          <SlidersHorizontal className="w-4 h-4 text-[#E11D48]" />
          <span>Busca Rápida de Veículos</span>
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-200 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Limpar</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        
        {/* Brand */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Marca
          </label>
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#E11D48] transition-colors"
          >
            <option value="">Todas as Marcas</option>
            {brands.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Model */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Modelo
          </label>
          <input
            type="text"
            placeholder="Ex: Corolla, 320i, 911"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E11D48] transition-colors"
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Preço até
          </label>
          <select
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#E11D48] transition-colors"
          >
            <option value="">Qualquer valor</option>
            <option value="150000">Até R$ 150.000</option>
            <option value="250000">Até R$ 250.000</option>
            <option value="350000">Até R$ 350.000</option>
            <option value="500000">Até R$ 500.000</option>
            <option value="1000000">Até R$ 1.000.000</option>
          </select>
        </div>

        {/* Min Year */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Ano a partir de
          </label>
          <select
            value={minYear}
            onChange={(e) => setMinYear(e.target.value)}
            className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#E11D48] transition-colors"
          >
            <option value="">Todos os Anos</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2020">2020 ou mais recente</option>
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Câmbio
          </label>
          <select
            value={transmission}
            onChange={(e) => setTransmission(e.target.value as TransmissionType | '')}
            className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#E11D48] transition-colors"
          >
            <option value="">Qualquer Câmbio</option>
            <option value="AUTOMATICO">Automático</option>
            <option value="MANUAL">Manual</option>
            <option value="CVT">CVT</option>
            <option value="DUPLA_EMBREAGEM">Dupla Embreagem</option>
          </select>
        </div>

        {/* Fuel */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
            Combustível
          </label>
          <select
            value={fuel}
            onChange={(e) => setFuel(e.target.value as FuelType | '')}
            className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#E11D48] transition-colors"
          >
            <option value="">Qualquer Combustível</option>
            <option value="FLEX">Flex</option>
            <option value="GASOLINA">Gasolina</option>
            <option value="HIBRIDO">Híbrido</option>
            <option value="ELETRICO">Elétrico</option>
            <option value="DIESEL">Diesel</option>
          </select>
        </div>

      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#E11D48] hover:bg-[#F43F5E] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(225,29,72,0.35)] transition-all duration-200"
        >
          <Search className="w-4 h-4" />
          <span>Encontrar meu veículo</span>
        </button>
      </div>
    </form>
  );
};
