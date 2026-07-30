import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLang } from '../../lib/providers';
import { useToast } from '../../components/UI';
import { Icon } from '../../components/Icon';
import type { SiteContentRow } from '../../lib/types';

export function SiteEditor() {
  const { lang } = useLang();
  const { push } = useToast();
  const [rows, setRows] = useState<SiteContentRow[] | null>(null);
  const [dirty, setDirty] = useState<Record<string, { value_es: string; value_en: string }>>({});
  const [saving, setSaving] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase.from('site_content').select('*').order('sort_order');
    setRows((data as SiteContentRow[]) ?? []);
  }
  useEffect(() => { load(); }, []);

  function edit(key: string, field: 'value_es' | 'value_en', val: string, row: SiteContentRow) {
    setDirty(d => ({
      ...d,
      [key]: {
        value_es: field === 'value_es' ? val : (d[key]?.value_es ?? row.value_es ?? ''),
        value_en: field === 'value_en' ? val : (d[key]?.value_en ?? row.value_en ?? ''),
      },
    }));
  }
  async function save(key: string) {
    const d = dirty[key];
    if (!d) return;
    setSaving(key);
    const { error } = await supabase.from('site_content').update({ value_es: d.value_es || null, value_en: d.value_en || null }).eq('key', key);
    setSaving(null);
    if (error) { push(error.message, 'err'); return; }
    setDirty(x => { const n = { ...x }; delete n[key]; return n; });
    push(lang === 'es' ? 'Cambios guardados' : 'Changes saved', 'ok');
    load();
  }

  if (!rows) return <div className="center-load"><div className="spin" /></div>;

  // group by section
  const sections = [...new Set(rows.map(r => r.section))];

  return (
    <>
      <div className="view-head">
        <div>
          <span className="eyebrow">{lang === 'es' ? 'Edición segura' : 'Safe editing'}</span>
          <div className="sec-title">{lang === 'es' ? 'Editor del sitio' : 'Site editor'}</div>
        </div>
      </div>

      <div className="notice info" style={{ marginBottom: '1.3rem' }}>
        <Icon name="check" size={16} className="ic" />
        <div className="nt"><b>{lang === 'es' ? 'No puedes romperlo' : "You can't break it"}</b> — {lang === 'es' ? 'si dejas un campo vacío, el sitio muestra el texto original de la página.' : 'leave a field blank and the site shows the original page text.'}</div>
      </div>

      {sections.map(sec => (
        <div key={sec} className="card card-p" style={{ marginBottom: '1.1rem' }}>
          <div className="eyebrow" style={{ marginBottom: '1rem', textTransform: 'capitalize' }}>{sec}</div>
          {rows.filter(r => r.section === sec).map(r => {
            const es = dirty[r.key]?.value_es ?? r.value_es ?? '';
            const en = dirty[r.key]?.value_en ?? r.value_en ?? '';
            const isDirty = !!dirty[r.key];
            const Field = r.kind === 'longtext' ? 'textarea' : 'input';
            return (
              <div key={r.key} style={{ marginBottom: '1.2rem', paddingBottom: '1.2rem', borderBottom: '1px solid var(--line-soft)' }}>
                <label style={{ marginTop: 0 }}>{r.label}{r.hint && <span className="muted" style={{ fontWeight: 400, marginLeft: '.4rem' }}>· {r.hint}</span>}</label>
                <div className="field-row">
                  <Field value={es} placeholder={lang === 'es' ? 'Texto en español' : 'Spanish text'} onChange={(e: any) => edit(r.key, 'value_es', e.target.value, r)} />
                  <Field value={en} placeholder={lang === 'es' ? 'Texto en inglés' : 'English text'} onChange={(e: any) => edit(r.key, 'value_en', e.target.value, r)} />
                </div>
                {isDirty && (
                  <button className="btn sm" style={{ marginTop: '.7rem' }} disabled={saving === r.key} onClick={() => save(r.key)}>
                    {saving === r.key ? <span className="spin" style={{ width: 13, height: 13 }} /> : <Icon name="check" size={13} stroke={2} />}
                    {lang === 'es' ? 'Guardar' : 'Save'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}
