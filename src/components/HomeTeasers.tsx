import React from 'react';
import { Link } from 'react-router-dom';
import { Users, HandHeart, Radio, Heart, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const HomeTeasers = () => {
  const { isSpanish } = useLanguage();

  const cards = [
    {
      to: '/nosotros',
      icon: Heart,
      title: isSpanish ? 'Nosotros' : 'About Us',
      text: isSpanish
        ? 'Conoce quiénes somos, lo que creemos y el corazón de nuestra iglesia.'
        : 'Discover who we are, what we believe, and the heart of our church.'
    },
    {
      to: '/ministerios',
      icon: Users,
      title: isSpanish ? 'Ministerios' : 'Ministries',
      text: isSpanish
        ? 'Encuentra tu lugar para crecer y servir — para toda la familia.'
        : 'Find your place to grow and serve — for the whole family.'
    },
    {
      to: '/conectate',
      icon: HandHeart,
      title: isSpanish ? 'Conéctate' : 'Connect',
      text: isSpanish
        ? 'Eres nuevo? Necesitas oración? Da el primer paso con nosotros.'
        : 'New here? Need prayer? Take the first step with us.'
    },
    {
      to: '/en-vivo',
      icon: Radio,
      title: isSpanish ? 'En Vivo' : 'Live',
      text: isSpanish
        ? 'Únete a nuestros servicios en línea, dondequiera que estés.'
        : 'Join our services online, wherever you are.'
    }
  ];

  return (
    <section className="icgg-teasers">
      <div className="icgg-teasers-inner">
        <div className="icgg-teasers-head">
          <p className="icgg-teasers-eyebrow">{isSpanish ? 'Explora' : 'Explore'}</p>
          <h2 className="icgg-teasers-title">
            {isSpanish ? 'Hay un lugar para ti aquí' : 'There is a place for you here'}
          </h2>
        </div>
        <div className="icgg-teasers-grid">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <Link key={c.to} to={c.to} className="icgg-teaser-card">
                <span className="icgg-teaser-icon"><Icon /></span>
                <h3 className="icgg-teaser-cardtitle">{c.title}</h3>
                <p className="icgg-teaser-cardtext">{c.text}</p>
                <span className="icgg-teaser-link">
                  {isSpanish ? 'Ver más' : 'Learn more'} <ArrowRight className="icgg-teaser-arrow" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeTeasers;
