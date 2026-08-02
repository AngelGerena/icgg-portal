import React from 'react';
import { Facebook, Heart, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const FacebookPageFeed = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-white" style={{backgroundColor: '#ffffff'}}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('facebook.title')}
          </h2>
          <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('facebook.description')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Single Facebook Follow Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white text-center hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="mb-6">
              <Facebook className="h-16 w-16 mx-auto mb-4 text-blue-200" />
              <h3 className="text-3xl font-bold mb-4">{t('facebook.title')}</h3>
              <p className="text-xl text-blue-100 leading-relaxed mb-6">
                {t('facebook.followDescription')}
              </p>
            </div>
            
            {/* Features Icons */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="flex flex-col items-center">
                <Heart className="h-8 w-8 text-red-300 mb-2" />
                <span className="text-sm text-blue-100">Fotos y Videos</span>
              </div>
              <div className="flex flex-col items-center">
                <Users className="h-8 w-8 text-green-300 mb-2" />
                <span className="text-sm text-blue-100">Eventos en Vivo</span>
              </div>
              <div className="flex flex-col items-center">
                <Facebook className="h-8 w-8 text-blue-300 mb-2" />
                <span className="text-sm text-blue-100">Actualizaciones</span>
              </div>
            </div>
            
            {/* Follow Button */}
            <a
              href="https://www.facebook.com/irenegraciaygloria"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
            >
              <Facebook className="h-6 w-6" />
              <span>{t('facebook.followButton')}</span>
            </a>
            
            <p className="text-blue-200 text-sm mt-4">
              Se abrirá en una nueva ventana
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FacebookPageFeed;