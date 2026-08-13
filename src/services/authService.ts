import type { AdminUser } from '../types';

export const authService = {
  async signIn(_email: string, password: string): Promise<{ user: AdminUser | null; error: string | null }> {
    // Check master admin password RP2026
    if (password === 'RP2026') {
      const adminUser: AdminUser = {
        id: 'admin-id-rp2026',
        user_id: 'admin-user-rp2026',
        role: 'ADMIN',
        email: 'admin@raposoveiculos.com.br',
        name: 'Administrador Raposo',
        created_at: new Date().toISOString(),
      };
      sessionStorage.setItem('raposo_admin_demo_session', JSON.stringify(adminUser));
      return { user: adminUser, error: null };
    }

    return {
      user: null,
      error: 'Senha incorreta! Acesso negado. Por favor, digite a senha correta de administrador.',
    };
  },

  async getCurrentSession(): Promise<AdminUser | null> {
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
    sessionStorage.removeItem('raposo_admin_demo_session');
  }
};
