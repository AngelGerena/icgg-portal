import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLang } from '../../lib/providers';
import { useToast, Empty } from '../../components/UI';
import { Icon } from '../../components/Icon';
import type { MediaRow } from '../../lib/types';

export function MediaLibrary() {
  const { lang } = useLang();
  const { push } = useToast();
  const [rows, setRows] = useState<MediaRow[] | null>(null);
  const [uploading, setUploading] = useState(false);

  async function load() {
    const { data } = await supabase.from('media').select('*').order('created_at', { ascending: false });
    setRows((data as MediaRow[]) ?? []);
  }
  useEffect(() => { load(); }, []);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const up = await supabase.storage.from('media').upload(path, file, { upsert: false });
    if (up.error) { push(up.error.message, 'err'); setUploading(false); return; }
    const { data: pub } = supabase.storage.from('media').getPublicUrl(path);
    const { error } = await supabase.from('media').insert({
      name: file.name, path, url: pub.publicUrl, bucket: 'media', size_bytes: file.size, tag: 'General',
    });
    setUploading(false);
    if (error) { push(error.message, 'err'); return; }
    push(lang === 'es' ? 'Archivo subido' : 'File uploaded', 'ok');
    load();
  }

  function fmtSize(b: number | null) {
    if (!b) return '';
    return b > 1e6 ? (b / 1e6).toFixed(1) + ' MB' : Math.round(b / 1e3) + ' KB';
  }

  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const tags = Array.from(new Set((rows ?? []).map(r => r.tag || 'General'))).sort();
  const visible = (rows ?? []).filter(r => filter === 'all' || (r.tag || 'General') === filter);

  function tagLabel(tag: string) {
    if (lang !== 'es') return tag;
    if (tag === 'Sermon') return 'Predicaciones';
    if (tag === 'Event') return 'Eventos';
    if (tag === 'General') return 'General';
    return tag;
  }

  async function handleDelete(m: MediaRow) {
    if (!m.url) return;
    setDeleting(m.id);
    try {
      // Safety check: is this image used by any event or sermon right now?
      const [ev, se] = await Promise.all([
        supabase.from('events').select('id', { count: 'exact', head: true }).eq('flyer_url', m.url),
        supabase.from('sermons').select('id', { count: 'exact', head: true }).eq('cover_url', m.url),
      ]);
      const evCount = ev.count ?? 0;
      const seCount = se.count ?? 0;
      const inUse = evCount + seCount;

      let ok: boolean;
      if (inUse > 0) {
        const parts: string[] = [];
        if (evCount > 0) parts.push(lang === 'es' ? `${evCount} evento(s)` : `${evCount} event(s)`);
        if (seCount > 0) parts.push(lang === 'es' ? `${seCount} predicación(es)` : `${seCount} sermon(s)`);
        const usedBy = parts.join(lang === 'es' ? ' y ' : ' and ');
        ok = window.confirm(
          lang === 'es'
            ? `ADVERTENCIA: Esta imagen la usa ${usedBy}. Si la eliminas, esos elementos se quedarán SIN imagen (se verán en blanco). ¿Eliminar de todas formas?`
            : `WARNING: This image is used by ${usedBy}. Deleting it will leave those items WITHOUT an image (they'll show blank). Delete anyway?`
        );
      } else {
        ok = window.confirm(
          lang === 'es'
            ? `¿Eliminar "${m.name}"? No se usa en ningún evento ni predicación.`
            : `Delete "${m.name}"? It isn't used by any event or sermon.`
        );
      }
      if (!ok) { setDeleting(null); return; }

      // Remove the actual file from its OWN bucket, then the library record.
      // Covers and flyers live outside the 'media' bucket, so never hardcode it.
      if (m.path) {
        const bucket = m.bucket || 'media';
        const rm = await supabase.storage.from(bucket).remove([m.path]);
        if (rm.error) { push(rm.error.message, 'err'); setDeleting(null); return; }
      }
      const { error } = await supabase.from('media').delete().eq('id', m.id);
      if (error) { push(error.message, 'err'); setDeleting(null); return; }
      push(lang === 'es' ? 'Imagen eliminada' : 'Image deleted', 'ok');
      load();
    } catch (err: any) {
      push(err?.message || 'Delete failed', 'err');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <>
      <div className="view-head">
        <div>
          <span className="eyebrow">{lang === 'es' ? 'Fotos y flyers' : 'Photos and flyers'}</span>
          <div className="sec-title">{lang === 'es' ? 'Biblioteca de medios' : 'Media library'}</div>
        </div>
        <div className="vh-actions">
          <label className="btn accent" style={{ cursor: 'pointer' }}>
            {uploading ? <span className="spin" style={{ width: 15, height: 15 }} /> : <Icon name="upload" size={15} stroke={2} />}
            {lang === 'es' ? 'Subir' : 'Upload'}
            <input type="file" accept="image/*" hidden onChange={onFile} disabled={uploading} />
          </label>
        </div>
      </div>

      {rows && rows.length > 0 && tags.length > 1 && (
        <div className="vh-actions" style={{ marginBottom: '.75rem', flexWrap: 'wrap', gap: '.4rem' }}>
          <button
            className={`chip${filter === 'all' ? ' gold' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => setFilter('all')}
          >
            {lang === 'es' ? 'Todo' : 'All'} ({rows.length})
          </button>
          {tags.map(tg => (
            <button
              key={tg}
              className={`chip${filter === tg ? ' gold' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setFilter(tg)}
            >
              {tagLabel(tg)} ({rows.filter(r => (r.tag || 'General') === tg).length})
            </button>
          ))}
        </div>
      )}

      {!rows ? <div className="center-load"><div className="spin" /></div>
        : rows.length === 0 ? <Empty icon="media" title={lang === 'es' ? 'Sin archivos' : 'No files'} sub={lang === 'es' ? 'Sube fotos y flyers para usarlos en el sitio.' : 'Upload photos and flyers to use on the site.'} />
        : <div className="grid g4">
          {visible.map(m => (
            <div key={m.id} className="card media-item">
              <div className="media-thumb" style={{ backgroundImage: m.url ? `url('${m.url}')` : 'none' }}>
                {m.tag && <span className="chip gold" style={{ position: 'absolute', top: '.5rem', left: '.5rem' }}>{m.tag}</span>}
                <button
                  className="media-del"
                  onClick={() => handleDelete(m)}
                  disabled={deleting === m.id}
                  title={lang === 'es' ? 'Eliminar' : 'Delete'}
                  aria-label={lang === 'es' ? 'Eliminar' : 'Delete'}
                >
                  {deleting === m.id ? <span className="spin" style={{ width: 13, height: 13 }} /> : <Icon name="trash" size={14} />}
                </button>
              </div>
              <div className="media-info">
                <div className="mn">{m.name}</div>
                <div className="ms">{fmtSize(m.size_bytes)}</div>
              </div>
            </div>
          ))}
        </div>}
    </>
  );
}
