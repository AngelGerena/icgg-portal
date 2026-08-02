import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './lib/providers';
import { Login } from './pages/Login';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Icon } from './components/Icon';
import { useT } from './lib/i18n';

export default function App() {
  const { loading, session, admin } = useAuth();
  const t = useT();

  if (loading) {
    return (
      <div className="center-load">
        <div className="spin" />
        <span>{t('loading')}</span>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={session && admin ? <Navigate to="/" replace /> : <Login />} />
      <Route
        path="/*"
        element={
          session && admin ? <AdminLayout />
          : session && !admin ? <NoAccess />
          : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

function NoAccess() {
  const { signOut } = useAuth();
  const t = useT();
  return (
    <div className="center-load">
      <Icon name="lock" size={40} stroke={1.4} style={{ color: 'var(--muted)' }} />
      <h2 className="display" style={{ fontSize: '1.6rem' }}>{t('login.notadmin')}</h2>
      <button className="btn ghost" onClick={signOut}>{t('signout')}</button>
    </div>
  );
}
