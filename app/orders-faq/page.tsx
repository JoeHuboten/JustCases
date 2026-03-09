'use client';

import { FiShoppingBag, FiClock, FiCheckCircle, FiX, FiEdit, FiRefreshCw } from 'react-icons/fi';
import ScrollAnimation, { StaggerAnimation } from '@/components/ScrollAnimation';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function OrdersFaqPage() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('placing');

  const faqData = {
    placing: [
      { question: t('ordersFaq.faq.q1'), answer: t('ordersFaq.faq.a1') },
      { question: t('ordersFaq.faq.q2'), answer: t('ordersFaq.faq.a2') },
      { question: t('ordersFaq.faq.q3'), answer: t('ordersFaq.faq.a3') },
      { question: t('ordersFaq.faq.q4'), answer: t('ordersFaq.faq.a4') },
    ],
    status: [
      { question: t('ordersFaq.faq.q5'), answer: t('ordersFaq.faq.a5') },
      { question: t('ordersFaq.faq.q6'), answer: t('ordersFaq.faq.a6') },
      { question: t('ordersFaq.faq.q7'), answer: t('ordersFaq.faq.a7') },
      { question: t('ordersFaq.faq.q8'), answer: t('ordersFaq.faq.a8') },
    ],
    cancellation: [
      { question: t('ordersFaq.faq.q9'), answer: t('ordersFaq.faq.a9') },
      { question: t('ordersFaq.faq.q10'), answer: t('ordersFaq.faq.a10') },
      { question: t('ordersFaq.faq.q11'), answer: t('ordersFaq.faq.a11') },
      { question: t('ordersFaq.faq.q12'), answer: t('ordersFaq.faq.a12') },
    ],
    history: [
      { question: t('ordersFaq.faq.q13'), answer: t('ordersFaq.faq.a13') },
      { question: t('ordersFaq.faq.q14'), answer: t('ordersFaq.faq.a14') },
      { question: t('ordersFaq.faq.q15'), answer: t('ordersFaq.faq.a15') },
      { question: t('ordersFaq.faq.q16'), answer: t('ordersFaq.faq.a16') },
    ]
  };

  const orderStatuses = [
    {
      status: 'PENDING',
      icon: FiClock,
      title: t('ordersFaq.status.pending'),
      description: t('ordersFaq.status.pendingDesc'),
      color: 'text-yellow-500'
    },
    {
      status: 'PROCESSING',
      icon: FiRefreshCw,
      title: t('ordersFaq.status.processing'),
      description: t('ordersFaq.status.processingDesc'),
      color: 'text-blue-500'
    },
    {
      status: 'SHIPPED',
      icon: FiShoppingBag,
      title: t('ordersFaq.status.shipped'),
      description: t('ordersFaq.status.shippedDesc'),
      color: 'text-purple-500'
    },
    {
      status: 'DELIVERED',
      icon: FiCheckCircle,
      title: t('ordersFaq.status.delivered'),
      description: t('ordersFaq.status.deliveredDesc'),
      color: 'text-green-500'
    },
    {
      status: 'CANCELLED',
      icon: FiX,
      title: t('ordersFaq.status.cancelled'),
      description: t('ordersFaq.status.cancelledDesc'),
      color: 'text-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-700 py-20">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn" className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">{t('ordersFaq.title')}</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('ordersFaq.subtitle')}
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Order Statuses */}
      <section className="py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">{t('ordersFaq.statuses.title')}</h2>
          </ScrollAnimation>
          <StaggerAnimation animation="scaleUp" stagger={0.1} className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {orderStatuses.map((status, index) => (
              <div key={index} className="bg-primary rounded-2xl p-6 text-center">
                <div className={`${status.color} text-4xl mb-4 flex justify-center`}>
                  <status.icon size={40} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{status.title}</h3>
                <p className="text-gray-300 text-sm">{status.description}</p>
              </div>
            ))}
          </StaggerAnimation>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-background-secondary py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">{t('ordersFaq.faq.title')}</h2>
          </ScrollAnimation>
          
          {/* FAQ Categories */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setSelectedCategory('placing')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === 'placing'
                  ? 'bg-accent text-white'
                  : 'bg-primary text-gray-300 hover:text-white'
              }`}
            >
              {t('ordersFaq.faq.placing')}
            </button>
            <button
              onClick={() => setSelectedCategory('status')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === 'status'
                  ? 'bg-accent text-white'
                  : 'bg-primary text-gray-300 hover:text-white'
              }`}
            >
              {t('ordersFaq.faq.status')}
            </button>
            <button
              onClick={() => setSelectedCategory('cancellation')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === 'cancellation'
                  ? 'bg-accent text-white'
                  : 'bg-primary text-gray-300 hover:text-white'
              }`}
            >
              {t('ordersFaq.faq.cancel')}
            </button>
            <button
              onClick={() => setSelectedCategory('history')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === 'history'
                  ? 'bg-accent text-white'
                  : 'bg-primary text-gray-300 hover:text-white'
              }`}
            >
              {t('ordersFaq.faq.history')}
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

      {/* Order Process */}
      <section className="py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">{t('ordersFaq.process.title')}</h2>
          </ScrollAnimation>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('ordersFaq.process.step1')}</h3>
              <p className="text-gray-300 text-sm">
                {t('ordersFaq.process.step1Desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('ordersFaq.process.step2')}</h3>
              <p className="text-gray-300 text-sm">
                {t('ordersFaq.process.step2Desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('ordersFaq.process.step3')}</h3>
              <p className="text-gray-300 text-sm">
                {t('ordersFaq.process.step3Desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">4</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('ordersFaq.process.step4')}</h3>
              <p className="text-gray-300 text-sm">
                {t('ordersFaq.process.step4Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-background-secondary py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">{t('ordersFaq.quickActions')}</h2>
          </ScrollAnimation>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiShoppingBag className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{t('ordersFaq.myOrders')}</h3>
              <p className="text-gray-300 mb-6">
                {t('ordersFaq.myOrdersDesc')}
              </p>
              <a 
                href="/orders"
                className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-light transition-colors font-medium"
              >
                {t('ordersFaq.viewOrders')}
              </a>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiEdit className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{t('ordersFaq.placeOrder')}</h3>
              <p className="text-gray-300 mb-6">
                {t('ordersFaq.placeOrderDesc')}
              </p>
              <a 
                href="/shop"
                className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-light transition-colors font-medium"
              >
                {t('ordersFaq.shop')}
              </a>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiCheckCircle className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{t('ordersFaq.needHelp')}</h3>
              <p className="text-gray-300 mb-6">
                {t('ordersFaq.needHelpDesc')}
              </p>
              <a 
                href="/support"
                className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-light transition-colors font-medium"
              >
                {t('ordersFaq.support')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
