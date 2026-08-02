import React from 'react';
import EventsFeed from '../components/EventsFeed';
import PageHeader from '../components/PageHeader';
import { useLanguage } from '../contexts/LanguageContext';

const Eventos = () => {
  const { isSpanish } = useLanguage();
  return (
    <div className="icgg-page">
      <PageHeader
        title={isSpanish ? 'Eventos' : 'Events'}
        subtitle={isSpanish ? 'Acompáñanos en todo lo que Dios está haciendo' : 'Join us in all that God is doing'}
      />
      <section className="icgg-eventos-section">
        <div className="icgg-eventos-inner">
          <EventsFeed showToggle defaultView="flyer" />
        </div>
      </section>
    </div>
  );
};
export default Eventos;
