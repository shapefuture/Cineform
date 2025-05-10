import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { PreviewPanel } from './PreviewPanel';
import * as projectStore from '../../state/projectStore';

jest.mock('@cineform-forge/engine', () => ({
  CineforgeEngine: jest.fn().mockImplementation(() => ({
    setPerspective: jest.fn(),
    setRenderingTarget: jest.fn(),
    loadTimeline: jest.fn().mockResolvedValue(undefined),
    play: jest.fn(),
    pause: jest.fn(),
    seek: jest.fn(),
    getPlaybackState: jest.fn().mockReturnValue({ currentTime: 0, progress: 0, isPlaying: false, rate: 1, duration: 2 }),
    on: jest.fn(),
    off: jest.fn(),
    destroy: jest.fn()
  }))
}));

describe('PreviewPanel', () => {
  const spyLog = jest.spyOn(console, 'log').mockImplementation(() => {});
  const spyError = jest.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(projectStore, 'useProjectStore').mockImplementation((selector: any) =>
      selector({
        projectData: {
          timeline: { duration: 2, sequences: [], version: 1 },
          elements: []
        },
        setPlaybackState: jest.fn(),
        playbackState: { currentTime: 0, progress: 0, isPlaying: false, rate: 1, duration: 2 },
        attachEngine: jest.fn(),
        play: jest.fn(),
        pause: jest.fn(),
        seek: jest.fn()
      })
    );
  });

  it('renders and mounts engine, logs', () => {
    render(<PreviewPanel />);
    expect(screen.getByLabelText(/Renderer/)).toBeInTheDocument();
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('mount'));
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('Engine created/attached'), expect.anything());
  });

  it('handles renderer switch and logs', () => {
    render(<PreviewPanel />);
    fireEvent.change(screen.getByLabelText(/Renderer/), { target: { value: 'canvas2d' } });
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('User switched renderer'), 'canvas2d');
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('setRenderingTarget'), 'canvas2d');
  });

  it('play/pause/seek logs', () => {
    render(<PreviewPanel />);
    fireEvent.click(screen.getByTitle('Play'));
    fireEvent.click(screen.getByTitle('Pause'));
    fireEvent.change(screen.getByLabelText(/t:/), { target: { value: '1' } });
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('Play button clicked'));
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('Pause button clicked'));
    expect(spyLog).toHaveBeenCalledWith(expect.stringContaining('Seek input changed'), 1);
  });

  it('handles error in timeline loading', async () => {
    // Force loadTimeline to throw
    (require('@cineform-forge/engine').CineforgeEngine as any).mockImplementationOnce(() => ({
      setPerspective: jest.fn(),
      setRenderingTarget: jest.fn(),
      loadTimeline: jest.fn().mockRejectedValue(new Error('fail timeline')),
      play: jest.fn(),
      pause: jest.fn(),
      seek: jest.fn(),
      getPlaybackState: jest.fn().mockReturnValue({ currentTime: 0, progress: 0, isPlaying: false, rate: 1, duration: 2 }),
      on: jest.fn(),
      off: jest.fn(),
      destroy: jest.fn()
    }));
    render(<PreviewPanel />);
    await waitFor(() => {
      expect(spyError).toHaveBeenCalledWith(
        expect.stringContaining('Error loading timeline'),
        expect.anything()
      );
    });
  });
});