import { renderHook } from '@testing-library/react';
import { useTimeline } from './useTimeline';
import * as projectStore from '../state/projectStore';

describe('useTimeline', () => {
  const spyLog = jest.spyOn(console, 'log').mockImplementation(() => {});
  const spyError = jest.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns expected nearestKeyframes and logs', () => {
    jest.spyOn(projectStore, 'useProjectStore').mockImplementation((sel: any) =>
      sel({
        projectData: {
          timeline: {
            duration: 2,
            sequences: [
              { elementId: 'el1', keyframes: [{ time: 0 }, { time: 2 }] },
              { elementId: 'el2', keyframes: [{ time: 1 }] }
            ],
            version: 1
          }
        },
        playbackState: { currentTime: 1, progress: 0.5, isPlaying: false, rate: 1, duration: 2 }
      })
    );
    const { result } = renderHook(() => useTimeline());
    expect(result.current.timelineData).toBeTruthy();
    expect(result.current.playbackState?.currentTime).toBe(1);
    expect(result.current.nearestKeyframes).toHaveLength(2);
    expect(result.current.nearestKeyframes[0].elementId).toBe('el1');
    expect(result.current.nearestKeyframes[0].keyframe.time).toBe(0);
    expect(spyLog).toHaveBeenCalledWith('[useTimeline] Calculating nearestKeyframes', expect.any(Object));
    expect(spyLog).toHaveBeenCalledWith('[useTimeline] nearestKeyframes result', expect.any(Array));
    expect(spyLog).toHaveBeenCalledWith('[useTimeline] return', expect.any(Object));
  });

  it('handles missing timeline/playbackState and logs', () => {
    jest.spyOn(projectStore, 'useProjectStore').mockImplementation(() => null);
    const { result } = renderHook(() => useTimeline());
    expect(result.current.timelineData).toBe(null);
    expect(result.current.playbackState).toBe(undefined);
    expect(result.current.nearestKeyframes).toEqual([]);
    expect(spyLog).toHaveBeenCalled();
  });

  it('handles error in nearestKeyframes (logs error)', () => {
    jest.spyOn(projectStore, 'useProjectStore').mockImplementation((sel: any) =>
      sel({
        projectData: {
          timeline: {
            duration: 2,
            sequences: [
              { elementId: 'el1', keyframes: null }, // Intentionally error
            ],
            version: 1
          }
        },
        playbackState: { currentTime: 1, progress: 0.5, isPlaying: false, rate: 1, duration: 2 }
      })
    );
    const { result } = renderHook(() => useTimeline());
    expect(result.current.nearestKeyframes).toEqual([]);
    expect(spyError).toHaveBeenCalledWith('[useTimeline] Error in nearestKeyframes', expect.any(Error));
  });
});