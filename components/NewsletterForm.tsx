'use client';

import { useState } from 'react';
import { FiMail, FiArrowRight, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { apiFetch } from '@/lib/client-api';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setStatus('error');
      setMessage('Моля, въведете имейл адрес');
      return;
    }
    
    setStatus('loading');
    
    try {
      const response = await apiFetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
        
        // Reset after 5 seconds
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 5000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Възникна грешка');
      }
    } catch {
      setStatus('error');
      setMessage('Възникна грешка. Моля, опитайте отново.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full md:w-auto gap-3">
      <div className="flex flex-col sm:flex-row w-full md:w-auto gap-2 sm:gap-3">
        <div className="relative flex-1 md:w-72">
          <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" aria-hidden="true" />
          <input 
            type="email" 
            placeholder="Вашият имейл" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            aria-label="Въведете имейл за абонамент за новини"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/30 transition-all duration-300 disabled:opacity-50 text-sm sm:text-base"
          />
        </div>
        <button 
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed py-3.5 px-6 min-h-[48px] text-sm sm:text-base" 
          aria-label="Абонирайте се за новини"
        >
          {status === 'loading' ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : status === 'success' ? (
            <FiCheck size={16} />
          ) : (
            <>
              Абониране <FiArrowRight size={16} aria-hidden="true" />
            </>
          )}
        </button>
      </div>
      
      {/* Status message */}
      {message && (
        <div className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg ${
          status === 'success' 
            ? 'text-green-400 bg-green-400/10 border border-green-400/20' 
            : 'text-red-400 bg-red-400/10 border border-red-400/20'
        }`}>
          {status === 'success' ? <FiCheck size={14} /> : <FiAlertCircle size={14} />}
          <span>{message}</span>
        </div>
      )}
    </form>
  );
}
