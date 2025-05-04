import type { IEngineAdapter, EngineEvent, EngineEventCallback } from './adapters/IEngineAdapter';
import type { PlaybackState } from './types/PlaybackState';
import type { AnimationElement, TimelineData } from '@cineform-forge/shared-types';
import { GSAPAdapter } from './adapters/gsap/GSAPAdapter';

export class CineforgeEngine {
  private adapter: IEngineAdapter | null = null;
  private targetElement: HTMLElement | null = null;
  private currentElements: AnimationElement[] = [];
  private currentTimelineData: TimelineData | null = null;

  constructor(targetElement: HTMLElement | null) {
    this.targetElement = targetElement;
    this.adapter = new GSAPAdapter();
    this.adapter.init(this.targetElement);
  }

  async loadTimeline(timelineData: TimelineData, elements: AnimationElement[]): Promise<void> {
    if (!this.adapter) throw new Error('Engine adapter not initialized.');
    this.currentElements = elements;
    this.currentTimelineData = timelineData;
    this.renderStaticElements();
    await this.adapter.loadTimeline(timelineData, elements);
  }

  renderStaticElements(): void {
    if (!this.adapter || !this.targetElement) return;
    this.currentElements.forEach(element => {
      this.adapter!.renderStaticElement(element, this.targetElement);
    });
  }

  play(): void { this.adapter?.play(); }
  pause(): void { this.adapter?.pause(); }
  seek(time: number): void { this.adapter?.seek(time); }
  setRate(rate: number): void { this.adapter?.setRate(rate); }
  getPlaybackState(): PlaybackState | null { return this.adapter?.getPlaybackState() ?? null; }
  on(eventName: EngineEvent, callback: EngineEventCallback): void { this.adapter?.on(eventName, callback); }
  off(eventName: EngineEvent, callback: EngineEventCallback): void { this.adapter?.off(eventName, callback); }

  setPerspective(value: string | number | null): void {
    this.adapter?.setPerspective(value, this.targetElement);
  }

  destroy(): void {
    this.adapter?.destroy();
    this.adapter = null;
    this.targetElement = null;
  }
}