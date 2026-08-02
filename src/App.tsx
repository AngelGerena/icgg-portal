import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { SiteContentProvider } from './hooks/useSiteContent';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Nosotros from './pages/Nosotros';
import Ministerios from './pages/Ministerios';
import Conectate from './pages/Conectate';
import EnVivo from './pages/EnVivo';
import Dar from './pages/Dar';
import Eventos from './pages/Eventos';

function App() {
  return (
    <LanguageProvider>
      <SiteContentProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div
          className="min-h-screen bg-white overflow-x-hidden"
          style={{ backgroundColor: '#ffffff', color: '#000000', width: '100%', margin: 0, padding: 0 }}
        >
          <Header />
          <main className="overflow-x-hidden" style={{ width: '100%' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/ministerios" element={<Ministerios />} />
              <Route path="/conectate" element={<Conectate />} />
              <Route path="/en-vivo" element={<EnVivo />} />
              <Route path="/dar" element={<Dar />} />
              <Route path="/eventos" element={<Eventos />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
      </SiteContentProvider>
    </LanguageProvider>
  );
}

export default App;
