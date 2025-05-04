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

  private log(message: string, data?: unknown) {
    // eslint-disable-next-line no-console
    console.log(`[Canvas2DAdapter] ${message}`, data ?? '');
  }
  private error(message: string, error?: unknown) {
    // eslint-disable-next-line no-console
    console.error(`[Canvas2DAdapter] ${message}:`, error);
  }

  constructor() {
    this.tickerCallback = this.tick.bind(this);
    this.log('constructor');
  }

  init(targetElement: HTMLElement | null): void {
    this.log('init', { targetElement: !!targetElement });
    try {
      this.target = targetElement;
      if (!this.target) return;
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.target.clientWidth || 640;
      this.canvas.height = this.target.clientHeight || 400;
      this.target.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
      gsap.ticker.add(this.tickerCallback);
      this.log('init complete');
    } catch (err) {
      this.error('init error', err);
    }
  }

  renderStaticElement(elementData: AnimationElement, _target: HTMLElement | null): void {
    this.log('renderStaticElement', { elementId: elementData.id });
    try {
      if (!this.elementState.has(elementData.id)) {
        this.elementState.set(elementData.id, { ...elementData.initialProps });
      }
    } catch (err) {
      this.error('renderStaticElement error', err);
    }
  }

  async loadTimeline(timelineData: TimelineData, elements: AnimationElement[]): Promise<void> {
    this.log('loadTimeline', { timelineData, elementsLength: elements.length });
    try {
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
      this.log('loadTimeline complete');
    } catch (err) {
      this.error('loadTimeline error', err);
    }
  }

  private preProcessTimeline(timelineData: TimelineData): void {
    this.log('preProcessTimeline', { timelineData });
    try {
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
      this.log('preProcessTimeline complete');
    } catch (err) {
      this.error('preProcessTimeline error', err);
    }
  }

  private tick(): void {
    // Not logging every tick, but log start/stop and errors.
    try {
      if (!this.ctx || !this.canvas) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.elements.forEach(element => {
        const currentState = this.elementState.get(element.id) ?? element.initialProps;
        renderCanvasElement(this.ctx!, element, currentState);
      });
    } catch (err) {
      this.error('tick error', err);
    }
  }

  play(): void {
    this.log('play');
    try {
      this.timelineProxy?.play();
      this.playbackState.isPlaying = true;
    } catch (err) {
      this.error('play error', err);
    }
  }
  pause(): void {
    this.log('pause');
    try {
      this.timelineProxy?.pause();
      this.playbackState.isPlaying = false;
    } catch (err) {
      this.error('pause error', err);
    }
  }
  seek(time: number): void {
    this.log('seek', { time });
    try {
      const wasPlaying = this.playbackState.isPlaying;
      this.timelineProxy?.pause().seek(time);
      gsap.ticker.tick();
      if (wasPlaying) this.timelineProxy?.play();
      else this.timelineProxy?.pause();
      this.playbackState = this.calculatePlaybackState();
    } catch (err) {
      this.error('seek error', err);
    }
  }
  setRate(rate: number): void {
    this.log('setRate', { rate });
    try {
      this.timelineProxy?.timeScale(rate);
      this.playbackState.rate = rate;
    } catch (err) {
      this.error('setRate error', err);
    }
  }
  private calculatePlaybackState(): PlaybackState {
    this.log('calculatePlaybackState');
    try {
      const time = this.timelineProxy?.time() ?? 0;
      const duration = this.playbackState.duration;
      return {
        currentTime: time,
        progress: duration > 0 ? time / duration : 0,
        isPlaying: this.timelineProxy?.isActive() ?? false,
        rate: this.timelineProxy?.timeScale() ?? 1,
        duration: duration,
      };
    } catch (err) {
      this.error('calculatePlaybackState error', err);
      return this.playbackState;
    }
  }
  getPlaybackState(): PlaybackState {
    this.log('getPlaybackState');
    return this.playbackState;
  }
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
  setPerspective(_value: string | number | null, _target: HTMLElement | null): void {
    this.log('setPerspective');
  }
  destroy(): void {
    this.log('destroy');
    try {
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
      this.log('destroy complete');
    } catch (err) {
      this.error('destroy error', err);
    }
  }
}