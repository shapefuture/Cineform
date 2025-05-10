import type { Keyframe } from './Keyframe';

/**
 * A sequence of keyframes animating a single element over time.
 */
export interface AnimationSequence {
  /**
   * Which AnimationElement this sequence applies to.
   */
  elementId: string;
  /**
   * Ordered list of keyframes (by time ascending).
   */
  keyframes: Keyframe[];
}