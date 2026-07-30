import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLang } from '../../lib/providers';
import { useToast, Modal, Empty } from '../../components/UI';
import { Icon } from '../../components/Icon';
import type { MessageRow } from '../../lib/types';

export function Inbox() {
  const { lang } = useLang();
  const { push } = useToast();
  const [rows, setRows] = useState<MessageRow[] | null>(null);
  const [open, setOpen] = useState<MessageRow | null>(null);

  async function load() {
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    setRows((data as MessageRow[]) ?? []);
  }
  useEffect(() => { load(); }, []);

  async function openMsg(m: MessageRow) {
    setOpen(m);
    if (!m.is_read) {
      await supabase.from('contact_messages').update({ is_read: true }).eq('id', m.id);
      load();
    }
  }

  function fmtDate(d: string) {
    return new Intl.DateTimeFormat(lang === 'es' ? 'es' : 'en', { day: 'numeric', month: 'short' }).format(new Date(d));
  }

  return (
    <>
      <div className="view-head">
        <div>
          <span className="eyebrow">{lang === 'es' ? 'Formulario de contacto' : 'Contact form'}</span>
          <div className="sec-title">{lang === 'es' ? 'Mensajes' : 'Messages'}</div>
        </div>
      </div>

      {!rows ? <div className="center-load"><div className="spin" /></div>
        : rows.length === 0 ? <Empty icon="inbox" title={lang === 'es' ? 'Sin mensajes' : 'No messages'} sub={lang === 'es' ? 'Los mensajes del formulario aparecerán aquí.' : 'Contact form messages will appear here.'} />
        : <div className="card">
          <table><tbody>
            {rows.map(m => (
              <tr key={m.id} className="rowlink" onClick={() => openMsg(m)}>
                <td style={{ width: 8 }}>{!m.is_read && <span style={{ display: 'block', width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />}</td>
                <td><b style={{ fontWeight: m.is_read ? 500 : 700 }}>{m.name}</b><div className="muted" style={{ fontSize: '.72rem' }}>{m.email}</div></td>
                <td style={{ fontWeight: m.is_read ? 400 : 600 }}>{m.subject}</td>
                <td className="muted" style={{ fontSize: '.76rem', textAlign: 'right' }}>{fmtDate(m.created_at)}</td>
              </tr>
            ))}
          </tbody></table>
        </div>}

      {open && (
        <Modal onClose={() => setOpen(null)} eyebrow={open.email || ''} title={open.subject || (lang === 'es' ? 'Mensaje' : 'Message')}
          footer={<>
            <button className="btn ghost" onClick={() => setOpen(null)}>{lang === 'es' ? 'Cerrar' : 'Close'}</button>
            {open.email && <a className="btn accent" href={`mailto:${open.email}?subject=Re: ${encodeURIComponent(open.subject || '')}`}><Icon name="send" size={14} />{lang === 'es' ? 'Responder' : 'Reply'}</a>}
          </>}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '1rem' }}>
            <b>{open.name}</b>
            <span className="muted" style={{ fontSize: '.76rem', marginLeft: 'auto' }}>{fmtDate(open.created_at)}</span>
          </div>
          <p style={{ fontSize: '.9rem', lineHeight: 1.7 }}>{open.body}</p>
        </Modal>
      )}
    </>
  );
}
