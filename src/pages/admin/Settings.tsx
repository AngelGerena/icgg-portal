import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useLang } from '../../lib/providers';
import { useToast, Toggle } from '../../components/UI';
import { Icon } from '../../components/Icon';
import type { BusinessSettings, AdminUser, AiRunRow } from '../../lib/types';

export function Settings() {
  const { lang } = useLang();
  const { push } = useToast();
  const [s, setS] = useState<BusinessSettings | null>(null);
  const [team, setTeam] = useState<AdminUser[]>([]);
  const [cost, setCost] = useState({ runs: 0, usd: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const [biz, admins, runs] = await Promise.all([
        supabase.from('business_settings').select('*').eq('id', 1).maybeSingle(),
        supabase.from('admin_users').select('id, user_id, email, full_name, role, is_super_admin'),
        supabase.from('ai_runs').select('input_tokens, output_tokens'),
      ]);
      setS(biz.data as BusinessSettings);
      setTeam((admins.data as AdminUser[]) ?? []);
      const rs = (runs.data as AiRunRow[]) ?? [];
      const usd = rs.reduce((sum, r) => sum + ((r.input_tokens ?? 0) * 3 + (r.output_tokens ?? 0) * 15) / 1e6, 0);
      setCost({ runs: rs.length, usd });
    })();
  }, []);

  async function save() {
    if (!s) return;
    setSaving(true);
    const { error } = await supabase.from('business_settings').update({
      name: s.name, city: s.city, email: s.email, phone: s.phone,
      sunday_time: s.sunday_time, thursday_time: s.thursday_time,
    }).eq('id', 1);
    setSaving(false);
    push(error ? error.message : (lang === 'es' ? 'Guardado' : 'Saved'), error ? 'err' : 'ok');
  }
  async function toggleAI() {
    if (!s) return;
    const next = !s.ai_enabled;
    setS({ ...s, ai_enabled: next });
    await supabase.from('business_settings').update({ ai_enabled: next }).eq('id', 1);
    push(next ? (lang === 'es' ? 'IA activada' : 'AI enabled') : (lang === 'es' ? 'IA en pausa' : 'AI paused'), 'ok');
  }

  if (!s) return <div className="center-load"><div className="spin" /></div>;

  return (
    <>
      <div className="view-head">
        <div>
          <span className="eyebrow">{lang === 'es' ? 'Configuración' : 'Configuration'}</span>
          <div className="sec-title">{lang === 'es' ? 'Ajustes' : 'Settings'}</div>
        </div>
      </div>

      <div className="grid g2" style={{ alignItems: 'start' }}>
        <div className="card card-p">
          <div className="eyebrow" style={{ marginBottom: '1rem' }}>{lang === 'es' ? 'Perfil del ministerio' : 'Ministry profile'}</div>
          <label>{lang === 'es' ? 'Nombre' : 'Name'}</label>
          <input value={s.name} onChange={e => setS({ ...s, name: e.target.value })} />
          <div className="field-row">
            <div><label>{lang === 'es' ? 'Ciudad' : 'City'}</label><input value={s.city ?? ''} onChange={e => setS({ ...s, city: e.target.value })} /></div>
            <div><label>Email</label><input value={s.email ?? ''} onChange={e => setS({ ...s, email: e.target.value })} /></div>
          </div>
          <div className="field-row">
            <div><label>{lang === 'es' ? 'Domingo' : 'Sunday'}</label><input value={s.sunday_time ?? ''} onChange={e => setS({ ...s, sunday_time: e.target.value })} /></div>
            <div><label>{lang === 'es' ? 'Jueves' : 'Thursday'}</label><input value={s.thursday_time ?? ''} onChange={e => setS({ ...s, thursday_time: e.target.value })} /></div>
          </div>
          <button className="btn" style={{ marginTop: '1rem' }} disabled={saving} onClick={save}>{saving ? <span className="spin" style={{ width: 14, height: 14 }} /> : <Icon name="check" size={14} stroke={2} />}{lang === 'es' ? 'Guardar' : 'Save'}</button>
        </div>

        <div className="grid" style={{ gap: '1.1rem' }}>
          <div className="card card-p">
            <div className="eyebrow" style={{ marginBottom: '1rem' }}>{lang === 'es' ? 'Inteligencia artificial' : 'Artificial intelligence'}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div><b style={{ fontSize: '.9rem' }}>{lang === 'es' ? 'Interruptor maestro' : 'Master switch'}</b><div className="muted" style={{ fontSize: '.76rem' }}>{lang === 'es' ? 'Apaga toda la IA de golpe' : 'Turns off all AI at once'}</div></div>
              <Toggle on={s.ai_enabled} onClick={toggleAI} />
            </div>
          </div>
          <div className="card card-p">
            <div className="eyebrow" style={{ marginBottom: '.8rem' }}>{lang === 'es' ? 'Costo de IA' : 'AI cost'}</div>
            <div className="display" style={{ fontSize: '2.2rem', fontWeight: 600 }}>${cost.usd.toFixed(2)}</div>
            <div className="muted" style={{ fontSize: '.76rem' }}>{cost.runs} {lang === 'es' ? 'generaciones registradas' : 'generations logged'}</div>
          </div>
          <div className="card card-p">
            <div className="eyebrow" style={{ marginBottom: '.8rem' }}>{lang === 'es' ? 'Equipo' : 'Team'}</div>
            {team.map(u => (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '.6rem', padding: '.4rem 0' }}>
                <div className="avatar" style={{ width: 30, height: 30, fontSize: '.72rem' }}>{(u.full_name || u.email).split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}</div>
                <div><b style={{ fontSize: '.84rem' }}>{u.full_name || u.email}</b><div className="muted" style={{ fontSize: '.72rem' }}>{u.is_super_admin ? 'Super Admin' : u.role}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
