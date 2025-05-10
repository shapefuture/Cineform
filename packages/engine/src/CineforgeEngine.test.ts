import { CineforgeEngine } from './CineforgeEngine';

describe('CineforgeEngine', () => {
  const spyLog = jest.spyOn(console, 'log').mockImplementation(() => {});
  const spyError = jest.spyOn(console, 'error').mockImplementation(() => {});
  let div: HTMLDivElement;

  beforeEach(() => {
    div = document.createElement('div');
    jest.clearAllMocks();
  });

  it('can instantiate and destroy', () => {
    const engine = new CineforgeEngine(div, 'dom');
    expect(engine).toBeInstanceOf(CineforgeEngine);
    engine.destroy();
    expect(spyLog).toHaveBeenCalledWith(expect.stringMatching(/destroy/), expect.anything());
  });

  it('should switch adapters with setRenderingTarget and reload timeline', async () => {
    const engine = new CineforgeEngine(div, 'dom');
    // Fake data
    const timeline = { duration: 1, sequences: [], version: 1 };
    const elements = [{ id: '1', type: 'shape', name: 'test', initialProps: {} }];
    await engine.loadTimeline(timeline as any, elements as any);
    engine.setRenderingTarget('canvas2d');
    expect(spyLog).toHaveBeenCalledWith(expect.stringMatching(/setRenderingTarget/), expect.anything());
    expect(spyLog).toHaveBeenCalledWith(expect.stringMatching(/setRenderingTarget/), { target: 'canvas2d' });
    // Exercise canvas2d adapter paths (should not throw, logs fire)
    engine.play();
    engine.pause();
    engine.seek(0.5);
    engine.setRate(2.0);
    engine.getPlaybackState();
    engine.destroy();
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('play'), undefined);
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('destroy'), undefined);
  });

  it('should log and throw if calling loadTimeline without adapter', async () => {
    const engine = new CineforgeEngine(null, 'dom') as any;
    engine.adapter = null;
    await expect(engine.loadTimeline({} as any, []))
      .rejects.toThrow(/not initialized/);
    expect(spyError).toHaveBeenCalled();
  });

  it('should log and handle errors in play, pause, seek, setRate', () => {
    const engine = new CineforgeEngine(div, 'dom');
    // Purposely break adapter to throw
    (engine as any).adapter = { play: () => { throw new Error('failPlay'); }, pause: () => { throw new Error('failPause'); }, seek: () => { throw new Error('failSeek'); }, setRate: () => { throw new Error('failSetRate'); }, getPlaybackState: () => { throw new Error('failGet'); } };
    expect(() => engine.play()).not.toThrow();
    expect(() => engine.pause()).not.toThrow();
    expect(() => engine.seek(1)).not.toThrow();
    expect(() => engine.setRate(1)).not.toThrow();
    expect(() => engine.getPlaybackState()).not.toThrow();
    expect(spyError).toHaveBeenCalled();
  });

  it('should log on event hook/unhook', () => {
    const engine = new CineforgeEngine(div, 'dom');
    (engine as any).adapter = { on: jest.fn(), off: jest.fn() };
    engine.on('update' as any, () => {});
    engine.off('update' as any, () => {});
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('on'), expect.anything());
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('off'), expect.anything());
  });

  it('should handle destroy falling through on an error', () => {
    const engine = new CineforgeEngine(div, 'dom');
    (engine as any).adapter = { destroy: () => { throw new Error('failDestroy'); } };
    expect(() => engine.destroy()).not.toThrow();
    expect(spyError).toHaveBeenCalledWith(expect.stringContaining('destroy error'), expect.anything());
  });
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