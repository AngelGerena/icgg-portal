import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLang } from '../../lib/providers';
import { useToast, Modal, Empty } from '../../components/UI';
import { Icon } from '../../components/Icon';
import { MediaPicker } from '../../components/MediaPicker';
import { registerMedia } from '../../lib/mediaLibrary';
import { logActivity, trashRecord } from '../../lib/activity';
import { renderMarkdown, readingMinutes, stripMarkdown, slugify } from '../../lib/markdown';
import type { BlogPostRow } from '../../lib/types';

const TONES = ['Pastoral', 'Devocional', 'Enseñanza', 'Testimonio', 'Aliento'] as const;
const LENGTHS = [
  { key: 'short', es: 'Corta (~400)', en: 'Short (~400)' },
  { key: 'medium', es: 'Media (~800)', en: 'Medium (~800)' },
  { key: 'long', es: 'Larga (~1200)', en: 'Long (~1200)' },
] as const;

export function BlogStudio() {
  const { lang } = useLang();
  const { push } = useToast();
  const [rows, setRows] = useState<BlogPostRow[] | null>(null);
  const [editing, setEditing] = useState<BlogPostRow | 'new' | null>(null);
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [prefill, setPrefill] = useState<Partial<BlogPostRow> | null>(null);
  const [filter, setFilter] = useState<'all' | 'draft' | 'scheduled' | 'published'>('all');

  async function load() {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    setRows((data as BlogPostRow[]) ?? []);
  }
  useEffect(() => { load(); }, []);

  const visible = (rows ?? []).filter(r => filter === 'all' || r.status === filter);

  async function remove(p: BlogPostRow) {
    const ok = window.confirm(lang === 'es'
      ? `¿Eliminar "${p.title_es}"? Podrás restaurarla desde el Registro de actividad.`
      : `Delete "${p.title_es}"? You can restore it from the Activity Log.`);
    if (!ok) return;
    // Keep a restorable copy before the row goes away.
    await trashRecord('blog_posts', p.id, p.title_es, p as any);
    const { error } = await supabase.from('blog_posts').delete().eq('id', p.id);
    if (error) { push(error.message, 'err'); return; }
    await logActivity(lang === 'es' ? `Eliminó la entrada: ${p.title_es}` : `Deleted post: ${p.title_es}`, 'Blog', p.id);
    push(lang === 'es' ? 'Entrada eliminada' : 'Post deleted', 'ok');
    load();
  }

  const statusChip = (s: string) => {
    if (s === 'published') return <span className="chip ok"><span className="dot" />{lang === 'es' ? 'Publicada' : 'Published'}</span>;
    if (s === 'scheduled') return <span className="chip gold"><span className="dot" />{lang === 'es' ? 'Programada' : 'Scheduled'}</span>;
    return <span className="chip info"><span className="dot" />{lang === 'es' ? 'Borrador' : 'Draft'}</span>;
  };

  return (
    <>
      <div className="view-head">
        <div>
          <span className="eyebrow">{lang === 'es' ? 'Escritura con IA' : 'AI-assisted writing'}</span>
          <div className="sec-title">{lang === 'es' ? 'Contra Corriente' : 'Against the Current'}</div>
        </div>
        <div className="vh-actions">
          <button className="btn ghost" onClick={() => { setPrefill(null); setEditing('new'); }}>
            <Icon name="edit" size={15} stroke={2} />{lang === 'es' ? 'Escribir yo' : 'Write it myself'}
          </button>
          <button className="btn accent" onClick={() => setGeneratorOpen(true)}>
            <Icon name="sparkle" size={15} stroke={2} />{lang === 'es' ? 'Escribir con IA' : 'Write with AI'}
          </button>
        </div>
      </div>

      {rows && rows.length > 0 && (
        <div className="vh-actions" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '.4rem' }}>
          {(['all', 'draft', 'scheduled', 'published'] as const).map(f => (
            <button key={f} className={`chip${filter === f ? ' gold' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setFilter(f)}>
              {f === 'all' ? (lang === 'es' ? 'Todas' : 'All')
                : f === 'draft' ? (lang === 'es' ? 'Borradores' : 'Drafts')
                : f === 'scheduled' ? (lang === 'es' ? 'Programadas' : 'Scheduled')
                : (lang === 'es' ? 'Publicadas' : 'Published')}
              {' '}({f === 'all' ? rows.length : rows.filter(r => r.status === f).length})
            </button>
          ))}
        </div>
      )}

      {!rows ? <div className="center-load"><div className="spin" /></div>
        : visible.length === 0 ? (
          <Empty
            icon="sparkle"
            title={lang === 'es' ? 'Sin entradas todavía' : 'No posts yet'}
            sub={lang === 'es'
              ? 'Dale a la IA un versículo y unas palabras clave, y escribirá el primer borrador en español e inglés.'
              : 'Give the AI a verse and a few keywords, and it will write the first draft in Spanish and English.'}
          />
        ) : (
          <div className="grid" style={{ gap: '.8rem' }}>
            {visible.map(p => (
              <div key={p.id} className="card card-p blog-row">
                {p.cover_url && <div className="blog-row-thumb" style={{ backgroundImage: `url('${p.cover_url}')` }} />}
                <div className="blog-row-main">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', flexWrap: 'wrap' }}>
                    <b style={{ fontSize: '.95rem' }}>{p.title_es}</b>
                    {statusChip(p.status)}
                  </div>
                  {p.scripture_ref && <div className="muted" style={{ fontSize: '.75rem', marginTop: '.25rem' }}>{p.scripture_ref}</div>}
                  <p className="muted" style={{ fontSize: '.8rem', lineHeight: 1.5, marginTop: '.4rem' }}>
                    {p.excerpt_es || stripMarkdown(p.body_es, 140)}
                  </p>
                  <div className="muted" style={{ fontSize: '.72rem', marginTop: '.5rem' }}>
                    /blog/{p.slug}
                    {p.reading_minutes ? ` · ${p.reading_minutes} min` : ''}
                    {p.publish_at && p.status === 'scheduled' ? ` · ${new Date(p.publish_at).toLocaleString()}` : ''}
                  </div>
                </div>
                <div className="blog-row-actions">
                  <button className="btn ghost sm" onClick={() => { setPrefill(null); setEditing(p); }}>
                    <Icon name="edit" size={14} />{lang === 'es' ? 'Editar' : 'Edit'}
                  </button>
                  <button className="btn danger sm" onClick={() => remove(p)} aria-label={lang === 'es' ? 'Eliminar' : 'Delete'}>
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      {generatorOpen && (
        <GeneratorModal
          lang={lang}
          onClose={() => setGeneratorOpen(false)}
          onDraft={(draft) => { setGeneratorOpen(false); setPrefill(draft); setEditing('new'); }}
        />
      )}

      {editing !== null && (
        <PostEditor
          row={editing}
          prefill={prefill}
          lang={lang}
          onClose={() => { setEditing(null); setPrefill(null); }}
          onSaved={(m) => { setEditing(null); setPrefill(null); push(m, 'ok'); load(); }}
          onNotify={(m, kind) => push(m, kind ?? 'err')}
        />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */

function GeneratorModal({ lang, onClose, onDraft }: {
  lang: string;
  onClose: () => void;
  onDraft: (d: Partial<BlogPostRow>) => void;
}) {
  const [f, setF] = useState({
    scripture_ref: '', scripture_text: '', working_title: '',
    keywords: '', tone: 'Pastoral', length: 'medium', audience: '',
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const set = (k: string, v: string) => setF(p => ({ ...p, [k]: v }));

  async function generate() {
    setBusy(true); setErr(null);
    const facts = {
      scripture_ref: f.scripture_ref,
      scripture_text: f.scripture_text,
      working_title: f.working_title,
      keywords: f.keywords.split(',').map(s => s.trim()).filter(Boolean),
      tone: f.tone,
      length: f.length,
      audience: f.audience || 'Congregación general de una iglesia hispana en Sanford, Florida',
      church: 'Iglesia Cristiana Gracia y Gloria (ICGG), Sanford, Florida',
    };
    const { data, error } = await supabase.functions.invoke('generate-content', {
      body: { kind: 'blog_post', channel: 'blog', facts },
    });
    setBusy(false);
    if (error) { setErr(error.message); return; }
    if (data?.error) { setErr(data.error); return; }

    const r = data.result || {};
    onDraft({
      title_es: r.title_es || f.working_title || '',
      title_en: r.title_en || '',
      excerpt_es: r.excerpt_es || '',
      excerpt_en: r.excerpt_en || '',
      body_es: r.body_es || '',
      body_en: r.body_en || '',
      meta_title_es: r.meta_title_es || r.title_es || '',
      meta_title_en: r.meta_title_en || r.title_en || '',
      meta_description_es: r.meta_description_es || r.excerpt_es || '',
      meta_description_en: r.meta_description_en || r.excerpt_en || '',
      scripture_ref: f.scripture_ref || r.scripture_ref || '',
      scripture_text_es: f.scripture_text || r.scripture_text_es || '',
      scripture_text_en: r.scripture_text_en || '',
      keywords: facts.keywords,
    } as Partial<BlogPostRow>);
  }

  return (
    <Modal onClose={onClose}
      eyebrow={lang === 'es' ? 'Primer borrador' : 'First draft'}
      title={lang === 'es' ? 'Escribir con IA' : 'Write with AI'}>
      <label>{lang === 'es' ? 'Referencia bíblica' : 'Scripture reference'}</label>
      <input value={f.scripture_ref} onChange={e => set('scripture_ref', e.target.value)}
        placeholder={lang === 'es' ? 'Jeremías 29:11' : 'Jeremiah 29:11'} />

      <label>{lang === 'es' ? 'Texto del versículo (opcional pero recomendado)' : 'Verse text (optional but recommended)'}</label>
      <textarea rows={3} value={f.scripture_text} onChange={e => set('scripture_text', e.target.value)}
        placeholder={lang === 'es' ? 'Pega el versículo completo para que la IA lo cite con exactitud.' : 'Paste the full verse so the AI quotes it exactly.'} />

      <label>{lang === 'es' ? 'Título de trabajo (opcional)' : 'Working title (optional)'}</label>
      <input value={f.working_title} onChange={e => set('working_title', e.target.value)}
        placeholder={lang === 'es' ? 'Dios tiene un plan aun cuando no lo vemos' : 'God has a plan even when we cannot see it'} />

      <label>{lang === 'es' ? 'Palabras clave (separadas por comas)' : 'Keywords (comma separated)'}</label>
      <input value={f.keywords} onChange={e => set('keywords', e.target.value)}
        placeholder={lang === 'es' ? 'esperanza, propósito, espera, fe' : 'hope, purpose, waiting, faith'} />

      <div className="grid g2">
        <div>
          <label>{lang === 'es' ? 'Tono' : 'Tone'}</label>
          <select value={f.tone} onChange={e => set('tone', e.target.value)}>
            {TONES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label>{lang === 'es' ? 'Longitud' : 'Length'}</label>
          <select value={f.length} onChange={e => set('length', e.target.value)}>
            {LENGTHS.map(l => <option key={l.key} value={l.key}>{lang === 'es' ? l.es : l.en}</option>)}
          </select>
        </div>
      </div>

      <label>{lang === 'es' ? '¿Para quién es? (opcional)' : 'Who is it for? (optional)'}</label>
      <input value={f.audience} onChange={e => set('audience', e.target.value)}
        placeholder={lang === 'es' ? 'Padres jóvenes, personas en transición, nuevos creyentes…' : 'Young parents, people in transition, new believers…'} />

      {err && (
        <div className="notice" style={{ borderLeftColor: 'var(--danger)', marginTop: '1rem' }}>
          <Icon name="x" size={16} className="ic" />
          <div className="nt">{err}</div>
        </div>
      )}

      <div className="notice" style={{ marginTop: '1rem' }}>
        <Icon name="check" size={16} className="ic" />
        <div className="nt">
          {lang === 'es'
            ? 'La IA escribe el primer borrador en español e inglés. Siempre lo revisas y editas antes de publicar.'
            : 'The AI writes a first draft in Spanish and English. You always review and edit before publishing.'}
        </div>
      </div>

      <button className="btn accent block" style={{ marginTop: '1.1rem' }} onClick={generate} disabled={busy}>
        {busy
          ? <><span className="spin" style={{ width: 15, height: 15 }} />{lang === 'es' ? 'Escribiendo…' : 'Writing…'}</>
          : <><Icon name="sparkle" size={15} stroke={2} />{lang === 'es' ? 'Generar borrador' : 'Generate draft'}</>}
      </button>
      <p className="muted" style={{ fontSize: '.7rem', textAlign: 'center', marginTop: '.6rem' }}>
        {lang === 'es' ? 'Una entrada larga tarda unos segundos.' : 'A long post takes a few seconds.'}
      </p>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */

function PostEditor({ row, prefill, lang, onClose, onSaved, onNotify }: {
  row: BlogPostRow | 'new';
  prefill: Partial<BlogPostRow> | null;
  lang: string;
  onClose: () => void;
  onSaved: (m: string) => void;
  onNotify: (m: string, kind?: 'ok' | 'err') => void;
}) {
  const isNew = row === 'new';
  const p = isNew ? null : row;
  const base = (p ?? prefill ?? {}) as Partial<BlogPostRow>;

  const [f, setF] = useState({
    slug: base.slug ?? '',
    title_es: base.title_es ?? '', title_en: base.title_en ?? '',
    excerpt_es: base.excerpt_es ?? '', excerpt_en: base.excerpt_en ?? '',
    body_es: base.body_es ?? '', body_en: base.body_en ?? '',
    cover_url: base.cover_url ?? '',
    scripture_ref: base.scripture_ref ?? '',
    scripture_text_es: base.scripture_text_es ?? '', scripture_text_en: base.scripture_text_en ?? '',
    keywords: (base.keywords ?? []).join(', '),
    author: base.author ?? 'Iglesia Cristiana Gracia y Gloria',
    meta_title_es: base.meta_title_es ?? '', meta_title_en: base.meta_title_en ?? '',
    meta_description_es: base.meta_description_es ?? '', meta_description_en: base.meta_description_en ?? '',
    featured: base.featured ?? false,
    publish_at: base.publish_at ? String(base.publish_at).slice(0, 16) : '',
  });
  const [tab, setTab] = useState<'es' | 'en'>('es');
  const [preview, setPreview] = useState(false);
  const [seo, setSeo] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pickCover, setPickCover] = useState(false);
  const [pickInline, setPickInline] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);

  const set = (k: string, v: any) => setF(prev => ({ ...prev, [k]: v }));
  const bodyKey = tab === 'es' ? 'body_es' : 'body_en';
  const bodyVal = tab === 'es' ? f.body_es : f.body_en;

  // Slug follows the Spanish title until the post has been saved once.
  useEffect(() => {
    if (isNew && f.title_es) set('slug', slugify(f.title_es));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f.title_es]);

  /** Wrap or insert markdown at the cursor without losing the user's place. */
  function surround(before: string, after = '', placeholder = '') {
    const el = bodyRef.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const selected = bodyVal.slice(start, end) || placeholder;
    const next = bodyVal.slice(0, start) + before + selected + after + bodyVal.slice(end);
    set(bodyKey, next);
    requestAnimationFrame(() => {
      el.focus();
      const caret = start + before.length + selected.length;
      el.setSelectionRange(caret, caret);
    });
  }

  function insertImage(url: string, alt = '') {
    surround(`\n![${alt}](${url})\n`, '', '');
  }

  async function uploadImage(file: File, asCover: boolean) {
    if (!file.type.startsWith('image/')) {
      onNotify(lang === 'es' ? 'El archivo debe ser una imagen' : 'File must be an image');
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${asCover ? 'cover' : 'inline'}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('blog-images')
        .upload(path, file, { cacheControl: '3600', upsert: false });
      if (upErr) { onNotify((lang === 'es' ? 'Error al subir: ' : 'Upload error: ') + upErr.message); return; }

      const { data } = supabase.storage.from('blog-images').getPublicUrl(path);
      if (asCover) set('cover_url', data.publicUrl);
      else insertImage(data.publicUrl, file.name.replace(/\.[^.]+$/, ''));

      await registerMedia({
        bucket: 'blog-images', path, url: data.publicUrl,
        name: file.name, sizeBytes: file.size, tag: 'Blog',
      });
    } catch (err: any) {
      onNotify(err?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function save(status: 'draft' | 'scheduled' | 'published') {
    if (status === 'scheduled' && !f.publish_at) {
      onNotify(lang === 'es' ? 'Elige fecha y hora para programar.' : 'Pick a date and time to schedule.');
      return;
    }
    setBusy(true);

    const titleEs = f.title_es.trim() || (lang === 'es' ? 'Entrada sin título' : 'Untitled post');
    const slug = (f.slug.trim() || slugify(titleEs) || `entrada-${Date.now()}`);

    const payload: Record<string, any> = {
      slug,
      title_es: titleEs,
      title_en: f.title_en.trim() || null,
      excerpt_es: f.excerpt_es.trim() || stripMarkdown(f.body_es, 180) || null,
      excerpt_en: f.excerpt_en.trim() || stripMarkdown(f.body_en, 180) || null,
      body_es: f.body_es || null,
      body_en: f.body_en || null,
      cover_url: f.cover_url || null,
      scripture_ref: f.scripture_ref.trim() || null,
      scripture_text_es: f.scripture_text_es.trim() || null,
      scripture_text_en: f.scripture_text_en.trim() || null,
      keywords: f.keywords.split(',').map(s => s.trim()).filter(Boolean),
      author: f.author.trim() || null,
      meta_title_es: f.meta_title_es.trim() || titleEs,
      meta_title_en: f.meta_title_en.trim() || f.title_en.trim() || null,
      meta_description_es: f.meta_description_es.trim() || stripMarkdown(f.body_es, 160) || null,
      meta_description_en: f.meta_description_en.trim() || stripMarkdown(f.body_en, 160) || null,
      featured: f.featured,
      reading_minutes: readingMinutes(f.body_es, f.body_en),
      status,
      publish_at: status === 'scheduled' ? new Date(f.publish_at).toISOString() : null,
      published_at: status === 'published' ? (p?.published_at ?? new Date().toISOString()) : null,
    };

    const res = isNew
      ? await supabase.from('blog_posts').insert(payload)
      : await supabase.from('blog_posts').update(payload).eq('id', p!.id);
    setBusy(false);

    if (res.error) {
      const msg = res.error.message.includes('blog_posts_slug_key')
        ? (lang === 'es' ? 'Ya existe una entrada con esa URL. Cambia el slug.' : 'A post with that URL already exists. Change the slug.')
        : res.error.message;
      onNotify((lang === 'es' ? 'Error al guardar: ' : 'Save error: ') + msg);
      return;
    }

    await logActivity(
      isNew
        ? (lang === 'es' ? `Creó la entrada: ${titleEs} (${status})` : `Created post: ${titleEs} (${status})`)
        : (lang === 'es' ? `Editó la entrada: ${titleEs} (${status})` : `Edited post: ${titleEs} (${status})`),
      'Blog', p?.id
    );

    onSaved(
      status === 'published' ? (lang === 'es' ? 'Entrada publicada' : 'Post published')
        : status === 'scheduled' ? (lang === 'es' ? 'Entrada programada' : 'Post scheduled')
        : (lang === 'es' ? 'Borrador guardado' : 'Draft saved')
    );
  }

  const TB = [
    { icon: 'edit', label: 'H2', run: () => surround('\n## ', '', lang === 'es' ? 'Subtítulo' : 'Subheading') },
    { icon: 'edit', label: 'B', run: () => surround('**', '**', lang === 'es' ? 'negrita' : 'bold') },
    { icon: 'edit', label: 'i', run: () => surround('*', '*', lang === 'es' ? 'cursiva' : 'italic') },
    { icon: 'edit', label: '“', run: () => surround('\n> ', '', lang === 'es' ? 'Versículo o cita' : 'Verse or quote') },
    { icon: 'edit', label: '•', run: () => surround('\n- ', '', lang === 'es' ? 'punto' : 'item') },
    { icon: 'edit', label: '🔗', run: () => surround('[', '](https://)', lang === 'es' ? 'texto' : 'text') },
  ];

  return (
    <Modal wide onClose={onClose}
      eyebrow={isNew ? (lang === 'es' ? 'Nueva' : 'New') : (lang === 'es' ? 'Editar' : 'Edit')}
      title={lang === 'es' ? 'Entrada del blog' : 'Blog post'}
      footer={
        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', width: '100%' }}>
          <button className="btn ghost sm" onClick={() => save('draft')} disabled={busy}>
            {lang === 'es' ? 'Guardar borrador' : 'Save draft'}
          </button>
          <button className="btn ghost sm" onClick={() => save('scheduled')} disabled={busy}>
            <Icon name="clock" size={14} />{lang === 'es' ? 'Programar' : 'Schedule'}
          </button>
          <button className="btn accent sm" style={{ marginLeft: 'auto' }} onClick={() => save('published')} disabled={busy}>
            {busy ? <span className="spin" style={{ width: 14, height: 14 }} /> : <Icon name="check" size={14} stroke={2} />}
            {lang === 'es' ? 'Publicar' : 'Publish'}
          </button>
        </div>
      }>

      <div className="blog-tabs">
        <button className={`blog-tab ${tab === 'es' ? 'on' : ''}`} onClick={() => setTab('es')}>Español</button>
        <button className={`blog-tab ${tab === 'en' ? 'on' : ''}`} onClick={() => setTab('en')}>English</button>
        <button className={`blog-tab ${preview ? 'on' : ''}`} style={{ marginLeft: 'auto' }} onClick={() => setPreview(v => !v)}>
          <Icon name="eye" size={14} />{lang === 'es' ? 'Vista previa' : 'Preview'}
        </button>
      </div>

      <label>{lang === 'es' ? 'Título' : 'Title'} ({tab.toUpperCase()})</label>
      <input
        value={tab === 'es' ? f.title_es : f.title_en}
        onChange={e => set(tab === 'es' ? 'title_es' : 'title_en', e.target.value)}
        placeholder={lang === 'es' ? 'Deja en blanco y se guardará como “Entrada sin título”' : 'Leave blank to save as "Untitled post"'} />

      <label>{lang === 'es' ? 'URL de la entrada' : 'Post URL'}</label>
      <div className="blog-slug">
        <span className="muted">/blog/</span>
        <input value={f.slug} onChange={e => set('slug', slugify(e.target.value))} placeholder="mi-entrada" />
      </div>

      <label>{lang === 'es' ? 'Resumen corto' : 'Short excerpt'} ({tab.toUpperCase()})</label>
      <textarea rows={2}
        value={tab === 'es' ? f.excerpt_es : f.excerpt_en}
        onChange={e => set(tab === 'es' ? 'excerpt_es' : 'excerpt_en', e.target.value)}
        placeholder={lang === 'es' ? 'Se usa en la lista del blog y al compartir. Si lo dejas vacío se genera solo.' : 'Used in the blog list and when sharing. Left empty, it is generated for you.'} />

      <label>{lang === 'es' ? 'Imagen de portada' : 'Cover image'}</label>
      {f.cover_url && <div className="blog-cover-prev" style={{ backgroundImage: `url('${f.cover_url}')` }} />}
      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
        <label className="btn ghost sm" style={{ cursor: 'pointer' }}>
          {uploading ? <span className="spin" style={{ width: 14, height: 14 }} /> : <Icon name="upload" size={14} />}
          {lang === 'es' ? 'Subir' : 'Upload'}
          <input type="file" accept="image/*" hidden disabled={uploading}
            onChange={e => { const file = e.target.files?.[0]; if (file) uploadImage(file, true); e.target.value = ''; }} />
        </label>
        <button className="btn ghost sm" onClick={() => setPickCover(true)}>
          <Icon name="media" size={14} />{lang === 'es' ? 'Elegir de la biblioteca' : 'Choose from library'}
        </button>
        {f.cover_url && (
          <button className="btn ghost sm" onClick={() => set('cover_url', '')}>
            <Icon name="x" size={14} />{lang === 'es' ? 'Quitar' : 'Remove'}
          </button>
        )}
      </div>

      <label style={{ marginTop: '1.1rem' }}>{lang === 'es' ? 'Contenido' : 'Body'} ({tab.toUpperCase()})</label>
      <div className="blog-toolbar">
        {TB.map(b => (
          <button key={b.label} type="button" className="blog-tb" onClick={b.run} title={b.label}>{b.label}</button>
        ))}
        <span style={{ width: 1, background: 'var(--line)', margin: '0 .2rem' }} />
        <label className="blog-tb" style={{ cursor: 'pointer' }} title={lang === 'es' ? 'Subir imagen' : 'Upload image'}>
          <Icon name="upload" size={13} />
          <input type="file" accept="image/*" hidden disabled={uploading}
            onChange={e => { const file = e.target.files?.[0]; if (file) uploadImage(file, false); e.target.value = ''; }} />
        </label>
        <button type="button" className="blog-tb" onClick={() => setPickInline(true)} title={lang === 'es' ? 'Insertar de la biblioteca' : 'Insert from library'}>
          <Icon name="media" size={13} />
        </button>
      </div>

      {preview ? (
        <div className="blog-preview" dangerouslySetInnerHTML={{ __html: renderMarkdown(bodyVal) }} />
      ) : (
        <textarea
          ref={bodyRef}
          rows={16}
          className="blog-body"
          value={bodyVal}
          onChange={e => set(bodyKey, e.target.value)}
          placeholder={lang === 'es'
            ? '## Un subtítulo\n\nEscribe aquí. Usa **negrita**, > para citar un versículo, y - para listas.'
            : '## A subheading\n\nWrite here. Use **bold**, > to quote a verse, and - for lists.'} />
      )}

      <label style={{ marginTop: '1.1rem' }}>{lang === 'es' ? 'Referencia bíblica' : 'Scripture reference'}</label>
      <input value={f.scripture_ref} onChange={e => set('scripture_ref', e.target.value)} placeholder="Jeremías 29:11" />

      <label>{lang === 'es' ? 'Texto del versículo' : 'Verse text'} ({tab.toUpperCase()})</label>
      <textarea rows={2}
        value={tab === 'es' ? f.scripture_text_es : f.scripture_text_en}
        onChange={e => set(tab === 'es' ? 'scripture_text_es' : 'scripture_text_en', e.target.value)} />

      <label>{lang === 'es' ? 'Palabras clave' : 'Keywords'}</label>
      <input value={f.keywords} onChange={e => set('keywords', e.target.value)} placeholder={lang === 'es' ? 'esperanza, fe, propósito' : 'hope, faith, purpose'} />

      <div className="grid g2">
        <div>
          <label>{lang === 'es' ? 'Autor' : 'Author'}</label>
          <input value={f.author} onChange={e => set('author', e.target.value)} />
        </div>
        <div>
          <label>{lang === 'es' ? 'Programar para' : 'Schedule for'}</label>
          <input type="datetime-local" value={f.publish_at} onChange={e => set('publish_at', e.target.value)} />
        </div>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', cursor: 'pointer', marginTop: '.9rem' }}>
        <input type="checkbox" checked={f.featured} onChange={e => set('featured', e.target.checked)} />
        {lang === 'es' ? 'Destacar en la página del blog' : 'Feature on the blog page'}
      </label>

      <button type="button" className="btn ghost sm" style={{ marginTop: '1.1rem' }} onClick={() => setSeo(v => !v)}>
        <Icon name="globe" size={14} />{lang === 'es' ? 'Ajustes de búsqueda y compartir' : 'Search and sharing settings'}
      </button>

      {seo && (
        <div className="card card-p" style={{ marginTop: '.8rem' }}>
          <p className="muted" style={{ fontSize: '.75rem', marginBottom: '.8rem' }}>
            {lang === 'es'
              ? 'Esto es lo que aparece en Google y en la tarjeta de WhatsApp o Facebook al compartir. Si lo dejas vacío, se usa el título y el resumen.'
              : 'This is what shows in Google and on the WhatsApp or Facebook card when shared. Left empty, the title and excerpt are used.'}
          </p>
          <label>{lang === 'es' ? 'Título SEO' : 'SEO title'} ({tab.toUpperCase()})</label>
          <input
            value={tab === 'es' ? f.meta_title_es : f.meta_title_en}
            onChange={e => set(tab === 'es' ? 'meta_title_es' : 'meta_title_en', e.target.value)} />
          <label>{lang === 'es' ? 'Descripción SEO' : 'SEO description'} ({tab.toUpperCase()})</label>
          <textarea rows={2}
            value={tab === 'es' ? f.meta_description_es : f.meta_description_en}
            onChange={e => set(tab === 'es' ? 'meta_description_es' : 'meta_description_en', e.target.value)} />
        </div>
      )}

      {pickCover && <MediaPicker onPick={(url) => { set('cover_url', url); setPickCover(false); }} onClose={() => setPickCover(false)} />}
      {pickInline && <MediaPicker onPick={(url) => { insertImage(url); setPickInline(false); }} onClose={() => setPickInline(false)} />}
    </Modal>
  );
}
