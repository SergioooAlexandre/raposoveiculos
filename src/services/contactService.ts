import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Lead, LeadStatus } from '../types';

let unconfiguredMockLeads: Lead[] = [
  {
    id: 'lead-1',
    vehicle_id: '2b91e1d0-1b2c-4e3f-9876-000000000002',
    vehicle_title: 'Porsche 911 Carrera S 2023',
    name: 'Mariana Costa',
    phone: '(79) 99847-6431',
    whatsapp: '5579998476431',
    email: 'mariana.costa@email.com',
    message: 'Olá! Tenho interesse no Porsche 911 Carrera S. O carro aceita troca em BMW M3 2022?',
    status: 'NOVO',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'lead-2',
    vehicle_id: null,
    vehicle_title: null,
    name: 'Roberto Alvarez',
    phone: '(79) 99847-6431',
    whatsapp: '5579998476431',
    email: 'roberto.alvarez@email.com',
    message: 'Gostaria de saber se vocês compram veículos seminovos à vista ou consignam.',
    status: 'EM_ATENDIMENTO',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  }
];

export const contactService = {
  /**
   * Subscribe to real-time changes in the Supabase 'leads' table.
   */
  subscribeToRealtime(onUpdate: () => void) {
    const client = supabase;
    if (!isSupabaseConfigured || !client) return () => {};

    const channel = client
      .channel('leads_realtime_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads' },
        () => {
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  },

  async getLeads(): Promise<Lead[]> {
    if (!isSupabaseConfigured || !supabase) {
      return unconfiguredMockLeads;
    }

    try {
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          vehicles(brand, model, version, year)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(item => ({
        ...item,
        vehicle_title: item.vehicles ? `${item.vehicles.brand} ${item.vehicles.model} ${item.vehicles.year}` : null,
      }));
    } catch (err) {
      console.error('Erro ao buscar leads no Supabase:', err);
      return unconfiguredMockLeads;
    }
  },

  async createLead(leadData: Omit<Lead, 'id' | 'status' | 'created_at'>): Promise<Lead> {
    if (!isSupabaseConfigured || !supabase) {
      const newLead: Lead = {
        ...leadData,
        id: 'lead-' + Date.now(),
        status: 'NOVO',
        created_at: new Date().toISOString(),
      };
      unconfiguredMockLeads = [newLead, ...unconfiguredMockLeads];
      return newLead;
    }

    const { data, error } = await supabase
      .from('leads')
      .insert({
        vehicle_id: leadData.vehicle_id || null,
        name: leadData.name,
        phone: leadData.phone,
        whatsapp: leadData.whatsapp || leadData.phone,
        email: leadData.email,
        message: leadData.message,
        status: 'NOVO',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateLeadStatus(id: string, status: LeadStatus): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
      const lead = unconfiguredMockLeads.find(l => l.id === id);
      if (lead) {
        lead.status = status;
        return true;
      }
      return false;
    }

    const { error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id);

    return !error;
  },

  async deleteLead(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
      unconfiguredMockLeads = unconfiguredMockLeads.filter(l => l.id !== id);
      return true;
    }

    const { error } = await supabase.from('leads').delete().eq('id', id);
    return !error;
  }
};
