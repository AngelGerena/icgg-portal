import React from 'react';
import Newcomers from '../components/Newcomers';
import Prayer from '../components/Prayer';
import Contact from '../components/Contact';
import FacebookPageFeed from '../components/FacebookPageFeed';
import PageHeader from '../components/PageHeader';
import { useLanguage } from '../contexts/LanguageContext';

const Conectate = () => {
  const { isSpanish } = useLanguage();
  return (
    <div className="icgg-page">
      <PageHeader
        title={isSpanish ? 'Conéctate' : 'Connect'}
        subtitle={isSpanish ? 'Estamos aquí para ti. Da el primer paso.' : 'We are here for you. Take the first step.'}
      />
      <Newcomers />
      <Prayer />
      <Contact />
      <FacebookPageFeed />
    </div>
  );
};
export default Conectate;
