import React, { useRef, useEffect, useState } from 'react';
import { CineforgeEngine, type RenderingTarget } from '@cineform-forge/engine';
import styles from './PreviewPanel.module.css';
import { useProjectStore } from '../../state/projectStore'; from '../../state/projectStore';

interface PreviewPanelProps {
  projectData: ProjectData | null;
}

const RENDERING_OPTIONS: { value: RenderingTarget; label: string }[] = [
  { value: 'dom', label: 'DOM (GSAP)' },
  { value: 'canvas2d', label: 'Canvas 2D' },
];

export const PreviewPanel: React.FC = () => {
  const projectData = useProjectStore(s => s.projectData);
  const previewRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<CineforgeEngine | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [renderingTarget, setRenderingTarget] = useState<RenderingTarget>('dom');
  const setPlaybackState = useProjectStore(s => s.setPlaybackState);
  const playbackState = useProjectStore(s => s.playbackState);
  const attachEngine = useProjectStore(s => s.attachEngine);
  const play = useProjectStore(s => s.play);
  const pause = useProjectStore(s => s.pause);
  const seek = useProjectStore(s => s.seek);

  // Instantiates engine and manages switching rendering targets.
  useEffect(() => {
    if (previewRef.current && !engineRef.current) {
      engineRef.current = new CineforgeEngine(previewRef.current, renderingTarget);
      engineRef.current.setPerspective('1000px');
      attachEngine(engineRef.current);
    }
    return () => {
      engineRef.current?.destroy();
      attachEngine(null);
      engineRef.current = null;
    };
    // Only on mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Switch backend if renderingTarget changes
  useEffect(() => {
    if (engineRef.current && previewRef.current) {
      engineRef.current.setRenderingTarget(renderingTarget);
    }
    // Reload projectData (if any)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderingTarget]);

  // Listen for playback updates and set playbackState in store
  useEffect(() => {
    if (!engineRef.current) return;
    const updatePlayback = () => {
      const state = engineRef.current?.getPlaybackState();
      if (state) setPlaybackState(state);
    };
    engineRef.current.on('update', updatePlayback);
    engineRef.current.on('start', updatePlayback);
    engineRef.current.on('complete', updatePlayback);
    return () => {
      engineRef.current?.off('update', updatePlayback);
      engineRef.current?.off('start', updatePlayback);
      engineRef.current?.off('complete', updatePlayback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engineRef.current]);

  useEffect(() => {
    const load = async () => {
      if (engineRef.current && projectData) {
        setIsLoading(true);
        try {
          await engineRef.current.loadTimeline(
            projectData.timeline,
            projectData.elements
          );
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error loading timeline:', error);
        } finally {
          setIsLoading(false);
        }
      } else if (engineRef.current && !projectData) {
        await engineRef.current.loadTimeline(
          { duration: 0, sequences: [], version: 1 },
          []
        );
      }
    };
    load();
  }, [projectData, renderingTarget]);

  return (
    <div className={styles.previewPanel}>
      <div className={styles.previewHeader}>
        <label htmlFor="renderingTarget">Renderer:</label>
        <select
          id="renderingTarget"
          value={renderingTarget}
          onChange={e => setRenderingTarget(e.target.value as RenderingTarget)}
        >
          {RENDERING_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div style={{ marginLeft: '2.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <button
            style={{ padding: '0.2em 0.9em', fontSize: '1em' }}
            onClick={() => play()}
            disabled={!projectData}
            title="Play"
          >▶️</button>
          <button
            style={{ padding: '0.2em 0.8em', fontSize: '1em' }}
            onClick={() => pause()}
            disabled={!projectData}
            title="Pause"
          >⏸️</button>
          <label style={{ marginLeft: 10, fontWeight: 500, color: '#eee' }}>
            t:
            <input
              type="number"
              value={playbackState?.currentTime?.toFixed(2) ?? '0'}
              step="0.05"
              min={0}
              max={projectData?.timeline?.duration ?? 10}
              style={{ width: 58, marginLeft: 2 }}
              onChange={e => {
                const time = Number(e.target.value);
                if (!isNaN(time)) {
                  seek(time);
                }
              }}
              disabled={!projectData}
            />
            / {projectData?.timeline?.duration ?? '?'}s
          </label>
        </div>
      </div>
      <div ref={previewRef} className={styles.previewArea}>
        {isLoading && (
          <div className={styles.loadingOverlay}>Loading...</div>
        )}
      </div>
    </div>
  );
};