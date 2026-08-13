import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AdminUser } from '../types';
import { authService } from '../services/authService';
import { isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  isSupabaseConnected: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  useEffect(() => {
    const initSession = async () => {
      setIsLoading(true);
      try {
        const sessionUser = await authService.getCurrentSession();
        setUser(sessionUser);
      } catch (err: any) {
        console.error('Erro ao verificar sessão:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    const { user: loggedUser, error: authError } = await authService.signIn(email, password);

    if (authError) {
      setError(authError);
      setIsLoading(false);
      return false;
    }

    setUser(loggedUser);
    setIsLoading(false);
    return true;
  };

  const signOut = async () => {
    setIsLoading(true);
    await authService.signOut();
    setUser(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSupabaseConnected: isSupabaseConfigured,
        error,
        signIn,
        signOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};
