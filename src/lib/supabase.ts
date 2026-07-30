import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !anon) {
  // Surfaced in the login screen as a readable message, never a blank page.
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

// Single shared client — avoids the "multiple GoTrueClient instances" warning.
export const supabase = createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true, storageKey: 'icgg-portal-auth' },
});

export const hasConfig = Boolean(url && anon);
