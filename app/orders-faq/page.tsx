'use client';

import { FiShoppingBag, FiClock, FiCheckCircle, FiX, FiEdit, FiRefreshCw } from 'react-icons/fi';
import ScrollAnimation, { StaggerAnimation } from '@/components/ScrollAnimation';
import { useState } from 'react';

export default function OrdersFaqPage() {
  const [selectedCategory, setSelectedCategory] = useState('placing');

  const faqData = {
    placing: [
      {
        question: "Как да направя поръчка?",
        answer: "Изберете желаните продукти, добавете ги в количката, въведете адреса за доставка, изберете метод за плащане и потвърдете поръчката. Ще получите потвърждение по имейл."
      },
      {
        question: "Мога ли да променя поръчка след като я направя?",
        answer: "Можете да промените или отмените поръчка в рамките на 2 часа от направената поръчка, при условие че тя все още не е изпратена. Свържете се с нас веднага за помощ."
      },
      {
        question: "Как да добавя продукти в количката?",
        answer: "Кликнете върху 'Добави в количката' на страницата на продукта. Можете да изберете количество и варианти преди добавяне. Количката се запазва между сесиите."
      },
      {
        question: "Мога ли да запазя продукти за по-късно?",
        answer: "Да, можете да добавите продукти в 'Любими' като кликнете върху иконата сърце. Те ще бъдат запазени в акаунта ви за по-късно."
      }
    ],
    status: [
      {
        question: "Какви са възможните статуси на поръчката?",
        answer: "PENDING (в очакване), PROCESSING (в обработка), SHIPPED (изпратена), DELIVERED (доставена), CANCELLED (отменена). Можете да проследявате статуса в акаунта си."
      },
      {
        question: "Колко време отнема обработката на поръчката?",
        answer: "Обработваме всички поръчки в рамките на 24 часа от получаването им. След това изпращаме поръчката с избрания от вас куриер."
      },
      {
        question: "Получавам ли уведомления за промени в статуса?",
        answer: "Да, получавате имейл уведомления при всяка промяна в статуса на поръчката. Можете също да включите SMS уведомления в настройките на акаунта."
      },
      {
        question: "Какво означава 'PENDING' статус?",
        answer: "PENDING означава, че поръчката е получена, но плащането все още не е потвърдено. След успешно плащане статусът се променя на PROCESSING."
      }
    ],
    cancellation: [
      {
        question: "Мога ли да отменя поръчка?",
        answer: "Можете да отмените поръчка в рамките на 2 часа от направената поръчка, при условие че тя все още не е изпратена. Свържете се с нас на support@justcases.bg."
      },
      {
        question: "Какво се случва с парите при отмяна?",
        answer: "При отмяна на поръчка парите се връщат по същия начин на плащане в рамките на 5-7 работни дни. За кредитни карти може да отнеме до 10 работни дни."
      },
      {
        question: "Мога ли да отменя само част от поръчката?",
        answer: "Ако поръчката все още не е изпратена, можем да отменим само определени продукти. Свържете се с нас за помощ с такива промени."
      },
      {
        question: "Какво да правя, ако искам да отменя поръчка след изпращане?",
        answer: "След изпращане на пратката, тя ще се върне автоматично при отказ от получаване. Възстановяването на парите се извършва след получаване на върнатата пратка."
      }
    ],
    history: [
      {
        question: "Как да видя историята на поръчките си?",
        answer: "Влезте в акаунта си и отидете в секцията 'Моите поръчки'. Там ще видите всички ваши поръчки с техните статуси и детайли."
      },
      {
        question: "Колко дълго се запазва историята на поръчките?",
        answer: "Историята на поръчките се запазва за 7 години в съответствие с българското счетоводно законодателство. Можете да я видите в акаунта си по всяко време."
      },
      {
        question: "Мога ли да повторя стара поръчка?",
        answer: "Да, в историята на поръчките можете да кликнете 'Повтори поръчка' за да добавите същите продукти в количката. Ще трябва да потвърдите адреса и плащането."
      },
      {
        question: "Как да изтегля фактура за поръчка?",
        answer: "В детайлите на всяка поръчка има бутон 'Изтегли фактура'. Фактурите са достъпни в PDF формат и се генерират автоматично след плащане."
      }
    ]
  };

  const orderStatuses = [
    {
      status: 'PENDING',
      icon: FiClock,
      title: 'В очакване',
      description: 'Поръчката е получена, очаква се потвърждение на плащането',
      color: 'text-yellow-500'
    },
    {
      status: 'PROCESSING',
      icon: FiRefreshCw,
      title: 'В обработка',
      description: 'Плащането е потвърдено, поръчката се подготвя за изпращане',
      color: 'text-blue-500'
    },
    {
      status: 'SHIPPED',
      icon: FiShoppingBag,
      title: 'Изпратена',
      description: 'Поръчката е изпратена с куриер, можете да я проследявате',
      color: 'text-purple-500'
    },
    {
      status: 'DELIVERED',
      icon: FiCheckCircle,
      title: 'Доставена',
      description: 'Поръчката е успешно доставена на посочения адрес',
      color: 'text-green-500'
    },
    {
      status: 'CANCELLED',
      icon: FiX,
      title: 'Отменена',
      description: 'Поръчката е отменена, парите ще бъдат възстановени',
      color: 'text-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-700 py-20">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn" className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">Поръчки - Често задавани въпроси</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Научете всичко за правенето на поръчки, проследяването им и управлението на историята на покупките.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Order Statuses */}
      <section className="py-16">
        <div className="container-custom">
          <ScrollAnimation animation="fadeIn">
            <h2 className="text-4xl font-bold text-white text-center mb-12">Статуси на поръчките</h2>
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
            <h2 className="text-4xl font-bold text-white text-center mb-12">Често задавани въпроси</h2>
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
              Правене на поръчка
            </button>
            <button
              onClick={() => setSelectedCategory('status')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === 'status'
                  ? 'bg-accent text-white'
                  : 'bg-primary text-gray-300 hover:text-white'
              }`}
            >
              Статус на поръчка
            </button>
            <button
              onClick={() => setSelectedCategory('cancellation')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === 'cancellation'
                  ? 'bg-accent text-white'
                  : 'bg-primary text-gray-300 hover:text-white'
              }`}
            >
              Отмяна
            </button>
            <button
              onClick={() => setSelectedCategory('history')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === 'history'
                  ? 'bg-accent text-white'
                  : 'bg-primary text-gray-300 hover:text-white'
              }`}
            >
              История
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
            <h2 className="text-4xl font-bold text-white text-center mb-12">Процес на поръчка</h2>
          </ScrollAnimation>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Изберете продукти</h3>
              <p className="text-gray-300 text-sm">
                Разгледайте каталога и добавете желаните продукти в количката
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Потвърдете поръчката</h3>
              <p className="text-gray-300 text-sm">
                Проверете продуктите, въведете адреса и изберете плащане
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Платете</h3>
              <p className="text-gray-300 text-sm">
                Платете безопасно с кредитна карта, PayPal или други методи
              </p>
            </div>
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">4</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Получете поръчката</h3>
              <p className="text-gray-300 text-sm">
                Проследявайте доставката и получете поръчката си
              </p>
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
                <FiShoppingBag className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Моите поръчки</h3>
              <p className="text-gray-300 mb-6">
                Влезте в акаунта си за да видите всички поръчки и техния статус
              </p>
              <a 
                href="/orders"
                className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-light transition-colors font-medium"
              >
                Вижте поръчките
              </a>
            </div>

            <div className="bg-primary rounded-2xl p-8 text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiEdit className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Направете поръчка</h3>
              <p className="text-gray-300 mb-6">
                Разгледайте нашите продукти и направете нова поръчка
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
                <FiCheckCircle className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Нужда от помощ?</h3>
              <p className="text-gray-300 mb-6">
                Свържете се с нас за въпроси относно поръчките
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
