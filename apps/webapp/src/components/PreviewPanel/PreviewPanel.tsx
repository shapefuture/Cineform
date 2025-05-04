import React, { useRef, useEffect, useState } from 'react';
import { CineforgeEngine } from '@cineform-forge/engine';
import type { ProjectData } from '@cineform-forge/shared-types';
import styles from './PreviewPanel.module.css';

interface PreviewPanelProps {
  projectData: ProjectData | null;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ projectData }) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<CineforgeEngine | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (previewRef.current && !engineRef.current) {
      engineRef.current = new CineforgeEngine(previewRef.current);
      engineRef.current.setPerspective('1000px');
    }
    return () => {
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, []);

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
  }, [projectData]);

  return (
    <div className={styles.previewPanel}>
      <div ref={previewRef} className={styles.previewArea}>
        {isLoading && (
          <div className={styles.loadingOverlay}>Loading...</div>
        )}
      </div>
    </div>
  );
};