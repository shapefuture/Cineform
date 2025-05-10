import { Canvas2DAdapter } from './Canvas2DAdapter';

describe('Canvas2DAdapter', () => {
  const origCreateElement = document.createElement;
  let adapter: Canvas2DAdapter;
  const spyLog = jest.spyOn(console, 'log').mockImplementation(() => {});
  const spyError = jest.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    adapter = new Canvas2DAdapter();
    (document.createElement as any) = (tag: string) => {
      if (tag === 'canvas') return ({
        width: 0,
        height: 0,
        getContext: jest.fn().mockReturnValue({
          clearRect: jest.fn(),
        }),
        parentNode: { removeChild: jest.fn() }
      });
      return origCreateElement.call(document, tag);
    };
    jest.clearAllMocks();
  });

  afterAll(() => {
    (document.createElement as any) = origCreateElement;
  });

  it('init creates canvas, sets context, logs', () => {
    const div = document.createElement('div');
    adapter.init(div);
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('init'), expect.anything());
  });

  it('renderStaticElement stores element state, logs', () => {
    adapter.renderStaticElement({ id: 'foo', type: 'shape', name: 'Foo', initialProps: {} }, null);
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('renderStaticElement'), expect.anything());
  });

  it('play/pause/seek/setRate/getPlaybackState log', () => {
    adapter.play();
    adapter.pause();
    adapter.seek(1);
    adapter.setRate(2);
    adapter.getPlaybackState();
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('play'), undefined);
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('seek'), { time: 1 });
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('setRate'), { rate: 2 });
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('getPlaybackState'), undefined);
  });

  it('handles on/off emit listeners', () => {
    const cb = jest.fn();
    adapter.on('update', cb);
    // @ts-ignore: testing private
    adapter.emit('update', 1);
    adapter.off('update', cb);
    // No assertion—just ensure paths/logs fire.
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('on'), { eventName: 'update' });
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('off'), { eventName: 'update' });
    expect(cb).toHaveBeenCalledWith(1);
  });

  it('destroy handles clean up and logs', () => {
    adapter.destroy();
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('destroy complete'), undefined);
  });

  it('should log and catch errors in play (simulate throw)', () => {
    (adapter as any).timelineProxy = { play: () => { throw new Error('playfail'); } };
    adapter.play();
    expect(spyError).toHaveBeenCalledWith(expect.stringContaining('play error'), expect.anything());
  });

  it('should handle errors in tick (simulate throw)', () => {
    // @ts-ignore: force error
    adapter.ctx = null;
    adapter.elements = [ { id: '1', type: 'shape', name: 'x', initialProps: {} } ];
    // Private, but for test
    (adapter as any).tick();
    // Should not throw
  });
});