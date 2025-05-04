import React from 'react';
import type { AnimationElement } from '@cineform-forge/shared-types';
import styles from './PropertiesPanel.module.css';

interface PropertiesPanelProps {
  selectedElement: AnimationElement | null;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElement,
}) => {
  if (!selectedElement) {
    return (
      <aside className={styles.propertiesPanel}>
        <div>Select an element to see properties.</div>
      </aside>
    );
  }
  return (
    <aside className={styles.propertiesPanel}>
      <h3>Properties: {selectedElement.name}</h3>
      <pre>{JSON.stringify(selectedElement.initialProps, null, 2)}</pre>
    </aside>
  );
};