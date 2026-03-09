'use client';

import { FiShield, FiEye, FiLock, FiUser, FiMail, FiDatabase } from 'react-icons/fi';
import ScrollAnimation from '@/components/ScrollAnimation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0a0a0f] to-blue-900/20 py-20">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn" className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">{t('privacy.title')}</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('privacy.subtitle')}
            </p>
            <div className="flex items-center justify-center gap-2 mt-6 text-gray-400">
              <FiShield size={16} />
              <span>{t('privacy.lastUpdated')}</span>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-16">
        <div className="container-custom max-w-4xl">
          <div className="space-y-12">
            {/* Section 1: Introduction */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <FiShield className="text-accent" />
                  {t('privacy.s1.title')}
                </h2>
                <div className="text-gray-300 space-y-4">
                  <p>{t('privacy.s1.text')}</p>
                </div>
              </div>
            </ScrollAnimation>

            {/* Section 2: Information We Collect */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <FiDatabase className="text-accent" />
                  {t('privacy.s2.title')}
                </h2>
                <div className="text-gray-300 space-y-6">
                  <div>
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                      <FiUser className="text-accent" size={20} />
                      {t('privacy.s2.subtitle1')}
                    </h3>
                    <ul className="list-disc list-inside space-y-2 ml-6">
                      <li>{t('privacy.s2.item1')}</li>
                      <li>{t('privacy.s2.item2')}</li>
                      <li>{t('privacy.s2.item3')}</li>
                      <li>{t('privacy.s2.item4')}</li>
                      <li>{t('privacy.s2.item5')}</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                      <FiEye className="text-accent" size={20} />
                      {t('privacy.s2.subtitle2')}
                    </h3>
                    <ul className="list-disc list-inside space-y-2 ml-6">
                      <li>{t('privacy.s2.item6')}</li>
                      <li>{t('privacy.s2.item7')}</li>
                      <li>{t('privacy.s2.item8')}</li>
                      <li>{t('privacy.s2.item9')}</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                      <FiMail className="text-accent" size={20} />
                      {t('privacy.s2.subtitle3')}
                    </h3>
                    <ul className="list-disc list-inside space-y-2 ml-6">
                      <li>{t('privacy.s2.item10')}</li>
                      <li>{t('privacy.s2.item11')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </ScrollAnimation>

            {/* Section 3: How We Use Information */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6">{t('privacy.s3.title')}</h2>
                <div className="text-gray-300 space-y-4">
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('privacy.s3.item1')}</li>
                    <li>{t('privacy.s3.item2')}</li>
                    <li>{t('privacy.s3.item3')}</li>
                    <li>{t('privacy.s3.item4')}</li>
                    <li>{t('privacy.s3.item5')}</li>
                    <li>{t('privacy.s3.item6')}</li>
                  </ul>
                </div>
              </div>
            </ScrollAnimation>

            {/* Section 4: Information Sharing */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6">{t('privacy.s4.title')}</h2>
                <div className="text-gray-300 space-y-4">
                  <p>{t('privacy.s4.text')}</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('privacy.s4.item1')}</li>
                    <li>{t('privacy.s4.item2')}</li>
                    <li>{t('privacy.s4.item3')}</li>
                    <li>{t('privacy.s4.item4')}</li>
                  </ul>
                </div>
              </div>
            </ScrollAnimation>

            {/* Section 5: Data Security */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <FiLock className="text-accent" />
                  {t('privacy.s5.title')}
                </h2>
                <div className="text-gray-300 space-y-4">
                  <p>{t('privacy.s5.text')}</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('privacy.s5.item1')}</li>
                    <li>{t('privacy.s5.item2')}</li>
                    <li>{t('privacy.s5.item3')}</li>
                    <li>{t('privacy.s5.item4')}</li>
                  </ul>
                </div>
              </div>
            </ScrollAnimation>

            {/* Section 6: Cookies */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6">{t('privacy.s6.title')}</h2>
                <div className="text-gray-300 space-y-4">
                  <p>{t('privacy.s6.text')}</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('privacy.s6.item1')}</li>
                    <li>{t('privacy.s6.item2')}</li>
                    <li>{t('privacy.s6.item3')}</li>
                    <li>{t('privacy.s6.item4')}</li>
                  </ul>
                </div>
              </div>
            </ScrollAnimation>

            {/* Section 7: Your Rights */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6">{t('privacy.s7.title')}</h2>
                <div className="text-gray-300 space-y-4">
                  <p>{t('privacy.s7.text')}</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('privacy.s7.item1')}</li>
                    <li>{t('privacy.s7.item2')}</li>
                    <li>{t('privacy.s7.item3')}</li>
                    <li>{t('privacy.s7.item4')}</li>
                    <li>{t('privacy.s7.item5')}</li>
                    <li>{t('privacy.s7.item6')}</li>
                  </ul>
                </div>
              </div>
            </ScrollAnimation>

            {/* Section 8: Data Retention */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6">{t('privacy.s8.title')}</h2>
                <div className="text-gray-300 space-y-4">
                  <p>{t('privacy.s8.text')}</p>
                </div>
              </div>
            </ScrollAnimation>

            {/* Section 9: Children's Privacy */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6">{t('privacy.s9.title')}</h2>
                <div className="text-gray-300 space-y-4">
                  <p>{t('privacy.s9.text')}</p>
                </div>
              </div>
            </ScrollAnimation>

            {/* Section 10: Changes to Privacy Policy */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6">{t('privacy.s10.title')}</h2>
                <div className="text-gray-300 space-y-4">
                  <p>{t('privacy.s10.text')}</p>
                </div>
              </div>
            </ScrollAnimation>

            {/* Section 11: Contact */}
            <ScrollAnimation animation="fadeIn">
              <div className="bg-primary rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-white mb-6">{t('privacy.s11.title')}</h2>
                <div className="text-gray-300 space-y-4">
                  <p>{t('privacy.s11.text')}</p>
                  <div className="space-y-2">
                    <p>{t('privacy.s11.item1')}</p>
                    <p>{t('privacy.s11.item2')}</p>
                    <p>{t('privacy.s11.item3')}</p>
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
