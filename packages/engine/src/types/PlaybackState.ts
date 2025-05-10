export interface PlaybackState {
  currentTime: number; // Current time in seconds
  progress: number;    // Overall progress (0 to 1)
  isPlaying: boolean;
  rate: number;        // Current playback rate
  duration: number;    // Total duration in seconds
}