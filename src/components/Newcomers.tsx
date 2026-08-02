import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSiteImage } from '../hooks/useSiteContent';
import { Users, Heart, Calendar, Gift, MapPin, Coffee, BookOpen, Handshake, Clock } from 'lucide-react';

const Newcomers = () => {
  const { t } = useLanguage();
  const greeterImg = useSiteImage('newcomers_greeter', '/greeter.png');
  const noraImg = useSiteImage('newcomers_worship', '/nora.JPG');
  const communityImg = useSiteImage('newcomers_community', '/Community_outreach_in_action_with_joy.png');

  return (
    <section id="newcomers" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('newcomers.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('newcomers.subtitle')}
          </p>
        </div>

        {/* Welcome Message */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12">
          <div className="flex items-start space-x-4 mb-6">
            <Heart className="h-12 w-12 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t('newcomers.welcomeTitle')}
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                {t('newcomers.welcomeText1')}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                {t('newcomers.welcomeText2')}
              </p>
            </div>
          </div>
        </div>

        {/* Main Navigation Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Connect Card */}
          <a
            href="#contact"
            className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
          >
            <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('newcomers.connect')}
              </h3>
              <p className="text-gray-600">
                {t('newcomers.connectDesc')}
              </p>
            </div>
          </a>

          {/* Serve Card */}
          <a
            href="#ministries"
            className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
          >
            <div className="h-2 bg-gradient-to-r from-green-500 to-green-600"></div>
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <Handshake className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('newcomers.serve')}
              </h3>
              <p className="text-gray-600">
                {t('newcomers.serveDesc')}
              </p>
            </div>
          </a>

          {/* Events Card */}
          <a
            href="#calendario-eventos"
            className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
          >
            <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600"></div>
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('newcomers.serviceTimes')}
              </h3>
              <p className="text-gray-600">
                {t('newcomers.serviceTimesDesc')}
              </p>
            </div>
          </a>

          {/* Give Card */}
          <a
            href="#giving"
            className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
          >
            <div className="h-2 bg-gradient-to-r from-amber-500 to-amber-600"></div>
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                <Gift className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t('newcomers.give')}
              </h3>
              <p className="text-gray-600">
                {t('newcomers.giveDesc')}
              </p>
            </div>
          </a>
        </div>

        {/* What to Expect Section */}
        <div className="bg-gray-900 text-white rounded-2xl shadow-xl p-8 md:p-12 mb-12">
          <h3 className="text-3xl font-bold mb-8 text-center">
            {t('newcomers.whatToExpect')}
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <img
                  src={greeterImg}
                  alt="Welcoming team"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h4 className="text-xl font-bold mb-2">{t('newcomers.arrival')}</h4>
              <p className="text-gray-300">{t('newcomers.arrivalDesc')}</p>
            </div>
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <img
                  src={noraImg}
                  alt="Worship service"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h4 className="text-xl font-bold mb-2">{t('newcomers.service')}</h4>
              <p className="text-gray-300">{t('newcomers.serviceDesc')}</p>
            </div>
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <img
                  src={communityImg}
                  alt="Community fellowship"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h4 className="text-xl font-bold mb-2">{t('newcomers.community')}</h4>
              <p className="text-gray-300">{t('newcomers.communityDesc')}</p>
            </div>
          </div>
        </div>

        {/* Visit Us Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left side - Info */}
            <div className="p-8 md:p-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                {t('newcomers.planVisit')}
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{t('newcomers.location')}</h4>
                    <p className="text-gray-600">2560 S. Elm Ave, Sanford, FL 32773</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Calendar className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{t('newcomers.serviceTimes')}</h4>
                    <p className="text-gray-600">{t('newcomers.sundayService')}</p>
                    <p className="text-gray-600">{t('newcomers.thursdayService')}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Coffee className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{t('newcomers.dresscode')}</h4>
                    <p className="text-gray-600">{t('newcomers.dresscodeDesc')}</p>
                  </div>
                </div>
              </div>
              <a
                href="#contact"
                className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold transition-colors duration-300"
              >
                {t('newcomers.contactUs')}
              </a>
            </div>

            {/* Right side - Map */}
            <div className="h-full min-h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.7821234567!2d-81.31234567890123!3d28.78901234567890!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88e76b1c2d3e4f56%3A0x1234567890abcdef!2s2560%20S%20Elm%20Ave%2C%20Sanford%2C%20FL%2032773!5e0!3m2!1sen!2sus!4v1234567890123"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Church Location"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-12 text-center bg-blue-50 rounded-2xl p-8 md:p-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            {t('newcomers.nextSteps')}
          </h3>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            {t('newcomers.nextStepsDesc')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#about"
              className="bg-white hover:bg-gray-50 text-gray-900 px-6 py-3 rounded-full font-semibold border-2 border-gray-200 transition-colors duration-300"
            >
              {t('newcomers.learnMore')}
            </a>
            <a
              href="#services"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300"
            >
              {t('newcomers.viewServices')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newcomers;
