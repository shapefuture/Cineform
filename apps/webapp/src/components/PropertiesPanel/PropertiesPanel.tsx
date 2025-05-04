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
      <form
        onSubmit={e => e.preventDefault()}
        style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        {Object.entries(selectedElement.initialProps).map(([key, value]) => (
          <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ minWidth: 72 }}>{key}</span>
            <input
              value={value}
              type={typeof value === 'number' ? 'number' : 'text'}
              onChange={e => {
                // Mutable editing: update this element only
                const newVal =
                  typeof value === 'number'
                    ? parseFloat(e.target.value)
                    : e.target.value;
                // Read project state and patch
                // Find element in elements, replace its initialProps
                import('../../state/projectStore').then(({ useProjectStore }) => {
                  const projectData = useProjectStore
                    .getState()
                    .projectData;
                  if (!projectData) return;
                  const newElements = projectData.elements.map(el =>
                    el.id === selectedElement.id
                      ? {
                          ...el,
                          initialProps: {
                            ...el.initialProps,
                            [key]: newVal,
                          },
                        }
                      : el
                  );
                  // Push with undo support
                  useProjectStore
                    .getState()
                    .setProjectData(
                      { ...projectData, elements: newElements },
                      true
                    );
                });
              }}
              style={{
                flex: 1,
                padding: 2,
                background: '#262b3a',
                color: '#e1eef9',
                border: '1px solid #314079',
                borderRadius: 4,
              }}
            />
          </label>
        ))}
      </form>
    </aside>
  );
};