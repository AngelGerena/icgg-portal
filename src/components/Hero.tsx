import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useSiteImage, useSiteText } from '../hooks/useSiteContent';


// Premium navy/gold scrim - replaces the old blue gradient.
// Darker at the edges for text legibility, lets the photo breathe in the center.
const OVERLAY =
  'linear-gradient(to bottom, rgba(10,21,48,0.72) 0%, rgba(10,21,48,0.38) 38%, rgba(10,21,48,0.55) 72%, rgba(10,21,48,0.88) 100%)';

interface HeroSlide { desktop: string; mobile: string; }

const Hero = () => {
  const { t } = useLanguage();
  const s1 = useSiteImage('hero_slide_1', '/1.jpg');
  const s2 = useSiteImage('hero_slide_2', 'https://www.dropbox.com/scl/fi/nx2yvtadqibyn0ui7ldn1/ICGG-23-of-133.jpg?rlkey=lqvr296qej8eqvqyepl9u77lr&st=y6g398tu&raw=1');
  const s3 = useSiteImage('hero_slide_3', 'https://www.dropbox.com/scl/fi/gbb3lkzcqrn7pwz424ryo/ICCG-11-19-53-of-135.jpg?rlkey=5mr4eaq0w91l9odc1cwt5trpy&st=45emqolf&raw=1');
  const s4 = useSiteImage('hero_slide_4', '/2.jpg');
  const s5 = useSiteImage('hero_slide_5', '/3.jpg');
  const SLIDES: HeroSlide[] = [
    { desktop: s1, mobile: s1 },
    { desktop: s2, mobile: s2 },
    { desktop: s3, mobile: s3 },
    { desktop: s4, mobile: s4 },
    { desktop: s5, mobile: s5 },
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="icgg-hero relative min-h-screen flex items-center justify-center overflow-hidden">
      {SLIDES.map((image: HeroSlide, index) => (
        <div
          key={index}
          className={`absolute inset-0 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backgroundImage: `${OVERLAY}, url('${image.desktop}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transform: index === currentImageIndex ? 'scale(1.06)' : 'scale(1)',
            transition: 'opacity 1400ms ease-in-out, transform 7000ms ease-out'
          }}
        />
      ))}

      <HeroContent t={t} />

      {/* Slide progress dots */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {SLIDES.map((_, index) => (
          <span
            key={index}
            className="icgg-hero-dot"
            data-active={index === currentImageIndex ? 'true' : 'false'}
          />
        ))}
      </div>

      {/* Elegant scroll cue */}
      <a
        href="#about"
        aria-label="Scroll"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors"
        style={{ backgroundColor: 'transparent' }}
      >
        <span className="icgg-hero-scrolltext">Desliza</span>
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </a>
    </section>
  );
};

const HeroContent = ({ t }: { t: (key: string) => string }) => {
  const { isSpanish } = useLanguage();
  const joinLabel = useSiteText('hero_btn_join', 'Únete a Nosotros', 'Join Us', isSpanish);
  const servicesLabel = useSiteText('hero_btn_services', 'Nuestros Servicios', 'View Services', isSpanish);
  return (
  <div className="icgg-hero-content relative z-10 text-center px-6 max-w-4xl mx-auto">
    <p className="icgg-hero-eyebrow animate-fade-in">
      {t('hero.subtitle')}
    </p>

    <h1 className="icgg-hero-title animate-slide-up">
      Ven a casa,
      <span className="icgg-hero-title-accent"> te estábamos esperando</span>
    </h1>

    <div className="icgg-hero-divider animate-scale-in" style={{ animationDelay: '0.35s' }} />

    <p className="icgg-hero-welcome animate-fade-in" style={{ animationDelay: '0.55s' }}>
      {t('hero.welcome')}
    </p>

    <div
      className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in"
      style={{ animationDelay: '0.75s' }}
    >
      <Link to="/conectate" className="icgg-hero-btn icgg-hero-btn-gold">
        {joinLabel}
      </Link>
      <Link to="/en-vivo" className="icgg-hero-btn icgg-hero-btn-ghost">
        {servicesLabel}
      </Link>
    </div>
  </div>
  );
};

export default Hero;
