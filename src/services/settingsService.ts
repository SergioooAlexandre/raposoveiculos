import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { SiteSettings } from '../types';
import { mockSiteSettings } from '../data/mockVehicles';

const SUPABASE_NOT_CONFIGURED_ERROR = 'SUPABASE_DESCONECTADO: As variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não foram configuradas na Vercel. Cadastre-as em Settings > Environment Variables no painel da Vercel para permitir salvamento global entre computadores e celulares.';

export const settingsService = {
  subscribeToRealtime(onUpdate: () => void) {
    const client = supabase;
    if (!isSupabaseConfigured || !client) return () => {};

    const channel = client
      .channel('site_settings_realtime_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_settings' },
        () => {
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  },

  async getSettings(): Promise<SiteSettings> {
    if (!isSupabaseConfigured || !supabase) {
      return mockSiteSettings;
    }

    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();

      if (error || !data) {
        return mockSiteSettings;
      }

      return data;
    } catch (err) {
      console.error('Erro ao buscar configurações do site no Supabase:', err);
      return mockSiteSettings;
    }
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error(SUPABASE_NOT_CONFIGURED_ERROR);
    }

    try {
      const current = await this.getSettings();
      if (current.id) {
        const { data, error } = await supabase
          .from('site_settings')
          .update({
            store_name: settings.store_name,
            whatsapp: settings.whatsapp,
            phone: settings.phone,
            email: settings.email,
            instagram: settings.instagram,
            address: settings.address,
            opening_hours: settings.opening_hours,
            logo_url: settings.logo_url,
            favicon_url: settings.favicon_url,
            seo_title: settings.seo_title,
            seo_description: settings.seo_description,
            og_image: settings.og_image,
          })
          .eq('id', current.id)
          .select()
          .single();

        if (error) throw error;
        window.dispatchEvent(new Event('raposo_settings_updated'));
        return data;
      } else {
        const { data, error } = await supabase
          .from('site_settings')
          .insert({
            store_name: settings.store_name || 'Raposo Veículos',
            whatsapp: settings.whatsapp || '5579998476431',
            phone: settings.phone || '(79) 99847-6431',
            email: settings.email || 'contato@raposoveiculos.com.br',
            instagram: settings.instagram || '@nexussitesbr',
            address: settings.address || '',
            opening_hours: settings.opening_hours || '',
            seo_title: settings.seo_title || 'Raposo Veículos | Catálogo Digital Premium',
            seo_description: settings.seo_description || '',
          })
          .select()
          .single();

        if (error) throw error;
        window.dispatchEvent(new Event('raposo_settings_updated'));
        return data;
      }
    } catch (err: any) {
      console.error('Erro ao atualizar configurações no Supabase:', err);
      throw new Error(`Erro ao atualizar configurações no Supabase: ${err.message || err}`);
    }
  }
};
