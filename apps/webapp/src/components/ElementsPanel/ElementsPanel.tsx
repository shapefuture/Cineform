import React from 'react';
import styles from './ElementsPanel.module.css';
import { useProjectStore } from '../../state/projectStore';

/**
 * ElementsPanel uses global store, no props required.
 */
export const ElementsPanel: React.FC = () => {
  const elements = useProjectStore(s => s.projectData?.elements || []);
  const selectedElementId = useProjectStore(s => s.selectedElementId);
  const setSelectedElementId = useProjectStore(s => s.setSelectedElementId);

  // Keyboard navigation handler for accessibility
  const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    const currentIdx = elements.findIndex((el) => el.id === selectedElementId);
    if (e.key === 'ArrowDown') {
      if (currentIdx < elements.length - 1) {
        setSelectedElementId(elements[currentIdx + 1].id);
      }
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      if (currentIdx > 0) {
        setSelectedElementId(elements[currentIdx - 1].id);
      }
      e.preventDefault();
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (currentIdx >= 0) {
        setSelectedElementId(elements[currentIdx].id);
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
            onClick={() => setSelectedElementId(el.id)}
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