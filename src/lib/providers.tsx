import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from './supabase';
import type { AdminUser, Lang, Theme } from './types';

/* ============================ THEME ============================ */
interface ThemeCtx { theme: Theme; toggleTheme: () => void; }
const ThemeContext = createContext<ThemeCtx>({ theme: 'light', toggleTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('icgg-theme') as Theme | null;
    if (saved) return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('icgg-theme', theme);
  }, [theme]);
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light') }}>
      {children}
    </ThemeContext.Provider>
  );
}

/* ============================ LANGUAGE ============================ */
interface LangCtx { lang: Lang; setLang: (l: Lang) => void; toggleLang: () => void; }
const LangContext = createContext<LangCtx>({ lang: 'es', setLang: () => {}, toggleLang: () => {} });
export const useLang = () => useContext(LangContext);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem('icgg-lang') as Lang) || 'es');
  useEffect(() => {
    localStorage.setItem('icgg-lang', lang);
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);
  const setLang = (l: Lang) => setLangState(l);
  const toggleLang = () => setLangState(l => l === 'es' ? 'en' : 'es');
  return <LangContext.Provider value={{ lang, setLang, toggleLang }}>{children}</LangContext.Provider>;
}

/* ============================ AUTH ============================ */
interface AuthCtx {
  loading: boolean;
  session: boolean;
  admin: AdminUser | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}
const AuthContext = createContext<AuthCtx>({
  loading: true, session: false, admin: null,
  signIn: async () => ({ error: null }), signOut: async () => {},
});
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(false);
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  async function loadAdmin(userId: string) {
    const { data } = await supabase
      .from('admin_users')
      .select('id, user_id, email, full_name, role, is_super_admin')
      .eq('user_id', userId)
      .maybeSingle();
    setAdmin(data as AdminUser | null);
  }

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      if (data.session) { setSession(true); await loadAdmin(data.session.user.id); }
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, s) => {
      if (s) { setSession(true); await loadAdmin(s.user.id); }
      else { setSession(false); setAdmin(null); }
    });
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    if (data.user) await loadAdmin(data.user.id);
    return { error: null };
  };
  const signOut = async () => { await supabase.auth.signOut(); setAdmin(null); setSession(false); };

  return (
    <AuthContext.Provider value={{ loading, session, admin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
