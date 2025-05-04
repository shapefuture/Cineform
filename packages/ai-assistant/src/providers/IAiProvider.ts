import type { AnimationElement, TimelineData } from '@cineform-forge/shared-types';

/**
 * Parameters for AI-based animation generation.
 */
export interface GenerateAnimationParams {
  prompt: string;
}

/**
 * AI animation generation response shape.
 */
export interface GenerateAnimationResponse {
  success: boolean;
  elements?: AnimationElement[];
  timeline?: TimelineData;
  error?: string;
  rawResponse?: string;
}

/**
 * The core AI provider interface used by any downstream providers (OpenRouter, Gemini, LocalModel, etc).
 */
export interface IAiProvider {
  /**
   * Initialize the provider client with API key and any provider-specific options.
   */
  initialize(apiKey: string, options?: Record<string, any>): void;
  /**
   * Generate animation timeline and element structures from a text prompt.
   */
  generateAnimationStructure(
    params: GenerateAnimationParams
  ): Promise<GenerateAnimationResponse>;

  // Add future suggestion, analysis, and model info methods here.
}