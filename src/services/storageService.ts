import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { idbStorage } from '../utils/indexedDB';

export const storageService = {
  async uploadVehicleImage(file: File, vehicleId: string): Promise<string> {
    if (!isSupabaseConfigured || !supabase) {
      const mediaId = `media-${vehicleId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      try {
        const objectUrl = await idbStorage.saveMediaBlob(mediaId, file);
        return objectUrl;
      } catch (e) {
        return URL.createObjectURL(file);
      }
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${vehicleId}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `vehicles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('vehicle-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('vehicle-media')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err: any) {
      console.error('Erro ao fazer upload no Supabase Storage, fallback local:', err);
      const mediaId = `media-${vehicleId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      return await idbStorage.saveMediaBlob(mediaId, file);
    }
  }
};
