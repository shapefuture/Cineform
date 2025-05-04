import type { IEngineAdapter, EngineEvent, EngineEventCallback } from './adapters/IEngineAdapter';
import type { PlaybackState } from './types/PlaybackState';
import type { AnimationElement, TimelineData } from '@cineform-forge/shared-types';
import { GSAPAdapter } from './adapters/gsap/GSAPAdapter';
import { Canvas2DAdapter } from './adapters/canvas2d/Canvas2DAdapter'; // Add Canvas2D support

export type RenderingTarget = 'dom' | 'canvas2d'; // Extendable for 'webgl', etc.

export class CineforgeEngine {
  private adapter: IEngineAdapter | null = null;
  private targetElement: HTMLElement | null = null;
  private currentElements: AnimationElement[] = [];
  private currentTimelineData: TimelineData | null = null;
  private renderingTarget: RenderingTarget = 'dom';

  private log(message: string, data?: any) {
    // eslint-disable-next-line no-console
    console.log(`[CineforgeEngine] ${message}`, data ?? '');
  }
  private error(message: string, error?: any) {
    // eslint-disable-next-line no-console
    console.error(`[CineforgeEngine] ${message}:`, error);
  }

  constructor(targetElement: HTMLElement | null, initialTarget: RenderingTarget = 'dom') {
    this.log('constructor', { initialTarget, targetElement: !!targetElement });
    this.targetElement = targetElement;
    this.renderingTarget = initialTarget;
    try {
      this.setRenderingTarget(this.renderingTarget);
    } catch (err) {
      this.error('Error in constructor setRenderingTarget', err);
    }
  }

  setRenderingTarget(target: RenderingTarget): void {
    this.log('setRenderingTarget', { target });
    try {
      if (this.adapter) {
        this.adapter.destroy();
        this.adapter = null;
      }
      if (!this.targetElement) {
        this.log('No targetElement. Adapter not set');
        return;
      }
      this.renderingTarget = target;
      if (target === 'canvas2d') {
        this.adapter = new Canvas2DAdapter();
      } else {
        this.adapter = new GSAPAdapter();
      }
      this.log('Adapter created', { type: target });
      this.adapter.init(this.targetElement);
      this.log('Adapter initialized', {});
      // Reload the current timeline if any
      if (this.currentTimelineData && this.currentElements.length) {
        void this.adapter.loadTimeline(this.currentTimelineData, this.currentElements);
        this.log('Timeline reloaded after adapter switch');
      }
    } catch (err) {
      this.error('setRenderingTarget error', err);
      throw err;
    }
  }

  async loadTimeline(timelineData: TimelineData, elements: AnimationElement[]): Promise<void> {
    this.log('loadTimeline', { timelineData, elementsCount: elements.length });
    if (!this.adapter) {
      this.error('loadTimeline: Engine adapter not initialized.');
      throw new Error('Engine adapter not initialized.');
    }
    this.currentElements = elements;
    this.currentTimelineData = timelineData;
    try {
      this.renderStaticElements();
      await this.adapter.loadTimeline(timelineData, elements);
      this.log('loadTimeline complete');
    } catch (err) {
      this.error('loadTimeline error', err);
      throw err;
    }
  }

  renderStaticElements(): void {
    this.log('renderStaticElements');
    if (!this.adapter || !this.targetElement) {
      this.log('renderStaticElements: Adapter or targetElement missing');
      return;
    }
    this.currentElements.forEach(element => {
      this.adapter!.renderStaticElement(element, this.targetElement as HTMLElement);
    });
    this.log('renderStaticElements complete');
  }

  play(): void {
    this.log('play');
    try { this.adapter?.play(); }
    catch (err) { this.error('play error', err); }
  }
  pause(): void {
    this.log('pause');
    try { this.adapter?.pause(); }
    catch (err) { this.error('pause error', err); }
  }
  seek(time: number): void {
    this.log('seek', { time });
    try { this.adapter?.seek(time); }
    catch (err) { this.error('seek error', err); }
  }
  setRate(rate: number): void {
    this.log('setRate', { rate });
    try { this.adapter?.setRate(rate); }
    catch (err) { this.error('setRate error', err); }
  }
  getPlaybackState(): PlaybackState | null {
    this.log('getPlaybackState');
    try { return this.adapter?.getPlaybackState() ?? null; }
    catch (err) { this.error('getPlaybackState error', err); return null; }
  }
  on(eventName: EngineEvent, callback: EngineEventCallback): void {
    this.log('on', { eventName });
    try { this.adapter?.on(eventName, callback); }
    catch (err) { this.error('on error', err); }
  }
  off(eventName: EngineEvent, callback: EngineEventCallback): void {
    this.log('off', { eventName });
    try { this.adapter?.off(eventName, callback); }
    catch (err) { this.error('off error', err); }
  }

  setPerspective(value: string | number | null): void {
    this.log('setPerspective', { value });
    try { this.adapter?.setPerspective(value, this.targetElement); }
    catch (err) { this.error('setPerspective error', err); }
  }

  destroy(): void {
    this.log('destroy');
    try {
      this.adapter?.destroy();
      this.adapter = null;
      this.targetElement = null;
      this.log('destroy complete');
    } catch (err) {
      this.error('destroy error', err);
    }
  }
}