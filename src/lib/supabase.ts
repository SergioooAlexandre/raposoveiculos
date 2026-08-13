import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate if the variables are set and not default placeholders
export const isSupabaseConfigured = 
  Boolean(supabaseUrl) && 
  supabaseUrl !== 'your-supabase-project-url' && 
  !supabaseUrl.includes('placeholder') &&
  Boolean(supabaseAnonKey) && 
  supabaseAnonKey !== 'your-supabase-anonymous-anon-key' &&
  !supabaseAnonKey.includes('placeholder');

// We conditionally create the client to prevent crash if URL is not a valid format
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : null;
