import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { LanguageProvider } from '@/contexts/LanguageContext';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

function renderWithProvider() {
  return render(
    <LanguageProvider>
      <LanguageSwitcher />
    </LanguageProvider>,
  );
}

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it('renders BG and EN buttons', () => {
    renderWithProvider();

    expect(screen.getByText('BG')).toBeInTheDocument();
    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  it('defaults to BG language', () => {
    renderWithProvider();

    const bgButton = screen.getByText('BG');
    expect(bgButton).toHaveAttribute('aria-pressed', 'true');

    const enButton = screen.getByText('EN');
    expect(enButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('switches to EN when EN button is clicked', () => {
    renderWithProvider();

    fireEvent.click(screen.getByText('EN'));

    expect(screen.getByText('EN')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('BG')).toHaveAttribute('aria-pressed', 'false');
  });

  it('switches back to BG when BG button is clicked', () => {
    renderWithProvider();

    fireEvent.click(screen.getByText('EN'));
    fireEvent.click(screen.getByText('BG'));

    expect(screen.getByText('BG')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('EN')).toHaveAttribute('aria-pressed', 'false');
  });

  it('has accessible group role', () => {
    renderWithProvider();

    const group = screen.getByRole('group');
    expect(group).toBeInTheDocument();
  });
});
