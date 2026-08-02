import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, LayoutGrid, List } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

interface EventItem {
  id: string;
  title_es: string;
  title_en?: string | null;
  date: string | null;
  time_start: string | null;
  time_end: string | null;
  location: string | null;
  description: string | null;
  description_en?: string | null;
  flyer_url: string | null;
  is_weekly: boolean;
  type?: string | null;
  date_label?: string;
}

const MONTHS_ES = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
const MONTHS_EN = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

// Seed data mirrored from the live ICGG events calendar so the section shows real
// flyers immediately, even before events are managed in Supabase. Flyers are hosted
// in the site's own /events folder (no external dependency). Once the Supabase
// `events` table returns rows, that live data replaces this seed automatically.
const SEED_EVENTS: EventItem[] = [
  {
    id: 'seed-casual-sunday',
    title_es: 'Casual Sunday — Machea tu Biblia',
    title_en: 'Casual Sunday — Bring Your Bible',
    date: '2025-08-02',
    time_start: '10:00',
    time_end: null,
    location: 'Sanford, FL',
    description: 'Un día para conectar, divertirnos y crecer juntos.',
    flyer_url: '/events/casual-sunday.jpg',
    is_weekly: false,
    type: 'ESPECIAL',
    date_label: 'Agosto 2, 2025'
  },
  {
    id: 'seed-ayuno',
    title_es: 'Ayuno Congregacional',
    title_en: 'Congregational Fast',
    date: '2025-08-02',
    time_start: '08:00',
    time_end: null,
    location: 'I.C.G.G. Sanford',
    description: 'Un tiempo para buscar a Dios, unirnos en oración y ver su poder. "Clamarán a mí, y yo les responderé." Jeremías 33:3',
    flyer_url: '/events/ayuno-congregacional.jpg',
    is_weekly: false,
    type: 'ORACIÓN',
    date_label: 'Agosto 2, 8 AM'
  },
  {
    id: 'seed-10-anos',
    title_es: '10 Años de Gobierno y Plenitud',
    title_en: '10 Years of Government and Fullness',
    date: '2025-08-09',
    time_start: '10:00',
    time_end: null,
    location: '2560 S Elm Ave, Sanford, FL 32773',
    description: 'Celebramos una década bajo su gobierno perfecto. Invitado especial: Pastor Frankie Hernández. Invita a tu familia, amigos y vecinos.',
    flyer_url: '/events/10-anos.jpg',
    is_weekly: false,
    type: 'CELEBRACIÓN',
    date_label: 'Domingo, Agosto 9'
  },
  {
    id: 'seed-matrimonios',
    title_es: 'Matrimonios Fuertes',
    title_en: 'Strong Marriages',
    date: '2026-08-15',
    time_start: '08:30',
    time_end: '12:00',
    location: '2560 S Elm Ave, Sanford, FL 32773',
    description: 'Evento para matrimonios. Cuido de niños, desayuno, dinámicas y 5 puntos que edificarán tu matrimonio. Inviertan en su matrimonio, Dios hará el resto.',
    flyer_url: '/events/matrimonios-fuertes.jpg',
    is_weekly: false,
    type: 'EVENTO',
    date_label: 'Sábado, Agosto 15'
  },
  {
    id: 'seed-cosecha',
    title_es: 'La Cosecha — Serie de Agosto',
    title_en: 'The Harvest — August Series',
    date: null,
    time_start: null,
    time_end: null,
    location: 'I.C.G.G. Sanford',
    description: 'Serie de predicación durante el mes de agosto.',
    flyer_url: '/events/la-cosecha.jpg',
    is_weekly: false,
    type: 'SERIE',
    date_label: 'Todo Agosto'
  },
  {
    id: 'seed-contracorriente',
    title_es: 'ContraCorriente — Pastora Irene Familia',
    title_en: 'ContraCorriente — Pastor Irene Familia',
    date: null,
    time_start: '10:00',
    time_end: null,
    location: 'Facebook Live — Irene Familia Ministries',
    description: 'Fe que piensa diferente, vida que transforma. Palabra que edifica, verdad que libera, enseñanza que transforma. En vivo todos los martes.',
    flyer_url: '/events/contracorriente.jpg',
    is_weekly: true,
    type: 'EN VIVO',
    date_label: 'Todos los Martes'
  },
  {
    id: 'seed-invitamos',
    title_es: 'Te Invitamos — Servicios',
    title_en: 'You Are Invited — Services',
    date: null,
    time_start: null,
    time_end: null,
    location: '2560 S Elm Ave, Sanford, FL 32773',
    description: 'Jueves 7:30 PM y Domingo 10:00 AM. Iglesia Cristiana Gracia y Gloria.',
    flyer_url: '/events/te-invitamos.jpg',
    is_weekly: true,
    type: 'SERVICIOS',
    date_label: 'Jueves y Domingo'
  }
];

function dateParts(dateStr: string | null, weekly?: boolean, label?: string, isSpanish = true) {
  if (weekly) return { mon: isSpanish ? 'SEM' : 'WK', day: '', full: label || (isSpanish ? 'Semanal' : 'Weekly') };
  if (!dateStr) return { mon: '', day: '', full: label || '' };
  const d = new Date(dateStr + 'T00:00:00');
  const mon = (isSpanish ? MONTHS_ES : MONTHS_EN)[d.getMonth()];
  const day = String(d.getDate());
  const full = d.toLocaleDateString(isSpanish ? 'es-US' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  return { mon, day, full };
}
function fmtTime(t: string | null) {
  if (!t) return '';
  const [h, m] = t.split(':');
  const hr = parseInt(h);
  const ampm = hr >= 12 ? 'PM' : 'AM';
  const h12 = hr % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

interface EventsFeedProps {
  limit?: number;
  compact?: boolean;
  showToggle?: boolean;
  defaultView?: 'flyer' | 'list';
}

const EventsFeed = ({ limit, compact = false, showToggle = false, defaultView = 'flyer' }: EventsFeedProps) => {
  const { isSpanish } = useLanguage();
  const [events, setEvents] = useState<EventItem[]>(limit ? SEED_EVENTS.slice(0, limit) : SEED_EVENTS);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'flyer' | 'list'>(defaultView);

  useEffect(() => {
    async function fetchEvents() {
      try {
        // Show ALL active events. Ordering puts weekly/undated and upcoming first,
        // but nothing active is hidden just because its date has passed — publishing
        // one event must never make the others disappear from the page.
        let q = supabase
          .from('events')
          .select('*')
          .eq('is_active', true)
          .order('is_weekly', { ascending: false })
          .order('date', { ascending: true, nullsFirst: false });
        if (limit) q = q.limit(limit);
        const { data, error } = await q;
        if (!error && data && data.length > 0) {
          // Real events exist in the database — show those (the seed placeholders step aside).
          setEvents(data as EventItem[]);
        } else {
          // Database has no active events yet — show the seeded flyers so the page is never empty.
          setEvents(limit ? SEED_EVENTS.slice(0, limit) : SEED_EVENTS);
        }
      } catch {
        setEvents(limit ? SEED_EVENTS.slice(0, limit) : SEED_EVENTS);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [limit]);

  if (loading) {
    return (
      <div className="icgg-feed-loading">
        <div className="icgg-feed-spinner" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="icgg-feed-empty">
        <Calendar />
        <p>{isSpanish ? 'No hay eventos próximos por ahora. ¡Vuelve pronto!' : 'No upcoming events right now. Check back soon!'}</p>
      </div>
    );
  }

  const toggle = showToggle ? (
    <div className="icgg-viewtoggle">
      <button
        className={`icgg-viewtoggle-btn ${view === 'flyer' ? 'is-active' : ''}`}
        onClick={() => setView('flyer')}
        type="button"
      >
        <LayoutGrid /> {isSpanish ? 'Flyers' : 'Flyers'}
      </button>
      <button
        className={`icgg-viewtoggle-btn ${view === 'list' ? 'is-active' : ''}`}
        onClick={() => setView('list')}
        type="button"
      >
        <List /> {isSpanish ? 'Lista' : 'List'}
      </button>
    </div>
  ) : null;

  // LIST / CALENDAR VIEW
  if (showToggle && view === 'list') {
    return (
      <>
        {toggle}
        <div className="icgg-eventlist">
          {events.map((e) => {
            const title = isSpanish ? e.title_es : (e.title_en || e.title_es);
            const desc = isSpanish ? e.description : (e.description_en || e.description);
            const dp = dateParts(e.date, e.is_weekly, e.date_label, isSpanish);
            return (
              <article key={e.id} className="icgg-eventrow">
                <div className="icgg-eventrow-date">
                  <span className="icgg-eventrow-mon">{dp.mon}</span>
                  {dp.day && <span className="icgg-eventrow-day">{dp.day}</span>}
                </div>
                <div className="icgg-eventrow-body">
                  {e.type && <span className="icgg-eventrow-tag">{e.type}</span>}
                  <h3 className="icgg-eventrow-title">{title}</h3>
                  <div className="icgg-eventrow-meta">
                    {(e.time_start || e.is_weekly) && (
                      <span><Clock /> {e.is_weekly && !e.time_start ? dp.full : `${fmtTime(e.time_start)}${e.time_end ? ` – ${fmtTime(e.time_end)}` : ''}`}</span>
                    )}
                    {e.location && <span><MapPin /> {e.location}</span>}
                  </div>
                  {desc && <p className="icgg-eventrow-desc">{desc}</p>}
                </div>
                {e.flyer_url && (
                  <div className="icgg-eventrow-thumb" style={{ backgroundImage: `url('${e.flyer_url}')` }} />
                )}
              </article>
            );
          })}
        </div>
      </>
    );
  }

  // FLYER / MASONRY VIEW
  return (
    <>
      {toggle}
      <div className={`icgg-feed ${compact ? 'icgg-feed-compact' : ''}`}>
        {events.map((e) => {
          const title = isSpanish ? e.title_es : (e.title_en || e.title_es);
          const dp = dateParts(e.date, e.is_weekly, e.date_label, isSpanish);
          return (
            <article key={e.id} className="icgg-flyercard">
              {e.flyer_url ? (
                <div className="icgg-flyercard-img">
                  <img src={e.flyer_url} alt={title} loading="lazy"
                    onError={(ev) => { (ev.target as HTMLImageElement).parentElement!.style.display = 'none'; }} />
                </div>
              ) : (
                <div className="icgg-flyercard-noimg"><Calendar /></div>
              )}
              <div className="icgg-flyercard-body">
                <span className="icgg-flyercard-date">{dp.full}</span>
                <h3 className="icgg-flyercard-title">{title}</h3>
                <div className="icgg-flyercard-meta">
                  {e.time_start && (
                    <span><Clock /> {fmtTime(e.time_start)}{e.time_end ? ` – ${fmtTime(e.time_end)}` : ''}</span>
                  )}
                  {e.location && <span><MapPin /> {e.location}</span>}
                </div>
                {!compact && e.description && (
                  <p className="icgg-flyercard-desc">{isSpanish ? e.description : (e.description_en || e.description)}</p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
};

export default EventsFeed;
