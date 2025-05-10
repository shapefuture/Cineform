import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { AISuggestionsPanel } from './AISuggestionsPanel';
import * as projectStore from '../../state/projectStore';

describe('AISuggestionsPanel', () => {
  const spyLog = jest.spyOn(console, 'log').mockImplementation(() => {});
  const spyError = jest.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(projectStore, 'useProjectStore').mockReturnValue({
      suggestions: [],
      isLoadingSuggestions: false,
      suggestionsError: '',
      fetchSuggestions: jest.fn(),
    });
  });

  it('renders and logs no suggestions', () => {
    render(<AISuggestionsPanel />);
    expect(screen.getByText(/No suggestions yet/)).toBeInTheDocument();
    expect(spyLog).toHaveBeenCalledWith('[AISuggestionsPanel] No suggestions.');
  });

  it('renders error and logs', () => {
    (projectStore.useProjectStore as jest.Mock).mockReturnValueOnce({
      suggestions: [],
      isLoadingSuggestions: false,
      suggestionsError: 'AI error occurred',
      fetchSuggestions: jest.fn(),
    });
    render(<AISuggestionsPanel />);
    expect(screen.getByText(/AI error occurred/)).toBeInTheDocument();
    expect(spyLog).toHaveBeenCalledWith('[AISuggestionsPanel] suggestionsError:', 'AI error occurred');
  });

  it('renders suggestions and logs', () => {
    (projectStore.useProjectStore as jest.Mock).mockReturnValueOnce({
      suggestions: [
        { type: 'timing', suggestion: 'Make it slower', reasoning: 'Smoother timing' }
      ],
      isLoadingSuggestions: false,
      suggestionsError: '',
      fetchSuggestions: jest.fn(),
    });
    render(<AISuggestionsPanel />);
    expect(screen.getByText(/\[timing\]/)).toBeInTheDocument();
    expect(screen.getByText(/Make it slower/)).toBeInTheDocument();
    expect(screen.getByText(/Smoother timing/)).toBeInTheDocument();
    expect(spyLog).toHaveBeenCalledWith('[AISuggestionsPanel] suggestion', expect.any(Object));
  });

  it('calls fetchSuggestions and logs on button click', () => {
    const fetchSuggestions = jest.fn();
    (projectStore.useProjectStore as jest.Mock).mockReturnValueOnce({
      suggestions: [],
      isLoadingSuggestions: false,
      suggestionsError: '',
      fetchSuggestions,
    });
    render(<AISuggestionsPanel />);
    fireEvent.click(screen.getByText(/Get Suggestions/));
    expect(fetchSuggestions).toHaveBeenCalled();
    expect(spyLog).toHaveBeenCalledWith('[AISuggestionsPanel] Fetch Suggestions button clicked');
  });

  it('handles fetchSuggestions error (logs)', () => {
    // simulate fetchSuggestions throws
    (projectStore.useProjectStore as jest.Mock).mockReturnValueOnce({
      suggestions: [],
      isLoadingSuggestions: false,
      suggestionsError: '',
      fetchSuggestions: () => { throw new Error('fail!'); },
    });
    render(<AISuggestionsPanel />);
    fireEvent.click(screen.getByText(/Get Suggestions/));
    expect(spyError).toHaveBeenCalledWith('[AISuggestionsPanel] Error in fetchSuggestions', expect.any(Error));
  });
});