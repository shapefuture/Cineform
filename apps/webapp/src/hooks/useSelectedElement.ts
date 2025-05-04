import { useProjectStore } from '../state/projectStore';
import { useMemo } from 'react';

export function useSelectedElement() {
  const selectedElementId = useProjectStore(s => s.selectedElementId);
  const elements = useProjectStore(s => s.projectData?.elements || []);

  const selectedElement = useMemo(
    () => elements.find(el => el.id === selectedElementId) || null,
    [elements, selectedElementId]
  );

  return selectedElement;
}