'use client';

import Link from 'next/link';
import { FiChevronRight, FiHome } from 'react-icons/fi';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
}

export default function Breadcrumbs({ items, showHome = true }: BreadcrumbsProps) {
  const allItems = showHome 
    ? [{ label: 'Начало', href: '/' }, ...items]
    : items;

  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center flex-wrap gap-1 text-sm font-body" itemScope itemType="https://schema.org/BreadcrumbList">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          
          return (
            <li 
              key={index} 
              className="flex items-center gap-1"
              itemProp="itemListElement" 
              itemScope 
              itemType="https://schema.org/ListItem"
            >
              {index > 0 && (
                <FiChevronRight className="text-white/30 flex-shrink-0" size={14} />
              )}
              
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  itemProp="item"
                  className="flex items-center gap-1.5 text-white/40 hover:text-teal-400 transition-colors duration-200"
                >
                  {index === 0 && showHome && <FiHome size={14} />}
                  <span itemProp="name">{item.label}</span>
                </Link>
              ) : (
                <span 
                  itemProp="name" 
                  className="text-white font-medium truncate max-w-[200px] md:max-w-none"
                  title={item.label}
                >
                  {item.label}
                </span>
              )}
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
