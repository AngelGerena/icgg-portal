import React from 'react';
import LiveStream from '../components/LiveStream';
import Services from '../components/Services';
import PageHeader from '../components/PageHeader';
import { useLanguage } from '../contexts/LanguageContext';

const EnVivo = () => {
  const { isSpanish } = useLanguage();
  return (
    <div className="icgg-page">
      <PageHeader
        title={isSpanish ? 'En Vivo' : 'Live'}
        subtitle={isSpanish ? 'Adora con nosotros, dondequiera que estés' : 'Worship with us, wherever you are'}
      />
      <LiveStream />
      <Services />
    </div>
  );
};
export default EnVivo;
