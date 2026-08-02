import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Languages, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LOGO_SRC = '/icgg-logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const { isSpanish, toggleLanguage, t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Home hero is full-bleed, so nav starts transparent there.
  // On inner pages there is no hero behind the nav, so keep it solid.
  const isHome = location.pathname === '/';
  const solid = scrolled || !isHome;

  const closeAll = () => {
    setIsMenuOpen(false);
    setOpenGroup(null);
  };

  const nosotros = [
    { to: '/nosotros', label: t('nav.about') },
    { to: '/conectate#prayer', label: isSpanish ? 'Oración' : 'Prayer' },
    { to: '/ministerios#clase-pastorales', label: isSpanish ? 'Clase Pastorales' : 'Pastoral Classes' },
    { to: '/ministerios#aviva-kids', label: 'Aviva Kids' }
  ];

  const conectate = [
    { to: '/conectate#newcomers', label: isSpanish ? 'Soy Nuevo' : 'Im New' },
    { to: '/eventos', label: t('nav.events') },
    { to: '/conectate#contact', label: t('nav.contact') },
    { to: '/conectate#prayer', label: isSpanish ? 'Peticiones de Oración' : 'Prayer Requests' }
  ];

  return (
    <header className={`icgg-nav ${solid ? 'icgg-nav-scrolled' : ''}`}>
      <div className="icgg-nav-inner">
        <Link to="/" className="icgg-nav-brand" onClick={closeAll}>
          <img src={LOGO_SRC} alt="I.C.G.G." className="icgg-nav-logo" />
          <span className="icgg-nav-brandtext">
            <span className="icgg-nav-brandmark">I.C.G.G.</span>
            <span className="icgg-nav-brandsub">Gracia y Gloria</span>
          </span>
        </Link>

        <nav className="icgg-nav-links">
          <Link to="/" className="icgg-nav-link" onClick={closeAll}>{t('nav.home')}</Link>

          <div
            className="icgg-nav-group"
            onMouseEnter={() => setOpenGroup('nosotros')}
            onMouseLeave={() => setOpenGroup(null)}
          >
            <button className="icgg-nav-link icgg-nav-trigger" type="button">
              {isSpanish ? 'Nosotros' : 'About'}
              <ChevronDown className="icgg-nav-caret" />
            </button>
            <div className={`icgg-nav-dropdown ${openGroup === 'nosotros' ? 'is-open' : ''}`}>
              {nosotros.map((item, i) => (
                <Link key={i} to={item.to} className="icgg-nav-dropitem" onClick={closeAll}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <Link to="/ministerios" className="icgg-nav-link" onClick={closeAll}>{t('nav.ministries')}</Link>
          <Link to="/en-vivo" className="icgg-nav-link" onClick={closeAll}>{t('nav.live')}</Link>

          <div
            className="icgg-nav-group"
            onMouseEnter={() => setOpenGroup('conectate')}
            onMouseLeave={() => setOpenGroup(null)}
          >
            <button className="icgg-nav-link icgg-nav-trigger" type="button">
              {isSpanish ? 'Conéctate' : 'Connect'}
              <ChevronDown className="icgg-nav-caret" />
            </button>
            <div className={`icgg-nav-dropdown ${openGroup === 'conectate' ? 'is-open' : ''}`}>
              {conectate.map((item, i) => (
                <Link key={i} to={item.to} className="icgg-nav-dropitem" onClick={closeAll}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="icgg-nav-actions">
          <button
            onClick={toggleLanguage}
            className="icgg-nav-lang"
            title={isSpanish ? 'Switch to English' : 'Cambiar a Espanol'}
            type="button"
          >
            <Languages className="icgg-nav-langicon" />
            <span>{isSpanish ? 'EN' : 'ES'}</span>
          </button>

          <Link to="/dar" className="icgg-nav-give" onClick={closeAll}>
            {t('nav.giving')}
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="icgg-nav-burger"
            aria-label="Menu"
            type="button"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div className={`icgg-nav-drawer ${isMenuOpen ? 'is-open' : ''}`}>
        <Link to="/" className="icgg-nav-drawerlink" onClick={closeAll}>{t('nav.home')}</Link>
        <Link to="/nosotros" className="icgg-nav-drawerlink" onClick={closeAll}>{t('nav.about')}</Link>
        <Link to="/ministerios" className="icgg-nav-drawerlink" onClick={closeAll}>{t('nav.ministries')}</Link>
        <Link to="/en-vivo" className="icgg-nav-drawerlink" onClick={closeAll}>{t('nav.live')}</Link>
        <Link to="/conectate" className="icgg-nav-drawerlink" onClick={closeAll}>{isSpanish ? 'Conéctate' : 'Connect'}</Link>
        <Link to="/eventos" className="icgg-nav-drawerlink" onClick={closeAll}>{t('nav.events')}</Link>
        <Link to="/dar" className="icgg-nav-drawerlink icgg-nav-drawergive" onClick={closeAll}>{t('nav.giving')}</Link>
        <button
          onClick={() => { toggleLanguage(); }}
          className="icgg-nav-drawerlink icgg-nav-drawerlang"
          type="button"
        >
          <Languages className="h-4 w-4" />
          {isSpanish ? 'Switch to English' : 'Cambiar a Español'}
        </button>
      </div>
    </header>
  );
};

export default Header;
