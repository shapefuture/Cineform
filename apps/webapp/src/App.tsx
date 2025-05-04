import React from 'react';
import { useProjectStore } from './state/projectStore';
import { AppLayout } from './components/Layout/AppLayout';
import { PreviewPanel } from './components/PreviewPanel/PreviewPanel';
import { TimelineEditor } from './components/TimelineEditor/TimelineEditor';
import { ElementsPanel } from './components/ElementsPanel/ElementsPanel';
import { PropertiesPanel } from './components/PropertiesPanel/PropertiesPanel';
import { AIPrompt } from './components/AIPrompt/AIPrompt';
import './App.css';

// TODO: Import template, once implemented
// import { SimpleFadeInTemplate } from '@cineform-forge/templates-library';

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
  } = useProjectStore();

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

  return (
    <AppLayout
      header={
        <div>
          <h1>Cineform Forge</h1>
          <button onClick={createNewProject}>New</button>
          <button onClick={handleSave} disabled={!projectData}>
            Save
          </button>
          <button onClick={handleLoad}>Load</button>
          {/* <button onClick={() => loadTemplate(SimpleFadeInTemplate)}>Load Fade In Template</button> */}
          {aiError && (
            <span style={{ color: 'red', marginLeft: '10px' }}>
              AI Error: {aiError}
            </span>
          )}
        </div>
      }
      leftPanel={
        <ElementsPanel
          elements={projectData?.elements ?? []}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
        />
      }
      mainPanel={<PreviewPanel projectData={projectData} />}
      rightPanel={<PropertiesPanel selectedElement={selectedElement} />}
      bottomPanel={
        <>
          <AIPrompt onSubmitPrompt={generateAnimation} isLoading={isLoadingAi} />
          <TimelineEditor timelineData={projectData?.timeline ?? null} />
        </>
      }
    />
  );
}

export default App;