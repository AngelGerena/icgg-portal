import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth, useTheme, useLang } from '../../lib/providers';
import { useT } from '../../lib/i18n';
import { supabase } from '../../lib/supabase';
import { Icon } from '../../components/Icon';

import { Today } from './Today';
import { Events } from './Events';
import { BlogStudio } from './BlogStudio';
import { Autopilot } from './Autopilot';
import { SiteEditor } from './SiteEditor';
import { MediaLibrary } from './MediaLibrary';
import { Sermons } from './Sermons';
import { Prayer } from './Prayer';
import { Inbox } from './Inbox';
import { Settings } from './Settings';
import { AuditLog } from './AuditLog';

const NAV = [
  { label: 'nav.main', items: [['today', 'today'], ['inbox', 'inbox'], ['prayer', 'prayer']] },
  { label: 'nav.content', items: [['site', 'site'], ['events', 'events'], ['media', 'media'], ['sermons', 'sermons']] },
  { label: 'nav.intelligence', items: [['ai', 'ai'], ['autopilot', 'autopilot']] },
  { label: 'nav.system', items: [['settings', 'settings'], ['audit', 'audit']] },
] as const;

export function AdminLayout() {
  const { admin, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang } = useLang();
  const t = useT();
  const nav = useNavigate();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const [badges, setBadges] = useState({ inbox: 0, prayer: 0 });

  const current = loc.pathname.replace('/', '') || 'today';

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const [msgs, prayers] = await Promise.all([
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('prayer_requests').select('id', { count: 'exact', head: true }).eq('status', 'new'),
      ]);
      if (alive) setBadges({ inbox: msgs.count ?? 0, prayer: prayers.count ?? 0 });
    };
    load();
    // The portal stays open on a screen all day. Refresh so a prayer request
    // that arrives mid-afternoon shows up without anyone reloading.
    const id = setInterval(load, 60_000);
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    return () => { alive = false; clearInterval(id); window.removeEventListener('focus', onFocus); };
  }, [loc.pathname]);

  useEffect(() => { setOpen(false); }, [loc.pathname]);

  const initials = (admin?.full_name || admin?.email || 'A').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="shell">
      {open && <div className="side-backdrop" onClick={() => setOpen(false)} />}
      <aside className={`side ${open ? 'open' : ''}`}>
        <div className="side-brand">
          <img src="/images/icgg-icon-light.png" alt="ICGG" />
          <div>
            <div className="bt">ICGG</div>
            <div className="bs">Portal Admin</div>
          </div>
        </div>
        <nav className="side-nav">
          {NAV.map(group => (
            <div key={group.label}>
              <div className="nav-label">{t(group.label)}</div>
              {group.items.map(([key, route]) => {
                const badge = key === 'inbox' ? badges.inbox : key === 'prayer' ? badges.prayer : 0;
                return (
                  <button key={key} className={`nav-item ${current === route ? 'active' : ''}`}
                    onClick={() => nav('/' + route)}>
                    <Icon name={key} size={18} />
                    <span>{t(key)}</span>
                    {badge > 0 && <span className="badge">{badge}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="side-foot">
          <div className="side-user">
            <div className="avatar">{initials}</div>
            <div>
              <div className="un">{admin?.full_name || 'Admin'}</div>
              <div className="ur">{admin?.is_super_admin ? 'Super Admin' : t('nav.content')}</div>
            </div>
          </div>
          <button className="side-signout" onClick={signOut}>
            <Icon name="logout" size={15} /> {t('signout')}
          </button>
        </div>
      </aside>

      <div className="main">
        <div className="topbar">
          <button className="icon-btn mobile-menu-btn" onClick={() => setOpen(true)} aria-label="Menu">
            <Icon name="menu" size={20} stroke={2} />
          </button>
          <div className="topbar-title">
            <h1 className="display">{t(current)}</h1>
            <div className="sub">{t(current + '.sub')}</div>
          </div>
          <div className="topbar-actions">
            <div className="seg">
              <button className={lang === 'es' ? 'on' : ''} onClick={() => setLang('es')}>ES</button>
              <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
            </div>
            <button className="icon-btn" onClick={toggleTheme} aria-label="theme" title="Light / Dark">
              <Icon name={theme === 'light' ? 'moon' : 'sun'} size={17} />
            </button>
          </div>
        </div>

        <div className="content">
          <Routes>
            <Route path="/" element={<Today />} />
            <Route path="/today" element={<Navigate to="/" replace />} />
            <Route path="/events" element={<Events />} />
            <Route path="/ai" element={<BlogStudio />} />
            <Route path="/autopilot" element={<Autopilot />} />
            <Route path="/site" element={<SiteEditor />} />
            <Route path="/media" element={<MediaLibrary />} />
            <Route path="/sermons" element={<Sermons />} />
            <Route path="/prayer" element={<Prayer />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/audit" element={<AuditLog />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
