/**
 * AI/logic suggestion for improving an animation (timing, principle, performance, etc).
 */
export type SuggestionType = 'easing' | 'timing' | 'principle' | 'performance';

/**
 * An actionable suggestion for modifications or improvements.
 */
export interface AnimationSuggestion {
  /**
   * Type of suggestion (easing/timing/principle/performance).
   */
  type: SuggestionType;
  /**
   * Target element ID for focused advice (optional).
   */
  targetElementId?: string;
  /**
   * Keyframe index for focused advice (optional).
   */
  targetKeyframeIndex?: number;
  /**
   * User-facing suggestion message.
   */
  suggestion: string;
  /**
   * Reasoning for the suggestion, mentioning the benefit/principle.
   */
  reasoning: string;
}