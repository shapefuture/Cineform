import type { AnimationElement, TimelineData, Keyframe } from '@cineform-forge/shared-types';
import type { PlaybackState } from '../types/PlaybackState';

export type EngineEventCallback = (...args: any[]) => void;
export type EngineEvent = 'start' | 'complete' | 'update';

export interface IEngineAdapter {
  /** Initializes the adapter, potentially linking to a DOM target. */
  init(targetElement: HTMLElement | null): void;
  /** Loads animation data and prepares the timeline. */
  loadTimeline(timelineData: TimelineData, elements: AnimationElement[]): Promise<void>;
  /** Plays the animation from the current time. */
  play(): void;
  /** Pauses the animation. */
  pause(): void;
  /** Seeks to a specific time in the animation (in seconds). */
  seek(time: number): void;
  /** Sets the playback rate (1 = normal, 0.5 = half speed, 2 = double speed). */
  setRate(rate: number): void;
  /** Gets the current playback state (time, progress, playing status). */
  getPlaybackState(): PlaybackState;
  /** Registers an event listener. */
  on(eventName: EngineEvent, callback: EngineEventCallback): void;
  /** Unregisters an event listener. */
  off(eventName: EngineEvent, callback: EngineEventCallback): void;
  /** Cleans up resources used by the adapter. */
  destroy(): void;
  /** Renders a single static element (initial state). */
  renderStaticElement(element: AnimationElement, target: HTMLElement | null): void;
  /** Handles 3D perspective for the container */
  setPerspective(perspective: string | number | null, target: HTMLElement | null): void;
}