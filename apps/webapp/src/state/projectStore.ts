import { create } from 'zustand';
import { throttle } from '../utils/throttle';
import type { ProjectData, AnimationElement, TimelineData, AnimationSuggestion } from '@cineform-forge/shared-types';
import { AnimationAssistant } from '@cineform-forge/ai-assistant';
import type { GenerateAnimationResponse } from '@cineform-forge/ai-assistant';

// Get API key from Vite environment variables
const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY as string;

import type { PlaybackState } from '@cineform-forge/engine';

interface ProjectState {
  projectData: ProjectData | null;
  selectedElementId: string | null;
  isLoadingAi: boolean;
  aiError: string | null;
  assistant: AnimationAssistant;
  suggestions: AnimationSuggestion[];
  isLoadingSuggestions: boolean;
  suggestionsError: string | null;
  playbackState: PlaybackState | null;
  undoStack: ProjectData[];
  redoStack: ProjectData[];

  setProjectData: (data: ProjectData | null, pushToUndo?: boolean) => void;
  undo: () => void;
  redo: () => void;

  setSelectedElementId: (id: string | null) => void;
  setPlaybackState: (ps: PlaybackState) => void;
  generateAnimation: (prompt: string) => Promise<void>;
  loadProject: (data: ProjectData) => void;
  createNewProject: () => void;
  fetchSuggestions: () => Promise<void>;
  attachEngine: (engine: any) => void;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
}

const createNewEmptyProject = (): ProjectData => ({
  id: crypto.randomUUID(),
  metadata: {
    name: 'Untitled Project',
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
  },
  elements: [],
  timeline: { duration: 5, sequences: [], version: 1 },
  schemaVersion: 1,
});

const LOCAL_STORAGE_KEY = 'cineformProject';

// Lightweight throttle utility for local autosave
let saveTimeout: number | null = null;
const throttledSave = (data: ProjectData) => {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = window.setTimeout(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, 200);
};

function loadProjectFromStorage(): ProjectData | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const useProjectStore = create<ProjectState & { dirty: boolean }>((set, get) => ({
  projectData: loadProjectFromStorage(),
  selectedElementId: null,
  isLoadingAi: false,
  aiError: null,
  assistant: new AnimationAssistant('openrouter', apiKey || '', { model: 'openai/gpt-4o-mini' }),
  suggestions: [],
  isLoadingSuggestions: false,
  suggestionsError: null,
  playbackState: null,
  undoStack: [],
  redoStack: [],
  dirty: false,

  _engine: null,

  attachEngine: (engine: any) => {
    try {
      // eslint-disable-next-line no-console
      console.log('[projectStore] attachEngine', engine);
      set((state) => {
        (state as any)._engine = engine;
        return {};
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[projectStore] Error in attachEngine', err);
    }
  },

  play: () => {
    try {
      // eslint-disable-next-line no-console
      console.log('[projectStore] play');
      const s = get() as any;
      s._engine?.play && s._engine.play();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[projectStore] Error in play', err);
    }
  },
  pause: () => {
    try {
      // eslint-disable-next-line no-console
      console.log('[projectStore] pause');
      const s = get() as any;
      s._engine?.pause && s._engine.pause();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[projectStore] Error in pause', err);
    }
  },
  seek: (time: number) => {
    try {
      // eslint-disable-next-line no-console
      console.log('[projectStore] seek', time);
      const s = get() as any;
      s._engine?.seek && s._engine.seek(time);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[projectStore] Error in seek', err);
    }
  },

  setProjectData: (data, pushToUndo = true) => {
    try {
      // eslint-disable-next-line no-console
      console.log('[projectStore] setProjectData', { data, pushToUndo });
      const prev = get().projectData;
      const lastSaved = loadProjectFromStorage();
      const changed = JSON.stringify(data) !== JSON.stringify(lastSaved);

      if (pushToUndo && prev) {
        set(state => ({
          projectData: data,
          undoStack: [...state.undoStack, prev],
          redoStack: [],
          selectedElementId: null,
          aiError: null,
          dirty: changed,
        }));
      } else {
        set({ projectData: data, selectedElementId: null, aiError: null, dirty: changed });
      }
      // Throttled autosave after every projectData change
      throttledSave(data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[projectStore] Error in setProjectData', err);
    }
  },

  undo: () => {
    try {
      // eslint-disable-next-line no-console
      console.log('[projectStore] undo');
      const { undoStack, projectData, redoStack } = get();
      if (undoStack.length > 0 && projectData) {
        set({
          projectData: undoStack[undoStack.length - 1],
          undoStack: undoStack.slice(0, -1),
          redoStack: [...redoStack, projectData],
          dirty: true,
        });
        throttledSave(undoStack[undoStack.length - 1]);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[projectStore] Error in undo', err);
    }
  },

  redo: () => {
    try {
      // eslint-disable-next-line no-console
      console.log('[projectStore] redo');
      const { redoStack, projectData, undoStack } = get();
      if (redoStack.length > 0 && projectData) {
        set({
          projectData: redoStack[redoStack.length - 1],
          redoStack: redoStack.slice(0, -1),
          undoStack: [...undoStack, projectData],
          dirty: true,
        });
        throttledSave(redoStack[redoStack.length - 1]);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[projectStore] Error in redo', err);
    }
  },

  setSelectedElementId: (id) => {
    try {
      // eslint-disable-next-line no-console
      console.log('[projectStore] setSelectedElementId', id);
      set({ selectedElementId: id });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[projectStore] Error in setSelectedElementId', err);
    }
  },

  setPlaybackState: (ps) => {
    try {
      // eslint-disable-next-line no-console
      console.log('[projectStore] setPlaybackState', ps);
      set({ playbackState: ps });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[projectStore] Error in setPlaybackState', err);
    }
  },

  generateAnimation: async (prompt) => {
    set({ isLoadingAi: true, aiError: null });
    const assistant = get().assistant;
    try {
      // eslint-disable-next-line no-console
      console.log('[projectStore] generateAnimation', prompt);
      const response: GenerateAnimationResponse =
        await assistant.generateAnimationStructureFromText(prompt);
      if (response.success && response.elements && response.timeline) {
        const newProjectData: ProjectData = {
          ...(get().projectData || createNewEmptyProject()),
          id: get().projectData?.id || crypto.randomUUID(),
          elements: response.elements,
          timeline: response.timeline,
          metadata: {
            ...(get().projectData?.metadata ||
              createNewEmptyProject().metadata),
            name: `Generated: ${prompt.substring(0, 20)}...`,
            lastModified: new Date().toISOString(),
          },
        };
        set({
          projectData: newProjectData,
          isLoadingAi: false,
          selectedElementId: null,
        });
        // eslint-disable-next-line no-console
        console.log('[projectStore] generateAnimation success', newProjectData);
      } else {
        set({
          isLoadingAi: false,
          aiError: response.error ?? 'Unknown AI generation error.',
        });
        // eslint-disable-next-line no-console
        console.warn('[projectStore] generateAnimation error', response.error);
      }
    } catch (error: any) {
      set({
        isLoadingAi: false,
        aiError: `Failed to generate animation: ${error.message}`,
      });
      // eslint-disable-next-line no-console
      console.error('[projectStore] generateAnimation exception', error);
    }
  },

  loadProject: (data) => {
    try {
      // eslint-disable-next-line no-console
      console.log('[projectStore] loadProject', data);
      set({ projectData: data, selectedElementId: null, aiError: null });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[projectStore] Error in loadProject', err);
    }
  },

  createNewProject: () => {
    try {
      // eslint-disable-next-line no-console
      console.log('[projectStore] createNewProject');
      set({ projectData: createNewEmptyProject(), selectedElementId: null, aiError: null });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[projectStore] Error in createNewProject', err);
    }
  },

  fetchSuggestions: async () => {
    try {
      // eslint-disable-next-line no-console
      console.log('[projectStore] fetchSuggestions');
      const { assistant, projectData } = get();
      if (!assistant || !projectData) {
        set({ suggestionsError: 'No project loaded.', suggestions: [] });
        return;
      }
      set({ isLoadingSuggestions: true, suggestionsError: null });
      try {
        const response = await assistant.generateSuggestions({
          elements: projectData.elements,
          timeline: projectData.timeline,
        });
        if (response && response.success && response.suggestions) {
          set({ suggestions: response.suggestions, isLoadingSuggestions: false });
          // eslint-disable-next-line no-console
          console.log('[projectStore] fetchSuggestions success', response.suggestions);
        } else {
          set({
            suggestionsError: response?.error ?? 'AI did not return suggestions.',
            suggestions: [],
            isLoadingSuggestions: false,
          });
          // eslint-disable-next-line no-console
          console.warn('[projectStore] fetchSuggestions error', response?.error);
        }
      } catch (err: any) {
        set({
          suggestions: [],
          isLoadingSuggestions: false,
          suggestionsError: `Suggestion error: ${err.message}`,
        });
        // eslint-disable-next-line no-console
        console.error('[projectStore] fetchSuggestions exception', err);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[projectStore] Error in fetchSuggestions', err);
    }
  },
}));