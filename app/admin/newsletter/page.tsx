'use client';

import { useState, useEffect } from 'react';
import { FiSend, FiUsers, FiMail, FiPercent, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { apiFetch } from '@/lib/client-api';

interface Subscriber {
  id: string;
  email: string;
  active: boolean;
  subscribedAt: string;
}

interface SendResult {
  success: boolean;
  sent?: number;
  failed?: number;
  message?: string;
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<SendResult | null>(null);

  // Email form state
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [emailType, setEmailType] = useState<'custom' | 'promo'>('custom');
  const [discountPercent, setDiscountPercent] = useState(67);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await fetch('/api/admin/newsletter/subscribers');
      if (res.ok) {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          setSubscribers(data.subscribers || []);
        } catch (e) {
          console.error('Invalid JSON response:', text);
        }
      } else {
        console.error('Failed to fetch subscribers:', res.status, res.statusText);
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNewsletter = async () => {
    if (!subject.trim() || !message.trim()) {
      alert('Моля попълнете заглавие и съобщение');
      return;
    }

    setSending(true);
    setSendResult(null);

    try {
      const res = await apiFetch('/api/admin/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          message,
          type: emailType,
          discountPercent: emailType === 'promo' ? discountPercent : undefined,
        }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Invalid JSON response:', text);
        setSendResult({ success: false, message: 'Грешка при изпращане: невалиден отговор от сървъра' });
        return;
      }
      
      if (res.ok) {
        setSendResult({
          success: true,
          sent: data.sent ?? data.queued,
          failed: data.failed ?? data.skipped,
          message: data.message,
        });
        setSubject('');
        setMessage('');
      } else {
        setSendResult({ success: false, message: data.error || 'Грешка при изпращане' });
      }
    } catch (error) {
      setSendResult({ success: false, message: 'Грешка при изпращане' });
      console.error('Error sending newsletter:', error);
    } finally {
      setSending(false);
    }
  };

  const activeSubscribers = subscribers.filter(s => s.active);
  const inactiveSubscribers = subscribers.filter(s => !s.active);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Управление на бюлетин</h1>
        <p className="text-text-secondary">Управление на бюлетин и абонати</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-background-secondary border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Общо абонати</p>
              <p className="text-3xl font-bold text-white mt-2">{subscribers.length}</p>
            </div>
            <FiUsers className="text-accent text-4xl" />
          </div>
        </div>

        <div className="bg-background-secondary border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Активни</p>
              <p className="text-3xl font-bold text-green-500 mt-2">{activeSubscribers.length}</p>
            </div>
            <FiCheckCircle className="text-green-500 text-4xl" />
          </div>
        </div>

        <div className="bg-background-secondary border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Неактивни</p>
              <p className="text-3xl font-bold text-red-500 mt-2">{inactiveSubscribers.length}</p>
            </div>
            <FiAlertCircle className="text-red-500 text-4xl" />
          </div>
        </div>
      </div>

      {/* Send Newsletter Form */}
      <div className="bg-background-secondary border border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <FiMail className="mr-2" />
          Изпрати бюлетин
        </h2>

        {sendResult && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              sendResult.success
                ? 'bg-green-500/10 border-green-500 text-green-500'
                : 'bg-red-500/10 border-red-500 text-red-500'
            }`}
          >
            <p className="font-semibold">
              {sendResult.success ? '✅ Успешно изпратено!' : '❌ Грешка'}
            </p>
            <p className="text-sm mt-1">
              {sendResult.message || 
                (sendResult.success 
                  ? `Изпратено до ${sendResult.sent} получатели${sendResult.failed ? `, ${sendResult.failed} неуспешни` : ''}`
                  : 'Моля опитайте отново')}
            </p>
          </div>
        )}

        {/* Email Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-secondary mb-3">
            Тип имейл
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => setEmailType('custom')}
              className={`flex-1 p-4 rounded-lg border transition ${
                emailType === 'custom'
                  ? 'border-accent bg-accent/10 text-white'
                  : 'border-gray-700 text-text-secondary hover:border-gray-600'
              }`}
            >
              <FiMail className="mx-auto mb-2 text-2xl" />
              <p className="font-medium">Обичайно съобщение</p>
            </button>
            <button
              onClick={() => setEmailType('promo')}
              className={`flex-1 p-4 rounded-lg border transition ${
                emailType === 'promo'
                  ? 'border-accent bg-accent/10 text-white'
                  : 'border-gray-700 text-text-secondary hover:border-gray-600'
              }`}
            >
              <FiPercent className="mx-auto mb-2 text-2xl" />
              <p className="font-medium">Промо с отстъпка</p>
            </button>
          </div>
        </div>

        {/* Discount Percentage (only for promo) */}
        {emailType === 'promo' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Процент отстъпка (%)
            </label>
            <input
              type="number"
              min="1"
              max="99"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(Math.min(99, Math.max(1, parseInt(e.target.value) || 0)))}
              className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <p className="text-xs text-text-secondary mt-1">
              Генерира уникален промо код за всеки абонат
            </p>
          </div>
        )}

        {/* Subject */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Заглавие
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Напр: За всички халки леко намаление"
            className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Message */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Съобщение
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Напишете вашето съобщение..."
            rows={6}
            className="w-full px-4 py-3 bg-background border border-gray-700 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent resize-none"
          />
          <p className="text-xs text-text-secondary mt-2">
            Съобщението ще бъде форматирано с красив HTML дизайн
          </p>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSendNewsletter}
          disabled={sending || !subject.trim() || !message.trim()}
          className="w-full bg-accent hover:bg-accent-hover text-white font-medium py-3 px-6 rounded-lg transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              Изпраща се до {activeSubscribers.length} абонати...
            </>
          ) : (
            <>
              <FiSend className="mr-2" />
              Изпрати до {activeSubscribers.length} {activeSubscribers.length === 1 ? 'абонат' : 'абонати'}
            </>
          )}
        </button>
      </div>

      {/* Subscribers List */}
      <div className="bg-background-secondary border border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <FiUsers className="mr-2" />
          Списък абонати
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin"></div>
          </div>
        ) : subscribers.length === 0 ? (
          <p className="text-text-secondary text-center py-12">Няма абонати</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-text-secondary font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium">Статус</th>
                  <th className="text-left py-3 px-4 text-text-secondary font-medium">Дата на абониране</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="border-b border-gray-800 hover:bg-background/50 transition">
                    <td className="py-3 px-4 text-white">{sub.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          sub.active
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {sub.active ? 'Активен' : 'Неактивен'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text-secondary">
                      {new Date(sub.subscribedAt).toLocaleDateString('bg-BG')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
