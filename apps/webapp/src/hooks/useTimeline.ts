import { useProjectStore } from '../state/projectStore';
import { useMemo } from 'react';

/**
 * Returns core timeline data and current playback state from the global store.
 */
export function useTimeline() {
  const timelineData = useProjectStore(s => s.projectData?.timeline ?? null);
  const playbackState = useProjectStore(s => s.playbackState);

  // Memo: find nearest keyframe to playhead for highlight
  const nearestKeyframes = useMemo(() => {
    try {
      // eslint-disable-next-line no-console
      console.log('[useTimeline] Calculating nearestKeyframes', { timelineData, playbackState });
      if (!timelineData || !playbackState) return [];
      const result = timelineData.sequences
        .map(seq => {
          const foundIdx = seq.keyframes.reduce(
            (closestIdx, kf, idx) => (
              Math.abs(kf.time - playbackState.currentTime) <
              Math.abs(seq.keyframes[closestIdx]?.time - playbackState.currentTime)
                ? idx
                : closestIdx
            ),
            0
          );
          return {
            elementId: seq.elementId,
            keyframeIndex: foundIdx,
            keyframe: seq.keyframes[foundIdx],
          };
        });
      // eslint-disable-next-line no-console
      console.log('[useTimeline] nearestKeyframes result', result);
      return result;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[useTimeline] Error in nearestKeyframes', err);
      return [];
    }
  }, [timelineData, playbackState]);

  // eslint-disable-next-line no-console
  console.log('[useTimeline] return', { timelineData, playbackState, nearestKeyframes });
  return { timelineData, playbackState, nearestKeyframes };
}