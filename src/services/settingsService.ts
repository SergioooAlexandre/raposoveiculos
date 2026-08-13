import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { SiteSettings } from '../types';
import { mockSiteSettings } from '../data/mockVehicles';

let runtimeSettings: SiteSettings = { ...mockSiteSettings };

export const settingsService = {
  async getSettings(): Promise<SiteSettings> {
    if (!isSupabaseConfigured || !supabase) {
      return runtimeSettings;
    }

    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();

      if (error || !data) {
        return runtimeSettings;
      }

      return data;
    } catch (err) {
      console.error('Erro ao buscar configurações do site:', err);
      return runtimeSettings;
    }
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    if (!isSupabaseConfigured || !supabase) {
      runtimeSettings = {
        ...runtimeSettings,
        ...settings,
        updated_at: new Date().toISOString(),
      };
      return runtimeSettings;
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
        return data;
      }
    } catch (err) {
      console.error('Erro ao atualizar configurações:', err);
      runtimeSettings = { ...runtimeSettings, ...settings };
      return runtimeSettings;
    }
  }
};
