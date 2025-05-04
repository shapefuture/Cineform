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
      <ul className={styles.elementList}>
        {elements.map((el) => (
          <li
            key={el.id}
            className={
              styles.elementListItem +
              ' ' +
              (el.id === selectedElementId ? styles.selected : '')
            }
            onClick={() => onSelectElement(el.id)}
            tabIndex={0}
            aria-selected={el.id === selectedElementId}
          >
            {el.name} ({el.type})
          </li>
        ))}
      </ul>
    </aside>
  );
};