import { createClient } from '@supabase/supabase-js';

// Primary source: Vite env vars (used by the GitHub-connected CI/CD build on Netlify).
// Fallback: the LIVE project's public anon credentials (project zyvfvjrhnuwapfwipukd),
// so a no-build drag-and-drop deploy still initializes correctly instead of throwing
// "supabaseUrl is required" and rendering a blank page. The anon key is a public,
// frontend-safe token — the same one the live site already ships.
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://zyvfvjrhnuwapfwipukd.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5dmZ2anJobnV3YXBmd2lwdWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyOTMxOTYsImV4cCI6MjA5NDg2OTE5Nn0.NO7cwPljC9dlfSfcJN1nTuqk9NrQNZKzzf-C3AfH_oQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
