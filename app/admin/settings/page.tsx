'use client';

import { useState } from 'react';
import { FiSave, FiMail, FiGlobe, FiDollarSign, FiTruck, FiShield } from 'react-icons/fi';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'Just Cases',
    siteDescription: 'Premium phone cases and accessories',
    siteUrl: 'https://justcases.com',
    contactEmail: 'support@justcases.com',
    
    // Currency Settings
    currency: 'USD',
    currencySymbol: '$',
    
    // Shipping Settings
    freeShippingThreshold: '50',
    standardShippingFee: '5.99',
    expressShippingFee: '12.99',
    
    // Tax Settings
    taxRate: '10',
    taxEnabled: true,
    
    // Email Settings
    emailNotifications: true,
    orderConfirmationEmail: true,
    shippingUpdateEmail: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In a real app, this would save to the database
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Настройки</h1>
        <p className="text-text-secondary mt-2">Конфигурирайте настройките на вашия магазин</p>
      </div>

      {/* General Settings */}
      <div className="bg-background-secondary rounded-lg border border-gray-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <FiGlobe className="text-accent" size={24} />
          <h2 className="text-xl font-semibold text-white">Общи настройки</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Наименование на сайта</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Описание на сайта</label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">URL на сайта</label>
            <input
              type="url"
              value={settings.siteUrl}
              onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Имейл за контакт</label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      {/* Currency Settings */}
      <div className="bg-background-secondary rounded-lg border border-gray-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <FiDollarSign className="text-accent" size={24} />
          <h2 className="text-xl font-semibold text-white">Настройки за валута</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Валута</label>
            <select
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white focus:outline-none focus:border-accent"
            >
              <option value="USD">USD - Щатски долар</option>
              <option value="EUR">EUR - Евро</option>
              <option value="GBP">GBP - Британска лира</option>
              <option value="BGN">BGN - Български лев</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Символ на валутата</label>
            <input
              type="text"
              value={settings.currencySymbol}
              onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      {/* Shipping Settings */}
      <div className="bg-background-secondary rounded-lg border border-gray-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <FiTruck className="text-accent" size={24} />
          <h2 className="text-xl font-semibold text-white">Настройки за доставка</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Праг за безплатна доставка (лв.)
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.freeShippingThreshold}
              onChange={(e) => setSettings({ ...settings, freeShippingThreshold: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white focus:outline-none focus:border-accent"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Стандартна такса доставка (лв.)
              </label>
              <input
                type="number"
                step="0.01"
                value={settings.standardShippingFee}
                onChange={(e) => setSettings({ ...settings, standardShippingFee: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Експресна такса доставка (лв.)
              </label>
              <input
                type="number"
                step="0.01"
                value={settings.expressShippingFee}
                onChange={(e) => setSettings({ ...settings, expressShippingFee: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tax Settings */}
      <div className="bg-background-secondary rounded-lg border border-gray-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <FiShield className="text-accent" size={24} />
          <h2 className="text-xl font-semibold text-white">Данъчни настройки</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.taxEnabled}
                onChange={(e) => setSettings({ ...settings, taxEnabled: e.target.checked })}
                className="mr-3"
              />
              <span className="text-white">Активирай изчисляване на данъци</span>
            </label>
          </div>
          {settings.taxEnabled && (
            <div>
              <label className="block text-sm font-medium text-white mb-2">Данъчна ставка (%)</label>
              <input
                type="number"
                step="0.01"
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-gray-800 rounded-lg text-white focus:outline-none focus:border-accent"
              />
            </div>
          )}
        </div>
      </div>

      {/* Email Settings */}
      <div className="bg-background-secondary rounded-lg border border-gray-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <FiMail className="text-accent" size={24} />
          <h2 className="text-xl font-semibold text-white">Имейл известия</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="mr-3"
              />
              <span className="text-white">Активирай имейл известия</span>
            </label>
          </div>
          {settings.emailNotifications && (
            <>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.orderConfirmationEmail}
                    onChange={(e) => setSettings({ ...settings, orderConfirmationEmail: e.target.checked })}
                    className="mr-3"
                  />
                  <span className="text-white">Изпращай имейли за потвърждение на поръчка</span>
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.shippingUpdateEmail}
                    onChange={(e) => setSettings({ ...settings, shippingUpdateEmail: e.target.checked })}
                    className="mr-3"
                  />
                  <span className="text-white">Изпращай имейли за актуализация на доставка</span>
                </label>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-4">
        {saved && (
          <span className="text-green-500 text-sm">Настройките са запазени успешно!</span>
        )}
        <button
          onClick={handleSave}
          className="btn-primary flex items-center gap-2"
        >
          <FiSave size={20} />
          Запази настройките
        </button>
      </div>

      {/* Info Message */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
        <p className="text-yellow-400 text-sm">
          <strong>Бележка:</strong> Тези настройки са само за показване. В производствена среда ще се запазват в базата данни и ще се прилагат във целия сайт.
        </p>
      </div>
    </div>
  );
}

