import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLang } from '../../lib/providers';
import { Empty } from '../../components/UI';
import { Icon } from '../../components/Icon';
import type { AuditRow } from '../../lib/types';
import { restoreFromTrash, logActivity } from '../../lib/activity';

interface TrashRow {
  id: string;
  source_table: string;
  record_id: string | null;
  label: string | null;
  payload: any;
  deleted_by: string;
  deleted_at: string;
}

export function AuditLog() {
  const { lang } = useLang();
  const [rows, setRows] = useState<AuditRow[] | null>(null);
  const [trash, setTrash] = useState<TrashRow[] | null>(null);
  const [restoring, setRestoring] = useState<string | null>(null);

  function loadAll() {
    supabase.from('audit_log').select('*').order('created_at', { ascending: false }).limit(100)
      .then(({ data }) => setRows((data as AuditRow[]) ?? []));
    supabase.from('trash').select('*').order('deleted_at', { ascending: false }).limit(50)
      .then(({ data }) => setTrash((data as TrashRow[]) ?? []));
  }
  useEffect(() => { loadAll(); }, []);

  async function handleRestore(t: TrashRow) {
    setRestoring(t.id);
    const ok = await restoreFromTrash(t.id, t.source_table, t.payload);
    setRestoring(null);
    if (ok) {
      await logActivity(
        lang === 'es' ? `Restauró: ${t.label || t.source_table}` : `Restored: ${t.label || t.source_table}`,
        'Restore', t.record_id || undefined
      );
      loadAll();
    }
  }

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

      {/* TRASH / RESTORE */}
      {trash && trash.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.8rem' }}>
            <Icon name="trash" size={16} />
            <b>{lang === 'es' ? 'Papelera — elementos eliminados' : 'Trash — deleted items'}</b>
            <span className="muted" style={{ fontSize: '.75rem' }}>
              {lang === 'es' ? '(puedes restaurarlos)' : '(you can restore these)'}
            </span>
          </div>
          <table>
            <thead><tr>
              <th>{lang === 'es' ? 'Elemento' : 'Item'}</th>
              <th>{lang === 'es' ? 'Eliminado por' : 'Deleted by'}</th>
              <th>{lang === 'es' ? 'Cuándo' : 'When'}</th>
              <th style={{ textAlign: 'right' }}>{lang === 'es' ? 'Acción' : 'Action'}</th>
            </tr></thead>
            <tbody>
              {trash.map(t => (
                <tr key={t.id}>
                  <td><b>{t.label || t.source_table}</b> <span className="chip gold">{t.source_table}</span></td>
                  <td className="muted" style={{ fontSize: '.8rem' }}>{t.deleted_by}</td>
                  <td className="muted" style={{ fontSize: '.76rem' }}>{fmtWhen(t.deleted_at)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn sm" onClick={() => handleRestore(t)} disabled={restoring === t.id}>
                      {restoring === t.id
                        ? <span className="spin" style={{ width: 12, height: 12 }} />
                        : <><Icon name="check" size={13} />{lang === 'es' ? 'Restaurar' : 'Restore'}</>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!rows ? <div className="center-load"><div className="spin" /></div>
        : rows.length === 0 ? <Empty icon="audit" title={lang === 'es' ? 'Sin actividad aún' : 'No activity yet'} sub={lang === 'es' ? 'Cada cambio importante quedará registrado aquí con quién lo hizo y cuándo.' : 'Every important change will be logged here with who did it and when.'} />
        : <div className="card">
          <table>
            <thead><tr>
              <th>{lang === 'es' ? 'Quién' : 'Who'}</th>
              <th>{lang === 'es' ? 'Acción' : 'Action'}</th>
              <th>{lang === 'es' ? 'Área' : 'Area'}</th>
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
