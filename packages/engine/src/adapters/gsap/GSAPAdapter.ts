import type { IEngineAdapter, EngineEvent, EngineEventCallback } from '../IEngineAdapter';
import type { PlaybackState } from '../../types/PlaybackState';
import type { AnimationElement, TimelineData, Keyframe } from '@cineform-forge/shared-types';
// import gsap from 'gsap';

export class GSAPAdapter implements IEngineAdapter {
  private timeline: any = null;
  private target: HTMLElement | null = null;
  private elementMap: Map<string, HTMLElement> = new Map();

  private log(message: string, data?: any) {
    // eslint-disable-next-line no-console
    console.log(`[GSAPAdapter] ${message}`, data ?? '');
  }
  private error(message: string, error?: any) {
    // eslint-disable-next-line no-console
    console.error(`[GSAPAdapter] ${message}:`, error);
  }

  init(targetElement: HTMLElement | null): void {
    this.log('init', { targetElement: !!targetElement });
    this.target = targetElement;
    // (Call gsap.defaults etc. in full GSAP install)
    // For now, placeholder.
  }

  private getDOMElement(elementId: string, createIfMissing: boolean = true): HTMLElement | null {
    this.log('getDOMElement', { elementId, createIfMissing });
    if (this.elementMap.has(elementId)) {
      return this.elementMap.get(elementId)!;
    }
    if (!this.target || !createIfMissing) {
      this.log('getDOMElement: not found, createIfMissing false or no target');
      return null;
    }
    try {
      const element = document.createElement('div');
      element.id = `cfe-${elementId}`;
      element.dataset.elementId = elementId;
      element.style.position = 'absolute';
      element.style.boxSizing = 'border-box';
      element.textContent = `Element ${elementId}`;
      this.target.appendChild(element);
      this.elementMap.set(elementId, element);
      this.log('getDOMElement: created', { id: elementId });
      return element;
    } catch (err) {
      this.error('getDOMElement error', err);
      return null;
    }
  }

  renderStaticElement(elementData: AnimationElement, target: HTMLElement | null): void {
    this.log('renderStaticElement', { elementData, hasTarget: !!target });
    try {
      if (!target) return;
      this.target = target;
      const domElement = this.getDOMElement(elementData.id, true);
      if (domElement && elementData.initialProps) {
        // Placeholder for property application
        domElement.textContent = elementData.name;
      }
    } catch (err) {
      this.error('renderStaticElement error', err);
    }
  }

  async loadTimeline(timelineData: TimelineData, elements: AnimationElement[]): Promise<void> {
    this.log('loadTimeline', { timelineData, elementsCount: elements.length });
    try {
      // Placeholder: clear elements & pretend to setup timeline.
      this.elementMap.clear();
      if (this.target) { this.target.innerHTML = ''; }
      elements.forEach(el => this.renderStaticElement(el, this.target));
      // In real impl: Create GSAP timeline and keyframes.
    } catch (err) {
      this.error('loadTimeline error', err);
    }
  }

  play(): void {
    this.log('play');
    // Placeholder
  }
  pause(): void {
    this.log('pause');
    // Placeholder
  }
  seek(time: number): void {
    this.log('seek', { time });
    // Placeholder
  }
  setRate(rate: number): void {
    this.log('setRate', { rate });
    // Placeholder
  }
  getPlaybackState(): PlaybackState {
    this.log('getPlaybackState');
    // Placeholder
    return {
      currentTime: 0,
      progress: 0,
      isPlaying: false,
      rate: 1,
      duration: 0,
    };
  }

  private listeners: Map<EngineEvent, Set<EngineEventCallback>> = new Map();
  on(eventName: EngineEvent, callback: EngineEventCallback): void {
    this.log('on', { eventName });
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName)?.add(callback);
  }
  off(eventName: EngineEvent, callback: EngineEventCallback): void {
    this.log('off', { eventName });
    this.listeners.get(eventName)?.delete(callback);
  }
  private emit(eventName: EngineEvent, ...args: any[]): void {
    this.log('emit', { eventName, args });
    this.listeners.get(eventName)?.forEach(cb => {
      try {
        cb(...args);
      } catch (err) {
        this.error('emit listener error', err);
      }
    });
  }

  setPerspective(value: string | number | null, target: HTMLElement | null): void {
    this.log('setPerspective', { value, target: !!target });
    // Placeholder: no-op.
  }

  destroy(): void {
    this.log('destroy');
    try {
      // Just clear element map and references.
      this.elementMap.clear();
      this.listeners.clear();
      if (this.target) this.target.innerHTML = '';
      this.target = null;
      this.log('destroy complete');
    } catch (err) {
      this.error('destroy error', err);
    }
  }
}