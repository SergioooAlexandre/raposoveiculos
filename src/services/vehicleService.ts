import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Vehicle, VehicleFilterState, VehicleStatus } from '../types';
import { mockVehicles } from '../data/mockVehicles';
import { slugify } from '../utils/formatters';

// Runtime mock memory storage for unconfigured demo mode ONLY
let unconfiguredMockVehicles: Vehicle[] = [...mockVehicles];

export const vehicleService = {
  /**
   * Subscribe to real-time changes in the Supabase 'vehicles' table.
   * Enables instant global synchronization across all connected devices (desktop, mobile, tablet).
   */
  subscribeToRealtime(onUpdate: () => void) {
    const client = supabase;
    if (!isSupabaseConfigured || !client) return () => {};

    const channel = client
      .channel('vehicles_realtime_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'vehicles' },
        () => {
          onUpdate();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'vehicle_media' },
        () => {
          onUpdate();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'vehicle_features' },
        () => {
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  },

  async getVehicles(filters?: VehicleFilterState & { include_hidden?: boolean }): Promise<Vehicle[]> {
    if (!isSupabaseConfigured || !supabase) {
      let filtered = [...unconfiguredMockVehicles];

      if (!filters?.include_hidden && filters?.is_visible === undefined) {
        filtered = filtered.filter(v => v.is_visible !== false);
      } else if (filters?.is_visible !== undefined) {
        filtered = filtered.filter(v => Boolean(v.is_visible) === filters.is_visible);
      }

      if (filters?.search) {
        const query = filters.search.toLowerCase();
        filtered = filtered.filter(v =>
          v.brand.toLowerCase().includes(query) ||
          v.model.toLowerCase().includes(query) ||
          v.version.toLowerCase().includes(query) ||
          v.description.toLowerCase().includes(query)
        );
      }
      if (filters?.brand) {
        filtered = filtered.filter(v => v.brand.toLowerCase() === filters.brand?.toLowerCase());
      }
      if (filters?.model) {
        filtered = filtered.filter(v => v.model.toLowerCase().includes(filters.model?.toLowerCase() || ''));
      }
      if (filters?.body_type) {
        filtered = filtered.filter(v => v.body_type === filters.body_type);
      }
      if (filters?.min_price) {
        filtered = filtered.filter(v => (v.promotional_price || v.price) >= (filters.min_price || 0));
      }
      if (filters?.max_price) {
        filtered = filtered.filter(v => (v.promotional_price || v.price) <= (filters.max_price || Infinity));
      }
      if (filters?.min_year) {
        filtered = filtered.filter(v => v.year >= (filters.min_year || 0));
      }
      if (filters?.max_year) {
        filtered = filtered.filter(v => v.year <= (filters.max_year || 9999));
      }
      if (filters?.max_mileage) {
        filtered = filtered.filter(v => v.mileage <= (filters.max_mileage || Infinity));
      }
      if (filters?.transmission) {
        filtered = filtered.filter(v => v.transmission === filters.transmission);
      }
      if (filters?.fuel) {
        filtered = filtered.filter(v => v.fuel === filters.fuel);
      }
      if (filters?.color) {
        filtered = filtered.filter(v => v.color.toLowerCase() === filters.color?.toLowerCase());
      }
      if (filters?.status) {
        filtered = filtered.filter(v => v.status === filters.status);
      }
      if (filters?.featured !== undefined) {
        filtered = filtered.filter(v => v.featured === filters.featured);
      }
      if (filters?.is_offer !== undefined) {
        filtered = filtered.filter(v => v.is_offer === filters.is_offer);
      }
      if (filters?.selected_features && filters.selected_features.length > 0) {
        filtered = filtered.filter(v =>
          filters.selected_features?.every(f => v.features?.includes(f))
        );
      }

      // Sort
      if (filters?.sort_by) {
        switch (filters.sort_by) {
          case 'price_asc':
            filtered.sort((a, b) => (a.promotional_price || a.price) - (b.promotional_price || b.price));
            break;
          case 'price_desc':
            filtered.sort((a, b) => (b.promotional_price || b.price) - (a.promotional_price || a.price));
            break;
          case 'mileage_asc':
            filtered.sort((a, b) => a.mileage - b.mileage);
            break;
          case 'mileage_desc':
            filtered.sort((a, b) => b.mileage - a.mileage);
            break;
          case 'newest':
          default:
            filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            break;
        }
      }

      return filtered;
    }

    try {
      let query = supabase
        .from('vehicles')
        .select(`
          *,
          media:vehicle_media(*),
          features:vehicle_features(feature_name)
        `);

      if (!filters?.include_hidden && filters?.is_visible === undefined) {
        query = query.or('is_visible.is.null,is_visible.eq.true');
      } else if (filters?.is_visible !== undefined) {
        query = query.eq('is_visible', filters.is_visible);
      }

      if (filters?.search) {
        query = query.or(`brand.ilike.%${filters.search}%,model.ilike.%${filters.search}%,version.ilike.%${filters.search}%`);
      }
      if (filters?.brand) {
        query = query.ilike('brand', filters.brand);
      }
      if (filters?.model) {
        query = query.ilike('model', `%${filters.model}%`);
      }
      if (filters?.body_type) {
        query = query.eq('body_type', filters.body_type);
      }
      if (filters?.min_price) {
        query = query.gte('price', filters.min_price);
      }
      if (filters?.max_price) {
        query = query.lte('price', filters.max_price);
      }
      if (filters?.min_year) {
        query = query.gte('year', filters.min_year);
      }
      if (filters?.max_year) {
        query = query.lte('year', filters.max_year);
      }
      if (filters?.max_mileage) {
        query = query.lte('mileage', filters.max_mileage);
      }
      if (filters?.transmission) {
        query = query.eq('transmission', filters.transmission);
      }
      if (filters?.fuel) {
        query = query.eq('fuel', filters.fuel);
      }
      if (filters?.color) {
        query = query.ilike('color', filters.color);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.featured !== undefined) {
        query = query.eq('featured', filters.featured);
      }
      if (filters?.is_offer !== undefined) {
        query = query.eq('is_offer', filters.is_offer);
      }

      if (filters?.sort_by) {
        switch (filters.sort_by) {
          case 'price_asc':
            query = query.order('price', { ascending: true });
            break;
          case 'price_desc':
            query = query.order('price', { ascending: false });
            break;
          case 'mileage_asc':
            query = query.order('mileage', { ascending: true });
            break;
          case 'mileage_desc':
            query = query.order('mileage', { ascending: false });
            break;
          case 'newest':
          default:
            query = query.order('created_at', { ascending: false });
            break;
        }
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(v => {
        const sortedMedia = (v.media || []).sort((a: any, b: any) => a.sort_order - b.sort_order);
        const primary = sortedMedia.find((m: any) => m.is_primary) || sortedMedia[0];
        const secondary = sortedMedia.find((m: any) => !m.is_primary && m.type === 'image') || sortedMedia[1];

        return {
          ...v,
          is_visible: v.is_visible ?? true,
          primary_image: primary?.url || '',
          secondary_image: secondary?.url || '',
          features: (v.features || []).map((f: any) => f.feature_name),
          media: sortedMedia,
        };
      });
    } catch (err) {
      console.error('Erro ao buscar veículos no Supabase:', err);
      return [];
    }
  },

  async getVehicleBySlug(slug: string): Promise<Vehicle | null> {
    const all = await this.getVehicles({ include_hidden: true });
    return all.find(v => v.slug === slug) || null;
  },

  async getVehicleById(id: string): Promise<Vehicle | null> {
    const all = await this.getVehicles({ include_hidden: true });
    return all.find(v => v.id === id) || null;
  },

  async getFeaturedVehicles(): Promise<Vehicle[]> {
    const all = await this.getVehicles({ featured: true });
    return all.slice(0, 6);
  },

  async getOffersVehicles(): Promise<Vehicle[]> {
    const all = await this.getVehicles({ is_offer: true });
    return all;
  },

  async createVehicle(vehicleData: Partial<Vehicle>, mediaUrls: string[] = [], featuresList: string[] = []): Promise<Vehicle> {
    const generatedSlug = slugify(`${vehicleData.brand || ''} ${vehicleData.model || ''} ${vehicleData.version || ''} ${vehicleData.year || ''}-${Date.now().toString().slice(-4)}`);

    if (!isSupabaseConfigured || !supabase) {
      const newVehicle: Vehicle = {
        id: 'v-' + Date.now(),
        slug: generatedSlug,
        brand: vehicleData.brand || 'Marca',
        model: vehicleData.model || 'Modelo',
        version: vehicleData.version || 'Versão',
        year: Number(vehicleData.year) || 2024,
        model_year: Number(vehicleData.model_year) || 2024,
        price: Number(vehicleData.price) || 0,
        promotional_price: vehicleData.promotional_price ? Number(vehicleData.promotional_price) : null,
        mileage: Number(vehicleData.mileage) || 0,
        fuel: vehicleData.fuel || 'FLEX',
        transmission: vehicleData.transmission || 'AUTOMATICO',
        body_type: vehicleData.body_type || 'SUV',
        color: vehicleData.color || 'Preto',
        engine: vehicleData.engine || '2.0',
        power: vehicleData.power || '150 cv',
        traction: vehicleData.traction || 'Dianteira',
        doors: Number(vehicleData.doors) || 4,
        plate_end: vehicleData.plate_end || '0',
        description: vehicleData.description || '',
        status: vehicleData.status || 'DISPONIVEL',
        featured: Boolean(vehicleData.featured),
        is_offer: Boolean(vehicleData.is_offer),
        is_visible: vehicleData.is_visible !== undefined ? Boolean(vehicleData.is_visible) : true,
        video_url: vehicleData.video_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        primary_image: mediaUrls[0] || '',
        secondary_image: mediaUrls[1] || '',
        features: featuresList,
        media: mediaUrls.map((url, idx) => ({
          id: `m-new-${idx}`,
          vehicle_id: 'v-' + Date.now(),
          type: 'image',
          url,
          is_primary: idx === 0,
          sort_order: idx + 1,
        })),
      };

      unconfiguredMockVehicles = [newVehicle, ...unconfiguredMockVehicles];
      return newVehicle;
    }

    // Supabase Insert
    const { data: created, error: vehicleErr } = await supabase
      .from('vehicles')
      .insert({
        slug: generatedSlug,
        brand: vehicleData.brand,
        model: vehicleData.model,
        version: vehicleData.version,
        year: vehicleData.year,
        model_year: vehicleData.model_year,
        price: vehicleData.price,
        promotional_price: vehicleData.promotional_price || null,
        mileage: vehicleData.mileage || 0,
        fuel: vehicleData.fuel,
        transmission: vehicleData.transmission,
        body_type: vehicleData.body_type,
        color: vehicleData.color,
        engine: vehicleData.engine,
        power: vehicleData.power,
        traction: vehicleData.traction,
        doors: vehicleData.doors || 4,
        plate_end: vehicleData.plate_end || '0',
        description: vehicleData.description || '',
        status: vehicleData.status || 'DISPONIVEL',
        featured: Boolean(vehicleData.featured),
        is_offer: Boolean(vehicleData.is_offer),
        is_visible: vehicleData.is_visible !== undefined ? Boolean(vehicleData.is_visible) : true,
        video_url: vehicleData.video_url || null,
      })
      .select()
      .single();

    if (vehicleErr) throw vehicleErr;

    // Insert Media into Supabase vehicle_media
    if (mediaUrls.length > 0) {
      const mediaRecords = mediaUrls.map((url, idx) => ({
        vehicle_id: created.id,
        type: 'image',
        url,
        is_primary: idx === 0,
        sort_order: idx + 1,
      }));
      await supabase.from('vehicle_media').insert(mediaRecords);
    }

    // Insert Features into Supabase vehicle_features
    if (featuresList.length > 0) {
      const featureRecords = featuresList.map(name => ({
        vehicle_id: created.id,
        feature_name: name,
      }));
      await supabase.from('vehicle_features').insert(featureRecords);
    }

    return (await this.getVehicleById(created.id)) || created;
  },

  async updateVehicle(id: string, vehicleData: Partial<Vehicle>, mediaUrls?: string[], featuresList?: string[]): Promise<Vehicle | null> {
    if (!isSupabaseConfigured || !supabase) {
      const idx = unconfiguredMockVehicles.findIndex(v => v.id === id);
      if (idx === -1) return null;

      const existing = unconfiguredMockVehicles[idx];
      const updated: Vehicle = {
        ...existing,
        ...vehicleData,
        updated_at: new Date().toISOString(),
        primary_image: mediaUrls?.[0] || existing.primary_image,
        secondary_image: mediaUrls?.[1] || existing.secondary_image,
        features: featuresList !== undefined ? featuresList : existing.features,
        media: mediaUrls
          ? mediaUrls.map((url, i) => ({
              id: `m-up-${i}`,
              vehicle_id: id,
              type: 'image',
              url,
              is_primary: i === 0,
              sort_order: i + 1,
            }))
          : existing.media,
      };

      unconfiguredMockVehicles[idx] = updated;
      return updated;
    }

    const { error: vErr } = await supabase
      .from('vehicles')
      .update({
        brand: vehicleData.brand,
        model: vehicleData.model,
        version: vehicleData.version,
        year: vehicleData.year,
        model_year: vehicleData.model_year,
        price: vehicleData.price,
        promotional_price: vehicleData.promotional_price,
        mileage: vehicleData.mileage,
        fuel: vehicleData.fuel,
        transmission: vehicleData.transmission,
        body_type: vehicleData.body_type,
        color: vehicleData.color,
        engine: vehicleData.engine,
        power: vehicleData.power,
        traction: vehicleData.traction,
        doors: vehicleData.doors,
        plate_end: vehicleData.plate_end,
        description: vehicleData.description,
        status: vehicleData.status,
        featured: vehicleData.featured,
        is_offer: vehicleData.is_offer,
        is_visible: vehicleData.is_visible,
        video_url: vehicleData.video_url,
      })
      .eq('id', id);

    if (vErr) throw vErr;

    if (mediaUrls) {
      await supabase.from('vehicle_media').delete().eq('vehicle_id', id);
      if (mediaUrls.length > 0) {
        const mediaRecords = mediaUrls.map((url, idx) => ({
          vehicle_id: id,
          type: 'image',
          url,
          is_primary: idx === 0,
          sort_order: idx + 1,
        }));
        await supabase.from('vehicle_media').insert(mediaRecords);
      }
    }

    if (featuresList) {
      await supabase.from('vehicle_features').delete().eq('vehicle_id', id);
      if (featuresList.length > 0) {
        const featureRecords = featuresList.map(name => ({
          vehicle_id: id,
          feature_name: name,
        }));
        await supabase.from('vehicle_features').insert(featureRecords);
      }
    }

    return await this.getVehicleById(id);
  },

  async updateStatus(id: string, status: VehicleStatus): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
      const v = unconfiguredMockVehicles.find(item => item.id === id);
      if (v) {
        v.status = status;
        v.updated_at = new Date().toISOString();
        return true;
      }
      return false;
    }

    const { error } = await supabase.from('vehicles').update({ status }).eq('id', id);
    return !error;
  },

  async toggleFeatured(id: string, featured: boolean): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
      const v = unconfiguredMockVehicles.find(item => item.id === id);
      if (v) {
        v.featured = featured;
        return true;
      }
      return false;
    }

    const { error } = await supabase.from('vehicles').update({ featured }).eq('id', id);
    return !error;
  },

  async toggleOffer(id: string, is_offer: boolean): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
      const v = unconfiguredMockVehicles.find(item => item.id === id);
      if (v) {
        v.is_offer = is_offer;
        return true;
      }
      return false;
    }

    const { error } = await supabase.from('vehicles').update({ is_offer }).eq('id', id);
    return !error;
  },

  async toggleVisibility(id: string, is_visible: boolean): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
      const v = unconfiguredMockVehicles.find(item => item.id === id);
      if (v) {
        v.is_visible = is_visible;
        return true;
      }
      return false;
    }

    const { error } = await supabase.from('vehicles').update({ is_visible }).eq('id', id);
    return !error;
  },

  async deleteVehicle(id: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
      unconfiguredMockVehicles = unconfiguredMockVehicles.filter(v => v.id !== id);
      return true;
    }

    const { error } = await supabase.from('vehicles').delete().eq('id', id);
    return !error;
  },

  async duplicateVehicle(id: string): Promise<Vehicle | null> {
    const existing = await this.getVehicleById(id);
    if (!existing) return null;

    const copyData = {
      ...existing,
      model: `${existing.model} (Cópia)`,
      status: 'DISPONIVEL' as VehicleStatus,
      featured: false,
      is_offer: false,
      is_visible: true,
    };

    const mediaList = existing.media?.map(m => m.url) || (existing.primary_image ? [existing.primary_image] : []);
    return await this.createVehicle(copyData, mediaList, existing.features || []);
  }
};
