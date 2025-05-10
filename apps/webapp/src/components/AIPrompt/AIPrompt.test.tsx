import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { AIPrompt } from './AIPrompt';

describe('AIPrompt', () => {
  const spyLog = jest.spyOn(console, 'log').mockImplementation(() => {});
  const spyError = jest.spyOn(console, 'error').mockImplementation(() => {});
  const spyAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input and button', () => {
    render(<AIPrompt isLoading={false} onSubmitPrompt={() => {}} />);
    expect(screen.getByPlaceholderText(/Describe the animation/)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('logs input change and calls onSubmitPrompt', () => {
    const mockSubmit = jest.fn();
    render(<AIPrompt isLoading={false} onSubmitPrompt={mockSubmit} />);
    const input = screen.getByPlaceholderText(/Describe the animation/);
    fireEvent.change(input, { target: { value: 'Spin a box' } });
    expect(spyLog).toHaveBeenCalledWith('[AIPrompt] input change', 'Spin a box');
    fireEvent.click(screen.getByRole('button'));
    expect(mockSubmit).toHaveBeenCalledWith('Spin a box');
    expect(spyLog).toHaveBeenCalledWith('[AIPrompt] handleSubmit', expect.any(Object));
    expect(spyLog).toHaveBeenCalledWith('[AIPrompt] onSubmitPrompt called', 'Spin a box');
  });

  it('disables button when loading or input empty', () => {
    const { rerender } = render(<AIPrompt isLoading={false} onSubmitPrompt={() => {}} />);
    expect(screen.getByRole('button')).toBeDisabled();
    fireEvent.change(screen.getByPlaceholderText(/Describe the animation/), {
      target: { value: 'x' },
    });
    expect(screen.getByRole('button')).not.toBeDisabled();
    rerender(<AIPrompt isLoading={true} onSubmitPrompt={() => {}} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('handles error in onSubmitPrompt (logs and alerts)', () => {
    const mockSubmit = jest.fn(() => { throw new Error('fail!'); });
    render(<AIPrompt isLoading={false} onSubmitPrompt={mockSubmit} />);
    fireEvent.change(screen.getByPlaceholderText(/Describe the animation/), {
      target: { value: 'Animate error' },
    });
    fireEvent.click(screen.getByRole('button'));
    expect(spyError).toHaveBeenCalledWith('[AIPrompt] Error in onSubmitPrompt', expect.any(Error));
    expect(spyAlert).toHaveBeenCalledWith(expect.stringContaining('Failed to submit prompt: fail!'));
  });

  it('handles error in handleSubmit (logs)', () => {
    // Simulate error in e.preventDefault
    render(<AIPrompt isLoading={false} onSubmitPrompt={() => {}} />);
    const input = screen.getByPlaceholderText(/Describe the animation/);
    fireEvent.change(input, { target: { value: 'Anything' } });
    // @ts-ignore
    const badEvt = { preventDefault: () => { throw new Error('fail prevent'); } };
    expect(() => (screen.getByRole('form')?.onsubmit?.(badEvt))).not.toThrow();
    expect(spyError).toHaveBeenCalledWith('[AIPrompt] Error in handleSubmit', expect.any(Error));
  });
});