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
  }, []);

  return {
    settings,
    loading,
    refreshSettings: fetchSettings,
  };
}
