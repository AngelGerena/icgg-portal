import React from 'react';
import Ministries from '../components/Ministries';
import AvivaKids from '../components/AvivaKids';
import ClasePastorales from '../components/ClasePastorales';
import Alineados from '../components/Alineados';
import PageHeader from '../components/PageHeader';
import { useLanguage } from '../contexts/LanguageContext';

const Ministerios = () => {
  const { isSpanish } = useLanguage();
  return (
    <div className="icgg-page">
      <PageHeader
        title={isSpanish ? 'Ministerios' : 'Ministries'}
        subtitle={isSpanish ? 'Crece, sirve y encuentra tu lugar' : 'Grow, serve, and find your place'}
      />
      <Ministries />
      <AvivaKids />
      <ClasePastorales />
      <Alineados />
    </div>
  );
};
export default Ministerios;
