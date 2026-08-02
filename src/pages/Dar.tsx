import React from 'react';
import Giving from '../components/Giving';
import PageHeader from '../components/PageHeader';
import { useLanguage } from '../contexts/LanguageContext';

const Dar = () => {
  const { isSpanish } = useLanguage();
  return (
    <div className="icgg-page">
      <PageHeader
        title={isSpanish ? 'Diezmos y Ofrendas' : 'Tithes & Offerings'}
        subtitle={isSpanish ? 'Damos con gratitud y alegría' : 'We give with gratitude and joy'}
      />
      <Giving />
    </div>
  );
};
export default Dar;
