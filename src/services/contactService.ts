import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Lead, LeadStatus } from '../types';

let runtimeMockLeads: Lead[] = [
  {
    id: 'lead-1',
    vehicle_id: '2b91e1d0-1b2c-4e3f-9876-000000000002',
    vehicle_title: 'Porsche 911 Carrera S 2023',
    name: 'Mariana Costa',
    phone: '(11) 98888-7777',
    whatsapp: '11988887777',
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
    phone: '(11) 97777-6666',
    whatsapp: '11977776666',
    email: 'roberto.alvarez@email.com',
    message: 'Gostaria de saber se vocês compram veículos seminovos à vista ou consignam.',
    status: 'EM_ATENDIMENTO',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  }
];

export const contactService = {
  async getLeads(): Promise<Lead[]> {
    if (!isSupabaseConfigured || !supabase) {
      return [...runtimeMockLeads];
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
      console.error('Erro ao buscar leads:', err);
      return runtimeMockLeads;
    }
  },

  async createLead(leadData: Omit<Lead, 'id' | 'status' | 'created_at'>): Promise<Lead> {
    if (!isSupabaseConfigured || !supabase) {
      const newLead: Lead = {
        ...leadData,
        id: 'mock-lead-' + Date.now(),
        status: 'NOVO',
        created_at: new Date().toISOString(),
      };
      runtimeMockLeads = [newLead, ...runtimeMockLeads];
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
      const lead = runtimeMockLeads.find(l => l.id === id);
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
  }
};
