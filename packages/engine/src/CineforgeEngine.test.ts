import { CineforgeEngine } from './CineforgeEngine';
import type { PlaybackState } from './types/PlaybackState';

const mockAdapter = () => ({
  init: jest.fn(),
  destroy: jest.fn(),
  loadTimeline: jest.fn().mockResolvedValue(undefined),
  renderStaticElement: jest.fn(),
  play: jest.fn(),
  pause: jest.fn(),
  seek: jest.fn(),
  setRate: jest.fn(),
  getPlaybackState: jest.fn().mockReturnValue({ currentTime: 0, progress: 0, isPlaying: false, rate: 1, duration: 2 } as PlaybackState),
  on: jest.fn(),
  off: jest.fn(),
  setPerspective: jest.fn()
});

jest.mock('./adapters/gsap/GSAPAdapter', () => ({
  GSAPAdapter: jest.fn(() => mockAdapter()),
}));
jest.mock('./adapters/canvas2d/Canvas2DAdapter', () => ({
  Canvas2DAdapter: jest.fn(() => mockAdapter()),
}));

describe('CineforgeEngine', () => {
  const spyLog = jest.spyOn(console, 'log').mockImplementation(() => {});
  const spyError = jest.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('can instantiate and destroy', () => {
    const div = document.createElement('div');
    const engine = new CineforgeEngine(div);
    expect(engine).toBeInstanceOf(CineforgeEngine);
    engine.destroy();
    expect(engine).not.toBeNull();
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('constructor'), expect.anything());
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('destroy'), undefined);
  });

  it('calls setRenderingTarget with target, swaps adapters, logs correctly', () => {
    const div = document.createElement('div');
    const engine = new CineforgeEngine(div, 'dom');
    engine.setRenderingTarget('canvas2d');
    engine.setRenderingTarget('dom');
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('setRenderingTarget'), { target: 'canvas2d' });
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('setRenderingTarget'), { target: 'dom' });
  });

  it('calls play/pause/seek/setRate/getPlaybackState and logs', () => {
    const div = document.createElement('div');
    const engine = new CineforgeEngine(div, 'dom');
    engine.play();
    engine.pause();
    engine.seek(3);
    engine.setRate(2);
    engine.getPlaybackState();
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('play'), undefined);
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('pause'), undefined);
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('seek'), { time: 3 });
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('setRate'), { rate: 2 });
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('getPlaybackState'), undefined);
  });

  it('handles renderStaticElements and loadTimeline', async () => {
    const div = document.createElement('div');
    const engine = new CineforgeEngine(div, 'dom');
    const elements = [{ id: 'e', type: 'shape', name: 'foo', initialProps: {} }];
    const timeline = { duration: 1, sequences: [{ elementId: 'e', keyframes: [] }], version: 1 };
    await engine.loadTimeline(timeline, elements);
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('renderStaticElements'), undefined);
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('loadTimeline'), { timelineData: timeline, elementsCount: 1 });
  });

  it('can set perspective and logs', () => {
    const div = document.createElement('div');
    const engine = new CineforgeEngine(div, 'dom');
    engine.setPerspective('foo');
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('setPerspective'), { value: 'foo' });
  });

  it('calls on/off and logs', () => {
    const div = document.createElement('div');
    const engine = new CineforgeEngine(div, 'dom');
    const fn = jest.fn();
    engine.on('update' as any, fn);
    engine.off('update' as any, fn);
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('on'), { eventName: 'update' });
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('off'), { eventName: 'update' });
  });

  it('logs and throws error if loadTimeline called without adapter', async () => {
    // @ts-ignore
    const engine = Object.create(CineforgeEngine.prototype);
    engine.adapter = null;
    await expect(engine.loadTimeline({ duration: 1, sequences: [], version: 1 }, []))
      .rejects.toThrow('Engine adapter not initialized.');
    expect(spyError).toHaveBeenCalledWith(expect.stringContaining('loadTimeline: Engine adapter not initialized.'), undefined);
  });
});