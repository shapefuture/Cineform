import { renderHook } from '@testing-library/react';
import { useSelectedElement } from './useSelectedElement';
import * as projectStore from '../state/projectStore';

describe('useSelectedElement', () => {
  const spyLog = jest.spyOn(console, 'log').mockImplementation(() => {});
  const spyError = jest.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns the selected element and logs', () => {
    jest.spyOn(projectStore, 'useProjectStore').mockImplementation((sel: any) =>
      sel({
        selectedElementId: 'el1',
        projectData: {
          elements: [
            { id: 'el1', type: 'shape', name: 'Box', initialProps: {} },
            { id: 'el2', type: 'shape', name: 'Ball', initialProps: {} }
          ]
        }
      })
    );
    const { result } = renderHook(() => useSelectedElement());
    expect(result.current).toEqual(
      expect.objectContaining({ id: 'el1', name: 'Box' })
    );
    expect(spyLog).toHaveBeenCalledWith('[useSelectedElement] Calculating', expect.any(Object));
    expect(spyLog).toHaveBeenCalledWith('[useSelectedElement] Result', expect.any(Object));
  });

  it('returns null if no selected element (logs)', () => {
    jest.spyOn(projectStore, 'useProjectStore').mockImplementation((sel: any) =>
      sel({
        selectedElementId: 'el3',
        projectData: {
          elements: [
            { id: 'el1', type: 'shape', name: 'Box', initialProps: {} }
          ]
        }
      })
    );
    const { result } = renderHook(() => useSelectedElement());
    expect(result.current).toBeNull();
    expect(spyLog).toHaveBeenCalled();
  });

  it('handles error in selection logic (logs error)', () => {
    jest.spyOn(projectStore, 'useProjectStore').mockImplementation(() => {
      throw new Error('fail in store');
    });
    const { result } = renderHook(() => useSelectedElement());
    expect(result.current).toBeNull();
    expect(spyError).toHaveBeenCalledWith('[useSelectedElement] Error', expect.any(Error));
  });
});