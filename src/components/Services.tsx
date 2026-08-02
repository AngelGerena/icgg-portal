import React from 'react';
import { Clock, Calendar, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Services = () => {
  const { t } = useLanguage();
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation();
  const { ref: locationRef, isVisible: locationVisible } = useScrollAnimation();

  return (
    <section id="services" className="py-20 bg-white" style={{backgroundColor: '#ffffff'}}>
      <div className="container mx-auto px-4">
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('services.title')}
          </h2>
          <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('services.description')}
          </p>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-3 gap-8 mb-16">
          <div className={`bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-lg transition-all duration-700 hover:shadow-2xl hover:scale-105 ${
            cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="text-center">
              <div className="bg-blue-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:rotate-12">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('services.sunday')}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-700" />
                  <span className="text-lg font-semibold text-gray-800">10:00 AM</span>
                </div>
                <p className="text-gray-700">{t('services.mainService')}</p>
              </div>
            </div>
          </div>

          <div className={`bg-gradient-to-br from-amber-50 to-amber-100 p-8 rounded-xl shadow-lg transition-all duration-700 delay-100 hover:shadow-2xl hover:scale-105 ${
            cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="text-center">
              <div className="bg-amber-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:rotate-12">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('services.thursday')}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                  <span className="text-lg font-semibold text-gray-800">7:30 PM</span>
                </div>
                <p className="text-gray-700">{t('services.bibleStudy')}</p>
                <p className="text-gray-700">{t('services.prayerPraise')}</p>
              </div>
            </div>
          </div>

          <div className={`bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl shadow-lg transition-all duration-700 delay-200 hover:shadow-2xl hover:scale-105 ${
            cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:rotate-12">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('services.friday')}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  <span className="text-lg font-semibold text-gray-800">7:30 PM</span>
                </div>
                <p className="text-gray-700">{t('services.youthService')}</p>
                <p className="text-gray-700">{t('services.worshipWord')}</p>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={locationRef}
          className={`bg-gradient-to-r from-blue-700 to-blue-800 rounded-xl p-8 text-white text-center transition-all duration-1000 hover:shadow-2xl ${
            locationVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="flex items-center justify-center mb-4">
            <MapPin className="h-6 w-6 mr-2" />
            <h3 className="text-xl md:text-2xl font-bold">{t('services.location')}</h3>
          </div>
          <a 
            href="https://www.google.com/maps/dir/?api=1&destination=2560+S.+Elm+Ave,+Sanford,+FL+32773"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block hover:text-amber-300 transition-colors cursor-pointer"
          >
            <p className="text-lg md:text-xl mb-2 hover:underline">2560 S. Elm Ave.</p>
            <p className="text-lg md:text-xl mb-4 hover:underline">Sanford, FL 32773</p>
          </a>
          <p className="text-blue-200">
            {t('services.locationDesc')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Services;