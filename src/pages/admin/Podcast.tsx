import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { registerMedia } from '../../lib/mediaLibrary';
import { useLang } from '../../lib/providers';
import { useToast, Modal, Empty } from '../../components/UI';
import { useT, pick } from '../../lib/i18n';
import { Icon } from '../../components/Icon';
import { MediaPicker } from '../../components/MediaPicker';
import { logActivity, trashRecord } from '../../lib/activity';
import type { EpisodeRow } from '../../lib/types';

export function Podcast() {
  const { lang } = useLang();
  const t = useT();
  const { push } = useToast();
  const [rows, setRows] = useState<EpisodeRow[] | null>(null);
  const [editing, setEditing] = useState<EpisodeRow | 'new' | null>(null);

  async function load() {
    const { data } = await supabase
      .from('podcast_episodes')
      .select('*')
      .order('published_on', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });
    setRows((data as EpisodeRow[]) ?? []);
  }
  useEffect(() => { load(); }, []);

  function fmtDate(d: string | null) {
    if (!d) return '';
    return new Intl.DateTimeFormat(lang === 'es' ? 'es' : 'en',
      { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d + 'T00:00'));
  }

  /** Next episode number, so the team does not have to remember where they left off. */
  const nextNo = (rows ?? []).reduce((m, r) => Math.max(m, r.episode_no ?? 0), 0) + 1;

  return (
    <>
      <div className="view-head">
        <div>
          <span className="eyebrow">{lang === 'es' ? 'Podcast' : 'Podcast'}</span>
          <div className="sec-title">{lang === 'es' ? 'Contra Corriente' : 'Against the Current'}</div>
        </div>
        <div className="vh-actions">
          <button className="btn accent" onClick={() => setEditing('new')}>
            <Icon name="plus" size={15} stroke={2} />{lang === 'es' ? 'Añadir episodio' : 'Add episode'}
          </button>
        </div>
      </div>

      {!rows ? <div className="center-load"><div className="spin" /></div>
        : rows.length === 0 ? (
          <Empty icon="sermons"
            title={lang === 'es' ? 'Sin episodios todavía' : 'No episodes yet'}
            sub={lang === 'es'
              ? 'Añade el primer episodio con su enlace de YouTube o Facebook y su portada.'
              : 'Add the first episode with its YouTube or Facebook link and cover art.'} />
        ) : (
          <div className="card">
            <table>
              <thead><tr>
                <th style={{ width: 46 }}>#</th>
                <th>{lang === 'es' ? 'Título' : 'Title'}</th>
                <th>{lang === 'es' ? 'Invitado' : 'Guest'}</th>
                <th>{lang === 'es' ? 'Fecha' : 'Date'}</th>
                <th></th>
              </tr></thead>
              <tbody>
                {rows.map(e => (
                  <tr key={e.id} className="rowlink" onClick={() => setEditing(e)}>
                    <td className="muted">{e.episode_no ?? '—'}</td>
                    <td>
                      <b>{pick(e, 'title', lang as any)}</b>
                      <div className="muted" style={{ fontSize: '.72rem' }}>
                        {e.minutes ? `${e.minutes} min · ` : ''}{e.host}
                        {!e.video_url && (
                          <span style={{ color: 'var(--danger)' }}>
                            {' · '}{lang === 'es' ? 'sin video' : 'no video'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{e.guest}</td>
                    <td>{fmtDate(e.published_on)}</td>
                    <td>
                      <span className={`chip ${e.status === 'published' ? 'ok' : 'warn'}`}>
                        <span className="dot" />{e.status === 'published' ? t('published') : t('draft')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      {editing !== null && (
        <EpisodeEditor
          row={editing}
          nextNo={nextNo}
          lang={lang}
          onClose={() => setEditing(null)}
          onSaved={(m) => { setEditing(null); push(m, 'ok'); load(); }}
          onNotify={(m, kind) => push(m, kind ?? 'err')}
          onDeleted={(m) => { setEditing(null); push(m, 'ok'); load(); }}
        />
      )}
    </>
  );
}

function EpisodeEditor({ row, nextNo, lang, onClose, onSaved, onNotify, onDeleted }: {
  row: EpisodeRow | 'new';
  nextNo: number;
  lang: string;
  onClose: () => void;
  onSaved: (m: string) => void;
  onNotify: (m: string, kind?: 'ok' | 'err') => void;
  onDeleted: (m: string) => void;
}) {
  const isNew = row === 'new';
  const e = isNew ? null : row;

  const [f, setF] = useState({
    episode_no: e?.episode_no != null ? String(e.episode_no) : (isNew ? String(nextNo) : ''),
    title_es: e?.title_es ?? '', title_en: e?.title_en ?? '',
    description_es: e?.description_es ?? '', description_en: e?.description_en ?? '',
    guest: e?.guest ?? '',
    host: e?.host ?? 'Pastora Irene Familia',
    published_on: e?.published_on ?? '',
    minutes: e?.minutes != null ? String(e.minutes) : '',
    video_url: e?.video_url ?? '',
    cover_url: e?.cover_url ?? '',
    status: e?.status ?? 'published',
  });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [picking, setPicking] = useState(false);

  const set = (k: string, v: any) => setF(p => ({ ...p, [k]: v }));

  /** Accepts anything pasted from YouTube or Facebook; warns on anything else. */
  const videoLooksValid = !f.video_url.trim() ||
    /youtu\.be|youtube\.com|facebook\.com|fb\.watch/.test(f.video_url);

  async function uploadCover(file: File) {
    if (!file.type.startsWith('image/')) {
      onNotify(lang === 'es' ? 'El archivo debe ser una imagen' : 'File must be an image');
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `ep-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('podcast-covers')
        .upload(path, file, { cacheControl: '3600', upsert: true });
      if (upErr) {
        onNotify((lang === 'es' ? 'Error al subir la portada: ' : 'Cover upload error: ') + upErr.message);
        return;
      }
      const { data } = supabase.storage.from('podcast-covers').getPublicUrl(path);
      set('cover_url', data.publicUrl);
      await registerMedia({
        bucket: 'podcast-covers', path, url: data.publicUrl,
        name: file.name, sizeBytes: file.size, tag: 'Podcast',
      });
    } catch (err: any) {
      onNotify(err?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setBusy(true);
    const payload = {
      episode_no: f.episode_no.trim() ? parseInt(f.episode_no, 10) : null,
      title_es: f.title_es.trim() || 'Episodio sin título',
      title_en: f.title_en.trim() || null,
      description_es: f.description_es.trim() || null,
      description_en: f.description_en.trim() || null,
      guest: f.guest.trim() || null,
      host: f.host.trim() || null,
      published_on: f.published_on || null,
      minutes: f.minutes.trim() ? parseInt(f.minutes, 10) : null,
      video_url: f.video_url.trim() || null,
      cover_url: f.cover_url || null,
      status: f.status,
    };

    const res = isNew
      ? await supabase.from('podcast_episodes').insert(payload)
      : await supabase.from('podcast_episodes').update(payload).eq('id', e!.id);
    setBusy(false);

    if (res.error) {
      onNotify((lang === 'es' ? 'Error al guardar: ' : 'Save error: ') + res.error.message);
      return;
    }
    await logActivity(
      isNew
        ? (lang === 'es' ? `Creó el episodio: ${payload.title_es}` : `Created episode: ${payload.title_es}`)
        : (lang === 'es' ? `Editó el episodio: ${payload.title_es}` : `Edited episode: ${payload.title_es}`),
      'Podcast', e?.id
    );
    onSaved(lang === 'es' ? 'Episodio guardado' : 'Episode saved');
  }

  async function remove() {
    if (!e) return;
    const ok = window.confirm(lang === 'es'
      ? `¿Eliminar "${e.title_es}"? Podrás restaurarlo desde el Registro de actividad.`
      : `Delete "${e.title_es}"? You can restore it from the Activity Log.`);
    if (!ok) return;
    setBusy(true);
    await trashRecord('podcast_episodes', e.id, e.title_es, e as any);
    const { error } = await supabase.from('podcast_episodes').delete().eq('id', e.id);
    setBusy(false);
    if (error) { onNotify(error.message); return; }
    await logActivity(lang === 'es' ? `Eliminó el episodio: ${e.title_es}` : `Deleted episode: ${e.title_es}`, 'Podcast', e.id);
    onDeleted(lang === 'es' ? 'Episodio eliminado' : 'Episode deleted');
  }

  return (
    <Modal onClose={onClose}
      eyebrow={isNew ? (lang === 'es' ? 'Nuevo' : 'New') : (lang === 'es' ? 'Editar' : 'Edit')}
      title={lang === 'es' ? 'Episodio' : 'Episode'}
      footer={
        <div style={{ display: 'flex', gap: '.5rem', width: '100%', flexWrap: 'wrap' }}>
          {!isNew && (
            <button className="btn danger sm" onClick={remove} disabled={busy}>
              <Icon name="trash" size={14} />
            </button>
          )}
          <button className="btn accent sm" style={{ marginLeft: 'auto' }} onClick={save} disabled={busy}>
            {busy ? <span className="spin" style={{ width: 14, height: 14 }} /> : <Icon name="check" size={14} stroke={2} />}
            {lang === 'es' ? 'Guardar' : 'Save'}
          </button>
        </div>
      }>

      <div className="grid g2">
        <div>
          <label>{lang === 'es' ? 'Número de episodio' : 'Episode number'}</label>
          <input type="number" inputMode="numeric" value={f.episode_no}
            onChange={ev => set('episode_no', ev.target.value)} placeholder={String(nextNo)} />
        </div>
        <div>
          <label>{lang === 'es' ? 'Fecha' : 'Date'}</label>
          <input type="date" value={f.published_on} onChange={ev => set('published_on', ev.target.value)} />
        </div>
      </div>

      <label>{lang === 'es' ? 'Título (Español)' : 'Title (Spanish)'}</label>
      <input value={f.title_es} onChange={ev => set('title_es', ev.target.value)}
        placeholder={lang === 'es' ? 'Se guardará como "Episodio sin título" si lo dejas vacío' : 'Saves as "Episodio sin título" if left blank'} />

      <label>{lang === 'es' ? 'Título (Inglés)' : 'Title (English)'}</label>
      <input value={f.title_en} onChange={ev => set('title_en', ev.target.value)} />

      <label>{lang === 'es' ? 'Enlace del video' : 'Video link'}</label>
      <input value={f.video_url} onChange={ev => set('video_url', ev.target.value)}
        placeholder="https://youtu.be/… · https://facebook.com/…" />
      {!videoLooksValid && (
        <p className="muted" style={{ fontSize: '.74rem', color: 'var(--danger)', marginTop: '.3rem' }}>
          {lang === 'es'
            ? 'Solo reconocemos enlaces de YouTube o Facebook. Otro enlace se abrirá en una pestaña nueva en vez de reproducirse aquí.'
            : 'Only YouTube or Facebook links are recognised. Anything else opens in a new tab instead of playing here.'}
        </p>
      )}

      <label>{lang === 'es' ? 'Descripción (Español)' : 'Description (Spanish)'}</label>
      <textarea rows={3} value={f.description_es} onChange={ev => set('description_es', ev.target.value)} />

      <label>{lang === 'es' ? 'Descripción (Inglés)' : 'Description (English)'}</label>
      <textarea rows={3} value={f.description_en} onChange={ev => set('description_en', ev.target.value)} />

      <div className="grid g2">
        <div>
          <label>{lang === 'es' ? 'Anfitrión' : 'Host'}</label>
          <input value={f.host} onChange={ev => set('host', ev.target.value)} />
        </div>
        <div>
          <label>{lang === 'es' ? 'Invitado' : 'Guest'}</label>
          <input value={f.guest} onChange={ev => set('guest', ev.target.value)} />
        </div>
      </div>

      <div className="grid g2">
        <div>
          <label>{lang === 'es' ? 'Duración (min)' : 'Length (min)'}</label>
          <input type="number" inputMode="numeric" value={f.minutes} onChange={ev => set('minutes', ev.target.value)} />
        </div>
        <div>
          <label>{lang === 'es' ? 'Estado' : 'Status'}</label>
          <select value={f.status} onChange={ev => set('status', ev.target.value)}>
            <option value="published">{lang === 'es' ? 'Publicado' : 'Published'}</option>
            <option value="draft">{lang === 'es' ? 'Borrador' : 'Draft'}</option>
          </select>
        </div>
      </div>

      <label>{lang === 'es' ? 'Portada' : 'Cover art'}</label>
      {f.cover_url && (
        <div className="blog-cover-prev" style={{ backgroundImage: `url('${f.cover_url}')` }} />
      )}
      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
        <label className="btn ghost sm" style={{ cursor: 'pointer' }}>
          {uploading ? <span className="spin" style={{ width: 14, height: 14 }} /> : <Icon name="upload" size={14} />}
          {lang === 'es' ? 'Subir' : 'Upload'}
          <input type="file" accept="image/*" hidden disabled={uploading}
            onChange={ev => { const file = ev.target.files?.[0]; if (file) uploadCover(file); ev.target.value = ''; }} />
        </label>
        <button className="btn ghost sm" onClick={() => setPicking(true)}>
          <Icon name="media" size={14} />{lang === 'es' ? 'Elegir de la biblioteca' : 'Choose from library'}
        </button>
        {f.cover_url && (
          <button className="btn ghost sm" onClick={() => set('cover_url', '')}>
            <Icon name="x" size={14} />{lang === 'es' ? 'Quitar' : 'Remove'}
          </button>
        )}
      </div>

      {picking && <MediaPicker onPick={(url) => { set('cover_url', url); setPicking(false); }} onClose={() => setPicking(false)} />}
    </Modal>
  );
}
