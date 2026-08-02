import React from 'react';
import { Baby, Smile, Heart, BookOpen, Music, Star, Users, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const AvivaKids = () => {
  const { t } = useLanguage();
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation();

  const ageGroups = [
    {
      icon: Baby,
      titleKey: 'avivakids.nursery',
      descriptionKey: 'avivakids.nurseryDesc',
      ageKey: 'avivakids.nurseryAge',
      color: 'bg-pink-500'
    },
    {
      icon: Smile,
      titleKey: 'avivakids.toddlers',
      descriptionKey: 'avivakids.toddlersDesc',
      ageKey: 'avivakids.toddlersAge',
      color: 'bg-yellow-500'
    },
    {
      icon: Star,
      titleKey: 'avivakids.preschool',
      descriptionKey: 'avivakids.preschoolDesc',
      ageKey: 'avivakids.preschoolAge',
      color: 'bg-green-500'
    },
    {
      icon: Sparkles,
      titleKey: 'avivakids.elementary',
      descriptionKey: 'avivakids.elementaryDesc',
      ageKey: 'avivakids.elementaryAge',
      color: 'bg-blue-500'
    }
  ];

  const activities = [
    {
      icon: BookOpen,
      titleKey: 'avivakids.biblestories',
      descriptionKey: 'avivakids.biblestoriesDesc',
      color: 'text-orange-500'
    },
    {
      icon: Music,
      titleKey: 'avivakids.worship',
      descriptionKey: 'avivakids.worshipDesc',
      color: 'text-purple-500'
    },
    {
      icon: Heart,
      titleKey: 'avivakids.crafts',
      descriptionKey: 'avivakids.craftsDesc',
      color: 'text-red-500'
    },
    {
      icon: Users,
      titleKey: 'avivakids.games',
      descriptionKey: 'avivakids.gamesDesc',
      color: 'text-teal-500'
    }
  ];

  return (
    <section id="aviva-kids" className="py-20 bg-gradient-to-br from-sky-100 via-purple-50 to-pink-100">
      <div className="container mx-auto px-4">
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center space-x-3 bg-white rounded-full px-8 py-4 shadow-lg">
              <Baby className="h-8 w-8 text-pink-500" />
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                {t('avivakids.title')}
              </h2>
              <Sparkles className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mt-6 font-medium">
            {t('avivakids.subtitle')}
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
            {t('avivakids.description')}
          </p>
        </div>

        {/* Age Groups Cards */}
        <div
          ref={cardsRef}
          className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transition-all duration-1000 ${
            cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {ageGroups.map((group, index) => {
            const IconComponent = group.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`${group.color} p-6 text-white`}>
                  <div className="flex justify-center mb-3">
                    <IconComponent className="h-12 w-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-center">
                    {t(group.titleKey)}
                  </h3>
                  <p className="text-center text-white/90 font-semibold mt-2">
                    {t(group.ageKey)}
                  </p>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 text-center leading-relaxed">
                    {t(group.descriptionKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Activities Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-6xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            {t('avivakids.activitiesTitle')}
          </h3>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {activities.map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex-shrink-0">
                    <IconComponent className={`h-10 w-10 ${activity.color}`} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {t(activity.titleKey)}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {t(activity.descriptionKey)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* When & Where */}
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-2xl p-8 text-white text-center">
            <h4 className="text-2xl font-bold mb-6">{t('avivakids.whenWhere')}</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <p className="text-lg font-bold mb-2">{t('avivakids.sundayService')}</p>
                <p className="text-white/90">{t('avivakids.sundayTime')}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <p className="text-lg font-bold mb-2">{t('avivakids.location')}</p>
                <p className="text-white/90">{t('avivakids.locationDetail')}</p>
              </div>
            </div>
          </div>

          {/* Parent Info */}
          <div className="mt-8 p-6 bg-sky-50 rounded-xl border-2 border-sky-200">
            <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center justify-center space-x-2">
              <Heart className="h-6 w-6 text-red-500" />
              <span>{t('avivakids.parentsTitle')}</span>
            </h4>
            <p className="text-gray-700 text-center leading-relaxed">
              {t('avivakids.parentsInfo')}
            </p>
          </div>

          {/* CTA Button */}
          <div className="mt-8 text-center">
            <a
              href="https://www.icgg-avivakids.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl"
            >
              <Sparkles className="h-6 w-6" />
              <span>{t('avivakids.visitWebsite')}</span>
              <Star className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AvivaKids;
