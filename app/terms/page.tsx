'use client';

import { FiFileText, FiCalendar, FiShield, FiAlertCircle } from 'react-icons/fi';
import ScrollAnimation from '@/components/ScrollAnimation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TermsPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0a0a0f] to-blue-900/20 py-20">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn" className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">{t('terms.title')}</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('terms.subtitle')}
            </p>
            <div className="flex items-center justify-center gap-2 mt-6 text-gray-400">
              <FiCalendar size={16} />
              <span>{t('terms.lastUpdated')}</span>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16">
        <div className="container-custom max-w-4xl">
          <div className="space-y-12">
            {/* Section 1 */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <FiFileText className="text-accent" />
                  {t('terms.s1.title')}
                </h2>
                <div className="text-gray-300 space-y-4">
                  <p>{t('terms.s1.text')}</p>
                </div>
              </div>
            </ScrollAnimation>

            {/* Section 2 */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <FiShield className="text-accent" />
                  {t('terms.s2.title')}
                </h2>
                <div className="text-gray-300 space-y-4">
                  <p>{t('terms.s2.text')}</p>
                </div>
              </div>
            </ScrollAnimation>

            {/* Section 3 */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <FiAlertCircle className="text-accent" />
                  {t('terms.s3.title')}
                </h2>
                <div className="text-gray-300 space-y-4">
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('terms.s3.item1')}</li>
                    <li>{t('terms.s3.item2')}</li>
                    <li>{t('terms.s3.item3')}</li>
                    <li>{t('terms.s3.item4')}</li>
                  </ul>
                </div>
              </div>
            </ScrollAnimation>

            {/* Section 4 */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6">
                  {t('terms.s4.title')}
                </h2>
                <div className="text-gray-300 space-y-4">
                  <p>{t('terms.s4.text')}</p>
                </div>
              </div>
            </ScrollAnimation>

            {/* Section 5 */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6">
                  {t('terms.s5.title')}
                </h2>
                <div className="text-gray-300 space-y-4">
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('terms.s5.item1')}</li>
                    <li>{t('terms.s5.item2')}</li>
                    <li>{t('terms.s5.item3')}</li>
                    <li>{t('terms.s5.item4')}</li>
                  </ul>
                </div>
              </div>
            </ScrollAnimation>

            {/* Section 6 */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6">
                  {t('terms.s6.title')}
                </h2>
                <div className="text-gray-300 space-y-4">
                  <p>{t('terms.s6.text')}</p>
                </div>
              </div>
            </ScrollAnimation>

            {/* Section 7 */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6">
                  {t('terms.s7.title')}
                </h2>
                <div className="text-gray-300 space-y-4">
                  <p>{t('terms.s7.text')}</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('terms.s7.item1')}</li>
                    <li>{t('terms.s7.item2')}</li>
                    <li>{t('terms.s7.item3')}</li>
                    <li>{t('terms.s7.item4')}</li>
                  </ul>
                </div>
              </div>
            </ScrollAnimation>

            {/* Section 8 */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6">
                  {t('terms.s8.title')}
                </h2>
                <div className="text-gray-300 space-y-4">
                  <p>{t('terms.s8.text')}</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('terms.s8.item1')}</li>
                    <li>{t('terms.s8.item2')}</li>
                    <li>{t('terms.s8.item3')}</li>
                  </ul>
                </div>
              </div>
            </ScrollAnimation>

            {/* Section 9 */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6">
                  {t('terms.s9.title')}
                </h2>
                <div className="text-gray-300 space-y-4">
                  <p>{t('terms.s9.text')}</p>
                </div>
              </div>
            </ScrollAnimation>

            {/* Section 10 */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6">
                  {t('terms.s10.title')}
                </h2>
                <div className="text-gray-300 space-y-4">
                  <p>{t('terms.s10.text')}</p>
                  <div className="space-y-2">
                    <p>{t('terms.s10.item1')}</p>
                    <p>{t('terms.s10.item2')}</p>
                    <p>{t('terms.s10.item3')}</p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </div>
  );
}
