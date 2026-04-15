'use client';

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function AdminPagination({ 
  currentPage, 
  totalPages, 
  total, 
  limit, 
  onPageChange 
}: AdminPaginationProps) {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, total);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const showEllipsis = totalPages > 7;
    
    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('ellipsis');
      }
      
      const rangeStart = Math.max(2, currentPage - 1);
      const rangeEnd = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = rangeStart; i <= rangeEnd; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-700/50">
      {/* Info Text */}
      <p className="text-text-secondary text-sm">
        Показване на <span className="text-white font-medium">{start}</span> до{' '}
        <span className="text-white font-medium">{end}</span> от{' '}
        <span className="text-white font-medium">{total}</span> резултата
      </p>
      
      {/* Pagination Controls */}
      <nav className="flex items-center gap-1" aria-label="Навигация">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-700 text-text-secondary hover:text-accent hover:border-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-text-secondary disabled:hover:border-gray-700"
          aria-label="Предишна страница"
        >
          <FiChevronLeft size={16} />
          <span className="hidden sm:inline text-sm">Предишна</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pages.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-text-secondary">
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;
            
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`min-w-[36px] h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-accent text-white'
                    : 'border border-gray-700 text-text-secondary hover:border-accent hover:text-accent'
                }`}
                aria-label={`Страница ${page}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-700 text-text-secondary hover:text-accent hover:border-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-text-secondary disabled:hover:border-gray-700"
          aria-label="Следваща страница"
        >
          <span className="hidden sm:inline text-sm">Следваща</span>
          <FiChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
}
