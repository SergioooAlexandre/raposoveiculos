import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const storageService = {
  async uploadVehicleImage(file: File, vehicleId: string): Promise<string> {
    if (!isSupabaseConfigured || !supabase) {
      // In demo mode without supabase, convert to data URL for immediate preview
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(file);
      });
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
      console.error('Erro ao fazer upload no Supabase Storage:', err);
      // Fallback to FileReader
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  }
};
