/**
 * Defines options for triggering animations on scroll.
 */
export interface ScrollTrigger {
  /**
   * CSS selector or element reference to use as scroll trigger start.
   */
  trigger: string;

  /**
   * Start position (percent / px / keyword).
   * @example "top 80%", "center center"
   */
  start: string;

  /**
   * End position (percent / px / keyword).
   * @example "bottom top", "+=300px"
   */
  end: string;

  /**
   * If true, scrubs the animation in sync with scroll rather than playing linearly.
   */
  scrub?: boolean | number;

  /**
   * Pin the element during the scroll animation.
   */
  pin?: boolean;

  /**
   * Further scroll-specific advanced options.
   */
  [extra: string]: any;
}