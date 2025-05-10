import React from 'react';
import { useProjectStore } from './state/projectStore';
import { AppLayout } from './components/Layout/AppLayout';
import { PreviewPanel } from './components/PreviewPanel/PreviewPanel';
import { TimelineEditor } from './components/TimelineEditor/TimelineEditor';
import { ElementsPanel } from './components/ElementsPanel/ElementsPanel';
import { PropertiesPanel } from './components/PropertiesPanel/PropertiesPanel';
import { AIPrompt } from './components/AIPrompt/AIPrompt';
import './App.css';

import { AISuggestionsPanel } from './components/AISuggestions/AISuggestionsPanel';
import { SimpleFadeInTemplate } from '@cineform-forge/templates-library';

import { useEffect } from 'react';

function App() {
  const {
    projectData,
    selectedElementId,
    isLoadingAi,
    aiError,
    setSelectedElementId,
    generateAnimation,
    loadProject,
    createNewProject,
    undo,
    redo,
    undoStack,
    redoStack,
    setProjectData,
    dirty,
  } = useProjectStore();

  // Warn before unload if unsaved changes exist
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      try {
        // eslint-disable-next-line no-console
        console.log('[App] beforeunload', { dirty });
        if (dirty) {
          e.preventDefault();
          // eslint-disable-next-line no-param-reassign
          e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
          return e.returnValue;
        }
        return undefined;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[App] Error in beforeunload', err);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [dirty]);

  // Global undo/redo keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      try {
        // eslint-disable-next-line no-console
        console.log('[App] keydown', { key: e.key, ctrl: e.ctrlKey, meta: e.metaKey, shift: e.shiftKey });
        // Undo: Ctrl+Z or Cmd+Z (not Shift)
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
          undo();
          e.preventDefault();
        }
        // Redo: Ctrl+Shift+Z or Cmd+Shift+Z
        if ((e.ctrlKey || e.metaKey) && ((e.key === 'z' && e.shiftKey) || e.key === 'y')) {
          redo();
          e.preventDefault();
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[App] Error in keydown handler', err);
      }
    };
    window.addEventListener('keydown', handler, { capture: true });
    return () => window.removeEventListener('keydown', handler, { capture: true });
  }, [undo, redo]);

  // Find currently selected element data
  const selectedElement =
    projectData?.elements.find((el) => el.id === selectedElementId) ?? null;

  // Template loader placeholder
  // const loadTemplate = (template: Omit<ProjectData, 'id' | 'metadata'>) => {
  //   const newProject = {
  //     id: crypto.randomUUID(),
  //     metadata: {
  //       name: 'Loaded Template',
  //       createdAt: new Date().toISOString(),
  //       lastModified: new Date().toISOString(),
  //     },
  //     ...template,
  //     schemaVersion: 1,
  //   };
  //   loadProject(newProject);
  //   alert('Template Loaded!');
  // };

  const handleSave = () => {
    try {
      if (projectData) {
        localStorage.setItem('cineformProject', JSON.stringify(projectData));
        // eslint-disable-next-line no-console
        console.log('[App] Project Saved', projectData);
        alert('Project Saved!');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[App] Error saving project', err);
      alert('Error saving project!');
    }
  };

  const handleLoad = () => {
    try {
      const savedData = localStorage.getItem('cineformProject');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          // TODO: Validate loaded data
          loadProject(parsedData);
          // eslint-disable-next-line no-console
          console.log('[App] Project Loaded', parsedData);
          alert('Project Loaded!');
        } catch (e) {
          alert('Failed to load project.');
          // eslint-disable-next-line no-console
          console.error('[App] Error loading project from localStorage:', e);
        }
      } else {
        alert('No saved project found.');
        // eslint-disable-next-line no-console
        console.warn('[App] No saved project found');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[App] Error in handleLoad', err);
      alert('Error loading project!');
    }
  };

  // Helper: load template and wrap with new id/metadata
  const loadTemplate = (template: Omit<ProjectData, 'id' | 'metadata'>) => {
    try {
      const newProject = {
        id: crypto.randomUUID(),
        metadata: {
          name: 'Loaded Template',
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
        },
        ...template,
        schemaVersion: 1,
      };
      loadProject(newProject);
      // eslint-disable-next-line no-console
      console.log('[App] Template Loaded', newProject);
      alert('Template Loaded!');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[App] Error in loadTemplate', err);
      alert('Error loading template!');
    }
  };

  return (
    <AppLayout
      header={
        <div>
          <h1>
            Cineform Forge{' '}
            {dirty && (
              <span style={{
                color: '#ffd646',
                marginLeft: 14,
                fontSize: '0.8em',
                background: '#563d0b',
                borderRadius: 7,
                padding: '2px 11px',
                fontWeight: 600,
                letterSpacing: 1.1,
              }}>
                unsaved
              </span>
            )}
          </h1>
          <button onClick={createNewProject}>New</button>
          <button
            onClick={() => {
              try {
                if (!projectData) return;
                setProjectData(projectData, false); // true/false: don't push to undo
                // eslint-disable-next-line no-console
                console.log('[App] Save button clicked');
              } catch (err) {
                // eslint-disable-next-line no-console
                console.error('[App] Error in Save button', err);
                alert('Error saving project!');
              }
            }}
            disabled={!dirty}
            title={dirty ? "Save current project" : "All changes saved"}
          >
            Save
          </button>
          <button
            onClick={() => {
              try {
                if (!projectData) return;
                const url = URL.createObjectURL(
                  new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' })
                );
                const a = document.createElement('a');
                a.href = url;
                a.download = 'cineform-project.json';
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }, 100);
                // eslint-disable-next-line no-console
                console.log('[App] Exported project');
              } catch (err) {
                // eslint-disable-next-line no-console
                console.error('[App] Error exporting project', err);
                alert('Error exporting project!');
              }
            }}
            disabled={!projectData}
            title="Export Project (JSON)"
          >
            Export
          </button>
          <button
            onClick={() => {
              try {
                const inp = document.createElement('input');
                inp.type = 'file';
                inp.accept = '.json,application/json';
                inp.onchange = async (event: any) => {
                  try {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    const text = await file.text();
                    try {
                      const data = JSON.parse(text);
                      if (!window.confirm('Importing will replace your current project. Continue?')) return;
                      setProjectData(data, false /* don't push undo */);
                      // eslint-disable-next-line no-console
                      console.log('[App] Imported project', data);
                    } catch {
                      alert('Invalid project file!');
                      // eslint-disable-next-line no-console
                      console.warn('[App] Invalid project file');
                    }
                  } catch (err) {
                    // eslint-disable-next-line no-console
                    console.error('[App] Error reading import file', err);
                    alert('Error importing project!');
                  }
                };
                inp.click();
              } catch (err) {
                // eslint-disable-next-line no-console
                console.error('[App] Error in Import button', err);
                alert('Error importing project!');
              }
            }}
            title="Import Project (JSON)"
          >
            Import
          </button>
          <button onClick={handleLoad}>Load</button>
          <button onClick={() => loadTemplate(SimpleFadeInTemplate)}>
            Load Fade In Template
          </button>
          <button
            onClick={undo}
            disabled={undoStack.length === 0}
            title="Undo (Ctrl+Z)"
            style={{ marginLeft: 15 }}
          >
            ⎌ Undo
          </button>
          <button
            onClick={redo}
            disabled={redoStack.length === 0}
            title="Redo (Ctrl+Shift+Z)"
          >
            ↻ Redo
          </button>
          {aiError && (
            <span style={{ color: 'red', marginLeft: '10px' }}>
              AI Error: {aiError}
            </span>
          )}
        </div>
      }
      leftPanel={<ElementsPanel />}
      mainPanel={<PreviewPanel />}
      rightPanel={<PropertiesPanel />}
      bottomPanel={
        <>
          <AIPrompt onSubmitPrompt={generateAnimation} isLoading={isLoadingAi} />
          <TimelineEditor />
          <AISuggestionsPanel />
        </>
      }
    />
  );
}

export default App;