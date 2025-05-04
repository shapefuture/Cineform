import React, { useRef } from 'react';
import { useProjectStore } from '../../state/projectStore';
import { useTimeline } from '../../hooks/useTimeline';
import styles from './TimelineEditor.module.css';

export const TimelineEditor: React.FC = () => {
  const { timelineData, playbackState } = useTimeline();
  const seek = useProjectStore(s => s.seek);
  const setSelectedElementId = useProjectStore(s => s.setSelectedElementId);
  const selectedElementId = useProjectStore(s => s.selectedElementId);
  const previewPanelRef = useRef<HTMLDivElement | null>(null);

  if (!timelineData) {
    return <div className={styles.timelineEditor}>No timeline data.</div>;
  }

  const playheadPercent = playbackState && timelineData.duration
    ? Math.min(100, Math.max(0, (playbackState.currentTime / timelineData.duration) * 100))
    : 0;

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.min(1, Math.max(0, x / rect.width));
    if (timelineData.duration > 0) {
      const newTime = Math.round(percent * timelineData.duration * 100) / 100;
      seek(newTime);
    }
  };

  return (
    <div className={styles.timelineEditor} ref={previewPanelRef}>
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
          mixBlendMode: 'screen',
        }}
      />
      {timelineData.sequences.map((seq, index) => {
        // Add keyframe logic
        const handleAddKeyframe = (e: React.MouseEvent) => {
          e.stopPropagation();
          const t = window.prompt('Keyframe time (s)?', '0');
          if (!t) return;
          const time = parseFloat(t);
          if (isNaN(time) || time < 0 || time > timelineData.duration) {
            alert('Invalid time.');
            return;
          }
          import('../../state/projectStore').then(({ useProjectStore }) => {
            const projectData = useProjectStore.getState().projectData;
            if (!projectData) return;
            useProjectStore.getState().setProjectData(
              {
                ...projectData,
                timeline: {
                  ...projectData.timeline,
                  sequences: projectData.timeline.sequences.map(s =>
                    s.elementId === seq.elementId
                      ? {
                          ...s,
                          keyframes: [
                            ...s.keyframes,
                            { time, properties: {} },
                          ].sort((a, b) => a.time - b.time),
                        }
                      : s
                  ),
                },
              },
              true
            );
          });
        };

        return (
          <div
            key={index}
            className={styles.sequence}
            style={{
              background: seq.elementId === selectedElementId ? '#273273' : undefined,
              borderRadius: seq.elementId === selectedElementId ? 6 : undefined,
              cursor: 'pointer'
            }}
            onClick={() => setSelectedElementId(seq.elementId)}
          >
            <span>
              Element: {seq.elementId}
              <button
                style={{
                  marginLeft: 8,
                  fontSize: 16,
                  fontWeight: 700,
                  borderRadius: 16,
                  border: 'none',
                  background: '#277cee',
                  color: '#fff',
                  padding: '0.12em 0.72em',
                  cursor: 'pointer',
                }}
                title="Add Keyframe"
                onClick={handleAddKeyframe}
              >
                ＋
              </button>
            </span>
            <div className={styles.keyframes}>
              <div
                className={styles.timelineTrack}
                style={{ cursor: 'pointer' }}
                onClick={handleTimelineClick}
              />
              {seq.keyframes.map((kf, kfIndex) => {
                const handleDeleteKeyframe = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  if (!window.confirm('Delete this keyframe?')) return;
                  import('../../state/projectStore').then(({ useProjectStore }) => {
                    const projectData = useProjectStore.getState().projectData;
                    if (!projectData) return;
                    useProjectStore.getState().setProjectData(
                      {
                        ...projectData,
                        timeline: {
                          ...projectData.timeline,
                          sequences: projectData.timeline.sequences.map(s =>
                            s.elementId === seq.elementId
                              ? {
                                  ...s,
                                  keyframes: s.keyframes.filter((_, i) => i !== kfIndex),
                                }
                              : s
                          ),
                        },
                      },
                      true
                    );
                  });
                };
                const handleEditKeyframe = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  const val = window.prompt(
                    'Edit keyframe properties as JSON:',
                    JSON.stringify(kf.properties, null, 2)
                  );
                  if (!val) return;
                  let parsed: Record<string, any> | null = null;
                  try {
                    parsed = JSON.parse(val);
                  } catch {
                    alert('Invalid JSON');
                    return;
                  }
                  import('../../state/projectStore').then(({ useProjectStore }) => {
                    const projectData = useProjectStore.getState().projectData;
                    if (!projectData) return;
                    useProjectStore.getState().setProjectData(
                      {
                        ...projectData,
                        timeline: {
                          ...projectData.timeline,
                          sequences: projectData.timeline.sequences.map(s =>
                            s.elementId === seq.elementId
                              ? {
                                  ...s,
                                  keyframes: s.keyframes.map((k, i) =>
                                    i === kfIndex
                                      ? { ...k, properties: parsed! }
                                      : k
                                  ),
                                }
                              : s
                          ),
                        },
                      },
                      true
                    );
                  });
                };

                const handleEditKeyframeTime = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  const val = window.prompt(
                    'Edit keyframe time (s):',
                    String(kf.time)
                  );
                  if (!val) return;
                  const newTime = parseFloat(val);
                  if (
                    isNaN(newTime) ||
                    newTime < 0 ||
                    newTime > timelineData.duration
                  ) {
                    alert('Invalid time');
                    return;
                  }
                  import('../../state/projectStore').then(({ useProjectStore }) => {
                    const projectData = useProjectStore.getState().projectData;
                    if (!projectData) return;
                    useProjectStore.getState().setProjectData(
                      {
                        ...projectData,
                        timeline: {
                          ...projectData.timeline,
                          sequences: projectData.timeline.sequences.map(s =>
                            s.elementId === seq.elementId
                              ? {
                                  ...s,
                                  keyframes: s.keyframes
                                    .map((k, i) =>
                                      i === kfIndex
                                        ? { ...k, time: newTime }
                                        : k
                                    )
                                    .sort((a, b) => a.time - b.time),
                                }
                              : s
                          ),
                        },
                      },
                      true
                    );
                  });
                };
                return (
                  <div
                    key={kfIndex}
                    className={styles.keyframe}
                    style={{
                      left: `${(kf.time / timelineData.duration) * 100}%`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title={`t=${kf.time}s`}
                  >
                    {kfIndex + 1}
                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ffe999',
                        fontSize: 15,
                        marginLeft: 3,
                        cursor: 'pointer',
                        padding: 0,
                      }}
                      onClick={handleEditKeyframe}
                      title="Edit Keyframe Properties"
                      tabIndex={-1}
                      aria-label="Edit keyframe"
                    >✎</button>
                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#c3ffb2',
                        fontSize: 15,
                        marginLeft: 3,
                        cursor: 'pointer',
                        padding: 0,
                      }}
                      onClick={handleEditKeyframeTime}
                      title="Edit Keyframe Time"
                      tabIndex={-1}
                      aria-label="Edit keyframe time"
                    >🕑</button>
                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ff9494',
                        fontSize: 15,
                        marginLeft: 3,
                        cursor: 'pointer',
                        padding: 0,
                      }}
                      onClick={handleDeleteKeyframe}
                      title="Delete Keyframe"
                      tabIndex={-1}
                      aria-label="Delete keyframe"
                    >
                      🗑️
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};