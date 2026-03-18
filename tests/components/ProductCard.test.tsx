import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductCard from '@/components/ProductCard';

// Mock stores
vi.mock('@/store/cartStore', () => ({
  useCartStore: () => ({
    addItem: vi.fn(),
  }),
}));

vi.mock('@/store/wishlistStore', () => ({
  useWishlistStore: () => ({
    addItem: vi.fn(),
    removeItem: vi.fn(),
    isInWishlist: vi.fn().mockReturnValue(false),
  }),
}));

// Mock LanguageContext
vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'bg',
    formatPrice: (price: number) => `${price.toFixed(2)} €`,
    t: (key: string, fallback?: string) => fallback || key,
  }),
}));

// Mock Toast
vi.mock('@/components/Toast', () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}));

const baseProduct = {
  id: 'prod-1',
  name: 'Premium Phone Case',
  slug: 'premium-phone-case',
  price: 25.99,
  image: '/images/case.jpg',
  rating: 4.5,
  reviews: 42,
  category: { name: 'Cases', slug: 'cases' },
};

describe('ProductCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders product name', () => {
    render(<ProductCard {...baseProduct} />);
    expect(screen.getByText('Premium Phone Case')).toBeInTheDocument();
  });

  it('renders formatted price', () => {
    render(<ProductCard {...baseProduct} />);
    expect(screen.getByText('25.99 €')).toBeInTheDocument();
  });

  it('renders product image with alt text', () => {
    render(<ProductCard {...baseProduct} />);
    const img = screen.getByAltText(/Premium Phone Case/);
    expect(img).toBeInTheDocument();
  });

  it('renders category name when provided', () => {
    render(<ProductCard {...baseProduct} />);
    expect(screen.getByText('Cases')).toBeInTheDocument();
  });

  it('shows discount badge when discount is set', () => {
    const { container } = render(<ProductCard {...baseProduct} discount={20} oldPrice={32.49} />);
    // Discount badge displays old (strikethrough) price
    expect(screen.getByText('32.49 €')).toBeInTheDocument();
    // Badge div contains "-20%"
    const badge = container.querySelector('.from-red-500');
    expect(badge).not.toBeNull();
    expect(badge!.textContent!.replace(/\s/g, '')).toBe('-20%');
  });

  it('renders link to product page', () => {
    render(<ProductCard {...baseProduct} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/product/premium-phone-case');
  });

  it('renders star rating', () => {
    render(<ProductCard {...baseProduct} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('renders review count', () => {
    render(<ProductCard {...baseProduct} />);
    expect(screen.getByText('(42)')).toBeInTheDocument();
  });
});
