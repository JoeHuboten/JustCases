'use client';

import { FiTruck, FiMapPin, FiClock, FiPackage, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import ScrollAnimation, { StaggerAnimation } from '@/components/ScrollAnimation';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DeliveriesPage() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('tracking');

  const faqData = {
    tracking: [
      { question: t('deliveries.faq.tracking.q1'), answer: t('deliveries.faq.tracking.a1') },
      { question: t('deliveries.faq.tracking.q2'), answer: t('deliveries.faq.tracking.a2') },
      { question: t('deliveries.faq.tracking.q3'), answer: t('deliveries.faq.tracking.a3') },
      { question: t('deliveries.faq.tracking.q4'), answer: t('deliveries.faq.tracking.a4') },
    ],
    addresses: [
      { question: t('deliveries.faq.addresses.q1'), answer: t('deliveries.faq.addresses.a1') },
      { question: t('deliveries.faq.addresses.q2'), answer: t('deliveries.faq.addresses.a2') },
      { question: t('deliveries.faq.addresses.q3'), answer: t('deliveries.faq.addresses.a3') },
      { question: t('deliveries.faq.addresses.q4'), answer: t('deliveries.faq.addresses.a4') },
    ],
    issues: [
      { question: t('deliveries.faq.issues.q1'), answer: t('deliveries.faq.issues.a1') },
      { question: t('deliveries.faq.issues.q2'), answer: t('deliveries.faq.issues.a2') },
      { question: t('deliveries.faq.issues.q3'), answer: t('deliveries.faq.issues.a3') },
      { question: t('deliveries.faq.issues.q4'), answer: t('deliveries.faq.issues.a4') },
    ],
    international: [
      { question: t('deliveries.faq.international.q1'), answer: t('deliveries.faq.international.a1') },
      { question: t('deliveries.faq.international.q2'), answer: t('deliveries.faq.international.a2') },
      { question: t('deliveries.faq.international.q3'), answer: t('deliveries.faq.international.a3') },
    ]
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0a0a0f] to-blue-900/20 py-20">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn" className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">{t('deliveries.title')}</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('deliveries.subtitle')}
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Delivery Management Features */}
      <section className="py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">{t('deliveries.capabilities')}</h2>
          </ScrollAnimation>
          <StaggerAnimation animation="scaleUp" stagger={0.2} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiTruck className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{t('deliveries.tracking')}</h3>
              <p className="text-gray-300">
                {t('deliveries.trackingDesc')}
              </p>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiMapPin className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{t('deliveries.addresses')}</h3>
              <p className="text-gray-300">
                {t('deliveries.addressesDesc')}
              </p>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiClock className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{t('deliveries.notifications')}</h3>
              <p className="text-gray-300">
                {t('deliveries.notificationsDesc')}
              </p>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiPackage className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{t('deliveries.history')}</h3>
              <p className="text-gray-300">
                {t('deliveries.historyDesc')}
              </p>
            </div>
          </StaggerAnimation>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-background-secondary py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">{t('deliveries.faq.title')}</h2>
          </ScrollAnimation>
          
          {/* FAQ Categories */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setSelectedCategory('tracking')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === 'tracking'
                  ? 'bg-accent text-white'
                  : 'bg-primary text-gray-300 hover:text-white'
              }`}
            >
              {t('deliveries.faq.tracking')}
            </button>
            <button
              onClick={() => setSelectedCategory('addresses')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === 'addresses'
                  ? 'bg-accent text-white'
                  : 'bg-primary text-gray-300 hover:text-white'
              }`}
            >
              {t('deliveries.faq.addresses')}
            </button>
            <button
              onClick={() => setSelectedCategory('issues')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === 'issues'
                  ? 'bg-accent text-white'
                  : 'bg-primary text-gray-300 hover:text-white'
              }`}
            >
              {t('deliveries.faq.issues')}
            </button>
            <button
              onClick={() => setSelectedCategory('international')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === 'international'
                  ? 'bg-accent text-white'
                  : 'bg-primary text-gray-300 hover:text-white'
              }`}
            >
              {t('deliveries.faq.international')}
            </button>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqData[selectedCategory as keyof typeof faqData].map((item, index) => (
              <div key={index} className="bg-primary rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">{item.question}</h3>
                <p className="text-gray-300">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Options */}
      <section className="py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">{t('deliveries.options')}</h2>
          </ScrollAnimation>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiTruck className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('deliveries.standard.title')}</h3>
              <div className="text-3xl font-bold text-accent mb-4">{t('deliveries.standard.price')}</div>
              <p className="text-gray-300 mb-4">
                {t('deliveries.standard.desc')}
              </p>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center justify-center gap-2">
                  <FiClock size={16} />
                  <span>{t('deliveries.standard.time')}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <FiMapPin size={16} />
                  <span>{t('deliveries.standard.area')}</span>
                </div>
              </div>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center border-2 border-accent">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiPackage className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('deliveries.express.title')}</h3>
              <div className="text-3xl font-bold text-accent mb-4">{t('deliveries.express.price')}</div>
              <p className="text-gray-300 mb-4">
                {t('deliveries.express.desc')}
              </p>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center justify-center gap-2">
                  <FiClock size={16} />
                  <span>{t('deliveries.express.time')}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <FiMapPin size={16} />
                  <span>{t('deliveries.express.area')}</span>
                </div>
              </div>
              <div className="mt-4 bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-medium">
                {t('deliveries.express.popular')}
              </div>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiClock className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('deliveries.sameDay.title')}</h3>
              <div className="text-3xl font-bold text-accent mb-4">{t('deliveries.sameDay.price')}</div>
              <p className="text-gray-300 mb-4">
                {t('deliveries.sameDay.desc')}
              </p>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center justify-center gap-2">
                  <FiClock size={16} />
                  <span>{t('deliveries.sameDay.time')}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <FiMapPin size={16} />
                  <span>{t('deliveries.sameDay.area')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-background-secondary py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">{t('deliveries.quickActions')}</h2>
          </ScrollAnimation>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiTruck className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{t('deliveries.trackOrder')}</h3>
              <p className="text-gray-300 mb-6">
                {t('deliveries.trackOrderDesc')}
              </p>
              <a 
                href="/orders"
                className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-light transition-colors font-medium"
              >
                {t('deliveries.myOrders')}
              </a>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiPlus className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{t('deliveries.addAddress')}</h3>
              <p className="text-gray-300 mb-6">
                {t('deliveries.addAddressDesc')}
              </p>
              <a 
                href="/shop"
                className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-light transition-colors font-medium"
              >
                {t('deliveries.continueShopping')}
              </a>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiPackage className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{t('deliveries.needHelp')}</h3>
              <p className="text-gray-300 mb-6">
                {t('deliveries.needHelpDesc')}
              </p>
              <a 
                href="/support"
                className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-light transition-colors font-medium"
              >
                {t('deliveries.support')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
