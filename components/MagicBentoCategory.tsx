'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

interface MagicBentoCategoryProps {
  categories: Category[];
}

const MagicBentoCategory = ({ categories }: MagicBentoCategoryProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Add safety check for categories
  const safeCategories = categories || [];

  useEffect(() => {
    if (!gridRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const cards = gridRef.current?.querySelectorAll('.bento-card');
      if (!cards) return;

      cards.forEach((card) => {
        const cardElement = card as HTMLElement;
        const rect = cardElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
        const intensity = Math.max(0, 1 - distance / maxDistance);

        cardElement.style.setProperty('--glow-intensity', intensity.toString());
        cardElement.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
        cardElement.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
      });
    };

    const handleMouseLeave = () => {
      const cards = gridRef.current?.querySelectorAll('.bento-card');
      if (!cards) return;

      cards.forEach((card) => {
        const cardElement = card as HTMLElement;
        cardElement.style.setProperty('--glow-intensity', '0');
      });
    };

    const grid = gridRef.current;
    grid.addEventListener('mousemove', handleMouseMove);
    grid.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      grid.removeEventListener('mousemove', handleMouseMove);
      grid.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="relative">
      {/* Global Spotlight Effect */}
      <div className="fixed pointer-events-none z-10 w-96 h-96 rounded-full opacity-0 transition-opacity duration-300 mix-blend-screen"
           style={{
             background: 'radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, rgba(20, 184, 166, 0.08) 30%, transparent 70%)',
             transform: 'translate(-50%, -50%)',
             left: '50%',
             top: '50%'
           }}
      />

      {/* Bento Grid */}
      <div 
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative max-w-6xl mx-auto"
        style={{
          '--glow-x': '50%',
          '--glow-y': '50%',
          '--glow-intensity': '0'
        } as React.CSSProperties}
      >
        {safeCategories.map((category, index) => {
          // All cards are the same size for uniform look
          const getGridSpan = () => {
            return 'md:col-span-1 lg:col-span-1'; // All cards span 1 column
          };

          const getHeight = () => {
            return 'h-72'; // All cards have the same height
          };

          return (
            <Link
              key={category.id}
              href={`/shop/${category.slug}`}
              className={`bento-card group relative ${getGridSpan()} ${getHeight()} bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-teal-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/10 cursor-pointer hover-tilt`}
              style={{
                '--glow-x': '50%',
                '--glow-y': '50%',
                '--glow-intensity': '0'
              } as React.CSSProperties}
            >
              {/* Background Image */}
              {category.image && (
                <div className="absolute inset-0">
                  <Image
                    src={category.image}
                    alt={`${category.name} - Категория мобилни аксесоари от Just Cases`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover opacity-15 group-hover:opacity-25 transition-opacity duration-300"
                    priority={false}
                    quality={75}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                </div>
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/70 to-slate-900/90 group-hover:from-teal-900/30 group-hover:via-slate-800/50 group-hover:to-teal-900/30 transition-all duration-300" />

              {/* Subtle Pattern Overlay */}
              <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
                   style={{
                     backgroundImage: `radial-gradient(circle at 1px 1px, rgba(20, 184, 166, 0.3) 1px, transparent 0)`,
                     backgroundSize: '20px 20px'
                   }}
              />

              {/* Glow Effect */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(300px circle at var(--glow-x) var(--glow-y), rgba(20, 184, 166, calc(var(--glow-intensity) * 0.3)) 0%, transparent 50%)`
                }}
              />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-between p-6">
                {/* Top Section */}
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center group-hover:bg-teal-500/30 transition-colors duration-300">
                    <span className="text-xl">
                      {category.name === 'Phone Cases' && '📱'}
                      {category.name === 'Screen Protectors' && '🛡️'}
                      {category.name === 'Wireless Earphones' && '🎧'}
                      {category.name === 'Chargers & Cables' && '🔌'}
                      {category.name === 'Power Banks' && '🔋'}
                      {category.name === 'Adapters' && '🔌'}
                    </span>
                  </div>
                  
                  {/* Hover Arrow */}
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-teal-400 transition-colors duration-300">
                    {category.name}
                  </h3>
                  
                  {category.description && (
                    <p className="text-slate-300 text-sm group-hover:text-slate-200 transition-colors duration-300 line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  {/* Category Badge */}
                  <div className="inline-block bg-teal-500/10 text-teal-400 px-3 py-1 rounded-full text-xs font-medium border border-teal-500/20 group-hover:bg-teal-500/20 transition-colors duration-300">
                    Explore
                  </div>
                </div>
              </div>

              {/* Border Glow */}
              <div 
                className="absolute inset-0 rounded-2xl border-2 border-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(45deg, transparent, rgba(20, 184, 166, 0.5), transparent) border-box`,
                  mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                  maskComposite: 'subtract'
                }}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MagicBentoCategory;
