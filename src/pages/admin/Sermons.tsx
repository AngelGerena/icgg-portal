import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { registerMedia } from '../../lib/mediaLibrary';
import { useLang } from '../../lib/providers';
import { useToast, Modal } from '../../components/UI';
import { useT, pick } from '../../lib/i18n';
import { Icon } from '../../components/Icon';
import type { SermonRow } from '../../lib/types';
import { MediaPicker } from '../../components/MediaPicker';

export function Sermons() {
  const { lang } = useLang();
  const t = useT();
  const { push } = useToast();
  const [rows, setRows] = useState<SermonRow[] | null>(null);
  const [editing, setEditing] = useState<SermonRow | 'new' | null>(null);

  async function load() {
    const { data } = await supabase.from('sermons').select('*').order('preached_on', { ascending: false, nullsFirst: false });
    setRows((data as SermonRow[]) ?? []);
  }
  useEffect(() => { load(); }, []);

  function fmtDate(d: string | null) {
    if (!d) return '';
    return new Intl.DateTimeFormat(lang === 'es' ? 'es' : 'en', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d + 'T00:00'));
  }

  return (
    <>
      <div className="view-head">
        <div>
          <span className="eyebrow">{lang === 'es' ? 'Archivo' : 'Archive'}</span>
          <div className="sec-title">{lang === 'es' ? 'Predicaciones' : 'Sermons'}</div>
        </div>
        <div className="vh-actions">
          <button className="btn accent" onClick={() => setEditing('new')}><Icon name="plus" size={15} stroke={2} />{lang === 'es' ? 'Añadir' : 'Add'}</button>
        </div>
      </div>

      {!rows ? <div className="center-load"><div className="spin" /></div>
        : <div className="card">
          <table>
            <thead><tr>
              <th>{lang === 'es' ? 'Título' : 'Title'}</th>
              <th>{lang === 'es' ? 'Serie' : 'Series'}</th>
              <th>{lang === 'es' ? 'Versículo' : 'Verse'}</th>
              <th>{lang === 'es' ? 'Fecha' : 'Date'}</th>
              <th></th>
            </tr></thead>
            <tbody>
              {rows.map(s => (
                <tr key={s.id} className="rowlink" onClick={() => setEditing(s)}>
                  <td><b>{pick(s, 'title', lang as any)}</b><div className="muted" style={{ fontSize: '.72rem' }}>{s.minutes ? `${s.minutes} min · ` : ''}{s.speaker}</div></td>
                  <td>{s.series}</td>
                  <td style={{ fontStyle: 'italic', color: 'var(--accent-deep)' }}>{s.verse}</td>
                  <td>{fmtDate(s.preached_on)}</td>
                  <td><span className={`chip ${s.status === 'published' ? 'ok' : 'warn'}`}><span className="dot" />{s.status === 'published' ? t('published') : t('draft')}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}

      {editing && <SermonEditor row={editing} lang={lang} t={t}
        onClose={() => setEditing(null)}
        onSaved={(msg) => { setEditing(null); push(msg, 'ok'); load(); }}
        onNotify={(msg, kind) => push(msg, kind ?? 'err')} />}
    </>
  );
}

function SermonEditor({ row, lang, t, onClose, onSaved, onNotify }: {
  row: SermonRow | 'new'; lang: string; t: (k: string) => string; onClose: () => void;
  onSaved: (m: string) => void;
  onNotify: (m: string, kind?: 'ok' | 'err') => void;
}) {
  const isNew = row === 'new';
  const s = isNew ? null : row;
  const [f, setF] = useState({
    title_es: s?.title_es ?? '', title_en: s?.title_en ?? '', series: s?.series ?? '',
    verse: s?.verse ?? '', speaker: s?.speaker ?? 'Pastora Irene Familia',
    preached_on: s?.preached_on ?? '', minutes: s?.minutes ?? '', video_url: s?.video_url ?? '',
    cover_url: s?.cover_url ?? '',
  });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pickLibrary, setPickLibrary] = useState(false);
  const set = (k: string, v: any) => setF(p => ({ ...p, [k]: v }));

  async function uploadCover(file: File) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onNotify(lang === 'es' ? 'El archivo debe ser una imagen' : 'File must be an image');
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `cover-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('sermon-covers')
        .upload(path, file, { cacheControl: '3600', upsert: true });
      if (upErr) {
        // Surface the real reason instead of failing silently
        onNotify((lang === 'es' ? 'Error al subir la portada: ' : 'Cover upload error: ') + upErr.message);
        return;
      }
      const { data } = supabase.storage.from('sermon-covers').getPublicUrl(path);
      set('cover_url', data.publicUrl);

      // Register in the shared Media Library so this cover is reusable later.
      // Non-fatal by design: the cover is already uploaded and set on the form.
      await registerMedia({
        bucket: 'sermon-covers',
        path,
        url: data.publicUrl,
        name: file.name,
        sizeBytes: file.size,
        tag: 'Sermon',
      });
    } catch (err: any) {
      onNotify(err?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setBusy(true);
    // Nothing is required. If the title is blank, give it a gentle placeholder
    // so it still appears in the list to finish later (the DB needs some label).
    const titleEs = f.title_es.trim() || (lang === 'es' ? 'Predicación sin título' : 'Untitled sermon');
    const payload = {
      ...f,
      title_es: titleEs,
      minutes: f.minutes ? Number(f.minutes) : null,
      preached_on: f.preached_on || null,
      status: 'published' as const,
    };
    const res = isNew
      ? await supabase.from('sermons').insert(payload)
      : await supabase.from('sermons').update(payload).eq('id', s!.id);
    setBusy(false);
    if (res.error) {
      // Surface the real reason instead of failing silently
      onNotify((lang === 'es' ? 'Error al guardar: ' : 'Save error: ') + res.error.message);
      return;
    }
    onSaved(lang === 'es' ? 'Predicación guardada' : 'Sermon saved');
  }

  return (
    <Modal onClose={onClose} eyebrow={isNew ? t('new') : t('edit')} title={lang === 'es' ? 'Predicación' : 'Sermon'}
      footer={<>
        <button className="btn ghost" onClick={onClose}>{t('cancel')}</button>
        <button className="btn accent" disabled={busy} onClick={save}>{busy ? <span className="spin" style={{ width: 14, height: 14 }} /> : t('save')}</button>
      </>}>
      <div className="field-row">
        <div><label>{lang === 'es' ? 'Título (ES)' : 'Title (ES)'}</label><input value={f.title_es} onChange={e => set('title_es', e.target.value)} /></div>
        <div><label>{lang === 'es' ? 'Título (EN)' : 'Title (EN)'}</label><input value={f.title_en} onChange={e => set('title_en', e.target.value)} /></div>
      </div>
      <div className="field-row">
        <div><label>{lang === 'es' ? 'Serie' : 'Series'}</label><input value={f.series} onChange={e => set('series', e.target.value)} /></div>
        <div><label>{lang === 'es' ? 'Versículo' : 'Verse'}</label><input value={f.verse} onChange={e => set('verse', e.target.value)} /></div>
      </div>
      <div className="field-row">
        <div><label>{lang === 'es' ? 'Fecha' : 'Date'}</label><input type="date" value={f.preached_on} onChange={e => set('preached_on', e.target.value)} /></div>
        <div><label>{lang === 'es' ? 'Duración (min)' : 'Length (min)'}</label><input value={f.minutes} onChange={e => set('minutes', e.target.value)} /></div>
      </div>
      <label>{lang === 'es' ? 'Enlace de video (Facebook/YouTube)' : 'Video link (Facebook/YouTube)'}</label>
      <input value={f.video_url} onChange={e => set('video_url', e.target.value)} placeholder="https://…" />

      <label style={{ marginTop: '1rem' }}>{lang === 'es' ? 'Imagen de portada' : 'Cover image'}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: 88, height: 88, flexShrink: 0, borderRadius: 10, overflow: 'hidden',
          background: 'rgba(20,38,75,.06)', border: '1px solid rgba(20,38,75,.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {f.cover_url
            ? <img src={f.cover_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <Icon name="media" size={22} />}
        </div>
        <div style={{ flex: 1 }}>
          <label className="btn ghost sm" style={{ cursor: 'pointer', display: 'inline-flex' }}>
            {uploading
              ? <span className="spin" style={{ width: 13, height: 13 }} />
              : (lang === 'es' ? 'Subir portada' : 'Upload cover')}
            <input type="file" accept="image/*" style={{ display: 'none' }}
              onChange={(e) => { const file = e.target.files?.[0]; if (file) uploadCover(file); }} />
          </label>
          <button type="button" className="btn ghost sm" style={{ marginLeft: '.5rem' }} onClick={() => setPickLibrary(true)}>
            <Icon name="media" size={13} />{lang === 'es' ? 'De la biblioteca' : 'From library'}
          </button>
          {pickLibrary && <MediaPicker onPick={(url) => { set('cover_url', url); setPickLibrary(false); }} onClose={() => setPickLibrary(false)} />}
          {f.cover_url && (
            <button type="button" className="btn ghost sm" style={{ marginLeft: '.5rem' }}
              onClick={() => set('cover_url', '')}>
              {lang === 'es' ? 'Quitar' : 'Remove'}
            </button>
          )}
          <div className="muted" style={{ fontSize: '.72rem', marginTop: '.4rem' }}>
            {lang === 'es'
              ? 'Cualquier forma de imagen funciona. Se mostrará tal como la subas.'
              : 'Any image shape works. It displays exactly as you upload it.'}
          </div>
        </div>
      </div>
    </Modal>
  );
}
