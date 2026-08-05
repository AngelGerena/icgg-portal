import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { logActivity } from '../../lib/activity';
import { useLang, useAuth } from '../../lib/providers';
import { useToast, Empty } from '../../components/UI';
import { Icon } from '../../components/Icon';
import type { PrayerRow } from '../../lib/types';

type Filter = 'all' | 'new' | 'praying' | 'answered' | 'archived';

const REFRESH_MS = 60_000;

export function Prayer() {
  const { lang } = useLang();
  const { admin } = useAuth();
  const { push } = useToast();
  const [rows, setRows] = useState<PrayerRow[] | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.from('prayer_requests').select('*').order('created_at', { ascending: false });
    setRows((data as PrayerRow[]) ?? []);
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, REFRESH_MS);
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    return () => { clearInterval(id); window.removeEventListener('focus', onFocus); };
  }, [load]);

  /** Who is acting, by name where we have one, falling back to their email. */
  const actor = admin?.full_name?.trim() || admin?.email || 'unknown';

  async function setStatus(p: PrayerRow, status: PrayerRow['status']) {
    setBusy(p.id);
    // Stamp the request itself, so the record carries its own history rather
    // than forcing anyone to cross-reference a separate log.
    const { error } = await supabase.from('prayer_requests').update({
      status,
      handled_by: actor,
      handled_at: new Date().toISOString(),
    }).eq('id', p.id);
    setBusy(null);
    if (error) { push(error.message, 'err'); return; }

    const label =
      status === 'praying' ? (lang === 'es' ? 'Tomó una petición para orar' : 'Took a request to pray over')
        : status === 'answered' ? (lang === 'es' ? 'Marcó una petición como respondida' : 'Marked a request answered')
        : status === 'archived' ? (lang === 'es' ? 'Archivó una petición' : 'Archived a request')
        : (lang === 'es' ? 'Actualizó una petición' : 'Updated a request');
    await logActivity(label, 'Prayer', p.id);

    push(
      status === 'praying' ? (lang === 'es' ? 'Añadida a la cadena de oración' : 'Added to the prayer chain')
        : status === 'answered' ? (lang === 'es' ? 'Marcada como respondida' : 'Marked answered')
        : (lang === 'es' ? 'Archivada' : 'Archived'),
      'ok'
    );
    load();
  }

  function fmtFull(d: string) {
    return new Intl.DateTimeFormat(lang === 'es' ? 'es' : 'en', {
      day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit',
    }).format(new Date(d));
  }

  /** How long an untouched request has been waiting. */
  function waiting(d: string) {
    const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (mins < 60) return lang === 'es' ? `hace ${Math.max(mins, 1)} min` : `${Math.max(mins, 1)} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return lang === 'es' ? `hace ${hrs} h` : `${hrs} h ago`;
    const days = Math.floor(hrs / 24);
    return lang === 'es' ? `hace ${days} día${days > 1 ? 's' : ''}` : `${days} day${days > 1 ? 's' : ''} ago`;
  }

  const all = rows ?? [];
  const counts = {
    all: all.length,
    new: all.filter(r => r.status === 'new').length,
    praying: all.filter(r => r.status === 'praying').length,
    answered: all.filter(r => r.status === 'answered').length,
    archived: all.filter(r => r.status === 'archived').length,
  };
  const visible = all.filter(r => (filter === 'all' ? r.status !== 'archived' : r.status === filter));

  const statusLabel = (s: PrayerRow['status']) =>
    s === 'new' ? (lang === 'es' ? 'Nueva' : 'New')
      : s === 'praying' ? (lang === 'es' ? 'Orando' : 'Praying')
      : s === 'answered' ? (lang === 'es' ? 'Respondida' : 'Answered')
      : (lang === 'es' ? 'Archivada' : 'Archived');

  const FILTERS: { key: Filter; es: string; en: string }[] = [
    { key: 'all', es: 'Activas', en: 'Active' },
    { key: 'new', es: 'Nuevas', en: 'New' },
    { key: 'praying', es: 'Orando', en: 'Praying' },
    { key: 'answered', es: 'Respondidas', en: 'Answered' },
    { key: 'archived', es: 'Archivadas', en: 'Archived' },
  ];

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
        <div className="nt">
          <b>{lang === 'es' ? 'Privacidad protegida' : 'Privacy protected'}</b> — {lang === 'es'
            ? 'la IA nunca lee estas peticiones. Solo el equipo pastoral las ve.'
            : 'AI never reads these. Only the pastoral team sees them.'}
        </div>
      </div>

      {all.length > 0 && (
        <div className="vh-actions" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '.4rem' }}>
          {FILTERS.map(f => (
            <button key={f.key} className={`chip${filter === f.key ? ' gold' : ''}`} style={{ cursor: 'pointer' }}
              onClick={() => setFilter(f.key)}>
              {lang === 'es' ? f.es : f.en} ({counts[f.key]})
            </button>
          ))}
        </div>
      )}

      {!rows ? <div className="center-load"><div className="spin" /></div>
        : visible.length === 0 ? (
          <Empty icon="prayer"
            title={lang === 'es' ? 'Sin peticiones' : 'No requests'}
            sub={lang === 'es' ? 'Las peticiones del sitio aparecerán aquí.' : 'Requests from the site will appear here.'} />
        ) : (
          <div className="grid" style={{ gap: '.8rem' }}>
            {visible.map(p => (
              <div key={p.id} className="card card-p">
                <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '.35rem', flexWrap: 'wrap' }}>
                  <b style={{ fontSize: '.9rem' }}>{p.name || (lang === 'es' ? 'Anónimo' : 'Anonymous')}</b>
                  <span className={`chip ${p.status === 'new' ? 'info' : p.status === 'praying' ? 'gold' : p.status === 'answered' ? 'ok' : ''}`}>
                    <span className="dot" />{statusLabel(p.status)}
                  </span>
                  {p.is_shared && (
                    <span className="chip" title={lang === 'es' ? 'Autorizó compartirla con la cadena de oración' : 'Consented to sharing with the prayer chain'}>
                      <span className="dot" />{lang === 'es' ? 'Puede compartirse' : 'Shareable'}
                    </span>
                  )}
                </div>

                <div className="muted" style={{ fontSize: '.73rem', marginBottom: '.6rem' }}>
                  {lang === 'es' ? 'Enviada' : 'Submitted'} {fmtFull(p.created_at)}
                  {p.status === 'new' && ` · ${waiting(p.created_at)}`}
                </div>

                <p style={{ fontSize: '.88rem', lineHeight: 1.6 }}>{p.body}</p>

                {p.contact && (
                  <div className="muted" style={{ fontSize: '.74rem', marginTop: '.5rem' }}>{p.contact}</div>
                )}

                {p.handled_by ? (
                  <div className="prayer-handled">
                    <Icon name="check" size={13} stroke={2} />
                    <span>
                      {lang === 'es' ? 'Atendida por' : 'Handled by'} <b>{p.handled_by}</b>
                      {p.handled_at ? ` · ${fmtFull(p.handled_at)}` : ''}
                    </span>
                  </div>
                ) : (
                  <div className="prayer-unhandled">
                    {lang === 'es' ? 'Nadie la ha atendido todavía' : 'Nobody has taken this yet'}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '.5rem', marginTop: '.9rem', flexWrap: 'wrap' }}>
                  {p.status !== 'praying' && (
                    <button className="btn ghost sm" onClick={() => setStatus(p, 'praying')} disabled={busy === p.id}>
                      <Icon name="heart" size={13} />{lang === 'es' ? 'Orar' : 'Pray'}
                    </button>
                  )}
                  {p.status !== 'answered' && (
                    <button className="btn ghost sm" onClick={() => setStatus(p, 'answered')} disabled={busy === p.id}>
                      <Icon name="check" size={13} stroke={2} />{lang === 'es' ? 'Respondida' : 'Answered'}
                    </button>
                  )}
                  {p.status !== 'archived' && (
                    <button className="btn ghost sm" onClick={() => setStatus(p, 'archived')} disabled={busy === p.id}>
                      {lang === 'es' ? 'Archivar' : 'Archive'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
    </>
  );
}
