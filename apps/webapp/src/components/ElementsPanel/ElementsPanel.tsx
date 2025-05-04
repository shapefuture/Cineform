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

  // Add element handler
  const handleAddElement = () => {
    const newId = crypto.randomUUID?.() || String(Date.now());
    const name = window.prompt('Element name?', 'New Box');
    if (!name) return;
    const newElement = {
      id: newId,
      type: 'shape',
      name,
      initialProps: { x: 30, y: 30, width: 50, height: 50, backgroundColor: '#22c', opacity: 1 },
    };
    import('../../state/projectStore').then(({ useProjectStore }) => {
      const projectData = useProjectStore.getState().projectData;
      if (!projectData) return;
      const newSeq = {
        elementId: newElement.id,
        keyframes: [],
      };
      useProjectStore.getState().setProjectData(
        {
          ...projectData,
          elements: [...projectData.elements, newElement],
          timeline: {
            ...projectData.timeline,
            sequences: [...(projectData.timeline.sequences ?? []), newSeq],
          },
        },
        true
      );
    });
  };

  const handleDeleteElement = (id: string) => {
    if (!window.confirm('Delete this element?')) return;
    import('../../state/projectStore').then(({ useProjectStore }) => {
      const projectData = useProjectStore.getState().projectData;
      if (!projectData) return;
      useProjectStore.getState().setProjectData(
        {
          ...projectData,
          elements: projectData.elements.filter(e => e.id !== id),
          timeline: {
            ...projectData.timeline,
            sequences: projectData.timeline.sequences.filter(
              seq => seq.elementId !== id
            ),
          },
        },
        true
      );
    });
  };

  return (
    <aside className={styles.elementsPanel}>
      <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Elements
        <button
          style={{
            fontWeight: 700,
            fontSize: 19,
            padding: '0.09em 0.45em',
            background: '#22375a',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            marginLeft: 6,
            cursor: 'pointer',
          }}
          onClick={handleAddElement}
          title="Add Element"
        >＋</button>
      </h3>
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
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <span>{el.name} ({el.type})</span>
            <button
              onClick={e => {
                e.stopPropagation();
                handleDeleteElement(el.id);
              }}
              title="Delete Element"
              style={{
                background: 'none',
                border: 'none',
                color: '#ff7f7f',
                cursor: 'pointer',
                fontSize: 18,
                marginLeft: 8,
              }}
              tabIndex={-1}
              aria-label="Delete element"
            >🗑️</button>
          </li>
        ))}
      </ul>
    </aside>
  );
};