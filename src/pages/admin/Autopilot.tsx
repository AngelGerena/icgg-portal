import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLang } from '../../lib/providers';
import { useToast, Toggle } from '../../components/UI';
import { Icon } from '../../components/Icon';
import type { AutopilotRow, ContentQueueRow, BusinessSettings, Channel } from '../../lib/types';

const CHAN_ICON: Record<Channel, string> = { facebook: 'facebook', instagram: 'instagram', blog: 'globe', google_business: 'globe' };
const CHAN_NAME: Record<Channel, string> = { facebook: 'Facebook', instagram: 'Instagram', blog: 'Blog', google_business: 'Google Business' };

export function Autopilot() {
  const { lang } = useLang();
  const { push } = useToast();
  const [rows, setRows] = useState<AutopilotRow[] | null>(null);
  const [queue, setQueue] = useState<ContentQueueRow[]>([]);
  const [ai, setAi] = useState(true);

  async function load() {
    const [a, q, b] = await Promise.all([
      supabase.from('autopilot_settings').select('*'),
      supabase.from('content_queue').select('*').in('status', ['draft', 'scheduled']).order('created_at', { ascending: false }),
      supabase.from('business_settings').select('ai_enabled').eq('id', 1).maybeSingle(),
    ]);
    setRows((a.data as AutopilotRow[]) ?? []);
    setQueue((q.data as ContentQueueRow[]) ?? []);
    setAi((b.data as BusinessSettings | null)?.ai_enabled ?? true);
  }
  useEffect(() => { load(); }, []);

  async function toggleMaster() {
    const next = !ai;
    setAi(next);
    await supabase.from('business_settings').update({ ai_enabled: next }).eq('id', 1);
    push(next ? (lang === 'es' ? 'IA activada' : 'AI enabled') : (lang === 'es' ? 'Toda la IA en pausa' : 'All AI paused'), 'ok');
  }
  async function toggleChannel(ch: AutopilotRow) {
    const next = !ch.enabled;
    setRows(r => r!.map(x => x.channel === ch.channel ? { ...x, enabled: next } : x));
    await supabase.from('autopilot_settings').update({ enabled: next }).eq('channel', ch.channel);
    push(next ? (lang === 'es' ? 'Canal activado' : 'Channel enabled') : (lang === 'es' ? 'Canal pausado' : 'Channel paused'), 'ok');
  }
  async function cancelPost(id: string) {
    await supabase.from('content_queue').update({ status: 'cancelled' }).eq('id', id);
    push(lang === 'es' ? 'Publicación cancelada' : 'Post cancelled', 'ok');
    load();
  }

  if (!rows) return <div className="center-load"><div className="spin" /></div>;

  return (
    <>
      <div className="view-head">
        <div>
          <span className="eyebrow">{lang === 'es' ? 'Publicación con veto' : 'Posting with veto'}</span>
          <div className="sec-title">{lang === 'es' ? 'Piloto automático' : 'Autopilot'}</div>
        </div>
        <div className="vh-actions">
          <button className={`btn ${ai ? 'danger' : 'accent'}`} onClick={toggleMaster}>
            <Icon name="power" size={15} stroke={2} />{ai ? (lang === 'es' ? 'Apagar todo' : 'Kill switch') : (lang === 'es' ? 'Encender' : 'Enable')}
          </button>
        </div>
      </div>

      <div className="notice" style={{ marginBottom: '1.3rem', borderLeftColor: ai ? 'var(--success)' : 'var(--muted)' }}>
        <Icon name={ai ? 'check' : 'power'} size={16} className="ic" />
        <div className="nt">
          <b>{ai ? (lang === 'es' ? 'Sistema activo' : 'System active') : (lang === 'es' ? 'Todo en pausa' : 'All paused')}</b> — {lang === 'es' ? 'Cada publicación se programa con anticipación y te avisa. Si no haces nada, se publica. Un toque la cancela.' : 'Every post is scheduled ahead and notifies you. Do nothing and it publishes. One tap cancels it.'}
        </div>
      </div>

      <div className="grid" style={{ gap: '.9rem' }}>
        {rows.map(ch => {
          const gate = ch.approved_streak >= 10;
          return (
            <div key={ch.channel} className="card chan-row">
              <div className="chan-ic"><Icon name={CHAN_ICON[ch.channel]} size={19} /></div>
              <div className="ct">
                <b>{CHAN_NAME[ch.channel]}</b>
                <div className="cd">{lang === 'es' ? `Máx. ${ch.max_per_week}/semana · ventana de ${ch.review_window_hr}h` : `Max ${ch.max_per_week}/week · ${ch.review_window_hr}h window`}</div>
              </div>
              {gate
                ? <span className="chip ok"><span className="dot" />{lang === 'es' ? `${ch.approved_streak} aprobados` : `${ch.approved_streak} approved`}</span>
                : <span className="chip warn"><span className="dot" />{lang === 'es' ? `${ch.approved_streak}/10 para activar` : `${ch.approved_streak}/10 to unlock`}</span>}
              {gate
                ? <Toggle on={ch.enabled} onClick={() => toggleChannel(ch)} />
                : <button className="btn ghost sm" disabled><Icon name="lock" size={13} />{lang === 'es' ? 'Bloqueado' : 'Locked'}</button>}
            </div>
          );
        })}
      </div>

      <div className="view-head" style={{ marginTop: '2rem' }}>
        <div>
          <span className="eyebrow">{lang === 'es' ? 'En cola' : 'In queue'}</span>
          <div className="sec-title">{lang === 'es' ? 'Publicaciones' : 'Posts'}</div>
        </div>
      </div>
      {queue.length === 0
        ? <div className="card"><div className="empty"><Icon name="clock" size={48} stroke={1.3} className="ei" /><h4>{lang === 'es' ? 'Nada en cola' : 'Nothing queued'}</h4><p>{lang === 'es' ? 'Genera contenido en el Estudio de IA y añádelo aquí.' : 'Generate content in the AI Studio and add it here.'}</p></div></div>
        : <div className="grid" style={{ gap: '.8rem' }}>
          {queue.map(p => (
            <div key={p.id} className="card card-p">
              <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '.6rem' }}>
                <Icon name={CHAN_ICON[p.channel]} size={16} />
                <b style={{ fontSize: '.88rem' }}>{p.title}</b>
                <span className={`chip ${p.status === 'scheduled' ? 'gold' : 'info'}`} style={{ marginLeft: 'auto' }}><span className="dot" />{p.status === 'scheduled' ? (lang === 'es' ? 'Programado' : 'Scheduled') : (lang === 'es' ? 'Borrador' : 'Draft')}</span>
              </div>
              <p style={{ fontSize: '.82rem', lineHeight: 1.55 }}>{lang === 'es' ? p.body_es : p.body_en}</p>
              <div style={{ display: 'flex', gap: '.5rem', marginTop: '.9rem' }}>
                <button className="btn danger sm" onClick={() => cancelPost(p.id)}>{lang === 'es' ? 'Cancelar' : 'Cancel'}</button>
              </div>
            </div>
          ))}
        </div>}
    </>
  );
}
