import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { AdminUser } from '../types';

export const authService = {
  async signIn(email: string, password: string): Promise<{ user: AdminUser | null; error: string | null }> {
    if (!isSupabaseConfigured || !supabase) {
      // In unconfigured Supabase mode, allow demo login for evaluation
      const mockAdmin: AdminUser = {
        id: 'demo-admin-id',
        user_id: 'demo-user-id',
        role: 'ADMIN',
        email: email || 'admin@raposoveiculos.com.br',
        name: 'Administrador Raposo',
        created_at: new Date().toISOString(),
      };
      sessionStorage.setItem('raposo_admin_demo_session', JSON.stringify(mockAdmin));
      return { user: mockAdmin, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error: error.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : error.message };
      }

      if (!data.user) {
        return { user: null, error: 'Usuário não encontrado.' };
      }

      // Check if user is registered in admin_users table
      const { data: adminRecord, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      if (adminError || !adminRecord) {
        // If not in admin_users, revoke session
        await supabase.auth.signOut();
        return { user: null, error: 'Acesso negado: Este usuário não possui permissão de administrador.' };
      }

      const adminUser: AdminUser = {
        id: adminRecord.id,
        user_id: data.user.id,
        role: adminRecord.role || 'ADMIN',
        email: data.user.email || '',
        name: data.user.user_metadata?.name || 'Administrador',
        created_at: adminRecord.created_at,
      };

      return { user: adminUser, error: null };
    } catch (err: any) {
      return { user: null, error: err.message || 'Erro inesperado ao realizar login.' };
    }
  },

  async getCurrentSession(): Promise<AdminUser | null> {
    if (!isSupabaseConfigured || !supabase) {
      const stored = sessionStorage.getItem('raposo_admin_demo_session');
      if (stored) {
        try {
          return JSON.parse(stored) as AdminUser;
        } catch {
          return null;
        }
      }
      return null;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      const { data: adminRecord } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (!adminRecord) return null;

      return {
        id: adminRecord.id,
        user_id: session.user.id,
        role: adminRecord.role || 'ADMIN',
        email: session.user.email || '',
        name: session.user.user_metadata?.name || 'Administrador',
        created_at: adminRecord.created_at,
      };
    } catch {
      return null;
    }
  },

  async signOut(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    sessionStorage.removeItem('raposo_admin_demo_session');
  }
};
