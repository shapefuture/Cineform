import React from 'react';
import type { AnimationElement } from '@cineform-forge/shared-types';
import styles from './ElementsPanel.module.css';

interface ElementsPanelProps {
  elements: AnimationElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
}

export const ElementsPanel: React.FC<ElementsPanelProps> = ({
  elements,
  selectedElementId,
  onSelectElement,
}) => {
  return (
    <aside className={styles.elementsPanel}>
      <h3>Elements</h3>
      <ul>
        {elements.map((el) => (
          <li
            key={el.id}
            className={el.id === selectedElementId ? styles.selected : ''}
            onClick={() => onSelectElement(el.id)}
          >
            {el.name} ({el.type}) - ID: {el.id.substring(0, 4)}...
          </li>
        ))}
      </ul>
    </aside>
  );
};