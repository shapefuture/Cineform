/**
 * Represents a single visual or functional element within the animation scene.
 */
export interface AnimationElement {
  /**
   * A unique identifier for this element within the project (usually a UUID).
   * @example "f47ac10b-58cc-4372-a567-0e02b2c3d479"
   */
  id: string;

  /**
   * The type of the element, determining its rendering and properties.
   */
  type: 'shape' | 'text' | 'image' | 'group' | 'audio' | 'camera';

  /**
   * User-defined name for the element, displayed in the UI.
   * @example "Hero Title", "Background Music"
   */
  name: string;

  /**
   * Initial properties of the element when the animation starts or before any keyframes are applied at time 0.
   * Properties depend on the element type (e.g., x, y, opacity, fill, src, textContent).
   * @example { x: 100, y: 50, opacity: 0, fill: '#ff0000' }
   * @example { src: '/images/logo.png', width: 100, height: 50 }
   */
  initialProps: Record<string, any>;
}