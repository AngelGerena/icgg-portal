import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface SiteContentRow {
  key: string;
  kind: string;
  value_es: string | null;
  value_en: string | null;
}

interface SiteContentCtx {
  loaded: boolean;
  map: Record<string, SiteContentRow>;
}

const Ctx = createContext<SiteContentCtx>({ loaded: false, map: {} });

export const SiteContentProvider = ({ children }: { children: React.ReactNode }) => {
  const [map, setMap] = useState<Record<string, SiteContentRow>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase.from('site_content').select('key, kind, value_es, value_en');
        if (!error && data && active) {
          const m: Record<string, SiteContentRow> = {};
          (data as SiteContentRow[]).forEach(r => { m[r.key] = r; });
          setMap(m);
        }
      } catch {
        /* fall back to defaults */
      } finally {
        if (active) setLoaded(true);
      }
    })();
    return () => { active = false; };
  }, []);

  return <Ctx.Provider value={{ loaded, map }}>{children}</Ctx.Provider>;
};

/**
 * Returns the editable image URL for a slot key, or the provided fallback
 * (the original hardcoded image) when the slot is empty or not yet loaded.
 * "You can't break it" — an empty slot always shows the original.
 */
export function useSiteImage(key: string, fallback: string): string {
  const { map } = useContext(Ctx);
  const row = map[key];
  const val = row?.value_es || row?.value_en || '';
  return val && val.trim() ? val : fallback;
}

/** Text override helper (mirrors the image one, for consistency). */
export function useSiteText(key: string, fallbackEs: string, fallbackEn: string, isSpanish: boolean): string {
  const { map } = useContext(Ctx);
  const row = map[key];
  const v = isSpanish ? (row?.value_es || '') : (row?.value_en || '');
  return v && v.trim() ? v : (isSpanish ? fallbackEs : fallbackEn);
}
