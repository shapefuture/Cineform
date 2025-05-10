import { act } from '@testing-library/react';
import { useProjectStore } from './projectStore';

describe('projectStore', () => {
  const spyLog = jest.spyOn(console, 'log').mockImplementation(() => {});
  const spyWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const spyError = jest.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    useProjectStore.setState({
      projectData: null,
      selectedElementId: null,
      isLoadingAi: false,
      aiError: null,
      suggestions: [],
      isLoadingSuggestions: false,
      suggestionsError: null,
      playbackState: null,
      undoStack: [],
      redoStack: [],
      dirty: false,
      _engine: { play: jest.fn(), pause: jest.fn(), seek: jest.fn() },
      assistant: {
        generateAnimationStructureFromText: jest.fn(async () => ({ success: true, elements: [], timeline: { duration: 1, sequences: [], version: 1 } })),
        generateSuggestions: jest.fn(async () => ({ success: true, suggestions: [{ type: 'timing', suggestion: 'test', reasoning: 'r' }] }))
      }
    }, true);
    jest.clearAllMocks();
  });

  it('setProjectData logs and updates state', () => {
    act(() => {
      useProjectStore.getState().setProjectData({ id: '1', metadata: { name: 'Test', createdAt: '', lastModified: '' }, elements: [], timeline: { duration: 1, sequences: [], version: 1 }, schemaVersion: 1 }, true);
    });
    expect(useProjectStore.getState().projectData?.id).toBe('1');
    expect(spyLog).toHaveBeenCalledWith('[projectStore] setProjectData', expect.any(Object));
  });

  it('undo/redo logs, updates state', () => {
    act(() => {
      useProjectStore.getState().setProjectData({ id: '1', metadata: { name: 'Test', createdAt: '', lastModified: '' }, elements: [], timeline: { duration: 1, sequences: [], version: 1 }, schemaVersion: 1 }, true);
      useProjectStore.getState().setProjectData({ id: '2', metadata: { name: 'Test2', createdAt: '', lastModified: '' }, elements: [], timeline: { duration: 1, sequences: [], version: 1 }, schemaVersion: 1 }, true);
      useProjectStore.getState().undo();
    });
    expect(useProjectStore.getState().projectData?.id).toBe('1');
    expect(spyLog).toHaveBeenCalledWith('[projectStore] undo');
    act(() => {
      useProjectStore.getState().redo();
    });
    expect(useProjectStore.getState().projectData?.id).toBe('2');
    expect(spyLog).toHaveBeenCalledWith('[projectStore] redo');
  });

  it('play/pause/seek logs and handles errors', () => {
    act(() => {
      useProjectStore.getState().play();
      useProjectStore.getState().pause();
      useProjectStore.getState().seek(1.23);
    });
    expect(spyLog).toHaveBeenCalledWith('[projectStore] play');
    expect(spyLog).toHaveBeenCalledWith('[projectStore] pause');
    expect(spyLog).toHaveBeenCalledWith('[projectStore] seek', 1.23);
  });

  it('setSelectedElementId logs', () => {
    act(() => { useProjectStore.getState().setSelectedElementId('foo'); });
    expect(useProjectStore.getState().selectedElementId).toBe('foo');
    expect(spyLog).toHaveBeenCalledWith('[projectStore] setSelectedElementId', 'foo');
  });

  it('setPlaybackState logs', () => {
    act(() => { useProjectStore.getState().setPlaybackState({ currentTime: 0, progress: 0, isPlaying: false, rate: 1, duration: 1 }); });
    expect(spyLog).toHaveBeenCalledWith('[projectStore] setPlaybackState', expect.any(Object));
  });

  it('generateAnimation logs, updates state, handles error', async () => {
    await act(async () => {
      await useProjectStore.getState().generateAnimation('test prompt');
    });
    expect(spyLog).toHaveBeenCalledWith('[projectStore] generateAnimation', 'test prompt');
    expect(useProjectStore.getState().isLoadingAi).toBe(false);

    // Simulate error
    useProjectStore.setState({
      assistant: {
        generateAnimationStructureFromText: jest.fn(async () => { throw new Error('fail!'); })
      }
    }, true);
    await act(async () => {
      await useProjectStore.getState().generateAnimation('bad');
    });
    expect(spyError).toHaveBeenCalledWith('[projectStore] generateAnimation exception', expect.any(Error));
    expect(useProjectStore.getState().aiError).toMatch(/fail/);
  });

  it('fetchSuggestions logs, updates state, handles error', async () => {
    await act(async () => {
      await useProjectStore.getState().fetchSuggestions();
    });
    expect(spyLog).toHaveBeenCalledWith('[projectStore] fetchSuggestions');
    expect(useProjectStore.getState().suggestions.length).toBeGreaterThan(0);

    // Simulate error
    useProjectStore.setState({
      assistant: {
        generateSuggestions: jest.fn(async () => { throw new Error('fail!'); })
      }
    }, true);
    await act(async () => {
      await useProjectStore.getState().fetchSuggestions();
    });
    expect(spyError).toHaveBeenCalledWith('[projectStore] fetchSuggestions exception', expect.any(Error));
    expect(useProjectStore.getState().suggestionsError).toMatch(/fail/);
  });

  it('attachEngine logs and handles error', () => {
    act(() => {
      useProjectStore.getState().attachEngine({});
    });
    expect(spyLog).toHaveBeenCalledWith('[projectStore] attachEngine', {});
  });

  it('loadProject and createNewProject log', () => {
    act(() => {
      useProjectStore.getState().loadProject({ id: 'z', metadata: { name: '', createdAt: '', lastModified: '' }, elements: [], timeline: { duration: 1, sequences: [], version: 1 }, schemaVersion: 1 });
      useProjectStore.getState().createNewProject();
    });
    expect(spyLog).toHaveBeenCalledWith('[projectStore] loadProject', expect.any(Object));
    expect(spyLog).toHaveBeenCalledWith('[projectStore] createNewProject');
  });
});