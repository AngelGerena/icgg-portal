import React from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface BeliefsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BeliefsModal: React.FC<BeliefsModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>

        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {t('beliefs.title')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="px-6 py-8 space-y-8">
            <div>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {t('beliefs.intro')}
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {t('beliefs.webelieve')}
              </h3>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    {t('beliefs.belief1.title')}
                  </h4>
                  <p className="text-gray-700 mb-2 leading-relaxed">
                    {t('beliefs.belief1.text')}
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    {t('beliefs.belief1.verse')}
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    {t('beliefs.belief2.title')}
                  </h4>
                  <p className="text-gray-700 mb-2 leading-relaxed">
                    {t('beliefs.belief2.text')}
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    {t('beliefs.belief2.verse')}
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    {t('beliefs.belief3.title')}
                  </h4>
                  <p className="text-gray-700 mb-2 leading-relaxed">
                    {t('beliefs.belief3.text')}
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    {t('beliefs.belief3.verse')}
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    {t('beliefs.belief4.title')}
                  </h4>
                  <p className="text-gray-700 mb-2 leading-relaxed">
                    {t('beliefs.belief4.text')}
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    {t('beliefs.belief4.verse')}
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    {t('beliefs.belief5.title')}
                  </h4>
                  <p className="text-gray-700 mb-2 leading-relaxed">
                    {t('beliefs.belief5.text')}
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    {t('beliefs.belief5.verse')}
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    {t('beliefs.belief6.title')}
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {t('beliefs.belief6.text')}
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    {t('beliefs.belief7.title')}
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {t('beliefs.belief7.text')}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                {t('beliefs.bornagain.title')}
              </h3>

              <p className="text-lg font-semibold text-gray-800 mb-3">
                {t('beliefs.bornagain.question')}
              </p>

              <p className="text-gray-700 leading-relaxed mb-4">
                {t('beliefs.bornagain.intro')}
              </p>

              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-gray-800 italic mb-2">
                  {t('beliefs.bornagain.jesussaid')}
                </p>
                <p className="text-sm text-gray-600 italic">
                  {t('beliefs.bornagain.verse')}
                </p>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                {t('beliefs.bornagain.meaning')}
              </p>

              <h4 className="text-xl font-bold text-gray-900 mb-4">
                {t('beliefs.bornagain.steps')}
              </h4>

              <div className="space-y-4 mb-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 mb-1">
                      {t('beliefs.bornagain.step1.title')}
                    </h5>
                    <p className="text-gray-700 leading-relaxed">
                      {t('beliefs.bornagain.step1.text')}
                    </p>
                    <p className="text-sm text-gray-600 italic mt-1">
                      {t('beliefs.bornagain.step1.verse')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 mb-1">
                      {t('beliefs.bornagain.step2.title')}
                    </h5>
                    <p className="text-gray-700 leading-relaxed">
                      {t('beliefs.bornagain.step2.text')}
                    </p>
                    <p className="text-sm text-gray-600 italic mt-1">
                      {t('beliefs.bornagain.step2.verse')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 mb-1">
                      {t('beliefs.bornagain.step3.title')}
                    </h5>
                    <p className="text-gray-700 leading-relaxed">
                      {t('beliefs.bornagain.step3.text')}
                    </p>
                    <p className="text-sm text-gray-600 italic mt-1">
                      {t('beliefs.bornagain.step3.verse')}
                    </p>
                  </div>
                </div>
              </div>

              <h4 className="text-xl font-bold text-gray-900 mb-4">
                {t('beliefs.bornagain.prayer.title')}
              </h4>

              <p className="text-gray-700 mb-3 leading-relaxed">
                {t('beliefs.bornagain.prayer.intro')}
              </p>

              <div className="bg-amber-50 p-6 rounded-lg border-l-4 border-amber-600 mb-4">
                <p className="text-gray-800 italic leading-relaxed whitespace-pre-line">
                  {t('beliefs.bornagain.prayer.text')}
                </p>
              </div>

              <p className="text-gray-700 leading-relaxed">
                {t('beliefs.bornagain.prayer.conclusion')}
              </p>
            </div>

            <div className="border-t border-gray-300 pt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                {t('beliefs.nextsteps.title')}
              </h3>

              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                {t('beliefs.nextsteps.intro')}
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {t('beliefs.nextsteps.step1.title')}
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {t('beliefs.nextsteps.step1.text')}
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {t('beliefs.nextsteps.step2.title')}
                  </h4>
                  <p className="text-gray-700 mb-2 leading-relaxed">
                    {t('beliefs.nextsteps.step2.text')}
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    {t('beliefs.nextsteps.step2.verse')}
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {t('beliefs.nextsteps.step3.title')}
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {t('beliefs.nextsteps.step3.text')}
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {t('beliefs.nextsteps.step4.title')}
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {t('beliefs.nextsteps.step4.text')}
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {t('beliefs.nextsteps.step5.title')}
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {t('beliefs.nextsteps.step5.text')}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mt-8 mb-6">
                {t('beliefs.nextsteps.prayer')}
              </p>

              <p className="text-right text-gray-900 font-semibold">
                {t('beliefs.nextsteps.signature')}
              </p>
            </div>
          </div>

          <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-2xl">
            <button
              onClick={onClose}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {t('beliefs.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeliefsModal;
