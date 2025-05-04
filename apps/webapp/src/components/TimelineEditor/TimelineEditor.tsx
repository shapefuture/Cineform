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
      <h3 style={{ margin: '2px 0 8px', fontSize: '1em', color: '#b4cafd', fontWeight: 600 }}>
        Timeline <span style={{ fontWeight: 400, color: '#8ea6ce', fontSize: '0.96em' }}>
        (Duration: {timelineData.duration}s)
        </span>
      </h3>
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