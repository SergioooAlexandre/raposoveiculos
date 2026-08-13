import { vehicleService } from './vehicleService';
import { proposalService } from './proposalService';
import { contactService } from './contactService';
import { mockDashboardActivities } from '../data/mockVehicles';

export interface DashboardStats {
  totalVehicles: number;
  availableVehicles: number;
  reservedVehicles: number;
  soldVehicles: number;
  featuredVehicles: number;
  offerVehicles: number;
  totalProposals: number;
  totalLeads: number;
  totalStockValue: number;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const vehicles = await vehicleService.getVehicles({ include_hidden: true });
    const proposals = await proposalService.getProposals();
    const leads = await contactService.getLeads();

    const available = vehicles.filter(v => v.status === 'DISPONIVEL');
    const reserved = vehicles.filter(v => v.status === 'RESERVADO');
    const sold = vehicles.filter(v => v.status === 'VENDIDO');
    const featured = vehicles.filter(v => v.featured);
    const offers = vehicles.filter(v => v.is_offer);

    const totalStockValue = available.reduce((sum, v) => sum + (v.promotional_price || v.price), 0);

    return {
      totalVehicles: vehicles.length,
      availableVehicles: available.length,
      reservedVehicles: reserved.length,
      soldVehicles: sold.length,
      featuredVehicles: featured.length,
      offerVehicles: offers.length,
      totalProposals: proposals.length,
      totalLeads: leads.length,
      totalStockValue,
    };
  },

  async getVehiclesByStatusData() {
    const stats = await this.getStats();
    return [
      { name: 'Disponíveis', value: stats.availableVehicles, color: '#10B981' },
      { name: 'Reservados', value: stats.reservedVehicles, color: '#F59E0B' },
      { name: 'Vendidos', value: stats.soldVehicles, color: '#6B7280' },
    ];
  },

  async getRecentActivities() {
    return mockDashboardActivities;
  },

  async getStockEvolutionData() {
    return [
      { month: 'Jan', estoque: 18, vendas: 6, propostas: 14 },
      { month: 'Fev', estoque: 22, vendas: 8, propostas: 19 },
      { month: 'Mar', estoque: 20, vendas: 11, propostas: 24 },
      { month: 'Abr', estoque: 25, vendas: 9, propostas: 21 },
      { month: 'Mai', estoque: 28, vendas: 14, propostas: 32 },
      { month: 'Jun', estoque: 26, vendas: 12, propostas: 28 },
    ];
  }
};
