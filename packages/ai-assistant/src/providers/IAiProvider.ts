import type { AnimationElement, TimelineData, AnimationSuggestion } from '@cineform-forge/shared-types';

export interface GenerateAnimationParams {
    prompt: string;
    // Add other context later if needed (e.g., existing elements, desired style)
}

export interface GenerateAnimationResponse {
    success: boolean;
    elements?: AnimationElement[];
    timeline?: TimelineData;
    error?: string; // Error message if success is false
    rawResponse?: string; // Optional: Include raw AI response for debugging
}

export interface GenerateSuggestionsParams {
    elements: AnimationElement[];
    timeline: TimelineData;
}

export interface GenerateSuggestionsResponse {
    success: boolean;
    suggestions?: AnimationSuggestion[];
    error?: string;
}

export interface GenerateSuggestionsParams {
    elements: AnimationElement[];
    timeline: TimelineData;
}

export interface GenerateSuggestionsResponse {
    success: boolean;
    suggestions?: AnimationSuggestion[];
    error?: string;
}

export interface IAiProvider {
    initialize(apiKey: string, options?: Record<string, any>): void;
    generateAnimationStructure(params: GenerateAnimationParams): Promise<GenerateAnimationResponse>;
    generateSuggestions?(params: GenerateSuggestionsParams): Promise<GenerateSuggestionsResponse>;
    // Add other methods later like analyzePerformance etc.
}