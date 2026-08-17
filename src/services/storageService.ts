import { supabase, isSupabaseConfigured } from '../lib/supabase';

const SUPABASE_NOT_CONFIGURED_ERROR = 'SUPABASE_DESCONECTADO: As variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não foram configuradas na Vercel. Cadastre-as em Settings > Environment Variables no painel da Vercel para permitir upload de mídias para a nuvem.';

export const storageService = {
  /**
   * Upload an image or video file to Supabase Storage bucket 'vehicle-media'.
   * Path format: vehicles/{vehicleId}/images/{fileName} or vehicles/{vehicleId}/videos/{fileName}
   */
  async uploadVehicleMedia(file: File, vehicleId: string, isVideo = false): Promise<string> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error(SUPABASE_NOT_CONFIGURED_ERROR);
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
        throw new Error(`Erro de Storage no Supabase: ${uploadError.message}. Verifique se o bucket 'vehicle-media' foi criado e configurado como Público no Supabase.`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('vehicle-media')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err: any) {
      console.error('Erro ao fazer upload de mídia para o Supabase Storage:', err);
      throw err;
    }
  },

  // Alias for backward compatibility
  async uploadVehicleImage(file: File, vehicleId: string): Promise<string> {
    const isVideo = file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.webm') || file.name.endsWith('.mov');
    return this.uploadVehicleMedia(file, vehicleId, isVideo);
  }
};
