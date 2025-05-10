import { useProjectStore } from '../state/projectStore';
import { useMemo } from 'react';

export function useSelectedElement() {
  const selectedElementId = useProjectStore(s => s.selectedElementId);
  const elements = useProjectStore(s => s.projectData?.elements || []);

  const selectedElement = useMemo(() => {
    try {
      // eslint-disable-next-line no-console
      console.log('[useSelectedElement] Calculating', { elements, selectedElementId });
      const found = elements.find(el => el.id === selectedElementId) || null;
      // eslint-disable-next-line no-console
      console.log('[useSelectedElement] Result', found);
      return found;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[useSelectedElement] Error', err);
      return null;
    }
  }, [elements, selectedElementId]);

  return selectedElement;
}