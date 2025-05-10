/**
 * Choices/settings controlling how the animation is rendered.
 */
export interface RenderingOptions {
  /**
   * Rendering target: DOM, Canvas, WebGL, etc.
   */
  target: 'dom' | 'canvas2d' | 'webgl';

  /**
   * Viewport or canvas background color.
   * @example "#191919"
   */
  backgroundColor?: string;

  /**
   * Whether to enable performance metrics/monitoring overlays.
   */
  showPerformanceMonitor?: boolean;
  
  /**
   * Hardware acceleration hints or other advanced options.
   */
  [extra: string]: any;
}