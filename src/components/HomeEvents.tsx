import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const HomeEvents = () => {
  const { isSpanish } = useLanguage();
  return (
    <section className="icgg-eventscta">
      <div className="icgg-eventscta-inner">
        <span className="icgg-eventscta-icon"><Calendar /></span>
        <p className="icgg-eventscta-eyebrow">{isSpanish ? 'Calendario del Ministerio' : 'Ministry Calendar'}</p>
        <h2 className="icgg-eventscta-title">
          {isSpanish ? 'Hay algo para ti este mes' : 'There is something for you this month'}
        </h2>
        <p className="icgg-eventscta-text">
          {isSpanish
            ? 'Servicios, conferencias, ayunos y encuentros especiales. Descubre todo lo que Dios está haciendo en nuestra familia de fe.'
            : 'Services, conferences, fasts, and special gatherings. Discover all that God is doing in our family of faith.'}
        </p>
        <Link to="/eventos" className="icgg-eventscta-btn">
          {isSpanish ? 'Ver todos los eventos' : 'View all events'}
          <ArrowRight className="icgg-eventscta-arrow" />
        </Link>
      </div>
    </section>
  );
};
export default HomeEvents;
