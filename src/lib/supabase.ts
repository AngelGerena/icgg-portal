import { createClient } from '@supabase/supabase-js';

// Primary source: Vite env vars (used by the GitHub-connected CI/CD build).
// Fallback: the LIVE project's public anon credentials (project zyvfvjrhnuwapfwipukd) —
// the SAME project the church site reads from — so a no-build drag-and-drop deploy
// still connects for login and flyer uploads instead of failing with no config.
// The anon key is a public, frontend-safe token.
const url =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  'https://zyvfvjrhnuwapfwipukd.supabase.co';
const anon =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dmZ2anJobnV3YXBmd2lwdWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyOTMxOTYsImV4cCI6MjA5NDg2OTE5Nn0.NO7cwPljC9dlfSfcJN1nTuqk9NrQNZKzzf-C3AfH_oQ';

if (!url || !anon) {
  // Surfaced in the login screen as a readable message, never a blank page.
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

// Single shared client — avoids the "multiple GoTrueClient instances" warning.
export const supabase = createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true, storageKey: 'icgg-portal-auth' },
});

export const hasConfig = Boolean(url && anon);
