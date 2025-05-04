// Simple throttle utility for browser use
export function throttle<T extends (...args: any[]) => any>(fn: T, wait: number) {
  let last = 0;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let savedArgs: any[] | null = null;
  return function (...args: any[]) {
    const now = Date.now();
    if (now - last < wait) {
      savedArgs = args;
      if (!timeout) {
        timeout = setTimeout(() => {
          fn(...(savedArgs || []));
          last = Date.now();
          timeout = null;
        }, wait - (now - last));
      }
      return;
    }
    last = now;
    fn(...args);
  };
}