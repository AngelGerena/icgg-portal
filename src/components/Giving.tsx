import React from 'react';
import { DollarSign, Smartphone, CreditCard, Heart, Gift } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSiteImage } from '../hooks/useSiteContent';

const Giving = () => {
  const { t } = useLanguage();
  const g_zelle_logo = useSiteImage('give_zelle_logo', 'https://www.dropbox.com/scl/fi/m95hkitnjv4u5cgpma5yz/zelle-logo.png?rlkey=hfa68efnvgbmbpk63d0y1jbyn&st=bmcnu326&raw=1');
  const g_zelle_qr = useSiteImage('give_zelle_qr', 'https://www.dropbox.com/scl/fi/tuab5djq5t8o8a4zm9omp/zelle-tithe.jpg?rlkey=04l3myk422oc3p74grs0prork&st=n79cuejg&raw=1');
  const g_protemplo = useSiteImage('give_protemplo', 'https://www.dropbox.com/scl/fi/1eoami6nn96x93ejupjwd/protemplo.png?rlkey=dhnpa25v98d714y4cp8a3nzfu&st=3rhrssqi&raw=1');
  const g_hero = useSiteImage('give_hero', 'https://www.dropbox.com/scl/fi/9sfdwhicc1we24xub0f3n/give.jpg?rlkey=vlv5z2fsol4ajbzysupwpb4rr&st=nqugvu5u&raw=1');
  const g_tithely_logo = useSiteImage('give_tithely_logo', 'https://www.dropbox.com/scl/fi/ghtux1ngjbwseush1spvq/tithely-logo.png?rlkey=07kvgu4taglfuv4gmqn4pyaph&st=pwm5jddu&raw=1');

  return (
    <section id="giving" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100" style={{background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)'}}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('giving.title')}
          </h2>
          <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('giving.verse')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
            <div className="bg-gradient-to-r from-blue-700 to-blue-800 p-8 text-white text-center">
              <Heart className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-4">{t('giving.gratitude')}</h3>
              <p className="text-xl text-blue-100">
                {t('giving.generosity')}
              </p>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Zelle Option */}
                <div className="bg-purple-50 rounded-xl p-8 border-2 border-purple-200 hover:border-purple-300 transition-colors">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                      <img 
                        src={g_zelle_logo}
                        alt="Zelle Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-4">Zelle</h4>
                    <p className="text-gray-700 mb-6">
                      {t('giving.zelleDesc')}
                    </p>
                    
                    {/* Three Zelle Options */}
                    <div className="space-y-4 mb-6">
                      <div className="bg-white rounded-lg p-4 border border-purple-200 text-center">
                        <p className="text-sm font-semibold text-gray-600 mb-3">Ofrendas y Diezmos</p>
                        <div className="flex justify-center mb-3">
                          <img 
                            src={g_zelle_qr}
                            alt="Zelle QR Code for Tithe"
                            className="w-32 h-32 object-contain"
                          />
                        </div>
                        <p className="text-sm font-mono text-purple-700">tithe@encadena.org</p>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 border border-purple-200 text-center">
                        <p className="text-sm font-semibold text-gray-600 mb-3">Pro-Templo</p>
                        <div className="flex justify-center mb-3">
                          <img 
                            src={g_protemplo}
                            alt="Zelle QR Code for Pro-Templo"
                            className="w-32 h-32 object-contain"
                          />
                        </div>
                        <p className="text-sm font-mono text-purple-700">protemplo@encadena.org</p>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 border border-purple-200 text-center">
                        <p className="text-sm font-semibold text-gray-600 mb-3">Misiones</p>
                        <div className="flex justify-center mb-3">
                          <img 
                            src={g_hero}
                            alt="Zelle QR Code for Missions"
                            className="w-32 h-32 object-contain"
                          />
                        </div>
                        <p className="text-sm font-mono text-purple-700">give@encadena.org</p>
                      </div>
                    </div>

                    <div className="text-left space-y-2 text-sm text-gray-600">
                      <p><strong>{t('giving.instructions')}</strong></p>
                      <p>1. Escanea el QR Code que quieras usar para dar</p>
                      <p>2. Abre tu app bancaria</p>
                      <p>3. Selecciona Zelle</p>
                      <p>4. Selecciona el email según tu donación</p>
                      <p>5. Ingresa el monto</p>
                      <p>6. En el memo escribe "Diezmo" u "Ofrenda"</p>
                    </div>
                  </div>
                </div>

                {/* Tithely Option */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 border-2 border-green-200 hover:border-green-300 transition-colors">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                      <img 
                        src={g_tithely_logo}
                        alt="Tithely Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-4">Tithely</h4>
                    <p className="text-gray-700 mb-6">
                      {t('giving.tithelyDesc')}
                    </p>
                    
                    <div className="space-y-4">
                      <a
                        href="https://tithe.ly/give_new/www/#/tithely/give-one-time/365698"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg inline-block text-center"
                      >
                        {t('giving.giveNow')}
                      </a>
                      
                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Donaciones a:</strong>
                        </p>
                        <p className="text-sm font-mono text-green-700 mb-2">
                          Tithe@encadena.org
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>{t('giving.paymentOptions')}</strong>
                        </p>
                        <div className="text-xs text-gray-500 space-y-1">
                          <p>{t('giving.debitCredit')}</p>
                          <p>{t('giving.bankTransfer')}</p>
                          <p>{t('giving.oneTimeRecurring')}</p>
                          <p>{t('giving.secure')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="mt-12 text-center">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-8 border border-amber-200">
                  <Gift className="h-10 w-10 text-amber-600 mx-auto mb-4" />
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">{t('giving.whyGive')}</h4>
                  <div className="grid md:grid-cols-3 gap-6 text-left">
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2">{t('giving.obedience')}</h5>
                      <p className="text-gray-600 text-sm">
                        {t('giving.obedienceDesc')}
                      </p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2">{t('giving.support')}</h5>
                      <p className="text-gray-600 text-sm">
                        {t('giving.supportDesc')}
                      </p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2">{t('giving.blessing')}</h5>
                      <p className="text-gray-600 text-sm">
                        {t('giving.blessingDesc')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-600 text-sm">
                  {t('giving.disclaimer')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Giving;