import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Car, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Vehicle, VehicleFilterState, BodyType, TransmissionType, FuelType } from '../types';
import { vehicleService } from '../services/vehicleService';
import { VehicleCard } from '../components/VehicleCard';
import { VehicleFilters } from '../components/VehicleFilters';
import { LoadingState, EmptyState } from '../components/ConfirmDialog';

const ITEMS_PER_PAGE = 6;

export const Stock: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from searchParams
  const initialFilters: VehicleFilterState = useMemo(() => ({
    search: searchParams.get('search') || '',
    brand: searchParams.get('brand') || '',
    model: searchParams.get('model') || '',
    body_type: (searchParams.get('body_type') as BodyType) || '',
    min_price: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
    max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
    min_year: searchParams.get('min_year') ? Number(searchParams.get('min_year')) : undefined,
    max_year: searchParams.get('max_year') ? Number(searchParams.get('max_year')) : undefined,
    transmission: (searchParams.get('transmission') as TransmissionType) || '',
    fuel: (searchParams.get('fuel') as FuelType) || '',
    sort_by: (searchParams.get('sort_by') as any) || 'newest',
    selected_features: searchParams.getAll('feature'),
  }), [searchParams]);

  const [filters, setFilters] = useState<VehicleFilterState>(initialFilters);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state when URL params change
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Fetch vehicles with filters
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const data = await vehicleService.getVehicles(filters);
        setVehicles(data);
        setCurrentPage(1); // Reset page on filter change
      } catch (err) {
        console.error('Erro ao buscar estoque:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();

    const unsubscribe = vehicleService.subscribeToRealtime(() => {
      fetchVehicles();
    });

    return () => {
      unsubscribe();
    };
  }, [filters]);

  // Update URL params
  const handleFilterChange = (newFilters: VehicleFilterState) => {
    setFilters(newFilters);
    const params = new URLSearchParams();

    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.brand) params.set('brand', newFilters.brand);
    if (newFilters.model) params.set('model', newFilters.model);
    if (newFilters.body_type) params.set('body_type', newFilters.body_type);
    if (newFilters.min_price) params.set('min_price', newFilters.min_price.toString());
    if (newFilters.max_price) params.set('max_price', newFilters.max_price.toString());
    if (newFilters.min_year) params.set('min_year', newFilters.min_year.toString());
    if (newFilters.max_year) params.set('max_year', newFilters.max_year.toString());
    if (newFilters.transmission) params.set('transmission', newFilters.transmission);
    if (newFilters.fuel) params.set('fuel', newFilters.fuel);
    if (newFilters.sort_by) params.set('sort_by', newFilters.sort_by);
    if (newFilters.selected_features) {
      newFilters.selected_features.forEach(f => params.append('feature', f));
    }

    setSearchParams(params);
  };

  const handleResetFilters = () => {
    const emptyFilters: VehicleFilterState = {
      search: '',
      brand: '',
      model: '',
      body_type: '',
      min_price: undefined,
      max_price: undefined,
      min_year: undefined,
      max_year: undefined,
      transmission: '',
      fuel: '',
      sort_by: 'newest',
      selected_features: [],
    };
    setFilters(emptyFilters);
    setSearchParams(new URLSearchParams());
  };

  // Pagination calculation
  const totalPages = Math.ceil(vehicles.length / ITEMS_PER_PAGE);
  const paginatedVehicles = vehicles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-[#0A0A0C] border border-[#1F1F24] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E11D48]/10 blur-3xl rounded-full pointer-events-none" />
        
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#E11D48] uppercase tracking-widest font-bold">
            <Car className="w-4 h-4" />
            <span>Showroom Digital</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
            Estoque de Veículos
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-2xl font-light">
            Confira todos os carros disponíveis, seminovos certificados e periciados com garantia e procedência.
          </p>
        </div>
      </div>

      {/* Main Stock Layout: Filters Aside + Vehicle Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Filter Component */}
        <VehicleFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          totalFound={vehicles.length}
          isOpenMobile={mobileFilterOpen}
          onCloseMobile={() => setMobileFilterOpen(false)}
        />

        {/* Content Area */}
        <div className="flex-1 w-full space-y-6">
          
          {/* Top Bar on Mobile: Search & Filter Drawer Trigger */}
          <div className="flex items-center justify-between gap-3">
            
            {/* Quick Text Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por marca, modelo ou versão..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
                className="w-full bg-[#0A0A0C] border border-[#1F1F24] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E11D48] transition-colors"
              />
            </div>

            {/* Mobile Filter Trigger Button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#141418] border border-[#2A2A32] text-xs font-semibold text-white shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#E11D48]" />
              <span>Filtros</span>
            </button>

          </div>

          {/* Vehicles List */}
          {loading ? (
            <LoadingState message="Buscando veículos no estoque..." />
          ) : vehicles.length === 0 ? (
            <EmptyState
              title="Nenhum veículo encontrado"
              description="Não encontramos nenhum veículo com os filtros selecionados. Tente ajustar os parâmetros da busca."
              actionText="Limpar todos os filtros"
              onAction={handleResetFilters}
              icon={<Car className="w-8 h-8" />}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedVehicles.map((v) => (
                  <VehicleCard key={v.id} vehicle={v} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-8 border-t border-[#1F1F24]">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="p-2 rounded-xl bg-[#0A0A0C] border border-[#1F1F24] text-gray-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    aria-label="Página anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-1 text-xs font-mono">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 rounded-xl font-bold transition-all ${
                          currentPage === pageNum
                            ? 'bg-[#E11D48] text-white shadow-[0_0_12px_rgba(225,29,72,0.4)]'
                            : 'bg-[#0A0A0C] border border-[#1F1F24] text-gray-400 hover:text-white'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="p-2 rounded-xl bg-[#0A0A0C] border border-[#1F1F24] text-gray-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    aria-label="Próxima página"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}

        </div>

      </div>

    </div>
  );
};
