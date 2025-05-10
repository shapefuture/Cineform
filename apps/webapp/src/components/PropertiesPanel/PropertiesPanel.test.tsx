import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { PropertiesPanel } from './PropertiesPanel';
import * as useSelectedElementHook from '../../hooks/useSelectedElement';

describe('PropertiesPanel', () => {
  const spyLog = jest.spyOn(console, 'log').mockImplementation(() => {});
  const spyError = jest.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders prompt if no element selected', () => {
    jest.spyOn(useSelectedElementHook, 'useSelectedElement').mockReturnValue(null);
    render(<PropertiesPanel />);
    expect(screen.getByText(/Select an element/)).toBeInTheDocument();
  });

  it('renders form with element properties', () => {
    jest.spyOn(useSelectedElementHook, 'useSelectedElement').mockReturnValue({
      id: 'el1',
      name: 'TestEl',
      initialProps: { x: 20, color: 'blue' }
    });
    render(<PropertiesPanel />);
    expect(screen.getByText(/Properties: TestEl/)).toBeInTheDocument();
    expect(screen.getByDisplayValue('20')).toBeInTheDocument();
    expect(screen.getByDisplayValue('blue')).toBeInTheDocument();
  });

  it('handles property change and logs', async () => {
    jest.spyOn(useSelectedElementHook, 'useSelectedElement').mockReturnValue({
      id: 'el1',
      name: 'TestEl',
      initialProps: { x: 20 }
    });
    render(<PropertiesPanel />);
    const input = screen.getByDisplayValue('20');
    // Simulate change
    fireEvent.change(input, { target: { value: '30' } });
    await waitFor(() => {
      expect(spyLog).toHaveBeenCalledWith(
        expect.stringContaining('property change'),
        expect.objectContaining({ key: 'x' })
      );
      expect(spyLog).toHaveBeenCalledWith(
        expect.stringContaining('setProjectData'),
        expect.objectContaining({ key: 'x', newVal: 30 })
      );
    });
  });

  it('handles invalid number input (logs error)', async () => {
    jest.spyOn(useSelectedElementHook, 'useSelectedElement').mockReturnValue({
      id: 'el1',
      name: 'TestEl',
      initialProps: { x: 20 }
    });
    render(<PropertiesPanel />);
    const input = screen.getByDisplayValue('20');
    fireEvent.change(input, { target: { value: 'notANumber' } });
    await waitFor(() =>
      expect(spyError).toHaveBeenCalledWith(
        expect.stringContaining('Invalid number input'),
        'notANumber'
      )
    );
  });

  it('handles error in projectStore.setProjectData (logs)', async () => {
    jest.spyOn(useSelectedElementHook, 'useSelectedElement').mockReturnValue({
      id: 'el1',
      name: 'TestEl',
      initialProps: { x: 20 }
    });
    // Mock import to throw
    jest.spyOn(global, 'import' as any).mockRejectedValueOnce(new Error('fail'));
    render(<PropertiesPanel />);
    const input = screen.getByDisplayValue('20');
    fireEvent.change(input, { target: { value: '25' } });
    await waitFor(() =>
      expect(spyError).toHaveBeenCalled()
    );
  });
});