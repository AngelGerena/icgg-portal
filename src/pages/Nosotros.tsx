import React from 'react';
import About from '../components/About';
import PageHeader from '../components/PageHeader';
import { useLanguage } from '../contexts/LanguageContext';

const Nosotros = () => {
  const { isSpanish } = useLanguage();
  return (
    <div className="icgg-page">
      <PageHeader
        title={isSpanish ? 'Nosotros' : 'About Us'}
        subtitle={isSpanish ? 'Conoce nuestra familia de fe' : 'Get to know our family of faith'}
      />
      <About />
    </div>
  );
};
export default Nosotros;
