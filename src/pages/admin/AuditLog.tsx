import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLang } from '../../lib/providers';
import { Empty } from '../../components/UI';
import { Icon } from '../../components/Icon';
import type { AuditRow } from '../../lib/types';

export function AuditLog() {
  const { lang } = useLang();
  const [rows, setRows] = useState<AuditRow[] | null>(null);

  useEffect(() => {
    supabase.from('audit_log').select('*').order('created_at', { ascending: false }).limit(100)
      .then(({ data }) => setRows((data as AuditRow[]) ?? []));
  }, []);

  function fmtWhen(d: string) {
    return new Intl.DateTimeFormat(lang === 'es' ? 'es' : 'en', {
      day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit',
    }).format(new Date(d));
  }

  return (
    <>
      <div className="view-head">
        <div>
          <span className="eyebrow">{lang === 'es' ? 'Transparencia' : 'Transparency'}</span>
          <div className="sec-title">{lang === 'es' ? 'Registro de actividad' : 'Activity log'}</div>
        </div>
      </div>

      {!rows ? <div className="center-load"><div className="spin" /></div>
        : rows.length === 0 ? <Empty icon="audit" title={lang === 'es' ? 'Sin actividad aún' : 'No activity yet'} sub={lang === 'es' ? 'Cada cambio importante quedará registrado aquí con quién lo hizo y cuándo.' : 'Every important change will be logged here with who did it and when.'} />
        : <div className="card">
          <table>
            <thead><tr>
              <th>{lang === 'es' ? 'Quién' : 'Who'}</th>
              <th>{lang === 'es' ? 'Acción' : 'Action'}</th>
              <th>{lang === 'es' ? 'Tipo' : 'Type'}</th>
              <th style={{ textAlign: 'right' }}>{lang === 'es' ? 'Cuándo' : 'When'}</th>
            </tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td><b>{r.actor}</b></td>
                  <td>{r.action}</td>
                  <td>{r.kind && <span className="chip gold">{r.kind}</span>}</td>
                  <td className="muted" style={{ fontSize: '.76rem', textAlign: 'right' }}>{fmtWhen(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
    </>
  );
}
