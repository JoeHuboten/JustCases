'use client';

import { FiTruck, FiMapPin, FiClock, FiPackage, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import ScrollAnimation, { StaggerAnimation } from '@/components/ScrollAnimation';
import { useState } from 'react';

export default function DeliveriesPage() {
  const [selectedCategory, setSelectedCategory] = useState('tracking');

  const faqData = {
    tracking: [
      {
        question: "Как да проследя поръчката си?",
        answer: "След изпращане на поръчката ще получите имейл с номер за проследяване. Можете да използвате този номер в секцията 'Моите поръчки' или директно в сайта на куриерската компания."
      },
      {
        question: "Колко време отнема доставката?",
        answer: "Стандартната доставка отнема 3-5 работни дни, експресната 1-2 работни дни, а доставката в деня е налична само за София. Сроковете започват да се броят от деня на изпращане."
      },
      {
        question: "Получавам ли уведомления за статуса на доставката?",
        answer: "Да, получавате SMS и имейл уведомления при всяка промяна в статуса на поръчката - при изпращане, при предаване на куриера и при доставка."
      },
      {
        question: "Мога ли да променя адреса за доставка след изпращане?",
        answer: "Можете да промените адреса само ако пратката все още не е изпратена. Свържете се с нас веднага на support@justcases.bg за помощ."
      }
    ],
    addresses: [
      {
        question: "Как да добавя нов адрес за доставка?",
        answer: "В секцията 'Моите адреси' в акаунта си кликнете 'Добави нов адрес'. Въведете пълния адрес, включително пощенски код и телефон за контакт."
      },
      {
        question: "Колко адреса мога да имам?",
        answer: "Можете да имате до 10 различни адреса за доставка. Това ви позволява да избирате най-удобния адрес за всяка поръчка."
      },
      {
        question: "Мога ли да редактирам запазените адреси?",
        answer: "Да, можете да редактирате или изтривате запазените адреси в секцията 'Моите адреси'. Промените се запазват веднага."
      },
      {
        question: "Как да избера адрес по подразбиране?",
        answer: "В списъка с адреси можете да маркирате един като 'Адрес по подразбиране'. Този адрес ще се избира автоматично при нови поръчки."
      }
    ],
    issues: [
      {
        question: "Какво да правя, ако не получа пратката в очаквания срок?",
        answer: "Първо проверете статуса на пратката с номера за проследяване. Ако има забавяне, свържете се с нас на support@justcases.bg с номера на поръчката."
      },
      {
        question: "Какво да правя, ако пратката е повредена?",
        answer: "Веднага снимайте пратката и съдържанието и се свържете с нас. Ще ви изпратим нова пратка без допълнителни разходи."
      },
      {
        question: "Мога ли да откажа доставката?",
        answer: "Можете да откажете доставката, ако се свържете с нас преди изпращане на пратката. След изпращане, пратката ще се върне автоматично."
      },
      {
        question: "Какво да правя, ако не съм вкъщи при доставка?",
        answer: "Куриерът ще остави бележка с инструкции. Можете да се свържете с куриерската компания за преадресиране или повторна доставка."
      }
    ],
    international: [
      {
        question: "Доставяте ли извън България?",
        answer: "В момента доставяме само в България. Работим върху разширяване на услугите за доставка в други държави."
      },
      {
        question: "Има ли планове за международна доставка?",
        answer: "Да, планираме да започнем доставки в съседните държави през 2025 година. Следете нашите новини за актуализации."
      },
      {
        question: "Мога ли да поръчам за приятел в България?",
        answer: "Да, можете да поръчате за всеки адрес в България. Просто въведете адреса на получателя при поръчката."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0a0a0f] to-blue-900/20 py-20">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn" className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">Управление на доставки</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Научете как да управлявате адресите си, проследявате поръчките и решавате проблеми с доставката.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Delivery Management Features */}
      <section className="py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Възможности за управление</h2>
          </ScrollAnimation>
          <StaggerAnimation animation="scaleUp" stagger={0.2} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiTruck className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Проследяване</h3>
              <p className="text-gray-300">
                Проследявайте статуса на всички ваши поръчки в реално време
              </p>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiMapPin className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Адреси</h3>
              <p className="text-gray-300">
                Управлявайте множество адреси за доставка и фактуриране
              </p>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiClock className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Уведомления</h3>
              <p className="text-gray-300">
                Получавайте SMS и имейл уведомления за статуса на доставката
              </p>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiPackage className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">История</h3>
              <p className="text-gray-300">
                Вижте историята на всички ваши доставки и поръчки
              </p>
            </div>
          </StaggerAnimation>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-background-secondary py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Често задавани въпроси</h2>
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
              Проследяване
            </button>
            <button
              onClick={() => setSelectedCategory('addresses')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === 'addresses'
                  ? 'bg-accent text-white'
                  : 'bg-primary text-gray-300 hover:text-white'
              }`}
            >
              Адреси
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
              onClick={() => setSelectedCategory('international')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === 'international'
                  ? 'bg-accent text-white'
                  : 'bg-primary text-gray-300 hover:text-white'
              }`}
            >
              Международни
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
            <h2 className="text-4xl font-bold text-white text-center mb-12">Опции за доставка</h2>
          </ScrollAnimation>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiTruck className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Стандартна доставка</h3>
              <div className="text-3xl font-bold text-accent mb-4">Безплатно</div>
              <p className="text-gray-300 mb-4">
                За поръчки над 50 €.
              </p>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center justify-center gap-2">
                  <FiClock size={16} />
                  <span>3-5 работни дни</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <FiMapPin size={16} />
                  <span>Цяла България</span>
                </div>
              </div>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center border-2 border-accent">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiPackage className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Експресна доставка</h3>
              <div className="text-3xl font-bold text-accent mb-4">8.90 €.</div>
              <p className="text-gray-300 mb-4">
                За всички поръчки
              </p>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center justify-center gap-2">
                  <FiClock size={16} />
                  <span>1-2 работни дни</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <FiMapPin size={16} />
                  <span>Цяла България</span>
                </div>
              </div>
              <div className="mt-4 bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-medium">
                Най-популярно
              </div>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiClock className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Доставка в деня</h3>
              <div className="text-3xl font-bold text-accent mb-4">15.90 €.</div>
              <p className="text-gray-300 mb-4">
                Само за София
              </p>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center justify-center gap-2">
                  <FiClock size={16} />
                  <span>В същия ден</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <FiMapPin size={16} />
                  <span>Само София</span>
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
            <h2 className="text-4xl font-bold text-white text-center mb-12">Бързи действия</h2>
          </ScrollAnimation>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiTruck className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Проследете поръчка</h3>
              <p className="text-gray-300 mb-6">
                Влезте в акаунта си за да видите статуса на всички поръчки
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
                <FiPlus className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Добавете адрес</h3>
              <p className="text-gray-300 mb-6">
                Можете да добавите адрес за доставка директно при поръчка
              </p>
              <a 
                href="/shop"
                className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-light transition-colors font-medium"
              >
                Продължи с пазаруване
              </a>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiPackage className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Нужда от помощ?</h3>
              <p className="text-gray-300 mb-6">
                Свържете се с нас за въпроси относно доставката
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
