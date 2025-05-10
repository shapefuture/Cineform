import type { AnimationSequence } from './AnimationSequence';

/**
 * The master timeline controlling all element sequences.
 */
export interface TimelineData {
  /**
   * Total duration in seconds.
   */
  duration: number;

  /**
   * List of sequences animating elements.
   */
  sequences: AnimationSequence[];

  /**
   * Timeline schema/data version.
   */
  version: number;

  /**
   * Future extensibility: optional label or marker data, scroll triggers, etc.
   */
  [extra: string]: any;
}