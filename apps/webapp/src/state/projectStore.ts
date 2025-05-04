import { create } from 'zustand';
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
    set((state) => {
      (state as any)._engine = engine;
      return {};
    });
  },

  play: () => {
    const s = get() as any;
    s._engine?.play && s._engine.play();
  },
  pause: () => {
    const s = get() as any;
    s._engine?.pause && s._engine.pause();
  },
  seek: (time: number) => {
    const s = get() as any;
    s._engine?.seek && s._engine.seek(time);
  },

  setProjectData: (data, pushToUndo = true) => {
    const prev = get().projectData;
    const lastSaved = loadProjectFromStorage();
    const changed =
      JSON.stringify(data) !== JSON.stringify(lastSaved);

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
    // Always persist after every projectData change
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      // ignore quota or serialization errors for MVP
    }
  },

  undo: () => {
    const { undoStack, projectData, redoStack } = get();
    if (undoStack.length > 0 && projectData) {
      set({
        projectData: undoStack[undoStack.length - 1],
        undoStack: undoStack.slice(0, -1),
        redoStack: [...redoStack, projectData]
      });
    }
  },

  redo: () => {
    const { redoStack, projectData, undoStack } = get();
    if (redoStack.length > 0 && projectData) {
      set({
        projectData: redoStack[redoStack.length - 1],
        redoStack: redoStack.slice(0, -1),
        undoStack: [...undoStack, projectData]
      });
    }
  },

  setSelectedElementId: (id) => set({ selectedElementId: id }),

  setPlaybackState: (ps) => set({ playbackState: ps }),

  generateAnimation: async (prompt) => {
    set({ isLoadingAi: true, aiError: null });
    const assistant = get().assistant;
    try {
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
      } else {
        set({
          isLoadingAi: false,
          aiError: response.error ?? 'Unknown AI generation error.',
        });
      }
    } catch (error: any) {
      set({
        isLoadingAi: false,
        aiError: `Failed to generate animation: ${error.message}`,
      });
    }
  },

  loadProject: (data) => {
    set({ projectData: data, selectedElementId: null, aiError: null });
  },

  createNewProject: () => {
    set({ projectData: createNewEmptyProject(), selectedElementId: null, aiError: null });
  },

  fetchSuggestions: async () => {
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
      } else {
        set({
          suggestionsError: response?.error ?? 'AI did not return suggestions.',
          suggestions: [],
          isLoadingSuggestions: false,
        });
      }
    } catch (err: any) {
      set({
        suggestions: [],
        isLoadingSuggestions: false,
        suggestionsError: `Suggestion error: ${err.message}`,
      });
    }
  },
}));