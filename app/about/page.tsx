'use client';

import { FiUsers, FiTarget, FiAward, FiHeart } from 'react-icons/fi';
import ScrollAnimation, { StaggerAnimation } from '@/components/ScrollAnimation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0a0a0f] to-teal-900/20 py-20">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn" className="text-center">
            <h1 className="text-5xl font-heading font-bold text-white mb-6">{t('about.title')}</h1>
            <p className="text-xl text-white/60 max-w-3xl mx-auto font-body">
              {t('about.subtitle')}
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollAnimation animation="slideRight">
              <div>
                <h2 className="text-4xl font-heading font-bold text-white mb-6">{t('about.mission')}</h2>
                <p className="text-white/60 text-lg mb-6 font-body">
                  {t('about.mission.text1')}
                </p>
                <p className="text-white/60 text-lg font-body">
                  {t('about.mission.text2')}
                </p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation animation="slideLeft">
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">📱</div>
                  <h3 className="text-2xl font-heading font-bold text-white mb-4">{t('about.premiumQuality')}</h3>
                  <p className="text-white/60 font-body">
                    {t('about.premiumQuality.text')}
                  </p>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white/[0.02] py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-heading font-bold text-white text-center mb-12">{t('about.values')}</h2>
          </ScrollAnimation>
          <StaggerAnimation animation="scaleUp" stagger={0.2} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-teal-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiUsers className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white mb-3">{t('about.value.customerFirst')}</h3>
              <p className="text-white/60 font-body">
                {t('about.value.customerFirst.text')}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-teal-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiTarget className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white mb-3">{t('about.value.qualityFocus')}</h3>
              <p className="text-white/60 font-body">
                {t('about.value.qualityFocus.text')}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-teal-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiAward className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white mb-3">{t('about.value.innovation')}</h3>
              <p className="text-white/60 font-body">
                {t('about.value.innovation.text')}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-teal-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiHeart className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white mb-3">{t('about.value.passion')}</h3>
              <p className="text-white/60 font-body">
                {t('about.value.passion.text')}
              </p>
            </div>
          </StaggerAnimation>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn" className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-heading font-bold text-white mb-8">{t('about.story')}</h2>
            <div className="text-white/60 text-lg space-y-6 font-body">
              <p>{t('about.story.p1')}</p>
              <p>{t('about.story.p2')}</p>
              <p>{t('about.story.p3')}</p>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#050508] py-16">
        <div className="container-custom">
          <StaggerAnimation animation="scaleUp" stagger={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-heading font-bold text-white mb-2">200+</h3>
              <p className="text-white/40 font-body">{t('about.stat.products.label')}</p>
            </div>
            <div>
              <h3 className="text-4xl font-heading font-bold text-white mb-2">30K+</h3>
              <p className="text-white/40 font-body">{t('about.stat.customers.label')}</p>
            </div>
            <div>
              <h3 className="text-4xl font-heading font-bold text-white mb-2">50+</h3>
              <p className="text-white/40 font-body">{t('about.stat.countries')}</p>
            </div>
            <div>
              <h3 className="text-4xl font-heading font-bold text-white mb-2">99%</h3>
              <p className="text-white/40 font-body">{t('about.stat.satisfaction')}</p>
            </div>
          </StaggerAnimation>
        </div>
      </section>
    </div>
  );
}
