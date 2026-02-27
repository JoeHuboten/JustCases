'use client';

import { FiCreditCard, FiShield, FiDollarSign, FiCheckCircle, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import ScrollAnimation, { StaggerAnimation } from '@/components/ScrollAnimation';
import { useState } from 'react';

export default function PaymentsPage() {
  const [selectedCategory, setSelectedCategory] = useState('methods');

  const faqData = {
    methods: [
      {
        question: "Какви методи за плащане приемате?",
        answer: "Приемаме кредитни карти (Visa, Mastercard), PayPal, Apple Pay и Google Pay. Всички плащания се обработват безопасно чрез Stripe."
      },
      {
        question: "Безопасно ли е плащането?",
        answer: "Да, всички плащания се обработват чрез Stripe, което е световен лидер в онлайн плащанията. Ние не съхраняваме данните за вашите карти."
      },
      {
        question: "Мога ли да платя с дебитна карта?",
        answer: "Да, можете да използвате дебитни карти, които поддържат онлайн плащания. Картата трябва да има логото на Visa или Mastercard."
      },
      {
        question: "Работи ли Apple Pay и Google Pay?",
        answer: "Да, и двата метода са налични за мобилни устройства. Те са по-бързи и по-безопасни от традиционните плащания с карта."
      }
    ],
    security: [
      {
        question: "Как защитавате данните за плащане?",
        answer: "Използваме SSL криптиране и Stripe за обработка на плащанията. Ние не съхраняваме номера на карти или CVV кодове на нашите сървъри."
      },
      {
        question: "Какво е Stripe?",
        answer: "Stripe е световен лидер в онлайн плащанията, използван от милиони компании. Той е сертифициран за PCI DSS Level 1 - най-високия стандарт за безопасност."
      },
      {
        question: "Мога ли да доверя данните си на Stripe?",
        answer: "Да, Stripe е използван от компании като Amazon, Google и Microsoft. Той е сертифициран и редовно аудитиран за безопасност."
      },
      {
        question: "Какво се случва с данните ми след плащане?",
        answer: "След плащане Stripe ни изпраща само потвърждение за успешното плащане. Всички чувствителни данни остават в защитената среда на Stripe."
      }
    ],
    issues: [
      {
        question: "Какво да правя, ако плащането не минава?",
        answer: "Проверете дали картата има достатъчно средства, дали данните са въведени правилно, и дали картата поддържа онлайн плащания. Опитайте с друг метод за плащане."
      },
      {
        question: "Защо получавам грешка 'Картата е отхвърлена'?",
        answer: "Това може да се дължи на недостатъчни средства, ограничения от банката, или проблеми с картата. Свържете се с банката си или опитайте с друга карта."
      },
      {
        question: "Какво да правя, ако съм платил два пъти?",
        answer: "Ако случайно сте платили два пъти, веднага се свържете с нас на support@justcases.bg. Ще върнем двойното плащане в рамките на 5-7 работни дни."
      },
      {
        question: "Мога ли да платя на части?",
        answer: "В момента не предлагаме плащане на части. Всички плащания се изискват наведнъж при поръчката."
      }
    ],
    refunds: [
      {
        question: "Как да върна парите си?",
        answer: "За да върнете парите, първо върнете продукта според нашата политика за връщане. След получаване на върнатия продукт, парите се възстановяват автоматично."
      },
      {
        question: "Колко време отнема възстановяването?",
        answer: "Възстановяването се извършва в рамките на 5-7 работни дни след получаване на върнатия продукт. За кредитни карти може да отнеме до 10 работни дни."
      },
      {
        question: "По какъв начин се връщат парите?",
        answer: "Парите се връщат по същия начин на плащане - ако сте платили с карта, парите се връщат на същата карта. При PayPal плащания, парите се връщат в PayPal акаунта."
      },
      {
        question: "Има ли такси за връщане?",
        answer: "Няма такси за връщане от наша страна. Ако банката ви налага такси за обработка на възстановяване, те са за ваша сметка."
      }
    ]
  };

  const paymentMethods = [
    {
      name: 'Кредитни карти',
      icon: FiCreditCard,
      description: 'Visa, Mastercard',
      features: ['Безопасно', 'Бързо', 'Широко приемано'],
      color: 'text-blue-500'
    },
    {
      name: 'PayPal',
      icon: FiShield,
      description: 'Онлайн портфейл',
      features: ['Защитено', 'Лесно', 'Без регистрация'],
      color: 'text-blue-600'
    },
    {
      name: 'Apple Pay',
      icon: FiDollarSign,
      description: 'Мобилно плащане',
      features: ['Безжично', 'Биометрично', 'Бързо'],
      color: 'text-gray-800'
    },
    {
      name: 'Google Pay',
      icon: FiCheckCircle,
      description: 'Мобилно плащане',
      features: ['Безжично', 'Биометрично', 'Бързо'],
      color: 'text-green-500'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0a0a0f] to-blue-900/20 py-20">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn" className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">Плащания - Често задавани въпроси</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Научете всичко за нашите методи за плащане, безопасността и как да решавате проблеми с плащанията.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Методи за плащане</h2>
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
            <h2 className="text-4xl font-bold text-white text-center mb-12">Безопасност на плащанията</h2>
          </ScrollAnimation>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiShield className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">SSL криптиране</h3>
              <p className="text-gray-300">
                Всички данни се предават чрез защитена връзка с 256-битово криптиране
              </p>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiCheckCircle className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">PCI DSS сертификация</h3>
              <p className="text-gray-300">
                Stripe е сертифициран за най-високия стандарт за безопасност на плащанията
              </p>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiAlertCircle className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Мониторинг 24/7</h3>
              <p className="text-gray-300">
                Постоянен мониторинг за подозрителна активност и измами
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Често задавани въпроси</h2>
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
              Методи за плащане
            </button>
            <button
              onClick={() => setSelectedCategory('security')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === 'security'
                  ? 'bg-accent text-white'
                  : 'bg-primary text-gray-300 hover:text-white'
              }`}
            >
              Безопасност
            </button>
            <button
              onClick={() => setSelectedCategory('issues')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === 'issues'
                  ? 'bg-accent text-white'
                  : 'bg-primary text-gray-300 hover:text-white'
              }`}
            >
              Проблеми
            </button>
            <button
              onClick={() => setSelectedCategory('refunds')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === 'refunds'
                  ? 'bg-accent text-white'
                  : 'bg-primary text-gray-300 hover:text-white'
              }`}
            >
              Възстановяване
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
            <h2 className="text-4xl font-bold text-white text-center mb-12">Процес на плащане</h2>
          </ScrollAnimation>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Изберете плащане</h3>
              <p className="text-gray-300 text-sm">
                Изберете предпочитания метод за плащане от наличните опции
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Въведете данни</h3>
              <p className="text-gray-300 text-sm">
                Въведете данните за плащане в защитената форма
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Потвърдете</h3>
              <p className="text-gray-300 text-sm">
                Потвърдете плащането и изчакайте обработката
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">4</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Получете потвърждение</h3>
              <p className="text-gray-300 text-sm">
                Получете потвърждение за успешното плащане по имейл
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Бързи действия</h2>
          </ScrollAnimation>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiCreditCard className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Направете поръчка</h3>
              <p className="text-gray-300 mb-6">
                Разгледайте продуктите и направете поръчка с безопасно плащане
              </p>
              <a 
                href="/shop"
                className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-light transition-colors font-medium"
              >
                Пазарувайте
              </a>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiRefreshCw className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Проследете плащането</h3>
              <p className="text-gray-300 mb-6">
                Влезте в акаунта си за да видите статуса на плащанията
              </p>
              <a 
                href="/orders"
                className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-light transition-colors font-medium"
              >
                Моите поръчки
              </a>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiShield className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Нужда от помощ?</h3>
              <p className="text-gray-300 mb-6">
                Свържете се с нас за въпроси относно плащанията
              </p>
              <a 
                href="/support"
                className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-light transition-colors font-medium"
              >
                Поддръжка
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
