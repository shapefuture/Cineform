import { throttle } from './throttle';

describe('throttle', () => {
  const spyLog = jest.spyOn(console, 'log').mockImplementation(() => {});
  const spyError = jest.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('calls function immediately and then throttles subsequent calls', () => {
    const fn = jest.fn();
    const throttled = throttle(fn, 100);

    throttled('a');
    expect(fn).toHaveBeenCalledWith('a');
    expect(spyLog).toHaveBeenCalledWith('[throttle] called', expect.any(Object));
    expect(spyLog).toHaveBeenCalledWith('[throttle] executing fn immediately', expect.any(Object));

    throttled('b');
    expect(fn).toHaveBeenCalledTimes(1);
    expect(spyLog).toHaveBeenCalledWith('[throttle] throttled');

    // Fast forward time to flush the delayed call
    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledWith('b');
    expect(fn).toHaveBeenCalledTimes(2);
    expect(spyLog).toHaveBeenCalledWith('[throttle] executing delayed fn', expect.any(Object));
  });

  it('handles error in wrapped function', () => {
    const badFn = jest.fn(() => { throw new Error('fail!'); });
    const throttled = throttle(badFn, 100);
    throttled('z');
    expect(spyLog).toHaveBeenCalledWith('[throttle] executing fn immediately', expect.any(Object));
    expect(spyError).toHaveBeenCalledWith('[throttle] Error in wrapper', expect.any(Error));
  });

  it('handles error in delayed function', () => {
    const badFn = jest.fn(() => { throw new Error('fail-delayed'); });
    const throttled = throttle(badFn, 100);
    throttled('x');
    throttled('y');
    jest.advanceTimersByTime(100);
    expect(spyError).toHaveBeenCalledWith('[throttle] Error in delayed fn', expect.any(Error));
  });
});