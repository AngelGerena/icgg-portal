import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLang } from '../../lib/providers';
import { useToast, Modal, Empty } from '../../components/UI';
import { Icon } from '../../components/Icon';
import { logActivity, trashRecord } from '../../lib/activity';
import type { MessageRow } from '../../lib/types';

type Filter = 'all' | 'unread' | 'new' | 'replied' | 'archived';

const REFRESH_MS = 60_000;

/**
 * The contact form stores its dropdown values as slugs. Translate them for
 * display so the team reads "Consejería", not "counseling".
 */
const SUBJECTS: Record<string, { es: string; en: string }> = {
  prayer: { es: 'Petición de oración', en: 'Prayer request' },
  visit: { es: 'Quiere visitarnos', en: 'Wants to visit' },
  ministry: { es: 'Información de ministerios', en: 'Ministry information' },
  counseling: { es: 'Consejería', en: 'Counseling' },
  other: { es: 'Otro', en: 'Other' },
};

export function Inbox() {
  const { lang } = useLang();
  const { push } = useToast();
  const [rows, setRows] = useState<MessageRow[] | null>(null);
  const [open, setOpen] = useState<MessageRow | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    setRows((data as MessageRow[]) ?? []);
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, REFRESH_MS);
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    return () => { clearInterval(id); window.removeEventListener('focus', onFocus); };
  }, [load]);

  function subjectLabel(s: string | null) {
    if (!s) return lang === 'es' ? 'Sin asunto' : 'No subject';
    const hit = SUBJECTS[s];
    return hit ? (lang === 'es' ? hit.es : hit.en) : s;
  }

  async function openMsg(m: MessageRow) {
    setOpen(m);
    if (!m.is_read) {
      await supabase.from('contact_messages').update({ is_read: true }).eq('id', m.id);
      load();
    }
  }

  async function setStatus(m: MessageRow, status: MessageRow['status']) {
    setBusy(m.id);
    const { error } = await supabase.from('contact_messages')
      .update({ status, is_read: true }).eq('id', m.id);
    setBusy(null);
    if (error) { push(error.message, 'err'); return; }
    await logActivity(
      lang === 'es' ? `Marcó el mensaje de ${m.name} como ${status}` : `Marked message from ${m.name} as ${status}`,
      'Inbox', m.id
    );
    push(
      status === 'replied' ? (lang === 'es' ? 'Marcado como respondido' : 'Marked replied')
        : status === 'archived' ? (lang === 'es' ? 'Archivado' : 'Archived')
        : (lang === 'es' ? 'Devuelto a nuevos' : 'Moved back to new'),
      'ok'
    );
    setOpen(o => (o && o.id === m.id ? { ...o, status, is_read: true } : o));
    load();
  }

  async function markUnread(m: MessageRow) {
    await supabase.from('contact_messages').update({ is_read: false }).eq('id', m.id);
    setOpen(null);
    push(lang === 'es' ? 'Marcado como no leído' : 'Marked unread', 'ok');
    load();
  }

  async function remove(m: MessageRow) {
    const ok = window.confirm(lang === 'es'
      ? `¿Eliminar el mensaje de ${m.name}? Podrás restaurarlo desde el Registro de actividad.`
      : `Delete the message from ${m.name}? You can restore it from the Activity Log.`);
    if (!ok) return;
    setBusy(m.id);
    await trashRecord('contact_messages', m.id, `${m.name} — ${subjectLabel(m.subject)}`, m as any);
    const { error } = await supabase.from('contact_messages').delete().eq('id', m.id);
    setBusy(null);
    if (error) { push(error.message, 'err'); return; }
    await logActivity(lang === 'es' ? `Eliminó el mensaje de ${m.name}` : `Deleted message from ${m.name}`, 'Inbox', m.id);
    push(lang === 'es' ? 'Mensaje eliminado' : 'Message deleted', 'ok');
    setOpen(null);
    load();
  }

  /** Opening the mail client counts as replying — record it so the team knows. */
  function replyAndMark(m: MessageRow) {
    setStatus(m, 'replied');
  }

  function fmtDate(d: string) {
    return new Intl.DateTimeFormat(lang === 'es' ? 'es' : 'en', { day: 'numeric', month: 'short' }).format(new Date(d));
  }

  const all = rows ?? [];
  const counts = {
    all: all.length,
    unread: all.filter(m => !m.is_read).length,
    new: all.filter(m => m.status === 'new').length,
    replied: all.filter(m => m.status === 'replied').length,
    archived: all.filter(m => m.status === 'archived').length,
  };

  const visible = all
    .filter(m => {
      if (filter === 'all') return m.status !== 'archived';
      if (filter === 'unread') return !m.is_read;
      return m.status === filter;
    })
    .filter(m => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return [m.name, m.email, m.phone, m.body, subjectLabel(m.subject)]
        .filter(Boolean).some(v => (v as string).toLowerCase().includes(q));
    });

  const statusChip = (m: MessageRow) => {
    if (m.status === 'replied') return <span className="chip ok"><span className="dot" />{lang === 'es' ? 'Respondido' : 'Replied'}</span>;
    if (m.status === 'archived') return <span className="chip"><span className="dot" />{lang === 'es' ? 'Archivado' : 'Archived'}</span>;
    return <span className="chip info"><span className="dot" />{lang === 'es' ? 'Nuevo' : 'New'}</span>;
  };

  const FILTERS: { key: Filter; es: string; en: string }[] = [
    { key: 'all', es: 'Bandeja', en: 'Inbox' },
    { key: 'unread', es: 'No leídos', en: 'Unread' },
    { key: 'new', es: 'Nuevos', en: 'New' },
    { key: 'replied', es: 'Respondidos', en: 'Replied' },
    { key: 'archived', es: 'Archivados', en: 'Archived' },
  ];

  return (
    <>
      <div className="view-head">
        <div>
          <span className="eyebrow">{lang === 'es' ? 'Formulario de contacto' : 'Contact form'}</span>
          <div className="sec-title">{lang === 'es' ? 'Mensajes' : 'Messages'}</div>
        </div>
      </div>

      {all.length > 0 && (
        <>
          <div className="vh-actions" style={{ marginBottom: '.7rem', flexWrap: 'wrap', gap: '.4rem' }}>
            {FILTERS.map(f => (
              <button key={f.key} className={`chip${filter === f.key ? ' gold' : ''}`} style={{ cursor: 'pointer' }}
                onClick={() => setFilter(f.key)}>
                {lang === 'es' ? f.es : f.en} ({counts[f.key]})
              </button>
            ))}
          </div>
          <input
            className="inbox-search"
            placeholder={lang === 'es' ? 'Buscar por nombre, correo, teléfono o texto…' : 'Search by name, email, phone or text…'}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </>
      )}

      {!rows ? <div className="center-load"><div className="spin" /></div>
        : visible.length === 0 ? (
          <Empty icon="inbox"
            title={query.trim()
              ? (lang === 'es' ? 'Sin resultados' : 'No results')
              : (lang === 'es' ? 'Sin mensajes' : 'No messages')}
            sub={query.trim()
              ? (lang === 'es' ? 'Prueba con otra búsqueda.' : 'Try a different search.')
              : (lang === 'es' ? 'Los mensajes del formulario aparecerán aquí.' : 'Contact form messages will appear here.')} />
        ) : (
          <div className="card">
            <table><tbody>
              {visible.map(m => (
                <tr key={m.id} className="rowlink" onClick={() => openMsg(m)}>
                  <td style={{ width: 8 }}>
                    {!m.is_read && <span style={{ display: 'block', width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />}
                  </td>
                  <td>
                    <b style={{ fontWeight: m.is_read ? 500 : 700 }}>{m.name}</b>
                    <div className="muted" style={{ fontSize: '.72rem' }}>
                      {m.email}{m.phone ? ` · ${m.phone}` : ''}
                    </div>
                  </td>
                  <td style={{ fontWeight: m.is_read ? 400 : 600 }}>{subjectLabel(m.subject)}</td>
                  <td>{statusChip(m)}</td>
                  <td className="muted" style={{ fontSize: '.76rem', textAlign: 'right' }}>{fmtDate(m.created_at)}</td>
                </tr>
              ))}
            </tbody></table>
          </div>
        )}

      {open && (
        <Modal onClose={() => setOpen(null)}
          eyebrow={subjectLabel(open.subject)}
          title={open.name}
          footer={
            <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', width: '100%' }}>
              <button className="btn ghost sm" onClick={() => markUnread(open)}>
                <Icon name="eye" size={14} />{lang === 'es' ? 'No leído' : 'Unread'}
              </button>
              {open.status !== 'archived' ? (
                <button className="btn ghost sm" onClick={() => setStatus(open, 'archived')} disabled={busy === open.id}>
                  {lang === 'es' ? 'Archivar' : 'Archive'}
                </button>
              ) : (
                <button className="btn ghost sm" onClick={() => setStatus(open, 'new')} disabled={busy === open.id}>
                  {lang === 'es' ? 'Restaurar' : 'Unarchive'}
                </button>
              )}
              <button className="btn danger sm" onClick={() => remove(open)} disabled={busy === open.id}>
                <Icon name="trash" size={14} />
              </button>
              {open.status !== 'replied' && (
                <button className="btn ghost sm" onClick={() => setStatus(open, 'replied')} disabled={busy === open.id}>
                  <Icon name="check" size={14} stroke={2} />{lang === 'es' ? 'Respondido' : 'Replied'}
                </button>
              )}
              {open.email && (
                <a className="btn accent sm" style={{ marginLeft: 'auto' }}
                  href={`mailto:${open.email}?subject=Re: ${encodeURIComponent(subjectLabel(open.subject))}`}
                  onClick={() => replyAndMark(open)}>
                  <Icon name="send" size={14} />{lang === 'es' ? 'Responder' : 'Reply'}
                </a>
              )}
            </div>
          }>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '.4rem', flexWrap: 'wrap' }}>
            {statusChip(open)}
            <span className="muted" style={{ fontSize: '.76rem', marginLeft: 'auto' }}>{fmtDate(open.created_at)}</span>
          </div>

          <div className="msg-contact">
            {open.email && (
              <a href={`mailto:${open.email}`} className="msg-contact-item">
                <Icon name="mail" size={14} />{open.email}
              </a>
            )}
            {open.phone && (
              <a href={`tel:${open.phone.replace(/[^\d+]/g, '')}`} className="msg-contact-item">
                <Icon name="users" size={14} />{open.phone}
              </a>
            )}
          </div>

          <p style={{ fontSize: '.9rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{open.body}</p>
        </Modal>
      )}
    </>
  );
}
