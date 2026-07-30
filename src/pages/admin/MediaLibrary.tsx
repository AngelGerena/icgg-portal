import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLang } from '../../lib/providers';
import { useToast, Empty } from '../../components/UI';
import { Icon } from '../../components/Icon';
import type { MediaRow } from '../../lib/types';

export function MediaLibrary() {
  const { lang } = useLang();
  const { push } = useToast();
  const [rows, setRows] = useState<MediaRow[] | null>(null);
  const [uploading, setUploading] = useState(false);

  async function load() {
    const { data } = await supabase.from('media').select('*').order('created_at', { ascending: false });
    setRows((data as MediaRow[]) ?? []);
  }
  useEffect(() => { load(); }, []);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const up = await supabase.storage.from('media').upload(path, file, { upsert: false });
    if (up.error) { push(up.error.message, 'err'); setUploading(false); return; }
    const { data: pub } = supabase.storage.from('media').getPublicUrl(path);
    const { error } = await supabase.from('media').insert({
      name: file.name, path, url: pub.publicUrl, size_bytes: file.size, tag: 'General',
    });
    setUploading(false);
    if (error) { push(error.message, 'err'); return; }
    push(lang === 'es' ? 'Archivo subido' : 'File uploaded', 'ok');
    load();
  }

  function fmtSize(b: number | null) {
    if (!b) return '';
    return b > 1e6 ? (b / 1e6).toFixed(1) + ' MB' : Math.round(b / 1e3) + ' KB';
  }

  return (
    <>
      <div className="view-head">
        <div>
          <span className="eyebrow">{lang === 'es' ? 'Fotos y flyers' : 'Photos and flyers'}</span>
          <div className="sec-title">{lang === 'es' ? 'Biblioteca de medios' : 'Media library'}</div>
        </div>
        <div className="vh-actions">
          <label className="btn accent" style={{ cursor: 'pointer' }}>
            {uploading ? <span className="spin" style={{ width: 15, height: 15 }} /> : <Icon name="upload" size={15} stroke={2} />}
            {lang === 'es' ? 'Subir' : 'Upload'}
            <input type="file" accept="image/*" hidden onChange={onFile} disabled={uploading} />
          </label>
        </div>
      </div>

      {!rows ? <div className="center-load"><div className="spin" /></div>
        : rows.length === 0 ? <Empty icon="media" title={lang === 'es' ? 'Sin archivos' : 'No files'} sub={lang === 'es' ? 'Sube fotos y flyers para usarlos en el sitio.' : 'Upload photos and flyers to use on the site.'} />
        : <div className="grid g4">
          {rows.map(m => (
            <div key={m.id} className="card media-item">
              <div className="media-thumb" style={{ backgroundImage: m.url ? `url('${m.url}')` : 'none' }}>
                {m.tag && <span className="chip gold" style={{ position: 'absolute', top: '.5rem', left: '.5rem' }}>{m.tag}</span>}
              </div>
              <div className="media-info">
                <div className="mn">{m.name}</div>
                <div className="ms">{fmtSize(m.size_bytes)}</div>
              </div>
            </div>
          ))}
        </div>}
    </>
  );
}
