import React, { useRef, useEffect, useState } from 'react';
import { CineforgeEngine, type RenderingTarget } from '@cineform-forge/engine';
import type { ProjectData } from '@cineform-forge/shared-types';
import styles from './PreviewPanel.module.css';

interface PreviewPanelProps {
  projectData: ProjectData | null;
}

const RENDERING_OPTIONS: { value: RenderingTarget; label: string }[] = [
  { value: 'dom', label: 'DOM (GSAP)' },
  { value: 'canvas2d', label: 'Canvas 2D' },
];

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ projectData }) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<CineforgeEngine | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [renderingTarget, setRenderingTarget] = useState<RenderingTarget>('dom');

  // Instantiates engine and manages switching rendering targets.
  useEffect(() => {
    if (previewRef.current && !engineRef.current) {
      engineRef.current = new CineforgeEngine(previewRef.current, renderingTarget);
      engineRef.current.setPerspective('1000px');
    }
    return () => {
      engineRef.current?.destroy();
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
      </div>
      <div ref={previewRef} className={styles.previewArea}>
        {isLoading && (
          <div className={styles.loadingOverlay}>Loading...</div>
        )}
      </div>
    </div>
  );
};