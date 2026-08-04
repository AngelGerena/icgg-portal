import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLang } from '../../lib/providers';
import { useToast } from '../../components/UI';
import { Icon } from '../../components/Icon';
import type { SiteContentRow } from '../../lib/types';
import { defaultImageFor } from '../../lib/imageDefaults';
import { logActivity } from '../../lib/activity';

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
    await logActivity(lang === 'es' ? `Editó el contenido: ${key}` : `Edited content: ${key}`, 'Site Editor', key);
    push(lang === 'es' ? 'Cambios guardados' : 'Changes saved', 'ok');
    load();
  }

  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  async function uploadImage(key: string, file: File) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      push(lang === 'es' ? 'El archivo debe ser una imagen' : 'File must be an image', 'err');
      return;
    }
    setUploadingKey(key);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${key}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('site-images')
        .upload(path, file, { cacheControl: '3600', upsert: true });
      if (upErr) { push(upErr.message, 'err'); setUploadingKey(null); return; }
      const { data } = supabase.storage.from('site-images').getPublicUrl(path);
      const url = data.publicUrl;
      // Store the same URL in both languages (an image is language-neutral).
      const { error } = await supabase.from('site_content')
        .update({ value_es: url, value_en: url }).eq('key', key);
      if (error) { push(error.message, 'err'); setUploadingKey(null); return; }
      await logActivity(lang === 'es' ? `Cambió la imagen: ${key}` : `Changed image: ${key}`, 'Images', key);
      push(lang === 'es' ? 'Imagen actualizada' : 'Image updated', 'ok');
      load();
    } catch (err: any) {
      push(err?.message || 'Upload failed', 'err');
    } finally {
      setUploadingKey(null);
    }
  }

  async function clearImage(key: string) {
    const ok = window.confirm(lang === 'es'
      ? '¿Restaurar la imagen original del sitio?'
      : 'Restore the original site image?');
    if (!ok) return;
    const { error } = await supabase.from('site_content')
      .update({ value_es: null, value_en: null }).eq('key', key);
    if (error) { push(error.message, 'err'); return; }
    await logActivity(lang === 'es' ? `Restauró la imagen original: ${key}` : `Restored original image: ${key}`, 'Images', key);
    push(lang === 'es' ? 'Imagen restaurada' : 'Image restored', 'ok');
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

            if (r.kind === 'image') {
              const customUrl = r.value_es || r.value_en || '';
              const defaultUrl = defaultImageFor(r.key);
              const shownUrl = customUrl || defaultUrl;      // what's live on the site right now
              const isCustom = !!customUrl;
              return (
                <div key={r.key} style={{ marginBottom: '1.4rem', paddingBottom: '1.4rem', borderBottom: '1px solid var(--line-soft)' }}>
                  <label style={{ marginTop: 0 }}>{r.label}{r.hint && <span className="muted" style={{ fontWeight: 400, marginLeft: '.4rem' }}>· {r.hint}</span>}</label>
                  <div style={{ display: 'flex', gap: '1.1rem', alignItems: 'flex-start', marginTop: '.6rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.35rem', flexShrink: 0 }}>
                      <div style={{
                        width: 150, height: 100, borderRadius: 10,
                        background: shownUrl ? `#0d1b30 url('${shownUrl}') center/cover no-repeat` : 'var(--line-soft)',
                        border: '1px solid var(--line)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {!shownUrl && <Icon name="upload" size={22} />}
                      </div>
                      <span className="muted" style={{ fontSize: '.68rem', textAlign: 'center' }}>
                        {isCustom
                          ? (lang === 'es' ? 'Imagen personalizada' : 'Custom image')
                          : (lang === 'es' ? 'Imagen actual del sitio' : 'Current site image')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '.55rem', flex: 1, minWidth: 160 }}>
                      <label className="btn sm" style={{ cursor: 'pointer', margin: 0, alignSelf: 'flex-start' }}>
                        {uploadingKey === r.key
                          ? <span className="spin" style={{ width: 13, height: 13 }} />
                          : <><Icon name="upload" size={13} />{lang === 'es' ? 'Subir imagen nueva' : 'Upload new image'}</>}
                        <input type="file" accept="image/*" style={{ display: 'none' }}
                          onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(r.key, f); }} />
                      </label>
                      {isCustom && (
                        <button className="btn ghost sm" style={{ margin: 0, alignSelf: 'flex-start' }} onClick={() => clearImage(r.key)}>
                          {lang === 'es' ? 'Restaurar imagen original' : 'Restore original image'}
                        </button>
                      )}
                      <p className="muted" style={{ fontSize: '.72rem', margin: '.15rem 0 0', lineHeight: 1.5 }}>
                        {isCustom
                          ? (lang === 'es' ? 'Estás mostrando una imagen personalizada. Puedes subir otra o restaurar la original.' : 'You are showing a custom image. Upload another or restore the original.')
                          : (lang === 'es' ? 'Esta es la imagen que aparece en el sitio. Sube una nueva para reemplazarla.' : 'This is the image currently on the site. Upload a new one to replace it.')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
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
