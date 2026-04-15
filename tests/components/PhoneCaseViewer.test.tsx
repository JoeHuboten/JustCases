import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock @react-three/fiber — Canvas can't run in jsdom (no WebGL)
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="r3f-canvas">{children}</div>
  ),
  useFrame: vi.fn(),
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
  Environment: () => null,
  ContactShadows: () => null,
  Float: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  RoundedBox: () => null,
}));

vi.mock('three', async () => {
  const actual = await vi.importActual<typeof import('three')>('three');
  return {
    ...actual,
    PCFSoftShadowMap: 2,
  };
});

import PhoneCaseViewer from '@/components/PhoneCaseViewer';

describe('PhoneCaseViewer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the canvas container', () => {
    render(<PhoneCaseViewer />);
    expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument();
  });

  it('renders 5 color swatches', () => {
    render(<PhoneCaseViewer />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(5);
  });

  it('highlights the default Cosmic Orange swatch', () => {
    render(<PhoneCaseViewer caseColor="#e05c00" />);
    const orange = screen.getByLabelText('Select Cosmic Orange color');
    expect(orange.className).toContain('ring-2');
  });

  it('does not highlight non-selected swatches', () => {
    render(<PhoneCaseViewer caseColor="#e05c00" />);
    const midnight = screen.getByLabelText('Select Midnight color');
    expect(midnight.className).not.toContain('ring-2');
  });

  it('calls onColorChange when a swatch is clicked', () => {
    const handler = vi.fn();
    render(<PhoneCaseViewer onColorChange={handler} />);
    fireEvent.click(screen.getByLabelText('Select Midnight color'));
    expect(handler).toHaveBeenCalledWith('#1c1c1e');
  });

  it('updates active swatch ring on click', () => {
    render(<PhoneCaseViewer />);
    const midnight = screen.getByLabelText('Select Midnight color');
    fireEvent.click(midnight);
    expect(midnight.className).toContain('ring-2');

    const orange = screen.getByLabelText('Select Cosmic Orange color');
    expect(orange.className).not.toContain('ring-2');
  });

  it('shows caseName label when provided', () => {
    render(<PhoneCaseViewer caseName="Test Case" />);
    expect(screen.getByText('Test Case')).toBeInTheDocument();
  });

  it('does not show label when caseName is omitted', () => {
    const { container } = render(<PhoneCaseViewer />);
    // The label wrapper should not be present
    expect(container.querySelector('.pointer-events-none')).toBeNull();
  });

  it('renders all color labels as accessible button names', () => {
    render(<PhoneCaseViewer />);
    const labels = ['Cosmic Orange', 'Midnight', 'Clear', 'Ocean', 'Violet'];
    for (const label of labels) {
      expect(screen.getByLabelText(`Select ${label} color`)).toBeInTheDocument();
    }
  });
});
