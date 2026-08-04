import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { registerMedia } from '../../lib/mediaLibrary';
import { useLang } from '../../lib/providers';
import { useT, pick } from '../../lib/i18n';
import { useToast, Modal, Empty } from '../../components/UI';
import { Icon } from '../../components/Icon';
import type { EventRow } from '../../lib/types';
import { logActivity, trashRecord } from '../../lib/activity';
import { MediaPicker } from '../../components/MediaPicker';

export function Events() {
  const { lang } = useLang();
  const t = useT();
  const { push } = useToast();
  const [rows, setRows] = useState<EventRow[] | null>(null);
  const [calMode, setCalMode] = useState(false);
  const [editing, setEditing] = useState<EventRow | 'new' | null>(null);
  const [sharing, setSharing] = useState<EventRow | null>(null);

  async function load() {
    const { data } = await supabase.from('events').select('*').order('date', { ascending: true, nullsFirst: false });
    setRows((data as EventRow[]) ?? []);
  }
  useEffect(() => { load(); }, []);

  async function handleDelete(ev: EventRow) {
    const title = pick(ev, 'title', lang as any) || (lang === 'es' ? 'este evento' : 'this event');
    const ok = window.confirm(
      lang === 'es'
        ? `¿Eliminar "${title}"? Podrás restaurarlo desde la papelera en el Registro de actividad.`
        : `Delete "${title}"? You can restore it from the trash in the Activity Log.`
    );
    if (!ok) return;
    // Keep a recoverable copy before deleting
    await trashRecord('events', ev.id, title, ev as any);
    const { error } = await supabase.from('events').delete().eq('id', ev.id);
    if (error) { push(error.message, 'err'); return; }
    await logActivity(
      lang === 'es' ? `Eliminó el evento: ${title}` : `Deleted event: ${title}`,
      'Events', ev.id
    );
    push(lang === 'es' ? 'Evento eliminado (recuperable)' : 'Event deleted (recoverable)', 'ok');
    load();
  }

  return (
    <>
      <div className="view-head">
        <div>
          <span className="eyebrow">{lang === 'es' ? 'Calendario compartible' : 'Shareable calendar'}</span>
          <div className="sec-title">{lang === 'es' ? 'Eventos del ministerio' : 'Ministry events'}</div>
        </div>
        <div className="vh-actions">
          <button className="btn ghost sm" onClick={() => setCalMode(m => !m)}>
            <Icon name="calendar" size={15} />{calMode ? (lang === 'es' ? 'Vista lista' : 'List view') : (lang === 'es' ? 'Vista calendario' : 'Calendar view')}
          </button>
          <button className="btn accent" onClick={() => setEditing('new')}><Icon name="plus" size={15} stroke={2} />{t('new')}</button>
        </div>
      </div>

      {!rows ? <div className="center-load"><div className="spin" /></div>
        : rows.length === 0 ? <Empty icon="events" title={t('empty.events')} sub={t('empty.events.sub')} />
        : calMode ? <CalendarView rows={rows} lang={lang} onPick={setEditing} />
        : <div className="grid g3">{rows.map(e => (
            <EventCard key={e.id} e={e} lang={lang} t={t} onEdit={() => setEditing(e)} onShare={() => setSharing(e)} onDelete={() => handleDelete(e)} />
          ))}</div>}

      {editing && <EventEditor row={editing} lang={lang} t={t}
        onClose={() => setEditing(null)}
        onSaved={(msg) => { setEditing(null); push(msg, 'ok'); load(); }}
        onNotify={(msg, kind) => push(msg, kind ?? 'err')} />}

      {sharing && <ShareSheet e={sharing} lang={lang} t={t} onClose={() => setSharing(null)} push={push} />}
    </>
  );
}

function fmtDate(d: string | null, lang: string) {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  const mo = (lang === 'es'
    ? ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])[+m - 1];
  return `${+day} ${mo} ${y}`;
}

function EventCard({ e, lang, t, onEdit, onShare, onDelete }: { e: EventRow; lang: string; t: (k: string) => string; onEdit: () => void; onShare: () => void; onDelete: () => void }) {
  const title = pick(e, 'title', lang as any);
  const desc = lang === 'en' ? (e.description_en ?? e.description) : e.description;
  const flyer = e.flyer_url || 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=600&q=80&auto=format&fit=crop';
  return (
    <div className="card ev-card">
      <div className="ev-flyer" style={{ backgroundImage: `url('${flyer}')` }}>
        <div className="ev-badges">
          {e.featured ? <span className="chip gold">{t('featured')}</span> : <span />}
          <span className={`chip ${e.status === 'published' ? 'ok' : 'warn'}`}><span className="dot" />{e.status === 'published' ? t('live') : t('draft')}</span>
        </div>
        <div className="ev-meta"><h4>{title}</h4><div className="ed">{fmtDate(e.date, lang)}{e.time_start ? ` · ${e.time_start.slice(0, 5)}` : ''}</div></div>
      </div>
      <div className="ev-body">
        {desc && <p>{desc}</p>}
        <div className="ev-actions">
          <button className="btn accent sm" onClick={onShare}><Icon name="share" size={14} />{t('share')}</button>
          <button className="btn ghost sm" onClick={onEdit}><Icon name="edit" size={14} />{t('edit')}</button>
          <button
            className="btn ghost sm ev-delete"
            onClick={onDelete}
            title={lang === 'es' ? 'Eliminar evento' : 'Delete event'}
            aria-label={lang === 'es' ? 'Eliminar evento' : 'Delete event'}
          >
            <Icon name="trash" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function CalendarView({ rows, lang, onPick }: { rows: EventRow[]; lang: string; onPick: (e: EventRow) => void }) {
  const now = new Date();
  const year = now.getFullYear(), month = now.getMonth();
  const first = new Date(year, month, 1).getDay();
  const offset = first === 0 ? 6 : first - 1; // Monday-first
  const days = new Date(year, month + 1, 0).getDate();
  const byDay: Record<number, EventRow> = {};
  rows.forEach(e => { if (e.date) { const d = new Date(e.date + 'T00:00'); if (d.getMonth() === month && d.getFullYear() === year) byDay[d.getDate()] = e; } });
  const dow = lang === 'es' ? ['L', 'M', 'X', 'J', 'V', 'S', 'D'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const monthName = new Intl.DateTimeFormat(lang === 'es' ? 'es' : 'en', { month: 'long', year: 'numeric' }).format(now);
  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(<div key={'b' + i} className="cal-cell blank" />);
  for (let d = 1; d <= days; d++) {
    const ev = byDay[d];
    cells.push(
      <div key={d} className={`cal-cell ${ev ? 'has' : ''}`} onClick={() => ev && onPick(ev)}>
        <span className="cal-num">{d}</span>
        {ev && <span className="cal-ev">{pick(ev, 'title', lang as any)}</span>}
      </div>
    );
  }
  return (
    <>
      <div className="eyebrow" style={{ marginBottom: '.8rem', textTransform: 'capitalize' }}>{monthName}</div>
      <div className="cal">
        <div className="cal-head">{dow.map((d, i) => <div key={i}>{d}</div>)}</div>
        <div className="cal-body">{cells}</div>
      </div>
    </>
  );
}

function EventEditor({ row, lang, t, onClose, onSaved, onNotify }: {
  row: EventRow | 'new'; lang: string; t: (k: string) => string;
  onClose: () => void; onSaved: (msg: string) => void;
  onNotify: (msg: string, kind?: 'ok' | 'err') => void;
}) {
  const isNew = row === 'new';
  const e = isNew ? null : row;
  const [f, setF] = useState({
    title_es: e?.title_es ?? '', title_en: e?.title_en ?? '',
    date: e?.date ?? '', time_start: e?.time_start?.slice(0, 5) ?? '',
    location: e?.location ?? '2560 S. Elm Ave. Sanford, FL 32773',
    description: e?.description ?? '', description_en: e?.description_en ?? '',
    flyer_url: e?.flyer_url ?? '', featured: e?.featured ?? false,
  });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pickLibrary, setPickLibrary] = useState(false);
  const set = (k: string, v: any) => setF(p => ({ ...p, [k]: v }));

  async function uploadFlyer(file: File) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onNotify(lang === 'es' ? 'El archivo debe ser una imagen' : 'File must be an image');
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `flyers/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('event-flyers')
        .upload(path, file, { cacheControl: '3600', upsert: false });
      if (upErr) { onNotify(upErr.message); setUploading(false); return; }
      const { data } = supabase.storage.from('event-flyers').getPublicUrl(path);
      set('flyer_url', data.publicUrl);

      // Register in the shared Media Library so this flyer is reusable later.
      // Non-fatal by design: the flyer is already uploaded and set on the form.
      await registerMedia({
        bucket: 'event-flyers',
        path,
        url: data.publicUrl,
        name: file.name,
        sizeBytes: file.size,
        tag: 'Event',
      });
    } catch (err: any) {
      onNotify(err?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function save(status: 'draft' | 'published') {
    if (!f.title_es.trim()) { return; }
    setBusy(true);
    const payload = { ...f, status, is_active: status === 'published', time_start: f.time_start || null, date: f.date || null };
    const res = isNew
      ? await supabase.from('events').insert(payload)
      : await supabase.from('events').update(payload).eq('id', e!.id);
    setBusy(false);
    if (res.error) { onNotify(res.error.message); return; }
    const title = f.title_es || 'evento';
    await logActivity(
      isNew
        ? (lang === 'es' ? `Creó el evento: ${title} (${status === 'published' ? 'publicado' : 'borrador'})` : `Created event: ${title} (${status})`)
        : (lang === 'es' ? `Editó el evento: ${title} (${status === 'published' ? 'publicado' : 'borrador'})` : `Edited event: ${title} (${status})`),
      'Events', e?.id
    );
    onSaved(status === 'published'
      ? (lang === 'es' ? 'Evento publicado' : 'Event published')
      : (lang === 'es' ? 'Borrador guardado' : 'Draft saved'));
  }

  return (
    <Modal wide onClose={onClose}
      eyebrow={isNew ? t('new') : t('edit')}
      title={isNew ? (lang === 'es' ? 'Crear evento' : 'Create event') : pick(e!, 'title', lang as any)}
      footer={<>
        <button className="btn ghost" onClick={onClose}>{t('cancel')}</button>
        <button className="btn ghost" disabled={busy} onClick={() => save('draft')}>{lang === 'es' ? 'Guardar borrador' : 'Save draft'}</button>
        <button className="btn accent" disabled={busy} onClick={() => save('published')}>{busy ? <span className="spin" style={{ width: 14, height: 14 }} /> : t('publish')}</button>
      </>}>
      <label>{lang === 'es' ? 'Flyer del evento' : 'Event flyer'}</label>
      <label
        className="ev-uploadzone"
        onDragOver={ev => { ev.preventDefault(); }}
        onDrop={ev => { ev.preventDefault(); const file = ev.dataTransfer.files?.[0]; if (file) uploadFlyer(file); }}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '.4rem', padding: '1.4rem', border: '2px dashed var(--line, #cbb98f)', borderRadius: 12,
          cursor: 'pointer', textAlign: 'center', background: 'rgba(201,169,97,0.06)', marginBottom: '.6rem'
        }}
      >
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={ev => { const file = ev.target.files?.[0]; if (file) uploadFlyer(file); }}
        />
        {uploading
          ? <span className="spin" style={{ width: 18, height: 18 }} />
          : <>
              <Icon name="upload" size={22} />
              <strong style={{ fontSize: '.9rem' }}>
                {lang === 'es' ? 'Arrastra o haz clic para subir el flyer' : 'Drag or click to upload flyer'}
              </strong>
              <span style={{ fontSize: '.75rem', opacity: .7 }}>
                {lang === 'es' ? 'JPG, PNG o WEBP' : 'JPG, PNG or WEBP'}
              </span>
            </>}
      </label>

      <label style={{ fontSize: '.8rem', opacity: .7 }}>{lang === 'es' ? 'O pega una URL' : 'Or paste a URL'}</label>
      <input value={f.flyer_url} onChange={ev => set('flyer_url', ev.target.value)} placeholder="https://…" />
      <button type="button" className="btn ghost sm" style={{ marginTop: '.5rem' }} onClick={() => setPickLibrary(true)}>
        <Icon name="media" size={14} />{lang === 'es' ? 'Elegir de la biblioteca' : 'Choose from library'}
      </button>
      {f.flyer_url && <div style={{ marginTop: '.6rem', aspectRatio: '16/9', borderRadius: 10, backgroundImage: `url('${f.flyer_url}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />}
      {pickLibrary && <MediaPicker onPick={(url) => { set('flyer_url', url); setPickLibrary(false); }} onClose={() => setPickLibrary(false)} />}

      <div className="field-row">
        <div><label>{lang === 'es' ? 'Título (ES)' : 'Title (ES)'}</label><input value={f.title_es} onChange={ev => set('title_es', ev.target.value)} /></div>
        <div><label>{lang === 'es' ? 'Título (EN)' : 'Title (EN)'}</label><input value={f.title_en} onChange={ev => set('title_en', ev.target.value)} /></div>
      </div>
      <div className="field-row">
        <div><label>{lang === 'es' ? 'Fecha' : 'Date'}</label><input type="date" value={f.date} onChange={ev => set('date', ev.target.value)} /></div>
        <div><label>{lang === 'es' ? 'Hora' : 'Time'}</label><input type="time" value={f.time_start} onChange={ev => set('time_start', ev.target.value)} /></div>
      </div>
      <label>{lang === 'es' ? 'Lugar' : 'Location'}</label>
      <input value={f.location} onChange={ev => set('location', ev.target.value)} />
      <label>{lang === 'es' ? 'Descripción (ES)' : 'Description (ES)'}</label>
      <textarea value={f.description} onChange={ev => set('description', ev.target.value)} />
      <label>{lang === 'es' ? 'Descripción (EN)' : 'Description (EN)'}</label>
      <textarea value={f.description_en} onChange={ev => set('description_en', ev.target.value)} />
      <label style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginTop: '1rem', cursor: 'pointer' }}>
        <input type="checkbox" style={{ width: 'auto' }} checked={f.featured} onChange={ev => set('featured', ev.target.checked)} />
        {lang === 'es' ? 'Destacar en la página principal' : 'Feature on the homepage'}
      </label>
    </Modal>
  );
}

function ShareSheet({ e, lang, t, onClose, push }: { e: EventRow; lang: string; t: (k: string) => string; onClose: () => void; push: (m: string, k?: any) => void }) {
  const title = pick(e, 'title', lang as any);
  const desc = lang === 'en' ? (e.description_en ?? e.description ?? '') : (e.description ?? '');
  const dateStr = fmtDate(e.date, lang) + (e.time_start ? ` · ${e.time_start.slice(0, 5)}` : '');
  const [text, setText] = useState(`${title}\n${dateStr}\n${e.location ?? ''}\n\n${desc}\n\nICGG · icgg.us`);

  const flyer = e.flyer_url || 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=600&q=80&auto=format&fit=crop';
  const encoded = encodeURIComponent(text);
  const url = 'https://icgg.us';
  const links: Record<string, string> = {
    WhatsApp: `https://wa.me/?text=${encoded}`,
    Facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encoded}`,
    Instagram: '',
    SMS: `sms:?body=${encoded}`,
  };

  function share(app: string) {
    if (app === 'Instagram') { copy(); push(lang === 'es' ? 'Texto copiado — pégalo en Instagram' : 'Text copied — paste in Instagram', 'ok'); return; }
    window.open(links[app], '_blank');
  }
  function copy() { navigator.clipboard?.writeText(text); push(lang === 'es' ? 'Copiado al portapapeles' : 'Copied to clipboard', 'ok'); }

  return (
    <Modal onClose={onClose} eyebrow={lang === 'es' ? 'Compartir evento' : 'Share event'} title={title}>
      <div className="card ev-card" style={{ marginBottom: '1.2rem' }}>
        <div className="ev-flyer" style={{ backgroundImage: `url('${flyer}')` }}>
          <div className="ev-meta"><h4>{title}</h4><div className="ed">{dateStr}</div></div>
        </div>
      </div>
      <label>{lang === 'es' ? 'Texto para compartir' : 'Share text'}</label>
      <textarea value={text} onChange={ev => setText(ev.target.value)} style={{ minHeight: 120 }} />
      <label>{lang === 'es' ? 'Compartir en' : 'Share on'}</label>
      <div className="share-grid">
        <ShareBtn icon="whatsapp" label="WhatsApp" color="#25D366" onClick={() => share('WhatsApp')} />
        <ShareBtn icon="facebook" label="Facebook" color="#1877F2" onClick={() => share('Facebook')} />
        <ShareBtn icon="instagram" label="Instagram" color="#C13584" onClick={() => share('Instagram')} />
        <ShareBtn icon="mail" label="SMS" color="var(--brand)" onClick={() => share('SMS')} />
      </div>
      <button className="btn ghost block" style={{ marginTop: '1rem' }} onClick={copy}>
        <Icon name="copy" size={15} />{lang === 'es' ? 'Copiar texto y enlace' : 'Copy text and link'}
      </button>
    </Modal>
  );
}

function ShareBtn({ icon, label, color, onClick }: { icon: string; label: string; color: string; onClick: () => void }) {
  return (
    <button className="share-btn" onClick={onClick}>
      <span className="si" style={{ background: color }}><Icon name={icon} size={19} /></span>
      <span className="sl">{label}</span>
    </button>
  );
}
