import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  PlusCircle,
  Search,
  Sparkles,
  Flame,
  Edit,
  Trash2,
  Copy,
  ExternalLink
} from 'lucide-react';
import type { Vehicle, VehicleStatus } from '../../types';
import { vehicleService } from '../../services/vehicleService';
import { ConfirmDialog, LoadingState, EmptyState } from '../../components/ConfirmDialog';
import { formatCurrency, formatKm } from '../../utils/formatters';
import { useToast } from '../../hooks/useToast';

export const AdminVehicles: React.FC = () => {
  const { showToast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const data = await vehicleService.getVehicles();
      setVehicles(data);
    } catch (err) {
      console.error(err);
      showToast('Erro ao carregar veículos.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Quick Status change
  const handleStatusChange = async (id: string, newStatus: VehicleStatus) => {
    try {
      const ok = await vehicleService.updateStatus(id, newStatus);
      if (ok) {
        setVehicles(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
        showToast('Status atualizado com sucesso.', 'success');
      }
    } catch {
      showToast('Erro ao alterar status.', 'error');
    }
  };

  // Toggle Featured
  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      const ok = await vehicleService.toggleFeatured(id, !current);
      if (ok) {
        setVehicles(prev => prev.map(v => v.id === id ? { ...v, featured: !current } : v));
        showToast(!current ? 'Veículo marcado como destaque.' : 'Destaque removido.', 'info');
      }
    } catch {
      showToast('Erro ao atualizar destaque.', 'error');
    }
  };

  // Toggle Offer
  const handleToggleOffer = async (id: string, current: boolean) => {
    try {
      const ok = await vehicleService.toggleOffer(id, !current);
      if (ok) {
        setVehicles(prev => prev.map(v => v.id === id ? { ...v, is_offer: !current } : v));
        showToast(!current ? 'Veículo marcado como oferta.' : 'Oferta removida.', 'info');
      }
    } catch {
      showToast('Erro ao atualizar oferta.', 'error');
    }
  };

  // Duplicate
  const handleDuplicate = async (id: string) => {
    try {
      const dup = await vehicleService.duplicateVehicle(id);
      if (dup) {
        setVehicles(prev => [dup, ...prev]);
        showToast('Veículo duplicado com sucesso!', 'success');
      }
    } catch {
      showToast('Erro ao duplicar veículo.', 'error');
    }
  };

  // Delete
  const handleDeleteConfirm = async () => {
    if (!vehicleToDelete) return;
    setActionLoading(true);
    try {
      const ok = await vehicleService.deleteVehicle(vehicleToDelete.id);
      if (ok) {
        setVehicles(prev => prev.filter(v => v.id !== vehicleToDelete.id));
        showToast('Veículo excluído com sucesso.', 'success');
      }
    } catch {
      showToast('Erro ao excluir veículo.', 'error');
    } finally {
      setActionLoading(false);
      setDeleteDialogOpen(false);
      setVehicleToDelete(null);
    }
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch =
      v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.version.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.year.toString().includes(searchTerm);

    const matchesStatus = !selectedStatus || v.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0A0A0C] border border-[#1F1F24] p-6 rounded-3xl shadow-xl">
        <div>
          <h2 className="text-xl font-bold font-heading text-white">Controle de Estoque</h2>
          <p className="text-xs text-gray-400">Gerencie todos os veículos cadastrados na Raposo Veículos</p>
        </div>

        <Link
          to="/admin/veiculos/novo"
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#E11D48] hover:bg-[#F43F5E] text-white text-xs font-semibold shadow-lg shadow-rose-900/30 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Cadastrar Novo Veículo</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0A0A0C] border border-[#1F1F24] p-4 rounded-2xl">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar por marca, modelo, ano..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#141418] border border-[#2A2A32] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E11D48]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            { label: 'Todos', value: '' },
            { label: 'Disponíveis', value: 'DISPONIVEL' },
            { label: 'Reservados', value: 'RESERVADO' },
            { label: 'Vendidos', value: 'VENDIDO' },
          ].map(st => (
            <button
              key={st.value}
              type="button"
              onClick={() => setSelectedStatus(st.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all whitespace-nowrap ${
                selectedStatus === st.value
                  ? 'bg-[#E11D48] border-[#E11D48] text-white font-semibold'
                  : 'bg-[#141418] border-[#2A2A32] text-gray-400 hover:text-white'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicles Table / Cards */}
      {loading ? (
        <LoadingState message="Carregando estoque..." />
      ) : filteredVehicles.length === 0 ? (
        <EmptyState
          title="Nenhum veículo encontrado"
          description="Nenhum veículo corresponde à sua busca ou filtro atual."
          actionText="Cadastrar Primeiro Veículo"
          onAction={() => window.location.href = '/admin/veiculos/novo'}
          icon={<Car className="w-8 h-8" />}
        />
      ) : (
        <div className="bg-[#0A0A0C] border border-[#1F1F24] rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-[#141418] border-b border-[#1F1F24] text-[10px] uppercase font-mono tracking-wider text-gray-400">
                <tr>
                  <th className="p-4">Veículo</th>
                  <th className="p-4">Ano / Km</th>
                  <th className="p-4">Preço</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Selos</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1F24]">
                {filteredVehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-[#141418]/60 transition-colors">
                    
                    {/* Vehicle Thumb and Model */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={v.primary_image || 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=150&q=80'}
                          alt=""
                          className="w-14 h-10 object-cover rounded-lg border border-[#2A2A32] shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-mono text-[10px] text-[#E11D48] uppercase font-bold block">{v.brand}</span>
                          <span className="font-bold text-white text-sm block truncate max-w-xs">{v.model}</span>
                          <span className="text-[11px] text-gray-400 block truncate max-w-xs">{v.version}</span>
                        </div>
                      </div>
                    </td>

                    {/* Year & Km */}
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-white">{v.year}/{v.model_year}</span>
                        <span className="text-gray-400 block font-mono">{formatKm(v.mileage)}</span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="p-4">
                      <div className="space-y-0.5 font-mono">
                        {v.is_offer && v.promotional_price ? (
                          <>
                            <span className="text-gray-500 line-through text-[10px] block">{formatCurrency(v.price)}</span>
                            <span className="font-bold text-[#D4AF37] text-sm block">{formatCurrency(v.promotional_price)}</span>
                          </>
                        ) : (
                          <span className="font-bold text-white text-sm">{formatCurrency(v.price)}</span>
                        )}
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="p-4">
                      <select
                        value={v.status}
                        onChange={(e) => handleStatusChange(v.id, e.target.value as VehicleStatus)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border focus:outline-none ${
                          v.status === 'DISPONIVEL'
                            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                            : v.status === 'RESERVADO'
                            ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                            : 'bg-neutral-900 border-neutral-700 text-gray-400'
                        }`}
                      >
                        <option value="DISPONIVEL">Disponível</option>
                        <option value="RESERVADO">Reservado</option>
                        <option value="VENDIDO">Vendido</option>
                      </select>
                    </td>

                    {/* Badges Toggles */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(v.id, v.featured)}
                          className={`p-1.5 rounded-lg border text-xs transition-all ${
                            v.featured
                              ? 'bg-[#E11D48] border-[#E11D48] text-white shadow-[0_0_8px_rgba(225,29,72,0.6)]'
                              : 'bg-[#141418] border-[#2A2A32] text-gray-500 hover:text-gray-300'
                          }`}
                          title={v.featured ? 'Remover Destaque' : 'Marcar Destaque'}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleOffer(v.id, v.is_offer)}
                          className={`p-1.5 rounded-lg border text-xs transition-all ${
                            v.is_offer
                              ? 'bg-[#D4AF37] border-[#D4AF37] text-black font-bold shadow-[0_0_8px_rgba(212,175,55,0.6)]'
                              : 'bg-[#141418] border-[#2A2A32] text-gray-500 hover:text-gray-300'
                          }`}
                          title={v.is_offer ? 'Remover Oferta' : 'Marcar Oferta'}
                        >
                          <Flame className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/veiculo/${v.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-[#141418] hover:bg-[#1f1f24] text-gray-300 hover:text-white border border-[#2A2A32]"
                          title="Ver no site público"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                          to={`/admin/veiculos/${v.id}/editar`}
                          className="p-2 rounded-xl bg-[#141418] hover:bg-[#1f1f24] text-blue-400 border border-[#2A2A32]"
                          title="Editar veículo"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDuplicate(v.id)}
                          className="p-2 rounded-xl bg-[#141418] hover:bg-[#1f1f24] text-purple-400 border border-[#2A2A32]"
                          title="Duplicar veículo"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setVehicleToDelete(v);
                            setDeleteDialogOpen(true);
                          }}
                          className="p-2 rounded-xl bg-[#141418] hover:bg-rose-950/40 text-rose-400 border border-[#2A2A32]"
                          title="Excluir veículo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Excluir Veículo do Estoque"
        message={`Tem certeza que deseja excluir o veículo "${vehicleToDelete?.brand} ${vehicleToDelete?.model}"? Esta ação removerá o veículo do catálogo permanentemente.`}
        confirmText="Sim, Excluir Veículo"
        cancelText="Cancelar"
        isDestructive
        loading={actionLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setVehicleToDelete(null);
        }}
      />

    </div>
  );
};
