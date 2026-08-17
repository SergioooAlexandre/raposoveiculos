import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const storageService = {
  /**
   * Upload an image or video file to Supabase Storage bucket 'vehicle-media'.
   * Path format: vehicles/{vehicleId}/images/{fileName} or vehicles/{vehicleId}/videos/{fileName}
   */
  async uploadVehicleMedia(file: File, vehicleId: string, isVideo = false): Promise<string> {
    if (!isSupabaseConfigured || !supabase) {
      // Unconfigured environment fallback (Data URL for local preview)
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });
    }

    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || (isVideo ? 'mp4' : 'jpg');
      const fileCategory = isVideo ? 'videos' : 'images';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `vehicles/${vehicleId}/${fileCategory}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('vehicle-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.error('Erro ao fazer upload no Supabase Storage:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('vehicle-media')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err: any) {
      console.error('Erro ao fazer upload de mídia para o Supabase Storage:', err);
      // Temporary fallback data URL if bucket fails
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  },

  // Alias for backward compatibility
  async uploadVehicleImage(file: File, vehicleId: string): Promise<string> {
    const isVideo = file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.webm') || file.name.endsWith('.mov');
    return this.uploadVehicleMedia(file, vehicleId, isVideo);
  }
};
