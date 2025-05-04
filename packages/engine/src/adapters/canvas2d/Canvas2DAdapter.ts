import type { IEngineAdapter, EngineEvent, EngineEventCallback } from '../IEngineAdapter';
import type { PlaybackState } from '../../types/PlaybackState';
import type { AnimationElement, TimelineData, Keyframe } from '@cineform-forge/shared-types';
import gsap from 'gsap';
import { renderCanvasElement } from './CanvasElementRenderer';

export class Canvas2DAdapter implements IEngineAdapter {
  private target: HTMLElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private elements: AnimationElement[] = [];
  private elementState: Map<string, Record<string, any>> = new Map();
  private tickerCallback: () => void;
  private playbackState: PlaybackState = {
    currentTime: 0,
    progress: 0,
    isPlaying: false,
    rate: 1,
    duration: 0,
  };
  private timelineProxy: gsap.core.Timeline | null = null;
  private listeners: Map<EngineEvent, Set<EngineEventCallback>> = new Map();

  constructor() {
    this.tickerCallback = this.tick.bind(this);
  }

  init(targetElement: HTMLElement | null): void {
    this.target = targetElement;
    if (!this.target) return;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.target.clientWidth || 640;
    this.canvas.height = this.target.clientHeight || 400;
    this.target.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    gsap.ticker.add(this.tickerCallback);
  }

  renderStaticElement(elementData: AnimationElement, _target: HTMLElement | null): void {
    if (!this.elementState.has(elementData.id)) {
      this.elementState.set(elementData.id, { ...elementData.initialProps });
    }
  }

  async loadTimeline(timelineData: TimelineData, elements: AnimationElement[]): Promise<void> {
    this.elements = elements;
    this.elementState.clear();
    elements.forEach(el => this.renderStaticElement(el, this.target));
    this.timelineProxy?.kill();
    this.timelineProxy = gsap.timeline({
      paused: true,
      duration: timelineData.duration,
      onUpdate: () => {
        this.playbackState = this.calculatePlaybackState();
        this.emit('update');
      },
      onComplete: () => {
        this.playbackState.isPlaying = false;
        this.emit('complete');
      },
      onStart: () => {
        this.playbackState.isPlaying = true;
        this.emit('start');
      },
    });
    this.playbackState.duration = timelineData.duration;
    this.preProcessTimeline(timelineData);
    this.seek(0);
  }

  private preProcessTimeline(timelineData: TimelineData): void {
    timelineData.sequences.forEach(seq => {
      const stateObj = this.elementState.get(seq.elementId);
      if (stateObj) {
        seq.keyframes.forEach(kf => {
          const props = { ...kf.properties };
          if (kf.easing) props.ease = kf.easing;
          this.timelineProxy?.to(stateObj, props, 0, kf.time);
        });
      }
    });
  }

  private tick(): void {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.elements.forEach(element => {
      const currentState = this.elementState.get(element.id) ?? element.initialProps;
      renderCanvasElement(this.ctx!, element, currentState);
    });
  }

  play(): void {
    this.timelineProxy?.play();
    this.playbackState.isPlaying = true;
  }
  pause(): void {
    this.timelineProxy?.pause();
    this.playbackState.isPlaying = false;
  }
  seek(time: number): void {
    const wasPlaying = this.playbackState.isPlaying;
    this.timelineProxy?.pause().seek(time);
    gsap.ticker.tick();
    if (wasPlaying) this.timelineProxy?.play();
    else this.timelineProxy?.pause();
    this.playbackState = this.calculatePlaybackState();
  }
  setRate(rate: number): void {
    this.timelineProxy?.timeScale(rate);
    this.playbackState.rate = rate;
  }
  private calculatePlaybackState(): PlaybackState {
    const time = this.timelineProxy?.time() ?? 0;
    const duration = this.playbackState.duration;
    return {
      currentTime: time,
      progress: duration > 0 ? time / duration : 0,
      isPlaying: this.timelineProxy?.isActive() ?? false,
      rate: this.timelineProxy?.timeScale() ?? 1,
      duration: duration,
    };
  }
  getPlaybackState(): PlaybackState {
    return this.playbackState;
  }
  on(eventName: EngineEvent, callback: EngineEventCallback): void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName)?.add(callback);
  }
  off(eventName: EngineEvent, callback: EngineEventCallback): void {
    this.listeners.get(eventName)?.delete(callback);
  }
  private emit(eventName: EngineEvent, ...args: any[]): void {
    this.listeners.get(eventName)?.forEach(cb => cb(...args));
  }
  setPerspective(_value: string | number | null, _target: HTMLElement | null): void {}
  destroy(): void {
    gsap.ticker.remove(this.tickerCallback);
    this.timelineProxy?.kill();
    this.timelineProxy = null;
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    this.canvas = null;
    this.ctx = null;
    this.elements = [];
    this.elementState.clear();
    this.listeners.clear();
    this.target = null;
  }
}