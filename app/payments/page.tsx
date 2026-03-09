'use client';

import { FiCreditCard, FiShield, FiDollarSign, FiCheckCircle, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import ScrollAnimation, { StaggerAnimation } from '@/components/ScrollAnimation';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PaymentsPage() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('methods');

  const faqData = {
    methods: [
      {
        question: t('payments.faq.methods.q1'),
        answer: t('payments.faq.methods.a1')
      },
      {
        question: t('payments.faq.methods.q2'),
        answer: t('payments.faq.methods.a2')
      },
      {
        question: t('payments.faq.methods.q3'),
        answer: t('payments.faq.methods.a3')
      },
      {
        question: t('payments.faq.methods.q4'),
        answer: t('payments.faq.methods.a4')
      }
    ],
    security: [
      {
        question: t('payments.faq.security.q1'),
        answer: t('payments.faq.security.a1')
      },
      {
        question: t('payments.faq.security.q2'),
        answer: t('payments.faq.security.a2')
      },
      {
        question: t('payments.faq.security.q3'),
        answer: t('payments.faq.security.a3')
      },
      {
        question: t('payments.faq.security.q4'),
        answer: t('payments.faq.security.a4')
      }
    ],
    issues: [
      {
        question: t('payments.faq.issues.q1'),
        answer: t('payments.faq.issues.a1')
      },
      {
        question: t('payments.faq.issues.q2'),
        answer: t('payments.faq.issues.a2')
      },
      {
        question: t('payments.faq.issues.q3'),
        answer: t('payments.faq.issues.a3')
      },
      {
        question: t('payments.faq.issues.q4'),
        answer: t('payments.faq.issues.a4')
      }
    ],
    refunds: [
      {
        question: t('payments.faq.refunds.q1'),
        answer: t('payments.faq.refunds.a1')
      },
      {
        question: t('payments.faq.refunds.q2'),
        answer: t('payments.faq.refunds.a2')
      },
      {
        question: t('payments.faq.refunds.q3'),
        answer: t('payments.faq.refunds.a3')
      },
      {
        question: t('payments.faq.refunds.q4'),
        answer: t('payments.faq.refunds.a4')
      }
    ]
  };

  const paymentMethods = [
    {
      name: t('payments.method.cards'),
      icon: FiCreditCard,
      description: 'Visa, Mastercard',
      features: [t('payments.method.safe'), t('payments.method.fast'), t('payments.method.widelyAccepted')],
      color: 'text-blue-500'
    },
    {
      name: 'PayPal',
      icon: FiShield,
      description: t('payments.method.wallet'),
      features: [t('payments.method.protected'), t('payments.method.easy'), t('payments.method.noRegistration')],
      color: 'text-blue-600'
    },
    {
      name: 'Apple Pay',
      icon: FiDollarSign,
      description: t('payments.method.mobile'),
      features: [t('payments.method.wireless'), t('payments.method.biometric'), t('payments.method.fast')],
      color: 'text-gray-800'
    },
    {
      name: 'Google Pay',
      icon: FiCheckCircle,
      description: t('payments.method.mobile'),
      features: [t('payments.method.wireless'), t('payments.method.biometric'), t('payments.method.fast')],
      color: 'text-green-500'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0a0a0f] to-blue-900/20 py-20">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn" className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">{t('payments.title')}</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('payments.subtitle')}
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">{t('payments.methods')}</h2>
          </ScrollAnimation>
          <StaggerAnimation animation="scaleUp" stagger={0.2} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {paymentMethods.map((method, index) => (
              <div key={index} className="bg-primary rounded-2xl p-8 text-center hover:scale-105 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300 group">
                <div className={`${method.color} text-4xl mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <method.icon size={40} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors duration-300">{method.name}</h3>
                <p className="text-gray-300 mb-4 group-hover:text-gray-200 transition-colors duration-300">{method.description}</p>
                <ul className="space-y-2">
                  {method.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-gray-300 text-sm flex items-center justify-center gap-2 group-hover:text-gray-200 transition-colors duration-300">
                      <FiCheckCircle className="text-accent" size={14} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </StaggerAnimation>
        </div>
      </section>

      {/* Security Features */}
      <section className="bg-background-secondary py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">{t('payments.security')}</h2>
          </ScrollAnimation>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiShield className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{t('payments.security.ssl')}</h3>
              <p className="text-gray-300">
                {t('payments.security.sslDesc')}
              </p>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiCheckCircle className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{t('payments.security.pci')}</h3>
              <p className="text-gray-300">
                {t('payments.security.pciDesc')}
              </p>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiAlertCircle className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{t('payments.security.monitoring')}</h3>
              <p className="text-gray-300">
                {t('payments.security.monitoringDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">{t('payments.faq.title')}</h2>
          </ScrollAnimation>
          
          {/* FAQ Categories */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setSelectedCategory('methods')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === 'methods'
                  ? 'bg-accent text-white'
                  : 'bg-primary text-gray-300 hover:text-white'
              }`}
            >
              {t('payments.faq.methods')}
            </button>
            <button
              onClick={() => setSelectedCategory('security')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === 'security'
                  ? 'bg-accent text-white'
                  : 'bg-primary text-gray-300 hover:text-white'
              }`}
            >
              {t('payments.faq.security')}
            </button>
            <button
              onClick={() => setSelectedCategory('issues')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === 'issues'
                  ? 'bg-accent text-white'
                  : 'bg-primary text-gray-300 hover:text-white'
              }`}
            >
              {t('payments.faq.issues')}
            </button>
            <button
              onClick={() => setSelectedCategory('refunds')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === 'refunds'
                  ? 'bg-accent text-white'
                  : 'bg-primary text-gray-300 hover:text-white'
              }`}
            >
              {t('payments.faq.refunds')}
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

      {/* Payment Process */}
      <section className="bg-background-secondary py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">{t('payments.process')}</h2>
          </ScrollAnimation>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('payments.process.step1')}</h3>
              <p className="text-gray-300 text-sm">
                {t('payments.process.step1Desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('payments.process.step2')}</h3>
              <p className="text-gray-300 text-sm">
                {t('payments.process.step2Desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('payments.process.step3')}</h3>
              <p className="text-gray-300 text-sm">
                {t('payments.process.step3Desc')}
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">4</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('payments.process.step4')}</h3>
              <p className="text-gray-300 text-sm">
                {t('payments.process.step4Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">{t('payments.quickActions')}</h2>
          </ScrollAnimation>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiCreditCard className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{t('payments.placeOrder')}</h3>
              <p className="text-gray-300 mb-6">
                {t('payments.placeOrderDesc')}
              </p>
              <a 
                href="/shop"
                className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-light transition-colors font-medium"
              >
                {t('payments.shop')}
              </a>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiRefreshCw className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{t('payments.trackPayment')}</h3>
              <p className="text-gray-300 mb-6">
                {t('payments.trackPaymentDesc')}
              </p>
              <a 
                href="/orders"
                className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-light transition-colors font-medium"
              >
                {t('payments.myOrders')}
              </a>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiShield className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{t('payments.needHelp')}</h3>
              <p className="text-gray-300 mb-6">
                {t('payments.needHelpDesc')}
              </p>
              <a 
                href="/support"
                className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-light transition-colors font-medium"
              >
                {t('payments.support')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
