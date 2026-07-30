import { useState } from 'react';
import { useAuth, useTheme, useLang } from '../lib/providers';
import { useT } from '../lib/i18n';
import { hasConfig } from '../lib/supabase';
import { Icon } from '../components/Icon';

export function Login() {
  const { signIn } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang } = useLang();
  const t = useT();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasConfig) { setError(t('login.noconfig')); return; }
    setBusy(true); setError(null);
    const { error } = await signIn(email.trim(), password);
    if (error) {
      setError(/invalid/i.test(error) ? t('login.error') : error);
      setBusy(false);
    }
    // success: AuthProvider flips session and App routes away
  }

  return (
    <div className="login-wrap">
      <div className="login-art">
        <div className="login-art-inner">
          <img className="login-lockup" src="/images/icgg-lockup-light.png" alt="Iglesia Cristiana Gracia y Gloria" />
          <h2>Portal <em>Administrativo</em></h2>
          <p>Sanford, Florida</p>
          <div className="verse">"Mas yo y mi casa serviremos a Jehová" — Josué 24:15</div>
        </div>
      </div>

      <div className="login-form-side">
        <div className="login-card">
          <div className="login-toggles">
            <div className="seg">
              <button className={lang === 'es' ? 'on' : ''} onClick={() => setLang('es')}>ES</button>
              <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
            </div>
            <button className="icon-btn" onClick={toggleTheme} aria-label="theme">
              <Icon name={theme === 'light' ? 'moon' : 'sun'} size={17} />
            </button>
          </div>

          <span className="eyebrow">ICGG</span>
          <h1>{t('login.title')}</h1>
          <p className="ls">{t('login.sub')}</p>

          <form onSubmit={submit}>
            <label htmlFor="email">{t('login.email')}</label>
            <input id="email" type="email" autoComplete="email" value={email}
              onChange={e => setEmail(e.target.value)} placeholder="you@email.com" required />

            <label htmlFor="password">{t('login.password')}</label>
            <input id="password" type="password" autoComplete="current-password" value={password}
              onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />

            {error && (
              <div style={{ marginTop: '1rem', padding: '.7rem .9rem', borderRadius: 9,
                background: 'var(--danger-bg)', color: 'var(--danger)', fontSize: '.82rem', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <button className="btn accent block" type="submit" disabled={busy} style={{ marginTop: '1.5rem' }}>
              {busy ? <><span className="spin" style={{ width: 15, height: 15 }} /> {t('login.title')}</>
                    : <><Icon name="lock" size={15} stroke={2} /> {t('signin')}</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
