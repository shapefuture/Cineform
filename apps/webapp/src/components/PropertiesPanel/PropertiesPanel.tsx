import React from 'react';
import styles from './PropertiesPanel.module.css';
import { useSelectedElement } from '../../hooks/useSelectedElement';

export const PropertiesPanel: React.FC = () => {
  const selectedElement = useSelectedElement();

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