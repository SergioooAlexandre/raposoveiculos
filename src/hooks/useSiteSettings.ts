import { useState, useEffect } from 'react';
import type { SiteSettings } from '../types';
import { settingsService } from '../services/settingsService';
import { mockSiteSettings } from '../data/mockVehicles';

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(mockSiteSettings);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSettings = async () => {
    try {
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (err) {
      console.error('Erro ao carregar configurações:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();

    // Subscribe to local custom event
    const handleSettingsUpdated = () => {
      fetchSettings();
    };
    window.addEventListener('raposo_settings_updated', handleSettingsUpdated);

    // Subscribe to Supabase Realtime global changes
    const unsubscribeRealtime = settingsService.subscribeToRealtime(() => {
      fetchSettings();
    });

    return () => {
      window.removeEventListener('raposo_settings_updated', handleSettingsUpdated);
      unsubscribeRealtime();
    };
  }, []);

  return {
    settings,
    loading,
    refreshSettings: fetchSettings,
  };
}
