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
    try {
      // eslint-disable-next-line no-console
      console.log('[ElementsPanel] handleKeyDown', e.key);
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
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[ElementsPanel] Error in handleKeyDown', err);
    }
  };

  // Add element handler
  const handleAddElement = () => {
    try {
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
        // eslint-disable-next-line no-console
        console.log('[ElementsPanel] Added element', newElement);
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[ElementsPanel] Error in handleAddElement', err);
    }
  };

  const handleDeleteElement = (id: string) => {
    try {
      // eslint-disable-next-line no-console
      console.log('[ElementsPanel] handleDeleteElement', id);
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
        // eslint-disable-next-line no-console
        console.log('[ElementsPanel] Deleted element', id);
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[ElementsPanel] Error in handleDeleteElement', err);
    }
  };

  // Local state: clipboard
  const CLIPBOARD_KEY = 'cineformElementClipboard';

  const handleCopyElement = (el: typeof elements[0]) => {
    try {
      import('../../state/projectStore').then(({ useProjectStore }) => {
        const projectData = useProjectStore.getState().projectData;
        if (!projectData) return;
        // Copy element + its sequence, if any
        const seq =
          projectData.timeline.sequences.find(s => s.elementId === el.id) ?? null;
        // Save to localStorage (simulate clipboard), as JSON
        localStorage.setItem(
          CLIPBOARD_KEY,
          JSON.stringify({
            element: el,
            sequence: seq,
          })
        );
        // eslint-disable-next-line no-console
        console.log('[ElementsPanel] Copied element to clipboard', el.id);
        alert('Element copied to clipboard!');
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[ElementsPanel] Error in handleCopyElement', err, el);
    }
  };

  const handlePasteElement = () => {
    try {
      import('../../state/projectStore').then(({ useProjectStore }) => {
        const projectData = useProjectStore.getState().projectData;
        if (!projectData) return;
        let raw = null;
        try {
          raw = JSON.parse(localStorage.getItem(CLIPBOARD_KEY) || '');
        } catch {
          alert('Nothing to paste!');
          // eslint-disable-next-line no-console
          console.warn('[ElementsPanel] Clipboard parse failed');
          return;
        }
        if (!raw?.element) {
          alert('Clipboard empty or invalid!');
          // eslint-disable-next-line no-console
          console.warn('[ElementsPanel] Clipboard empty or invalid');
          return;
        }
        const newid = crypto.randomUUID?.() || String(Date.now());
        const newElement = {
          ...raw.element,
          id: newid,
          name: raw.element.name + ' (copy)',
        };
        let newSequences = projectData.timeline.sequences;
        if (raw.sequence) {
          // Copy sequence for new elementId
          newSequences = [
            ...projectData.timeline.sequences,
            { ...raw.sequence, elementId: newid },
          ];
        }
        useProjectStore.getState().setProjectData(
          {
            ...projectData,
            elements: [...projectData.elements, newElement],
            timeline: {
              ...projectData.timeline,
              sequences: newSequences,
            },
          },
          true
        );
        // eslint-disable-next-line no-console
        console.log('[ElementsPanel] Pasted element from clipboard', newElement);
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[ElementsPanel] Error in handlePasteElement', err);
    }
  };

  return (
    <aside className={styles.elementsPanel}>
      <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Elements
        <span>
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
          <button
            style={{
              fontWeight: 700,
              fontSize: 19,
              padding: '0.09em 0.45em',
              background: '#22ac4a',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              marginLeft: 6,
              cursor: 'pointer',
            }}
            onClick={handlePasteElement}
            title="Paste Element"
          >📋</button>
        </span>
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
            <span>
              <button
                onClick={e => {
                  e.stopPropagation();
                  handleCopyElement(el);
                }}
                title="Copy Element"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6eff8b',
                  cursor: 'pointer',
                  fontSize: 18,
                  marginLeft: 6,
                }}
                tabIndex={-1}
                aria-label="Copy element"
              >⧉</button>
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
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
};