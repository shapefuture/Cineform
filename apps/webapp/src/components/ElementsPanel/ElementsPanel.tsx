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
  // Keyboard navigation handler for accessibility
  const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    const currentIdx = elements.findIndex((el) => el.id === selectedElementId);
    if (e.key === 'ArrowDown') {
      if (currentIdx < elements.length - 1) {
        onSelectElement(elements[currentIdx + 1].id);
      }
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      if (currentIdx > 0) {
        onSelectElement(elements[currentIdx - 1].id);
      }
      e.preventDefault();
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (currentIdx >= 0) {
        onSelectElement(elements[currentIdx].id);
      }
      e.preventDefault();
    }
  };

  return (
    <aside className={styles.elementsPanel}>
      <h3>Elements</h3>
      <ul
        className={styles.elementList}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label="Animation elements"
        role="listbox"
      >
        {elements.map((el, idx) => (
          <li
            key={el.id}
            className={
              styles.elementListItem +
              ' ' +
              (el.id === selectedElementId ? styles.selected : '')
            }
            onClick={() => onSelectElement(el.id)}
            tabIndex={-1}
            aria-selected={el.id === selectedElementId}
            role="option"
            aria-posinset={idx + 1}
            aria-setsize={elements.length}
          >
            {el.name} ({el.type})
          </li>
        ))}
      </ul>
    </aside>
  );
};