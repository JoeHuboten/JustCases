'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { TestimonialsSection } from '@/components/ui/testimonials-with-marquee';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';
import { FeaturesSectionWithCardGradient } from '@/components/ui/feature-section-with-card-gradient';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#050508] overflow-hidden">
      {/* Hero Section */}
      <HeroGeometric
        badge={t('homePage.newCollection')}
        title1={t('homePage.heroTitle1')}
        title2={t('homePage.heroTitle2')}
        description={t('homePage.heroDesc')}
        ctaLabel={t('homePage.shopCollection')}
        ctaHref="/shop"
        secondaryLabel={t('homePage.learnMore')}
        secondaryHref="/about"
      />

      {/* Brands - Minimal Line */}
      <section className="py-16 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
            {['Apple', 'Samsung', 'Xiaomi', 'Google', 'Huawei', 'OnePlus'].map((brand, i) => (
              <span 
                key={brand} 
                className="font-heading text-xl md:text-2xl font-medium text-white/[0.08] hover:text-white/20 transition-colors cursor-default"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Card Gradient */}
      <section className="relative">
        <div className="container mx-auto">
          <FeaturesSectionWithCardGradient
            sectionLabel={t('homePage.advantages')}
            sectionTitle={t('homePage.advantagesDesc')}
            features={[
              {
                icon: '🛡️',
                title: t('homePage.feature.protection'),
                description: t('homePage.feature.protectionDesc'),
              },
              {
                icon: '✨',
                title: t('homePage.feature.materials'),
                description: t('homePage.feature.materialsDesc'),
              },
              {
                icon: '🚀',
                title: t('homePage.feature.delivery'),
                description: t('homePage.feature.deliveryDesc'),
              },
              {
                icon: '↩️',
                title: t('homePage.feature.returns'),
                description: t('homePage.feature.returnsDesc'),
              },
              {
                icon: '💎',
                title: t('homePage.feature.guarantee'),
                description: t('homePage.feature.guaranteeDesc'),
              },
            ]}
          />
        </div>
      </section>

      {/* Testimonials - Marquee */}
      <TestimonialsSection
        title={t('homePage.reviewsDesc')}
        description={t('homePage.reviews')}
        testimonials={[
          {
            author: {
              name: t('homePage.review1.name'),
              handle: t('homePage.review1.role'),
              avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
            },
            text: t('homePage.review1.text'),
          },
          {
            author: {
              name: t('homePage.review2.name'),
              handle: t('homePage.review2.role'),
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            },
            text: t('homePage.review2.text'),
          },
          {
            author: {
              name: t('homePage.review3.name'),
              handle: t('homePage.review3.role'),
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
            },
            text: t('homePage.review3.text'),
          },
        ]}
      />

      {/* Stats */}
      <section className="py-12 md:py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 pt-8 border-t border-white/5">
            {[
              { value: '30K+', label: t('homePage.stats.customers') },
              { value: '4.9', label: t('homePage.stats.rating') },
              { value: '2K+', label: t('homePage.stats.products') },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-heading text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="font-body text-sm text-white/30">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        {/* Animated Background Lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-20">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent"
                style={{
                  top: `${20 + i * 15}%`,
                  left: '-100%',
                  right: '-100%',
                  animation: `slideRight ${3 + i * 0.5}s linear infinite`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block font-body text-xs tracking-[0.3em] uppercase text-emerald-400/80 mb-4">{t('homePage.cta.ready')}</span>
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              <span 
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 50%, #10B981 100%)',
                }}
              >
                {t('homePage.cta.find')}
              </span>
            </h2>
            <p className="font-body text-white/40 text-lg mb-10 max-w-lg mx-auto">
              {t('homePage.cta.desc')}
            </p>
            <Link
              href="/shop"
              className="group relative inline-flex overflow-hidden rounded-full"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-cyan-600 to-emerald-600 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
              <div className="relative flex items-center gap-3 px-10 py-5 bg-white rounded-full font-heading font-semibold text-lg text-[#050508] transition-transform duration-300 group-hover:scale-[1.02]">
                <span>{t('homePage.cta.shop')}</span>
                <div className="w-8 h-8 rounded-full bg-[#050508] flex items-center justify-center">
                  <svg className="w-4 h-4 text-white transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes slideRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
