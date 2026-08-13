import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { SiteSettings } from '../types';
import { mockSiteSettings } from '../data/mockVehicles';

const SETTINGS_STORAGE_KEY = 'raposo_settings_local';

const getLocalSettings = (): SiteSettings => {
  const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as SiteSettings;
    } catch (e) {
      console.error('Erro ao carregar configurações locais:', e);
    }
  }
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(mockSiteSettings));
  return mockSiteSettings;
};

const saveLocalSettings = (settings: SiteSettings): void => {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event('raposo_settings_updated'));
};

export const settingsService = {
  async getSettings(): Promise<SiteSettings> {
    if (!isSupabaseConfigured || !supabase) {
      return getLocalSettings();
    }

    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();

      if (error || !data) {
        return getLocalSettings();
      }

      return data;
    } catch (err) {
      console.error('Erro ao buscar configurações do site no Supabase, fallback local:', err);
      return getLocalSettings();
    }
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    if (!isSupabaseConfigured || !supabase) {
      const current = getLocalSettings();
      const updated: SiteSettings = {
        ...current,
        ...settings,
        updated_at: new Date().toISOString(),
      };
      saveLocalSettings(updated);
      return updated;
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
    } catch (err) {
      console.error('Erro ao atualizar configurações no Supabase, atualizando localmente:', err);
      const current = getLocalSettings();
      const updated = { ...current, ...settings };
      saveLocalSettings(updated);
      return updated;
    }
  }
};
