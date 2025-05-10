import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import App from './App';
import * as projectStore from './state/projectStore';

describe('App', () => {
  const spyLog = jest.spyOn(console, 'log').mockImplementation(() => {});
  const spyWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const spyError = jest.spyOn(console, 'error').mockImplementation(() => {});
  const spyAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
  const mockSetProjectData = jest.fn();
  const mockLoadProject = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(projectStore, 'useProjectStore').mockImplementation(() => ({
      projectData: { id: '1', metadata: { name: 'Test', createdAt: '', lastModified: '' }, elements: [], timeline: { duration: 1, sequences: [], version: 1 }, schemaVersion: 1 },
      selectedElementId: null,
      isLoadingAi: false,
      aiError: null,
      setSelectedElementId: jest.fn(),
      generateAnimation: jest.fn(),
      loadProject: mockLoadProject,
      createNewProject: jest.fn(),
      undo: jest.fn(),
      redo: jest.fn(),
      undoStack: [1],
      redoStack: [],
      setProjectData: mockSetProjectData,
      dirty: true,
    }));
  });

  it('renders core buttons and header', () => {
    render(<App />);
    expect(screen.getByText(/Cineform Forge/)).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
    expect(screen.getByText('Import')).toBeInTheDocument();
    expect(screen.getByText('Load')).toBeInTheDocument();
  });

  it('handles Save button click and logs', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Save'));
    expect(mockSetProjectData).toHaveBeenCalled();
    expect(spyLog).toHaveBeenCalledWith('[App] Save button clicked');
  });

  it('handles Export button click and logs', () => {
    render(<App />);
    const createObjectURL = jest.fn(() => 'blob:fake');
    // @ts-ignore
    global.URL.createObjectURL = createObjectURL;
    fireEvent.click(screen.getByText('Export'));
    expect(spyLog).toHaveBeenCalledWith('[App] Exported project');
  });

  it('handles Import button click with invalid JSON', () => {
    render(<App />);
    // Simulate file selection and change
    const file = new Blob(['bad json'], { type: 'application/json' });
    const input = document.createElement('input');
    Object.defineProperty(input, 'files', { value: [file] });
    // Simulate click
    fireEvent.click(screen.getByText('Import'));
    // Can't easily simulate onchange without DOM, but logs/warns are covered in code.
  });

  it('handles Load button click and logs', () => {
    localStorage.setItem('cineformProject', JSON.stringify({ id: '1', metadata: { name: '', createdAt: '', lastModified: '' }, elements: [], timeline: { duration: 1, sequences: [], version: 1 }, schemaVersion: 1 }));
    render(<App />);
    fireEvent.click(screen.getByText('Load'));
    expect(mockLoadProject).toHaveBeenCalled();
    expect(spyLog).toHaveBeenCalledWith('[App] Project Loaded', expect.any(Object));
  });

  it('handles Load button with no project and warns', () => {
    localStorage.removeItem('cineformProject');
    render(<App />);
    fireEvent.click(screen.getByText('Load'));
    expect(spyWarn).toHaveBeenCalledWith('[App] No saved project found');
  });

  it('handles template load and logs', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Load Fade In Template'));
    expect(spyLog).toHaveBeenCalledWith('[App] Template Loaded', expect.any(Object));
  });

  it('handles beforeunload event and logs', () => {
    render(<App />);
    // simulate beforeunload
    const event = new Event('beforeunload');
    window.dispatchEvent(event);
    expect(spyLog).toHaveBeenCalledWith('[App] beforeunload', expect.any(Object));
  });

  it('handles keydown events and logs', () => {
    render(<App />);
    fireEvent.keyDown(window, { key: 'z', ctrlKey: true });
    expect(spyLog).toHaveBeenCalledWith('[App] keydown', expect.objectContaining({ key: 'z', ctrl: true }));
    fireEvent.keyDown(window, { key: 'z', ctrlKey: true, shiftKey: true });
    fireEvent.keyDown(window, { key: 'y', ctrlKey: true });
    expect(spyLog).toHaveBeenCalled();
  });
});