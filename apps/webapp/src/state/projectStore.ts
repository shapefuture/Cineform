import { create } from 'zustand';
import type { ProjectData, AnimationElement, TimelineData, AnimationSuggestion } from '@cineform-forge/shared-types';
import { AnimationAssistant } from '@cineform-forge/ai-assistant';
import type { GenerateAnimationResponse } from '@cineform-forge/ai-assistant';

// Get API key from Vite environment variables
const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY as string;

interface ProjectState {
  projectData: ProjectData | null;
  selectedElementId: string | null;
  isLoadingAi: boolean;
  aiError: string | null;
  assistant: AnimationAssistant;
  suggestions: AnimationSuggestion[];
  isLoadingSuggestions: boolean;
  suggestionsError: string | null;

  setProjectData: (data: ProjectData | null) => void;
  setSelectedElementId: (id: string | null) => void;
  generateAnimation: (prompt: string) => Promise<void>;
  loadProject: (data: ProjectData) => void;
  createNewProject: () => void;
  fetchSuggestions: () => Promise<void>;
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

export const useProjectStore = create<ProjectState>((set, get) => ({
  projectData: null,
  selectedElementId: null,
  isLoadingAi: false,
  aiError: null,
  assistant: new AnimationAssistant('openrouter', apiKey || '', { model: 'openai/gpt-4o-mini' }),
  suggestions: [],
  isLoadingSuggestions: false,
  suggestionsError: null,

  setProjectData: (data) =>
    set({ projectData: data, selectedElementId: null, aiError: null }),

  setSelectedElementId: (id) => set({ selectedElementId: id }),

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