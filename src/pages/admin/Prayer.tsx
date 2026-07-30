import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLang } from '../../lib/providers';
import { useToast, Empty } from '../../components/UI';
import { Icon } from '../../components/Icon';
import type { PrayerRow } from '../../lib/types';

export function Prayer() {
  const { lang } = useLang();
  const { push } = useToast();
  const [rows, setRows] = useState<PrayerRow[] | null>(null);

  async function load() {
    const { data } = await supabase.from('prayer_requests').select('*').order('created_at', { ascending: false });
    setRows((data as PrayerRow[]) ?? []);
  }
  useEffect(() => { load(); }, []);

  async function setStatus(id: string, status: PrayerRow['status']) {
    await supabase.from('prayer_requests').update({ status }).eq('id', id);
    push(status === 'praying' ? (lang === 'es' ? 'Añadida a la cadena de oración' : 'Added to the prayer chain') : (lang === 'es' ? 'Marcada como respondida' : 'Marked answered'), 'ok');
    load();
  }

  function fmtDate(d: string) {
    return new Intl.DateTimeFormat(lang === 'es' ? 'es' : 'en', { day: 'numeric', month: 'short' }).format(new Date(d));
  }

  return (
    <>
      <div className="view-head">
        <div>
          <span className="eyebrow">{lang === 'es' ? 'Confidencial' : 'Confidential'}</span>
          <div className="sec-title">{lang === 'es' ? 'Peticiones de oración' : 'Prayer requests'}</div>
        </div>
      </div>

      <div className="notice protected" style={{ marginBottom: '1.2rem' }}>
        <Icon name="lock" size={16} className="ic" />
        <div className="nt"><b>{lang === 'es' ? 'Privacidad protegida' : 'Privacy protected'}</b> — {lang === 'es' ? 'la IA nunca lee estas peticiones. Solo el equipo pastoral las ve.' : 'AI never reads these. Only the pastoral team sees them.'}</div>
      </div>

      {!rows ? <div className="center-load"><div className="spin" /></div>
        : rows.length === 0 ? <Empty icon="prayer" title={lang === 'es' ? 'Sin peticiones' : 'No requests'} sub={lang === 'es' ? 'Las peticiones del sitio aparecerán aquí.' : 'Requests from the site will appear here.'} />
        : <div className="grid" style={{ gap: '.8rem' }}>
          {rows.map(p => (
            <div key={p.id} className="card card-p">
              <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '.6rem' }}>
                <b style={{ fontSize: '.9rem' }}>{p.name || (lang === 'es' ? 'Anónimo' : 'Anonymous')}</b>
                <span className={`chip ${p.status === 'new' ? 'info' : p.status === 'praying' ? 'gold' : 'ok'}`}><span className="dot" />
                  {p.status === 'new' ? (lang === 'es' ? 'Nueva' : 'New') : p.status === 'praying' ? (lang === 'es' ? 'Orando' : 'Praying') : p.status === 'answered' ? (lang === 'es' ? 'Respondida' : 'Answered') : (lang === 'es' ? 'Archivada' : 'Archived')}
                </span>
                <span className="muted" style={{ fontSize: '.72rem', marginLeft: 'auto' }}>{fmtDate(p.created_at)}</span>
              </div>
              <p style={{ fontSize: '.88rem', lineHeight: 1.6 }}>{p.body}</p>
              {p.contact && <div className="muted" style={{ fontSize: '.74rem', marginTop: '.5rem' }}>{p.contact}</div>}
              <div style={{ display: 'flex', gap: '.5rem', marginTop: '.9rem' }}>
                {p.status !== 'praying' && <button className="btn ghost sm" onClick={() => setStatus(p.id, 'praying')}><Icon name="heart" size={13} />{lang === 'es' ? 'Orar' : 'Pray'}</button>}
                {p.status !== 'answered' && <button className="btn ghost sm" onClick={() => setStatus(p.id, 'answered')}><Icon name="check" size={13} stroke={2} />{lang === 'es' ? 'Respondida' : 'Answered'}</button>}
              </div>
            </div>
          ))}
        </div>}
    </>
  );
}
