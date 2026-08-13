import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Lead, LeadStatus } from '../types';

const LEADS_STORAGE_KEY = 'raposo_leads_local';

const initialMockLeads: Lead[] = [
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

const getLocalLeads = (): Lead[] => {
  const stored = localStorage.getItem(LEADS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as Lead[];
    } catch (e) {
      console.error('Erro ao ler leads do localStorage:', e);
    }
  }
  localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(initialMockLeads));
  return initialMockLeads;
};

const saveLocalLeads = (leads: Lead[]): void => {
  localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
};

export const contactService = {
  async getLeads(): Promise<Lead[]> {
    if (!isSupabaseConfigured || !supabase) {
      return getLocalLeads();
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
      console.error('Erro ao buscar leads no Supabase, fallback local:', err);
      return getLocalLeads();
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
      const current = getLocalLeads();
      const updated = [newLead, ...current];
      saveLocalLeads(updated);
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
      const current = getLocalLeads();
      const lead = current.find(l => l.id === id);
      if (lead) {
        lead.status = status;
        saveLocalLeads(current);
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
      const current = getLocalLeads();
      const filtered = current.filter(l => l.id !== id);
      saveLocalLeads(filtered);
      return true;
    }

    const { error } = await supabase.from('leads').delete().eq('id', id);
    return !error;
  }
};
