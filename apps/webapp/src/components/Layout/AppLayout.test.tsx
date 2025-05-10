import React from 'react';
import { render, screen } from '@testing-library/react';
import { AppLayout } from './AppLayout';

describe('AppLayout', () => {
  const spyLog = jest.spyOn(console, 'log').mockImplementation(() => {});
  const spyWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all slots and logs presence', () => {
    render(
      <AppLayout
        header={<div>HEADER</div>}
        leftPanel={<div>LEFT</div>}
        mainPanel={<div>MAIN</div>}
        rightPanel={<div>RIGHT</div>}
        bottomPanel={<div>BOTTOM</div>}
      />
    );
    expect(screen.getByText('HEADER')).toBeInTheDocument();
    expect(screen.getByText('LEFT')).toBeInTheDocument();
    expect(screen.getByText('MAIN')).toBeInTheDocument();
    expect(screen.getByText('RIGHT')).toBeInTheDocument();
    expect(screen.getByText('BOTTOM')).toBeInTheDocument();
    expect(spyLog).toHaveBeenCalledWith(
      expect.stringContaining('Rendering'),
      expect.objectContaining({
        header: true,
        leftPanel: true,
        mainPanel: true,
        rightPanel: true,
        bottomPanel: true
      })
    );
    expect(spyWarn).not.toHaveBeenCalled();
  });

  it('warns if header or mainPanel not present', () => {
    render(<AppLayout />);
    expect(spyWarn).toHaveBeenCalledWith('[AppLayout] No header');
    expect(spyWarn).toHaveBeenCalledWith('[AppLayout] No mainPanel');
  });
});