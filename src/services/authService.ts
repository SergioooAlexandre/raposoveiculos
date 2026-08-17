import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { AdminUser } from '../types';

const ADMIN_EMAIL = 'admin@raposoveiculos.com.br';

export const authService = {
  async signIn(emailInput: string, passwordInput: string): Promise<{ user: AdminUser | null; error: string | null }> {
    // Single Master Admin Password Check
    if (passwordInput !== 'RP2026') {
      return {
        user: null,
        error: 'Senha incorreta! Acesso negado. Digite a senha master de administrador.',
      };
    }

    const email = emailInput?.trim() ? emailInput.trim() : ADMIN_EMAIL;

    // If Supabase is configured, authenticate via Supabase Auth to obtain JWT session token for RLS
    if (isSupabaseConfigured && supabase) {
      try {
        // Attempt sign in
        let { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: passwordInput,
        });

        // If user does not exist in Supabase Auth yet, create user account automatically
        if (error && (error.message.includes('Invalid login credentials') || error.message.includes('User not found'))) {
          const signUpRes = await supabase.auth.signUp({
            email,
            password: passwordInput,
          });

          if (!signUpRes.error && signUpRes.data.user) {
            // Re-attempt sign in after signup
            const retryRes = await supabase.auth.signInWithPassword({
              email,
              password: passwordInput,
            });
            data = retryRes.data;
            error = retryRes.error;
          }
        }

        if (error) {
          console.error('Erro de autenticação no Supabase Auth:', error);
          // Fallback to local admin user object if Supabase Auth registration is disabled in dashboard
          const localUser: AdminUser = {
            id: 'admin-id-rp2026',
            user_id: 'admin-user-rp2026',
            role: 'ADMIN',
            email,
            name: 'Administrador Raposo',
            created_at: new Date().toISOString(),
          };
          sessionStorage.setItem('raposo_admin_demo_session', JSON.stringify(localUser));
          return { user: localUser, error: null };
        }

        if (data.user) {
          const adminUser: AdminUser = {
            id: data.user.id,
            user_id: data.user.id,
            role: 'ADMIN',
            email: data.user.email || email,
            name: 'Administrador Raposo',
            created_at: data.user.created_at,
          };
          sessionStorage.setItem('raposo_admin_demo_session', JSON.stringify(adminUser));
          return { user: adminUser, error: null };
        }
      } catch (err: any) {
        console.error('Falha ao autenticar no Supabase Auth:', err);
      }
    }

    // Demo/Local session fallback
    const localUser: AdminUser = {
      id: 'admin-id-rp2026',
      user_id: 'admin-user-rp2026',
      role: 'ADMIN',
      email,
      name: 'Administrador Raposo',
      created_at: new Date().toISOString(),
    };
    sessionStorage.setItem('raposo_admin_demo_session', JSON.stringify(localUser));
    return { user: localUser, error: null };
  },

  async getCurrentSession(): Promise<AdminUser | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          return {
            id: session.user.id,
            user_id: session.user.id,
            role: 'ADMIN',
            email: session.user.email || ADMIN_EMAIL,
            name: 'Administrador Raposo',
            created_at: session.user.created_at,
          };
        }
      } catch (e) {
        console.error('Erro ao verificar sessão Supabase Auth:', e);
      }
    }

    const stored = sessionStorage.getItem('raposo_admin_demo_session');
    if (stored) {
      try {
        return JSON.parse(stored) as AdminUser;
      } catch {
        return null;
      }
    }
    return null;
  },

  async signOut(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('Erro ao encerrar sessão Supabase Auth:', e);
      }
    }
    sessionStorage.removeItem('raposo_admin_demo_session');
  }
};
