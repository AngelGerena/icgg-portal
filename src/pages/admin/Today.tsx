import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/providers';
import { useLang } from '../../lib/providers';
import { useT } from '../../lib/i18n';
import { Icon } from '../../components/Icon';

interface Stats { unread: number; newPrayers: number; scheduled: number; liveEvents: number; draftEvents: number; }

export function Today() {
  const { admin } = useAuth();
  const { lang } = useLang();
  const t = useT();
  const nav = useNavigate();
  const [s, setS] = useState<Stats | null>(null);

  useEffect(() => {
    (async () => {
      const [unread, newPrayers, scheduled, liveEvents, draftEvents] = await Promise.all([
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('prayer_requests').select('id', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('content_queue').select('id', { count: 'exact', head: true }).eq('status', 'scheduled'),
        supabase.from('events').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('events').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
      ]);
      setS({
        unread: unread.count ?? 0, newPrayers: newPrayers.count ?? 0,
        scheduled: scheduled.count ?? 0, liveEvents: liveEvents.count ?? 0, draftEvents: draftEvents.count ?? 0,
      });
    })();
  }, []);

  const name = (admin?.full_name || '').split(' ')[0] || 'Angel';
  const hasActions = s && (s.unread > 0 || s.newPrayers > 0 || s.scheduled > 0 || s.draftEvents > 0);

  const brief = lang === 'es'
    ? `${t('today.greeting')}, ${name}. Tienes <b>${s?.unread ?? 0} mensajes</b> sin leer y <b>${s?.newPrayers ?? 0} peticiones</b> de oración nuevas. Hay <b>${s?.scheduled ?? 0}</b> en cola de publicación y <b>${s?.draftEvents ?? 0} evento</b> en borrador.`
    : `${t('today.greeting')}, ${name}. You have <b>${s?.unread ?? 0} unread messages</b> and <b>${s?.newPrayers ?? 0} new prayer requests</b>. There are <b>${s?.scheduled ?? 0}</b> in the publish queue and <b>${s?.draftEvents ?? 0} event</b> in draft.`;

  if (!s) return <div className="center-load"><div className="spin" /></div>;

  return (
    <>
      <div className="brief">
        <div className="bh"><Icon name="ai" size={16} /><span className="eyebrow">{lang === 'es' ? 'Resumen del día' : 'Daily brief'}</span></div>
        <p dangerouslySetInnerHTML={{ __html: brief }} />
      </div>

      <div className="grid g4" style={{ marginBottom: '1.6rem' }}>
        <Stat k={t('inbox')} v={s.unread} d={t('stat.unread')} chip="warn" />
        <Stat k={t('prayer')} v={s.newPrayers} d={t('stat.newprayers')} chip="info" />
        <Stat k={lang === 'es' ? 'En cola' : 'Queued'} v={s.scheduled} d={t('stat.scheduled')} chip="gold" />
        <Stat k={t('events')} v={s.liveEvents} d={t('stat.liveEvents')} chip="ok" />
      </div>

      <div className="view-head">
        <div>
          <span className="eyebrow">{t('today.decisions')}</span>
          <div className="sec-title">{t('today.threethings')}</div>
        </div>
      </div>

      {hasActions ? (
        <div className="grid" style={{ gap: '.8rem' }}>
          {s.scheduled > 0 && <Action ic="autopilot" color="warn"
            title={lang === 'es' ? 'Revisa las publicaciones programadas' : 'Review scheduled posts'}
            desc={lang === 'es' ? 'Se publican pronto a menos que las canceles.' : 'They publish soon unless you cancel.'}
            btn={lang === 'es' ? 'Revisar' : 'Review'} go={() => nav('/autopilot')} />}
          {s.draftEvents > 0 && <Action ic="events" color="info"
            title={lang === 'es' ? `${s.draftEvents} evento en borrador` : `${s.draftEvents} event in draft`}
            desc={lang === 'es' ? 'Publícalo para que aparezca en el sitio.' : 'Publish it to show on the site.'}
            btn={lang === 'es' ? 'Ver eventos' : 'View events'} go={() => nav('/events')} />}
          {s.unread > 0 && <Action ic="inbox" color="gold"
            title={lang === 'es' ? `${s.unread} mensajes sin leer` : `${s.unread} unread messages`}
            desc={lang === 'es' ? 'Responde a quienes escribieron desde el sitio.' : 'Reply to people who wrote from the site.'}
            btn={lang === 'es' ? 'Ver mensajes' : 'View messages'} go={() => nav('/inbox')} />}
          {s.newPrayers > 0 && <Action ic="prayer" color="info"
            title={lang === 'es' ? `${s.newPrayers} peticiones de oración` : `${s.newPrayers} prayer requests`}
            desc={lang === 'es' ? 'El equipo pastoral debe orar por ellas.' : 'The pastoral team should pray over these.'}
            btn={lang === 'es' ? 'Ver peticiones' : 'View requests'} go={() => nav('/prayer')} />}
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

function Stat({ k, v, d, chip }: { k: string; v: number; d: string; chip: string }) {
  return (
    <div className="stat">
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
