'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 });
  const [scrollY, setScrollY] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouse, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('resize', handleResize);
    };
  }, [mounted]);

  // Aurora wave animation
  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = windowSize.width;
    canvas.height = windowSize.height;

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.003;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create flowing aurora waves
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * 0.4);

        for (let x = 0; x <= canvas.width; x += 5) {
          const y = canvas.height * 0.4 +
            Math.sin(x * 0.003 + time + i) * 80 +
            Math.sin(x * 0.006 + time * 1.5 + i * 2) * 40 +
            i * 60;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        if (i === 0) {
          gradient.addColorStop(0, 'rgba(139, 92, 246, 0.08)');
          gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.06)');
          gradient.addColorStop(1, 'rgba(6, 182, 212, 0.08)');
        } else if (i === 1) {
          gradient.addColorStop(0, 'rgba(6, 182, 212, 0.05)');
          gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.04)');
          gradient.addColorStop(1, 'rgba(236, 72, 153, 0.05)');
        } else {
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.03)');
          gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.03)');
          gradient.addColorStop(1, 'rgba(139, 92, 246, 0.03)');
        }
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [mounted, windowSize]);

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => setActiveTestimonial(p => (p + 1) % 3), 5000);
    return () => clearInterval(interval);
  }, []);

  // Hexagon float animation state
  const [hexFloat, setHexFloat] = useState(0);
  useEffect(() => {
    if (!mounted) return;
    let animationId: number;
    const animateHex = () => {
      setHexFloat(Math.sin(Date.now() * 0.001) * 10);
      animationId = requestAnimationFrame(animateHex);
    };
    animateHex();
    return () => cancelAnimationFrame(animationId);
  }, [mounted]);

  return (
    <div className="min-h-screen bg-[#050508] overflow-hidden">
      {/* Aurora Canvas Background */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Floating Orbs that follow mouse slightly */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-40 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
            left: `calc(20% + ${mousePos.x * 0.02}px)`,
            top: `calc(20% + ${mousePos.y * 0.02}px)`,
            transition: 'all 0.5s ease-out',
          }}
        />
        <div 
          className="absolute w-[500px] h-[500px] rounded-full opacity-30 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
            right: `calc(15% - ${mousePos.x * 0.015}px)`,
            bottom: `calc(20% - ${mousePos.y * 0.015}px)`,
            transition: 'all 0.6s ease-out',
          }}
        />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-4 items-center min-h-screen py-24">
            {/* Left Content */}
            <div className="lg:col-span-6 lg:pr-8">
              {/* Floating Tag */}
              <div className="inline-flex items-center gap-3 mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-violet-500/50 blur-lg rounded-full" />
                  <div className="relative px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border border-white/10 backdrop-blur-sm">
                    <span className="text-xs font-body text-white/80 tracking-wider uppercase">Нова колекция 2026</span>
                  </div>
                </div>
              </div>

              {/* Headline with staggered reveal effect */}
              <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold leading-[0.95] mb-8">
                <span className="block text-white/90">Защита с</span>
                <span className="block relative mt-2">
                  <span 
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 50%, #10B981 100%)',
                      backgroundSize: '200% 200%',
                      animation: 'gradientShift 8s ease infinite',
                    }}
                  >
                    характер
                  </span>
                </span>
              </h1>

              {/* Subtitle */}
              <p className="font-body text-lg md:text-xl text-white/40 max-w-md mb-10 leading-relaxed">
                Премиум калъфи, създадени за тези, които не правят компромиси. Уникален дизайн среща военна защита.
              </p>

              {/* CTA Group */}
              <div className="flex flex-wrap items-center gap-4 mb-16">
                <Link
                  href="/shop"
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                  <div className="relative flex items-center gap-3 px-8 py-4 bg-white rounded-full font-heading font-semibold text-[#050508] transition-transform duration-300 group-hover:scale-[1.02]">
                    <span>Разгледай колекцията</span>
                    <div className="w-6 h-6 rounded-full bg-[#050508] flex items-center justify-center">
                      <svg className="w-3 h-3 text-white transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/about"
                  className="group flex items-center gap-3 px-6 py-4 font-body text-white/50 hover:text-white/80 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 group-hover:bg-white/5 transition-all">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <span>Научи повече</span>
                </Link>
              </div>
            </div>

            {/* Right Visual - Crystal/Prism Phone Showcase */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-[3/4]">
                {/* Prism Effect Background */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `
                      linear-gradient(135deg, rgba(139,92,246,0.1) 0%, transparent 50%),
                      linear-gradient(225deg, rgba(6,182,212,0.1) 0%, transparent 50%),
                      linear-gradient(315deg, rgba(16,185,129,0.08) 0%, transparent 50%)
                    `,
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    transform: `rotate(${scrollY * 0.02}deg)`,
                    transition: 'transform 0.1s ease-out',
                  }}
                />

                {/* Hexagonal Frame */}
                <div className="absolute inset-8">
                  <svg className="w-full h-full" viewBox="0 0 200 230" fill="none" style={{ transform: mounted ? `translateY(${hexFloat}px)` : 'translateY(0px)', transition: 'transform 0.1s ease-out' }}>
                    <defs>
                      <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(139,92,246,0.3)" />
                        <stop offset="50%" stopColor="rgba(6,182,212,0.2)" />
                        <stop offset="100%" stopColor="rgba(16,185,129,0.3)" />
                      </linearGradient>
                    </defs>
                    <polygon 
                      points="100,10 180,55 180,145 100,190 20,145 20,55" 
                      fill="url(#hexGrad)"
                      stroke="url(#hexGrad)"
                      strokeWidth="1"
                    />
                  </svg>
                </div>

                {/* Central Phone Mockup */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="relative w-48 h-96 rounded-[2.5rem] bg-gradient-to-b from-white/10 to-white/5 border border-white/10 backdrop-blur-sm overflow-hidden"
                    style={{ 
                      transform: `perspective(1000px) rotateY(${(mousePos.x - windowSize.width / 2) * 0.01}deg) rotateX(${(mousePos.y - windowSize.height / 2) * -0.01}deg)`,
                      transition: 'transform 0.3s ease-out',
                    }}
                  >
                    {/* Phone Screen */}
                    <div className="absolute inset-2 rounded-[2rem] bg-[#050508] overflow-hidden">
                      {/* Dynamic Content */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                        <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                          <span className="font-heading text-2xl text-white font-bold">A</span>
                        </div>
                        <span className="font-heading text-white text-lg font-semibold">JUST CASES</span>
                        <span className="font-body text-white/40 text-xs mt-1">Premium Protection</span>
                      </div>
                      {/* Screen Glare */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
                    </div>
                    
                    {/* Notch */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-[#050508] rounded-full" />
                  </div>
                </div>

                {/* Floating Feature Pills */}
                {[
                  { label: '3м защита', icon: '🛡️', pos: 'top-12 -left-4', delay: '0s' },
                  { label: 'Премиум', icon: '✨', pos: 'top-24 -right-8', delay: '0.5s' },
                  { label: '1-3 дни', icon: '📦', pos: 'bottom-32 -left-8', delay: '1s' },
                  { label: '30 дни', icon: '↩️', pos: 'bottom-16 -right-4', delay: '1.5s' },
                ].map((pill, i) => (
                  <div
                    key={i}
                    className={`absolute ${pill.pos} px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2`}
                    style={{ 
                      animation: `float 4s ease-in-out infinite`,
                      animationDelay: pill.delay,
                    }}
                  >
                    <span className="text-sm">{pill.icon}</span>
                    <span className="font-body text-xs text-white/70">{pill.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          <span className="font-body text-[10px] text-white/20 tracking-[0.3em] uppercase">Scroll</span>
        </div>
      </section>

      {/* Brands - Minimal Line */}
      <section className="py-16 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
            {['Apple', 'Samsung', 'Xiaomi', 'Google', 'Huawei', 'OnePlus'].map((brand, i) => (
              <span 
                key={brand} 
                className="font-heading text-xl md:text-2xl font-medium text-white/[0.08] hover:text-white/20 transition-colors cursor-default"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Bento Style */}
      <section className="py-24 md:py-32 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Intro */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block font-body text-xs tracking-[0.3em] uppercase text-violet-400/80 mb-4">Предимства</span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-white leading-tight">
              Всеки детайл е{' '}
              <span className="text-white/30">обмислен</span>
            </h2>
          </div>

          {/* Bento Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {/* Main Feature - Large Hero */}
            <div className="md:col-span-2 lg:col-span-2 lg:row-span-2 relative group overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 border border-white/5 p-8 md:p-10 flex flex-col justify-between">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/10 mb-6">
                  <span className="text-3xl">🛡️</span>
                </div>
                <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3">Военна степен защита</h3>
                <p className="font-body text-white/40 text-lg max-w-md leading-relaxed">
                  Тествано при падане от 3 метра. Калъфите са сертифицирани по MIL-STD-810G стандарт за максимална издръжливост.
                </p>
              </div>
              {/* Visual Element */}
              <div className="relative z-10 mt-8 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-body text-sm text-white/60">MIL-STD-810G</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="font-body text-sm text-white/60">3м Drop Test</span>
                </div>
              </div>
            </div>

            {/* Feature 2 - Premium Materials */}
            <div className="lg:col-span-2 relative group overflow-hidden rounded-3xl bg-white/[0.02] border border-white/5 p-6 md:p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 mb-5">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-2">Премиум материали</h3>
                <p className="font-body text-white/40 text-sm leading-relaxed">
                  Естествена кожа, карбон, soft-touch силикон. Материали, които се усещат луксозно.
                </p>
              </div>
            </div>

            {/* Feature 3 - Express Delivery */}
            <div className="relative group overflow-hidden rounded-3xl bg-white/[0.02] border border-white/5 p-6 md:p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 mb-5">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-2">Експресна доставка</h3>
                <p className="font-body text-white/40 text-sm leading-relaxed">
                  1-3 работни дни за цяла България. Безплатна доставка над 25€.
                </p>
              </div>
            </div>

            {/* Feature 4 - 30 Days Return */}
            <div className="relative group overflow-hidden rounded-3xl bg-white/[0.02] border border-white/5 p-6 md:p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 mb-5">
                  <span className="text-2xl">↩️</span>
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-2">30 дни връщане</h3>
                <p className="font-body text-white/40 text-sm leading-relaxed">
                  Не си доволен? Върни в рамките на 30 дни за пълно възстановяване.
                </p>
              </div>
            </div>

            {/* Feature 5 - Quality Guarantee - Wide Bottom */}
            <div className="md:col-span-2 lg:col-span-4 relative group overflow-hidden rounded-3xl bg-white/[0.02] border border-white/5 p-6 md:p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 shrink-0">
                  <span className="text-2xl">💎</span>
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-white mb-2">Гаранция за качество</h3>
                  <p className="font-body text-white/40 text-sm leading-relaxed">
                    Всеки продукт преминава през стриктен контрол на качеството. Ако забележите дефект - заменяме безплатно.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Card Carousel */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-violet-500/10 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block font-body text-xs tracking-[0.3em] uppercase text-cyan-400/80 mb-4">Отзиви</span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-white leading-tight">
              Клиентите{' '}
              <span className="text-white/30">говорят</span>
            </h2>
          </div>

          {/* Testimonial Cards */}
          <div className="relative max-w-4xl mx-auto">
            <div className="flex gap-6 overflow-hidden">
              {[
                { 
                  name: 'Мария Иванова', 
                  role: 'iPhone 15 Pro', 
                  text: 'Калъфът е невероятен! Изглежда много по-скъп отколкото е. Доставката беше супер бърза и опаковката - перфектна.',
                  avatar: 'М'
                },
                { 
                  name: 'Георги Петров', 
                  role: 'Samsung S24 Ultra', 
                  text: 'Вече поръчах за цялото семейство. Качеството е безкомпромисно, а дизайнът - точно това, което търсех.',
                  avatar: 'Г'
                },
                { 
                  name: 'Елена Костова', 
                  role: 'Xiaomi 14 Pro', 
                  text: 'Третата ми поръчка от Just Cases. Винаги съм доволна от качеството и обслужването. Горещо препоръчвам!',
                  avatar: 'Е'
                },
              ].map((testimonial, i) => (
                <div
                  key={i}
                  className={`shrink-0 w-full md:w-[calc(50%-12px)] transition-all duration-500 ${
                    i === activeTestimonial ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
                  }`}
                  style={{
                    transform: `translateX(calc(-${activeTestimonial * 100}% - ${activeTestimonial * 24}px))`,
                  }}
                >
                  <div className="p-6 md:p-8 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-sm h-full">
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <svg key={j} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    {/* Quote */}
                    <p className="font-body text-white/60 text-lg leading-relaxed mb-6">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>
                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                        <span className="font-heading text-white font-bold text-sm">{testimonial.avatar}</span>
                      </div>
                      <div>
                        <span className="font-heading text-white font-medium block text-sm">{testimonial.name}</span>
                        <span className="font-body text-white/40 text-xs">{testimonial.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === activeTestimonial ? 'bg-white w-6' : 'bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16 pt-16 border-t border-white/5">
            {[
              { value: '30K+', label: 'Доволни клиенти' },
              { value: '4.9', label: 'Среден рейтинг' },
              { value: '2K+', label: 'Продукти' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-heading text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="font-body text-sm text-white/30">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        {/* Animated Background Lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-20">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent"
                style={{
                  top: `${20 + i * 15}%`,
                  left: '-100%',
                  right: '-100%',
                  animation: `slideRight ${3 + i * 0.5}s linear infinite`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block font-body text-xs tracking-[0.3em] uppercase text-emerald-400/80 mb-4">Готови?</span>
            <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Открийте вашия
              <br />
              <span 
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 50%, #10B981 100%)',
                }}
              >
                перфектен калъф
              </span>
            </h2>
            <p className="font-body text-white/40 text-lg mb-10 max-w-lg mx-auto">
              Над 2000 модела за всички популярни устройства. Намерете своя днес.
            </p>
            <Link
              href="/shop"
              className="group relative inline-flex overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-cyan-600 to-emerald-600 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
              <div className="relative flex items-center gap-3 px-10 py-5 bg-white rounded-full font-heading font-semibold text-lg text-[#050508] transition-transform duration-300 group-hover:scale-[1.02]">
                <span>Към магазина</span>
                <div className="w-8 h-8 rounded-full bg-[#050508] flex items-center justify-center">
                  <svg className="w-4 h-4 text-white transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes slideRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

