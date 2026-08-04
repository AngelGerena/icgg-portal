import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLang } from '../../lib/providers';
import { useToast, Empty } from '../../components/UI';
import { Icon } from '../../components/Icon';
import { logActivity } from '../../lib/activity';
import { stripMarkdown } from '../../lib/markdown';
import type { BlogPostRow, BusinessSettings } from '../../lib/types';

/**
 * Blog Schedule — the publishing calendar for the Blog Studio.
 *
 * Scheduled posts are held here until their publish_at passes. Nothing goes
 * live on its own: publishing is one tap, and the master AI switch pauses
 * generation across the portal.
 */
export function Autopilot() {
  const { lang } = useLang();
  const { push } = useToast();
  const [rows, setRows] = useState<BlogPostRow[] | null>(null);
  const [ai, setAi] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    const [q, b] = await Promise.all([
      supabase.from('blog_posts').select('*')
        .in('status', ['draft', 'scheduled'])
        .order('publish_at', { ascending: true, nullsFirst: false }),
      supabase.from('business_settings').select('ai_enabled').eq('id', 1).maybeSingle(),
    ]);
    setRows((q.data as BlogPostRow[]) ?? []);
    setAi((b.data as BusinessSettings | null)?.ai_enabled ?? true);
  }
  useEffect(() => { load(); }, []);

  async function toggleMaster() {
    const next = !ai;
    setAi(next);
    await supabase.from('business_settings').update({ ai_enabled: next }).eq('id', 1);
    push(next ? (lang === 'es' ? 'IA activada' : 'AI enabled') : (lang === 'es' ? 'Toda la IA en pausa' : 'All AI paused'), 'ok');
  }

  async function publishNow(p: BlogPostRow) {
    setBusy(p.id);
    const { error } = await supabase.from('blog_posts').update({
      status: 'published',
      published_at: new Date().toISOString(),
      publish_at: null,
    }).eq('id', p.id);
    setBusy(null);
    if (error) { push(error.message, 'err'); return; }
    await logActivity(lang === 'es' ? `Publicó la entrada: ${p.title_es}` : `Published post: ${p.title_es}`, 'Blog', p.id);
    push(lang === 'es' ? 'Entrada publicada' : 'Post published', 'ok');
    load();
  }

  async function unschedule(p: BlogPostRow) {
    setBusy(p.id);
    const { error } = await supabase.from('blog_posts')
      .update({ status: 'draft', publish_at: null }).eq('id', p.id);
    setBusy(null);
    if (error) { push(error.message, 'err'); return; }
    push(lang === 'es' ? 'Devuelta a borrador' : 'Moved back to draft', 'ok');
    load();
  }

  if (!rows) return <div className="center-load"><div className="spin" /></div>;

  const scheduled = rows.filter(r => r.status === 'scheduled');
  const drafts = rows.filter(r => r.status === 'draft');
  const overdue = (p: BlogPostRow) => !!p.publish_at && new Date(p.publish_at) <= new Date();

  const card = (p: BlogPostRow) => (
    <div key={p.id} className="card card-p">
      <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', flexWrap: 'wrap', marginBottom: '.5rem' }}>
        <Icon name="edit" size={16} />
        <b style={{ fontSize: '.9rem' }}>{p.title_es}</b>
        {p.status === 'scheduled'
          ? <span className={`chip ${overdue(p) ? 'warn' : 'gold'}`} style={{ marginLeft: 'auto' }}>
              <span className="dot" />
              {overdue(p)
                ? (lang === 'es' ? 'Lista para publicar' : 'Ready to publish')
                : new Date(p.publish_at!).toLocaleString()}
            </span>
          : <span className="chip info" style={{ marginLeft: 'auto' }}><span className="dot" />{lang === 'es' ? 'Borrador' : 'Draft'}</span>}
      </div>
      {p.scripture_ref && <div className="muted" style={{ fontSize: '.74rem', marginBottom: '.3rem' }}>{p.scripture_ref}</div>}
      <p style={{ fontSize: '.82rem', lineHeight: 1.55 }}>
        {p.excerpt_es || stripMarkdown(p.body_es, 150)}
      </p>
      <div style={{ display: 'flex', gap: '.5rem', marginTop: '.9rem', flexWrap: 'wrap' }}>
        <button className="btn accent sm" onClick={() => publishNow(p)} disabled={busy === p.id}>
          {busy === p.id ? <span className="spin" style={{ width: 13, height: 13 }} /> : <Icon name="check" size={13} stroke={2} />}
          {lang === 'es' ? 'Publicar ahora' : 'Publish now'}
        </button>
        {p.status === 'scheduled' && (
          <button className="btn ghost sm" onClick={() => unschedule(p)} disabled={busy === p.id}>
            {lang === 'es' ? 'Quitar programación' : 'Unschedule'}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="view-head">
        <div>
          <span className="eyebrow">{lang === 'es' ? 'Calendario del blog' : 'Blog calendar'}</span>
          <div className="sec-title">{lang === 'es' ? 'Programación' : 'Schedule'}</div>
        </div>
        <div className="vh-actions">
          <button className={`btn ${ai ? 'danger' : 'accent'}`} onClick={toggleMaster}>
            <Icon name="power" size={15} stroke={2} />{ai ? (lang === 'es' ? 'Apagar IA' : 'Pause AI') : (lang === 'es' ? 'Encender IA' : 'Enable AI')}
          </button>
        </div>
      </div>

      <div className="notice" style={{ marginBottom: '1.3rem', borderLeftColor: ai ? 'var(--success)' : 'var(--muted)' }}>
        <Icon name={ai ? 'check' : 'power'} size={16} className="ic" />
        <div className="nt">
          <b>{ai ? (lang === 'es' ? 'IA activa' : 'AI active') : (lang === 'es' ? 'IA en pausa' : 'AI paused')}</b> — {lang === 'es'
            ? 'Nada se publica solo. Programa una entrada y publícala con un toque cuando llegue el momento.'
            : 'Nothing publishes on its own. Schedule a post and publish it with one tap when the time comes.'}
        </div>
      </div>

      <div className="view-head">
        <div>
          <span className="eyebrow">{lang === 'es' ? 'Programadas' : 'Scheduled'}</span>
          <div className="sec-title">{scheduled.length}</div>
        </div>
      </div>
      {scheduled.length === 0
        ? <div className="card"><div className="empty"><Icon name="clock" size={44} stroke={1.3} className="ei" />
            <h4>{lang === 'es' ? 'Nada programado' : 'Nothing scheduled'}</h4>
            <p>{lang === 'es' ? 'Programa una entrada desde el Estudio del Blog.' : 'Schedule a post from the Blog Studio.'}</p></div></div>
        : <div className="grid" style={{ gap: '.8rem' }}>{scheduled.map(card)}</div>}

      {drafts.length > 0 && (
        <>
          <div className="view-head" style={{ marginTop: '2rem' }}>
            <div>
              <span className="eyebrow">{lang === 'es' ? 'Borradores' : 'Drafts'}</span>
              <div className="sec-title">{drafts.length}</div>
            </div>
          </div>
          <div className="grid" style={{ gap: '.8rem' }}>{drafts.map(card)}</div>
        </>
      )}

      {rows.length === 0 && (
        <Empty icon="clock"
          title={lang === 'es' ? 'Nada en cola' : 'Nothing queued'}
          sub={lang === 'es' ? 'Escribe una entrada en el Estudio del Blog y aparecerá aquí.' : 'Write a post in the Blog Studio and it will appear here.'} />
      )}
    </>
  );
}
