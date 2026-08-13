import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const mediaService = {
  async uploadVehicleImage(vehicleId: string, file: File): Promise<{ url: string; path: string } | null> {
    if (!isSupabaseConfigured || !supabase) {
      // In local mode create an object URL
      const objectUrl = URL.createObjectURL(file);
      return {
        url: objectUrl,
        path: `vehicles/${vehicleId}/images/${file.name}`,
      };
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `vehicles/${vehicleId}/images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('vehicle-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('vehicle-media')
        .getPublicUrl(filePath);

      return {
        url: data.publicUrl,
        path: filePath,
      };
    } catch (err) {
      console.error('Erro ao fazer upload da imagem:', err);
      // Fallback to object url
      return {
        url: URL.createObjectURL(file),
        path: `vehicles/${vehicleId}/images/${file.name}`,
      };
    }
  },

  async uploadVehicleVideo(vehicleId: string, file: File): Promise<{ url: string; path: string } | null> {
    if (!isSupabaseConfigured || !supabase) {
      const objectUrl = URL.createObjectURL(file);
      return {
        url: objectUrl,
        path: `vehicles/${vehicleId}/videos/${file.name}`,
      };
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `vehicles/${vehicleId}/videos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('vehicle-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('vehicle-media')
        .getPublicUrl(filePath);

      return {
        url: data.publicUrl,
        path: filePath,
      };
    } catch (err) {
      console.error('Erro ao fazer upload do vídeo:', err);
      return {
        url: URL.createObjectURL(file),
        path: `vehicles/${vehicleId}/videos/${file.name}`,
      };
    }
  },

  async deleteMedia(storagePath: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return true;

    try {
      const { error } = await supabase.storage.from('vehicle-media').remove([storagePath]);
      return !error;
    } catch {
      return false;
    }
  }
};
