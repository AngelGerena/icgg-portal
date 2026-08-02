import React, { useState } from 'react';
import { Heart, Users, Book, Cross, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSiteImage } from '../hooks/useSiteContent';
import BeliefsModal from './BeliefsModal';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const About = () => {
  const { t } = useLanguage();
  const aboutImg = useSiteImage('about_image', '/feetwash.jpg');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: imageRef, isVisible: imageVisible } = useScrollAnimation();
  const { ref: valuesRef, isVisible: valuesVisible } = useScrollAnimation();

  return (
    <section id="about" className="py-20 bg-gray-50" style={{backgroundColor: '#f9fafb'}}>
      <div className="container mx-auto px-4">
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('about.title')}
          </h2>
          <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('about.description')}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 inline-flex items-center text-red-600 hover:text-red-700 font-semibold text-lg transition-all hover:scale-105 group relative"
          >
            <Sparkles className="h-6 w-6 mr-2 animate-pulse text-amber-500" />
            <span className="underline decoration-2 underline-offset-4">
              {t('about.beliefs')}
            </span>
            <Sparkles className="h-6 w-6 ml-2 animate-pulse text-amber-500" style={{ animationDelay: '0.5s' }} />
            <span className="absolute -inset-2 bg-red-100 rounded-lg opacity-0 group-hover:opacity-30 transition-opacity -z-10"></span>
          </button>
        </div>

        <div
          ref={imageRef}
          className={`grid md:grid-cols-2 gap-12 items-center mb-16 transition-all duration-1000 ${
            imageVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}
        >
          <div className="transform transition-transform duration-500 hover:scale-105">
            <img
              src={aboutImg}
              alt="Lavatorio de Pies - Nuestra Tradición de Servicio"
              className="rounded-lg shadow-xl w-full h-96 object-cover"
            />
          </div>
          <div className={`transition-all duration-1000 delay-200 ${
            imageVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">{t('about.mission')}</h3>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              {t('about.missionText1')}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t('about.missionText2')}
            </p>
          </div>
        </div>

        <div
          ref={valuesRef}
          className="grid md:grid-cols-4 gap-8"
        >
          <div className={`text-center group transition-all duration-700 ${
            valuesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-700 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">{t('about.love')}</h4>
            <p className="text-gray-600">{t('about.loveDesc')}</p>
          </div>

          <div className={`text-center group transition-all duration-700 delay-100 ${
            valuesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-700 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">{t('about.community')}</h4>
            <p className="text-gray-600">{t('about.communityDesc')}</p>
          </div>

          <div className={`text-center group transition-all duration-700 delay-200 ${
            valuesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="bg-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-700 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
              <Book className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">{t('about.word')}</h4>
            <p className="text-gray-600">{t('about.wordDesc')}</p>
          </div>

          <div className={`text-center group transition-all duration-700 delay-300 ${
            valuesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-700 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
              <Cross className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">{t('about.faith')}</h4>
            <p className="text-gray-600">{t('about.faithDesc')}</p>
          </div>
        </div>
      </div>

      <BeliefsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};

export default About;