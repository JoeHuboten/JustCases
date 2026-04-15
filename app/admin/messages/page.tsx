'use client';

import { useEffect, useState } from 'react';
import { FiMail, FiUser, FiClock, FiCheckCircle, FiCircle } from 'react-icons/fi';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  replied: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/contact');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('bg-BG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Контактни съобщения</h1>
        <p className="text-text-secondary mt-2">
          Преглед и управление на запитвания от клиенти
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="bg-background-secondary rounded-lg p-8 text-center">
              <FiMail className="mx-auto text-5xl text-gray-600 mb-4" />
              <p className="text-text-secondary">Все още няма съобщения</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                onClick={() => setSelectedMessage(message)}
                className={`bg-background-secondary rounded-lg p-4 cursor-pointer transition hover:border-accent/50 border ${
                  selectedMessage?.id === message.id
                    ? 'border-accent'
                    : 'border-gray-800'
                } ${!message.read ? 'bg-accent/5' : ''}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FiUser className="text-accent" />
                    <span className="font-semibold text-white">
                      {message.name}
                    </span>
                    {!message.read && (
                      <span className="bg-accent text-white text-xs px-2 py-1 rounded">
                        Ново
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary text-sm">
                    <FiClock size={14} />
                    {formatDate(message.createdAt)}
                  </div>
                </div>
                <div className="text-sm text-text-secondary mb-1">
                  {message.email}
                </div>
                <div className="font-medium text-white mb-2">
                  {message.subject}
                </div>
                <div className="text-sm text-text-secondary line-clamp-2">
                  {message.message}
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs">
                  <div className="flex items-center gap-1">
                    {message.read ? (
                      <FiCheckCircle className="text-green-500" />
                    ) : (
                      <FiCircle className="text-gray-500" />
                    )}
                    <span className="text-text-secondary">
                      {message.read ? 'Прочетено' : 'Непрочетено'}
                    </span>
                  </div>
                  {message.replied && (
                    <div className="flex items-center gap-1 text-teal-500">
                      <FiCheckCircle />
                      <span>Отговорено</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="bg-background-secondary rounded-lg p-6 sticky top-4">
          {selectedMessage ? (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {selectedMessage.subject}
                </h2>
                <div className="flex items-center gap-4 text-text-secondary text-sm">
                  <div className="flex items-center gap-2">
                    <FiUser />
                    {selectedMessage.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMail />
                    {selectedMessage.email}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-text-secondary text-sm mt-2">
                  <FiClock />
                  {formatDate(selectedMessage.createdAt)}
                </div>
              </div>

              <div className="bg-background p-4 rounded-lg mb-6">
                <p className="text-white whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="flex gap-3">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="btn-primary flex-1 text-center"
                >
                  Отговори по имейл
                </a>
                <button className="btn-secondary">Маркирай като прочетено</button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <FiMail className="mx-auto text-5xl text-gray-600 mb-4" />
              <p className="text-text-secondary">
                Изберете съобщение за преглед
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
