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
    if (!timelineData || !playbackState) return [];
    return timelineData.sequences
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
  }, [timelineData, playbackState]);

  return { timelineData, playbackState, nearestKeyframes };
}