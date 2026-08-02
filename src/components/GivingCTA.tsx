import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const GivingCTA = () => {
  const { isSpanish } = useLanguage();
  return (
    <section className="icgg-givecta">
      <div className="icgg-givecta-inner">
        <p className="icgg-givecta-verse">
          {isSpanish
            ? '"Cada uno dé como propuso en su corazón... porque Dios ama al dador alegre."'
            : '"Each one must give as he has decided in his heart... for God loves a cheerful giver."'}
        </p>
        <span className="icgg-givecta-ref">2 Corintios 9:7</span>
        <h2 className="icgg-givecta-title">
          {isSpanish ? 'Da con gratitud' : 'Give with gratitude'}
        </h2>
        <Link to="/dar" className="icgg-givecta-btn">
          {isSpanish ? 'Diezmos y Ofrendas' : 'Tithes & Offerings'}
        </Link>
      </div>
    </section>
  );
};

export default GivingCTA;
