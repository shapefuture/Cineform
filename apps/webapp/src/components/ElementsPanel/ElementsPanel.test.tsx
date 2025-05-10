import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { ElementsPanel } from './ElementsPanel';
import * as projectStore from '../../state/projectStore';

describe('ElementsPanel', () => {
  const spyLog = jest.spyOn(console, 'log').mockImplementation(() => {});
  const spyError = jest.spyOn(console, 'error').mockImplementation(() => {});
  const spyWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const spyAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
  const spyPrompt = jest.spyOn(window, 'prompt').mockImplementation(() => 'TestElement');
  const spyConfirm = jest.spyOn(window, 'confirm').mockImplementation(() => true);

  beforeEach(() => {
    jest.clearAllMocks();
    // Fake store state
    jest.spyOn(projectStore, 'useProjectStore').mockImplementation((selector: any) =>
      selector({
        projectData: {
          elements: [{ id: 'el1', type: 'shape', name: 'Box', initialProps: {} }],
          timeline: { duration: 1, sequences: [{ elementId: 'el1', keyframes: [] }], version: 1 }
        },
        selectedElementId: 'el1',
        setSelectedElementId: jest.fn(),
        setProjectData: jest.fn()
      })
    );
  });

  it('renders elements and buttons', () => {
    render(<ElementsPanel />);
    expect(screen.getByText(/Box/)).toBeInTheDocument();
    expect(screen.getByTitle('Add Element')).toBeInTheDocument();
    expect(screen.getByTitle('Paste Element')).toBeInTheDocument();
  });

  it('handles add element (logs, prompt)', () => {
    render(<ElementsPanel />);
    fireEvent.click(screen.getByTitle('Add Element'));
    expect(spyPrompt).toHaveBeenCalled();
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('Added element'), expect.anything());
  });

  it('handles delete element (logs, confirm)', () => {
    render(<ElementsPanel />);
    fireEvent.click(screen.getAllByTitle('Delete Element')[0]);
    expect(spyConfirm).toHaveBeenCalled();
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('Deleted element'), 'el1');
  });

  it('handles copy element (logs, alert)', () => {
    render(<ElementsPanel />);
    fireEvent.click(screen.getAllByTitle('Copy Element')[0]);
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('Copied element'), 'el1');
    expect(spyAlert).toHaveBeenCalled();
  });

  it('handles paste element (logs)', () => {
    localStorage.setItem('cineformElementClipboard', JSON.stringify({
      element: { id: 'el1', type: 'shape', name: 'Box', initialProps: {} },
      sequence: { elementId: 'el1', keyframes: [] }
    }));
    render(<ElementsPanel />);
    fireEvent.click(screen.getByTitle('Paste Element'));
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('Pasted element'), expect.anything());
  });

  it('handles keyboard navigation (down/up/enter/space)', () => {
    render(<ElementsPanel />);
    const list = screen.getByRole('listbox');
    fireEvent.keyDown(list, { key: 'ArrowDown' });
    fireEvent.keyDown(list, { key: 'ArrowUp' });
    fireEvent.keyDown(list, { key: 'Enter' });
    fireEvent.keyDown(list, { key: ' ' });
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('handleKeyDown'), expect.anything());
  });

  it('catches errors in handlers', () => {
    // Force error
    jest.spyOn(projectStore, 'useProjectStore').mockImplementationOnce(() => { throw new Error('fail'); });
    expect(() => render(<ElementsPanel />)).not.toThrow();
  });
});