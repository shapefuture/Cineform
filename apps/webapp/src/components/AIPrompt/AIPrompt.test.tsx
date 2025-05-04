import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AIPrompt } from './AIPrompt';

describe('AIPrompt', () => {
  it('renders and submits prompt', () => {
    const mockSubmit = jest.fn();
    render(<AIPrompt onSubmitPrompt={mockSubmit} isLoading={false} />);
    const input = screen.getByPlaceholderText(/describe the animation/i);
    fireEvent.change(input, { target: { value: 'fade the box in' } });
    fireEvent.submit(input.closest('form')!);
    expect(mockSubmit).toHaveBeenCalledWith('fade the box in');
  });
});