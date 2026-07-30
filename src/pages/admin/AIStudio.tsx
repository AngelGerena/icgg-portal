import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLang } from '../../lib/providers';
import { useToast } from '../../components/UI';
import { Icon } from '../../components/Icon';
import type { Channel, EventRow } from '../../lib/types';

interface GenResult { title: string; body_es: string; body_en: string; meta_es?: string; meta_en?: string; }

export function AIStudio() {
  const { lang } = useLang();
  const { push } = useToast();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [sourceId, setSourceId] = useState('');
  const [channel, setChannel] = useState<Channel>('facebook');
  const [chans, setChans] = useState<Record<Channel, boolean>>({ facebook: true, instagram: true, blog: false, google_business: false });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<GenResult | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('events').select('*').order('date', { ascending: true }).then(({ data }) => {
      const rows = (data as EventRow[]) ?? [];
      setEvents(rows);
      if (rows[0]) setSourceId(rows[0].id);
    });
  }, []);

  async function generate() {
    setBusy(true); setErr(null); setResult(null);
    const ev = events.find(e => e.id === sourceId);
    const facts = ev ? {
      title: ev.title_es, title_en: ev.title_en,
      date: ev.date, time: ev.time_start?.slice(0, 5),
      location: ev.location, description: ev.description,
    } : { note: 'General ICGG announcement' };

    const { data, error } = await supabase.functions.invoke('generate-content', {
      body: { kind: 'social_post', channel, facts },
    });
    setBusy(false);
    if (error) { setErr(error.message); return; }
    if (data?.error) { setErr(data.error); return; }
    setResult(data.result as GenResult);
  }

  async function queueIt() {
    if (!result) return;
    const { error } = await supabase.from('content_queue').insert({
      channel, status: 'draft', source_kind: 'event', source_id: sourceId || null,
      title: result.title, body_es: result.body_es, body_en: result.body_en,
      meta_es: result.meta_es, meta_en: result.meta_en,
    });
    if (error) { push(error.message, 'err'); return; }
    push(lang === 'es' ? 'Añadido a la cola' : 'Added to queue', 'ok');
  }

  return (
    <>
      <div className="view-head">
        <div>
          <span className="eyebrow">{lang === 'es' ? 'Generador bilingüe' : 'Bilingual generator'}</span>
          <div className="sec-title">{lang === 'es' ? 'Crea contenido con IA' : 'Create content with AI'}</div>
        </div>
      </div>

      <div className="grid g2" style={{ alignItems: 'start' }}>
        <div className="card card-p">
          <label>{lang === 'es' ? 'Basándose en (evento real)' : 'Grounded in (real event)'}</label>
          <select value={sourceId} onChange={e => setSourceId(e.target.value)}>
            {events.length === 0 && <option value="">{lang === 'es' ? 'Sin eventos — anuncio general' : 'No events — general post'}</option>}
            {events.map(e => (
              <option key={e.id} value={e.id}>{e.title_es}{e.date ? ` — ${e.date}` : ''}</option>
            ))}
          </select>

          <label>{lang === 'es' ? 'Canal principal' : 'Primary channel'}</label>
          <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
            {(['facebook', 'instagram', 'google_business', 'blog'] as Channel[]).map(c => (
              <button key={c} className={`chan-tog ${channel === c ? 'on' : ''}`} onClick={() => setChannel(c)}>
                <Icon name={c === 'google_business' ? 'globe' : c} size={15} />
                {c === 'google_business' ? 'Google' : c[0].toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>

          <div className="notice" style={{ marginTop: '1.1rem' }}>
            <Icon name="sparkle" size={16} className="ic" />
            <div className="nt"><b>{lang === 'es' ? 'Escribe en tu voz' : 'Writes in your voice'}</b> — {lang === 'es' ? 'entrenado con el estilo de ICGG. Genera español e inglés a la vez.' : "trained on ICGG's style. Generates Spanish and English at once."}</div>
          </div>

          <button className="btn accent block" style={{ marginTop: '1.1rem' }} onClick={generate} disabled={busy}>
            {busy ? <><span className="spin" style={{ width: 15, height: 15 }} />{lang === 'es' ? 'Escribiendo…' : 'Writing…'}</>
                  : <><Icon name="sparkle" size={15} stroke={2} />{lang === 'es' ? 'Generar borrador' : 'Generate draft'}</>}
          </button>
          <p className="muted" style={{ fontSize: '.7rem', textAlign: 'center', marginTop: '.6rem' }}>
            {lang === 'es' ? 'Aprox. $0.01 por generación · siempre un borrador' : '~$0.01 per run · always a draft'}
          </p>
        </div>

        <div>
          {err && <div className="card card-p" style={{ borderColor: 'var(--danger)', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--danger)', fontSize: '.85rem', fontWeight: 600, display: 'flex', gap: '.5rem', alignItems: 'flex-start' }}>
              <Icon name="x" size={16} stroke={2} />{err}
            </div>
          </div>}

          {!result && !err && (
            <div className="card" style={{ borderStyle: 'dashed', background: 'transparent' }}>
              <div className="empty">
                <Icon name="sparkle" size={52} stroke={1.3} className="ei" />
                <h4>{lang === 'es' ? 'Tu borrador aparecerá aquí' : 'Your draft appears here'}</h4>
                <p>{lang === 'es' ? 'Elige un evento y presiona Generar. Verás español e inglés, listos para editar y programar.' : "Choose an event and press Generate. You'll see Spanish and English, ready to edit and schedule."}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="card card-p">
              <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '1rem' }}>
                <span className="chip ok"><span className="dot" />{lang === 'es' ? 'Borrador listo' : 'Draft ready'}</span>
                <span className="muted" style={{ fontSize: '.72rem', marginLeft: 'auto' }}>{result.title}</span>
              </div>

              <div className="ai-lang">
                <div className="all"><Icon name="globe" size={13} />ESPAÑOL</div>
                <p>{result.body_es}</p>
              </div>
              <div className="ai-lang">
                <div className="all"><Icon name="globe" size={13} />ENGLISH</div>
                <p>{result.body_en}</p>
              </div>

              <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginTop: '.4rem' }}>
                <button className="btn accent sm" onClick={queueIt}><Icon name="clock" size={14} />{lang === 'es' ? 'Añadir a la cola' : 'Add to queue'}</button>
                <button className="btn ghost sm" onClick={generate}><Icon name="ai" size={14} />{lang === 'es' ? 'Regenerar' : 'Regenerate'}</button>
              </div>
              <p className="muted" style={{ fontSize: '.72rem', marginTop: '.8rem', display: 'flex', gap: '.4rem', alignItems: 'center' }}>
                <Icon name="check" size={13} stroke={2} />{lang === 'es' ? 'Siempre un borrador — nada se publica sin tu aprobación.' : 'Always a draft — nothing publishes without your approval.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
