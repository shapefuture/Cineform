import React from 'react';
import type { TimelineData } from '@cineform-forge/shared-types';
import { useProjectStore } from '../../state/projectStore';
import styles from './TimelineEditor.module.css';

interface TimelineEditorProps {
  timelineData: TimelineData | null;
}

export const TimelineEditor: React.FC<TimelineEditorProps> = ({ timelineData }) => {
  const playbackState = useProjectStore(s => s.playbackState);

  if (!timelineData) {
    return <div className={styles.timelineEditor}>No timeline data.</div>;
  }

  const playheadPercent = playbackState && timelineData.duration
    ? Math.min(100, Math.max(0, (playbackState.currentTime / timelineData.duration) * 100))
    : 0;

  return (
    <div className={styles.timelineEditor}>
      <h3 style={{ margin: '2px 0 8px', fontSize: '1em', color: '#b4cafd', fontWeight: 600 }}>
        Timeline <span style={{ fontWeight: 400, color: '#8ea6ce', fontSize: '0.96em' }}>
        (Duration: {timelineData.duration}s)
        </span>
      </h3>
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: `${playheadPercent}%`,
          height: 'calc(100% - 40px)',
          width: '1.5px',
          background: '#ffebad',
          zIndex: 9,
          pointerEvents: 'none',
          mixBlendMode: 'screen'
        }}
      />
      {timelineData.sequences.map((seq, index) => (
        <div key={index} className={styles.sequence}>
          <span>Element: {seq.elementId}</span>
          <div className={styles.keyframes}>
            <div className={styles.timelineTrack} />
            {seq.keyframes.map((kf, kfIndex) => (
              <div
                key={kfIndex}
                className={styles.keyframe}
                style={{
                  left: `${(kf.time / timelineData.duration) * 100}%`,
                }}
                title={`t=${kf.time}s`}
              >
                {kfIndex + 1}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};