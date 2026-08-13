import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Proposal, ProposalStatus } from '../types';

const PROPOSALS_STORAGE_KEY = 'raposo_proposals_local';

const initialMockProposals: Proposal[] = [
  {
    id: 'prop-1',
    vehicle_id: '1a91e1d0-1b2c-4e3f-9876-000000000001',
    vehicle_title: 'BMW 320i M Sport 2024',
    name: 'Carlos Henrique Silva',
    phone: '(79) 99847-6431',
    whatsapp: '5579998476431',
    email: 'carlos.silva@empresa.com.br',
    proposal_value: 320000,
    down_payment: 100000,
    installments_count: 36,
    message: 'Tenho interesse em fechar negócio até sexta-feira com pagamento de R$ 100 mil de entrada via TED.',
    status: 'NOVA',
    created_at: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: 'prop-2',
    vehicle_id: '4d91e1d0-1b2c-4e3f-9876-000000000004',
    vehicle_title: 'Jeep Compass Blackhawk Hurricane 2024',
    name: 'Fernanda Guimarães',
    phone: '(79) 99847-6431',
    whatsapp: '5579998476431',
    email: 'fernanda.g@gmail.com',
    proposal_value: 265000,
    down_payment: 80000,
    installments_count: 48,
    message: 'Gostaria de simular financiamento pelo banco Santander.',
    status: 'EM_ANALISE',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  }
];

const getLocalProposals = (): Proposal[] => {
  const stored = localStorage.getItem(PROPOSALS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as Proposal[];
    } catch (e) {
      console.error('Erro ao ler propostas do localStorage:', e);
    }
  }
  localStorage.setItem(PROPOSALS_STORAGE_KEY, JSON.stringify(initialMockProposals));
  return initialMockProposals;
};

const saveLocalProposals = (proposals: Proposal[]): void => {
  localStorage.setItem(PROPOSALS_STORAGE_KEY, JSON.stringify(proposals));
};

export const proposalService = {
  async getProposals(): Promise<Proposal[]> {
    if (!isSupabaseConfigured || !supabase) {
      return getLocalProposals();
    }

    try {
      const { data, error } = await supabase
        .from('proposals')
        .select(`
          *,
          vehicles(brand, model, year)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(p => ({
        ...p,
        vehicle_title: p.vehicles ? `${p.vehicles.brand} ${p.vehicles.model} ${p.vehicles.year}` : 'Veículo',
      }));
    } catch (err) {
      console.error('Erro ao buscar propostas no Supabase, fallback local:', err);
      return getLocalProposals();
    }
  },

  async createProposal(data: Omit<Proposal, 'id' | 'status' | 'created_at'>): Promise<Proposal> {
    if (!isSupabaseConfigured || !supabase) {
      const newProp: Proposal = {
        ...data,
        id: 'prop-' + Date.now(),
        status: 'NOVA',
        created_at: new Date().toISOString(),
      };
      const current = getLocalProposals();
      const updated = [newProp, ...current];
      saveLocalProposals(updated);
      return newProp;
    }

    const { data: created, error } = await supabase
      .from('proposals')
      .insert({
        vehicle_id: data.vehicle_id,
        name: data.name,
        phone: data.phone,
        whatsapp: data.whatsapp || data.phone,
        email: data.email,
        proposal_value: data.proposal_value,
        down_payment: data.down_payment,
        installments_count: data.installments_count || 48,
        message: data.message || '',
        status: 'NOVA',
      })
      .select()
      .single();

    if (error) throw error;
    return created;
  },

  async updateProposalStatus(id: string, status: ProposalStatus): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
      const current = getLocalProposals();
      const prop = current.find(p => p.id === id);
      if (prop) {
        prop.status = status;
        saveLocalProposals(current);
        return true;
      }
      return false;
    }

    const { error } = await supabase
      .from('proposals')
      .update({ status })
      .eq('id', id);

    return !error;
  },

  async deleteProposal(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
      const current = getLocalProposals();
      const filtered = current.filter(p => p.id !== id);
      saveLocalProposals(filtered);
      return true;
    }

    const { error } = await supabase.from('proposals').delete().eq('id', id);
    return !error;
  }
};
