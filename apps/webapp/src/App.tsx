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
      if (dirty) {
        e.preventDefault();
        // eslint-disable-next-line no-param-reassign
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
      return undefined;
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [dirty]);

  // Global undo/redo keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
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
    if (projectData) {
      localStorage.setItem('cineformProject', JSON.stringify(projectData));
      alert('Project Saved!');
    }
  };

  const handleLoad = () => {
    const savedData = localStorage.getItem('cineformProject');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // TODO: Validate loaded data
        loadProject(parsedData);
        alert('Project Loaded!');
      } catch (e) {
        alert('Failed to load project.');
        console.error('Error loading project from localStorage:', e);
      }
    } else {
      alert('No saved project found.');
    }
  };

  // Helper: load template and wrap with new id/metadata
  const loadTemplate = (template: Omit<ProjectData, 'id' | 'metadata'>) => {
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
    alert('Template Loaded!');
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
              if (!projectData) return;
              setProjectData(projectData, false); // true/false: don't push to undo
            }}
            disabled={!dirty}
            title={dirty ? "Save current project" : "All changes saved"}
          >
            Save
          </button>
          <button
            onClick={() => {
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
            }}
            disabled={!projectData}
            title="Export Project (JSON)"
          >
            Export
          </button>
          <button
            onClick={() => {
              const inp = document.createElement('input');
              inp.type = 'file';
              inp.accept = '.json,application/json';
              inp.onchange = async (event: any) => {
                const file = event.target.files?.[0];
                if (!file) return;
                const text = await file.text();
                try {
                  const data = JSON.parse(text);
                  if (!window.confirm('Importing will replace your current project. Continue?')) return;
                  setProjectData(data, true /* push undo */);
                } catch {
                  alert('Invalid project file!');
                }
              };
              inp.click();
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