import React from 'react';
import type { TimelineData } from '@cineform-forge/shared-types';
import styles from './TimelineEditor.module.css';

interface TimelineEditorProps {
  timelineData: TimelineData | null;
}

export const TimelineEditor: React.FC<TimelineEditorProps> = ({ timelineData }) => {
  if (!timelineData) {
    return <div className={styles.timelineEditor}>No timeline data.</div>;
  }
  return (
    <div className={styles.timelineEditor}>
      <h3>Timeline (Duration: {timelineData.duration}s)</h3>
      {timelineData.sequences.map((seq, index) => (
        <div key={index} className={styles.sequence}>
          <span>Element: {seq.elementId}</span>
          <div className={styles.keyframes}>
            {seq.keyframes.map((kf, kfIndex) => (
              <div
                key={kfIndex}
                className={styles.keyframe}
                style={{
                  left: `${(kf.time / timelineData.duration) * 100}%`,
                }}
              >
                T:{kf.time.toFixed(1)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};