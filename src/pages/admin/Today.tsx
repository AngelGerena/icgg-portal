import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/providers';
import { useLang } from '../../lib/providers';
import { useT } from '../../lib/i18n';
import { Icon } from '../../components/Icon';

interface Stats {
  unread: number;
  newPrayers: number;
  oldestPrayer: string | null;
  scheduledPosts: number;
  draftPosts: number;
  liveEvents: number;
  draftEvents: number;
}

const REFRESH_MS = 60_000;

export function Today() {
  const { admin } = useAuth();
  const { lang } = useLang();
  const t = useT();
  const nav = useNavigate();
  const [s, setS] = useState<Stats | null>(null);

  const load = useCallback(async () => {
    const [unread, newPrayers, oldest, scheduledPosts, draftPosts, liveEvents, draftEvents] = await Promise.all([
      supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
      supabase.from('prayer_requests').select('id', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('prayer_requests').select('created_at').eq('status', 'new')
        .order('created_at', { ascending: true }).limit(1).maybeSingle(),
      supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('status', 'scheduled'),
      supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
      supabase.from('events').select('id', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('events').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
    ]);
    setS({
      unread: unread.count ?? 0,
      newPrayers: newPrayers.count ?? 0,
      oldestPrayer: (oldest.data as { created_at: string } | null)?.created_at ?? null,
      scheduledPosts: scheduledPosts.count ?? 0,
      draftPosts: draftPosts.count ?? 0,
      liveEvents: liveEvents.count ?? 0,
      draftEvents: draftEvents.count ?? 0,
    });
  }, []);

  // Poll while the tab is open. The media team leaves this on a screen all day,
  // so a prayer request that arrives at 2pm should surface without a reload.
  useEffect(() => {
    load();
    const id = setInterval(load, REFRESH_MS);
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    return () => { clearInterval(id); window.removeEventListener('focus', onFocus); };
  }, [load]);

  /** How long the oldest unattended request has been waiting. */
  function waitingFor(iso: string | null): string | null {
    if (!iso) return null;
    const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 1) return lang === 'es' ? 'hace un momento' : 'just now';
    if (mins < 60) return lang === 'es' ? `hace ${mins} min` : `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return lang === 'es' ? `hace ${hrs} h` : `${hrs} h ago`;
    const days = Math.floor(hrs / 24);
    return lang === 'es' ? `hace ${days} día${days > 1 ? 's' : ''}` : `${days} day${days > 1 ? 's' : ''} ago`;
  }

  const name = (admin?.full_name || '').split(' ')[0] || 'Angel';

  if (!s) return <div className="center-load"><div className="spin" /></div>;

  const waiting = waitingFor(s.oldestPrayer);
  // A request sitting more than 12 hours is escalated visually.
  const stale = !!s.oldestPrayer && (Date.now() - new Date(s.oldestPrayer).getTime()) > 12 * 3600_000;
  const hasActions = s.unread > 0 || s.newPrayers > 0 || s.scheduledPosts > 0 || s.draftPosts > 0 || s.draftEvents > 0;

  const brief = lang === 'es'
    ? `${t('today.greeting')}, ${name}. Tienes <b>${s.newPrayers} peticiones</b> de oración nuevas y <b>${s.unread} mensajes</b> sin leer. Hay <b>${s.scheduledPosts}</b> entradas programadas y <b>${s.draftPosts}</b> en borrador.`
    : `${t('today.greeting')}, ${name}. You have <b>${s.newPrayers} new prayer requests</b> and <b>${s.unread} unread messages</b>. There are <b>${s.scheduledPosts}</b> scheduled posts and <b>${s.draftPosts}</b> in draft.`;

  return (
    <>
      <div className="brief">
        <div className="bh"><Icon name="ai" size={16} /><span className="eyebrow">{lang === 'es' ? 'Resumen del día' : 'Daily brief'}</span></div>
        <p dangerouslySetInnerHTML={{ __html: brief }} />
      </div>

      {/* Prayer requests lead. If any are waiting, this is the loudest thing
          on the page and it stays loud until someone acts on it. */}
      {s.newPrayers > 0 && (
        <button className={`prayer-alert ${stale ? 'stale' : ''}`} onClick={() => nav('/prayer')}>
          <span className="pa-ic"><span className="pa-pulse" /><Icon name="prayer" size={22} /></span>
          <span className="pa-txt">
            <b>
              {lang === 'es'
                ? `${s.newPrayers} petición${s.newPrayers > 1 ? 'es' : ''} de oración esperando`
                : `${s.newPrayers} prayer request${s.newPrayers > 1 ? 's' : ''} waiting`}
            </b>
            <span className="pa-sub">
              {stale
                ? (lang === 'es'
                    ? `La más antigua llegó ${waiting}. Avisa al equipo de oración.`
                    : `The oldest arrived ${waiting}. Alert the prayer team.`)
                : (lang === 'es'
                    ? `La más reciente ${waiting}. Ábrelas y avisa al equipo de oración.`
                    : `Most recent ${waiting}. Open them and alert the prayer team.`)}
            </span>
          </span>
          <span className="pa-go"><Icon name="chevron" size={18} /></span>
        </button>
      )}

      <div className="grid g4" style={{ marginBottom: '1.6rem' }}>
        <Stat
          k={t('prayer')}
          v={s.newPrayers}
          d={waiting && s.newPrayers > 0 ? waiting : t('stat.newprayers')}
          chip={s.newPrayers > 0 ? (stale ? 'warn' : 'info') : 'ok'}
          urgent={s.newPrayers > 0}
          go={() => nav('/prayer')}
        />
        <Stat k={t('inbox')} v={s.unread} d={t('stat.unread')} chip={s.unread > 0 ? 'warn' : 'ok'} go={() => nav('/inbox')} />
        <Stat k={lang === 'es' ? 'Programadas' : 'Scheduled'} v={s.scheduledPosts} d={lang === 'es' ? 'entradas del blog' : 'blog posts'} chip="gold" go={() => nav('/autopilot')} />
        <Stat k={t('events')} v={s.liveEvents} d={t('stat.liveEvents')} chip="ok" go={() => nav('/events')} />
      </div>

      <div className="view-head">
        <div>
          <span className="eyebrow">{t('today.decisions')}</span>
          <div className="sec-title">{t('today.threethings')}</div>
        </div>
      </div>

      {hasActions ? (
        <div className="grid" style={{ gap: '.8rem' }}>
          {s.newPrayers > 0 && <Action ic="prayer" color="info"
            title={lang === 'es' ? `${s.newPrayers} peticiones de oración` : `${s.newPrayers} prayer requests`}
            desc={lang === 'es' ? 'Ábrelas y pásalas al equipo de oración.' : 'Open them and pass them to the prayer team.'}
            btn={lang === 'es' ? 'Ver peticiones' : 'View requests'} go={() => nav('/prayer')} />}
          {s.unread > 0 && <Action ic="inbox" color="gold"
            title={lang === 'es' ? `${s.unread} mensajes sin leer` : `${s.unread} unread messages`}
            desc={lang === 'es' ? 'Responde a quienes escribieron desde el sitio.' : 'Reply to people who wrote from the site.'}
            btn={lang === 'es' ? 'Ver mensajes' : 'View messages'} go={() => nav('/inbox')} />}
          {s.scheduledPosts > 0 && <Action ic="autopilot" color="warn"
            title={lang === 'es' ? 'Entradas programadas' : 'Scheduled posts'}
            desc={lang === 'es' ? 'Publícalas cuando llegue el momento.' : 'Publish them when the time comes.'}
            btn={lang === 'es' ? 'Revisar' : 'Review'} go={() => nav('/autopilot')} />}
          {s.draftPosts > 0 && <Action ic="ai" color="info"
            title={lang === 'es' ? `${s.draftPosts} entradas en borrador` : `${s.draftPosts} posts in draft`}
            desc={lang === 'es' ? 'Termínalas y publícalas en Contra la Corriente.' : 'Finish them and publish to Against the Current.'}
            btn={lang === 'es' ? 'Abrir estudio' : 'Open studio'} go={() => nav('/ai')} />}
          {s.draftEvents > 0 && <Action ic="events" color="info"
            title={lang === 'es' ? `${s.draftEvents} evento en borrador` : `${s.draftEvents} event in draft`}
            desc={lang === 'es' ? 'Publícalo para que aparezca en el sitio.' : 'Publish it to show on the site.'}
            btn={lang === 'es' ? 'Ver eventos' : 'View events'} go={() => nav('/events')} />}
        </div>
      ) : (
        <div className="card"><div className="empty">
          <Icon name="check" size={52} stroke={1.3} className="ei" style={{ color: 'var(--success)' }} />
          <h4>{t('today.allclear')}</h4>
          <p>{t('today.allclear.sub')}</p>
        </div></div>
      )}
    </>
  );
}

function Stat({ k, v, d, chip, urgent, go }: {
  k: string; v: number; d: string; chip: string; urgent?: boolean; go?: () => void;
}) {
  return (
    <div className={`stat ${urgent ? 'urgent' : ''} ${go ? 'clickable' : ''}`}
      onClick={go} role={go ? 'button' : undefined} tabIndex={go ? 0 : undefined}
      onKeyDown={go ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } } : undefined}>
      <div className="k">{k}</div>
      <div className="v">{v}</div>
      <div className="d"><span className={`chip ${chip}`}><span className="dot" />{d}</span></div>
    </div>
  );
}

function Action({ ic, color, title, desc, btn, go }: { ic: string; color: string; title: string; desc: string; btn: string; go: () => void }) {
  return (
    <div className="card action-row">
      <div className={`action-ic ${color}`}><Icon name={ic} size={19} /></div>
      <div className="at"><b>{title}</b><div className="ad">{desc}</div></div>
      <button className="btn ghost sm" onClick={go}>{btn}</button>
    </div>
  );
}
