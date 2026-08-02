import React from 'react';
import { Heart, DollarSign, Users, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Alineados = () => {
  const { t } = useLanguage();

  return (
    <section id="alineados" className="py-20 bg-white scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('alineados.title')}
          </h2>
          <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('alineados.subtitle')}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 rounded-2xl shadow-2xl overflow-hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-24 -translate-x-24"></div>

              <div className="relative p-8 md:p-12 text-white text-center">
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center bg-blue-700 rounded-2xl px-8 py-4 shadow-2xl">
                    <span className="text-5xl md:text-6xl font-black tracking-tight">
                      <span className="text-white">ALINEA</span>
                      <span className="text-orange-500">DOS</span>
                    </span>
                  </div>
                </div>

                <p className="text-xl md:text-2xl font-light text-blue-100 mb-2">
                  {t('alineados.tagline')}
                </p>
                <p className="text-lg text-blue-200 mb-8 max-w-3xl mx-auto leading-relaxed">
                  {t('alineados.description')}
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <Heart className="h-10 w-10 mx-auto mb-3 text-orange-500" />
                    <h4 className="font-bold text-lg mb-2">{t('alineados.together')}</h4>
                    <p className="text-blue-200 text-sm">
                      {t('alineados.togetherDesc')}
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <DollarSign className="h-10 w-10 mx-auto mb-3 text-orange-500" />
                    <h4 className="font-bold text-lg mb-2">{t('alineados.debts')}</h4>
                    <p className="text-blue-200 text-sm">
                      {t('alineados.debtsDesc')}
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <Users className="h-10 w-10 mx-auto mb-3 text-orange-500" />
                    <h4 className="font-bold text-lg mb-2">{t('alineados.transparency')}</h4>
                    <p className="text-blue-200 text-sm">
                      {t('alineados.transparencyDesc')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a
                    href="https://www.alineados.life"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <span>{t('alineados.visit')}</span>
                    <ArrowRight className="h-6 w-6" />
                  </a>
                </div>

                <div className="mt-8 pt-6 border-t border-white/20">
                  <p className="text-blue-200 text-sm">
                    {t('alineados.features')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Alineados;
