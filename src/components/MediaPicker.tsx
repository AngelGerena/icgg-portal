import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useLang } from '../lib/providers';
import { Icon } from './Icon';

interface MediaItem {
  id: string;
  name: string;
  url: string | null;
  tag: string | null;
  size_bytes: number | null;
}

/**
 * A modal that lets the user pick an existing image from the Media Library.
 * onPick receives the selected image URL. onClose dismisses without choosing.
 * Any editor (events, sermons, site) can drop this in for "reuse an existing image."
 */
export function MediaPicker({ onPick, onClose }: { onPick: (url: string) => void; onClose: () => void }) {
  const { lang } = useLang();
  const [rows, setRows] = useState<MediaItem[] | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    supabase.from('media').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setRows((data as MediaItem[]) ?? []));
  }, []);

  const filtered = (rows ?? []).filter(m =>
    !query.trim() ||
    (m.name || '').toLowerCase().includes(query.toLowerCase()) ||
    (m.tag || '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mediapick-overlay" onClick={onClose}>
      <div className="mediapick-box" onClick={e => e.stopPropagation()}>
        <div className="mediapick-head">
          <b>{lang === 'es' ? 'Elegir de la biblioteca' : 'Choose from library'}</b>
          <button className="mediapick-x" onClick={onClose} aria-label="Close"><Icon name="x" size={18} /></button>
        </div>
        <input
          className="mediapick-search"
          placeholder={lang === 'es' ? 'Buscar por nombre o etiqueta…' : 'Search by name or tag…'}
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {rows === null ? (
          <div className="center-load"><div className="spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="mediapick-empty">
            <Icon name="media" size={30} />
            <p>{lang === 'es'
              ? 'No hay imágenes en la biblioteca todavía. Súbelas en Biblioteca de medios.'
              : 'No images in the library yet. Upload them in the Media Library.'}</p>
          </div>
        ) : (
          <div className="mediapick-grid">
            {filtered.map(m => (
              <button
                key={m.id}
                className="mediapick-item"
                onClick={() => m.url && onPick(m.url)}
                title={m.name}
              >
                <div className="mediapick-thumb" style={{ backgroundImage: m.url ? `url('${m.url}')` : 'none' }} />
                <span className="mediapick-name">{m.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
