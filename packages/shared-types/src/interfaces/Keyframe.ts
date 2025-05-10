/**
 * A single point in time within a sequence, specifying how an element's properties change.
 */
export interface Keyframe {
  /**
   * Time in seconds when this keyframe is reached (relative to the start of the sequence).
   */
  time: number;

  /**
   * The properties of the element at this keyframe.
   */
  properties: Record<string, any>;

  /**
   * Optional easing curve for the transition TO this keyframe from the previous one.
   * Examples: "power2.out", "cubic-bezier(0.4,0,0.2,1)"
   */
  easing?: string;
}