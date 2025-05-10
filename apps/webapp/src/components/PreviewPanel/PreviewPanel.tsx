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
    try {
      // eslint-disable-next-line no-console
      console.log('[PreviewPanel] mount');
      if (previewRef.current && !engineRef.current) {
        engineRef.current = new CineforgeEngine(previewRef.current, renderingTarget);
        engineRef.current.setPerspective('1000px');
        attachEngine(engineRef.current);
        // eslint-disable-next-line no-console
        console.log('[PreviewPanel] Engine created/attached', engineRef.current);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[PreviewPanel] Error in mount', err);
    }
    return () => {
      try {
        engineRef.current?.destroy();
        attachEngine(null);
        engineRef.current = null;
        // eslint-disable-next-line no-console
        console.log('[PreviewPanel] Engine destroyed');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[PreviewPanel] Error in unmount', err);
      }
    };
    // Only on mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Switch backend if renderingTarget changes
  useEffect(() => {
    try {
      // eslint-disable-next-line no-console
      console.log('[PreviewPanel] renderingTarget changed', renderingTarget);
      if (engineRef.current && previewRef.current) {
        engineRef.current.setRenderingTarget(renderingTarget);
        // eslint-disable-next-line no-console
        console.log('[PreviewPanel] setRenderingTarget called', renderingTarget);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[PreviewPanel] Error switching renderingTarget', err);
    }
    // Reload projectData (if any)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderingTarget]);

  // Listen for playback updates and set playbackState in store
  useEffect(() => {
    if (!engineRef.current) return;
    // eslint-disable-next-line no-console
    console.log('[PreviewPanel] hook playback listeners');
    const updatePlayback = () => {
      try {
        const state = engineRef.current?.getPlaybackState();
        if (state) setPlaybackState(state);
        // eslint-disable-next-line no-console
        console.log('[PreviewPanel] playback update', state);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[PreviewPanel] Error in updatePlayback', err);
      }
    };
    engineRef.current.on('update', updatePlayback);
    engineRef.current.on('start', updatePlayback);
    engineRef.current.on('complete', updatePlayback);
    return () => {
      try {
        engineRef.current?.off('update', updatePlayback);
        engineRef.current?.off('start', updatePlayback);
        engineRef.current?.off('complete', updatePlayback);
        // eslint-disable-next-line no-console
        console.log('[PreviewPanel] unhook playback listeners');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[PreviewPanel] Error in unhook playback', err);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engineRef.current]);

  useEffect(() => {
    const load = async () => {
      try {
        // eslint-disable-next-line no-console
        console.log('[PreviewPanel] load timeline', { projectData, renderingTarget });
        if (engineRef.current && projectData) {
          setIsLoading(true);
          try {
            await engineRef.current.loadTimeline(
              projectData.timeline,
              projectData.elements
            );
            // eslint-disable-next-line no-console
            console.log('[PreviewPanel] timeline loaded');
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('[PreviewPanel] Error loading timeline', error);
          } finally {
            setIsLoading(false);
          }
        } else if (engineRef.current && !projectData) {
          await engineRef.current.loadTimeline(
            { duration: 0, sequences: [], version: 1 },
            []
          );
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[PreviewPanel] Error in load effect', err);
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
          onChange={e => {
            // eslint-disable-next-line no-console
            console.log('[PreviewPanel] User switched renderer', e.target.value);
            setRenderingTarget(e.target.value as RenderingTarget);
          }}
        >
          {RENDERING_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div style={{ marginLeft: '2.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <button
            style={{ padding: '0.2em 0.9em', fontSize: '1em' }}
            onClick={() => {
              // eslint-disable-next-line no-console
              console.log('[PreviewPanel] Play button clicked');
              play();
            }}
            disabled={!projectData}
            title="Play"
          >▶️</button>
          <button
            style={{ padding: '0.2em 0.8em', fontSize: '1em' }}
            onClick={() => {
              // eslint-disable-next-line no-console
              console.log('[PreviewPanel] Pause button clicked');
              pause();
            }}
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
                try {
                  const time = Number(e.target.value);
                  if (!isNaN(time)) {
                    // eslint-disable-next-line no-console
                    console.log('[PreviewPanel] Seek input changed', time);
                    seek(time);
                  }
                } catch (err) {
                  // eslint-disable-next-line no-console
                  console.error('[PreviewPanel] Error in seek input', err);
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