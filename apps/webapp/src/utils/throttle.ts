// Simple throttle utility for browser use with logging and error handling
export function throttle<T extends (...args: any[]) => any>(fn: T, wait: number) {
  let last = 0;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let savedArgs: any[] | null = null;
  return function (...args: any[]) {
    try {
      // eslint-disable-next-line no-console
      console.log('[throttle] called', { args, wait });
      const now = Date.now();
      if (now - last < wait) {
        savedArgs = args;
        if (!timeout) {
          timeout = setTimeout(() => {
            try {
              // eslint-disable-next-line no-console
              console.log('[throttle] executing delayed fn', { savedArgs });
              fn(...(savedArgs || []));
              last = Date.now();
              timeout = null;
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error('[throttle] Error in delayed fn', err);
            }
          }, wait - (now - last));
        }
        // eslint-disable-next-line no-console
        console.log('[throttle] throttled');
        return;
      }
      last = now;
      // eslint-disable-next-line no-console
      console.log('[throttle] executing fn immediately', { args });
      fn(...args);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[throttle] Error in wrapper', err);
    }
  };
}